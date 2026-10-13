var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name2);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __using = (stack, value, async) => {
  if (value != null) {
    if (typeof value !== "object" && typeof value !== "function") __typeError("Object expected");
    var dispose, inner;
    if (async) dispose = value[__knownSymbol("asyncDispose")];
    if (dispose === void 0) {
      dispose = value[__knownSymbol("dispose")];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") __typeError("Object not disposable");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    stack.push([async, dispose, value]);
  } else if (async) {
    stack.push([async]);
  }
  return value;
};
var __callDispose = (stack, error, hasError) => {
  var E = typeof SuppressedError === "function" ? SuppressedError : function(e, s, m, _) {
    return _ = Error(m), _.name = "SuppressedError", _.error = e, _.suppressed = s, _;
  };
  var fail = (e) => error = hasError ? new E(e, error, "An error was suppressed during disposal") : (hasError = true, e);
  var next = (it) => {
    while (it = stack.pop()) {
      try {
        var result = it[1] && it[1].call(it[2]);
        if (it[0]) return Promise.resolve(result).then(next, (e) => (fail(e), next()));
      } catch (e) {
        fail(e);
      }
    }
    if (hasError) throw error;
  };
  return next();
};

// src/provider-catalogs.mjs
var ERROR_CODES = /* @__PURE__ */ new Set(["catalog-login-required", "catalog-key-override", "catalog-settings-incompatible", "catalog-account-changed", "catalog-rate-limited", "catalog-refresh-failed", "catalog-refresh-unsupported"]);
var copyKey = (value) => typeof value === "string" && /^[A-Za-z][A-Za-z0-9]{0,79}$/.test(value) ? value : void 0;
var CatalogRefreshError = class extends Error {
  constructor(code) {
    super(ERROR_CODES.has(code) ? code : "catalog-refresh-failed");
    this.code = this.message;
  }
};
var ProviderCatalogs = class {
  constructor(providers = {}) {
    this.providers = new Map(Object.entries(providers));
    this.pending = /* @__PURE__ */ new Map();
    this.closed = false;
  }
  revision() {
    return [...this.providers.values()].reduce((sum, { session }) => sum + (session.version ?? 0), 0);
  }
  catalog(provider) {
    return this.providers.get(provider)?.session.catalog?.(provider);
  }
  validate(provider) {
    return this.providers.get(provider)?.session.validate?.();
  }
  onLogin(provider) {
    this.providers.get(provider)?.session.invalidate?.();
  }
  authorizeModel(provider, model, profile2) {
    return this.providers.get(provider)?.authorizeModel?.(model, profile2);
  }
  state(provider, models = []) {
    const entry = this.providers.get(provider);
    if (!entry?.session.refresh) return { canRefresh: false };
    const view = entry.presentation?.(models) ?? {};
    const message = copyKey(view.status?.message);
    const detail = typeof view.status?.detail === "string" ? view.status.detail.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 100) : void 0;
    return {
      canRefresh: true,
      ...message ? { status: { message, ...detail ? { detail } : {} } } : {},
      notes: (Array.isArray(view.notes) ? view.notes : []).map(copyKey).filter(Boolean).slice(0, 10),
      errors: Object.fromEntries(Object.entries(entry.errors ?? {}).flatMap(([code, key]) => ERROR_CODES.has(code) && copyKey(key) ? [[code, key]] : []))
    };
  }
  refresh(provider) {
    if (this.closed) return Promise.reject(new CatalogRefreshError("catalog-refresh-failed"));
    const entry = this.providers.get(provider);
    if (!entry?.session.refresh) return Promise.reject(new CatalogRefreshError("catalog-refresh-unsupported"));
    if (this.pending.has(provider)) return this.pending.get(provider);
    const pending = Promise.resolve().then(() => {
      if (this.closed) throw new CatalogRefreshError("catalog-refresh-failed");
      return entry.session.refresh();
    }).then(() => {
      if (this.closed) throw new CatalogRefreshError("catalog-refresh-failed");
    }).catch((error) => {
      if (error instanceof CatalogRefreshError) throw error;
      const code = entry.errorCodes?.[error?.code];
      throw new CatalogRefreshError(code ?? "catalog-refresh-failed");
    }).finally(() => this.pending.delete(provider));
    this.pending.set(provider, pending);
    return pending;
  }
  dispose() {
    this.closed = true;
    for (const { session } of this.providers.values()) session.dispose?.();
  }
};

// src/broker.mjs
import { randomUUID } from "node:crypto";
var KEY_PATTERN = /^llm-pi-ai\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
var LIVE = "running";
var NS = "dsh-pi-login";
var MAX_TIMER_DELAY_MS = 2147483647;
var LoginError = class extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
};
function requireString(value, limit = 16384) {
  if (typeof value !== "string" || value.length === 0 || value.length > limit) throw new LoginError("invalid-request");
  return value;
}
function publicNotice(notice) {
  const result = { message: String(notice.message).slice(0, 2048) };
  if (typeof notice.url === "string") {
    try {
      const url = new URL(notice.url);
      if (url.protocol === "https:" || url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) result.url = url.href;
    } catch {
    }
  }
  if (typeof notice.code === "string") result.code = notice.code.slice(0, 256);
  return result;
}
var PiLoginBroker = class {
  constructor(authorization, credentials, settings, { timeoutMs = 6e5, expiryGraceMs = 6e4, retentionMs = 6e4, catalog, catalogs } = {}) {
    this.authorization = authorization;
    this.credentials = credentials;
    this.settings = settings;
    this.timeoutMs = timeoutMs;
    this.expiryGraceMs = expiryGraceMs;
    this.retentionMs = retentionMs;
    this.catalog = catalog;
    this.catalogs = catalogs;
    this.attempts = /* @__PURE__ */ new Map();
    this.closed = false;
  }
  async list() {
    const section = this.section();
    return Promise.all(this.authorization.list().filter((entry) => KEY_PATTERN.test(entry.key)).map(async (entry) => {
      const credential = await this.credentials.describeRecord(entry.key);
      return {
        key: entry.key,
        provider: entry.key.slice("llm-pi-ai/".length),
        label: entry.label,
        methods: entry.methods.map((method) => ({ id: method.id, label: method.label })),
        inFlight: entry.inFlight,
        configured: credential.configured,
        writable: credential.writable,
        managed: Object.hasOwn(section?.value?.providers ?? {}, entry.key.slice("llm-pi-ai/".length)),
        enabled: Object.hasOwn(section?.value?.providers ?? {}, entry.key.slice("llm-pi-ai/".length)) && section.value.providers[entry.key.slice("llm-pi-ai/".length)].enabled !== false
      };
    }));
  }
  section() {
    return this.settings.describe({ redactSecrets: true }).find((row) => row.ns === NS);
  }
  models(key) {
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key) || !this.catalog) throw new LoginError("invalid-request");
    const provider = key.slice("llm-pi-ai/".length);
    const section = this.section();
    const profile2 = section?.value?.providers?.[provider] ?? {};
    const models = this.catalog(provider, profile2);
    return {
      revision: section?.revision,
      enabled: Object.hasOwn(section?.value?.providers ?? {}, provider) && profile2.enabled !== false,
      refresh: this.catalogs?.state(provider, models) ?? { canRefresh: false },
      models: models.map((model) => ({
        id: model.id,
        name: model.name,
        enabled: model.enabled ?? !profile2.disabledModels?.includes(model.id),
        fast: model.serviceTier === "priority",
        ...model.discovered ? { discovered: true, capabilityUnverified: model.capabilityUnverified === true } : {}
      }))
    };
  }
  async setModel(key, model, enabled, revision) {
    await this.validateModels(key);
    if (typeof enabled !== "boolean" || !Number.isSafeInteger(revision)) throw new LoginError("invalid-request");
    const current = this.models(key);
    const choice = current.models.find((entry) => entry.id === model);
    if (!choice) throw new LoginError("invalid-request");
    if (current.revision !== revision) throw new LoginError("settings-changed");
    const provider = key.slice("llm-pi-ai/".length);
    const profile2 = this.section().value?.providers?.[provider];
    if (!profile2) throw new LoginError("not-enabled");
    const field = choice.fast ? "enabledFastModels" : choice.discovered ? "enabledDiscoveredModels" : "disabledModels";
    const selected = new Set(profile2[field] ?? []);
    if (choice.fast || choice.discovered ? enabled : !enabled) selected.add(model);
    else selected.delete(model);
    const changes = { [field]: [...selected] };
    if (choice.discovered) {
      const disabled = new Set(profile2.disabledModels ?? []);
      if (enabled) disabled.delete(model);
      else disabled.add(model);
      changes.disabledModels = [...disabled];
    }
    await this.settings.update(NS, { providers: { [provider]: changes } }, revision);
    return { saved: true };
  }
  provider(key) {
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key)) throw new LoginError("invalid-request");
    return key.slice("llm-pi-ai/".length);
  }
  async validateModels(key) {
    await this.catalogs?.validate(this.provider(key));
  }
  async refreshModels(key) {
    const provider = this.provider(key);
    if (this.closed) throw new LoginError("unavailable");
    if (!this.catalogs) throw new LoginError("catalog-refresh-unsupported");
    try {
      await this.catalogs.refresh(provider);
      return this.models(key);
    } catch (error) {
      throw new LoginError(error instanceof CatalogRefreshError ? error.code : "catalog-refresh-failed");
    }
  }
  async setProvider(key, enabled, revision) {
    if (typeof enabled !== "boolean" || !Number.isSafeInteger(revision) || !KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key)) throw new LoginError("invalid-request");
    const section = this.section();
    if (!section || section.revision !== revision) throw new LoginError("settings-changed");
    const provider = key.slice("llm-pi-ai/".length);
    const profile2 = section.value?.providers?.[provider];
    if (!profile2 && !(await this.credentials.describeRecord(key)).configured) throw new LoginError("not-connected");
    await this.settings.update(NS, { providers: { [provider]: { enabled } } }, revision);
    return { saved: true };
  }
  start(key, method) {
    if (this.closed) throw new LoginError("unavailable");
    if (!KEY_PATTERN.test(requireString(key, 200))) throw new LoginError("invalid-request");
    const entry = this.authorization.describe(key);
    if (!entry || !entry.methods.some((option) => option.id === method)) throw new LoginError("unsupported-method");
    if (entry.inFlight || [...this.attempts.values()].some((attempt2) => attempt2.key === key && attempt2.status === LIVE)) throw new LoginError("busy");
    if (this.attempts.size >= 32) throw new LoginError("busy");
    const ticket = randomUUID();
    const attempt = { key, ticket, status: LIVE, controller: new AbortController(), prompt: void 0, notice: void 0 };
    this.attempts.set(ticket, attempt);
    this.armTimeout(attempt, this.timeoutMs);
    attempt.done = Promise.resolve().then(() => this.authorization.begin({
      key,
      method,
      signal: attempt.controller.signal,
      interaction: {
        notify: (notice) => this.notify(attempt, notice),
        prompt: (prompt) => this.ask(attempt, prompt)
      }
    })).then((outcome) => {
      attempt.status = outcome.status === "authorized" ? "authorized" : "cancelled";
      if (attempt.status === "authorized") attempt.reason = void 0;
    }, (error) => {
      attempt.status = attempt.controller.signal.aborted ? "cancelled" : "failed";
      if (!attempt.controller.signal.aborted && error instanceof Error && /^Device flow timed out(?:$| after one or more slow_down responses\.)/.test(error.message)) attempt.reason = "provider-expired";
    }).finally(() => {
      clearTimeout(attempt.timer);
      this.clearPrompt(attempt, new LoginError("cancelled"));
      attempt.notice = void 0;
      attempt.timer = setTimeout(() => this.attempts.delete(ticket), this.retentionMs);
      attempt.timer.unref?.();
    });
    return { ticket };
  }
  armTimeout(attempt, delayMs) {
    clearTimeout(attempt.timer);
    attempt.timer = setTimeout(() => {
      void this.cancel(attempt.ticket, "timeout").catch(() => {
      });
    }, delayMs);
    attempt.timer.unref?.();
  }
  notify(attempt, notice) {
    if (attempt.status !== LIVE || attempt.controller.signal.aborted || this.closed) return;
    attempt.notice = publicNotice(notice);
    const expires = notice.expiresInSeconds;
    if (typeof expires !== "number" || !Number.isFinite(expires) || expires <= 0) return;
    const delayMs = Math.max(this.timeoutMs, expires * 1e3 + this.expiryGraceMs);
    if (delayMs <= MAX_TIMER_DELAY_MS) this.armTimeout(attempt, delayMs);
  }
  attempt(ticket) {
    const result = this.attempts.get(requireString(ticket, 100));
    if (!result) throw new LoginError("expired");
    return result;
  }
  snapshot(ticket) {
    const attempt = this.attempt(ticket);
    return {
      status: attempt.status,
      ...attempt.reason === void 0 ? {} : { reason: attempt.reason },
      ...attempt.notice === void 0 ? {} : { notice: attempt.notice },
      ...attempt.prompt === void 0 ? {} : { prompt: attempt.prompt.view }
    };
  }
  ask(attempt, prompt) {
    if (attempt.controller.signal.aborted || prompt.signal?.aborted) return Promise.reject(new LoginError("cancelled"));
    this.clearPrompt(attempt, new LoginError("replaced"));
    const id = randomUUID();
    const view = { id, kind: prompt.kind, message: String(prompt.message).slice(0, 2048) };
    if (!["secret", "text", "select"].includes(view.kind)) return Promise.reject(new LoginError("unsupported-prompt"));
    if (prompt.kind === "select") view.options = prompt.options.map((option) => ({ id: String(option.id), label: String(option.label), ...option.description === void 0 ? {} : { description: String(option.description) } }));
    else if (typeof prompt.placeholder === "string") view.placeholder = prompt.placeholder.slice(0, 1024);
    return new Promise((resolve2, reject) => {
      const abort = () => {
        if (attempt.prompt?.view.id === id) this.clearPrompt(attempt, new LoginError("withdrawn"));
      };
      attempt.prompt = { view, resolve: resolve2, reject, cleanup: () => {
        prompt.signal?.removeEventListener("abort", abort);
        attempt.controller.signal.removeEventListener("abort", abort);
      } };
      prompt.signal?.addEventListener("abort", abort, { once: true });
      attempt.controller.signal.addEventListener("abort", abort, { once: true });
    });
  }
  clearPrompt(attempt, error) {
    const prompt = attempt.prompt;
    attempt.prompt = void 0;
    prompt?.cleanup();
    if (error) prompt?.reject(error);
    return prompt;
  }
  answer(ticket, id, value) {
    const attempt = this.attempt(ticket);
    const prompt = attempt.prompt;
    if (attempt.status !== LIVE || !prompt || prompt.view.id !== id) throw new LoginError("expired-prompt");
    if (typeof value !== "string" || value.length > 16384) throw new LoginError("invalid-request");
    if (prompt.view.kind === "select" && !prompt.view.options.some((option) => option.id === value)) throw new LoginError("invalid-choice");
    this.clearPrompt(attempt).resolve(value);
    return { accepted: true };
  }
  async cancel(ticket, reason) {
    const attempt = this.attempt(ticket);
    if (attempt.status === LIVE && !attempt.controller.signal.aborted) {
      attempt.reason = reason;
      attempt.controller.abort();
      this.clearPrompt(attempt, new LoginError("cancelled"));
    }
    await attempt.done;
    return { status: attempt.status };
  }
  async enable(key) {
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key)) throw new LoginError("invalid-request");
    if (!(await this.credentials.describeRecord(key)).configured) throw new LoginError("not-connected");
    const provider = key.slice("llm-pi-ai/".length);
    const section = this.section();
    if (!section) throw new LoginError("unavailable");
    const existing = section.value?.providers?.[provider];
    if (existing?.apiKeyEnv) throw new LoginError("api-key-override");
    if (existing && existing.enabled !== false) return { enabled: true };
    await this.settings.update(NS, { providers: { [provider]: { enabled: true } } }, section.revision);
    return { enabled: true };
  }
  async useLogin(key) {
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key)) throw new LoginError("invalid-request");
    if (!(await this.credentials.describeRecord(key)).configured) throw new LoginError("not-connected");
    const section = this.section();
    if (!section) throw new LoginError("unavailable");
    const provider = key.slice("llm-pi-ai/".length);
    await this.settings.mutate(NS, [{ op: "unset", path: ["providers", provider, "apiKeyEnv"] }], section.revision);
    return this.enable(key);
  }
  async dispose() {
    this.closed = true;
    const pending = [];
    for (const attempt of this.attempts.values()) {
      clearTimeout(attempt.timer);
      attempt.controller.abort();
      this.clearPrompt(attempt, new LoginError("cancelled"));
      pending.push(attempt.done);
    }
    await Promise.allSettled(pending);
    for (const attempt of this.attempts.values()) clearTimeout(attempt.timer);
    this.attempts.clear();
  }
};
async function dispatch(broker, method, payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new LoginError("invalid-request");
  switch (method) {
    case "list":
      return broker.list();
    case "start":
      return broker.start(payload.key, payload.method);
    case "state":
      return broker.snapshot(payload.ticket);
    case "answer":
      return broker.answer(payload.ticket, payload.id, payload.value);
    case "cancel":
      return broker.cancel(payload.ticket);
    case "enable":
      return broker.enable(payload.key);
    case "models":
      await broker.validateModels(payload.key);
      return broker.models(payload.key);
    case "refresh-models":
      return broker.refreshModels(payload.key);
    case "set-model":
      return broker.setModel(payload.key, payload.model, payload.enabled, payload.revision);
    case "set-provider":
      return broker.setProvider(payload.key, payload.enabled, payload.revision);
    case "use-login":
      return broker.useLogin(payload.key);
    default:
      throw new LoginError("invalid-request");
  }
}

// src/routes.mjs
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// src/updates.mjs
import { createHash, randomUUID as randomUUID3 } from "node:crypto";
import { mkdir, mkdtemp, writeFile, readFile, rename, lstat } from "node:fs/promises";
import { join, resolve, sep, basename, win32 } from "node:path";
import { gunzipSync } from "node:zlib";

// src/update-request-id.ts
import { randomUUID as randomUUID2 } from "node:crypto";
function updateRequestId(value = randomUUID2()) {
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(value)) throw new Error("invalid-request");
  return value;
}

// package.json
var package_default = {
  name: "@local/dsh-pi-login",
  version: "0.5.0",
  description: "DeepSeek Harness\u7528\u306EPi\u30ED\u30B0\u30A4\u30F3\u3068\u30E2\u30C7\u30EB\u7BA1\u7406",
  type: "module",
  license: "MIT",
  exports: {
    ".": "./dist/index.js",
    "./client": "./dist/client.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  files: [
    "dist",
    "locale",
    "icon.svg",
    "cordis.patch.yml",
    "README.md",
    "LICENSE",
    "docs",
    "src/runtime/UPSTREAM.md",
    "upstream.json"
  ],
  dsh: {
    bundle: {
      patch: "./cordis.patch.yml"
    },
    client: {
      platform: "web",
      inject: [
        "@deepseek-ai/dsh-client-ui-settings-models",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale"
      ],
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom"
      ]
    }
  },
  dependencies: {
    "@earendil-works/pi-ai": "1.1.0"
  },
  engines: {
    node: ">=22.19.0"
  },
  peerDependencies: {
    "@deepseek-ai/cordis": "4.0.5-alpha.1",
    "@deepseek-ai/dsh-attachment": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-brand": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-credentials": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-launch-environment": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-llm": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-timeout": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-util-values": "0.2.1-alpha.2",
    "@deepseek-ai/schemastery": "3.18.5-alpha.1",
    "@deepseek-ai/dsh-app-boot": "0.2.1-alpha.2"
  },
  peerDependenciesMeta: {
    "@deepseek-ai/cordis": {
      optional: true
    },
    "@deepseek-ai/dsh-attachment": {
      optional: true
    },
    "@deepseek-ai/dsh-brand": {
      optional: true
    },
    "@deepseek-ai/dsh-credentials": {
      optional: true
    },
    "@deepseek-ai/dsh-launch-environment": {
      optional: true
    },
    "@deepseek-ai/dsh-llm": {
      optional: true
    },
    "@deepseek-ai/dsh-timeout": {
      optional: true
    },
    "@deepseek-ai/dsh-util-values": {
      optional: true
    },
    "@deepseek-ai/schemastery": {
      optional: true
    },
    "@deepseek-ai/dsh-app-boot": {
      optional: true
    }
  },
  scripts: {
    build: "node scripts/build.mjs",
    test: "node --test tests/*.test.mjs",
    "test:browser": "node scripts/browser-check.mjs",
    "pack:plugin": "node scripts/pack.mjs",
    "test:compat": "node scripts/compat-check.mjs",
    "test:runtime": "node scripts/runtime-check.mjs",
    "update:pi": "node scripts/update-pi.mjs",
    "test:install": "node scripts/install-check.mjs"
  },
  devDependencies: {
    clsx: "^2.1.1",
    esbuild: "0.28.2",
    immer: "^10.2.0",
    playwright: "^1.56.1",
    react: "18.3.1",
    "react-dom": "18.3.1",
    typescript: "6.0.3",
    "use-sync-external-store": "^1.7.0",
    yaml: "^2.9.1",
    zod: "^4.6.5",
    zustand: "^5.0.15"
  }
};

// src/updates.mjs
var REPOSITORY = "Aero123421/dsh-pi-login";
var PACKAGE = "@local/dsh-pi-login";
var RELEASES = `https://github.com/${REPOSITORY}/releases`;
var ROOT = `https://api.github.com/repos/${REPOSITORY}`;
var MAX_PACKAGE = 32 * 1024 * 1024;
var UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
function reasonOf(error) {
  const allowed = ["manager-unavailable", "read-only", "source", "metadata", "asset", "channel", "incompatible", "compatibility-unknown", "busy", "checksum", "redirect", "size", "stale-candidate", "release-unavailable", "storage", "interrupted"];
  return allowed.includes(error?.message) ? error.message : "network";
}
function semanticVersion(value) {
  if (typeof value !== "string") throw new Error("metadata");
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(value);
  if (!match || match[4]?.split(".").some((part) => /^\d+$/.test(part) && part.length > 1 && part.startsWith("0"))) throw new Error("metadata");
  return { numbers: match.slice(1, 4).map(BigInt), pre: match[4]?.split(".") };
}
function compareVersions(left, right) {
  const a = semanticVersion(left), b = semanticVersion(right);
  for (let i = 0; i < 3; i++) if (a.numbers[i] !== b.numbers[i]) return a.numbers[i] > b.numbers[i] ? 1 : -1;
  if (!a.pre || !b.pre) return a.pre ? -1 : b.pre ? 1 : 0;
  for (let i = 0; i < Math.max(a.pre.length, b.pre.length); i++) {
    const x = a.pre[i], y = b.pre[i];
    if (x === y) continue;
    if (x === void 0 || y === void 0) return x === void 0 ? -1 : 1;
    const nx = /^\d+$/.test(x), ny = /^\d+$/.test(y);
    if (nx && ny) return BigInt(x) > BigInt(y) ? 1 : -1;
    if (nx !== ny) return nx ? -1 : 1;
    return x > y ? 1 : -1;
  }
  return 0;
}
function allowedUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash) throw new Error("redirect");
  if (url.hostname === "api.github.com" && url.pathname.startsWith(`/repos/${REPOSITORY}/`)) return url;
  if (url.hostname === "github.com" && url.pathname.startsWith(`/${REPOSITORY}/releases/download/`)) return url;
  if (url.hostname === "raw.githubusercontent.com" && url.pathname.startsWith(`/${REPOSITORY}/`)) return url;
  if (["release-assets.githubusercontent.com", "objects.githubusercontent.com"].includes(url.hostname)) return url;
  throw new Error("redirect");
}
async function boundedFetch(url, limit, { fetcher = fetch, signal } = {}) {
  const timeout = AbortSignal.timeout(2e4);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  for (let redirects = 0; redirects <= 4; redirects++) {
    const response = await fetcher(allowedUrl(url), { redirect: "manual", signal: combined, headers: { accept: "application/vnd.github+json" } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = response.headers.get("location");
      await response.body?.cancel();
      if (!next) throw new Error("redirect");
      url = new URL(next, url).href;
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(response.status === 404 ? "release-unavailable" : "network");
    }
    if (Number(response.headers.get("content-length")) > limit) {
      await response.body?.cancel();
      throw new Error("size");
    }
    const chunks = [];
    let bytes = 0;
    const reader = response.body?.getReader();
    if (!reader) throw new Error("network");
    try {
      for (; ; ) {
        combined.throwIfAborted();
        const { done, value } = await reader.read();
        if (done) return Buffer.concat(chunks, bytes);
        bytes += value.byteLength;
        if (bytes > limit) throw new Error("size");
        chunks.push(Buffer.from(value));
      }
    } finally {
      await reader.cancel().catch(() => {
      });
      reader.releaseLock();
    }
  }
  throw new Error("redirect");
}
function sourceKind(source, cacheDir, installedVersion) {
  if (typeof source !== "string") throw new Error("source");
  if (/^github:Aero123421\/dsh-pi-login(?:#[A-Za-z0-9._/-]+)?$/.test(source)) return "github";
  if (/^(?:git\+)?https:\/\/github\.com\/Aero123421\/dsh-pi-login(?:\.git)?(?:#[A-Za-z0-9._/-]+)?$/.test(source)) return "github";
  if (/^https:\/\/github\.com\/Aero123421\/dsh-pi-login\/releases\/download\/v[^/]+\/local-dsh-pi-login-[^/]+\.tgz$/.test(source)) return "tarball";
  if (cacheDir && source.startsWith("file:") && resolve(source.slice(5)).startsWith(resolve(cacheDir) + sep)) return "tarball";
  if (installedVersion && source.startsWith("file:")) {
    semanticVersion(installedVersion);
    const file = source.slice(5);
    if ([basename(file), win32.basename(file)].includes(`local-dsh-pi-login-${installedVersion}.tgz`)) return "tarball";
  }
  throw new Error("source");
}
function releaseCandidate(release, current) {
  if (!release || !Number.isSafeInteger(release.id) || release.id <= 0 || release.draft !== false || release.prerelease !== false || typeof release.tag_name !== "string" || !release.tag_name.startsWith("v")) throw new Error("metadata");
  const version = release.tag_name.slice(1);
  if (semanticVersion(version).pre) throw new Error("channel");
  const expectedLink = `${RELEASES}/tag/${release.tag_name}`;
  if (release.html_url !== expectedLink || typeof release.body !== "string" || !Array.isArray(release.assets)) throw new Error("metadata");
  const filename = `local-dsh-pi-login-${version}.tgz`;
  function asset(name2) {
    const matches = release.assets.filter((asset2) => asset2?.name === name2);
    if (matches.length !== 1) throw new Error("asset");
    const item = matches[0];
    if (!Number.isSafeInteger(item.id) || item.id <= 0 || !Number.isSafeInteger(item.size) || item.size <= 0 || item.browser_download_url !== `https://github.com/${REPOSITORY}/releases/download/${release.tag_name}/${name2}`) throw new Error("asset");
    return item.browser_download_url;
  }
  const candidate = { id: String(release.id), version, tag: release.tag_name, url: expectedLink, notes: release.body.slice(0, 6e3), filename, tarball: asset(filename), checksum: asset("SHA256SUMS") };
  return compareVersions(version, current) > 0 ? candidate : null;
}
function checkCompatibility(packageJson, candidate, runtime) {
  semanticVersion(runtime);
  if (!packageJson || packageJson.name !== PACKAGE || packageJson.version !== candidate.version || typeof packageJson.dsh?.bundle?.patch !== "string") throw new Error("metadata");
  const peers = Object.entries(packageJson.peerDependencies ?? {}).filter(([name2]) => name2 === "@deepseek-ai/dsh" || name2.startsWith("@deepseek-ai/dsh-"));
  if (!peers.length || peers.some(([, range]) => typeof range !== "string")) throw new Error("compatibility-unknown");
  for (const [, range] of peers) {
    try {
      semanticVersion(range);
    } catch {
      throw new Error("compatibility-unknown");
    }
    if (range !== runtime) throw new Error("incompatible");
  }
  return runtime;
}
function packageManifest(bytes) {
  const tar = gunzipSync(bytes, { maxOutputLength: 128 * 1024 * 1024 });
  let manifest;
  for (let offset = 0; offset + 512 <= tar.length; ) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const name2 = header.subarray(0, 100).toString().replace(/\0.*$/, "");
    const prefix = header.subarray(345, 500).toString().replace(/\0.*$/, "");
    const sizeText = header.subarray(124, 136).toString().replace(/\0.*$/, "").trim();
    if (!/^[0-7]+$/.test(sizeText)) throw new Error("metadata");
    const size = Number.parseInt(sizeText, 8);
    if (!Number.isSafeInteger(size) || offset + 512 + size > tar.length) throw new Error("metadata");
    const path = prefix ? `${prefix}/${name2}` : name2;
    if (path === "package/package.json") {
      if (manifest || ![0, 48].includes(header[156]) || size > 65536) throw new Error("metadata");
      manifest = JSON.parse(tar.subarray(offset + 512, offset + 512 + size).toString());
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  if (!manifest) throw new Error("metadata");
  return manifest;
}
function safeResult(result) {
  if (!result) return null;
  return {
    changed: result.changed,
    application: result.application,
    stage: result.stage,
    target: PACKAGE,
    bundle: result.bundle,
    version: result.version,
    enabled: result.enabled,
    ...result.error ? { error: { code: result.error.code } } : {},
    ...result.packageResult ? { packageResult: { exitCode: result.packageResult.exitCode, timedOut: result.packageResult.timedOut, kind: result.packageResult.kind } } : {}
  };
}
function resultState(result, expected, runtime) {
  if (!result) return "unknown";
  if (result.error || result.application === "failed" || result.packageResult && (result.packageResult.exitCode !== 0 || result.packageResult.timedOut)) return "failed";
  if (["cancelled", "overridden"].includes(result.application)) return result.application;
  if (result.bundle !== PACKAGE || result.version !== expected) return "unknown";
  if (result.application === "restart-required") return "restart-required";
  return result.application === "applied" && runtime === expected ? "applied" : "unknown";
}
var PluginUpdates = class {
  constructor({ manager, profileDir, runtimeVersion, isBusy = () => false, fetcher = fetch, version = package_default.version }) {
    Object.assign(this, { manager, profileDir, runtimeVersion, isBusy, fetcher, version });
    this.candidate = null;
    this.checking = null;
    this.running = null;
    this.closed = false;
    this.abort = new AbortController();
  }
  get cacheDir() {
    return this.profileDir && join(this.profileDir, ".dsh-pi-login-updates");
  }
  async capability() {
    const manager = this.manager();
    if (!manager || typeof manager.listBundles !== "function" || typeof manager.installBundle !== "function" || typeof manager.waitForInstall !== "function" || !this.profileDir) throw new Error("manager-unavailable");
    const bundle = (await manager.listBundles()).find((item) => item.name === PACKAGE);
    if (!bundle?.installed || bundle.readOnlyReason || bundle.error) throw new Error("read-only");
    const source = sourceKind(bundle.source, this.cacheDir, bundle.version);
    if (bundle.source.startsWith("file:")) {
      try {
        if (!(await lstat(bundle.source.slice(5))).isFile()) throw new Error("source");
      } catch {
        throw new Error("source");
      }
    }
    const dshVersion = await this.runtimeVersion();
    semanticVersion(dshVersion);
    return { manager, bundle, source, dshVersion };
  }
  base() {
    return { runtimeVersion: this.version, releases: RELEASES };
  }
  async lastOperation() {
    try {
      const value = JSON.parse(await readFile(join(this.cacheDir, "latest.json"), "utf8"));
      return typeof value.requestId === "string" && UUID.test(value.requestId) ? value.requestId : void 0;
    } catch {
      return void 0;
    }
  }
  async status() {
    try {
      const { dshVersion } = await this.capability();
      const requestId = this.running?.requestId ?? await this.lastOperation();
      return requestId ? { ...await this.reconcile(requestId), dshVersion } : { ...this.base(), dshVersion, status: "idle" };
    } catch (error) {
      return { ...this.base(), status: "blocked", reason: reasonOf(error) };
    }
  }
  async privateDir() {
    await mkdir(this.cacheDir, { recursive: true, mode: 448 });
    if (!(await lstat(this.cacheDir)).isDirectory() || (await lstat(this.cacheDir)).isSymbolicLink()) throw new Error("storage");
    return this.cacheDir;
  }
  async getCandidate(current) {
    const options = { fetcher: this.fetcher, signal: this.abort.signal };
    const release = JSON.parse((await boundedFetch(`${ROOT}/releases/latest`, 256 * 1024, options)).toString());
    const candidate = releaseCandidate(release, current);
    if (!candidate) return null;
    const packageJson = JSON.parse((await boundedFetch(`https://raw.githubusercontent.com/${REPOSITORY}/${candidate.tag}/package.json`, 64 * 1024, options)).toString());
    candidate.compatibility = checkCompatibility(packageJson, candidate, await this.runtimeVersion());
    return candidate;
  }
  check() {
    if (this.checking) return this.checking;
    this.checking = (async () => {
      try {
        if (this.closed || this.running) throw new Error("busy");
        const { bundle } = await this.capability();
        const last = await this.lastOperation();
        if (last && ["installing", "unknown", "restart-required"].includes((await this.reconcile(last)).status)) throw new Error("busy");
        this.candidate = await this.getCandidate(bundle.version ?? this.version);
        return { ...this.base(), status: this.candidate ? "available" : "current", candidate: this.candidate && this.publicCandidate(this.candidate), checkedAt: (/* @__PURE__ */ new Date()).toISOString() };
      } catch (error) {
        this.candidate = null;
        return { ...this.base(), status: "blocked", reason: reasonOf(error) };
      }
    })().finally(() => {
      this.checking = null;
    });
    return this.checking;
  }
  publicCandidate(candidate) {
    const { id, version, url, notes, compatibility } = candidate;
    return { id, version, url, notes, compatibility };
  }
  async begin(id, operationId) {
    if (typeof operationId !== "string") throw new Error("invalid-request");
    const requestId = updateRequestId(operationId);
    await this.capability();
    if (this.running?.requestId === requestId) return this.running;
    try {
      await readFile(join(this.cacheDir, `${requestId}.json`));
      return this.reconcile(requestId);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    const last = await this.lastOperation();
    if (last && ["installing", "unknown", "restart-required"].includes((await this.reconcile(last)).status)) throw new Error("busy");
    if (this.closed || this.running || this.checking || this.isBusy()) throw new Error("busy");
    if (typeof id !== "string" || !this.candidate || id !== this.candidate.id) throw new Error("stale-candidate");
    const candidate = this.candidate;
    this.running = { requestId, version: candidate.version, status: "preparing" };
    try {
      await this.privateDir();
      await this.save(this.running);
    } catch (error) {
      this.running = null;
      throw error;
    }
    void this.execute(candidate, this.running).finally(() => {
      this.running = null;
    });
    return this.running;
  }
  async save(operation) {
    const directory = await this.privateDir(), file = join(directory, `${operation.requestId}.json`);
    const temp = join(directory, `${operation.requestId}.${randomUUID3()}.tmp`);
    await writeFile(temp, JSON.stringify(operation), { flag: "wx", mode: 384 });
    await rename(temp, file);
    const index = join(directory, `${randomUUID3()}.tmp`);
    await writeFile(index, JSON.stringify({ requestId: operation.requestId }), { flag: "wx", mode: 384 });
    await rename(index, join(directory, "latest.json"));
  }
  async execute(candidate, operation) {
    let managerInvoked = false;
    try {
      const before = await this.capability();
      const fresh = await this.getCandidate(before.bundle.version ?? this.version);
      if (!fresh || fresh.id !== candidate.id || fresh.version !== candidate.version || fresh.tarball !== candidate.tarball) throw new Error("stale-candidate");
      const options = { fetcher: this.fetcher, signal: this.abort.signal };
      const checksum = (await boundedFetch(candidate.checksum, 8192, options)).toString();
      const lines = checksum.trim().split(/\r?\n/);
      if (lines.length !== 1) throw new Error("checksum");
      const match = /^([a-fA-F0-9]{64})  (\S+)$/.exec(lines[0]);
      if (!match || match[2] !== candidate.filename) throw new Error("checksum");
      const bytes = await boundedFetch(candidate.tarball, MAX_PACKAGE, options);
      if (createHash("sha256").update(bytes).digest("hex") !== match[1].toLowerCase()) throw new Error("checksum");
      checkCompatibility(packageManifest(bytes), candidate, await this.runtimeVersion());
      const dir = await mkdtemp(join(await this.privateDir(), "verified-"));
      const path = join(dir, candidate.filename);
      await writeFile(path, bytes, { flag: "wx", mode: 384 });
      const latest = await this.capability();
      if (latest.bundle.source !== before.bundle.source || latest.bundle.enabled !== before.bundle.enabled || this.isBusy() || this.closed) throw new Error("busy");
      const spec = latest.source === "github" ? `github:${REPOSITORY}#${candidate.tag}` : path;
      operation.status = "installing";
      await this.save(operation);
      if (this.closed || this.isBusy()) throw new Error("busy");
      managerInvoked = true;
      const result = await latest.manager.installBundle(spec, { enabled: latest.bundle.enabled, requestId: operation.requestId, saveExact: true });
      operation.status = resultState(result, operation.version, this.version);
      operation.result = safeResult(result);
    } catch (error) {
      operation.status = managerInvoked ? "unknown" : "failed";
      operation.reason = reasonOf(error);
    }
    try {
      await this.save(operation);
    } catch {
    }
  }
  async reconcile(requestId) {
    if (typeof requestId !== "string" || !UUID.test(requestId)) throw new Error("invalid-request");
    let operation;
    try {
      operation = JSON.parse(await readFile(join(this.cacheDir, `${requestId}.json`), "utf8"));
    } catch {
      return { ...this.base(), status: "unknown", requestId };
    }
    if (operation.requestId !== requestId || typeof operation.version !== "string") return { ...this.base(), status: "unknown", requestId };
    semanticVersion(operation.version);
    if (this.running?.requestId === requestId) return { ...this.base(), ...this.running };
    if (operation.status === "preparing") {
      operation.status = "failed";
      operation.reason = "interrupted";
      await this.save(operation);
    }
    if (["installing", "unknown"].includes(operation.status) && !operation.result) {
      const manager = this.manager();
      const result = manager && await manager.waitForInstall(requestId);
      if (result) {
        operation.result = safeResult(result);
        operation.status = resultState(result, operation.version, this.version);
        await this.save(operation);
      } else operation.status = "unknown";
    }
    const bundle = (await this.manager()?.listBundles())?.find((item) => item.name === PACKAGE);
    const installed = bundle?.version;
    if (["installing", "restart-required", "unknown", "applied"].includes(operation.status) && this.version === operation.version) {
      operation.status = bundle?.installed && !bundle.error && !bundle.readOnlyReason && installed === operation.version ? "applied" : "unknown";
    }
    return { ...this.base(), ...operation, installedVersion: installed };
  }
  dispose() {
    this.closed = true;
    this.abort.abort();
  }
};

// src/routes.mjs
function applyLoginUI(ctx, options = {}) {
  const broker = new PiLoginBroker(ctx.authorization, ctx.credentials, ctx.settings, options);
  let writes = 0;
  const updates = new PluginUpdates({
    manager: () => ctx.get("pluginManager"),
    profileDir: ctx.get("profileContext")?.dir,
    runtimeVersion: async () => {
      const moduleName = "@deepseek-ai/dsh-app-boot";
      const anchor = ctx.get("profileContext")?.installAnchor;
      const resolved = anchor ? pathToFileURL(createRequire(anchor).resolve(moduleName)).href : moduleName;
      return (await import(resolved)).getDshRuntimeVersion();
    },
    isBusy: () => writes > 0 || ctx.authorization.list().some((entry) => entry.key.startsWith("llm-pi-ai/") && entry.inFlight),
    ...options.updates
  });
  ctx.effect(() => () => {
    updates.dispose();
    broker.dispose();
  }, "dsh-pi-login: private attempts and update retrieval");
  for (const method of ["list", "start", "state", "answer", "cancel", "enable", "models", "refresh-models", "set-model", "set-provider", "use-login", "update-status", "update-check", "update-begin", "update-reconcile"]) {
    const endpoint = `dsh-pi-login/${method}`;
    ctx.connection.fetch.register({
      path: `/api/${endpoint}`,
      methods: ["POST"],
      requestBody: "buffered",
      async fetch(request) {
        let rpcId;
        try {
          if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return new Response("unsupported media type", { status: 415 });
          const envelope = await request.json();
          if (envelope?.type !== "client-request" || typeof envelope.rpcId !== "string" || envelope.rpcId.length > 100 || envelope.method !== endpoint) return new Response("invalid request", { status: 400 });
          rpcId = envelope.rpcId;
          request.signal.throwIfAborted();
          let value;
          if (method.startsWith("update-")) {
            const payload = envelope.payload;
            if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new LoginError("invalid-request");
            try {
              if (method === "update-status") value = await updates.status();
              else if (method === "update-check") value = await updates.check();
              else if (method === "update-begin") value = await updates.begin(payload.candidateId, payload.requestId);
              else value = await updates.reconcile(payload.requestId);
            } catch (error) {
              throw new LoginError(error.message === "busy" ? "busy" : "update-failed");
            }
          } else {
            const mutation = ["start", "answer", "enable", "set-model", "set-provider", "use-login"].includes(method);
            if (mutation && updates.running) throw new LoginError("busy");
            if (mutation) writes++;
            try {
              value = await dispatch(broker, method, envelope.payload);
            } finally {
              if (mutation) writes--;
            }
          }
          return Response.json({ type: "server-response", rpcId, result: { ok: true, value } }, { headers: { "cache-control": "no-store" } });
        } catch (error) {
          if (rpcId === void 0) return new Response("invalid request", { status: 400 });
          const code = error instanceof LoginError ? error.code : "unavailable";
          return Response.json({ type: "server-response", rpcId, result: { ok: false, error: { code: `dsh-pi-login/${code}`, message: code, details: {} } } }, { headers: { "cache-control": "no-store" } });
        }
      }
    });
  }
}

// src/runtime/index.ts
import { launchEnvironmentOf as launchEnvironmentOf2 } from "@deepseek-ai/dsh-launch-environment";
import { assertUsableApiKey, LlmError as LlmError7, resolveImageAttachmentAccess } from "@deepseek-ai/dsh-llm";
import { deepEqualJson as deepEqualJson2 } from "@deepseek-ai/dsh-util-values";

// src/runtime/adapter.ts
import {
  attributionHeaders,
  contentHasImage as contentHasImage2,
  LlmAdapter,
  LlmError as LlmError4,
  ReasoningEffortId
} from "@deepseek-ai/dsh-llm";
import { idleWatchdog, timeoutOf } from "@deepseek-ai/dsh-timeout";

// src/runtime/context.ts
import { brandString } from "@deepseek-ai/dsh-brand";
import { contentHasImage, IMAGE_OFFLOAD_REQUIRED_CODE, LlmError as LlmError2, offloadedImageText, projectOffloadedImages, requestImageHandleText, requiredImageOffload } from "@deepseek-ai/dsh-llm";

// src/runtime/replay.ts
import { LlmError } from "@deepseek-ai/dsh-llm";
function parseArguments(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
  }
  return {};
}
function emptyPiUsage() {
  return {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
  };
}
function toPiReplayState(message, requestedModel = message.model) {
  const response = {
    kind: "pi-ai",
    version: 2,
    api: message.api,
    provider: message.provider,
    model: requestedModel,
    ...requestedModel === message.model ? {} : { wireModel: message.model },
    ...message.responseModel === void 0 ? {} : { responseModel: message.responseModel },
    ...message.responseId === void 0 ? {} : { responseId: message.responseId },
    ...message.providerThinkingLevel === void 0 ? {} : { providerThinkingLevel: message.providerThinkingLevel },
    stopReason: message.stopReason
  };
  return {
    response,
    blocks: message.content.map((block) => {
      switch (block.type) {
        case "text":
          return {
            type: "text",
            ...block.textSignature === void 0 ? {} : { textSignature: block.textSignature }
          };
        case "thinking":
          return {
            type: "reasoning",
            ...block.thinkingSignature === void 0 ? {} : { thinkingSignature: block.thinkingSignature },
            ...block.redacted === void 0 ? {} : { redacted: block.redacted }
          };
        case "toolCall":
          return {
            type: "tool-call",
            ...block.thoughtSignature === void 0 ? {} : { thoughtSignature: block.thoughtSignature },
            ...block.namespace === void 0 ? {} : { namespace: block.namespace }
          };
      }
    })
  };
}
function invalidReplay(message) {
  throw new LlmError(`invalid pi-ai replay state: ${message}`, "INVALID_REPLAY_STATE");
}
function readReplayState(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return invalidReplay("expected a replay envelope");
  const envelope = value;
  const rawResponse = envelope["response"];
  if (typeof rawResponse !== "object" || rawResponse === null || Array.isArray(rawResponse)) return invalidReplay("expected a response object");
  const response = rawResponse;
  if (response["kind"] !== "pi-ai") return invalidReplay("unknown state kind");
  if (response["version"] !== 2) return invalidReplay(`unsupported version ${String(response["version"])}`);
  for (const key of ["api", "provider", "model"]) {
    if (typeof response[key] !== "string" || response[key].length === 0) return invalidReplay(`${key} must be a non-empty string`);
  }
  if (!["stop", "length", "toolUse", "error", "aborted"].includes(String(response["stopReason"]))) {
    return invalidReplay("unknown stopReason");
  }
  if (response["wireModel"] !== void 0 && (typeof response["wireModel"] !== "string" || response["wireModel"].length === 0)) return invalidReplay("wireModel must be a non-empty string");
  if (response["responseModel"] !== void 0 && typeof response["responseModel"] !== "string") return invalidReplay("responseModel must be a string");
  if (response["responseId"] !== void 0 && typeof response["responseId"] !== "string") return invalidReplay("responseId must be a string");
  if (response["providerThinkingLevel"] !== void 0 && typeof response["providerThinkingLevel"] !== "string") return invalidReplay("providerThinkingLevel must be a string");
  const blocks = envelope["blocks"];
  if (!Array.isArray(blocks)) return invalidReplay("blocks must be an array");
  for (const [index, value2] of blocks.entries()) {
    if (typeof value2 !== "object" || value2 === null || Array.isArray(value2)) return invalidReplay(`block ${index} must be an object`);
    const block = value2;
    if (!["text", "reasoning", "tool-call"].includes(String(block["type"]))) return invalidReplay(`block ${index} has an unknown type`);
    for (const signature of ["textSignature", "thinkingSignature", "thoughtSignature", "namespace"]) {
      if (block[signature] !== void 0 && typeof block[signature] !== "string") return invalidReplay(`block ${index} ${signature} must be a string`);
    }
    if (block["redacted"] !== void 0 && typeof block["redacted"] !== "boolean") return invalidReplay(`block ${index} redacted must be boolean`);
  }
  return {
    response,
    blocks
  };
}
function foreignAssistant(message) {
  const source = message.source;
  const content = [];
  for (const block of message.content) {
    switch (block.type) {
      case "text":
        content.push({ type: "text", text: block.text });
        break;
      case "reasoning":
        content.push({ type: "thinking", thinking: block.text });
        break;
      case "tool-call":
        content.push({
          type: "toolCall",
          id: block.id,
          name: block.name,
          arguments: parseArguments(block.arguments)
        });
        break;
      case "image":
        throw new LlmError("pi-ai chat history cannot represent structured assistant image output", "UNSUPPORTED_CONTENT");
      default:
        break;
    }
  }
  return {
    role: "assistant",
    content,
    // Deliberately never equals a catalog API: absent replay state is foreign
    // even if source names the same provider/model as this request.
    api: "dsh-foreign",
    provider: source.provider,
    model: source.model,
    usage: emptyPiUsage(),
    stopReason: content.some((piece) => piece.type === "toolCall") ? "toolUse" : "stop",
    timestamp: 0
  };
}
function replayedAssistant(message, source, rawState) {
  const state = readReplayState(rawState);
  if (state.response.provider !== source.provider) return invalidReplay("provider does not match assistant source");
  if (state.response.model !== source.model) return invalidReplay("model does not match assistant source");
  if (state.blocks.length !== message.content.length) return invalidReplay("block count does not match assistant content");
  const content = message.content.map((block, index) => {
    const replay = state.blocks[index];
    if (replay === void 0 || replay.type !== block.type) return invalidReplay(`block ${index} does not match assistant content`);
    switch (block.type) {
      case "text":
        return {
          type: "text",
          text: block.text,
          ...replay.type === "text" && replay.textSignature !== void 0 ? { textSignature: replay.textSignature } : {}
        };
      case "reasoning":
        return {
          type: "thinking",
          thinking: block.text,
          ...replay.type === "reasoning" && replay.thinkingSignature !== void 0 ? { thinkingSignature: replay.thinkingSignature } : {},
          ...replay.type === "reasoning" && replay.redacted !== void 0 ? { redacted: replay.redacted } : {}
        };
      case "tool-call":
        return {
          type: "toolCall",
          id: block.id,
          name: block.name,
          arguments: parseArguments(block.arguments),
          ...replay.type === "tool-call" && replay.thoughtSignature !== void 0 ? { thoughtSignature: replay.thoughtSignature } : {},
          ...replay.type === "tool-call" && replay.namespace !== void 0 ? { namespace: replay.namespace } : {}
        };
      /* v8 ignore next -- readReplayState rejects unknown replay tags, so an equal plugin-added Harness tag cannot reach this switch */
      default:
        return invalidReplay(`block ${index} has an unsupported Harness type`);
    }
  });
  return {
    role: "assistant",
    content,
    api: state.response.api,
    provider: state.response.provider,
    model: state.response.wireModel ?? state.response.model,
    ...state.response.responseModel === void 0 ? {} : { responseModel: state.response.responseModel },
    ...state.response.responseId === void 0 ? {} : { responseId: state.response.responseId },
    ...state.response.providerThinkingLevel === void 0 ? {} : { providerThinkingLevel: state.response.providerThinkingLevel },
    usage: emptyPiUsage(),
    stopReason: state.response.stopReason,
    timestamp: 0
  };
}
function toPiAssistant(message, onDegrade) {
  const source = message.source;
  if (source.replayState === void 0) return foreignAssistant(message);
  try {
    return replayedAssistant(message, source, source.replayState);
  } catch (error) {
    if (!(error instanceof LlmError) || error.code !== "INVALID_REPLAY_STATE") throw error;
    onDegrade?.(error.message);
    return foreignAssistant(message);
  }
}

// src/runtime/context.ts
import { requestImageDimensions } from "@deepseek-ai/dsh-attachment";

// src/runtime/config.ts
import z from "@deepseek-ai/schemastery";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { MAX_TIMER_DELAY_MS as MAX_TIMER_DELAY_MS2 } from "@deepseek-ai/dsh-timeout";
import { resolveRetryPolicy, RetryPolicySchema } from "@deepseek-ai/dsh-llm";
import { deepEqualJson } from "@deepseek-ai/dsh-util-values";

// src/runtime/catalog.ts
import { builtinProviders, getAllBuiltinModels, getBuiltinModels } from "@earendil-works/pi-ai/providers/all";

// src/runtime/catalog-additions.ts
var additions = [{
  id: "muse-wonder-1.0",
  name: "Muse Wonder",
  provider: "meta",
  api: "openai-responses",
  baseUrl: "https://api.meta.ai/v1",
  reasoning: true,
  input: ["text", "image"],
  contextWindow: 1048576,
  maxTokens: 131072,
  thinkingLevelMap: {
    off: null,
    minimal: "minimal",
    low: "low",
    medium: "medium",
    high: "high",
    xhigh: "xhigh",
    max: "max"
  },
  // Meta has not published rates. As with hand-declared models, zero means
  // unknown here; the Harness does not report spend from this metadata.
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
}];
function supplementCatalog(provider, installed) {
  const catalog = new Map(installed.map((model) => [model.id, model]));
  for (const model of additions) {
    if (model.provider === provider && !catalog.has(model.id)) catalog.set(model.id, model);
  }
  return catalog;
}

// src/runtime/catalog.ts
var NO_COST = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
var MODALITY_GATE = {
  text: true,
  image: true
};
var MODALITIES = Object.keys(MODALITY_GATE);
function declaredInput(configured) {
  return configured === void 0 || configured.length === 0 ? void 0 : [...configured];
}
var THINKING_LEVEL_GATE = {
  off: true,
  minimal: true,
  low: true,
  medium: true,
  high: true,
  xhigh: true,
  max: true
};
var THINKING_LEVELS = Object.keys(THINKING_LEVEL_GATE);
var THINKING_FORMAT_GATE = {
  "openai": true,
  "deepseek": true,
  "openrouter": true,
  "together": true,
  "baseten": true,
  "zai": true,
  "qwen": true,
  "chat-template": true,
  "qwen-chat-template": true,
  "string-thinking": true,
  "ant-ling": true
};
var SUPPORTED_THINKING_FORMATS = Object.keys(THINKING_FORMAT_GATE);
var MAX_TOKENS_FIELD_GATE = {
  max_completion_tokens: true,
  max_tokens: true
};
var MAX_TOKENS_FIELDS = Object.keys(MAX_TOKENS_FIELD_GATE);
var THINKING_TOKEN_BUDGET_FIELD_GATE = {
  thinking_token_budget: true,
  thinking_budget: true,
  thinking_budget_tokens: true
};
var THINKING_TOKEN_BUDGET_FIELDS = Object.keys(THINKING_TOKEN_BUDGET_FIELD_GATE);
var CACHE_CONTROL_FORMAT_GATE = {
  anthropic: true
};
var CACHE_CONTROL_FORMATS = Object.keys(CACHE_CONTROL_FORMAT_GATE);
var CHAT_TEMPLATE_VAR_GATE = {
  "thinking.enabled": true,
  "thinking.effort": true,
  "thinking.budget": true
};
var CHAT_TEMPLATE_VARS = Object.keys(CHAT_TEMPLATE_VAR_GATE);
var providerIndex;
function servesChat(provider) {
  const id = provider.id;
  return getBuiltinModels(id).length > 0 || getAllBuiltinModels(id).length === 0;
}
function catalogProviders() {
  providerIndex ??= new Map(builtinProviders().filter(servesChat).map((provider) => [provider.id, provider]));
  return providerIndex;
}
function catalogProvider(provider) {
  return catalogProviders().get(provider);
}
function catalogProviderIds() {
  return [...catalogProviders().keys()];
}
function catalogModels(provider) {
  if (!catalogProviders().has(provider)) return /* @__PURE__ */ new Map();
  const models = getBuiltinModels(provider);
  return supplementCatalog(provider, models);
}
var COMPLETIONS_COMPAT_GATE = {
  supportsStore: "offer",
  supportsDeveloperRole: "offer",
  supportsReasoningEffort: "offer",
  supportsUsageInStreaming: "offer",
  supportsFinishReason: "offer",
  maxTokensField: "offer",
  requiresToolResultName: "offer",
  requiresAssistantAfterToolResult: "offer",
  requiresThinkingAsText: "offer",
  requiresReasoningContentOnAssistantMessages: "offer",
  thinkingFormat: "offer",
  chatTemplateKwargs: "offer",
  chatTemplateArgs: "offer",
  supportsThinkingTokenBudget: "offer",
  thinkingTokenBudgetField: "offer",
  vllmPriority: "offer",
  supportsStrictMode: "offer",
  cacheControlFormat: "offer",
  supportsLongCacheRetention: "offer",
  openRouterRouting: "withhold",
  vercelGatewayRouting: "withhold",
  zaiToolStream: "withhold",
  supportsOpenAIGrammarTools: "withhold",
  sendSessionAffinityHeaders: "withhold",
  supportsMidConvoSystemMessages: "withhold",
  supportsMidConvoToolAdditions: "withhold",
  sessionAffinityFormat: "withhold"
};
var RESPONSES_COMPAT_GATE = {
  supportsDeveloperRole: "offer",
  supportsMaxOutputTokens: "offer",
  supportsStrictMode: "offer",
  supportsLongCacheRetention: "offer",
  sessionAffinityFormat: "withhold",
  supportsOpenAIGrammarTools: "withhold",
  supportsAdditionalTools: "withhold",
  supportsToolSearch: "withhold",
  supportsExplicitPromptCacheMode: "withhold",
  supportsMidConvoSystemMessages: "withhold"
};
var ANTHROPIC_COMPAT_GATE = {
  supportsEagerToolInputStreaming: "offer",
  supportsLongCacheRetention: "offer",
  supportsCacheControlOnTools: "offer",
  supportsTemperature: "offer",
  forceAdaptiveThinking: "offer",
  allowEmptySignature: "offer",
  supportsStrictTools: "offer",
  sendSessionAffinityHeaders: "withhold",
  sessionAffinityFormat: "withhold",
  supportsMidConvoSystemMessages: "withhold",
  supportsMidConvoToolChanges: "withhold",
  supportsMidConvoEffort: "withhold",
  allowedFallbackModels: "withhold"
};
var BEDROCK_COMPAT_GATE = {
  supportsStrictMode: "offer"
};
var MISTRAL_COMPAT_GATE = {
  supportsMidConvoSystemMessages: "withhold"
};
var COMPAT_GATES = {
  "mistral-conversations": MISTRAL_COMPAT_GATE,
  "openai-completions": COMPLETIONS_COMPAT_GATE,
  "openai-responses": RESPONSES_COMPAT_GATE,
  "azure-openai-responses": RESPONSES_COMPAT_GATE,
  "openai-codex-responses": RESPONSES_COMPAT_GATE,
  "anthropic-messages": ANTHROPIC_COMPAT_GATE,
  "bedrock-converse-stream": BEDROCK_COMPAT_GATE
};
function compatGate(api) {
  return COMPAT_GATES[api];
}
function configuredCompatEntries(compat) {
  return Object.entries(compat ?? {}).flatMap(([field, value]) => {
    const empty = typeof value === "object" && value !== null && !Array.isArray(value) && Object.keys(value).length === 0;
    return empty ? [] : [[field, value]];
  });
}
function compatProtocols(field) {
  return Object.entries(COMPAT_GATES).flatMap(([api, gate]) => gate[field] === "offer" ? [api] : []);
}
function offeredCompatFields(api) {
  return Object.entries(compatGate(api) ?? {}).flatMap(([field, disposition]) => disposition === "offer" ? [field] : []);
}
function allOfferedCompatFields() {
  const fields = /* @__PURE__ */ new Set();
  for (const api of Object.keys(COMPAT_GATES)) {
    for (const field of offeredCompatFields(api)) fields.add(field);
  }
  return [...fields];
}
function assertOfferedCompatFields(provider, site, compat) {
  for (const [field, value] of Object.entries(compat ?? {})) {
    if (compatProtocols(field).length === 0) {
      const declared = Object.values(COMPAT_GATES).some((gate) => gate[field] !== void 0);
      if (declared) {
        invalid(provider, `${site} sets compat "${field}", which is not configurable here: pi-ai's installed catalog sets it for the vendors that need it, so name that provider as the route instead`);
      }
      invalid(provider, `${site} sets compat "${field}", which no wire protocol declares; the configurable switches are ${allOfferedCompatFields().join(", ")}`);
    }
    if (value == null) {
      invalid(provider, `${site} sets compat "${field}" with no value; give it one, or remove the key to leave the field to the next layer \u2014 the installed catalog entry, then pi-ai's own detection`);
    }
  }
}
var PiAiCatalogError = class extends Error {
};
function invalid(provider, detail) {
  throw new PiAiCatalogError(`llm-pi-ai: provider "${provider}" ${detail}`);
}
function sharedCatalogApi(defaults) {
  const apis = /* @__PURE__ */ new Set();
  for (const model of defaults.values()) apis.add(model.api);
  return apis.size === 1 ? [...apis][0] : void 0;
}
function resolveModelReasoning(provider, entry, base) {
  const efforts = entry.reasoningEfforts;
  if (efforts === void 0) {
    return { reasoning: base?.reasoning ?? false };
  }
  if (efforts === false) return { reasoning: false };
  if (efforts === null || Object.keys(efforts).length === 0) {
    invalid(provider, `model "${entry.id}" has an empty reasoningEfforts; declare the offered levels, set false for a non-reasoning model, or omit the field to keep the installed catalog's capability`);
  }
  const declared = THINKING_LEVELS.flatMap((level) => {
    const wire = efforts[level];
    return wire === void 0 ? [] : [[level, wire]];
  });
  for (const [level, wire] of declared) {
    if (wire === null) {
      if (level !== "off") {
        invalid(provider, `model "${entry.id}" reasoningEfforts.${level} needs the wire value dispatch should send; only "off" may leave it empty`);
      }
    } else if (wire.length === 0) {
      invalid(provider, `model "${entry.id}" reasoningEfforts.${level} must not be an empty string`);
    }
  }
  if (!declared.some(([level]) => level !== "off")) {
    invalid(provider, `model "${entry.id}" reasoningEfforts offers no level beyond "off"; declare a thinking level, or set reasoningEfforts to false for a non-reasoning model`);
  }
  const map = {};
  for (const level of THINKING_LEVELS) {
    const wire = efforts[level];
    if (wire === void 0) {
      map[level] = null;
    } else if (wire !== null) {
      map[level] = wire;
    }
  }
  return { reasoning: true, thinkingLevelMap: map };
}
function resolveModelCompat(provider, entry, route, base, api) {
  const gate = compatGate(api);
  const configured = {};
  for (const [field, value] of configuredCompatEntries(route)) {
    if (gate?.[field] !== "offer") continue;
    configured[field] = value;
  }
  for (const [field, value] of configuredCompatEntries(entry.compat)) {
    if (gate?.[field] !== "offer") {
      const offered = offeredCompatFields(api);
      invalid(provider, `model "${entry.id}" sets compat "${field}", but its api is "${api}", which does not take it; that switch exists on ${compatProtocols(field).join(", ")}, and "${api}" offers ${offered.length === 0 ? "no configurable compat" : offered.join(", ")}`);
    }
    configured[field] = value;
  }
  if (Object.keys(configured).length === 0) return {};
  const inherited = base?.api === api ? base.compat : void 0;
  return { compat: { ...inherited, ...configured } };
}
function resolveRouteModels(request, validation = "strict", installed) {
  const { provider } = request;
  const defaults = installed ?? catalogModels(provider);
  const providerBaseUrl = catalogProvider(provider)?.baseUrl;
  const configured = request.models ?? [];
  const overrides = request.modelOverrides ?? {};
  const modelErrors = /* @__PURE__ */ new Map();
  for (const [id, override] of Object.entries(overrides)) {
    if (id.length === 0) invalid(provider, "has a modelOverrides entry with an empty model id");
    if (defaults.size === 0) {
      invalid(provider, `sets modelOverrides for "${id}", but the installed catalog does not describe this route; a declared route spells every model out in its models list`);
    }
    if (configured.length > 0) {
      invalid(provider, `sets modelOverrides for "${id}" beside a models list; models already replaces the served catalog, so declare the fields on its entries`);
    }
    if (!defaults.has(id)) {
      const message = `modelOverrides names "${id}", which the installed catalog does not describe`;
      if (validation === "strict") invalid(provider, message);
      modelErrors.set(id, `llm-pi-ai: provider "${provider}" ${message}`);
    }
    if ("id" in override) {
      invalid(provider, `modelOverrides entry "${id}" sets "id", which is the dict key`);
    }
  }
  const entries = configured.length > 0 ? configured : [...defaults.values()].map((model) => ({ id: model.id, ...overrides[model.id] }));
  if (entries.length === 0) {
    invalid(provider, "resolves no models; the installed catalog does not describe this route, so its models must be listed in configuration");
  }
  const routeApi = sharedCatalogApi(defaults);
  assertOfferedCompatFields(provider, "route", request.compat);
  const seen = /* @__PURE__ */ new Set();
  const configuredMaxTokens = /* @__PURE__ */ new Map();
  const resolveEntry = (entry) => {
    assertOfferedCompatFields(provider, `model "${entry.id}"`, entry.compat);
    if (entry.id.length === 0) invalid(provider, "has a model with an empty id");
    if (seen.has(entry.id)) invalid(provider, `lists model "${entry.id}" more than once`);
    seen.add(entry.id);
    const base = defaults.get(entry.id);
    const api = request.api ?? base?.api ?? routeApi;
    if (api === void 0) {
      invalid(provider, `model "${entry.id}" needs an api; the installed catalog does not describe it, so set the route's api to the wire protocol its endpoint speaks`);
    }
    const baseUrl = request.baseURL ?? base?.baseUrl ?? providerBaseUrl;
    if (baseUrl === void 0) {
      invalid(provider, `model "${entry.id}" needs a baseURL; the installed catalog does not describe this route`);
    }
    const contextWindow = entry.contextWindow ?? base?.contextWindow ?? request.defaultContextWindow;
    if (!Number.isInteger(contextWindow) || contextWindow <= 0) {
      invalid(provider, `model "${entry.id}" contextWindow must be a positive integer`);
    }
    const maxTokens = entry.maxTokens ?? base?.maxTokens ?? request.defaultMaxTokens;
    if (!Number.isInteger(maxTokens) || maxTokens <= 0) {
      invalid(provider, `model "${entry.id}" maxTokens must be a positive integer`);
    }
    if (entry.maxTokens !== void 0) configuredMaxTokens.set(entry.id, entry.maxTokens);
    return {
      // The installed entry lays the floor, and the fields below override it.
      // Enumerating instead would silently drop every `Model` field this
      // package does not model — reasoning-level spellings, compatibility
      // quirks, model headers, and whatever a pi-ai upgrade adds next. Spread,
      // never enumerate.
      ...base,
      id: entry.id,
      name: entry.name ?? base?.name ?? entry.id,
      api,
      provider,
      baseUrl,
      input: declaredInput(entry.input) ?? base?.input ?? [...request.defaultInput],
      cost: base?.cost ?? NO_COST,
      contextWindow,
      maxTokens,
      ...resolveModelReasoning(provider, entry, base),
      ...resolveModelCompat(provider, entry, request.compat, base, api)
    };
  };
  const models = [];
  for (const entry of entries) {
    let model;
    try {
      model = resolveEntry(entry);
    } catch (error) {
      if (validation === "strict" || !(error instanceof PiAiCatalogError)) throw error;
      modelErrors.set(entry.id, error.message);
      continue;
    }
    models.push(model);
  }
  const serviceableModels = models.filter((model) => !modelErrors.has(model.id));
  for (const [field] of configuredCompatEntries(request.compat)) {
    const takers = compatProtocols(field);
    if (serviceableModels.some((model) => takers.includes(model.api))) continue;
    invalid(provider, `sets compat "${field}", but no model on the route speaks a protocol that takes it; it exists on ${takers.join(", ")}`);
  }
  return { models: serviceableModels, configuredMaxTokens, modelErrors };
}

// src/runtime/provider.ts
import { anthropicMessagesApi } from "@earendil-works/pi-ai/api/anthropic-messages.lazy";
import { openAICompletionsApi } from "@earendil-works/pi-ai/api/openai-completions.lazy";
import { openAIResponsesApi } from "@earendil-works/pi-ai/api/openai-responses.lazy";

// src/runtime/models.ts
import { builtinModels } from "@earendil-works/pi-ai/providers/all";
function createModels(options) {
  const models = builtinModels(options);
  models.clearProviders();
  return models;
}
function createProvider(input) {
  return {
    id: input.id,
    name: input.name,
    ...input.baseUrl === void 0 ? {} : { baseUrl: input.baseUrl },
    auth: input.auth,
    getModels: () => input.models,
    stream: (model, context, options) => input.api.stream(model, context, options),
    streamSimple: (model, context, options) => input.api.streamSimple(model, context, options)
  };
}
function getSupportedThinkingLevels(model) {
  if (!model.reasoning) return ["off"];
  return THINKING_LEVELS.filter((level) => {
    const mapped = model.thinkingLevelMap?.[level];
    if (mapped === null) return false;
    if (level === "xhigh" || level === "max") return mapped !== void 0;
    return true;
  });
}
function conversationUpdates(model) {
  const compat = model.compat;
  if (compat === void 0 || !("supportsMidConvoSystemMessages" in compat) || !compat.supportsMidConvoSystemMessages) return {};
  const updates = { systemPromptUpdate: "in-history" };
  if (model.api === "anthropic-messages" && "supportsMidConvoToolChanges" in compat && compat.supportsMidConvoToolChanges) {
    updates.toolUpdate = "in-history";
  } else if (model.api === "openai-completions" && "supportsMidConvoToolAdditions" in compat && compat.supportsMidConvoToolAdditions) {
    updates.toolUpdate = "addition-only";
  } else if ((model.api === "openai-responses" || model.api === "azure-openai-responses" || model.api === "openai-codex-responses") && ("supportsAdditionalTools" in compat && compat.supportsAdditionalTools || "supportsToolSearch" in compat && compat.supportsToolSearch)) {
    updates.toolUpdate = "addition-only";
  }
  return updates;
}

// src/runtime/provider.ts
var PROTOCOLS = {
  "openai-completions": openAICompletionsApi,
  "openai-responses": openAIResponsesApi,
  "anthropic-messages": anthropicMessagesApi
};
function supportedProtocols() {
  return Object.keys(PROTOCOLS);
}
function harnessApiKeyAuth(name2) {
  return {
    name: name2,
    resolve: ({ credential }) => Promise.resolve({
      auth: credential?.key === void 0 ? {} : { apiKey: credential.key },
      source: name2
    })
  };
}
function routeAuth(spec, catalog) {
  if (catalog === void 0) return { apiKey: harnessApiKeyAuth(spec.displayName) };
  if (catalog.auth.apiKey !== void 0 || !spec.namesCredential) return catalog.auth;
  return { ...catalog.auth, apiKey: harnessApiKeyAuth(spec.displayName) };
}
function reuseCatalogProvider(base, spec) {
  const baseUrl = spec.baseURL ?? base.baseUrl;
  return {
    id: spec.provider,
    name: spec.displayName,
    ...baseUrl === void 0 ? {} : { baseUrl },
    auth: routeAuth(spec, base),
    getModels: () => spec.models,
    // Delegated rather than copied: the catalog provider stays the receiver, so
    // an implementation holding state on itself keeps working.
    stream: (model, context, options) => base.stream(model, context, options),
    streamSimple: (model, context, options) => base.streamSimple(model, context, options)
  };
}
function buildProvider(spec) {
  const catalog = catalogProvider(spec.provider);
  if (catalog !== void 0 && spec.api === void 0) return reuseCatalogProvider(catalog, spec);
  const factory = spec.api === void 0 ? void 0 : PROTOCOLS[spec.api];
  if (factory === void 0) {
    throw new PiAiCatalogError(
      `llm-pi-ai: provider "${spec.provider}" names api "${spec.api}", which this build cannot serve; supported protocols are ${supportedProtocols().join(", ")}`
    );
  }
  return createProvider({
    id: spec.provider,
    name: spec.displayName,
    ...spec.baseURL === void 0 ? {} : { baseUrl: spec.baseURL },
    auth: routeAuth(spec, catalog),
    models: spec.models,
    api: factory()
  });
}

// src/runtime/fast.ts
import { buildBaseOptions } from "@earendil-works/pi-ai/api/simple-options";
var GPT_FAST_IDS = [
  "gpt-5.5",
  "gpt-5.6-sol",
  "gpt-5.6-terra",
  "gpt-5.6-luna",
  "gpt-6-astra",
  "gpt-6-sol",
  "gpt-6-luna",
  "gpt-6.1-sol"
];
var API_FAST_IDS = /* @__PURE__ */ new Set(["gpt-5", "gpt-5-mini", "gpt-5.1", "gpt-5.2", "gpt-5.4", "gpt-5.4-mini", ...GPT_FAST_IDS]);
var CODEX_FAST_IDS = new Set(GPT_FAST_IDS);
function supportsFastTier(provider, model) {
  const supported = provider === "openai" ? API_FAST_IDS : provider === "openai-codex" ? CODEX_FAST_IDS : void 0;
  if (!supported?.has(model.id)) return false;
  const original = catalogProvider(provider)?.getModels().find((entry) => entry.id === model.id);
  return original !== void 0 && model.api === original.api && model.baseUrl.replace(/\/+$/, "") === original.baseUrl.replace(/\/+$/, "");
}
function fastModelId(model) {
  return `${model}::fast`;
}
function modelChoices(provider, models, profile2, discoveredIds = /* @__PURE__ */ new Set()) {
  const ids = new Set(models.map((model) => model.id));
  const configuredIds = new Set(profile2.models?.map((model) => model.id) ?? []);
  return models.flatMap((model) => {
    const supported = supportsFastTier(provider, model);
    const ordinary = {
      id: model.id,
      name: model.name,
      model,
      enabled: !profile2.disabledModels?.includes(model.id) && (!discoveredIds.has(model.id) || profile2.enabledDiscoveredModels?.includes(model.id) === true || configuredIds.has(model.id)),
      ...discoveredIds.has(model.id) ? { discovered: true } : {},
      ...supported ? { serviceTier: "default" } : {}
    };
    if (!supported) return [ordinary];
    const id = fastModelId(model.id);
    if (ids.has(id)) throw new PiAiCatalogError(`Fast model ID "${id}" conflicts with a configured model`);
    return [ordinary, {
      id,
      name: `${model.name} Fast`,
      model,
      enabled: profile2.enabledFastModels?.includes(id) === true,
      serviceTier: "priority"
    }];
  });
}
function streamWithTier(models, model, context, options, serviceTier) {
  const full = {
    ...buildBaseOptions(model, context, options, options.apiKey),
    ...options.reasoning === void 0 ? {} : { reasoningEffort: options.reasoning },
    ...options.toolChoice === void 0 ? {} : { toolChoice: options.toolChoice },
    serviceTier
  };
  if (model.api === "openai-responses") return models.stream(model, context, full);
  if (model.api === "openai-codex-responses") return models.stream(model, context, full);
  throw new Error("Fast choices require an OpenAI Responses API");
}

// src/catalog-metadata.mjs
var DISCOVERED_MODEL = /* @__PURE__ */ Symbol("dsh-pi-login/discovered-model");

// src/runtime/config.ts
var DEFAULT_STREAM_IDLE_TIMEOUT_MS = 3e5;
var DEFAULT_MAX_REQUEST_IMAGE_BYTES = 20 * 1024 * 1024;
var DEFAULT_REQUEST_IMAGE_PIXEL_BUDGET = 2048 * 2048;
var DEFAULT_REQUEST_IMAGE_MAX_BYTES = 1024 * 1024;
var DEFAULT_CONTEXT_WINDOW = 262144;
var DEFAULT_MAX_TOKENS = 32768;
var DEFAULT_INPUT = ["text"];
var thinkingBudgets = z.object({
  minimal: z.number(),
  low: z.number(),
  medium: z.number(),
  high: z.number()
});
var chatTemplateKwarg = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.const(null),
  z.object({
    $var: z.union(CHAT_TEMPLATE_VARS).required(),
    omitWhenOff: z.boolean()
  })
]);
var compatProfile = z.object({
  supportsStore: z.boolean(),
  supportsDeveloperRole: z.boolean(),
  supportsReasoningEffort: z.boolean(),
  supportsUsageInStreaming: z.boolean(),
  supportsFinishReason: z.boolean(),
  maxTokensField: z.union(MAX_TOKENS_FIELDS),
  requiresToolResultName: z.boolean(),
  requiresAssistantAfterToolResult: z.boolean(),
  requiresThinkingAsText: z.boolean(),
  requiresReasoningContentOnAssistantMessages: z.boolean(),
  thinkingFormat: z.union(SUPPORTED_THINKING_FORMATS),
  chatTemplateKwargs: z.dict(chatTemplateKwarg),
  chatTemplateArgs: z.dict(chatTemplateKwarg),
  supportsThinkingTokenBudget: z.boolean(),
  thinkingTokenBudgetField: z.union(THINKING_TOKEN_BUDGET_FIELDS),
  vllmPriority: z.number().step(1),
  supportsMaxOutputTokens: z.boolean(),
  supportsStrictMode: z.boolean(),
  cacheControlFormat: z.union(CACHE_CONTROL_FORMATS),
  supportsLongCacheRetention: z.boolean(),
  supportsEagerToolInputStreaming: z.boolean(),
  supportsCacheControlOnTools: z.boolean(),
  supportsTemperature: z.boolean(),
  forceAdaptiveThinking: z.boolean(),
  allowEmptySignature: z.boolean(),
  supportsStrictTools: z.boolean()
});
var reasoningEfforts = z.dict(
  z.union([z.string(), z.const(null)]),
  z.union(THINKING_LEVELS)
);
var modelFields = {
  name: z.string(),
  contextWindow: z.number().step(1).min(1),
  maxTokens: z.number().step(1).min(1),
  // No explicit default, unlike the route's `defaultInput`: schemastery
  // materializes `[]` for an absent array, and resolution reads that as "no
  // answer here" so the catalog entry below still applies.
  input: z.array(z.union(MODALITIES)),
  // The union, not a bare dict: schemastery materializes an absent dict as
  // `{}`, and absent must stay distinguishable — it means "inherit the
  // installed catalog's capability", while `false` disables reasoning.
  reasoningEfforts: z.union([z.const(false), reasoningEfforts]),
  compat: compatProfile
};
var modelProfile = z.object({
  id: z.string().required(),
  ...modelFields
});
var modelOverride = z.object(modelFields);
var profile = z.object({
  enabled: z.boolean().default(true),
  disabledModels: z.array(z.string()),
  enabledFastModels: z.array(z.string()),
  enabledDiscoveredModels: z.array(z.string()),
  apiKeyEnv: z.string().role("credential-ref"),
  displayName: z.string(),
  api: z.union(supportedProtocols()),
  baseURL: z.string(),
  models: z.array(modelProfile),
  modelOverrides: z.dict(modelOverride),
  compat: compatProfile,
  defaultContextWindow: z.number().step(1).min(1).default(DEFAULT_CONTEXT_WINDOW),
  defaultMaxTokens: z.number().step(1).min(1).default(DEFAULT_MAX_TOKENS),
  defaultInput: z.array(z.union(MODALITIES)).default([...DEFAULT_INPUT]),
  headers: z.dict(z.string()),
  reasoning: z.union(THINKING_LEVELS),
  thinkingBudgets,
  cacheRetention: z.union(["none", "short", "long"]),
  transport: z.union(["sse", "websocket", "websocket-cached", "auto"]),
  timeoutMs: z.natural(),
  websocketConnectTimeoutMs: z.natural(),
  streamIdleTimeoutMs: z.number().min(Number.MIN_VALUE).max(MAX_TIMER_DELAY_MS2).default(DEFAULT_STREAM_IDLE_TIMEOUT_MS),
  maxRequestImageBytes: z.number().step(1).min(1).default(DEFAULT_MAX_REQUEST_IMAGE_BYTES),
  requestImagePixelBudget: z.number().step(1).min(1).default(DEFAULT_REQUEST_IMAGE_PIXEL_BUDGET),
  requestImageMaxBytes: z.number().step(1).min(1).default(DEFAULT_REQUEST_IMAGE_MAX_BYTES),
  retryPolicy: RetryPolicySchema
});
var Config = z.object({
  legacyImported: z.boolean().default(false).volatile(),
  providers: z.dict(profile).default({}).volatile()
});
function assertServiceable(config, previous) {
  const changed = Object.fromEntries(Object.entries(config.providers ?? {}).filter(([provider, profile2]) => !deepEqualJson(profile2, previous?.providers?.[provider])));
  resolveProfiles(changed);
}
function rejectRemovedFields(provider, source) {
  const legacy = source;
  if ("provider" in legacy) {
    throw new Error(`llm-pi-ai: provider "${provider}" sets "provider", which moved to the providers dict key`);
  }
  if ("maxRetries" in legacy || "maxRetryDelayMs" in legacy) {
    throw new Error(
      `llm-pi-ai: provider "${provider}" sets maxRetries or maxRetryDelayMs, which were removed; compose agent recovery with dsh-llm-retry`
    );
  }
}
function assertValidHeaders(provider, headers) {
  for (const [name2, value] of Object.entries(headers ?? {})) {
    try {
      new Headers([[name2, value]]);
    } catch {
      throw new Error(
        `llm-pi-ai: provider "${provider}" header "${name2}" is not valid for Fetch; use a valid HTTP field name and a single-line value representable as bytes`
      );
    }
  }
}
function resolveProfiles(providers, validation = "strict", catalogs) {
  if (Array.isArray(providers)) {
    throw new Error("llm-pi-ai: providers is now a dict keyed by provider route, not an array of profiles");
  }
  const entries = Object.entries(providers ?? {});
  const resolved = /* @__PURE__ */ new Map();
  for (const [provider, source] of entries) {
    rejectRemovedFields(provider, source);
    if (provider.length === 0) throw new Error("llm-pi-ai: provider names must be non-empty");
    if (source.baseURL !== void 0 && source.baseURL.length === 0) {
      throw new Error(`llm-pi-ai: provider "${provider}" has an empty baseURL`);
    }
    if (source.displayName !== void 0 && source.displayName.length === 0) {
      throw new Error(`llm-pi-ai: provider "${provider}" has an empty displayName`);
    }
    assertValidHeaders(provider, source.headers);
    const streamIdleTimeoutMs = source.streamIdleTimeoutMs ?? DEFAULT_STREAM_IDLE_TIMEOUT_MS;
    if (!Number.isFinite(streamIdleTimeoutMs) || streamIdleTimeoutMs <= 0 || streamIdleTimeoutMs > MAX_TIMER_DELAY_MS2) {
      throw new Error(
        `llm-pi-ai: provider "${provider}" streamIdleTimeoutMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS2}`
      );
    }
    const maxRequestImageBytes = source.maxRequestImageBytes ?? DEFAULT_MAX_REQUEST_IMAGE_BYTES;
    if (!Number.isInteger(maxRequestImageBytes) || maxRequestImageBytes <= 0) {
      throw new Error(`llm-pi-ai: provider "${provider}" maxRequestImageBytes must be a positive integer`);
    }
    const requestImagePixelBudget = source.requestImagePixelBudget ?? DEFAULT_REQUEST_IMAGE_PIXEL_BUDGET;
    if (!Number.isSafeInteger(requestImagePixelBudget) || requestImagePixelBudget <= 0) {
      throw new Error(`llm-pi-ai: provider "${provider}" requestImagePixelBudget must be a positive safe integer`);
    }
    const requestImageMaxBytes = source.requestImageMaxBytes ?? DEFAULT_REQUEST_IMAGE_MAX_BYTES;
    if (!Number.isSafeInteger(requestImageMaxBytes) || requestImageMaxBytes <= 0) {
      throw new Error(`llm-pi-ai: provider "${provider}" requestImageMaxBytes must be a positive safe integer`);
    }
    const defaultInput = [...source.defaultInput ?? DEFAULT_INPUT];
    if (defaultInput.length === 0) {
      throw new Error(`llm-pi-ai: provider "${provider}" defaultInput must name at least one modality`);
    }
    const displayName = source.displayName ?? provider;
    let choices = [];
    let catalog;
    let piProvider;
    let catalogError;
    try {
      catalog = resolveRouteModels({
        provider,
        ...source.api === void 0 ? {} : { api: source.api },
        ...source.baseURL === void 0 ? {} : { baseURL: source.baseURL },
        ...source.models === void 0 ? {} : { models: source.models },
        ...source.modelOverrides === void 0 ? {} : { modelOverrides: source.modelOverrides },
        ...source.compat === void 0 ? {} : { compat: source.compat },
        defaultInput,
        defaultContextWindow: source.defaultContextWindow ?? DEFAULT_CONTEXT_WINDOW,
        defaultMaxTokens: source.defaultMaxTokens ?? DEFAULT_MAX_TOKENS
      }, validation, catalogs?.(provider));
      catalogError = catalog.modelErrors.values().next().value;
      const discovered = new Set(catalog.models.filter((model) => model[DISCOVERED_MODEL]).map((model) => model.id));
      choices = modelChoices(provider, catalog.models, source, discovered);
      const enabledIds = new Set(choices.filter((choice) => choice.enabled).map((choice) => choice.model.id));
      piProvider = buildProvider({
        provider,
        displayName,
        ...source.api === void 0 ? {} : { api: source.api },
        ...source.baseURL === void 0 ? {} : { baseURL: source.baseURL },
        models: catalog.models.filter((model) => enabledIds.has(model.id)),
        namesCredential: source.apiKeyEnv !== void 0
      });
    } catch (error) {
      if (validation === "strict" || !(error instanceof PiAiCatalogError)) throw error;
      catalogError ??= error.message;
    }
    const { apiKeyEnv, retryPolicy, models: _models, displayName: _displayName, ...rest } = source;
    resolved.set(provider, {
      ...rest,
      provider,
      displayName,
      ...apiKeyEnv === void 0 ? {} : { apiKeyEnv: credentialRef(apiKeyEnv) },
      streamIdleTimeoutMs,
      maxRequestImageBytes,
      requestImagePixelBudget,
      requestImageMaxBytes,
      retryPolicy: resolveRetryPolicy(retryPolicy, `llm-pi-ai: provider "${provider}" retryPolicy`),
      ...rest.headers === void 0 ? {} : { headers: { ...rest.headers } },
      ...rest.thinkingBudgets === void 0 ? {} : { thinkingBudgets: { ...rest.thinkingBudgets } },
      configuredMaxTokens: catalog?.configuredMaxTokens ?? /* @__PURE__ */ new Map(),
      modelChoices: choices,
      modelErrors: catalog?.modelErrors ?? /* @__PURE__ */ new Map(),
      ...piProvider === void 0 ? {} : { piProvider },
      ...catalogError === void 0 ? {} : { catalogError }
    });
  }
  return resolved;
}

// src/runtime/context.ts
function flattenText(message) {
  return message.content.filter((block) => block.type === "text").map((block) => block.text).join("");
}
function toolResultOf(message, toolNames, content) {
  return {
    role: "toolResult",
    toolCallId: message.toolCallId,
    toolName: toolNames.get(message.toolCallId) ?? "unknown",
    content: typeof content === "string" ? [{ type: "text", text: content || "(no output)" }] : content,
    isError: message.isError ?? false,
    timestamp: 0
  };
}
function assertSupportedHistory(messages) {
  for (const message of messages) {
    if (message.role !== "developer" && message.content.some((block) => block.type === "tool-addition" || block.type === "tool-removal")) {
      throw new LlmError2("Tool-change blocks require developer role", "UNSUPPORTED_CONTENT");
    }
    if (message.role !== "user" && message.role !== "tool" && contentHasImage(message.content)) {
      throw new LlmError2(
        `pi-ai cannot represent an image in an in-history ${message.role} message`,
        "UNSUPPORTED_CONTENT"
      );
    }
    if (message.role === "system" && message.content.some((block) => block.type !== "text")) {
      throw new LlmError2("pi-ai cannot represent non-text system messages", "UNSUPPORTED_CONTENT");
    }
  }
}
function userContent(blocks, requestImages, resolveImageAccess) {
  const content = [];
  for (const block of blocks) {
    switch (block.type) {
      case "text":
        if (block.text.length > 0) content.push({ type: "text", text: block.text });
        break;
      case "image": {
        const version = requestImages.get(block.attachment.attachmentId);
        content.push({
          type: "text",
          text: requestImageHandleText(block.attachment, version, resolveImageAccess(block.attachment))
        });
        content.push({
          type: "image",
          data: Buffer.from(version.data).toString("base64"),
          mimeType: version.mediaType
        });
        break;
      }
      default:
        break;
    }
  }
  if (content.every((block) => block.type === "text")) return content.map((block) => block.text).join("");
  return content;
}
function collectImageRefs(blocks, refs) {
  for (const block of blocks) {
    if (block.type === "image") {
      if (block.offloaded !== true) refs.set(block.attachment.attachmentId, block.attachment);
    }
  }
}
async function prepareRequestImages(messages, attachments, budget, signal) {
  const refs = /* @__PURE__ */ new Map();
  for (const message of messages) collectImageRefs(message.content, refs);
  const orderedRefs = [...refs.values()];
  const prepared = await Promise.all(orderedRefs.map(
    (ref) => attachments.readImageRequest(ref, requestImageTarget(ref, budget), signal)
  ));
  const versions = /* @__PURE__ */ new Map();
  for (const [index, ref] of orderedRefs.entries()) {
    versions.set(ref.attachmentId, prepared[index]);
  }
  return versions;
}
function piTool(tool) {
  return { name: tool.name, description: tool.description, parameters: tool.parameters };
}
function toolsOf(options) {
  return options.tools?.filter((tool) => !tool.deferLoading).map(piTool);
}
function splitSystemPrompt(options) {
  const text = [options.system];
  let end = 0;
  for (const message of options.messages) {
    if (message.role !== "system") break;
    text.push(flattenText(message));
    end++;
  }
  const systemPrompt = text.filter(Boolean).join("\n\n");
  return { systemPrompt: systemPrompt || void 0, messages: options.messages.slice(end) };
}
function piContext(systemPrompt, options, messages) {
  const tools = toolsOf(options);
  return {
    ...systemPrompt !== void 0 ? { systemPrompt } : {},
    messages,
    ...tools !== void 0 && tools.length > 0 ? { tools } : {}
  };
}
function appendDeveloper(message, options, messages) {
  const content = [];
  const toolsAdded = [];
  const toolsRemoved = [];
  for (const block of message.content) {
    switch (block.type) {
      case "text":
        if (block.text.length > 0) content.push({ type: "text", text: block.text });
        break;
      case "tool-addition": {
        const tool = options.tools?.find((tool2) => tool2.name === block.toolName);
        if (tool === void 0) throw new LlmError2(`pi-ai tool update references undeclared tool "${block.toolName}"`, "INVALID_REQUEST");
        toolsAdded.push(piTool(tool));
        break;
      }
      case "tool-removal":
        toolsRemoved.push({ name: block.toolName });
        break;
      default:
        throw new LlmError2(`pi-ai cannot represent developer content ${block.type}`, "UNSUPPORTED_CONTENT");
    }
  }
  if (content.length === 0 && toolsAdded.length === 0 && toolsRemoved.length === 0) return;
  messages.push({
    role: "system",
    content,
    timestamp: 0,
    ...toolsAdded.length === 0 ? {} : { toolsAdded },
    ...toolsRemoved.length === 0 ? {} : { toolsRemoved }
  });
}
function appendAssistant(message, messages, toolNames, onReplayDegrade) {
  const assistant = toPiAssistant(message, onReplayDegrade);
  for (const block of assistant.content) {
    if (block.type === "toolCall") toolNames.set(brandString(block.id), block.name);
  }
  messages.push(assistant);
}
function appendSharedHistory(message, options, messages, toolNames, onReplayDegrade) {
  if (message.role === "developer") {
    appendDeveloper(message, options, messages);
    return true;
  }
  if (message.role === "system") {
    const content = flattenText(message);
    if (content.length > 0) messages.push({ role: "system", content, timestamp: 0 });
    return true;
  }
  if (message.role === "assistant") {
    appendAssistant(message, messages, toolNames, onReplayDegrade);
    return true;
  }
  return false;
}
function textOnlyContext(options, onReplayDegrade) {
  assertSupportedHistory(options.messages);
  const split = splitSystemPrompt(options);
  const toolNames = /* @__PURE__ */ new Map();
  const messages = [];
  for (const message of split.messages) {
    if (contentHasImage(message.content)) {
      throw new LlmError2("pi-ai image conversion requires the durable attachment service", "UNSUPPORTED_CONTENT");
    }
    if (appendSharedHistory(message, options, messages, toolNames, onReplayDegrade)) continue;
    if (message.role === "tool") {
      messages.push(toolResultOf(message, toolNames, flattenText(message)));
      continue;
    }
    messages.push({ role: "user", content: flattenText(message), timestamp: 0 });
  }
  return piContext(split.systemPrompt, options, messages);
}
function requestImageTarget(ref, budget) {
  return { ...requestImageDimensions(ref.width, ref.height, budget.maxPixels), maxBytes: budget.maxBytes };
}
function toPiContext(options, images, onReplayDegrade) {
  return images === void 0 ? textOnlyContext(options, onReplayDegrade) : toPiContextWithImages(options, images, onReplayDegrade);
}
async function toPiContextWithImages(options, images, onReplayDegrade) {
  const { attachments, resolveImageAccess, maxRequestImageBytes } = images;
  const requestImagePolicy = images.requestImagePolicy ?? {
    maxPixels: DEFAULT_REQUEST_IMAGE_PIXEL_BUDGET,
    maxBytes: DEFAULT_REQUEST_IMAGE_MAX_BYTES
  };
  assertSupportedHistory(options.messages);
  const split = splitSystemPrompt(options);
  const requestImages = await prepareRequestImages(split.messages, attachments, requestImagePolicy, options.signal);
  if (maxRequestImageBytes !== void 0) {
    const offloadImages = requiredImageOffload(
      split.messages,
      { representation: "base64", maxBytes: maxRequestImageBytes },
      (block) => requestImages.get(block.attachment.attachmentId).bytes
    );
    if (offloadImages > 0) {
      throw new LlmError2(
        `pi-ai request images exceed the ${maxRequestImageBytes}-byte base64 bound; ${offloadImages} more oldest occurrence(s) must be offloaded.`,
        IMAGE_OFFLOAD_REQUIRED_CODE,
        { offloadImages }
      );
    }
  }
  const exactMessages = projectOffloadedImages(
    split.messages,
    (ref) => offloadedImageText(ref, resolveImageAccess(ref))
  );
  const toolNames = /* @__PURE__ */ new Map();
  const messages = [];
  for (const message of exactMessages) {
    if (appendSharedHistory(message, options, messages, toolNames, onReplayDegrade)) continue;
    if (message.role === "tool") {
      messages.push(toolResultOf(message, toolNames, userContent(message.content, requestImages, resolveImageAccess)));
      continue;
    }
    const content = userContent(message.content, requestImages, resolveImageAccess);
    messages.push({ role: "user", content, timestamp: 0 });
  }
  return piContext(split.systemPrompt, options, messages);
}

// src/runtime/stream.ts
import { brandString as brandString2 } from "@deepseek-ai/dsh-brand";
import { CONTEXT_WINDOW_EXCEEDED_CODE, EMPTY_RESPONSE_CODE, isContextWindowExceededError, isQuotaExceededError, LlmError as LlmError3, QUOTA_EXCEEDED_CODE } from "@deepseek-ai/dsh-llm";
import { isContextOverflow } from "@earendil-works/pi-ai/utils/overflow";
function mapUsage(usage) {
  return {
    inputTokens: usage.input,
    outputTokens: usage.output,
    totalTokens: usage.totalTokens,
    ...usage.cacheRead > 0 ? { cacheReadTokens: usage.cacheRead } : {},
    ...usage.cacheWrite > 0 ? { cacheWriteTokens: usage.cacheWrite } : {}
  };
}
function classifyPiAiError(message) {
  if (/\b(?:401|403)\b/.test(message)) return "AUTH";
  if (isQuotaExceededError(message)) return QUOTA_EXCEEDED_CODE;
  if (/\b429\b|rate.?limit/i.test(message)) return "RATE_LIMIT";
  if (/\b413\b|failed to buffer the request body:\s*length limit exceeded|payload too large|request body too large/i.test(message)) return "INVALID_REQUEST";
  if (/\b400\b|invalid.?request/i.test(message)) return "INVALID_REQUEST";
  if (/\b5\d\d\b/.test(message)) return "SERVER";
  if (/\btime(?:d)?\s*out\b|timeout/i.test(message)) return "TIMEOUT";
  if (/stream ended (?:before|without)\b/i.test(message)) return "TRANSPORT";
  if (/\b(?:network|connection|socket|fetch)\b|\bECONN[A-Z]+\b/i.test(message) || /\b(?:other side closed|HTTP2 request did not get a response|WebSocket closed unexpectedly)\b/i.test(message) || /\bterminated\b|premature close/i.test(message)) {
    return "TRANSPORT";
  }
  return "PI_AI_ERROR";
}
function mapStopReason(message, contextWindow) {
  const piAiOverflow = isContextOverflow(message, contextWindow);
  const harnessOverflow = message.stopReason === "error" && message.errorMessage !== void 0 && isContextWindowExceededError(message.errorMessage);
  if (piAiOverflow || harnessOverflow) {
    return {
      kind: "error",
      failure: {
        message: message.errorMessage ?? `pi-ai detected context overflow for model "${message.model}"`,
        code: CONTEXT_WINDOW_EXCEEDED_CODE
      }
    };
  }
  switch (message.stopReason) {
    case "stop":
      if (message.content.length === 0) {
        return {
          kind: "error",
          failure: {
            message: `model "${message.model}" returned a completed response with no content`,
            code: EMPTY_RESPONSE_CODE
          }
        };
      }
      return { kind: "stop" };
    case "length":
      return { kind: "max-tokens" };
    case "toolUse":
      return { kind: "tool-calls" };
    case "pending":
      return {
        kind: "error",
        failure: { message: `pi-ai stream for model "${message.model}" ended pending`, code: "PI_AI_ERROR" }
      };
    case "deferred":
      return {
        kind: "error",
        failure: { message: `pi-ai deferred response for model "${message.model}" is not supported`, code: "PI_AI_ERROR" }
      };
    case "aborted":
      return {
        kind: "aborted",
        failure: { message: message.errorMessage ?? "pi-ai stream aborted", code: "ABORTED" }
      };
    case "error": {
      const text = message.errorMessage ?? "pi-ai stream error";
      return { kind: "error", failure: { message: text, code: classifyPiAiError(text) } };
    }
  }
}
async function* toStreamChunks(events, contextWindow, callerSignal, requestedModel) {
  const toolIds = /* @__PURE__ */ new Map();
  for await (const event of events) {
    switch (event.type) {
      case "start":
        break;
      case "text_start":
        yield { type: "block-start", index: event.contentIndex, blockType: "text" };
        break;
      case "text_delta":
        yield { type: "text-delta", index: event.contentIndex, text: event.delta };
        break;
      case "text_end":
        yield { type: "block-end", index: event.contentIndex, block: { type: "text", text: event.content } };
        break;
      case "thinking_start":
        yield { type: "block-start", index: event.contentIndex, blockType: "reasoning" };
        break;
      case "thinking_delta":
        yield { type: "reasoning-delta", index: event.contentIndex, text: event.delta };
        break;
      case "thinking_end":
        yield { type: "block-end", index: event.contentIndex, block: { type: "reasoning", text: event.content } };
        break;
      case "toolcall_start": {
        const partial = event.partial.content[event.contentIndex];
        const id = partial?.type === "toolCall" ? partial.id : "";
        const name2 = partial?.type === "toolCall" ? partial.name : "";
        toolIds.set(event.contentIndex, { id, name: name2 });
        yield { type: "block-start", index: event.contentIndex, blockType: "tool-call" };
        break;
      }
      case "toolcall_delta": {
        const known = toolIds.get(event.contentIndex);
        yield {
          type: "tool-call-delta",
          index: event.contentIndex,
          id: brandString2(known?.id ?? ""),
          ...known?.name !== void 0 && known.name.length > 0 ? { name: known.name } : {},
          argumentsDelta: event.delta
        };
        break;
      }
      case "toolcall_end":
        yield {
          type: "block-end",
          index: event.contentIndex,
          block: {
            type: "tool-call",
            id: brandString2(event.toolCall.id),
            name: event.toolCall.name,
            // pi-ai hands back the PARSED arguments; the harness vocabulary
            // keeps the raw string.
            arguments: JSON.stringify(event.toolCall.arguments)
          }
        };
        break;
      case "done":
        yield { type: "usage", usage: mapUsage(event.message.usage) };
        yield {
          type: "finish",
          reason: mapStopReason(event.message, contextWindow),
          replayState: toPiReplayState(event.message, requestedModel)
        };
        return;
      case "error":
        yield { type: "usage", usage: mapUsage(event.error.usage) };
        yield {
          type: "finish",
          reason: mapStopReason(
            callerSignal?.aborted ? { ...event.error, stopReason: "aborted" } : event.error,
            contextWindow
          )
        };
        return;
    }
  }
  throw new LlmError3("pi-ai event stream ended without done/error", "STREAM_CLOSED");
}

// src/runtime/adapter.ts
var ANTHROPIC_TOOL_UPDATE_PLACEHOLDER = {
  name: "DeferredToolPlaceholder",
  description: "Reserved placeholder that keeps deferred tool loading active; never call this tool.",
  parameters: { type: "object", properties: {} }
};
function profileOptions(profile2, reasoning, apiKey) {
  const enabledReasoning = reasoning === "off" ? void 0 : reasoning;
  return {
    ...apiKey === void 0 ? {} : { apiKey },
    ...enabledReasoning === void 0 ? {} : { reasoning: enabledReasoning },
    ...profile2.thinkingBudgets === void 0 ? {} : { thinkingBudgets: profile2.thinkingBudgets },
    ...profile2.cacheRetention === void 0 ? {} : { cacheRetention: profile2.cacheRetention },
    ...profile2.transport === void 0 ? {} : { transport: profile2.transport },
    ...profile2.timeoutMs === void 0 ? {} : { timeoutMs: profile2.timeoutMs },
    ...profile2.websocketConnectTimeoutMs === void 0 ? {} : { websocketConnectTimeoutMs: profile2.websocketConnectTimeoutMs },
    // The agent recovery layer owns visible attempts; one adapter call is one SDK attempt.
    maxRetries: 0
  };
}
function describableReasoningLevel(model, effort) {
  if (effort === void 0) return void 0;
  return getSupportedThinkingLevels(model).some((level) => level === effort) ? effort : void 0;
}
function resolveReasoningLevel(model, effort) {
  if (effort === void 0) return void 0;
  const supported = getSupportedThinkingLevels(model);
  if (supported.some((level) => level === effort)) return effort;
  throw new LlmError4(
    `pi-ai provider "${model.provider}" model "${model.id}" does not support reasoning effort "${effort}"`,
    "UNSUPPORTED_REASONING_EFFORT"
  );
}
function reasoningInfo(model, defaultLevel) {
  if (!model.reasoning) return {};
  const levels = getSupportedThinkingLevels(model);
  return {
    reasoning: {
      efforts: levels.map((level) => ({
        id: ReasoningEffortId(level),
        name: `${level.charAt(0).toUpperCase()}${level.slice(1)}`
      })),
      ...defaultLevel === void 0 ? {} : { defaultEffort: ReasoningEffortId(defaultLevel) }
    }
  };
}
function requestHeaders(headers) {
  const attribution = attributionHeaders();
  const reserved = new Set(Object.keys(attribution).map((name2) => name2.toLowerCase()));
  return {
    ...Object.fromEntries(Object.entries(headers ?? {}).filter(([name2]) => !reserved.has(name2.toLowerCase()))),
    ...attribution
  };
}
var PiAiAdapter = class extends LlmAdapter {
  constructor(config) {
    super();
    this.config = config;
  }
  config;
  snapshot;
  /**
   * The snapshot for the current profiles. Resolution memoizes its result, so
   * an unchanged configuration is recognized by identity; a changed one gets a
   * brand-new collection, leaving any snapshot an operation already captured
   * untouched for as long as that operation holds it.
   */
  current() {
    const profiles = this.config.profiles();
    if (this.snapshot?.profiles === profiles) return this.snapshot;
    const models = createModels(this.config.auth);
    for (const profile2 of profiles.values()) {
      if (profile2.piProvider !== void 0) models.setProvider(profile2.piProvider);
    }
    this.snapshot = { profiles, models };
    return this.snapshot;
  }
  /** The profile for one route within one snapshot, or the not-owned failure. */
  profileOf(snapshot, provider) {
    const profile2 = snapshot.profiles.get(provider);
    if (profile2 === void 0) {
      throw new LlmError4(`pi-ai adapter does not own provider "${provider}"`, "NO_ADAPTER");
    }
    return profile2;
  }
  /** The configured descriptor for one exact route/model pair within one snapshot. */
  modelOf(snapshot, provider, model) {
    const profile2 = this.profileOf(snapshot, provider);
    const failure = profile2.modelErrors.get(model) ?? (profile2.piProvider === void 0 ? profile2.catalogError : void 0);
    if (failure !== void 0) throw new LlmError4(failure, "INVALID_CONFIG");
    const resolved = profile2.modelChoices.find((choice) => choice.id === model && choice.enabled);
    if (resolved === void 0) {
      throw new LlmError4(`pi-ai provider "${provider}" has no configured model "${model}"`, "UNKNOWN_MODEL");
    }
    return resolved;
  }
  providerInfo(provider) {
    return { id: provider, name: this.current().profiles.get(provider)?.displayName ?? provider };
  }
  providerRetryPolicy(provider) {
    return this.current().profiles.get(provider)?.retryPolicy;
  }
  listModels(provider) {
    return Promise.resolve().then(() => {
      const snapshot = this.current();
      const profile2 = this.profileOf(snapshot, provider);
      if (profile2.piProvider === void 0) return [];
      return profile2.modelChoices.filter((choice) => choice.enabled).map((choice) => ({
        provider,
        id: choice.id,
        name: choice.name,
        inputModalities: [...choice.model.input]
      }));
    });
  }
  resolveModel(provider, model, _signal) {
    return Promise.resolve().then(() => {
      const snapshot = this.current();
      return this.modelInfo(snapshot, provider, model);
    });
  }
  modelInfo(snapshot, provider, model) {
    const profile2 = this.profileOf(snapshot, provider);
    const choice = this.modelOf(snapshot, provider, model);
    const resolvedModel = choice.model;
    const defaultLevel = describableReasoningLevel(resolvedModel, profile2.reasoning);
    const configuredMaxTokens = profile2.configuredMaxTokens.get(resolvedModel.id);
    return {
      provider,
      id: model,
      name: choice.name,
      inputModalities: [...resolvedModel.input],
      context: { contextWindow: resolvedModel.contextWindow },
      ...configuredMaxTokens === void 0 ? {} : { defaultMaxTokens: configuredMaxTokens },
      ...reasoningInfo(resolvedModel, defaultLevel),
      ...conversationUpdates(resolvedModel)
    };
  }
  prepareCall(provider, model, _signal) {
    const snapshot = this.current();
    return Promise.resolve({
      model: this.modelInfo(snapshot, provider, model),
      stream: (options) => this.streamWithSnapshot(options, snapshot)
    });
  }
  stream(options) {
    return this.streamWithSnapshot(options, this.current());
  }
  async *streamWithSnapshot(options, snapshot) {
    var _stack = [];
    try {
      if (options.stop !== void 0) {
        throw new LlmError4("llm-pi-ai does not support GenerateOptions.stop", "UNSUPPORTED_OPTION");
      }
      const profile2 = this.profileOf(snapshot, options.provider);
      const choice = this.modelOf(snapshot, options.provider, options.model);
      const model = choice.model;
      const updates = conversationUpdates(model);
      const tools = options.tools ?? [];
      const needsPlaceholder = model.api === "anthropic-messages" && updates.toolUpdate === "in-history" && tools.every((tool) => tool.deferLoading === true) && options.messages.some((message) => message.role === "developer" && message.content.some((block) => block.type === "tool-addition" || block.type === "tool-removal"));
      const request = needsPlaceholder ? { ...options, tools: [ANTHROPIC_TOOL_UPDATE_PLACEHOLDER, ...tools] } : options;
      const reasoning = resolveReasoningLevel(
        model,
        options.reasoningEffort ?? profile2.reasoning
      );
      const explicitKey = await this.config.resolveApiKey(options.provider, profile2);
      const accountAuthorization = await this.config.authorizeModel?.(options.provider, model, profile2);
      const apiKey = accountAuthorization?.apiKey ?? explicitKey;
      const consumer = new AbortController();
      const upstream = options.signal === void 0 ? consumer.signal : AbortSignal.any([options.signal, consumer.signal]);
      const streamIdleTimeoutMs = profile2.streamIdleTimeoutMs;
      const watchdog = __using(_stack, idleWatchdog(upstream, streamIdleTimeoutMs, "LLM_STREAM_IDLE_TIMEOUT"));
      try {
        const containsImage = options.messages.some((message) => contentHasImage2(message.content));
        if (containsImage && !model.input.includes("image")) {
          throw new LlmError4(`pi-ai model "${model.id}" does not support image input`, "UNSUPPORTED_CONTENT");
        }
        const attachments = containsImage ? this.config.resolveAttachments?.() : void 0;
        if (containsImage && attachments === void 0) {
          throw new LlmError4("pi-ai image input requires the durable attachment service", "UNSUPPORTED_CONTENT");
        }
        const onReplayDegrade = (reason) => {
          this.config.onReplayDegrade?.({ provider: options.provider, model: options.model, reason });
        };
        const context = attachments === void 0 ? toPiContext(request, void 0, onReplayDegrade) : await toPiContext({ ...request, signal: watchdog.signal }, {
          attachments,
          resolveImageAccess: (ref) => this.config.resolveImageAccess?.(attachments, ref),
          maxRequestImageBytes: profile2.maxRequestImageBytes,
          requestImagePolicy: {
            maxPixels: profile2.requestImagePixelBudget,
            maxBytes: profile2.requestImageMaxBytes
          }
        }, onReplayDegrade);
        const streamOptions = {
          ...profileOptions(profile2, reasoning, apiKey),
          ...options.temperature === void 0 ? {} : { temperature: options.temperature },
          ...options.maxTokens === void 0 ? {} : { maxTokens: options.maxTokens },
          ...options.sessionId === void 0 ? {} : { sessionId: String(options.sessionId) },
          signal: watchdog.signal,
          // Profile headers are deployment-owned; attribution names are
          // Harness-owned and therefore win collisions.
          headers: { ...requestHeaders(profile2.headers), ...accountAuthorization?.headers }
        };
        const events = choice.serviceTier !== void 0 ? streamWithTier(snapshot.models, model, context, streamOptions, choice.serviceTier) : snapshot.models.streamSimple(model, context, streamOptions);
        const iterator = toStreamChunks(events, model.contextWindow, options.signal, options.model)[Symbol.asyncIterator]();
        let exhausted = false;
        try {
          while (true) {
            const result = await watchdog.next(iterator);
            if (result.done) {
              exhausted = true;
              return;
            }
            yield result.value;
          }
        } finally {
          if (!exhausted) {
            consumer.abort("pi-ai stream consumer stopped");
            void iterator.return(void 0).catch(() => {
            });
          }
        }
      } catch (error) {
        if (timeoutOf(watchdog.signal, "LLM_STREAM_IDLE_TIMEOUT") !== void 0) {
          throw new LlmError4(`pi-ai stream idle timeout after ${streamIdleTimeoutMs}ms`, "TIMEOUT", { cause: error });
        }
        if (options.signal?.aborted) {
          throw new LlmError4("pi-ai request aborted by caller", "ABORTED", { cause: error });
        }
        throw error;
      } finally {
        consumer.abort("pi-ai stream consumer stopped");
      }
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
};

// src/runtime/auth.ts
import { homedir } from "node:os";
import { access } from "node:fs/promises";
import { resolve as resolvePath } from "node:path";
import {
  credentialKey,
  credentialKeyId,
  credentialKeyScope,
  credentialRef as credentialRef2,
  isCredentialKeySegment,
  isCredentialRefName
} from "@deepseek-ai/dsh-credentials";
import { launchEnvironmentOf } from "@deepseek-ai/dsh-launch-environment";
import { LlmError as LlmError5 } from "@deepseek-ai/dsh-llm";
var RECORD_SCOPE = "llm-pi-ai";
function recordKeyFor(providerId) {
  return credentialKey(RECORD_SCOPE, providerId);
}
function jsonImage(value) {
  if (Array.isArray(value)) return value.map((entry) => entry === void 0 ? null : jsonImage(entry));
  if (typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype) {
    const image = {};
    for (const [key, member] of Object.entries(value)) {
      if (member !== void 0) image[key] = jsonImage(member);
    }
    return image;
  }
  return value;
}
function toPiCredential(record) {
  if (record === void 0) return void 0;
  if (record.kind === "api-key") {
    return {
      type: "api_key",
      ...record.key === void 0 ? {} : { key: record.key },
      ...record.env === void 0 ? {} : { env: { ...record.env } }
    };
  }
  return record.payload;
}
function toRecord(credential) {
  if (credential.type === "api_key") {
    return {
      kind: "api-key",
      ...credential.key === void 0 ? {} : { key: credential.key },
      ...credential.env === void 0 ? {} : { env: { ...credential.env } }
    };
  }
  return { kind: "grant", payload: jsonImage(credential) };
}
function writableStore(ctx) {
  const credentials = ctx.get("credentials");
  if (credentials === void 0) {
    throw new LlmError5(
      "llm-pi-ai: this composition mounts no credentials service, so there is nowhere to store the credential a sign-in produces; mount one (dsh-credentials-local) to sign in",
      "NO_CREDENTIAL_STORE"
    );
  }
  return credentials;
}
function credentialStoreFrom(ctx) {
  return {
    async read(providerId) {
      const credentials = ctx.get("credentials");
      if (credentials === void 0) return void 0;
      if (!isCredentialKeySegment(providerId)) return void 0;
      return toPiCredential(await credentials.readRecord(recordKeyFor(providerId)));
    },
    async list() {
      const stored = await ctx.get("credentials")?.listRecords() ?? [];
      const mine = [];
      for (const entry of stored) {
        if (credentialKeyScope(entry.key) !== RECORD_SCOPE) continue;
        mine.push({
          providerId: credentialKeyId(entry.key),
          type: entry.kind === "api-key" ? "api_key" : "oauth"
        });
      }
      return mine;
    },
    async modify(providerId, mutate) {
      if (!isCredentialKeySegment(providerId)) {
        throw new LlmError5(
          `llm-pi-ai: provider id "${providerId}" cannot address a stored credential record (a record id is a lowercase hyphenated identifier); authenticate this route through apiKeyEnv instead of a stored credential`,
          "UNSTORABLE_PROVIDER_ID"
        );
      }
      const stored = await writableStore(ctx).modifyRecord(recordKeyFor(providerId), async (current) => {
        const next = await mutate(toPiCredential(current));
        return next === void 0 ? void 0 : toRecord(next);
      });
      return toPiCredential(stored);
    },
    // `async` so a missing service reaches the caller as a rejection: pi-ai's
    // store contract is promise-returning, and a synchronous throw would
    // escape the `ModelsError` wrapper every other storage failure gets.
    async delete(providerId) {
      if (!isCredentialKeySegment(providerId)) return;
      await writableStore(ctx).deleteRecord(recordKeyFor(providerId));
    }
  };
}
function authContextFrom(ctx) {
  return {
    async env(name2) {
      if (isCredentialRefName(name2)) {
        const credentials = ctx.get("credentials");
        const hit = await credentials?.resolve(credentialRef2(name2));
        if (hit !== void 0) return hit.value;
      }
      return launchEnvironmentOf(ctx).get(name2)?.value;
    },
    async fileExists(path) {
      const expanded = path.startsWith("~/") || path === "~" ? resolvePath(homedir(), path.slice(1).replace(/^\//, "")) : path;
      try {
        await access(expanded);
        return true;
      } catch {
        return false;
      }
    }
  };
}

// src/runtime/discovery.ts
import { INVALID_CREDENTIAL_CODE, LlmError as LlmError6, normalizeApiKey } from "@deepseek-ai/dsh-llm";
import { attributionHeaders as attributionHeaders2 } from "@deepseek-ai/dsh-llm";
var LISTABLE_PROTOCOLS = /* @__PURE__ */ new Set([
  "anthropic-messages",
  "openai-completions",
  "openai-responses"
]);
var ANTHROPIC_VERSION = "2023-06-01";
var ANTHROPIC_MODEL_LIMIT = 1e3;
var MAX_RESPONSE_BYTES = 4 * 1024 * 1024;
function capacity(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isInteger(candidate) && candidate > 0) return candidate;
  }
  return void 0;
}
function label(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.length > 0) return candidate;
  }
  return void 0;
}
function listingUrl(baseURL, api) {
  const base = baseURL.replace(/\/+$/, "");
  if (api !== "anthropic-messages") return `${base}/models`;
  const root = base.endsWith("/v1") ? base.slice(0, -3) : base;
  return `${root}/v1/models?limit=${String(ANTHROPIC_MODEL_LIMIT)}`;
}
async function readBounded(response, url) {
  const oversized = () => new LlmError6(`${url} answered with more than ${MAX_RESPONSE_BYTES} bytes`, "DISCOVERY_FAILED");
  const declared = Number(response.headers.get("content-length") ?? Number.NaN);
  if (Number.isFinite(declared) && declared > MAX_RESPONSE_BYTES) {
    await response.body?.cancel();
    throw oversized();
  }
  if (response.body === null) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_RESPONSE_BYTES) throw oversized();
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {
    });
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}
function readListing(body) {
  const listing = body;
  const data = listing?.data;
  let listed;
  if (Array.isArray(data)) {
    const rows = data;
    listed = rows.map((raw) => ({ raw }));
  } else {
    const models2 = listing?.models;
    if (models2 === null || typeof models2 !== "object" || Array.isArray(models2)) {
      throw new LlmError6(
        `the endpoint's model listing has neither a "data" array nor a "models" object; enter this provider's models by hand`,
        "DISCOVERY_FAILED"
      );
    }
    listed = Object.entries(models2).filter(([, raw]) => raw !== null && typeof raw === "object" && !Array.isArray(raw)).map(([key, raw]) => ({ key, raw }));
  }
  const models = [];
  for (const { key, raw } of listed) {
    const entry = raw;
    const id = label(key, entry?.id);
    if (id === void 0) continue;
    const name2 = label(entry?.name, entry?.display_name, entry?.displayName) ?? id;
    const contextWindow = capacity(
      entry?.contextWindow,
      entry?.context_window,
      entry?.context_length,
      entry?.max_input_tokens,
      entry?.limit?.context
    );
    const maxTokens = capacity(
      entry?.maxOutputTokens,
      entry?.max_output_tokens,
      entry?.maxTokens,
      entry?.max_tokens,
      entry?.limit?.output,
      entry?.top_provider?.max_completion_tokens
    );
    models.push({
      id,
      name: name2,
      ...contextWindow === void 0 ? {} : { contextWindow },
      ...maxTokens === void 0 ? {} : { maxTokens }
    });
  }
  return models;
}
function usableProbeKey(raw) {
  const checked = normalizeApiKey(raw);
  if (checked.ok) return checked.value;
  throw new LlmError6(
    checked.reason === "empty" ? "this provider's API key is blank; enter it on the Models page, or clear it to probe unauthenticated" : "this provider's API key contains characters no HTTP header can carry; paste the raw key only",
    INVALID_CREDENTIAL_CODE
  );
}
async function discoverModels(request, storedProfile) {
  if (request.provider !== void 0) {
    const installed = catalogModels(request.provider);
    if (installed.size > 0) {
      return [...installed.values()].map((model) => ({
        id: model.id,
        name: model.name,
        contextWindow: model.contextWindow,
        maxTokens: model.maxTokens,
        inputModalities: [...model.input]
      }));
    }
  }
  if (request.baseURL === void 0 || request.baseURL.length === 0) {
    throw new LlmError6(
      `pi-ai ships no catalog for provider "${request.provider ?? ""}", so its models can only come from its endpoint; set a baseURL, or enter this provider's models by hand`,
      "DISCOVERY_FAILED"
    );
  }
  const api = request.api ?? "openai-completions";
  if (!LISTABLE_PROTOCOLS.has(api)) {
    throw new LlmError6(
      `pi-ai protocol "${api}" has no model listing this build can read; enter this provider's models by hand`,
      "DISCOVERY_UNSUPPORTED"
    );
  }
  const url = listingUrl(request.baseURL, api);
  const stored = storedProfile?.();
  const supplied = request.apiKey ?? await stored?.resolveApiKey();
  const apiKey = supplied === void 0 ? void 0 : usableProbeKey(supplied);
  let response;
  try {
    const headers = new Headers(stored?.headers === void 0 ? void 0 : Object.entries(stored.headers));
    headers.set("accept", "application/json");
    if (api === "anthropic-messages") {
      headers.set("anthropic-version", ANTHROPIC_VERSION);
      if (apiKey !== void 0) headers.set("x-api-key", apiKey);
    } else if (apiKey !== void 0) {
      headers.set("authorization", `Bearer ${apiKey}`);
    }
    for (const [name2, value] of Object.entries(attributionHeaders2())) headers.set(name2, value);
    response = await fetch(url, {
      method: "GET",
      headers,
      ...request.signal === void 0 ? {} : { signal: request.signal }
    });
  } catch (error) {
    if (request.signal?.aborted) {
      throw new LlmError6("model discovery aborted by caller", "ABORTED", { cause: error });
    }
    throw new LlmError6(`could not reach ${url}`, "DISCOVERY_FAILED", { cause: error });
  }
  if (!response.ok) {
    throw new LlmError6(
      `${url} answered ${response.status}${response.status === 401 || response.status === 403 ? "; check the API key" : ""}`,
      "DISCOVERY_FAILED"
    );
  }
  let text;
  try {
    text = await readBounded(response, url);
  } catch (error) {
    if (request.signal?.aborted) {
      throw new LlmError6("model discovery aborted by caller", "ABORTED", { cause: error });
    }
    throw error;
  }
  let body;
  try {
    body = JSON.parse(text);
  } catch (error) {
    throw new LlmError6(`${url} did not answer with JSON`, "DISCOVERY_FAILED", { cause: error });
  }
  return readListing(body);
}

// src/runtime/login.ts
import { randomUUID as randomUUID4 } from "node:crypto";
import { isCredentialKeySegment as isCredentialKeySegment2 } from "@deepseek-ai/dsh-credentials";
function loginMethods(provider) {
  const methods = [];
  const oauth2 = provider?.auth.oauth;
  if (oauth2 !== void 0) methods.push({ id: "oauth", label: oauth2.loginLabel ?? oauth2.name });
  const apiKey = provider?.auth.apiKey;
  if (apiKey?.login !== void 0) methods.push({ id: "api-key", label: apiKey.name });
  return methods;
}
function relay(event, session) {
  switch (event.type) {
    case "info": {
      const link = event.links?.[0];
      session.notify({ message: event.message, ...link === void 0 ? {} : { url: link.url } });
      return;
    }
    case "auth_url":
      session.notify({
        message: event.instructions ?? "Open this page to continue signing in.",
        url: event.url
      });
      return;
    case "device_code": {
      const notice = {
        message: "Enter this code on the verification page to finish signing in.",
        url: event.verificationUri,
        code: event.userCode,
        expiresInSeconds: event.expiresInSeconds
      };
      session.notify(notice);
      return;
    }
    case "progress":
      session.notify({ message: event.message });
      return;
    default:
      session.notify({ message: "Signing in\u2026" });
  }
}
function restate(prompt) {
  const signal = prompt.signal === void 0 ? {} : { signal: prompt.signal };
  switch (prompt.type) {
    case "select":
      return { ...signal, kind: "select", message: prompt.message, options: prompt.options };
    case "secret":
      return {
        ...signal,
        kind: "secret",
        message: prompt.message,
        ...prompt.placeholder === void 0 ? {} : { placeholder: prompt.placeholder }
      };
    default:
      return {
        ...signal,
        kind: "text",
        message: prompt.message,
        ...prompt.placeholder === void 0 ? {} : { placeholder: prompt.placeholder }
      };
  }
}
function registerPiAiFlows(ctx, auth, onLogin) {
  for (const providerId of catalogProviderIds()) {
    const provider = catalogProvider(providerId);
    const [first, ...rest] = loginMethods(provider);
    if (provider === void 0 || first === void 0) continue;
    if (!isCredentialKeySegment2(providerId)) {
      ctx.logger.warn(
        'llm-pi-ai: catalog provider "%s" cannot address a credential record; its sign-in is not offered',
        providerId
      );
      continue;
    }
    ctx.authorization.registerFlow({
      key: recordKeyFor(providerId),
      label: provider.name,
      methods: [first, ...rest],
      async run(session) {
        const models = createModels(auth);
        models.setProvider(provider);
        const type = session.method === "oauth" ? "oauth" : "api_key";
        let deviceId;
        if (providerId === "openai" && type === "oauth") {
          const record = await ctx.credentials.modifyRecord("dsh-pi-login/installation", (current) => {
            if (current?.kind === "grant" && typeof current.payload?.deviceId === "string") return current;
            return { kind: "grant", payload: { deviceId: randomUUID4() } };
          });
          deviceId = record?.kind === "grant" ? record.payload.deviceId : void 0;
        }
        await models.login(providerId, type, {
          signal: session.signal,
          notify: (event) => {
            relay(event, session);
          },
          prompt: (prompt) => session.prompt(restate(prompt))
        }, deviceId === void 0 ? void 0 : { getDeviceId: () => deviceId });
        onLogin?.(providerId);
      }
    });
  }
}

// src/runtime/index.ts
var NS2 = "dsh-pi-login";
function registrationFacts(profiles) {
  return [...profiles.entries()].map(([provider, profile2]) => ({
    provider,
    displayName: profile2.displayName,
    retryPolicy: profile2.retryPolicy,
    models: profile2.piProvider === void 0 ? void 0 : profile2.modelChoices.filter((choice) => choice.enabled).map((choice) => ({ id: choice.id, name: choice.name }))
  })).sort((left, right) => left.provider.localeCompare(right.provider));
}
function directoryEntries(profiles, settingsNs) {
  const catalog = new Set(catalogProviderIds());
  const entries = /* @__PURE__ */ new Map();
  const declare = (provider, displayName, error) => {
    entries.set(provider, {
      provider,
      displayName,
      settingsNs,
      settingsPath: ["providers", provider],
      // Membership of the installed catalog, not of the settings document:
      // narrowing a shipped provider's models stores a profile too, and that
      // route is still one pi-ai knows.
      declared: !catalog.has(provider),
      ...error === void 0 ? {} : { error }
    });
  };
  for (const provider of catalog) declare(provider, provider);
  for (const [provider, profile2] of profiles) declare(provider, profile2.displayName, profile2.catalogError);
  return [...entries.values()];
}
function apply(ctx, config, live) {
  ctx.inject(["settings"], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
  const settingsNs = NS2;
  let lastRaw;
  let lastCatalogRevision;
  let memoized;
  const profiles = () => {
    const raw = config.providers.get();
    const revision = live?.revision();
    if (raw === lastRaw && revision === lastCatalogRevision && memoized !== void 0) return memoized;
    const next = resolveProfiles(structuredClone(raw), "deferred", live?.catalog);
    for (const [provider, profile2] of Object.entries(raw)) if (profile2.enabled === false) next.delete(provider);
    lastRaw = raw;
    lastCatalogRevision = revision;
    memoized = next;
    return next;
  };
  profiles();
  ctx.on("internal/config", function(_raw, next) {
    const raw = next();
    if (this !== ctx.fiber) return raw;
    const candidate = Config(raw);
    assertServiceable(
      { providers: structuredClone(candidate.providers.get()) },
      { providers: structuredClone(config.providers.get()) }
    );
    return raw;
  });
  const resolveApiKey = async (provider, profile2) => {
    const ref = profile2.apiKeyEnv;
    if (ref === void 0) return void 0;
    const credentials = ctx.get("credentials");
    const hit = credentials !== void 0 ? (await credentials.resolve(ref))?.value : launchEnvironmentOf2(ctx).get(ref)?.value;
    if (hit !== void 0 && hit.length > 0) return assertUsableApiKey(hit, "llm-pi-ai", ref);
    throw new LlmError7(
      `llm-pi-ai: no credential for provider route "${provider}"; its profile resolves ${ref}, which is not set \u2014 store ${ref} through the credentials service (the web Models page writes it) or export it, and remove apiKeyEnv only if this provider should authenticate from pi-ai's own environment discovery`,
      "MISSING_CREDENTIAL"
    );
  };
  const auth = { credentials: credentialStoreFrom(ctx), authContext: authContextFrom(ctx) };
  const adapter = new PiAiAdapter({
    profiles,
    resolveApiKey,
    auth,
    authorizeModel: live?.authorizeModel,
    resolveAttachments: () => ctx.get("attachments"),
    resolveImageAccess: (attachments, ref) => resolveImageAttachmentAccess(
      attachments,
      (hostPath) => ctx.get("fs")?.processPathFromHostPath(hostPath),
      ref
    ),
    onReplayDegrade: ({ provider, model, reason }) => {
      ctx.logger.warn(
        `llm-pi-ai: unusable replay state on assistant history for route "${provider}/${model}"; sending that message as provider-neutral content (${reason})`
      );
    }
  });
  ctx.inject(["authorization"], (authorized) => {
    registerPiAiFlows(authorized, auth, live?.onLogin);
  });
  let directory;
  let directoryFacts;
  const ensureDirectory = () => {
    const entries = directoryEntries(profiles(), settingsNs);
    if (deepEqualJson2(entries, directoryFacts)) return;
    if (directory === void 0) {
      directory = ctx.llm.registerConfigurableProviders(entries);
    } else {
      directory.replace(entries);
    }
    directoryFacts = entries;
  };
  ensureDirectory();
  const storedDiscoveryProfile = (provider) => {
    if (provider === void 0) return void 0;
    const profile2 = profiles().get(provider);
    if (profile2 === void 0) return void 0;
    return {
      headers: profile2.headers,
      resolveApiKey: () => resolveApiKey(provider, profile2)
    };
  };
  ctx.llm.registerModelDiscovery(settingsNs, (request, signal) => discoverModels(
    { ...request, ...signal === void 0 ? {} : { signal } },
    () => storedDiscoveryProfile(request.provider)
  ));
  let registration;
  let registeredFacts;
  const ensureRegistrationFacts = () => {
    const facts = registrationFacts(profiles());
    if (deepEqualJson2(facts, registeredFacts)) return;
    const routes = [...profiles().keys()];
    if (registration === void 0) {
      if (routes.length === 0) {
        registeredFacts = facts;
        return;
      }
      registration = ctx.llm.registerAdapter(routes, adapter);
    } else {
      registration.replace(routes);
    }
    registeredFacts = facts;
  };
  ensureRegistrationFacts();
  ctx.on("dsh-pi-login/catalog-updated", () => {
    ensureRegistrationFacts();
    ensureDirectory();
  });
  ctx.on("loader/volatile-update", () => {
    try {
      ensureRegistrationFacts();
      ensureDirectory();
    } catch (error) {
      ctx.logger.error("llm-pi-ai: configuration conflicts with an existing provider route");
      ctx.logger.error(error);
    }
  });
  ctx.on("settings/document-updated", (namespace) => {
    if (namespace !== NS2) return;
    try {
      ensureRegistrationFacts();
      ensureDirectory();
    } catch (error) {
      ctx.logger.error("Pi plugin: could not apply model settings");
      ctx.logger.error(error);
    }
  });
}

// src/meta-catalog.mjs
import { createHash as createHash2 } from "node:crypto";
var META_CATALOG_GRANT = /* @__PURE__ */ Symbol("dsh-pi-login/meta-catalog-grant");
var MAX_BYTES = 4 * 1024 * 1024;
var LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
var principalOf = (credential) => createHash2("sha256").update(credential.refresh).digest("hex");
var oauth = (value) => value?.type === "oauth" && typeof value.refresh === "string" && value.refresh.length > 0;
var fullModel = (id) => /^muse-wonder-full(?:-|$)/.test(id);
var cleanLabel = (value) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 100) : void 0;
var positive = (value) => Number.isSafeInteger(value) && value > 0 ? value : void 0;
var MetaCatalogError = class extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
};
function checkProfile(profile2) {
  if (profile2.apiKeyEnv !== void 0) throw new MetaCatalogError("meta-key-override");
  if (profile2.baseURL !== void 0 && profile2.baseURL.replace(/\/+$/, "") !== "https://api.meta.ai/v1" || profile2.api !== void 0 && profile2.api !== "openai-responses" || Object.keys(profile2.headers ?? {}).some((name2) => name2.toLowerCase() === "authorization")) {
    throw new MetaCatalogError("meta-settings-incompatible");
  }
}
async function readJson(response) {
  if (!response.ok) {
    await response.body?.cancel().catch(() => {
    });
    throw new MetaCatalogError(response.status === 429 ? "meta-rate-limited" : response.status === 401 || response.status === 403 ? "meta-login-required" : "meta-refresh-failed");
  }
  const declared = Number(response.headers.get("content-length"));
  if (declared > MAX_BYTES) {
    await response.body?.cancel();
    throw new MetaCatalogError("meta-refresh-failed");
  }
  const reader = response.body?.getReader();
  if (!reader) throw new MetaCatalogError("meta-refresh-failed");
  let size = 0;
  const chunks = [];
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) throw new MetaCatalogError("meta-refresh-failed");
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new MetaCatalogError("meta-refresh-failed");
    return parsed;
  } finally {
    await reader.cancel().catch(() => {
    });
  }
}
function learnedModel(row, profile2, principal) {
  const context = positive(row.contextWindow ?? row.context_window ?? row.context_length ?? row.limit?.context);
  const output = positive(row.maxTokens ?? row.max_tokens ?? row.max_output_tokens ?? row.limit?.output);
  const input = row.input ?? row.modalities?.input;
  const offeredInput = Array.isArray(input) ? input.filter((value) => value === "text" || value === "image") : [];
  const map = row.thinkingLevelMap;
  const thinking = map && typeof map === "object" && !Array.isArray(map) ? Object.fromEntries(LEVELS.map((level) => [level, typeof map[level] === "string" && map[level].length > 0 ? map[level] : null])) : void 0;
  const hasReasoning = row.reasoning === true && thinking && Object.values(thinking).some((value) => value !== null);
  const verified = Boolean(context && output && offeredInput.length && (row.reasoning === false || hasReasoning));
  return {
    id: row.id,
    name: cleanLabel(row.name ?? row.display_name) || (row.id === "muse-wonder-full-1.0" ? "Muse Wonder Full" : row.id),
    provider: "meta",
    api: "openai-responses",
    baseUrl: "https://api.meta.ai/v1",
    // ID-only listings use explicit conservative route defaults. No guessed
    // image/effort capabilities; absent reasoning leaves the API's default.
    contextWindow: context ?? profile2.defaultContextWindow ?? 262144,
    maxTokens: output ?? profile2.defaultMaxTokens ?? 32768,
    input: offeredInput.length ? offeredInput : ["text"],
    reasoning: Boolean(hasReasoning),
    ...hasReasoning ? { thinkingLevelMap: thinking } : {},
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    [META_CATALOG_GRANT]: Object.freeze({ principal, verified }),
    [DISCOVERED_MODEL]: Object.freeze({ verified })
  };
}
var MetaCatalogSession = class {
  constructor({ credentials, profile: profile2, baseline, onChange = () => {
  }, fetch: request = (...args) => globalThis.fetch(...args) }) {
    this.credentials = credentials;
    this.profile = profile2;
    this.baseline = baseline;
    this.onChange = onChange;
    this.fetch = request;
    this.version = 0;
    this.controller = new AbortController();
    this.closed = false;
  }
  state() {
    return { canRefresh: true, account: this.account, checkedAt: this.checkedAt, discoveredCount: this.learned?.size ?? 0 };
  }
  invalidate() {
    this.principal = void 0;
    this.learned = void 0;
    this.account = void 0;
    this.checkedAt = void 0;
    this.version++;
    if (!this.closed) this.onChange();
  }
  async validate() {
    if (!this.principal) return;
    const current = await this.credentials.read("meta");
    if (!oauth(current) || principalOf(current) !== this.principal) this.invalidate();
  }
  catalog(provider) {
    if (provider !== "meta" || !this.learned) return void 0;
    const catalog = new Map(this.baseline("meta"));
    for (const [id, model] of this.learned) if (!catalog.has(id) || fullModel(id)) catalog.set(id, model);
    return catalog;
  }
  refresh() {
    if (this.closed) return Promise.reject(new MetaCatalogError("meta-refresh-failed"));
    if (this.pending) return this.pending;
    this.pending = this.runRefresh().catch((error) => {
      if (error instanceof MetaCatalogError) throw error;
      throw new MetaCatalogError("meta-refresh-failed");
    }).finally(() => {
      this.pending = void 0;
    });
    return this.pending;
  }
  async runRefresh() {
    checkProfile(this.profile());
    await this.validate();
    const credential = await this.credentials.read("meta");
    if (!oauth(credential)) throw new MetaCatalogError("meta-login-required");
    const principal = principalOf(credential);
    const signal = AbortSignal.any([this.controller.signal, AbortSignal.timeout(2e4)]);
    let account;
    const refreshed = await this.credentials.modify("meta", async (current2) => {
      if (!oauth(current2) || principalOf(current2) !== principal) throw new MetaCatalogError("meta-account-changed");
      const body2 = await readJson(await this.fetch("https://api.meta.ai/muse-code/key", {
        method: "POST",
        redirect: "error",
        signal,
        headers: { accept: "application/json", "content-type": "application/json", "x-api-version": "1.0.0", authorization: `Bearer ${current2.refresh}` },
        body: "{}"
      }));
      account = {
        active: typeof body2.is_subs_active === "boolean" ? body2.is_subs_active : null,
        tierName: cleanLabel(body2.subs_tier_name),
        tierId: cleanLabel(body2.subs_tier_id)
      };
      if (account.active !== true) return { ...current2, dshPiSubscription: account };
      if (typeof body2.api_key !== "string" || body2.api_key.length === 0) throw new MetaCatalogError("meta-login-required");
      return { ...current2, access: body2.api_key, expires: Date.now() + 864e5, dshPiSubscription: account };
    });
    if (this.closed) throw new MetaCatalogError("meta-refresh-failed");
    checkProfile(this.profile());
    if (account.active !== true) {
      this.principal = principal;
      this.learned = /* @__PURE__ */ new Map();
      this.account = account;
      this.checkedAt = Date.now();
      this.version++;
      this.onChange();
      return this.state();
    }
    const body = await readJson(await this.fetch("https://api.meta.ai/v1/models", {
      method: "GET",
      redirect: "error",
      signal,
      headers: { accept: "application/json", "x-api-version": "1.0.0", authorization: `Bearer ${refreshed.access}` }
    }));
    if (!Array.isArray(body.data) || body.has_more === true || body.next_page !== void 0 && body.next_page !== null) throw new MetaCatalogError("meta-refresh-failed");
    const current = await this.credentials.read("meta");
    if (this.closed || !oauth(current) || principalOf(current) !== principal) throw new MetaCatalogError("meta-account-changed");
    checkProfile(this.profile());
    const baseline = this.baseline("meta");
    const learned = /* @__PURE__ */ new Map();
    const profile2 = this.profile();
    for (const row of body.data) {
      if (!row || typeof row.id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/.test(row.id) || baseline.has(row.id) && !fullModel(row.id) || learned.has(row.id)) continue;
      const input = row.input ?? row.modalities?.input;
      if (Array.isArray(input) && !input.some((value) => value === "text" || value === "image")) continue;
      if (["image", "classifier", "embedding", "audio"].includes(row.type)) continue;
      if (account.active !== true) continue;
      learned.set(row.id, baseline.has(row.id) ? { ...baseline.get(row.id), [META_CATALOG_GRANT]: Object.freeze({ principal, verified: true }), [DISCOVERED_MODEL]: Object.freeze({ verified: true }) } : learnedModel(row, profile2, principal));
    }
    this.principal = principal;
    this.learned = learned;
    this.account = account;
    this.checkedAt = Date.now();
    this.version++;
    this.onChange();
    return this.state();
  }
  async keyForModel(provider, model, profile2) {
    if (provider !== "meta") return void 0;
    const grant = model[META_CATALOG_GRANT];
    if (!grant && !fullModel(model.id)) return void 0;
    checkProfile(profile2);
    const current = await this.credentials.read("meta");
    if (!grant || !oauth(current) || principalOf(current) !== grant.principal || this.principal !== grant.principal || !this.learned?.has(model.id) || current.dshPiSubscription?.active !== true) {
      throw new MetaCatalogError("meta-refresh-required");
    }
    if (typeof current.access !== "string" || current.expires <= Date.now()) throw new MetaCatalogError("meta-refresh-required");
    return current.access;
  }
  dispose() {
    this.closed = true;
    this.controller.abort();
    this.invalidate();
  }
};

// src/meta-catalog-provider.mjs
import { LlmError as LlmError8 } from "@deepseek-ai/dsh-llm";
function metaCatalogProvider(session) {
  return {
    session,
    presentation(models) {
      const { account } = session.state();
      return {
        ...account ? { status: { message: account.active === true ? "metaSubscriptionActive" : account.active === false ? "metaSubscriptionInactive" : "metaSubscriptionUnknown", detail: account.tierName } } : {},
        notes: ["metaReloadHint", ...models.some((model) => model.id.includes("contributor")) ? ["metaContributorHint"] : []]
      };
    },
    errorCodes: {
      "meta-login-required": "catalog-login-required",
      "meta-key-override": "catalog-key-override",
      "meta-settings-incompatible": "catalog-settings-incompatible",
      "meta-account-changed": "catalog-account-changed",
      "meta-rate-limited": "catalog-rate-limited"
    },
    errors: {
      "catalog-login-required": "metaLoginRequired",
      "catalog-key-override": "metaKeyOverride",
      "catalog-settings-incompatible": "metaSettingsIncompatible",
      "catalog-account-changed": "metaAccountChanged",
      "catalog-rate-limited": "metaRateLimited"
    },
    async authorizeModel(model, profile2) {
      try {
        const apiKey = await session.keyForModel("meta", model, profile2);
        return apiKey === void 0 ? void 0 : { apiKey, headers: { "x-api-version": "1.0.0" } };
      } catch (error) {
        if (!(error instanceof MetaCatalogError)) throw error;
        const messages = {
          "meta-refresh-required": "Reload your Muse account model list before using this model. Your login or available models may have changed.",
          "meta-key-override": "This model requires your saved Muse login. Remove the API-key reference or choose saved credentials.",
          "meta-settings-incompatible": "This Muse model requires the standard Meta endpoint and no Authorization header override."
        };
        throw new LlmError8(messages[error.code] ?? "Could not verify access to this Muse model. Reload your account model list.", error.code);
      }
    }
  };
}

// src/index.mjs
var inject = ["llm", "authorization", "credentials", "connection", "settings"];
var name = "dsh-pi-login";
function apply2(ctx, config) {
  const meta = new MetaCatalogSession({
    credentials: credentialStoreFrom(ctx),
    profile: () => config.providers.get().meta ?? {},
    baseline: catalogModels,
    onChange: () => ctx.emit("dsh-pi-login/catalog-updated")
  });
  const catalogs = new ProviderCatalogs({ meta: metaCatalogProvider(meta) });
  ctx.effect(() => () => catalogs.dispose(), "Pi: provider catalog lifetime");
  apply(ctx, config, {
    catalog: (provider) => catalogs.catalog(provider),
    revision: () => catalogs.revision(),
    onLogin: (provider) => catalogs.onLogin(provider),
    authorizeModel: (provider, model, profile2) => catalogs.authorizeModel(provider, model, profile2)
  });
  applyLoginUI(ctx, {
    catalogs,
    catalog: (provider, profile2) => {
      const learned = catalogs.catalog(provider);
      const models = resolveRouteModels({ defaultInput: DEFAULT_INPUT, defaultContextWindow: DEFAULT_CONTEXT_WINDOW, defaultMaxTokens: DEFAULT_MAX_TOKENS, provider, ...profile2 }, "deferred", learned).models;
      const discovered = new Set(models.filter((model) => model[DISCOVERED_MODEL]).map((model) => model.id));
      return modelChoices(provider, models, profile2, discovered).map((choice) => ({ ...choice, capabilityUnverified: choice.discovered && !choice.model[DISCOVERED_MODEL]?.verified }));
    }
  });
  let alive = true;
  ctx.effect(() => () => {
    alive = false;
  }, "Pi: migration lifetime");
  void ctx.fiber.await().then(async () => {
    if (!alive || config.legacyImported.get()) return;
    const section = ctx.settings.describe({ redactSecrets: false }).find((row) => row.ns === name);
    if (!section) return;
    const legacy = ctx.get("configEditor")?.entries().find((entry) => entry.options.id === "llm-pi-ai")?.options.config?.providers ?? {};
    await ctx.settings.update(name, { providers: { ...legacy, ...config.providers.get() }, legacyImported: true }, section.revision);
  }).catch(() => {
    if (alive) ctx.logger.warn("Pi: could not import existing provider settings; retry after restarting");
  });
}
export {
  Config,
  DISCOVERED_MODEL,
  PiAiAdapter,
  ProviderCatalogs,
  apply2 as apply,
  applyLoginUI,
  inject,
  name,
  resolveProfiles
};

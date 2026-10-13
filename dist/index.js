var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name2);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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
  var fail2 = (e) => error = hasError ? new E(e, error, "An error was suppressed during disposal") : (hasError = true, e);
  var next = (it) => {
    while (it = stack.pop()) {
      try {
        var result = it[1] && it[1].call(it[2]);
        if (it[0]) return Promise.resolve(result).then(next, (e) => (fail2(e), next()));
      } catch (e) {
        fail2(e);
      }
    }
    if (hasError) throw error;
  };
  return next();
};

// node_modules/@muse-code/sdk/dist/src/fingerprint.js
function fingerprintMismatchMessage(pinned, actual) {
  return [
    "MSP schema fingerprint moved: re-pin after a schema advance.",
    `  pinned by @muse-code/sdk: ${pinned}`,
    `  schema/msp/stable/manifest.json: ${actual}`,
    "",
    "This does NOT mean the SDK is broken. The stable schema bundle advanced",
    "(a #206 enrollment or renderer change). Fix it by running",
    "scripts/regen-msp-pins.sh, which re-pins EXPECTED_SCHEMA_FINGERPRINT and",
    "every other derived copy from the committed stable manifest, then adapt",
    "the facade to whatever the advance actually changed. Never hand-edit",
    "schema/msp/** to match the SDK."
  ].join("\n");
}
function checkServedFingerprint(served, pinned = EXPECTED_SCHEMA_FINGERPRINT) {
  if (served === pinned)
    return void 0;
  return {
    kind: "schemaFingerprintMismatch",
    pinned,
    served,
    message: `host schema fingerprint ${served} differs from the fingerprint this SDK pins (${pinned}); proceeding under additive-optional evolution (SS1.5.4). Re-pin after a schema advance.`
  };
}
var EXPECTED_SCHEMA_FINGERPRINT;
var init_fingerprint = __esm({
  "node_modules/@muse-code/sdk/dist/src/fingerprint.js"() {
    EXPECTED_SCHEMA_FINGERPRINT = "sha256:6de32db08bbbe0deb478d2bfcaba001e9fb490986bc80db3aceb4d996abf7df9";
  }
});

// node_modules/@muse-code/sdk/dist/src/errors.js
var MuseSessionDiscardedError, MuseForeignSessionError, MuseGapFillError, PermissionProfileNotApplied;
var init_errors = __esm({
  "node_modules/@muse-code/sdk/dist/src/errors.js"() {
    MuseSessionDiscardedError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "MuseSessionDiscardedError";
      }
    };
    MuseForeignSessionError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "MuseForeignSessionError";
      }
    };
    MuseGapFillError = class extends Error {
      reason;
      /** The gap's own bounds, verbatim and opaque (tdd SS4.1). */
      after;
      next;
      constructor(reason, after, next, cause) {
        super(`view/gap (${after}, ${next}) could not be filled: ${reason}`, { cause });
        this.name = "MuseGapFillError";
        this.reason = reason;
        this.after = after;
        this.next = next;
      }
    };
    PermissionProfileNotApplied = class extends Error {
      /** The profile id the caller required. */
      requested;
      /** The committed profile id the read-back served, or null when unknown. */
      served;
      /** The open session, so the caller can set, retry, or close it. */
      sessionId;
      constructor(requested, served, sessionId) {
        super(`required permissionProfile ${JSON.stringify(requested)} was not applied: the committed selection is ${served === null ? "unknown" : JSON.stringify(served)} (session ${sessionId})`);
        this.name = "PermissionProfileNotApplied";
        this.requested = requested;
        this.served = served;
        this.sessionId = sessionId;
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/fold/item-store.js
var ItemStore;
var init_item_store = __esm({
  "node_modules/@muse-code/sdk/dist/src/fold/item-store.js"() {
    init_errors();
    ItemStore = class {
      #items = /* @__PURE__ */ new Map();
      /** itemId -> field path -> accumulated text. */
      #deltas = /* @__PURE__ */ new Map();
      /** First-opened order; an itemId appears exactly once. */
      #order = [];
      #terminalUnknown = /* @__PURE__ */ new Set();
      #ephemeralSessionDiscarded = false;
      /**
       * Apply an `item/started` | `item/updated` | `item/completed` payload.
       * Replace iff the incoming revision is strictly higher (INV-003).
       */
      apply(item) {
        this.#assertSessionActive();
        const held = this.#items.get(item.itemId);
        if (held === void 0) {
          this.#items.set(item.itemId, item);
          this.#order.push(item.itemId);
          return { kind: "inserted", itemId: item.itemId };
        }
        if (item.revision <= held.revision) {
          return {
            kind: "ignoredStaleRevision",
            itemId: item.itemId,
            held: held.revision,
            offered: item.revision
          };
        }
        this.#items.set(item.itemId, item);
        return {
          kind: "replaced",
          itemId: item.itemId,
          from: held.revision,
          to: item.revision
        };
      }
      /**
       * Apply an `item/delta`: a UTF-8-safe append to the open item's field named
       * by `field` (default `"text"`), contiguous and lossless in cursor order.
       * The concatenation of all deltas for a field path equals that field's
       * value on the final `item/completed` object (INV-004, tdd SS4.3.1).
       */
      applyDelta(itemId, delta, field = "text") {
        this.#assertSessionActive();
        let fields = this.#deltas.get(itemId);
        if (fields === void 0) {
          fields = /* @__PURE__ */ new Map();
          this.#deltas.set(itemId, fields);
        }
        fields.set(field, (fields.get(field) ?? "") + delta);
        if (!this.#items.has(itemId)) {
          return { kind: "bufferedForAbsentItem", itemId, field };
        }
        return {
          kind: "appended",
          itemId,
          field,
          length: (fields.get(field) ?? "").length
        };
      }
      /** The accumulated delta text for a field path, or `undefined` if none. */
      accumulated(itemId, field = "text") {
        return this.#deltas.get(itemId)?.get(field);
      }
      /** Every field path that has accumulated deltas for this item. */
      accumulatedFields(itemId) {
        const fields = this.#deltas.get(itemId);
        return fields === void 0 ? [] : [...fields.keys()].sort();
      }
      get(itemId) {
        return this.#items.get(itemId);
      }
      has(itemId) {
        return this.#items.has(itemId);
      }
      /** Items in first-opened order (tdd SS4.9.1). */
      list() {
        const out = [];
        for (const id of this.#order) {
          const item = this.#items.get(id);
          if (item !== void 0)
            out.push(item);
        }
        return out;
      }
      /** The id of the most recently opened item, or `undefined` when empty. */
      lastOpenedItemId() {
        return this.#order.at(-1);
      }
      get size() {
        return this.#items.size;
      }
      /**
       * Seed from a snapshot's `state.items` (tdd SS4.9.1): every item at its
       * latest revision at the snapshot cursor, in first-opened order. Seeding
       * REPLACES the store — a snapshot is authoritative (tdd SS4.9), never
       * merged into stale local state.
       *
       * Delta accumulators are intentionally NOT seeded: a snapshot carries
       * streamed fields at their accumulated-so-far values on the item itself,
       * and `view/page` never replays ephemeral-sourced deltas (tdd SS4.7.3).
       */
      seed(items) {
        this.#assertSessionActive();
        this.#items.clear();
        this.#deltas.clear();
        this.#terminalUnknown.clear();
        this.#order.length = 0;
        for (const item of items) {
          if (!this.#items.has(item.itemId))
            this.#order.push(item.itemId);
          this.#items.set(item.itemId, item);
        }
      }
      /**
       * Permanently discard an ephemeral session after abnormal host death.
       *
       * The last wire item remains byte-for-byte intact: terminal-unknown is a
       * client display annotation, never a fabricated `item/completed` or wire
       * status (SS2.13.3b / SS4.4.3). Further events and snapshot seeding are
       * refused because this session has no resume surface.
       */
      markEphemeralHostDeath(isInProgress) {
        if (!this.#ephemeralSessionDiscarded) {
          for (const item of this.#items.values()) {
            if (isInProgress(item))
              this.#terminalUnknown.add(item.itemId);
          }
          this.#ephemeralSessionDiscarded = true;
        }
        return this.#order.filter((itemId) => this.#terminalUnknown.has(itemId)).map((itemId) => ({ kind: "terminalUnknown", itemId }));
      }
      isTerminalUnknown(itemId) {
        return this.#terminalUnknown.has(itemId);
      }
      get ephemeralSessionDiscarded() {
        return this.#ephemeralSessionDiscarded;
      }
      #assertSessionActive() {
        if (this.#ephemeralSessionDiscarded) {
          throw new MuseSessionDiscardedError("ephemeral session was discarded after abnormal host death");
        }
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/fold/state-store.js
var SessionStateStore;
var init_state_store = __esm({
  "node_modules/@muse-code/sdk/dist/src/fold/state-store.js"() {
    SessionStateStore = class {
      #values = /* @__PURE__ */ new Map();
      #cursors = /* @__PURE__ */ new Map();
      /**
       * Apply a state event. `cursor` is the event's `viewCursor`; when omitted
       * (a snapshot seed, which carries one cursor for the whole state) the value
       * is taken unconditionally.
       */
      apply(family, value, cursor) {
        const previous = this.#values.get(family);
        if (cursor !== void 0) {
          const seen = this.#cursors.get(family);
          if (seen !== void 0 && cursor === seen) {
            return {
              family,
              previous,
              current: previous ?? null,
              applied: false
            };
          }
          this.#cursors.set(family, cursor);
        }
        this.#values.set(family, value);
        return { family, previous, current: value, applied: true };
      }
      /**
       * Read a family. `undefined` means no fact has ever landed — distinct from
       * `null`, which means a fact cleared it. Absent is never fabricated
       * (tdd SS4.9.1).
       */
      get(family) {
        return this.#values.get(family);
      }
      has(family) {
        return this.#values.has(family);
      }
      /** Every family that holds a value, in insertion order. */
      families() {
        return [...this.#values.keys()];
      }
      /** Seed from a snapshot's state block: authoritative, replaces wholesale. */
      seed(entries, cursor) {
        this.#values.clear();
        this.#cursors.clear();
        for (const [family, value] of entries) {
          this.#values.set(family, value);
          if (cursor !== void 0)
            this.#cursors.set(family, cursor);
        }
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/fold/session-fold.js
var SessionFold;
var init_session_fold = __esm({
  "node_modules/@muse-code/sdk/dist/src/fold/session-fold.js"() {
    init_item_store();
    init_state_store();
    SessionFold = class _SessionFold {
      #itemStore = new ItemStore();
      #sessionStateStore = new SessionStateStore();
      /** Items, snapshot-only: the mutators are `apply()`'s, not the consumer's. */
      get items() {
        return this.#itemStore;
      }
      /**
       * Discharge the SS2.13.3b ephemeral host-death obligation over the item
       * half: every item still in progress becomes terminal-unknown and the fold
       * refuses further events (spec FM-002; slice 3's T030b).
       *
       * A FOLD-level method rather than a `FoldItems` entry on purpose. `items` is
       * snapshot-only — an allowlist whose whole job is that a store mutator can
       * never leak onto the consumer surface (PR #23087 review round) — and this
       * IS a mutator. Widening the allowlist to reach it would undo that; routing
       * it here keeps exactly one caller (`Session.hostExited`) and leaves the
       * read surface untouched. The in-progress probe stays the caller's, so the
       * store remains wire-shape-blind (INV-001).
       */
      markEphemeralHostDeath(isInProgress) {
        return this.#itemStore.markEphemeralHostDeath(isInProgress);
      }
      /**
       * The session-state families, keyed by notification method name. Named
       * `sessionState` rather than `state` because the surface contract reserves
       * `state` for the FR-008 aggregate that arrives with snapshot ingestion.
       * Snapshot-only, like `items`.
       */
      get sessionState() {
        return this.#sessionStateStore;
      }
      #turns = /* @__PURE__ */ new Map();
      #pendingApprovals = /* @__PURE__ */ new Map();
      #resolvedApprovals = /* @__PURE__ */ new Map();
      #pendingUserInputs = /* @__PURE__ */ new Map();
      #settledUserInputs = /* @__PURE__ */ new Map();
      #activeTurnId;
      #pendingGap;
      /** The turn currently running, if one is. */
      get activeTurnId() {
        return this.#activeTurnId;
      }
      /**
       * The outstanding delivery hole, or `undefined` when there is none (tdd
       * SS4.8, FM-003).
       *
       * COALESCED, keeping the FIRST `after`: consecutive overflows are one hole
       * from a filler's point of view, which is the client mirror of the server's
       * own D-16487-1 bracket rule. A recovery walks `(after, next)` and calls
       * `gapFilled(next)` with the target it actually reached, so a hole that grew
       * while the walk was in flight cannot be reported filled.
       */
      get pendingGap() {
        return this.#pendingGap;
      }
      /**
       * Is this fold current with the session view?
       *
       * FM-003's "only then reports current": false from the moment a `view/gap`
       * folds until its hole is filled. Live events keep folding meanwhile — they
       * are real facts and dropping them would add a second hole — so this flag is
       * the ONLY statement that the transcript has a hole in it.
       */
      get current() {
        return this.#pendingGap === void 0;
      }
      /**
       * A recovery filled the hole up to `next`. Returns whether it cleared.
       *
       * EQUALITY, never a relational compare (tdd SS4.1): the argument is the
       * target the walk reached, and it clears only when that is still the
       * outstanding target. A gap that arrived mid-walk left a newer `next`, so
       * this answers `false` and the fold stays not-current — the truthful answer,
       * since the second hole is unfilled.
       *
       * A fold-level mutator with the same rationale as `markEphemeralHostDeath`:
       * `items`/`sessionState` are snapshot-only allowlists, and this belongs to
       * neither store.
       */
      gapFilled(next) {
        if (this.#pendingGap?.next !== next)
          return false;
        this.#pendingGap = void 0;
        return true;
      }
      apply(event) {
        if (event.params === null || typeof event.params !== "object" || Array.isArray(event.params)) {
          return { kind: "ignoredMissingParams", method: event.method };
        }
        const typed = event;
        switch (typed.method) {
          case "item/started":
          case "item/updated":
          case "item/completed":
            return { kind: "item", outcome: this.#itemStore.apply(typed.params.item) };
          case "item/delta":
            return {
              kind: "itemDelta",
              outcome: this.#itemStore.applyDelta(typed.params.itemId, typed.params.delta, typed.params.field ?? "text")
            };
          case "turn/started":
            return this.#turnStarted(typed.params);
          case "turn/completed":
            return this.#turnCompleted(typed.params);
          case "turn/retracted":
            return this.#turnRetracted(typed.params);
          case "turn/unqueued":
            return this.#turnUnqueued(typed.params);
          case "turn/retryScheduled":
            return this.#turnRetryScheduled(typed.params);
          case "turn/foregroundCompleted":
            return this.#turnForegroundCompleted(typed.params);
          case "approval/requested":
            return this.#approvalRequested(typed.params);
          case "approval/updated":
            return this.#approvalUpdated(typed.params);
          case "approval/resolved":
            return this.#approvalResolved(typed.params);
          case "userInput/requested":
            return this.#userInputRequested(typed.params);
          case "userInput/settled":
            return this.#userInputSettled(typed.params);
          case "view/gap":
            return this.#deliveryGap(typed.params);
          case "session/modelRouteUnserved":
            return { kind: "modelRouteUnserved", params: typed.params };
          case "session/modelChanged":
          case "session/reasoningEffortChanged":
          case "session/goalChanged":
          case "session/todoListChanged":
          case "session/branchChanged":
          case "session/tokenUsage":
          case "session/contextUsage":
          case "session/approvalModeChanged":
          case "session/nameChanged":
            return {
              kind: "sessionState",
              outcome: this.#sessionStateStore.apply(typed.method, typed.params, typed.params.viewCursor)
            };
          default: {
            const unrecognized = event;
            return { kind: "ignoredUnrecognizedMethod", method: unrecognized.method };
          }
        }
      }
      /** Turns in first-observed order. */
      turns() {
        return [...this.#turns.values()].map((turn) => _SessionFold.#turnSnapshot(turn));
      }
      turn(turnId) {
        const held = this.#turns.get(turnId);
        return held === void 0 ? void 0 : _SessionFold.#turnSnapshot(held);
      }
      /** Approvals awaiting a durable terminal, in first-observed order. */
      pendingApprovals() {
        return [...this.#pendingApprovals.entries()].map(([approvalId, held]) => ({
          approvalId,
          requested: held.requested,
          ...held.latestUpdate !== void 0 ? { latestUpdate: held.latestUpdate } : {}
        }));
      }
      /** The winning durable terminal per approval, in first-observed order. */
      resolvedApprovals() {
        return [...this.#resolvedApprovals.values()];
      }
      /**
       * Prompts awaiting a durable settlement, in first-observed order. The
       * entries ARE the generated request params — the wire shape already carries
       * `userInputId`, so a wrapper would only duplicate it (unlike
       * `PendingApproval`, which earns its wrapper with `latestUpdate`).
       */
      pendingUserInputs() {
        return [...this.#pendingUserInputs.values()];
      }
      /** The winning durable settlement per prompt, in first-observed order. */
      settledUserInputs() {
        return [...this.#settledUserInputs.values()];
      }
      // ---- turn lifecycle -----------------------------------------------------
      #turnStarted(params) {
        const turn = this.#turnFor(params.turnId);
        if (turn.state !== "running") {
          return { kind: "ignoredStaleFrame", method: "turn/started", id: params.turnId };
        }
        turn.commandId = params.commandId;
        turn.state = "running";
        this.#activeTurnId = params.turnId;
        return { kind: "turn", turnId: params.turnId, state: turn.state };
      }
      #turnCompleted(params) {
        const turn = this.#turnFor(params.turnId);
        if (turn.state === "retracted" || turn.state === "unqueued") {
          return { kind: "ignoredStaleFrame", method: "turn/completed", id: params.turnId };
        }
        turn.state = "settled";
        turn.terminal = params.terminal;
        if (params.error !== void 0)
          turn.error = params.error;
        turn.retryScheduled = void 0;
        turn.foregroundCompleted = void 0;
        this.#clearActive(params.turnId);
        return { kind: "turn", turnId: params.turnId, state: turn.state };
      }
      #turnRetracted(params) {
        const turn = this.#turnFor(params.turnId);
        turn.commandId = params.commandId;
        turn.state = "retracted";
        this.#clearActive(params.turnId);
        return { kind: "turn", turnId: params.turnId, state: turn.state };
      }
      #turnUnqueued(params) {
        const turn = this.#turnFor(params.turnId);
        turn.commandId = params.commandId;
        turn.state = "unqueued";
        this.#clearActive(params.turnId);
        return { kind: "turn", turnId: params.turnId, state: turn.state };
      }
      #turnRetryScheduled(params) {
        const turn = this.#turnFor(params.turnId);
        if (turn.state !== "running") {
          return { kind: "ignoredStaleFrame", method: "turn/retryScheduled", id: params.turnId };
        }
        turn.retryScheduled = params;
        return { kind: "turn", turnId: params.turnId, state: turn.state };
      }
      #turnForegroundCompleted(params) {
        const turn = this.#turnFor(params.turnId);
        if (turn.state !== "running") {
          return { kind: "ignoredStaleFrame", method: "turn/foregroundCompleted", id: params.turnId };
        }
        turn.foregroundCompleted = params;
        return { kind: "turn", turnId: params.turnId, state: turn.state };
      }
      #turnFor(turnId) {
        const held = this.#turns.get(turnId);
        if (held !== void 0)
          return held;
        const fresh = { turnId, state: "running" };
        this.#turns.set(turnId, fresh);
        return fresh;
      }
      #clearActive(turnId) {
        if (this.#activeTurnId === turnId)
          this.#activeTurnId = void 0;
      }
      static #turnSnapshot(turn) {
        return {
          turnId: turn.turnId,
          state: turn.state,
          ...turn.commandId !== void 0 ? { commandId: turn.commandId } : {},
          ...turn.terminal !== void 0 ? { terminal: turn.terminal } : {},
          ...turn.error !== void 0 ? { error: turn.error } : {},
          ...turn.retryScheduled !== void 0 ? { retryScheduled: turn.retryScheduled } : {},
          ...turn.foregroundCompleted !== void 0 ? { foregroundCompleted: turn.foregroundCompleted } : {}
        };
      }
      // ---- the delivery-plane marker ------------------------------------------
      #deliveryGap(params) {
        this.#pendingGap = {
          after: this.#pendingGap?.after ?? params.after,
          next: params.next,
          sessionId: params.sessionId
        };
        return { after: params.after, kind: "deliveryGap", next: params.next };
      }
      // ---- approvals and user input as fold inputs ----------------------------
      #approvalRequested(params) {
        if (this.#resolvedApprovals.has(params.approvalId)) {
          return { kind: "ignoredStaleFrame", method: "approval/requested", id: params.approvalId };
        }
        this.#pendingApprovals.set(params.approvalId, { requested: params });
        return { kind: "approvalPending", approvalId: params.approvalId, requested: params };
      }
      #approvalUpdated(params) {
        const held = this.#pendingApprovals.get(params.approvalId);
        if (held === void 0) {
          return { kind: "ignoredStaleFrame", method: "approval/updated", id: params.approvalId };
        }
        held.latestUpdate = params;
        return { kind: "approvalPending", approvalId: params.approvalId, requested: held.requested };
      }
      #approvalResolved(params) {
        this.#pendingApprovals.delete(params.approvalId);
        const firstTerminal = !this.#resolvedApprovals.has(params.approvalId);
        if (firstTerminal)
          this.#resolvedApprovals.set(params.approvalId, params);
        return { kind: "approvalResolved", approvalId: params.approvalId, firstTerminal };
      }
      #userInputRequested(params) {
        if (this.#settledUserInputs.has(params.userInputId)) {
          return { kind: "ignoredStaleFrame", method: "userInput/requested", id: params.userInputId };
        }
        this.#pendingUserInputs.set(params.userInputId, params);
        return { kind: "userInputPending", userInputId: params.userInputId };
      }
      #userInputSettled(params) {
        this.#pendingUserInputs.delete(params.userInputId);
        const firstSettlement = !this.#settledUserInputs.has(params.userInputId);
        if (firstSettlement)
          this.#settledUserInputs.set(params.userInputId, params);
        return { kind: "userInputSettled", userInputId: params.userInputId, firstSettlement };
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/pending/pending-command-set.js
var COMMAND_REJECTED_CODE, COMMAND_REJECTED_KIND, QUEUED_DISPOSITION, PendingCommandSet;
var init_pending_command_set = __esm({
  "node_modules/@muse-code/sdk/dist/src/pending/pending-command-set.js"() {
    init_errors();
    COMMAND_REJECTED_CODE = -32030;
    COMMAND_REJECTED_KIND = "commandRejected";
    QUEUED_DISPOSITION = "queued";
    PendingCommandSet = class _PendingCommandSet {
      #entries = /* @__PURE__ */ new Map();
      #ephemeralDiscardedCommandIds;
      #discarded = false;
      #nextSubmissionIndex = 0;
      constructor(options) {
        this.#ephemeralDiscardedCommandIds = options?.discardedCommandIds ?? /* @__PURE__ */ new Set();
      }
      /**
       * Record a submission. `anchorAfterItemId` is the last item present in the
       * client's fold right now (SS4.13 insertion point).
       */
      submitted(params) {
        this.#assertNotEphemeralReplay(params.commandId);
        this.#assertSessionActive();
        if (this.#entries.has(params.commandId)) {
          return;
        }
        const entry = {
          commandId: params.commandId,
          input: params.input,
          anchorAfterItemId: params.anchorAfterItemId ?? null,
          submissionIndex: this.#nextSubmissionIndex++
        };
        if (params.displayText !== void 0)
          entry.displayText = params.displayText;
        this.#entries.set(params.commandId, entry);
      }
      /** The submit (or a replay) was acked. */
      acked(commandId, ack) {
        const entry = this.#entries.get(commandId);
        if (entry === void 0)
          return;
        entry.ack = ack;
      }
      /**
       * The submit (or a replay) answered with an error.
       *
       * Only a durable `commandRejected` (-32030) is a settlement. Every other
       * error admits nothing — the other SS3.1.2 admission errors and SS1's
       * envelope errors, `inputTooLarge` among them — so the entry HOLDS while
       * the client retries with the same `commandId` (SS4.13 "Nothing-admitted
       * errors are not settlements").
       */
      ackErrored(commandId, error) {
        const entry = this.#entries.get(commandId);
        if (entry === void 0)
          return "held";
        if (!_PendingCommandSet.isSettlement(error))
          return "held";
        return this.#retire(entry, this.#rejectionRetirement(entry, error));
      }
      /**
       * The client has decided to stop retrying a nothing-admitted error. The
       * entry must not linger as a durable-looking echo (SS4.13).
       */
      stopRetrying(commandId) {
        const entry = this.#entries.get(commandId);
        if (entry === void 0)
          return void 0;
        return this.#retire(entry, {
          kind: "retryAbandonedByClient",
          commandId,
          input: entry.input,
          restoreToComposer: true
        });
      }
      /**
       * A `userMessage` item carrying this `commandId` folded in: the entry
       * materialized and the item replaces it at the item's own transcript
       * position (SS4.13 "Materialized").
       *
       * Multi-client echo de-duplication falls out of the same join: a
       * `userMessage` with no matching local entry is another client's
       * submission — this returns `undefined` and the caller renders it plainly.
       */
      observedUserMessage(commandId, itemId) {
        const entry = this.#entries.get(commandId);
        if (entry === void 0)
          return void 0;
        return this.#retire(entry, { kind: "materialized", commandId, matchedBy: "userMessage", itemId });
      }
      /**
       * A reclaim this client actually observed (its own reclaim ack, or any live
       * fold D-024's lane charters). Retire immediately — same composer restore,
       * without waiting for a snapshot join (SS4.13 "Reclaimed").
       */
      observedReclaim(commandId) {
        const entry = this.#entries.get(commandId);
        if (entry === void 0)
          return void 0;
        return this.#retire(entry, {
          kind: "reclaimed",
          commandId,
          input: entry.input,
          restoreToComposer: true
        });
      }
      /**
       * Queue movement: a `turn/started` or `turn/completed` for a turn that is
       * NOT the entry's own.
       *
       * SS4.3 carries no view event for a command-intake settlement, so a
       * post-ack rejection reaches a live client only by replay: on each such
       * event a client holding an acked-QUEUED entry MUST re-verify it by
       * replaying its `commandId`. Queue movement is the trigger precisely
       * because a queued turn's fate is decided at its launch boundary — no
       * polling loop and no invented timeout (SS3.1.3 stays intact).
       *
       * @returns the `commandId`s the caller must replay.
       */
      observedQueueMovement(turnId) {
        const out = [];
        for (const entry of this.#entries.values()) {
          if (entry.ack === void 0)
            continue;
          if (entry.ack.disposition !== QUEUED_DISPOSITION)
            continue;
          if (entry.ack.turnId === turnId)
            continue;
          out.push(entry.commandId);
        }
        return out;
      }
      /**
       * Feed back a `commandId` replay answer (SS3.1.1 — always safe).
       *
       * Three shapes, per SS4.13's rejected/abandoned arms:
       *  - a durable rejection: retire (reason `"abandoned"` → Abandoned arm,
       *    any other reason → Rejected arm);
       *  - the original ack, still pending: keep waiting;
       *  - an ack whose staleness only a snapshot can prove: keep waiting — the
       *    reclaimed signature needs `queuedTurns` in hand (`joinSnapshot`).
       */
      replayAnswered(commandId, answer) {
        this.#assertNotEphemeralReplay(commandId);
        const entry = this.#entries.get(commandId);
        if (entry === void 0)
          return "held";
        if (answer.kind === "ack") {
          entry.ack = answer.ack;
          return "held";
        }
        if (!_PendingCommandSet.isSettlement(answer.error))
          return "held";
        return this.#retire(entry, this.#rejectionRetirement(entry, answer.error));
      }
      /**
       * Reconnect with NO snapshot (`history.mode: "none"`, the default
       * cursor-resume path). There is no join to run, so reconnect itself is the
       * trigger: replay each ACKED entry's `commandId` once; resubmit each
       * UNACKED entry's same `commandId` once before any retire-to-composer.
       *
       * Without `queuedTurns` in hand the reclaimed signature is undecidable, so
       * a stale `"queued"` ack waits for the next snapshot join or queue
       * movement — never a locally invented terminal.
       */
      reconnectedWithoutSnapshot() {
        const mustReplay = [];
        const mustResubmit = [];
        for (const entry of this.#ordered()) {
          if (entry.ack === void 0) {
            mustResubmit.push(entry.commandId);
          } else {
            mustReplay.push(entry.commandId);
          }
        }
        return {
          retirements: [],
          mustReplay,
          mustResubmit,
          kept: this.#ordered().map((e) => e.commandId)
        };
      }
      /**
       * Join local entries against an authoritative snapshot (SS4.9), by
       * `commandId`. The five arms, in the order SS4.13 states them.
       */
      joinSnapshot(facts) {
        const retirements = [];
        const mustReplay = [];
        const mustResubmit = [];
        const userMessageItemByCommandId = /* @__PURE__ */ new Map();
        for (const pair of facts.userMessageCommandIds) {
          userMessageItemByCommandId.set(pair.commandId, pair.itemId);
        }
        const queuedIndexByCommandId = /* @__PURE__ */ new Map();
        facts.queuedTurns.forEach((q, index) => queuedIndexByCommandId.set(q.commandId, index));
        for (const entry of this.#ordered()) {
          const { commandId } = entry;
          const userMessageItemId = userMessageItemByCommandId.get(commandId);
          if (userMessageItemId !== void 0) {
            retirements.push(this.#retire(entry, {
              kind: "materialized",
              commandId,
              matchedBy: "userMessage",
              itemId: userMessageItemId
            }));
            continue;
          }
          if (facts.activeTurn?.commandId === commandId) {
            retirements.push(this.#retire(entry, { kind: "materialized", commandId, matchedBy: "activeTurn" }));
            continue;
          }
          const queuedIndex = queuedIndexByCommandId.get(commandId);
          if (queuedIndex !== void 0) {
            entry.queuedOrder = queuedIndex;
            entry.anchorAfterItemId = facts.lastItemId;
            continue;
          }
          if (entry.ack !== void 0 && facts.activeTurn !== null && entry.ack.turnId === facts.activeTurn.turnId) {
            continue;
          }
          if (entry.ack !== void 0) {
            mustReplay.push(commandId);
            continue;
          }
          mustResubmit.push(commandId);
        }
        return {
          retirements,
          mustReplay,
          mustResubmit,
          kept: this.#ordered().map((e) => e.commandId)
        };
      }
      /**
       * The reclaimed signature, decidable only with a snapshot in hand: an
       * acked-queued entry ABSENT from the snapshot's `queuedTurns` whose replay
       * still answers the stale `"queued"` ack retires as *reclaimed* at the
       * snapshot join (SS4.13 "Reclaimed").
       *
       * Call this with the replay answer for a `mustReplay` entry produced by
       * `joinSnapshot`, passing the same snapshot's `queuedTurns` commandIds.
       */
      resolveReplayAtJoin(commandId, answer, snapshotQueuedCommandIds) {
        this.#assertNotEphemeralReplay(commandId);
        const entry = this.#entries.get(commandId);
        if (entry === void 0)
          return "held";
        if (answer.kind === "error") {
          if (!_PendingCommandSet.isSettlement(answer.error))
            return "held";
          return this.#retire(entry, this.#rejectionRetirement(entry, answer.error));
        }
        const stillQueuedByServer = new Set(snapshotQueuedCommandIds).has(commandId);
        if (answer.ack.disposition === QUEUED_DISPOSITION && !stillQueuedByServer) {
          return this.#retire(entry, {
            kind: "reclaimed",
            commandId,
            input: entry.input,
            restoreToComposer: true
          });
        }
        entry.ack = answer.ack;
        return "held";
      }
      /**
       * Abnormal death of an EPHEMERAL-profile host (SS2.13, SS4.4.3 carve-out):
       * nothing is ever settled, replaying a `commandId` at a new host is
       * forbidden, and every entry falls under the discard obligation as
       * terminal-unknown — a client-side annotation, never a wire fact.
       */
      discardEphemeral() {
        const out = [];
        for (const entry of this.#ordered()) {
          this.#ephemeralDiscardedCommandIds.add(entry.commandId);
          out.push(this.#retire(entry, {
            kind: "terminalUnknown",
            commandId: entry.commandId,
            input: entry.input
          }));
        }
        this.#discarded = true;
        return out;
      }
      /** Has the ephemeral discard closed this set? */
      get discarded() {
        return this.#discarded;
      }
      #assertSessionActive() {
        if (this.#discarded) {
          throw new MuseSessionDiscardedError("ephemeral session was discarded after abnormal host death; it accepts no new submissions");
        }
      }
      #assertNotEphemeralReplay(commandId) {
        if (this.#ephemeralDiscardedCommandIds.has(commandId)) {
          throw new MuseSessionDiscardedError(`ephemeral host died; commandId \`${commandId}\` cannot be replayed against a new host`);
        }
      }
      /**
       * Entries in render order.
       *
       * Before any join this is submission order. After a join, entries the
       * server confirmed queued are re-anchored to the end of the reconciled
       * fold and ordered among themselves by `queuedTurns` — so they sort after
       * the submission-anchored entries (steers and unacked), which keep their
       * own anchors. That is SS4.13's "entries render in submission order, and
       * for queued submits the server-confirmed order wins whenever it is
       * observed".
       */
      list() {
        return this.#ordered().map((entry) => {
          const out = {
            commandId: entry.commandId,
            input: entry.input,
            anchorAfterItemId: entry.anchorAfterItemId,
            submissionIndex: entry.submissionIndex,
            ...entry.displayText !== void 0 ? { displayText: entry.displayText } : {},
            ...entry.ack !== void 0 ? { ack: entry.ack } : {},
            ...entry.queuedOrder !== void 0 ? { queuedOrder: entry.queuedOrder } : {}
          };
          return out;
        });
      }
      get(commandId) {
        return this.list().find((e) => e.commandId === commandId);
      }
      has(commandId) {
        return this.#entries.has(commandId);
      }
      get size() {
        return this.#entries.size;
      }
      /**
       * Only a durable `commandRejected` (-32030) settles a command. Everything
       * else admitted nothing (SS4.13).
       *
       * The registry binds `-32030` <-> `commandRejected` one-to-one (SS3.1.2
       * Appendix B), so a response where the two fields DISAGREE is a server
       * fault in which one field still asserts the durable rejection. Either
       * signal settles (OR): SS3.1.2's stated bias for unfamiliar vocabulary is
       * toward terminal ("treat unknown reasons as terminal rejections"), and
       * holding forever on a half-asserted rejection strands the entry as the
       * durable-looking echo SS4.13 forbids.
       */
      static isSettlement(error) {
        return error.code === COMMAND_REJECTED_CODE || error.kind === COMMAND_REJECTED_KIND;
      }
      #rejectionRetirement(entry, error) {
        const reason = error.reason ?? "";
        if (reason === "abandoned") {
          return {
            kind: "abandoned",
            commandId: entry.commandId,
            input: entry.input,
            restoreToComposer: true
          };
        }
        return {
          kind: "rejected",
          commandId: entry.commandId,
          reason,
          input: entry.input,
          restoreToComposer: true
        };
      }
      #retire(entry, retirement) {
        this.#entries.delete(entry.commandId);
        return retirement;
      }
      #ordered() {
        const submissionAnchored = [];
        const launchOrdered = [];
        for (const entry of this.#entries.values()) {
          (entry.queuedOrder === void 0 ? submissionAnchored : launchOrdered).push(entry);
        }
        submissionAnchored.sort((a, b) => a.submissionIndex - b.submissionIndex);
        launchOrdered.sort((a, b) => (a.queuedOrder ?? 0) - (b.queuedOrder ?? 0));
        return [...submissionAnchored, ...launchOrdered];
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/connection/connection.js
import { createHash as createHash5 } from "node:crypto";
function requestKey(id) {
  return `${typeof id === "number" ? "number" : "string"}:${String(id)}`;
}
function utf8ByteLength(text2) {
  let bytes = 0;
  for (const scalar of text2) {
    const point = scalar.codePointAt(0);
    bytes += point <= 127 ? 1 : point <= 2047 ? 2 : point <= 65535 ? 3 : 4;
  }
  return bytes;
}
function truncateToUtf8Bytes(text2, limitBytes) {
  let bytes = 0;
  let end = 0;
  for (const scalar of text2) {
    const point = scalar.codePointAt(0);
    const width = point <= 127 ? 1 : point <= 2047 ? 2 : point <= 65535 ? 3 : 4;
    if (bytes + width > limitBytes)
      break;
    bytes += width;
    end += scalar.length;
  }
  return text2.slice(0, end);
}
function canonical(value) {
  if (Array.isArray(value))
    return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const object4 = value;
    return `{${Object.keys(object4).sort().map((key) => `${JSON.stringify(key)}:${canonical(object4[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
function fingerprint2(canonicalForm) {
  return createHash5("sha256").update(canonicalForm, "utf8").digest("hex");
}
function createUuidV7Mint() {
  let lastMs = -1;
  let sequence = 0;
  return () => {
    let now = Date.now();
    if (now <= lastMs) {
      now = lastMs;
      sequence += 1;
      if (sequence > 4095) {
        now += 1;
        sequence = 0;
      }
    } else {
      sequence = 0;
    }
    lastMs = now;
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    let timestamp3 = now;
    for (let index = 5; index >= 0; index -= 1) {
      bytes[index] = timestamp3 & 255;
      timestamp3 = Math.floor(timestamp3 / 256);
    }
    bytes[6] = 112 | sequence >> 8 & 15;
    bytes[7] = sequence & 255;
    bytes[8] = bytes[8] & 63 | 128;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };
}
async function defaultRetryDelay(attempt) {
  const ceilingMs = Math.min(2e3, 50 * 2 ** Math.max(0, attempt - 1));
  const delayMs = Math.floor(Math.random() * (ceilingMs + 1));
  await new Promise((resolve2) => setTimeout(resolve2, delayMs));
}
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
var DEFAULT_FRAME_LIMIT_BYTES, submissionTail, requestWithFrame, MspError, ProtocolError, Connection;
var init_connection = __esm({
  "node_modules/@muse-code/sdk/dist/src/connection/connection.js"() {
    DEFAULT_FRAME_LIMIT_BYTES = 10485760;
    submissionTail = /* @__PURE__ */ Symbol("Connection.submissionTail");
    requestWithFrame = /* @__PURE__ */ Symbol("Connection.requestWithFrame");
    MspError = class extends Error {
      code;
      kind;
      data;
      retryable;
      constructor(error) {
        super(error.message);
        this.name = "MspError";
        this.code = error.code;
        this.kind = error.data?.kind ?? "unknown";
        this.data = error.data === void 0 ? {} : { ...error.data };
        this.retryable = error.data?.retryable;
      }
    };
    ProtocolError = class extends Error {
      /**
       * The inbound frame (wire line) the violation was detected on, when there
       * is one — the whole line, e.g. the response a pending request refused;
       * an oversized frame is cut to the frame limit. Absent for local state
       * errors (closed connection, EOF) that no frame caused.
       */
      line;
      constructor(message, line) {
        super(message);
        this.name = "ProtocolError";
        this.line = line;
      }
    };
    Connection = class {
      #transport;
      #frameLimitBytes;
      #mintCommandId;
      #mintRequestId;
      #pending = /* @__PURE__ */ new Map();
      #commands = /* @__PURE__ */ new Map();
      #nextRequestId = 1;
      #serverRequestHandler;
      #notificationHandler;
      #protocolErrorHandler;
      #writeTail = Promise.resolve();
      // Settles when every accepted frame has been HANDED to the transport, as
      // opposed to #writeTail, which settles when the peer has taken it.
      #submitTail = Promise.resolve();
      #writeFailure;
      #buffer = "";
      #bufferBytes = 0;
      // FR-012: incremental accounting — never a full-buffer rescan per chunk
      // FR-012: the last UTF-16 unit of #buffer (-1 when empty), maintained from each
      // fresh chunk so the surrogate-pair reconciliation below never READS #buffer on
      // the hot no-newline path — reading it (charCodeAt/indexOf/regex) flattens the
      // V8 rope and copies the whole buffer per chunk, the O(bytes^2) this FR bans.
      #bufferTailCode = -1;
      #droppingOversized = false;
      #finished = false;
      #closedPromise;
      #resolveClosed;
      constructor(transport, options) {
        this.#transport = transport;
        this.#frameLimitBytes = options?.frameLimitBytes ?? DEFAULT_FRAME_LIMIT_BYTES;
        this.#mintCommandId = options?.mintCommandId ?? createUuidV7Mint();
        this.#mintRequestId = options?.mintRequestId ?? (() => {
          const id = this.#nextRequestId;
          this.#nextRequestId += 1;
          return id;
        });
        this.#closedPromise = new Promise((resolve2) => {
          this.#resolveClosed = resolve2;
        });
        void this.#readLoop();
      }
      get closed() {
        return this.#closedPromise;
      }
      /** See {@link submissionTail}. */
      [submissionTail]() {
        return this.#submitTail;
      }
      request(method, params) {
        return this.#request(method, params).then((framed) => framed.result);
      }
      /** See {@link requestWithFrame}. */
      [requestWithFrame](method, params) {
        return this.#request(method, params);
      }
      #request(method, params) {
        if (this.#finished)
          return Promise.reject(new ProtocolError("connection is closed"));
        const id = this.#mintRequestId();
        if (typeof id !== "string" && (typeof id !== "number" || !Number.isInteger(id))) {
          return Promise.reject(new ProtocolError("request id must be a string or integer"));
        }
        if (this.#pending.has(requestKey(id))) {
          return Promise.reject(new ProtocolError(`request id ${String(id)} is already in flight`));
        }
        const request = {
          jsonrpc: "2.0",
          id,
          method,
          ...params === void 0 ? {} : { params }
        };
        return new Promise((resolve2, reject) => {
          this.#pending.set(requestKey(id), {
            resolve: (result, line) => resolve2({ result, line }),
            reject
          });
          void this.#write(request).catch((error) => {
            this.#pending.delete(requestKey(id));
            reject(error);
          });
        });
      }
      /**
       * Take one id from THIS connection's single `commandId` minter (INV-013).
       *
       * Exposed for the callers that need the id BEFORE the ack: `sendUserTurn`
       * records its optimistic SS4.13 entry under it, and an entry created only on
       * the ack is invisible for exactly the window it exists to cover. The
       * alternative was a facade-side mint, which is the second minter INV-013
       * forbids — delegating here keeps the single-minter property intact and
       * preserves the injected `mintCommandId` seam for deterministic transcripts.
       *
       * Pair it with `command(..., { commandId })`, which reuses the id instead of
       * minting a second one.
       */
      mintCommandId() {
        return this.#mintCommandId();
      }
      notify(method, params) {
        const notification = {
          jsonrpc: "2.0",
          method,
          ...params === void 0 ? {} : { params }
        };
        void this.#write(notification).catch((error) => this.#finish(error));
      }
      onServerRequest(handler) {
        this.#serverRequestHandler = handler;
      }
      onNotification(handler) {
        this.#notificationHandler = handler;
      }
      onProtocolError(handler) {
        this.#protocolErrorHandler = handler;
      }
      async flush() {
        await this.#writeTail;
        if (this.#writeFailure !== void 0)
          throw this.#writeFailure;
      }
      async command(method, params, options) {
        const commandId = options?.commandId ?? this.#mintCommandId();
        const commandParams = { ...params, commandId };
        const signature = fingerprint2(canonical({ method, params: commandParams }));
        const memory = this.#commands.get(commandId);
        if (memory !== void 0 && memory.signature !== signature) {
          throw new ProtocolError(`commandId ${commandId} was reused with a different payload`);
        }
        const remembered = memory ?? { signature };
        this.#commands.set(commandId, remembered);
        const maxAttempts = Math.max(1, options?.maxAttempts ?? 3);
        const retryDelay = options?.retryDelay ?? defaultRetryDelay;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          try {
            const ack = await this.request(method, commandParams);
            if (ack["commandId"] !== void 0 && ack["commandId"] !== commandId) {
              throw new ProtocolError(`${method} ack commandId ${String(ack["commandId"])} did not echo ${commandId}`);
            }
            const ackFingerprint = fingerprint2(canonical(ack));
            if (remembered.ack !== void 0 && remembered.ack !== ackFingerprint) {
              throw new ProtocolError(`${method} replay for commandId ${commandId} did not return a value-identical ack`);
            }
            remembered.ack = ackFingerprint;
            return ack;
          } catch (error) {
            const retryableNothingAdmitted = error instanceof MspError && (error.code === -32001 && error.kind === "overloaded" || error.code === -32031 && error.kind === "backpressured");
            if (!retryableNothingAdmitted || attempt === maxAttempts)
              throw error;
            await retryDelay(attempt, error);
          }
        }
        throw new ProtocolError("unreachable command retry state");
      }
      async close() {
        const tail = this.#writeTail;
        if (this.#transport.close !== void 0) {
          await this.#transport.close(this.#submitTail);
          await tail;
        } else {
          this.#finish(new ProtocolError("connection closed"));
        }
        await this.#closedPromise;
      }
      async #write(frame) {
        if (this.#finished)
          throw new ProtocolError("connection is closed");
        const line = `${JSON.stringify(frame)}
`;
        let markSubmitted;
        const submitted = new Promise((resolve2) => {
          markSubmitted = resolve2;
        });
        this.#submitTail = this.#submitTail.then(() => submitted);
        const write = this.#writeTail.then(async () => {
          try {
            if (this.#finished)
              throw new ProtocolError("connection is closed");
            const inFlight = this.#transport.write(line);
            markSubmitted();
            await inFlight;
          } catch (error) {
            markSubmitted();
            throw error;
          }
        });
        this.#writeTail = write.catch((error) => {
          this.#writeFailure = error;
          this.#finish(error);
        });
        await write;
      }
      async #readLoop() {
        try {
          for await (const chunk of this.#transport.incoming)
            this.#ingest(chunk);
          if (!this.#droppingOversized && this.#buffer.length > 0) {
            this.#protocolError(new ProtocolError("inbound frame ended without a newline", this.#buffer));
          }
          this.#finish(new ProtocolError("connection reached EOF"));
        } catch (error) {
          this.#finish(error);
        }
      }
      #ingest(chunk) {
        let remaining = chunk;
        if (this.#droppingOversized) {
          const newline = remaining.indexOf("\n");
          if (newline < 0)
            return;
          this.#droppingOversized = false;
          remaining = remaining.slice(newline + 1);
        }
        if (remaining.length === 0)
          return;
        const chunkHead = remaining.charCodeAt(0);
        if (this.#bufferTailCode >= 55296 && this.#bufferTailCode <= 56319 && chunkHead >= 56320 && chunkHead <= 57343) {
          this.#bufferBytes -= 2;
        }
        this.#buffer += remaining;
        this.#bufferBytes += utf8ByteLength(remaining);
        this.#bufferTailCode = remaining.charCodeAt(remaining.length - 1);
        if (remaining.includes("\n")) {
          while (true) {
            const newline = this.#buffer.indexOf("\n");
            if (newline < 0)
              break;
            const line = this.#buffer.slice(0, newline);
            this.#buffer = this.#buffer.slice(newline + 1);
            this.#bufferBytes -= utf8ByteLength(line) + 1;
            this.#line(line);
          }
        }
        if (this.#bufferBytes > this.#frameLimitBytes) {
          this.#protocolError(new ProtocolError(`inbound frame exceeds ${this.#frameLimitBytes} bytes`, truncateToUtf8Bytes(this.#buffer, this.#frameLimitBytes)));
          this.#buffer = "";
          this.#bufferBytes = 0;
          this.#bufferTailCode = -1;
          this.#droppingOversized = true;
        }
      }
      #line(raw) {
        const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
        if (line.trim().length === 0)
          return;
        if (utf8ByteLength(line) > this.#frameLimitBytes) {
          this.#protocolError(new ProtocolError(`inbound frame exceeds ${this.#frameLimitBytes} bytes`, truncateToUtf8Bytes(line, this.#frameLimitBytes)));
          return;
        }
        let parsed;
        try {
          parsed = JSON.parse(line);
        } catch {
          this.#protocolError(new ProtocolError("inbound frame is not valid JSON", line));
          return;
        }
        if (!isObject(parsed) || parsed["jsonrpc"] !== "2.0") {
          this.#protocolError(new ProtocolError("inbound frame is not a JSON-RPC 2.0 object", line));
          return;
        }
        const method = parsed["method"];
        const id = parsed["id"];
        if (typeof method === "string") {
          if (typeof id === "string" || typeof id === "number") {
            if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
              this.#protocolError(new ProtocolError("server request id must be a positive integer", line));
              return;
            }
            void this.#serverRequest(parsed).catch((error) => {
              this.#finish(error);
            });
            return;
          }
          this.#notificationHandler?.(parsed);
          return;
        }
        if (typeof id !== "string" && typeof id !== "number") {
          this.#protocolError(new ProtocolError("response has no usable id", line));
          return;
        }
        this.#response(parsed, id, line);
      }
      #response(frame, id, line) {
        const pending = this.#pending.get(requestKey(id));
        if (pending === void 0) {
          this.#protocolError(new ProtocolError(`response for unknown request id ${String(id)}`, line));
          return;
        }
        const hasResult = Object.hasOwn(frame, "result");
        const hasError = Object.hasOwn(frame, "error");
        if (hasResult === hasError) {
          const violation = new ProtocolError("response must carry exactly one of result or error", line);
          this.#pending.delete(requestKey(id));
          pending.reject(violation);
          this.#protocolError(violation);
          return;
        }
        this.#pending.delete(requestKey(id));
        if (hasResult) {
          const result = frame["result"];
          if (!isObject(result)) {
            pending.reject(new ProtocolError("response result must be an object", line));
            return;
          }
          pending.resolve(result, line);
          return;
        }
        const error = frame["error"];
        if (!isObject(error) || typeof error["code"] !== "number" || !Number.isInteger(error["code"]) || typeof error["message"] !== "string") {
          pending.reject(new ProtocolError("error response has an invalid error object", line));
          return;
        }
        const data = error["data"];
        if (!isObject(data) || typeof data["kind"] !== "string") {
          pending.reject(new ProtocolError("MSP error response has no data.kind", line));
          return;
        }
        pending.reject(new MspError({
          code: error["code"],
          message: error["message"],
          data
        }));
      }
      async #serverRequest(request) {
        const id = request.id;
        try {
          if (this.#serverRequestHandler === void 0) {
            throw new MspError({
              code: -32601,
              message: `method not found: ${request.method}`,
              data: { kind: "methodNotFound", retryable: false }
            });
          }
          const result = await this.#serverRequestHandler(request);
          await this.#write({ jsonrpc: "2.0", id, result }).catch((writeError) => this.#finish(writeError));
        } catch (error) {
          const typed = error instanceof MspError ? error : new MspError({
            code: -32603,
            message: error instanceof Error ? error.message : "server request handler failed",
            data: { kind: "internal" }
          });
          await this.#write({
            jsonrpc: "2.0",
            id,
            error: {
              code: typed.code,
              message: typed.message,
              data: typed.data
            }
          }).catch((writeError) => this.#finish(writeError));
        }
      }
      #protocolError(error) {
        this.#protocolErrorHandler?.(error);
      }
      #finish(reason) {
        if (this.#finished)
          return;
        this.#finished = true;
        const error = reason instanceof Error ? reason : new ProtocolError(String(reason));
        for (const pending of this.#pending.values())
          pending.reject(error);
        this.#pending.clear();
        this.#resolveClosed?.();
        this.#resolveClosed = void 0;
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/connection/spawn.js
import { spawn } from "node:child_process";
function makeShutdownDeadline(budgetMs) {
  let timer;
  const expired = new Promise((resolve2) => {
    timer = setTimeout(resolve2, budgetMs);
  });
  return {
    expired,
    clear: () => {
      if (timer !== void 0)
        clearTimeout(timer);
      timer = void 0;
    }
  };
}
function classifyExit(processExit, stderrTail) {
  const evidence = [...stderrTail];
  switch (processExit.code) {
    case 0:
      return { kind: "cleanShutdown" };
    case 1:
      return { kind: "unhandledError", exitCode: 1, stderrTail: evidence };
    case 2:
      return { kind: "usageError", exitCode: 2, stderrTail: evidence, retry: "never" };
    case 3:
      return { kind: "configError", exitCode: 3, stderrTail: evidence, retry: "fix-config" };
    case 4:
      return {
        kind: "leaseUnavailable",
        exitCode: 4,
        stderrTail: evidence,
        retry: "after-lease-release"
      };
    case 5:
      return {
        kind: "sdkSurfaceUnavailable",
        exitCode: 5,
        stderrTail: evidence,
        retry: "never"
      };
    default:
      return {
        kind: "crash",
        exitCode: processExit.code,
        exitSignal: processExit.signal,
        stderrTail: evidence
      };
  }
}
function isBenignCloseRace(error) {
  const code = error?.code;
  return code === "ERR_STREAM_DESTROYED" || code === "EPIPE" || code === "ECANCELED";
}
function assertShutdownTimeout(shutdownTimeoutMs) {
  if (!Number.isInteger(shutdownTimeoutMs) || shutdownTimeoutMs < 0 || shutdownTimeoutMs > MAX_SHUTDOWN_TIMEOUT_MS) {
    throw new RangeError(`shutdownTimeoutMs must be an integer in 0..${MAX_SHUTDOWN_TIMEOUT_MS}, got ${String(shutdownTimeoutMs)}`);
  }
}
function buildSpawnOptions(options) {
  return {
    ...options.cwd === void 0 ? {} : { cwd: options.cwd },
    ...options.env === void 0 ? {} : { env: options.env },
    detached: options.detached,
    // FR-45141-1: `muse serve` is never meant to be seen. Without this, a
    // Windows host with no console of its own pops a console window for the
    // life of the connection; the flag is a no-op on other platforms.
    windowsHide: true
  };
}
function spawnMspConnection(options) {
  return new MspHandshake(options);
}
var DEFAULT_STDERR_MAX_BYTES, DEFAULT_STDERR_MAX_LINES, DEFAULT_SHUTDOWN_TIMEOUT_MS, SIGTERM_GRACE_MS, MAX_SHUTDOWN_TIMEOUT_MS, ownedTransport, adoptFlushSource, initializeAnswered, StderrTail, ChildStdioTransport, MuseServeChild, MspHandshake, SpawnedMspConnection;
var init_spawn = __esm({
  "node_modules/@muse-code/sdk/dist/src/connection/spawn.js"() {
    init_connection();
    init_fingerprint();
    DEFAULT_STDERR_MAX_BYTES = 8 * 1024;
    DEFAULT_STDERR_MAX_LINES = 100;
    DEFAULT_SHUTDOWN_TIMEOUT_MS = 3e4;
    SIGTERM_GRACE_MS = 2e3;
    MAX_SHUTDOWN_TIMEOUT_MS = 2147483647;
    ownedTransport = /* @__PURE__ */ Symbol("MuseServeChild.transport");
    adoptFlushSource = /* @__PURE__ */ Symbol("ChildStdioTransport.adoptFlushSource");
    initializeAnswered = /* @__PURE__ */ Symbol("MspHandshake.initializeAnswered");
    StderrTail = class {
      #text = "";
      push(chunk) {
        this.#text += chunk;
        this.#trimLines();
        this.#trimBytes();
      }
      lines() {
        if (this.#text.length === 0)
          return [];
        const lines = this.#text.split("\n");
        if (lines.at(-1) === "")
          lines.pop();
        return lines;
      }
      #trimLines() {
        let lineCount = this.#text.split("\n").length;
        if (this.#text.endsWith("\n"))
          lineCount -= 1;
        while (lineCount > DEFAULT_STDERR_MAX_LINES) {
          const firstBreak = this.#text.indexOf("\n");
          if (firstBreak < 0)
            break;
          this.#text = this.#text.slice(firstBreak + 1);
          lineCount -= 1;
        }
      }
      #trimBytes() {
        const bytes = Buffer.from(this.#text, "utf8");
        if (bytes.byteLength <= DEFAULT_STDERR_MAX_BYTES)
          return;
        let start = bytes.byteLength - DEFAULT_STDERR_MAX_BYTES;
        while (start < bytes.byteLength && (bytes[start] & 192) === 128)
          start += 1;
        this.#text = bytes.subarray(start).toString("utf8");
      }
    };
    ChildStdioTransport = class {
      child;
      incoming;
      exited;
      #shutdownTimeoutMs;
      #makeShutdownDeadline;
      // True only when the boundary that SPAWNED this child made it a process-
      // group leader (FR-017b). Never inferred from the child itself: a test
      // handing the transport an ordinary child keeps the direct-kill path.
      #ownsProcessGroup;
      #closing;
      // The default `flushed` for closes routed AROUND the connection — notably
      // the public `child.close()`. Without it, step 0 existed only for
      // Connection-routed closes while the contract claimed all three surfaces
      // behaved identically, and `#closing ??=` let whichever call won the race
      // discard the other's submission promise (PR #22819 round 4).
      #defaultFlushed;
      constructor(child, onStderr, shutdownTimeoutMs = DEFAULT_SHUTDOWN_TIMEOUT_MS, ownsProcessGroup = false, deadlineFactory = makeShutdownDeadline) {
        this.child = child;
        assertShutdownTimeout(shutdownTimeoutMs);
        this.#shutdownTimeoutMs = shutdownTimeoutMs;
        this.#ownsProcessGroup = ownsProcessGroup;
        this.#makeShutdownDeadline = deadlineFactory;
        this.child.stdout.setEncoding("utf8");
        this.child.stderr.setEncoding("utf8");
        this.child.stderr.on("data", (chunk) => onStderr?.(chunk));
        this.child.stdin.on("error", () => {
        });
        this.incoming = this.#stdoutChunks();
        this.exited = new Promise((resolve2, reject) => {
          this.child.once("error", reject);
          this.child.once("close", (code, signal) => resolve2({ code, signal }));
        });
        this.exited.catch(() => {
        });
      }
      async write(chunk) {
        if (this.child.stdin.destroyed)
          throw new ProtocolError("spawned MSP host stdin is closed");
        await new Promise((resolve2, reject) => {
          this.child.stdin.write(chunk, "utf8", (error) => error ? reject(error) : resolve2());
        });
      }
      /**
       * The single owner of shutdown (#15943). EOF first, then bounded: SS2.1.2
       * gives the host a drain window and says the remainder past it has crash
       * semantics, so past the window the SDK ends the process it owns rather
       * than waiting on an EOF that may never come. Memoized, so concurrent and
       * repeated calls share one attempt and one set of timers.
       */
      /** Module-private friend seam used by the handshake that owns both sides. */
      [adoptFlushSource](source) {
        this.#defaultFlushed = source;
      }
      async close(flushed) {
        this.#closing ??= this.#shutdown(flushed ?? this.#defaultFlushed?.());
        await this.#closing;
      }
      async #shutdown(flushed) {
        const deadline = this.#makeShutdownDeadline(this.#shutdownTimeoutMs);
        try {
          if (flushed !== void 0)
            await this.#beforeDeadline(flushed, deadline.expired);
          return await this.#shutdownAfterFlush(deadline.expired);
        } finally {
          deadline.clear();
        }
      }
      async #shutdownAfterFlush(deadline) {
        const eof = this.#endStdin();
        eof.catch(() => {
        });
        await this.#awaitExitOrTerminate(deadline);
        await eof;
      }
      async #endStdin() {
        if (this.child.stdin.destroyed || this.child.stdin.writableEnded)
          return;
        await new Promise((resolve2, reject) => {
          this.child.stdin.end((error) => error === null || error === void 0 || isBenignCloseRace(error) ? resolve2() : reject(error));
        });
      }
      /**
       * Escalate only as far as the host forces. Every stage ends at the child's
       * REAL exit, so `exited` — and every classification derived from it — stays
       * a function of the observed `(code, signal)` pair (INV-011). A signal is a
       * way to reach an exit, never a substitute for observing one.
       */
      async #awaitExitOrTerminate(deadline) {
        if (await this.#beforeDeadline(this.#settled(), deadline))
          return;
        this.#signal("SIGTERM");
        if (await this.#settledWithin(SIGTERM_GRACE_MS))
          return;
        this.child.stdin.destroy();
        this.#signal("SIGKILL");
        await this.#settled();
      }
      /**
       * One signal per escalation stage, delivered to the whole owned process
       * group where this spawn created one (FR-017b, #22777). The child PID
       * alone is not enough: a grandchild that inherited the host's stdout
       * keeps the `close` event — which `exited` and every stage here wait
       * on — from firing even after the child itself is gone, and it never
       * receives a child-targeted signal at all. A group signal that fails for
       * any reason (expected: `ESRCH`, the whole group already exited between
       * stages) falls through to the direct path, which Node makes a no-op on
       * an exited child — the ladder must never rethrow out of a stage.
       */
      #signal(signal) {
        const pid = this.child.pid;
        if (this.#ownsProcessGroup && pid !== void 0) {
          try {
            process.kill(-pid, signal);
            return;
          } catch {
          }
        }
        this.child.kill(signal);
      }
      /** True once `exited` settles either way — a rejection means no live child. */
      async #settledWithin(budgetMs) {
        return await this.#within(this.#settled(), budgetMs);
      }
      /** True if `work` settles before the one shared shutdown deadline fires. */
      async #beforeDeadline(work, deadline) {
        return await Promise.race([
          work.then(() => true, () => true),
          deadline.then(() => false)
        ]);
      }
      /** True if `work` settles inside `budgetMs`; false when the budget expires. */
      async #within(work, budgetMs) {
        const deadline = makeShutdownDeadline(budgetMs);
        try {
          return await this.#beforeDeadline(work, deadline.expired);
        } finally {
          deadline.clear();
        }
      }
      /**
       * `exited` REJECTS when the spawn itself failed (ENOENT). There is no
       * process to end and no exit to observe, so shutdown is complete; the
       * rejection still reaches the caller through its own `await exited`
       * (`MuseServeChild.close()`, `MspHandshake.close()`), unchanged.
       */
      async #settled() {
        await this.exited.catch(() => {
        });
      }
      async *#stdoutChunks() {
        for await (const chunk of this.child.stdout)
          yield String(chunk);
      }
    };
    MuseServeChild = class _MuseServeChild {
      #tail = new StderrTail();
      #transport;
      exit;
      constructor(child, onStderr, shutdownTimeoutMs, ownsProcessGroup = false) {
        this.#transport = new ChildStdioTransport(child, (chunk) => {
          this.#tail.push(chunk);
          onStderr?.(chunk);
        }, shutdownTimeoutMs, ownsProcessGroup);
        this.exit = this.#transport.exited.then((status) => classifyExit(status, this.#tail.lines()));
        this.exit.catch(() => {
        });
      }
      static spawn(options) {
        if (options.shutdownTimeoutMs !== void 0)
          assertShutdownTimeout(options.shutdownTimeoutMs);
        const ownsProcessGroup = process.platform !== "win32";
        const spawnOptions = buildSpawnOptions({
          cwd: options.cwd,
          env: options.env,
          detached: ownsProcessGroup
        });
        const spawnChild = options.spawnFn ?? spawn;
        return new _MuseServeChild(spawnChild(options.museBin, [...options.args ?? []], spawnOptions), options.onStderr, options.shutdownTimeoutMs, ownsProcessGroup);
      }
      get stderrTail() {
        return this.#tail.lines();
      }
      /** Module-private friend seam used by the handshake machine for this child. */
      [ownedTransport]() {
        return this.#transport;
      }
      async close() {
        await this.#transport.close();
        return await this.exit;
      }
    };
    MspHandshake = class {
      #connection;
      child;
      #transport;
      #started = false;
      #answered = false;
      constructor(options) {
        this.child = MuseServeChild.spawn({
          museBin: options.command,
          ...options.args === void 0 ? {} : { args: options.args },
          ...options.cwd === void 0 ? {} : { cwd: options.cwd },
          ...options.env === void 0 ? {} : { env: options.env },
          ...options.onStderr === void 0 ? {} : { onStderr: options.onStderr },
          ...options.shutdownTimeoutMs === void 0 ? {} : { shutdownTimeoutMs: options.shutdownTimeoutMs }
        });
        this.#transport = this.child[ownedTransport]();
        this.#connection = new Connection(this.#transport, options.connection);
        this.#transport[adoptFlushSource](() => this.#connection[submissionTail]());
      }
      get exited() {
        return this.#transport.exited;
      }
      onServerRequest(handler) {
        this.#connection.onServerRequest(handler);
      }
      onNotification(handler) {
        this.#connection.onNotification(handler);
      }
      onProtocolError(handler) {
        this.#connection.onProtocolError(handler);
      }
      async close() {
        await this.#connection.close();
        return await this.#transport.exited;
      }
      /** See {@link initializeAnswered}. */
      [initializeAnswered]() {
        return this.#answered;
      }
      async initialize(params) {
        if (this.#started)
          throw new ProtocolError("initialize may be sent only once per connection");
        this.#started = true;
        const { result: raw, line } = await this.#connection[requestWithFrame]("initialize", params);
        this.#answered = true;
        const result = raw;
        if (typeof result.schema?.fingerprint !== "string") {
          throw new ProtocolError("initialize result has no schema fingerprint", line);
        }
        const fingerprintWarning = checkServedFingerprint(result.schema.fingerprint);
        this.#connection.notify("initialized");
        await this.#connection.flush();
        return new SpawnedMspConnection(this.#connection, this.#transport, this.child, result, fingerprintWarning);
      }
    };
    SpawnedMspConnection = class {
      connection;
      child;
      initializeResult;
      fingerprintWarning;
      exited;
      #transport;
      constructor(connection, transport, child, initializeResult, fingerprintWarning) {
        this.connection = connection;
        this.#transport = transport;
        this.child = child;
        this.initializeResult = initializeResult;
        this.fingerprintWarning = fingerprintWarning;
        this.exited = transport.exited;
      }
      async close() {
        await this.connection.close();
        return await this.#transport.exited;
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/facade/discarded.js
var DiscardedSessions;
var init_discarded = __esm({
  "node_modules/@muse-code/sdk/dist/src/facade/discarded.js"() {
    DiscardedSessions = class {
      /** `commandId`s an ephemeral discharge retired. Never replayed again. */
      commandIds = /* @__PURE__ */ new Set();
      /** `sessionId`s whose ephemeral host died. Never reattached. */
      sessionIds = /* @__PURE__ */ new Set();
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/facade/host-death.js
function readSessionDurability(result) {
  const declared = result.sessionDurability;
  if (declared === void 0 || declared === DURABLE)
    return { kind: "durable" };
  if (declared === EPHEMERAL)
    return { kind: "ephemeral" };
  return { kind: "unrecognized", value: declared };
}
function survivesHostDeath(profile2) {
  return profile2.kind === DURABLE;
}
function isAbnormalHostDeath(notification) {
  return notification.kind !== "cleanShutdown";
}
function isItemInProgress(item) {
  return item.status === IN_PROGRESS;
}
var DURABLE, EPHEMERAL, IN_PROGRESS, MuseHostDiedError;
var init_host_death = __esm({
  "node_modules/@muse-code/sdk/dist/src/facade/host-death.js"() {
    DURABLE = "durable";
    EPHEMERAL = "ephemeral";
    IN_PROGRESS = "inProgress";
    MuseHostDiedError = class _MuseHostDiedError extends Error {
      exit;
      // The parameter is narrowed rather than checked: `cleanShutdown` is not a
      // death, so the type refuses to build this error for one instead of a
      // ternary papering over a state no caller can reach.
      constructor(exit) {
        super(`MSP host died: ${exit.kind} (${_MuseHostDiedError.#cause(exit)})`);
        this.name = "MuseHostDiedError";
        this.exit = exit;
      }
      static #cause(exit) {
        if (exit.kind === "transportEof")
          return "transport EOF with no orderly close";
        if (exit.kind === "crash" && exit.exitCode === null) {
          return `signal ${String(exit.exitSignal)}`;
        }
        return `exit code ${String(exit.exitCode)}`;
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/facade/host-start.js
function describeHostStartFailure(failure, tail) {
  if (failure.kind === "spawnFailed") {
    return `muse host could not be spawned: ${failure.error.message}`;
  }
  const exit = failure.exit;
  const how = exit.kind === "cleanShutdown" ? "exit code 0" : exit.kind === "crash" ? exit.exitSignal !== null ? `signal ${exit.exitSignal}` : `exit code ${String(exit.exitCode)}` : `exit code ${String(exit.exitCode)}${"retry" in exit ? `, retry: ${exit.retry}` : ""}`;
  const quoted = tail.slice(-MESSAGE_TAIL_LINES);
  const evidence = tail.length === 0 ? "stderr tail: (empty)" : `stderr tail${quoted.length < tail.length ? ` (last ${quoted.length} of ${tail.length} lines)` : ""}:
  ${quoted.join("\n  ")}`;
  const when = failure.answeredInitialize ? "after answering initialize, before the handshake completed" : "before answering initialize";
  return `muse host exited ${when}: ${exit.kind} (${how}); ${evidence}`;
}
async function hostStartFailure(child, cause, answeredInitialize) {
  let exit;
  try {
    exit = await child.exit;
  } catch (spawnError) {
    return new MuseHostStartError({ kind: "spawnFailed", error: spawnError }, child.stderrTail, cause);
  }
  return new MuseHostStartError({ kind: "hostExited", exit, answeredInitialize }, child.stderrTail, cause);
}
var MESSAGE_TAIL_LINES, MuseHostStartError;
var init_host_start = __esm({
  "node_modules/@muse-code/sdk/dist/src/facade/host-start.js"() {
    MESSAGE_TAIL_LINES = 5;
    MuseHostStartError = class extends Error {
      failure;
      /**
       * The SDK's bounded stderr tail when the host was lost, one accessor
       * regardless of arm: empty when no process ran, and the only place the
       * evidence lives when the row is `cleanShutdown` (SS2.11 keeps no tail on
       * the clean row; a logger wants the lines either way).
       */
      stderrTail;
      constructor(failure, stderrTail, cause) {
        super(describeHostStartFailure(failure, stderrTail), { cause });
        this.name = "MuseHostStartError";
        this.failure = failure;
        this.stderrTail = stderrTail;
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/facade/approval.js
var ApprovalRouter;
var init_approval = __esm({
  "node_modules/@muse-code/sdk/dist/src/facade/approval.js"() {
    ApprovalRouter = class _ApprovalRouter {
      #sessionId;
      #connection;
      #handler;
      #onFailure;
      /**
       * Approval STAGES already decided, keyed by `approvalId` + `requirementId`.
       *
       * Not `approvalId` alone: `requirementId` is SS5.4's multi-stage race guard,
       * so a stage-2 request must get its own decision or the approval pends
       * forever. Not per-request either: a redelivered `approval/requested` for the
       * SAME stage must author no second decide, or a two-stage approval races
       * itself. The key is kept on FAILURE too — a genuinely advancing stage brings
       * a new `requirementId` and therefore a new key, so "ask the consumer once
       * per stage" holds absolutely.
       */
      #decidedStages = /* @__PURE__ */ new Set();
      /**
       * Approvals whose `approval/decide` ACK came back `terminal: true`: the host
       * closed the whole approval on that decision (a rule that also satisfied the
       * remaining stages), so no later stage can need this consumer. Kept beside
       * the stage latch because the runtime records only the RESOLVED stage
       * (#37538), letting the view fold emit one trailing `stageResolved` update
       * with a frontier the host already closed, right before `approval/resolved`.
       */
      #terminalApprovals = /* @__PURE__ */ new Set();
      /**
       * The most recently sent decide each approval has on the wire, settled when
       * its ack lands or the decide fails. A trailing `stageResolved` update read
       * in the SAME chunk as a `terminal: true` ack is routed before
       * {@link #decide} resumes from that ack, so {@link updated} waits for it
       * instead of re-asking. Scoped to the round trip: an open handler or a
       * decide that never started blocks nobody.
       */
      #inFlight = /* @__PURE__ */ new Map();
      constructor(sessionId, connection) {
        this.#sessionId = sessionId;
        this.#connection = connection;
      }
      /**
       * Register the decision callback (FR-019).
       *
       * REPLACES any previous handler rather than adding to a list: two handlers
       * would race to decide one approval and only one decision can win, so the
       * loser's would be silently discarded.
       */
      onApproval(handler) {
        this.#handler = handler;
      }
      /** Observe round trips that did not complete. See {@link ApprovalFailure}. */
      onApprovalError(handler) {
        this.#onFailure = handler;
      }
      /**
       * An `approval/requested` folded. Returns the decision round trip to await,
       * or `undefined` when this client authors nothing for it.
       *
       * No handler at all is the supported default posture, NOT a degraded one
       * (D-008): the client runs under the server's own default-deny, and this SDK
       * parks nothing — no queued decision, no synthesized denial, no local hold.
       */
      requested(params) {
        const handler = this.#handler;
        if (handler === void 0)
          return void 0;
        const stage = _ApprovalRouter.#stageKey(params);
        if (this.#decidedStages.has(stage))
          return void 0;
        this.#decidedStages.add(stage);
        return this.#decide(params, handler);
      }
      /**
       * An `approval/updated` folded onto a STILL-PENDING approval (#36949).
       *
       * A multi-stage approval advances `currentRequirementId` through this frame
       * ALONE on the notification plane — the SS5.6 item-3 re-issue on stage
       * advance is the protected `approval/request` SERVER-REQUEST dual, which is
       * not enrolled here (SHAPE NOTE above) — so waiting for a re-issued
       * `approval/requested` notification leaves the new stage undecided and the
       * turn pending forever.
       *
       * The update alone carries none of the request-shape members the handler is
       * typed on, but the fold retains the original request and every identity
       * member is stable across the stages of ONE approval, so the merged request
       * below is honest (`REFRESH_FROM_*` above pins the split). Feeding it
       * through {@link requested} reuses the per-stage latch, so an update whose
       * requirement was already decided — and any later re-issued request for the
       * stage this update decided — authors nothing.
       */
      updated(requested, params) {
        if (params.change.kind === "alreadyTerminal")
          return void 0;
        if (this.#terminalApprovals.has(requested.approvalId))
          return void 0;
        const refreshed = {
          approvalId: requested.approvalId,
          availableChoices: params.availableChoices,
          currentRequirementId: params.currentRequirementId,
          itemId: requested.itemId,
          judgeEscalated: requested.judgeEscalated,
          protectedWrite: requested.protectedWrite,
          rawArgs: requested.rawArgs,
          sessionId: params.sessionId,
          sourceRange: params.sourceRange,
          subject: params.subject,
          taskId: requested.taskId,
          toolCallId: requested.toolCallId,
          toolName: requested.toolName,
          turnId: requested.turnId,
          viewCursor: params.viewCursor
        };
        if (params.subagentOrigin !== void 0)
          refreshed.subagentOrigin = params.subagentOrigin;
        const acked = this.#inFlight.get(requested.approvalId);
        if (acked !== void 0)
          return this.#afterAck(acked, refreshed);
        return this.requested(refreshed);
      }
      /** {@link updated}'s same-chunk arm: decide only once our own ack is in. */
      async #afterAck(acked, refreshed) {
        await acked;
        if (this.#terminalApprovals.has(refreshed.approvalId))
          return;
        await this.requested(refreshed);
      }
      static #stageKey(params) {
        const requirement = params.currentRequirementId;
        return `${params.approvalId} ${requirement.approvalId}:${String(requirement.sourceIndex)}`;
      }
      async #decide(params, handler) {
        const connection = this.#connection;
        if (connection === void 0) {
          this.#report({
            approvalId: params.approvalId,
            error: new Error("approval/decide needs a connection; this Session was constructed fold-only"),
            kind: "submitFailed"
          });
          return;
        }
        let decision;
        try {
          decision = await handler(params);
        } catch (error) {
          this.#report({ approvalId: params.approvalId, error, kind: "handlerThrew" });
          return;
        }
        const availableChoiceIds = params.availableChoices.map((choice) => choice.choiceId);
        if (!availableChoiceIds.includes(decision.choiceId)) {
          this.#report({
            approvalId: params.approvalId,
            availableChoiceIds,
            choiceId: decision.choiceId,
            kind: "unofferedChoice"
          });
          return;
        }
        const decideParams = {
          approvalId: params.approvalId,
          choiceId: decision.choiceId,
          // Echoed from the request, never remembered: SS5.4 makes a stale value a
          // -32053, and the request in hand is the only current statement of it.
          requirementId: params.currentRequirementId,
          sessionId: this.#sessionId
        };
        if (decision.feedback != null)
          decideParams.feedback = decision.feedback;
        const approvalId = params.approvalId;
        let settle;
        const acked = new Promise((resolve2) => {
          settle = resolve2;
        });
        this.#inFlight.set(approvalId, acked);
        try {
          const ack = await connection.command("approval/decide", decideParams);
          if (ack["terminal"] === true)
            this.#terminalApprovals.add(approvalId);
        } catch (error) {
          this.#report({ approvalId, error, kind: "submitFailed" });
        } finally {
          settle();
          if (this.#inFlight.get(approvalId) === acked)
            this.#inFlight.delete(approvalId);
        }
      }
      #report(failure) {
        try {
          this.#onFailure?.(failure);
        } catch {
        }
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/facade/turn-submit.js
function commandErrorResponse(error) {
  if (!(error instanceof MspError))
    return void 0;
  const reason = error.data["reason"];
  return {
    code: error.code,
    kind: error.kind,
    ...typeof reason === "string" ? { reason } : {}
  };
}
var TurnSubmitter;
var init_turn_submit = __esm({
  "node_modules/@muse-code/sdk/dist/src/facade/turn-submit.js"() {
    init_connection();
    TurnSubmitter = class {
      #sessionId;
      #connection;
      #pending;
      /** See the module doc. Pruned on retirement, so it tracks the pending set. */
      #memory = /* @__PURE__ */ new Map();
      constructor(sessionId, connection, pending) {
        this.#sessionId = sessionId;
        this.#connection = connection;
        this.#pending = pending;
      }
      get wired() {
        return this.#connection !== void 0;
      }
      requireConnection(verb) {
        const connection = this.#connection;
        if (connection === void 0) {
          throw new Error(`${verb} needs a connection; this Session was constructed fold-only`);
        }
        return connection;
      }
      /**
       * Record the optimistic SS4.13 entry, then send `turn/start`.
       *
       * The ORDER is the point. An entry created only on the ack is invisible for
       * exactly the window it exists to cover — between the user pressing enter and
       * the host answering — and `anchorAfterItemId` is fixed here, at submission
       * time, because SS4.13's insertion point may never be relocated by events
       * that fold in afterwards.
       */
      async submit(options, anchorAfterItemId) {
        const connection = this.requireConnection("sendUserTurn");
        const commandId = connection.mintCommandId();
        const params = this.#params(commandId, options);
        this.#pending.submitted({
          anchorAfterItemId,
          commandId,
          input: options.composerInput,
          ...params.displayText === void 0 ? {} : { displayText: params.displayText }
        });
        this.#memory.set(commandId, params);
        try {
          const ack = await this.#send(connection, params, commandId);
          this.#pending.acked(commandId, ack);
          return ack;
        } catch (error) {
          const response = commandErrorResponse(error);
          if (response !== void 0) {
            const settled = this.#pending.ackErrored(commandId, response);
            if (settled !== "held")
              this.forgetRetired([settled]);
          }
          throw error;
        }
      }
      /**
       * Re-send one remembered `turn/start` under its ORIGINAL `commandId`
       * (SS3.1.1 — always safe, and the only re-send that is not a double
       * execution).
       *
       * `undefined` means "no answer this set can act on": either this session
       * never authored the command (a caller-seeded entry), or the failure was a
       * transport/protocol one, which proves nothing about the intake.
       */
      async replay(commandId) {
        const params = this.#memory.get(commandId);
        if (params === void 0)
          return void 0;
        const connection = this.requireConnection("turn/start replay");
        try {
          return { ack: await this.#send(connection, params, commandId), kind: "ack" };
        } catch (error) {
          const response = commandErrorResponse(error);
          if (response === void 0)
            return void 0;
          return { error: response, kind: "error" };
        }
      }
      /** Replay one entry and feed the answer back through the live SS4.13 rules. */
      async driveReplay(commandId, into) {
        const answer = await this.replay(commandId);
        if (answer === void 0)
          return;
        const settled = this.#pending.replayAnswered(commandId, answer);
        if (settled !== "held")
          into.push(settled);
      }
      /** Drop the replay memory for retired entries so it tracks the pending set. */
      forgetRetired(retirements) {
        for (const retirement of retirements)
          this.#memory.delete(retirement.commandId);
      }
      async #send(connection, params, commandId) {
        const raw = await connection.command("turn/start", params, { commandId });
        const result = raw;
        return { disposition: result.disposition, turnId: result.turnId };
      }
      /**
       * OPTIONAL MEANS OMITTED, NEVER `null` (tdd SS1.2), and the guards are LOOSE
       * (`!= null`) for the same reason `MuseClient`'s are: the types bind only
       * strict TypeScript consumers, and a plain-JS caller reaching the built
       * `dist` can pass an explicit `null` a `!== undefined` guard would forward.
       */
      #params(commandId, options) {
        const params = {
          commandId,
          input: options.input,
          sessionId: this.#sessionId
        };
        if (options.displayText != null)
          params.displayText = options.displayText;
        if (options.ifBusy != null)
          params.ifBusy = options.ifBusy;
        if (options.reasoningEffort != null)
          params.reasoningEffort = options.reasoningEffort;
        if (options.workspaceRoots != null)
          params.workspaceRoots = options.workspaceRoots;
        if (options.userShell != null)
          params.userShell = options.userShell;
        return params;
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/facade/gap-fill.js
var _a, PAGE_LIMIT, NO_RETIREMENTS, GapFiller;
var init_gap_fill = __esm({
  "node_modules/@muse-code/sdk/dist/src/facade/gap-fill.js"() {
    init_errors();
    PAGE_LIMIT = 200;
    NO_RETIREMENTS = Promise.resolve([]);
    GapFiller = class {
      #options;
      /** Live frames held while a fill is in flight, in arrival order. */
      #buffer = [];
      #filling = false;
      #cursor = "";
      #onFailure;
      constructor(options) {
        this.#options = options;
      }
      /**
       * Cursors the page served at or after a target — the events whose LIVE twin
       * the wire has yet to deliver.
       *
       * THE LATE HALF of the recipe's overlap discard, and only that half (PR
       * #24930 review rounds 1 and 2). A twin that has already arrived is in the
       * buffer, and `#drain` discards those against its own local set of EVERY
       * paged cursor. This set covers the other window: the wire promises no order
       * between the marker and the frame at `next`, so a twin can legally arrive
       * after the fill completed, when the buffer is gone. Folding it then re-runs
       * its routing — for a `turn/started`, a duplicate SS4.13 queue-movement
       * replay on the wire.
       *
       * SELF-DRAINING: an entry is removed the moment its twin arrives, and only
       * cursors at or after a target ever enter (the walk stops at the page that
       * carries it, so at most one page's worth per target).
       *
       * RESIDUAL, stated rather than hidden: an entry whose twin the wire never
       * delivers — because a LATER hole swallowed it — has no arrival to retire it
       * and stays, a short string each, bounded by one page's worth per TARGET —
       * and a coalesced fill has several, since each extension's reaching page adds
       * its own batch.
       *
       * Two prunes were tried and both were defects, so neither is coming back
       * without a proof neither had. Clearing per fill (round 2) drops the refusal
       * for a twin that is still on its way. Retiring inside the WALK when it meets
       * the cursor before its own target (round 3) looks like page-order proof that
       * the twin was swallowed, but the walk cannot see the BUFFER — a coalescing
       * gap moves the target past a cursor whose twin is sitting in it, and the
       * entry is deleted out from under the drain (round 4). Deciding staleness any
       * other way means ordering two opaque cursors, which tdd SS4.1 forbids.
       */
      #servedTwins = /* @__PURE__ */ new Set();
      /** While true, every live frame but the gap marker itself is held. */
      get filling() {
        return this.#filling;
      }
      /**
       * Was this frame already applied from a page, as part of the overlap the
       * splice discards? Consuming: a twin is refused exactly once.
       *
       * Returns the matched CURSOR rather than a boolean so the caller can report
       * which event it refused without re-reading (and re-defaulting) a field this
       * method already proved is there.
       */
      claimServedTwin(frame) {
        const cursor = _a.#viewCursorOf(frame);
        if (cursor === void 0 || !this.#servedTwins.has(cursor))
          return void 0;
        this.#servedTwins.delete(cursor);
        return cursor;
      }
      /** Observe fills that did not complete. See {@link MuseGapFillError}. */
      onError(handler) {
        this.#onFailure = handler;
      }
      /** Hold one live frame until the paged prefix is in. */
      hold(frame) {
        this.#buffer.push(frame);
      }
      /**
       * Recover the fold's outstanding hole.
       *
       * Called on every `view/gap`, including one that lands mid-fill: the running
       * walk reads its target from `fold.pendingGap` on each pass, so a coalesced
       * hole extends the walk in flight rather than starting a second one racing
       * it for the same cursor stream.
       */
      start() {
        const gap = this.#options.fold.pendingGap;
        if (gap === void 0)
          return NO_RETIREMENTS;
        if (this.#filling)
          return NO_RETIREMENTS;
        const connection = this.#options.connection;
        if (connection === void 0) {
          this.#report(new MuseGapFillError("noConnection", gap.after, gap.next));
          return NO_RETIREMENTS;
        }
        this.#filling = true;
        this.#cursor = gap.after;
        return this.#run(connection);
      }
      async #run(connection) {
        const paged = [];
        let filled = false;
        try {
          await this.#walk(connection, paged);
          filled = true;
        } catch (error) {
          this.#reportFailure(error);
        }
        const drained = this.#drain(paged);
        if (!filled)
          return drained;
        if (this.#options.discarded())
          return drained;
        if (this.#options.fold.pendingGap === void 0)
          return drained;
        const restarted = this.start();
        return Promise.all([drained, restarted]).then(([first, second]) => [...first, ...second]);
      }
      /**
       * Page until the fold's outstanding hole is closed.
       *
       * The outer loop is what makes a mid-walk `view/gap` safe: `gapFilled`
       * refuses to clear a target the fold has since extended, so the walk simply
       * keeps going toward the newer `next` on the SAME cursor stream.
       */
      async #walk(connection, paged) {
        for (; ; ) {
          if (this.#options.discarded())
            return;
          const gap = this.#options.fold.pendingGap;
          if (gap === void 0)
            return;
          const target = gap.next;
          await this.#walkTo(connection, target, gap.after, paged);
          if (this.#options.discarded())
            return;
          if (this.#options.fold.gapFilled(target))
            return;
        }
      }
      async #walkTo(connection, target, after, paged) {
        for (; ; ) {
          if (this.#options.discarded())
            return;
          const result = await this.#page(connection, this.#cursor);
          let reached = false;
          let lastServed;
          for (const event of result.events) {
            this.#requireOwnSession(event, after, target);
            const cursor = event.params.viewCursor;
            lastServed = cursor;
            const alreadyApplied = this.#servedTwins.has(cursor);
            if (cursor === target)
              reached = true;
            if (alreadyApplied) {
              continue;
            }
            paged.push(event);
            if (reached)
              this.#servedTwins.add(cursor);
          }
          if (result.nextCursor === null) {
            if (lastServed !== void 0)
              this.#cursor = lastServed;
            return;
          }
          if (result.events.length === 0 || typeof result.nextCursor !== "string" || result.nextCursor === this.#cursor) {
            throw new MuseGapFillError("pageStalled", after, target);
          }
          this.#cursor = result.nextCursor;
          if (reached)
            return;
        }
      }
      async #page(connection, cursor) {
        const params = {
          cursor,
          limit: PAGE_LIMIT,
          sessionId: this.#options.sessionId
        };
        const raw = await connection.request("view/page", params);
        return raw;
      }
      /**
       * A page that serves another session's events aborts the fill.
       *
       * The same check `Session.apply` makes on a live frame, at the one other
       * place a frame can enter the fold. Folding it would corrupt this
       * transcript with another session's history, and the request that asked for
       * it named this `sessionId`, so there is no reading under which the answer
       * is right.
       */
      #requireOwnSession(event, after, target) {
        const named = event.params?.sessionId;
        if (typeof named === "string" && named !== this.#options.sessionId) {
          throw new MuseGapFillError("pageFailed", after, target, new MuseForeignSessionError(`view/page for ${this.#options.sessionId} served an event for session ${named}`));
        }
      }
      /**
       * Splice: the paged prefix, then the buffered tail minus the overlap.
       *
       * Synchronous up to its return, deliberately. Clearing the buffer and the
       * flag in the same run of code that re-feeds them is what makes the handover
       * atomic — an `await` in the middle would let a live frame arrive after the
       * flag dropped and fold ahead of the tail still waiting in the buffer.
       *
       * It is outside the walk's `try` because the buffered tail must be released
       * on FAILURE too, and it needs no `try` of its own: every frame it re-feeds
       * has already passed the one check `Session.apply` can throw on — the live
       * half at buffer time, the paged half in the walk — so this cannot be the
       * rejection `SessionApplyOutcome.io` promises never to be.
       */
      #drain(paged) {
        const buffered = this.#buffer.splice(0);
        this.#filling = false;
        if (this.#options.discarded())
          return NO_RETIREMENTS;
        const sink = { retirements: [], tasks: [] };
        const served = /* @__PURE__ */ new Set();
        for (const frame of paged) {
          const cursor = _a.#viewCursorOf(frame);
          if (cursor !== void 0)
            served.add(cursor);
          this.#options.apply(frame, sink);
        }
        for (const frame of buffered) {
          const cursor = _a.#viewCursorOf(frame);
          if (cursor !== void 0 && (served.has(cursor) || this.#servedTwins.has(cursor))) {
            this.#servedTwins.delete(cursor);
            continue;
          }
          this.#options.apply(frame, sink);
        }
        if (sink.tasks.length === 0)
          return Promise.resolve(sink.retirements);
        return Promise.all(sink.tasks).then((batches) => [...sink.retirements, ...batches.flat()]);
      }
      static #viewCursorOf(frame) {
        const cursor = frame.params?.viewCursor;
        return typeof cursor === "string" ? cursor : void 0;
      }
      #reportFailure(error) {
        if (error instanceof MuseGapFillError) {
          this.#report(error);
          return;
        }
        const gap = this.#options.fold.pendingGap;
        this.#report(new MuseGapFillError("pageFailed", gap?.after ?? "", gap?.next ?? "", error));
      }
      #report(failure) {
        try {
          this.#onFailure?.(failure);
        } catch {
        }
      }
    };
    _a = GapFiller;
  }
});

// node_modules/@muse-code/sdk/dist/src/facade/turn-handle.js
function isLaunchFailure(outcome) {
  return outcome.kind === "completed" && outcome.params.terminal === TERMINAL_FAILED && outcome.params.error?.kind === LAUNCH_ERROR;
}
var TERMINAL_FAILED, LAUNCH_ERROR, PushStream, TurnHandle;
var init_turn_handle = __esm({
  "node_modules/@muse-code/sdk/dist/src/facade/turn-handle.js"() {
    TERMINAL_FAILED = "failed";
    LAUNCH_ERROR = "launchError";
    PushStream = class {
      #buffer = [];
      #onFinished;
      /**
       * FIFO, not a single slot. `items()`/`deltas()` hand out a plain
       * `AsyncIterableIterator`, so `Promise.all([it.next(), it.next()])` prefetch
       * is a reasonable thing for a consumer to write — and a single slot let the
       * second call overwrite the first waiter, leaving the first promise never
       * settled and handing its value to the second caller. A silently
       * never-settling promise is the hang class this file exists to prevent.
       */
      #waiters = [];
      #ended = false;
      #failure;
      /**
       * `onFinished` deregisters this stream from its owner. Without it a consumer
       * that `break`s out of a `for await` — or simply drops the iterator — stays
       * in the fan-out set for the rest of the turn, so every later event is
       * pushed into a stream nobody reads. A render loop that re-attaches per
       * frame would grow one dead stream per frame.
       */
      constructor(onFinished) {
        this.#onFinished = onFinished;
      }
      push(value) {
        if (this.#ended)
          return;
        const waiter = this.#waiters.shift();
        if (waiter === void 0) {
          this.#buffer.push(value);
          return;
        }
        waiter.resolve({ done: false, value });
      }
      end() {
        if (this.#ended)
          return;
        this.#ended = true;
        for (const waiter of this.#waiters.splice(0)) {
          waiter.resolve({ done: true, value: void 0 });
        }
      }
      fail(error) {
        if (this.#ended)
          return;
        this.#ended = true;
        this.#failure = error;
        for (const waiter of this.#waiters.splice(0))
          waiter.reject(error);
      }
      next() {
        if (this.#buffer.length > 0) {
          return Promise.resolve({ done: false, value: this.#buffer.shift() });
        }
        if (this.#failure !== void 0)
          return Promise.reject(this.#failure);
        if (this.#ended)
          return Promise.resolve({ done: true, value: void 0 });
        return new Promise((resolve2, reject) => {
          this.#waiters.push({ reject, resolve: resolve2 });
        });
      }
      /** `break`/`return` inside a `for await`: drop the backlog and finish. */
      return() {
        this.#buffer.length = 0;
        this.end();
        this.#onFinished();
        return Promise.resolve({ done: true, value: void 0 });
      }
      [Symbol.asyncIterator]() {
        return this;
      }
    };
    TurnHandle = class {
      turnId;
      #replayItems;
      #itemStreams = /* @__PURE__ */ new Set();
      #deltaStreams = /* @__PURE__ */ new Set();
      #completed;
      #settle;
      #fail;
      #observedStart = false;
      #settled = false;
      /**
       * Retained so an iterator opened AFTER the failure reports it too. Without
       * it a late `items()` saw only `#settled` and ended cleanly — handing the
       * consumer a partial replay plus a tidy `done`, i.e. an unfinished turn
       * rendered as finished, which is the invented completion INV-006 forbids.
       */
      #failure;
      constructor(turnId, replayItems) {
        this.turnId = turnId;
        this.#replayItems = replayItems;
        this.#completed = new Promise((resolve2, reject) => {
          this.#settle = resolve2;
          this.#fail = reject;
        });
        this.#completed.catch(() => {
        });
      }
      /** Settles on `turn/completed`, `turn/unqueued`, or the ephemeral discard. */
      get completed() {
        return this.#completed;
      }
      /**
       * How many iterators this handle is still fanning out to.
       *
       * Exposed so the deregistration contract is assertable: an iterator a
       * consumer broke out of, or simply dropped, must leave this set rather than
       * accumulate for the rest of the turn.
       */
      get liveStreamCount() {
        return this.#itemStreams.size + this.#deltaStreams.size;
      }
      /** Did a `turn/started` ever fold for this turn? */
      get observedStart() {
        return this.#observedStart;
      }
      /**
       * This turn's items: everything the fold already holds for it, at its
       * current revision and in first-opened order, then the live tail — one yield
       * per fold-observed revision CHANGE. A stale re-emission mutates nothing
       * (INV-003) and therefore yields nothing.
       *
       * The iterator ends when the turn settles; it never ends on a local timeout.
       */
      items() {
        const stream = new PushStream(() => this.#itemStreams.delete(stream));
        for (const item of this.#replayItems())
          stream.push(item);
        this.#admit(stream, this.#itemStreams);
        return stream;
      }
      /**
       * This turn's `item/delta` frames, live only.
       *
       * Deliberately NOT replayed, and the asymmetry with `items()` is a fact
       * about the fold rather than an oversight: the store holds each item at its
       * latest revision plus the ACCUMULATED delta text per field path
       * (`ItemStore.accumulated`), never the delta event sequence. A consumer
       * attaching mid-turn reads the accumulated value from the fold; there is no
       * retained event list to replay, and inventing one would be a second copy of
       * state that INV-002's determinism would then have to defend.
       */
      deltas() {
        const stream = new PushStream(() => this.#deltaStreams.delete(stream));
        this.#admit(stream, this.#deltaStreams);
        return stream;
      }
      /**
       * Register a fresh stream, or finish it the way this turn already finished.
       * The failure branch comes FIRST: a turn that failed is not a turn that
       * ended. `PushStream` drains the replay before reporting either, so a late
       * consumer still receives everything it was owed.
       */
      #admit(stream, into) {
        if (this.#failure !== void 0)
          stream.fail(this.#failure);
        else if (this.#settled)
          stream.end();
        else
          into.add(stream);
      }
      // ---- fed by Session -----------------------------------------------------
      markStarted() {
        this.#observedStart = true;
      }
      pushItem(item) {
        for (const stream of this.#itemStreams)
          stream.push(item);
      }
      pushDelta(params) {
        for (const stream of this.#deltaStreams)
          stream.push(params);
      }
      settleCompleted(params) {
        this.#finish({ kind: "completed", observedStart: this.#observedStart, params });
      }
      settleUnqueued(params) {
        this.#finish({ kind: "unqueued", params });
      }
      /** SS2.13.3b: an ephemeral host died; stop waiting for a terminal. */
      settleTerminalUnknown() {
        this.#finish({ kind: "terminalUnknown" });
      }
      /**
       * A DURABLE host died abnormally. The waiter gets no answer here — FM-001
       * puts the terminals on resume — so it is rejected rather than resolved: a
       * resolution would be the invented terminal INV-006 forbids, and silence
       * would be the SS3.1.4 hang.
       */
      fail(error) {
        if (this.#settled)
          return;
        this.#settled = true;
        this.#failure = error;
        this.#fail?.(error);
        this.#clear();
        for (const stream of this.#itemStreams)
          stream.fail(error);
        for (const stream of this.#deltaStreams)
          stream.fail(error);
        this.#itemStreams.clear();
        this.#deltaStreams.clear();
      }
      #finish(outcome) {
        if (this.#settled)
          return;
        this.#settled = true;
        this.#settle?.(outcome);
        this.#clear();
        for (const stream of this.#itemStreams)
          stream.end();
        for (const stream of this.#deltaStreams)
          stream.end();
        this.#itemStreams.clear();
        this.#deltaStreams.clear();
      }
      #clear() {
        this.#settle = void 0;
        this.#fail = void 0;
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/facade/session.js
var USER_MESSAGE, NO_IO, Session;
var init_session = __esm({
  "node_modules/@muse-code/sdk/dist/src/facade/session.js"() {
    init_session_fold();
    init_pending_command_set();
    init_approval();
    init_turn_submit();
    init_gap_fill();
    init_host_death();
    init_errors();
    init_turn_handle();
    USER_MESSAGE = "userMessage";
    NO_IO = Promise.resolve([]);
    Session = class _Session {
      sessionId;
      /** See {@link SessionOpening}. Absent when the caller built this directly. */
      opening;
      #pending;
      #discarded;
      /** `turn/start` submission and same-`commandId` replay (`turn-submit.ts`). */
      #submit;
      /** The FR-019 round trip (`approval.ts`). */
      #approvals;
      /** The FR-020 splice-fill (`gap-fill.ts`). */
      #gaps;
      #fold = new SessionFold();
      #durability;
      /** The first discharge, replayed verbatim on every later call. */
      #discharge;
      /** Set on a durable abnormal death, so late handles inherit the rejection. */
      #deathError;
      #turns = /* @__PURE__ */ new Map();
      /**
       * `item/delta` frames whose item the fold does not hold yet. The store
       * already buffers the delta TEXT against the item's arrival (SS4.7.3, spec
       * Edge Cases); a delta's TURN is equally unknowable until then, so the
       * frames wait here and are attributed when the item lands. Dropping them
       * instead would put a silent hole in the very iterators FR-020 forbids one
       * in. Bounded by the same fact that bounds the store's own buffer: the
       * durable `item/completed` always lands the item.
       */
      #unattributedDeltas = /* @__PURE__ */ new Map();
      constructor(options) {
        this.sessionId = options.sessionId;
        this.#durability = options.durability;
        this.#discarded = options.discarded;
        this.opening = options.opening;
        this.#pending = new PendingCommandSet(options.discarded === void 0 ? void 0 : { discardedCommandIds: options.discarded.commandIds });
        this.#submit = new TurnSubmitter(options.sessionId, options.connection, this.#pending);
        this.#approvals = new ApprovalRouter(options.sessionId, options.connection);
        this.#gaps = new GapFiller({
          apply: (frame, into) => this.#foldAndRoute(frame, into),
          connection: options.connection,
          discarded: () => this.#discharge?.kind === "discharged",
          fold: this.#fold,
          sessionId: options.sessionId
        });
      }
      get durability() {
        return this.#durability;
      }
      /** Read-only; events enter through `apply` so turn routing cannot be skipped. */
      get fold() {
        return this.#fold;
      }
      /** The SS4.13 set, minus the three mutators `Session` drives itself. */
      get pending() {
        return this.#pending;
      }
      /**
       * How many turns this session has minted a handle for.
       *
       * Distinct from `fold.turns()`, which counts turns the WIRE named: a handle
       * is also minted by `turn()` and by item routing, so this is the number that
       * reveals a phantom turn minted from a bad key (a `userShell` item's null
       * `turnId`, say). Read-only and observation-only.
       *
       * @internal Test observability, stripped from the published declarations
       * (`stripInternal`). `Session` is barrel-exported, so without this the getter
       * would be frozen API the moment #211 adopts the package — the same call
       * `liveStreamCount` got by staying off the public `Turn` (Constitution XI).
       */
      get knownTurnCount() {
        return this.#turns.size;
      }
      apply(event) {
        const named = event.params?.sessionId;
        if (typeof named === "string" && named !== this.sessionId) {
          throw new MuseForeignSessionError(`event ${event.method} belongs to session ${named}, not ${this.sessionId}`);
        }
        if (this.#discharge?.kind === "discharged") {
          return { fold: { kind: "refusedSessionDiscarded" }, io: NO_IO, retirements: [] };
        }
        if (this.#gaps.filling && event.method !== "view/gap") {
          this.#gaps.hold(event);
          return {
            fold: { kind: "bufferedDuringGap", method: event.method },
            io: NO_IO,
            retirements: []
          };
        }
        const twin = this.#gaps.claimServedTwin(event);
        if (twin !== void 0) {
          return {
            fold: { kind: "ignoredGapOverlap", method: event.method, viewCursor: twin },
            io: NO_IO,
            retirements: []
          };
        }
        const sink = { retirements: [], tasks: [] };
        const outcome = this.#foldAndRoute(event, sink);
        if (outcome.kind === "deliveryGap")
          sink.tasks.push(this.#gaps.start());
        return {
          fold: outcome,
          io: _Session.#settleIo(sink.tasks),
          retirements: sink.retirements
        };
      }
      /** Observe SS4.8 fills that did not complete. See `MuseGapFillError`. */
      onGapError(handler) {
        this.#gaps.onError(handler);
      }
      /**
       * Fold one frame and fan it out to the turn handles that want it.
       *
       * The shared path: `apply` uses it for a live frame, and `GapFiller` uses it
       * to re-feed the paged prefix and the buffered tail. One path is what makes
       * a spliced frame indistinguishable from a live one to everything
       * downstream — the fold, the iterators, and the SS4.13 retirements.
       */
      #foldAndRoute(event, sink) {
        const retirements = [];
        const tasks = sink.tasks;
        const outcome = this.#fold.apply(event);
        if (outcome.kind === "ignoredMissingParams")
          return outcome;
        const known = event;
        switch (known.method) {
          case "item/started":
          case "item/updated":
          case "item/completed":
            if (outcome.kind === "item" && outcome.outcome.kind !== "ignoredStaleRevision") {
              this.#itemFolded(known.params.item, retirements);
            }
            break;
          case "item/delta":
            this.#deltaFolded(known.params);
            break;
          case "turn/started":
            this.#handle(known.params.turnId).markStarted();
            this.#queueMoved(known.params.turnId, tasks);
            break;
          case "turn/completed":
            this.#handle(known.params.turnId).settleCompleted(known.params);
            this.#queueMoved(known.params.turnId, tasks);
            break;
          case "turn/unqueued": {
            this.#handle(known.params.turnId).settleUnqueued(known.params);
            const reclaimed = this.#pending.observedReclaim(known.params.commandId);
            if (reclaimed !== void 0)
              retirements.push(reclaimed);
            break;
          }
          case "approval/requested":
            if (outcome.kind === "approvalPending")
              this.#approvalRequested(known.params, tasks);
            break;
          case "approval/updated":
            if (outcome.kind === "approvalPending") {
              this.#approvalUpdated(outcome.requested, known.params, tasks);
            }
            break;
          // Folded, deliberately NOT routed to a turn handle. Listed rather than
          // defaulted so this switch is exhaustive over `ViewEvent`: the fold's
          // `AssertNever` forces each new #206 view notification into that union,
          // and a `default` arm here would swallow the addition silently.
          //
          // `view/gap` is here because it routes to no turn: it names a hole in
          // DELIVERY, so what it moves is the fold's currency, and the recovery
          // it triggers is started by `apply` off the `deliveryGap` verdict rather
          // than from this switch (FR-020 / T032).
          case "view/gap":
          case "turn/retracted":
          // the turn still reaches its own terminal
          case "turn/retryScheduled":
          // non-terminal by contract (SS4.5.1)
          case "turn/foregroundCompleted":
          // non-terminal by contract (SS4.5.12)
          case "approval/resolved":
          case "userInput/requested":
          case "userInput/settled":
          case "session/modelChanged":
          case "session/reasoningEffortChanged":
          case "session/goalChanged":
          case "session/todoListChanged":
          case "session/branchChanged":
          case "session/tokenUsage":
          case "session/contextUsage":
          case "session/approvalModeChanged":
          case "session/modelRouteUnserved":
          case "session/nameChanged":
            break;
          default: {
            const unrouted = known;
            void unrouted;
            break;
          }
        }
        if (retirements.length > 0) {
          this.#submit.forgetRetired(retirements);
          sink.retirements.push(...retirements);
        }
        return outcome;
      }
      /** Flatten the event's I/O tasks, or hand back the shared empty. */
      static #settleIo(tasks) {
        if (tasks.length === 0)
          return NO_IO;
        return Promise.all(tasks).then((batches) => batches.flat());
      }
      /**
       * The handle for a turn, created on first mention from either side. A turn
       * the fold has already settled returns its settled handle, so a wait
       * registered late resolves instead of hanging on an event that has passed.
       */
      turn(turnId) {
        const held = this.#turns.get(turnId);
        if (held !== void 0)
          return held;
        const fresh = this.#mint(turnId);
        if (this.#discharge?.kind === "discharged")
          fresh.settleTerminalUnknown();
        else if (this.#deathError !== void 0)
          fresh.fail(this.#deathError);
        return fresh;
      }
      /**
       * A handle minted because a SERVER FRAME named this turn. Never pre-failed,
       * and that is what makes the post-death behaviour ORDER-INDEPENDENT.
       *
       * A durable death does not stop the fold (FM-001), so frames can still
       * arrive for a turn with no handle yet. Pre-failing here made the outcome
       * depend on which frame arrived first: terminal-first settled, started-first
       * pre-failed the handle and first-settlement-wins then dropped the real
       * terminal one frame later — the same server fact, two different answers.
       * That asymmetry is measured against synthetic frames; which order a real
       * host emits after a crash is NOT something this lane has observed, and the
       * rule does not depend on it. A frame arriving IS the connection still speaking,
       * so a handle it mints is not a waiter with no answer coming; `turn()` keeps
       * the latch for the case that genuinely is.
       */
      #handle(turnId) {
        return this.#turns.get(turnId) ?? this.#mint(turnId);
      }
      #mint(turnId) {
        const fresh = new TurnHandle(turnId, () => this.#itemsOfTurn(turnId));
        this.#turns.set(turnId, fresh);
        return fresh;
      }
      /**
       * A host process exited. Classify it, and discharge SS2.13.3b if the profile
       * demands it (tasks.md T030b, FM-002).
       *
       * REPORT EVERY NOTIFICATION OF THE DEATH — the exit promise AND transport
       * EOF. A repeat report of an already-latched death is not a no-op: it marks
       * END OF DRAIN and settles waits the drain minted after the first report.
       * A consumer that dedupes exit notifications and reports the death once
       * leaves those waits pending forever (FM-001).
       *
       * Three outcomes, and the middle one is the one an implementation drops:
       *  - an ORDERLY exit (SS2.11 row 0) is not a death: nothing is discharged
       *    and the session stays usable;
       *  - a DURABLE session's abnormal death reconciles on resume (FM-001), so
       *    the stores are left exactly as observed and only the waiters are told;
       *  - an EPHEMERAL — or unrecognized (SS2.13.1) — session's abnormal death
       *    discharges the obligation in full.
       */
      hostExited(exit) {
        if (this.#discharge !== void 0) {
          this.#sweepUnsettledAfterDrain();
          return this.#discharge;
        }
        const profile2 = this.#durability;
        if (!isAbnormalHostDeath(exit))
          return { exit, kind: "notADeath", profile: profile2 };
        if (survivesHostDeath(profile2)) {
          const died = new MuseHostDiedError(exit);
          this.#deathError = died;
          for (const handle of this.#turns.values())
            handle.fail(died);
          this.#discharge = { exit, kind: "durableDeath", profile: profile2 };
          return this.#discharge;
        }
        const retiredCommands = this.#pending.discardEphemeral();
        const terminalUnknownItems = this.#fold.markEphemeralHostDeath(isItemInProgress);
        for (const handle of this.#turns.values())
          handle.settleTerminalUnknown();
        this.#discarded?.sessionIds.add(this.sessionId);
        this.#submit.forgetRetired(retiredCommands);
        this.#discharge = {
          exit,
          kind: "discharged",
          profile: profile2,
          retiredCommands,
          terminalUnknownItems
        };
        return this.#discharge;
      }
      /**
       * Settle everything the drain left open. DURABLE ONLY, and `#deathError` is
       * set iff a durable death latched, so the condition is the discriminator.
       *
       * There is deliberately no ephemeral arm: after a discharge the first
       * notification settled every held handle, `apply()` refuses before a frame
       * can mint one, and `turn()` settles a fresh mint on the spot — so no
       * unsettled handle can exist for it to reach. An arm for that state would be
       * untestable defense for something no producer reaches (Constitution XI) and
       * a mutant that survives by construction.
       */
      #sweepUnsettledAfterDrain() {
        if (this.#deathError === void 0)
          return;
        for (const handle of this.#turns.values())
          handle.fail(this.#deathError);
      }
      // ---- FR-018 submit verb (T030 obligation a) -----------------------------
      /**
       * Submit a user turn (tdd SS3.2) and hand back THIS session's handle for the
       * turn the ack named.
       *
       * The returned handle is the one `apply` already routes events to — not a
       * second one minted beside it, which would compare equal on every field and
       * then never receive an item, a delta, or a terminal.
       *
       * The wire shaping, the optimistic SS4.13 entry, and the settle-on-rejection
       * rule all live in `TurnSubmitter`; what is decided HERE is the one thing that
       * needs the fold: the entry's insertion point, which is the last item this
       * session holds at submission time.
       */
      async sendUserTurn(options) {
        const ack = await this.#submit.submit(options, this.#lastFoldedItemId());
        return this.#handle(ack.turnId);
      }
      // ---- FR-019 approval round trip (T031) ----------------------------------
      /** Answer approvals with `handler` (FR-019). See `ApprovalRouter`. */
      onApproval(handler) {
        this.#approvals.onApproval(handler);
      }
      /** Observe round trips that did not complete. See `ApprovalFailure`. */
      onApprovalError(handler) {
        this.#approvals.onApprovalError(handler);
      }
      // ---- consumer-driven SS4.13 retirement verbs ----------------------------
      /**
       * Stop the SS3.1.1 retry loop for one entry and take its input back
       * (SS4.13 "Abandoned").
       *
       * A `Session` method rather than a `pending` view member: the retirement
       * must also prune the submitter's replay memory, or the abandoned command's
       * `turn/start` params live for the session's lifetime — unbounded over the
       * sanctioned submit-then-abandon flow.
       */
      stopRetrying(commandId) {
        const retired = this.#pending.stopRetrying(commandId);
        if (retired !== void 0)
          this.#submit.forgetRetired([retired]);
        return retired;
      }
      /**
       * Feed a consumer-driven replay's answer through the live SS4.13 settlement
       * rules. Wrapped for the same replay-memory bookkeeping as `stopRetrying`;
       * `"held"` means the answer settled nothing and the entry stays.
       */
      replayAnswered(commandId, answer) {
        const settled = this.#pending.replayAnswered(commandId, answer);
        if (settled !== "held")
          this.#submit.forgetRetired([settled]);
        return settled;
      }
      // ---- SS4.13 drivers that need client->server I/O (T030 obligation d) ----
      /**
       * Resolve a snapshot join by performing the I/O its plan demands (SS4.13,
       * SS4.9): same-`commandId` resubmits FIRST, then the replays, then the
       * reclaimed-signature verdict.
       *
       * The order is normative, not incidental: SS4.13 requires an unacked entry be
       * resubmitted "before any retire-to-composer", because a join miss does not
       * prove the intake was never written.
       *
       * `PendingCommandSet.joinSnapshot` stays available on `pending` for a
       * fold-only consumer that performs its own I/O; this verb is for the wired
       * case and therefore requires a connection even when the plan turns out empty.
       */
      async resolveSnapshotJoin(facts) {
        this.#submit.requireConnection("resolveSnapshotJoin");
        const plan = this.#pending.joinSnapshot(facts);
        const out = [...plan.retirements];
        for (const commandId of plan.mustResubmit)
          await this.#submit.driveReplay(commandId, out);
        const queuedCommandIds = facts.queuedTurns.map((queued) => queued.commandId);
        for (const commandId of plan.mustReplay) {
          const answer = await this.#submit.replay(commandId);
          if (answer === void 0)
            continue;
          const settled = this.#pending.resolveReplayAtJoin(commandId, answer, queuedCommandIds);
          if (settled !== "held")
            out.push(settled);
        }
        this.#submit.forgetRetired(out);
        return out;
      }
      /**
       * Resolve a reconnect with NO snapshot (`history.mode: "none"`, the default
       * cursor-resume path). Reconnect itself is the trigger: replay each acked
       * entry once, resubmit each unacked entry's SAME `commandId` once.
       */
      async resolveReconnect() {
        this.#submit.requireConnection("resolveReconnect");
        const plan = this.#pending.reconnectedWithoutSnapshot();
        const out = [];
        for (const commandId of plan.mustResubmit)
          await this.#submit.driveReplay(commandId, out);
        for (const commandId of plan.mustReplay)
          await this.#submit.driveReplay(commandId, out);
        this.#submit.forgetRetired(out);
        return out;
      }
      // ---- event-driven I/O ---------------------------------------------------
      #lastFoldedItemId() {
        const items = this.#fold.items.list();
        return items.length === 0 ? null : items[items.length - 1]?.itemId ?? null;
      }
      /**
       * SS4.13 "Queue movement": a `turn/started` or `turn/completed` for a turn
       * that is not an entry's own decides that entry's fate at a launch boundary,
       * and SS4.3 carries no view event for a command-intake settlement — so the
       * only way to learn it is to replay.
       */
      #queueMoved(turnId, tasks) {
        if (!this.#submit.wired)
          return;
        const commandIds = this.#pending.observedQueueMovement(turnId);
        if (commandIds.length === 0)
          return;
        tasks.push(this.#driveQueueReplays(commandIds));
      }
      async #driveQueueReplays(commandIds) {
        const out = [];
        for (const commandId of commandIds) {
          try {
            await this.#submit.driveReplay(commandId, out);
          } catch {
          }
        }
        this.#submit.forgetRetired(out);
        return out;
      }
      #approvalRequested(params, tasks) {
        const decided = this.#approvals.requested(params);
        if (decided !== void 0)
          tasks.push(decided.then(() => []));
      }
      /** The #36949 stage-advance re-route; the merge lives on `ApprovalRouter.updated`. */
      #approvalUpdated(requested, params, tasks) {
        const decided = this.#approvals.updated(requested, params);
        if (decided !== void 0)
          tasks.push(decided.then(() => []));
      }
      #itemsOfTurn(turnId) {
        return this.#fold.items.list().filter((item) => item.turnId === turnId);
      }
      #itemFolded(item, retirements) {
        if (item.kind === USER_MESSAGE && item.commandId !== void 0) {
          const materialized = this.#pending.observedUserMessage(item.commandId, item.itemId);
          if (materialized !== void 0)
            retirements.push(materialized);
        }
        const turnId = item.turnId;
        if (turnId != null)
          this.#handle(turnId).pushItem(item);
        const buffered = this.#unattributedDeltas.get(item.itemId);
        if (buffered === void 0)
          return;
        this.#unattributedDeltas.delete(item.itemId);
        if (turnId == null)
          return;
        const handle = this.#handle(turnId);
        for (const params of buffered)
          handle.pushDelta(params);
      }
      #deltaFolded(params) {
        const held = this.#fold.items.get(params.itemId);
        if (held === void 0) {
          const buffered = this.#unattributedDeltas.get(params.itemId);
          if (buffered === void 0)
            this.#unattributedDeltas.set(params.itemId, [params]);
          else
            buffered.push(params);
          return;
        }
        if (held.turnId != null)
          this.#handle(held.turnId).pushDelta(params);
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/facade/client.js
function committedProfileId(snapshot) {
  if (typeof snapshot !== "object" || snapshot === null)
    return null;
  const state = snapshot.permissionState;
  if (typeof state !== "object" || state === null)
    return null;
  const id = state.profileId;
  return typeof id === "string" ? id : null;
}
var MuseClient;
var init_client = __esm({
  "node_modules/@muse-code/sdk/dist/src/facade/client.js"() {
    init_spawn();
    init_errors();
    init_discarded();
    init_host_death();
    init_connection();
    init_host_start();
    init_session();
    MuseClient = class _MuseClient {
      #connection;
      #durability;
      #discarded;
      /** Sessions this client opened, so one death notification reaches them all. */
      #sessions = /* @__PURE__ */ new Set();
      /**
       * Frames naming a session this client has not registered YET, held only
       * while a `session/start`/`session/resume` is in flight (#49790): the host
       * flushes the resume replay BEFORE the result, and the promise awaiting that
       * result resumes only after the whole chunk has been routed. `#route` holds,
       * `#openSession` drains, `#open` clears when the last open settles.
       */
      #held = /* @__PURE__ */ new Map();
      #opening = 0;
      /** The spawned host, when `spawn` built this client. */
      #child;
      #initializeResult;
      /**
       * Set by `close()` BEFORE the connection is torn down.
       *
       * This flag is the entire discriminator for obligation (b): the same
       * transport EOF is an orderly SS2.1.2 shutdown when we caused it and an
       * abnormal death when we did not, and nothing below this layer can tell.
       */
      #closing = false;
      /** Latched by an abnormal EOF, so a later `resumeSession` can be withheld. */
      #hostDied = false;
      constructor(connection, options) {
        this.#connection = connection;
        this.#durability = options.durability;
        this.#discarded = new DiscardedSessions();
        this.#child = options.host?.child;
        this.#initializeResult = options.host?.initializeResult;
        this.#connection.onNotification((notification) => this.#route(notification));
        void this.#connection.closed.then(() => this.#transportClosed());
      }
      /**
       * Deliver one view notification to the session(s) it names.
       *
       * A frame naming NO session is dropped here rather than fed to every
       * session: `Session.apply` already tolerates unknown methods, but only the
       * frames that name a `sessionId` have an owner to route to. A frame naming
       * an UNKNOWN session is dropped for the same reason — routing it anywhere
       * would trip the foreign-frame throw on a session it does not belong to —
       * UNLESS an open is in flight, when it may be that open's own session named
       * by the server before the awaiting promise has run (#49790): then it is
       * held for `#openSession` to fold, or for `#open` to clear.
       */
      #route(notification) {
        const named = notification.params?.sessionId;
        if (typeof named !== "string")
          return;
        let delivered = false;
        for (const session of this.#sessions) {
          if (session.sessionId === named) {
            session.apply(notification);
            delivered = true;
          }
        }
        if (delivered || this.#opening === 0)
          return;
        const held = this.#held.get(named);
        if (held === void 0)
          this.#held.set(named, [notification]);
        else
          held.push(notification);
      }
      /**
       * Spawn an owned host, run the SS1.4 handshake, and hand back a client whose
       * durability profile came from that handshake (FR-018).
       *
       * The profile is READ rather than asked of the caller, which is the whole
       * reason this factory exists beside the bare constructor: SS2.13.1 makes the
       * absent/unrecognized distinction load-bearing, and a caller re-deriving it
       * by hand is a caller that can get it wrong.
       *
       * Rejects with {@link MuseHostStartError} when the host is lost before the
       * handshake completes (the binary could not be spawned, or the process
       * ended first — exit code or signal plus the bounded stderr tail;
       * `answeredInitialize` says whether it died after a usable answer). A host
       * that answers with a reply the SDK refuses keeps its own error: an
       * `MspError` for an SS1.6 refusal, or a `ProtocolError` (with the whole
       * refused frame on `line`) for a reply the SDK cannot use, such as one with
       * no schema fingerprint.
       */
      static async spawn(options) {
        const handshake = spawnMspConnection({
          command: options.museBin,
          ...options.args === void 0 ? {} : { args: options.args },
          ...options.cwd === void 0 ? {} : { cwd: options.cwd },
          ...options.env === void 0 ? {} : { env: options.env },
          ...options.onStderr === void 0 ? {} : { onStderr: options.onStderr },
          ...options.shutdownTimeoutMs === void 0 ? {} : { shutdownTimeoutMs: options.shutdownTimeoutMs }
        });
        let spawned;
        try {
          spawned = await handshake.initialize({
            clientInfo: options.clientInfo,
            ...options.capabilities === void 0 ? {} : { capabilities: options.capabilities }
          });
        } catch (error) {
          await handshake.close().catch(() => void 0);
          const answered = error instanceof MspError || error instanceof ProtocolError && error.line !== void 0;
          if (answered)
            throw error;
          throw await hostStartFailure(handshake.child, error, handshake[initializeAnswered]());
        }
        return new _MuseClient(spawned.connection, {
          durability: readSessionDurability(spawned.initializeResult),
          host: spawned
        });
      }
      /**
       * The handshake result, when this client was built by `spawn`.
       *
       * A plain `Error`, not a typed one: reading this off a client that was not
       * built by `spawn` is API misuse, not a protocol STATE an embedder branches
       * on — a typed class here would send the SS2.13.3b recovery path chasing a
       * host death that never happened.
       */
      get initializeResult() {
        if (this.#initializeResult === void 0) {
          throw new Error("initializeResult is only available on a client built by MuseClient.spawn");
        }
        return this.#initializeResult;
      }
      /** The host's SS2.11 exit row, when this client was built by `spawn`. */
      get exit() {
        if (this.#child === void 0) {
          throw new Error("exit is only available on a client built by MuseClient.spawn");
        }
        return this.#child.exit;
      }
      /** The durability profile every session this client opens inherits. */
      get durability() {
        return this.#durability;
      }
      /** Open a new root session (tdd SS2.5.1). */
      async startSession(options = {}) {
        const params = {};
        if (options.approvalMode != null)
          params.approvalMode = options.approvalMode;
        if (options.providerId != null)
          params.providerId = options.providerId;
        if (options.sessionId != null)
          params.sessionId = options.sessionId;
        if (options.workspaceRoot != null)
          params.workspaceRoot = options.workspaceRoot;
        if (options.workspaceRoots != null)
          params.workspaceRoots = options.workspaceRoots;
        if (options.modelId != null)
          params.modelId = options.modelId;
        if (options.permissionProfile != null)
          params.permissionProfile = options.permissionProfile;
        const required = options.requirePermissionProfile === true;
        if (required && options.permissionProfile == null) {
          throw new Error("requirePermissionProfile needs permissionProfile: require the selection you pass");
        }
        const session = await this.#open("session/start", params, (raw) => ({
          result: raw,
          verb: "session/start"
        }));
        if (!required)
          return session;
        return this.#proveSelection(session, options.permissionProfile);
      }
      /**
       * Prove a required start selection (TEST-42624-10): the start result's own
       * `session.permissionState` first (absent = unknown, never applied); else a
       * point-in-time `session/read`, which never subscribes. Only `profileId ==
       * requested` proceeds; anything else throws `PermissionProfileNotApplied`
       * BEFORE any turn is sent. The refused session is dropped from the client
       * (no orphan keeps folding for an id the caller can never reach — the SDK
       * has no set/close-by-id verb); the error's `sessionId` is the caller's
       * handle to resume via `sessionId` or start again. A failed read-back
       * propagates: the client still never proceeds on the default.
       */
      async #proveSelection(session, requested) {
        const opening = session.opening;
        const started = opening !== void 0 && opening.verb === "session/start" ? committedProfileId(opening.result.session) : null;
        if (started !== null) {
          if (started === requested)
            return session;
          this.#sessions.delete(session);
          throw new PermissionProfileNotApplied(requested, started, session.sessionId);
        }
        const read = await this.#connection.command("session/read", {
          sessionId: session.sessionId
        });
        const served = committedProfileId(read["session"]);
        if (served === requested)
          return session;
        this.#sessions.delete(session);
        throw new PermissionProfileNotApplied(requested, served, session.sessionId);
      }
      /**
       * Load an existing session and subscribe this connection to its view
       * (tdd SS2.5.2).
       *
       * WITHHELD after an ephemeral host death (SS2.13.3b clause 2, "do not attempt
       * to reattach"), and refused on THIS side of the transport: a reattach
       * attempt that reaches the wire has already violated the clause, whatever the
       * server answers.
       */
      async resumeSession(options) {
        this.#assertReattachAllowed(options.sessionId);
        const params = { sessionId: options.sessionId };
        if (options.cursor != null)
          params.cursor = options.cursor;
        if (options.excludeItems != null)
          params.excludeItems = options.excludeItems;
        if (options.history != null)
          params.history = options.history;
        return this.#open("session/resume", params, (raw) => ({
          result: raw,
          verb: "session/resume"
        }));
      }
      /**
       * Shut the host down in an orderly way (SS2.1.2); the shutdown this causes
       * is not reported to your sessions as a host death.
       *
       * The EOF this close produces is NOT a death, which is what `#closing`
       * records.
       *
       * `#closing` covers only the EOF; it must not swallow the EXIT ROW. When the
       * host ignores stdin EOF, `#child.close()` escalates to SIGTERM/SIGKILL and
       * the exit classifies as a crash — an abnormal death under SS2.13.3b no
       * matter who started the close, and one no transport event will ever report
       * here because `#closing` already claimed the EOF. So the classification the
       * close itself returns is forwarded to every session: `hostExited` answers
       * `notADeath` for `cleanShutdown`, keeping the orderly arm inert.
       */
      async close() {
        this.#closing = true;
        if (this.#child !== void 0) {
          const exit = await this.#child.close();
          if (isAbnormalHostDeath(exit)) {
            for (const session of this.#sessions)
              session.hostExited(exit);
          }
          return;
        }
        await this.#connection.close();
      }
      /**
       * The window `#route` holds unknown-session frames for: from the request to
       * the Session's registration. Counted, not flagged, so two concurrent opens
       * keep it open until the LAST settles; cleared on settle so a frame that
       * named no session this client opened is held no longer than the open it
       * rode in with (#49790).
       */
      async #open(verb, params, opening) {
        this.#opening += 1;
        try {
          const opened = opening(await this.#connection.command(verb, params));
          return this.#openSession(opened.result.session.sessionId, opened);
        } finally {
          this.#opening -= 1;
          if (this.#opening === 0)
            this.#held.clear();
        }
      }
      #openSession(sessionId, opening) {
        const session = new Session({
          connection: this.#connection,
          discarded: this.#discarded,
          durability: this.#durability,
          opening,
          sessionId
        });
        this.#sessions.add(session);
        const held = this.#held.get(sessionId);
        if (held !== void 0) {
          this.#held.delete(sessionId);
          for (const frame of held)
            session.apply(frame);
        }
        return session;
      }
      #assertReattachAllowed(sessionId) {
        if (this.#discarded.sessionIds.has(sessionId)) {
          throw new MuseSessionDiscardedError(`session ${sessionId} was discarded after an ephemeral host death; it cannot be resumed`);
        }
        if (this.#hostDied && !this.#survivesHostDeath()) {
          throw new MuseSessionDiscardedError("this client's ephemeral host died; SS2.13.3b forbids reattaching to it");
        }
      }
      #survivesHostDeath() {
        return this.#durability.kind === "durable";
      }
      /**
       * The transport reached EOF. If this client did not cause it, that is
       * SS2.13.3b's second death notification (T030 obligation b) and every session
       * this client opened discharges through the SAME `Session.hostExited` path
       * the process exit uses — including its latch, so whichever notification
       * arrives second replays the first one's report instead of a half delta.
       */
      #transportClosed() {
        if (this.#closing)
          return;
        this.#hostDied = true;
        for (const session of this.#sessions)
          session.hostExited({ kind: "transportEof" });
      }
    };
  }
});

// node_modules/@muse-code/sdk/dist/src/index.js
var src_exports = {};
__export(src_exports, {
  COMMAND_REJECTED_CODE: () => COMMAND_REJECTED_CODE,
  COMMAND_REJECTED_KIND: () => COMMAND_REJECTED_KIND,
  Connection: () => Connection,
  DiscardedSessions: () => DiscardedSessions,
  EXPECTED_SCHEMA_FINGERPRINT: () => EXPECTED_SCHEMA_FINGERPRINT,
  ItemStore: () => ItemStore,
  MspError: () => MspError,
  MspHandshake: () => MspHandshake,
  MuseClient: () => MuseClient,
  MuseForeignSessionError: () => MuseForeignSessionError,
  MuseGapFillError: () => MuseGapFillError,
  MuseHostDiedError: () => MuseHostDiedError,
  MuseHostStartError: () => MuseHostStartError,
  MuseServeChild: () => MuseServeChild,
  MuseSessionDiscardedError: () => MuseSessionDiscardedError,
  PendingCommandSet: () => PendingCommandSet,
  PermissionProfileNotApplied: () => PermissionProfileNotApplied,
  ProtocolError: () => ProtocolError,
  Session: () => Session,
  SessionFold: () => SessionFold,
  SessionStateStore: () => SessionStateStore,
  SpawnedMspConnection: () => SpawnedMspConnection,
  checkServedFingerprint: () => checkServedFingerprint,
  createUuidV7Mint: () => createUuidV7Mint,
  fingerprintMismatchMessage: () => fingerprintMismatchMessage,
  isLaunchFailure: () => isLaunchFailure,
  readSessionDurability: () => readSessionDurability,
  spawnMspConnection: () => spawnMspConnection
});
var init_src = __esm({
  "node_modules/@muse-code/sdk/dist/src/index.js"() {
    init_fingerprint();
    init_item_store();
    init_state_store();
    init_session_fold();
    init_pending_command_set();
    init_connection();
    init_spawn();
    init_client();
    init_discarded();
    init_errors();
    init_host_death();
    init_host_start();
    init_session();
    init_turn_handle();
  }
});

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
      return entry.session.refresh({ force: true });
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

// src/muse-code.mjs
var MUSE_CODE_INTEGRATION_ID = "meta-muse-code";
var MUSE_CODE_SERVICE_ID = "muse-code";
var MUSE_CODE_EVIDENCE = Object.freeze({
  repository: "https://github.com/meta-models/muse-code-sdk",
  commit: "a0c8611b382584eb5091942b477f30e92e1c8d18",
  sdkVersion: "1.4.7",
  protocol: "Muse Session Protocol (MSP)",
  schema: "https://github.com/meta-models/muse-code-sdk/blob/a0c8611b382584eb5091942b477f30e92e1c8d18/schema/msp/msp.d.ts",
  experimentalDocsCommit: "1ee1e5dee1f5c4d9aad22c9182205ccb5648b2dd",
  accountProtocol: "https://meta-models.github.io/muse-code-sdk/next/generated/msp/methods/account-loginstart/",
  settingsProtocol: "https://meta-models.github.io/muse-code-sdk/next/generated/msp/types/settingswritevalueparams/",
  isolationSource: "https://github.com/HarjjotSinghh/aonia/blob/main/docs/SPEC.md",
  contributorTerms: "https://dev.meta.ai/help/subscriptions/muse-code-contributor-mode",
  modelAvailability: "https://dev.meta.ai/docs/models#models__muse-wonder-availability",
  limitations: Object.freeze([
    "agent-session-protocol",
    "live-multi-account-isolation-unverified",
    "contributor-setting-probed-per-host",
    "catalog-is-not-entitlement",
    "live-generation-unverified"
  ])
});
var ERRORS = Object.freeze({
  "muse-code-unavailable": "This Muse Code operation is unavailable on the current host.",
  "muse-code-llm-unsupported": "Muse Code MSP runs agent sessions with host-owned tools. A compatible DSH LLM bridge has not been verified.",
  "muse-code-observation-invalid": "The Muse Code observation did not match the verified MSP contract.",
  "muse-code-observation-failed": "The Muse Code observation could not be read.",
  "muse-code-observation-closed": "This Muse Code observation session has ended.",
  "muse-code-cli-required": "Install the official Muse Code CLI and its supported MSP SDK on the host to use this connection.",
  "muse-code-protocol-unsupported": "This Muse Code CLI does not provide the required account and settings protocol. Update the official CLI.",
  "muse-code-login-required": "Sign in to this Muse Code connection first.",
  "muse-code-login-failed": "Muse Code sign-in did not complete.",
  "muse-code-mode-unavailable": "This account or Muse Code host cannot apply the requested Contributor setting.",
  "muse-code-connection-changed": "This Muse Code connection or host profile changed during the operation.",
  "muse-code-connection-disabled": "Enable this Muse Code connection before starting a new agent turn.",
  "muse-code-busy": "This Muse Code connection is already performing an operation.",
  "muse-code-session-failed": "The Muse Code agent session failed. No other account or API was used.",
  "muse-code-model-unavailable": "The requested Muse Code model was not advertised by this host."
});
var MuseCodeError = class extends Error {
  constructor(code) {
    super(ERRORS[code] ?? ERRORS["muse-code-unavailable"]);
    this.name = "MuseCodeError";
    this.code = Object.hasOwn(ERRORS, code) ? code : "muse-code-unavailable";
  }
};

// src/broker.mjs
var KEY_PATTERN = /^llm-pi-ai\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
var LIVE = "running";
var NS = "dsh-pi-login";
var MAX_TIMER_DELAY_MS = 2147483647;
var MUSE_LOGIN_REASONS = /* @__PURE__ */ new Set([
  "muse-code-unavailable",
  "muse-code-cli-required",
  "muse-code-protocol-unsupported",
  "muse-code-login-required",
  "muse-code-login-failed",
  "muse-code-connection-changed",
  "muse-code-connection-disabled",
  "muse-code-busy",
  "muse-code-observation-invalid",
  "muse-code-observation-failed",
  "muse-code-observation-closed"
]);
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
  constructor(authorization, credentials, settings, { timeoutMs = 6e5, expiryGraceMs = 6e4, retentionMs = 6e4, catalog, catalogs, connections, catalogsFor, syncFlows } = {}) {
    this.authorization = authorization;
    this.credentials = credentials;
    this.settings = settings;
    this.timeoutMs = timeoutMs;
    this.expiryGraceMs = expiryGraceMs;
    this.retentionMs = retentionMs;
    this.catalog = catalog;
    this.catalogs = catalogs;
    this.connections = connections;
    this.catalogsFor = catalogsFor;
    this.syncFlows = syncFlows;
    this.attempts = /* @__PURE__ */ new Map();
    this.closed = false;
    this.unwatchConnections = connections?.registry?.subscribe(() => {
      for (const attempt of this.attempts.values()) {
        if (attempt.status === LIVE && attempt.binding && !connections.isCurrent(attempt.binding)) this.withdrawStale(attempt);
      }
    });
  }
  async list() {
    if (this.connections) return (await this.connections.list()).connections;
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
    return this.connections?.section() ?? this.settings.describe({ redactSecrets: true }).find((row) => row.ns === NS);
  }
  /** The Host resolves legacy keys to records it already owns; clients cannot select record IDs. */
  connection(id) {
    requireString(id, 200);
    if (KEY_PATTERN.test(id)) {
      const found = Object.entries(this.section()?.value?.connections ?? {}).find(([, connection2]) => connection2.legacyRoute === true && connection2.integrationId === "pi" && `llm-pi-ai/${connection2.credentialRecordId}` === id);
      if (!found) throw new LoginError("invalid-request");
      id = found[0];
    }
    const connection = this.connections.lookup(id);
    if (!connection) throw new LoginError("invalid-request");
    return { ...connection, connectionId: id, key: this.connections.authKey(connection) };
  }
  catalogsForConnection(connection) {
    return this.catalogsFor?.(connection);
  }
  /** Catalog responses also belong to the endpoint/protocol they queried. */
  isCatalogCurrent(binding) {
    if (!this.connections.isCurrent(binding)) return false;
    const current = this.connections.lookup(binding.connectionId);
    const identity2 = (connection) => JSON.stringify([
      connection.integrationId,
      connection.authMethod,
      connection.credentialRef,
      connection.profile?.baseURL,
      connection.profile?.api,
      connection.headerRefs
    ]);
    return identity2(current) === identity2(binding);
  }
  withdrawStale(attempt) {
    attempt.reason = "connection-changed";
    attempt.controller.abort();
    this.clearPrompt(attempt, new LoginError("connection-changed"));
    attempt.notice = void 0;
  }
  isAttemptCurrent(attempt) {
    return !attempt.binding || this.connections.isCurrent(attempt.binding);
  }
  models(key) {
    if (this.connections) {
      const connection = this.connection(key);
      if (!this.catalog) throw new LoginError("invalid-request");
      const profile3 = connection.profile ?? {};
      const models2 = this.catalog(connection.serviceId, profile3, connection.connectionId);
      return {
        connectionId: connection.connectionId,
        revision: this.section()?.revision,
        enabled: connection.enabled !== false,
        refresh: this.catalogsForConnection(connection)?.state(connection.serviceId, models2) ?? { canRefresh: false },
        models: models2.map((model) => ({
          id: model.id,
          name: model.name,
          enabled: model.enabled ?? !profile3.disabledModels?.includes(model.id),
          fast: model.serviceTier === "priority",
          ...model.discovered ? { discovered: true } : {},
          ...model.capabilityUnverified === true ? { capabilityUnverified: true } : {}
        }))
      };
    }
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
        ...model.discovered ? { discovered: true } : {},
        ...model.capabilityUnverified === true ? { capabilityUnverified: true } : {}
      }))
    };
  }
  async setModel(key, model, enabled, revision) {
    const binding = this.connections ? this.connections.binding(this.connection(key)) : void 0;
    await this.validateModels(key);
    if (binding && !this.isCatalogCurrent(binding)) throw new LoginError("connection-changed");
    if (typeof enabled !== "boolean" || !Number.isSafeInteger(revision)) throw new LoginError("invalid-request");
    const current = this.models(key);
    const choice = current.models.find((entry) => entry.id === model);
    if (!choice) throw new LoginError("invalid-request");
    if (current.revision !== revision) throw new LoginError("settings-changed");
    const connection = this.connections ? this.connection(key) : void 0;
    const provider = connection?.serviceId ?? key.slice("llm-pi-ai/".length);
    const profile2 = connection?.profile ?? this.section().value?.providers?.[provider];
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
    if (connection) await this.connections.update(connection.connectionId, { profile: changes }, revision);
    else await this.settings.update(NS, { providers: { [provider]: changes } }, revision);
    return { saved: true };
  }
  provider(key) {
    if (this.connections) return this.connection(key).serviceId;
    if (!KEY_PATTERN.test(requireString(key, 200)) || !this.authorization.describe(key)) throw new LoginError("invalid-request");
    return key.slice("llm-pi-ai/".length);
  }
  async validateModels(key) {
    if (this.connections) {
      const connection = this.connection(key), binding = this.connections.binding(connection);
      await this.catalogsForConnection(connection)?.validate(connection.serviceId);
      if (!this.isCatalogCurrent(binding)) throw new LoginError("connection-changed");
      return;
    }
    await this.catalogs?.validate(this.provider(key));
  }
  async refreshModels(key) {
    if (this.connections) {
      const connection = this.connection(key);
      if (this.closed) throw new LoginError("unavailable");
      const catalogs = this.catalogsForConnection(connection);
      const binding = this.connections.binding(connection);
      if (!catalogs) throw new LoginError("catalog-refresh-unsupported");
      try {
        await catalogs.refresh(connection.serviceId);
        if (!this.isCatalogCurrent(binding)) throw new LoginError("connection-changed");
        return this.models(key);
      } catch (error) {
        throw new LoginError(error instanceof CatalogRefreshError || error instanceof LoginError ? error.code : "catalog-refresh-failed");
      }
    }
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
    if (this.connections) {
      if (typeof enabled !== "boolean" || !Number.isSafeInteger(revision)) throw new LoginError("invalid-request");
      const connection = this.connection(key);
      await this.connections.update(connection.connectionId, { enabled }, revision);
      return { saved: true };
    }
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
    const connection = this.connections ? this.connection(key) : void 0;
    if (connection) {
      if (method !== connection.authMethod) throw new LoginError("unsupported-method");
      key = connection.key;
    }
    if (!connection && !KEY_PATTERN.test(requireString(key, 200))) throw new LoginError("invalid-request");
    const entry = this.authorization.describe(key);
    if (!entry || !entry.methods.some((option) => option.id === method)) throw new LoginError("unsupported-method");
    if (entry.inFlight || [...this.attempts.values()].some((attempt2) => attempt2.key === key && attempt2.status === LIVE)) throw new LoginError("busy");
    if (this.attempts.size >= 32) throw new LoginError("busy");
    const ticket = randomUUID();
    const attempt = {
      key,
      ticket,
      status: LIVE,
      controller: new AbortController(),
      prompt: void 0,
      notice: void 0,
      ...connection ? { connectionId: connection.connectionId, context: this.connections.registry?.token(connection.connectionId) } : {}
    };
    this.attempts.set(ticket, attempt);
    this.armTimeout(attempt, this.timeoutMs);
    attempt.done = Promise.resolve().then(async () => {
      if (connection) {
        if (attempt.controller.signal.aborted) return { status: "cancelled" };
        if (attempt.context && !this.connections.registry.isCurrent(attempt.context)) return { status: "cancelled" };
        const current = await this.connections.beginLogin(connection.connectionId);
        attempt.loginStarted = true;
        attempt.credentialGeneration = current.credentialGeneration;
        attempt.binding = this.connections.binding(current);
        this.syncFlows?.();
        if (attempt.context && !this.connections.registry.isCurrent(attempt.context)) this.withdrawStale(attempt);
        if (attempt.controller.signal.aborted) return { status: "cancelled" };
      }
      return this.authorization.begin({
        key,
        method,
        signal: attempt.controller.signal,
        interaction: {
          notify: (notice) => this.notify(attempt, notice),
          prompt: (prompt) => this.ask(attempt, prompt)
        }
      });
    }).then((outcome) => {
      attempt.status = outcome.status === "authorized" && !attempt.controller.signal.aborted && this.isAttemptCurrent(attempt) ? "authorized" : "cancelled";
      if (attempt.status === "authorized") attempt.reason = void 0;
    }, (error) => {
      attempt.status = attempt.controller.signal.aborted ? "cancelled" : "failed";
      if (!attempt.controller.signal.aborted && error instanceof Error && /^Device flow timed out(?:$| after one or more slow_down responses\.)/.test(error.message)) attempt.reason = "provider-expired";
      else if (!attempt.controller.signal.aborted && connection?.integrationId === MUSE_CODE_INTEGRATION_ID && error instanceof MuseCodeError && MUSE_LOGIN_REASONS.has(error.code)) attempt.reason = error.code;
    }).finally(() => {
      if (attempt.loginStarted) this.connections.endLogin(connection.connectionId);
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
    if (attempt.status !== LIVE || attempt.controller.signal.aborted || this.closed || !this.isAttemptCurrent(attempt)) return;
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
    if (attempt.status === LIVE && !this.isAttemptCurrent(attempt)) this.withdrawStale(attempt);
    return {
      status: attempt.status,
      ...attempt.reason === void 0 ? {} : { reason: attempt.reason },
      ...attempt.notice === void 0 ? {} : { notice: attempt.notice },
      ...attempt.prompt === void 0 ? {} : { prompt: attempt.prompt.view }
    };
  }
  checkTicketConnection(ticket, connectionId2) {
    if (!this.connections || connectionId2 === void 0) return;
    if (this.attempt(ticket).connectionId !== this.connection(connectionId2).connectionId) throw new LoginError("invalid-request");
  }
  ask(attempt, prompt) {
    if (attempt.controller.signal.aborted || prompt.signal?.aborted || !this.isAttemptCurrent(attempt)) return Promise.reject(new LoginError("cancelled"));
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
    if (!this.isAttemptCurrent(attempt)) {
      this.withdrawStale(attempt);
      throw new LoginError("connection-changed");
    }
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
    if (this.connections) {
      const connection = this.connection(key);
      const binding = this.connections.binding(connection);
      const owner = this.connections.registry.owner(connection.integrationId);
      const description = owner.describeConnection ? await owner.describeConnection(connection) : connection.integrationId === "pi" ? await this.credentials.describeRecord(connection.key) : void 0;
      if (!description?.configured) throw new LoginError("not-connected");
      if (!this.connections.isCurrent(binding)) throw new LoginError("connection-changed");
      if (connection.credentialRef) throw new LoginError("api-key-override");
      if (connection.enabled !== false) return { enabled: true };
      if (owner.enable) return owner.enable(connection);
      await this.connections.update(connection.connectionId, { enabled: true }, this.section()?.revision);
      return { enabled: true };
    }
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
    if (this.connections) {
      const connection = this.connection(key);
      if (connection.credentialRef || connection.authMethod !== "oauth") throw new LoginError("unsupported-method");
      return this.enable(connection.connectionId);
    }
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
    this.unwatchConnections?.();
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
  if (broker.connections && ["start", "answer", "cancel", "enable", "set-model", "set-provider", "use-login"].includes(method)) broker.connections.guard(payload);
  const target = payload.connectionId ?? payload.key;
  if (["state", "answer", "cancel"].includes(method)) broker.checkTicketConnection(payload.ticket, payload.connectionId);
  switch (method) {
    case "list":
      return broker.list();
    case "start":
      return broker.start(target, payload.method);
    case "state":
      return broker.snapshot(payload.ticket);
    case "answer":
      return broker.answer(payload.ticket, payload.id, payload.value);
    case "cancel":
      return broker.cancel(payload.ticket);
    case "enable":
      return broker.enable(target);
    case "models":
      await broker.validateModels(target);
      return broker.models(target);
    case "refresh-models":
      return broker.refreshModels(target);
    case "set-model":
      return broker.setModel(target, payload.model, payload.enabled, payload.revision);
    case "set-provider":
      return broker.setProvider(target, payload.enabled, payload.revision);
    case "use-login":
      return broker.useLogin(target);
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
  version: "0.6.1",
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
    "@earendil-works/pi-ai": "1.1.0",
    "@muse-code/sdk": "1.4.7"
  },
  engines: {
    node: ">=22.19.0"
  },
  peerDependencies: {
    "@deepseek-ai/cordis": "4.0.5-alpha.1",
    "@deepseek-ai/dsh-app-boot": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-attachment": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-brand": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-credentials": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-launch-environment": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-llm": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-timeout": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-util-values": "0.2.1-alpha.2",
    "@deepseek-ai/schemastery": "3.18.5-alpha.1"
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
function resultState(result, expected, runtime, installed) {
  if (!result) return "unknown";
  if (["cancelled", "overridden"].includes(result.application)) return result.application;
  if (result.error || result.application === "failed" || result.packageResult && (result.packageResult.exitCode !== 0 || result.packageResult.timedOut))
    return "failed";
  if (result.bundle !== PACKAGE || result.version !== expected || !installed?.installed || installed.version !== expected || installed.error || installed.readOnlyReason)
    return "unknown";
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
    return {
      runtimeVersion: this.version,
      releases: RELEASES,
      profileKey: this.profileDir ? createHash("sha256").update(PACKAGE + "\0" + resolve(this.profileDir)).digest("hex") : void 0
    };
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
  async begin(id, operationId, profileKey) {
    if (!profileKey || profileKey !== this.base().profileKey) throw new Error("profile");
    if (typeof operationId !== "string") throw new Error("invalid-request");
    const requestId = updateRequestId(operationId);
    await this.capability();
    if (this.running?.requestId === requestId) return { ...this.base(), ...this.running };
    try {
      await readFile(join(this.cacheDir, `${requestId}.json`));
      return this.reconcile(requestId);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    const last = await this.lastOperation();
    if (last && ["installing", "unknown", "restart-required"].includes((await this.reconcile(last)).status))
      throw new Error("busy");
    if (this.closed || this.running || this.checking || this.isBusy()) throw new Error("busy");
    if (typeof id !== "string" || !this.candidate || id !== this.candidate.id) throw new Error("stale-candidate");
    const candidate = this.candidate;
    this.running = { requestId, version: candidate.version, status: "preparing" };
    try {
      await this.privateDir();
      await this.save(this.running, true);
    } catch (error) {
      this.running = null;
      throw error;
    }
    void this.execute(candidate, this.running).finally(() => {
      this.running = null;
    });
    return { ...this.base(), ...this.running };
  }
  async save(operation, claim = false) {
    const directory = await this.privateDir(), file = join(directory, `${operation.requestId}.json`);
    const temp = join(directory, `${operation.requestId}.${randomUUID3()}.tmp`);
    await writeFile(temp, JSON.stringify(operation), { flag: "wx", mode: 384 });
    await rename(temp, file);
    if (!claim) return;
    const index = join(directory, `${randomUUID3()}.tmp`);
    await writeFile(index, JSON.stringify({ requestId: operation.requestId }), { flag: "wx", mode: 384 });
    await rename(index, join(directory, "latest.json"));
  }
  async execute(candidate, operation) {
    let managerInvoked = false;
    try {
      const before = await this.capability();
      const fresh = await this.getCandidate(before.bundle.version ?? this.version);
      if (!fresh || fresh.id !== candidate.id || fresh.version !== candidate.version || fresh.tarball !== candidate.tarball)
        throw new Error("stale-candidate");
      const options = { fetcher: this.fetcher, signal: this.abort.signal };
      const checksum = (await boundedFetch(candidate.checksum, 8192, options)).toString();
      const lines = checksum.trim().split(/\r?\n/);
      if (lines.length !== 1) throw new Error("checksum");
      const match = /^([a-fA-F0-9]{64}) {2}(\S+)$/.exec(lines[0]);
      if (!match || match[2] !== candidate.filename) throw new Error("checksum");
      const bytes = await boundedFetch(candidate.tarball, MAX_PACKAGE, options);
      if (createHash("sha256").update(bytes).digest("hex") !== match[1].toLowerCase()) throw new Error("checksum");
      checkCompatibility(packageManifest(bytes), candidate, await this.runtimeVersion());
      const dir = await mkdtemp(join(await this.privateDir(), "verified-"));
      const path = join(dir, candidate.filename);
      await writeFile(path, bytes, { flag: "wx", mode: 384 });
      const latest = await this.capability();
      if (latest.bundle.source !== before.bundle.source || latest.bundle.enabled !== before.bundle.enabled || this.isBusy() || this.closed)
        throw new Error("busy");
      const spec = latest.source === "github" ? `github:${REPOSITORY}#${candidate.tag}` : path;
      operation.status = "installing";
      await this.save(operation);
      if (this.closed || this.isBusy()) throw new Error("busy");
      const final = await this.capability();
      if (this.closed || this.isBusy() || final.bundle.source !== before.bundle.source) throw new Error("busy");
      if (compareVersions(candidate.version, final.bundle.version) <= 0) throw new Error("stale-candidate");
      managerInvoked = true;
      const result = await final.manager.installBundle(spec, {
        enabled: final.bundle.enabled,
        requestId: operation.requestId,
        saveExact: true
      });
      operation.result = safeResult(result);
      const installed = (await final.manager.listBundles()).find((item) => item.name === PACKAGE);
      operation.status = resultState(result, operation.version, this.version, installed);
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
    if (operation.requestId !== requestId || typeof operation.version !== "string")
      return { ...this.base(), status: "unknown", requestId };
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
      } else operation.status = "unknown";
    }
    const bundle = (await this.manager()?.listBundles())?.find((item) => item.name === PACKAGE);
    const installed = bundle?.version;
    if (operation.result) operation.status = resultState(operation.result, operation.version, this.version, bundle);
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

// src/connections.mjs
import { createHash as createHash2 } from "node:crypto";

// src/registry.mjs
import { randomUUID as randomUUID4, randomInt } from "node:crypto";
var RegistryError = class extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
};
var ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
function newConnectionId() {
  return `c-${randomUUID4()}`;
}
function routeForConnection(id) {
  if (!ID.test(id)) throw new RegistryError("invalid-connection");
  return `pi-${id}`;
}
var IntegrationRegistry = class {
  constructor(profileKey) {
    this.profileKey = profileKey;
    this.generation = randomInt(1, 2 ** 48 - 1);
    this.integrations = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.routes = /* @__PURE__ */ new Map();
    this.closed = false;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  emit(type, integrationId, connectionId2) {
    const event = { type, profileKey: this.profileKey, generation: this.generation, integrationId, connectionId: connectionId2 };
    for (const listener of this.listeners) listener(event);
  }
  register(owner) {
    if (this.closed || !ID.test(owner.integrationId) || this.integrations.has(owner.integrationId)) throw new RegistryError("integration-conflict");
    if (typeof owner.listServices !== "function" || typeof owner.listConnections !== "function") throw new RegistryError("invalid-integration");
    this.integrations.set(owner.integrationId, owner);
    this.emit("registered", owner.integrationId);
    return () => {
      if (this.integrations.get(owner.integrationId) !== owner) return;
      this.integrations.delete(owner.integrationId);
      for (const [routeId, entry] of this.routes) if (entry.integrationId === owner.integrationId) this.routes.delete(routeId);
      this.emit("unregistered", owner.integrationId);
    };
  }
  owner(integrationId) {
    const owner = this.integrations.get(integrationId);
    if (!owner) throw new RegistryError("integration-unavailable");
    return owner;
  }
  services() {
    return [...this.integrations.values()].flatMap((owner) => owner.listServices().map((service) => ({
      integrationId: owner.integrationId,
      serviceId: service.serviceId,
      label: String(service.label ?? service.serviceId),
      methods: (service.methods ?? []).map(({ id, label: label4 }) => ({ id, label: label4 })),
      capabilities: Object.fromEntries(["auth", "models", "usage", "settings"].map((key) => [key, service.capabilities?.[key] === true])),
      ...service.unavailableReason ? { unavailableReason: service.unavailableReason } : {},
      ...service.executionKind ? { executionKind: service.executionKind } : {},
      ...service.termsUrl || service.sourceTermsUrl ? { termsUrl: service.termsUrl ?? service.sourceTermsUrl } : {},
      ...service.executionKind ? { llmCompatible: service.llmCompatible === true } : {},
      ...service.requiresHostCli ? { requiresHostCli: true } : {}
    })));
  }
  service(integrationId, serviceId) {
    const service = this.services().find((entry) => entry.integrationId === integrationId && entry.serviceId === serviceId);
    if (!service) throw new RegistryError("service-unavailable");
    return service;
  }
  /** Validate all routes before publishing any replacement. */
  replaceConnections(integrationId, connections) {
    this.owner(integrationId);
    const candidate = new Map([...this.routes].filter(([, entry]) => entry.integrationId !== integrationId));
    for (const [connectionId2, connection] of Object.entries(connections)) {
      if (connection.integrationId !== integrationId) continue;
      if (!ID.test(connectionId2) || !ID.test(connection.routeId)) throw new RegistryError("invalid-connection");
      if (candidate.has(connection.routeId)) throw new RegistryError("route-conflict");
      candidate.set(connection.routeId, { integrationId, serviceId: connection.serviceId, connectionId: connectionId2 });
    }
    const before = JSON.stringify([...this.routes]);
    this.routes = candidate;
    if (JSON.stringify([...candidate]) !== before) this.emit("connections-changed", integrationId);
  }
  token(connectionId2) {
    return { profileKey: this.profileKey, generation: this.generation, connectionId: connectionId2 };
  }
  isCurrent(token2) {
    return !this.closed && token2.profileKey === this.profileKey && token2.generation === this.generation;
  }
  switchProfile(profileKey) {
    this.profileKey = profileKey;
    this.generation++;
    this.routes.clear();
    this.emit("profile-changed");
  }
  dispose() {
    this.closed = true;
    this.generation++;
    this.emit("disposed");
    this.listeners.clear();
    this.integrations.clear();
    this.routes.clear();
  }
};

// src/connections.mjs
var NS2 = "dsh-pi-login";
var RECORD_SCOPE = "llm-pi-ai";
var NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
var HEADER = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
var FORBIDDEN_HEADERS = /^(host|cookie|set-cookie|connection|proxy-.*|content-length|transfer-encoding|origin|referer)$/i;
var ConnectionError = class extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
};
function profileKeyFor(dir = "default") {
  return createHash2("sha256").update(`dsh-pi-login:${dir}`).digest("hex").slice(0, 24);
}
function text(value, limit = 100) {
  if (typeof value !== "string" || !value.trim() || value.length > limit || /[\u0000-\u001f\u007f]/.test(value)) throw new ConnectionError("invalid-request");
  return value.trim();
}
function credentialKey(id) {
  if (!NAME.test(id)) throw new ConnectionError("invalid-request");
  return `${RECORD_SCOPE}/${id}`;
}
function validateEndpoint(value, allowedOrigins = []) {
  if (value === void 0 || value === "") return void 0;
  let url;
  try {
    url = new URL(text(value, 2048));
  } catch {
    throw new ConnectionError("invalid-endpoint");
  }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new ConnectionError("invalid-endpoint");
  if (!allowedOrigins.includes(url.origin)) throw new ConnectionError("endpoint-untrusted");
  return url.href.replace(/\/$/, "");
}
function validateHeaderRefs(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length > 20) throw new ConnectionError("invalid-request");
  for (const [name2, ref] of Object.entries(value)) {
    if (!HEADER.test(name2) || FORBIDDEN_HEADERS.test(name2) || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(ref)) throw new ConnectionError("invalid-header");
  }
  return { ...value };
}
var ConnectionManager = class {
  constructor({ settings, credentials, registry, validateProfile = () => {
  }, onChange = () => {
  }, legacyProviders = () => ({}), extraConnections = async () => [] }) {
    Object.assign(this, { settings, credentials, registry, validateProfile, onChange, legacyProviders, extraConnections });
    this.closed = false;
    this.pendingLogins = /* @__PURE__ */ new Set();
    this.verified = /* @__PURE__ */ new Map();
  }
  section() {
    return this.settings.describe({ redactSecrets: false }).find((row) => row.ns === NS2);
  }
  raw() {
    return this.section()?.value?.connections ?? {};
  }
  lookup(connectionId2) {
    if (this.closed || typeof connectionId2 !== "string" || !Object.hasOwn(this.raw(), connectionId2)) throw new ConnectionError("connection-unavailable");
    return { ...structuredClone(this.raw()[connectionId2]), connectionId: connectionId2 };
  }
  isCurrent(binding) {
    if (this.closed) return false;
    const connection = this.raw()[binding.connectionId];
    return this.registry.isCurrent(binding) && !!connection && connection.serviceId === binding.serviceId && connection.credentialRecordId === binding.credentialRecordId && connection.credentialGeneration === binding.credentialGeneration;
  }
  binding(connection) {
    return { ...connection, profileKey: this.registry.profileKey, generation: this.registry.generation };
  }
  authKey(connection) {
    return connection.integrationId === "pi" ? credentialKey(connection.credentialRecordId) : this.registry.owner(connection.integrationId).authKey(connection);
  }
  markVerified(connectionId2) {
    const connection = this.lookup(connectionId2);
    this.verified.set(connectionId2, { record: connection.credentialRecordId, credentialGeneration: connection.credentialGeneration, verifiedAt: (/* @__PURE__ */ new Date()).toISOString() });
  }
  guard(payload, { optional = false } = {}) {
    if (optional && payload.profileKey === void 0 && payload.generation === void 0) return;
    if (payload.profileKey !== this.registry.profileKey || payload.generation !== this.registry.generation) throw new ConnectionError("profile-changed");
  }
  writable(revision) {
    if (this.closed) throw new ConnectionError("connection-unavailable");
    const section = this.section();
    if (!section || section.writable === false) throw new ConnectionError("read-only");
    if (!Number.isSafeInteger(revision) || section.revision !== revision) throw new ConnectionError("settings-changed");
    return section;
  }
  validate(connections) {
    const routes = /* @__PURE__ */ new Set();
    const records = /* @__PURE__ */ new Set();
    for (const [id, connection] of Object.entries(connections)) {
      if (!NAME.test(id) || !NAME.test(connection.routeId) || !NAME.test(connection.credentialRecordId) || routes.has(connection.routeId)) throw new ConnectionError("route-conflict");
      const record = `${connection.integrationId}/${connection.credentialRecordId}`;
      if (records.has(record)) throw new ConnectionError("credential-conflict");
      records.add(record);
      routes.add(connection.routeId);
      const service = this.registry.service(connection.integrationId, connection.serviceId);
      if (!service.capabilities.settings) throw new ConnectionError("unsupported");
      if (!["oauth", "api-key"].includes(connection.authMethod)) throw new ConnectionError("unsupported-method");
      if (connection.authMethod === "oauth" && !service.methods.some((entry) => entry.id === "oauth")) throw new ConnectionError("unsupported-method");
      if (connection.authMethod === "api-key" && !service.methods.some((entry) => entry.id === "api-key")) throw new ConnectionError("unsupported-method");
      text(connection.displayName);
      if (connection.profile?.headers && Object.keys(connection.profile.headers).length) throw new ConnectionError("secret-headers-require-reference");
      if (connection.headerRefs) validateHeaderRefs(connection.headerRefs);
      if (connection.integrationId === "pi") this.validateProfile(connection);
      else {
        const owner = this.registry.owner(connection.integrationId);
        if (!owner.validateConnection) throw new ConnectionError("owner-managed");
        owner.validateConnection({ ...connection, connectionId: id });
      }
    }
  }
  async write(connections, revision, extra = [], token2 = this.registry.token()) {
    if (this.closed || !this.registry.isCurrent(token2)) throw new ConnectionError("profile-changed");
    this.writable(revision);
    this.validate(connections);
    try {
      await this.settings.mutate(NS2, [{ op: "set", path: ["connections"], value: connections }, ...extra], revision);
    } catch (error) {
      if (error?.code === "SETTINGS_CONFLICT") throw new ConnectionError("settings-changed");
      if (["EACCES", "EPERM", "EROFS"].includes(error?.code) || error?.message === 'Configuration for "dsh-pi-login" is overridden by a home patch or command-line overlay') throw new ConnectionError("read-only");
      throw error;
    }
    if (this.closed || !this.registry.isCurrent(token2)) {
      const error = new ConnectionError("profile-changed");
      error.metadataCommitted = true;
      throw error;
    }
    this.changed();
  }
  changed(connectionId2) {
    for (const integrationId of new Set(Object.values(this.raw()).map((value) => value.integrationId))) this.registry.replaceConnections(integrationId, this.raw());
    if (!Object.values(this.raw()).some((value) => value.integrationId === "pi") && this.registry.integrations.has("pi")) this.registry.replaceConnections("pi", {});
    this.registry.emit("changed", void 0, connectionId2);
    this.onChange(connectionId2);
  }
  async list() {
    const token2 = this.registry.token();
    const section = this.section();
    const connections = await Promise.all(Object.keys(this.raw()).map(async (id) => {
      const connection = this.lookup(id);
      try {
        const service = this.registry.service(connection.integrationId, connection.serviceId);
        const owner = this.registry.owner(connection.integrationId);
        const key = this.authKey(connection);
        const record = connection.integrationId === "pi" ? await this.credentials.describeRecord(key) : await owner.describeConnection(connection);
        const configured = connection.credentialRef ? !!(await this.credentials.describe?.(connection.credentialRef))?.configured : record.configured === true;
        const stored = connection.integrationId === "pi" && connection.authMethod === "oauth" && configured ? await this.credentials.readRecord(key) : void 0;
        const expired = stored?.kind === "grant" && Number.isFinite(stored.payload?.expires) && stored.payload.expires <= Date.now();
        const verified = this.verified.get(id);
        const isVerified = verified?.record === connection.credentialRecordId && verified.credentialGeneration === connection.credentialGeneration;
        return {
          key,
          connectionId: id,
          integrationId: connection.integrationId,
          integrationLabel: owner.label,
          serviceId: connection.serviceId,
          serviceLabel: service.label,
          routeId: connection.routeId,
          displayName: connection.displayName,
          authMethod: connection.authMethod,
          credentialGeneration: connection.credentialGeneration,
          configured,
          writable: section?.writable !== false && record.writable !== false,
          enabled: connection.enabled !== false,
          inFlight: this.pendingLogins.has(id),
          methods: service.methods.filter((method) => method.id === connection.authMethod),
          authStatus: this.pendingLogins.has(id) ? "updating" : expired ? "expired" : configured && isVerified ? "verified" : record.authStatus ?? (configured ? "saved" : "auth-required"),
          capabilities: service.capabilities,
          ...isVerified ? { verifiedAt: verified.verifiedAt } : {},
          ...connection.museCode ? { museCode: structuredClone(connection.museCode) } : {},
          ...record.executionKind ? { executionKind: record.executionKind } : {},
          profile: { ...connection.profile?.baseURL ? { baseURL: connection.profile.baseURL } : {}, ...connection.profile?.api ? { api: connection.profile.api } : {} },
          revision: section?.revision
        };
      } catch {
        return {
          connectionId: id,
          integrationId: connection.integrationId,
          integrationLabel: connection.integrationId,
          serviceId: connection.serviceId,
          serviceLabel: connection.serviceId,
          routeId: connection.routeId,
          displayName: connection.displayName,
          authMethod: connection.authMethod,
          enabled: connection.enabled !== false,
          configured: false,
          writable: false,
          inFlight: false,
          methods: [],
          authStatus: "unavailable",
          capabilities: { auth: false, models: false, settings: false, usage: false },
          revision: section?.revision
        };
      }
    }));
    const extra = await this.extraConnections();
    if (this.closed || !this.registry.isCurrent(token2)) throw new ConnectionError("profile-changed");
    return {
      profileKey: token2.profileKey,
      generation: token2.generation,
      revision: section?.revision,
      integrations: [...this.registry.integrations.values()].map((owner) => ({ integrationId: owner.integrationId, id: owner.integrationId, label: owner.label, source: owner.source })),
      services: this.registry.services(),
      connections: [...connections, ...extra]
    };
  }
  async create(input, revision) {
    const token2 = this.registry.token();
    const section = this.writable(revision);
    const service = this.registry.service(input.integrationId, input.serviceId);
    const owner = this.registry.owner(input.integrationId);
    if (!service.capabilities.settings) throw new ConnectionError("unsupported");
    const id = newConnectionId();
    const connection = {
      integrationId: input.integrationId,
      serviceId: input.serviceId,
      routeId: input.integrationId === "pi" ? routeForConnection(id) : owner.routeIdFor(id),
      displayName: text(input.displayName ?? service.label),
      authMethod: input.authMethod,
      credentialRecordId: id,
      credentialGeneration: 0,
      enabled: false,
      profile: {}
    };
    if (input.integrationId !== "pi" && [input.apiKey, input.endpointUrl, input.api, input.headerRefs].some((value) => value !== void 0)) throw new ConnectionError("owner-managed");
    if (owner.initialConnection) Object.assign(connection, owner.initialConnection());
    if (input.endpointUrl) connection.profile.baseURL = validateEndpoint(input.endpointUrl, section.value.trustedEndpointOrigins);
    if (input.api) connection.profile.api = text(input.api, 100);
    if (input.headerRefs) connection.headerRefs = validateHeaderRefs(input.headerRefs);
    const next = { ...this.raw(), [id]: connection };
    this.validate(next);
    let stored = false;
    try {
      if (input.apiKey !== void 0) {
        if (input.authMethod !== "api-key") throw new ConnectionError("unsupported-method");
        const secret2 = text(input.apiKey, 16384);
        await this.credentials.modifyRecord(credentialKey(id), () => ({ kind: "api-key", key: secret2 }));
        stored = true;
        connection.enabled = true;
      }
      await this.write(next, revision, [], token2);
    } catch (error) {
      if (stored && !error.metadataCommitted) await this.credentials.deleteRecord(credentialKey(id)).catch(() => {
      });
      throw error;
    }
    return { connectionId: id, saved: true };
  }
  async update(connectionId2, patch, revision) {
    const token2 = this.registry.token();
    const section = this.writable(revision);
    const connection = this.lookup(connectionId2);
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) throw new ConnectionError("invalid-request");
    const allowed = /* @__PURE__ */ new Set(["displayName", "enabled", "apiKey", "endpointUrl", "api", "headerRefs", "profile", "authMethod", "contributorMode", "modelId"]);
    if (Object.keys(patch).some((key) => !allowed.has(key))) throw new ConnectionError("invalid-request");
    if (connection.integrationId !== "pi" && ["apiKey", "endpointUrl", "api", "headerRefs", "profile", "authMethod"].some((key) => patch[key] !== void 0)) throw new ConnectionError("owner-managed");
    if (connection.integrationId === "pi" && ["contributorMode", "modelId"].some((key) => patch[key] !== void 0)) throw new ConnectionError("unsupported");
    if (patch.displayName !== void 0) connection.displayName = text(patch.displayName);
    if (patch.enabled !== void 0) {
      if (typeof patch.enabled !== "boolean") throw new ConnectionError("invalid-request");
      connection.enabled = patch.enabled;
    }
    if (patch.endpointUrl !== void 0) {
      const url = validateEndpoint(patch.endpointUrl, section.value.trustedEndpointOrigins);
      if (url === void 0) delete connection.profile.baseURL;
      else connection.profile.baseURL = url;
    }
    if (patch.api !== void 0) {
      if (!patch.api) delete connection.profile.api;
      else connection.profile.api = text(patch.api);
    }
    if (patch.headerRefs) connection.headerRefs = validateHeaderRefs(patch.headerRefs);
    if (patch.profile) {
      const fields = ["disabledModels", "enabledFastModels", "enabledDiscoveredModels", "reasoning"];
      if (Object.keys(patch.profile).some((key) => !fields.includes(key))) throw new ConnectionError("invalid-request");
      Object.assign(connection.profile, patch.profile);
    }
    const oldRecordId = connection.credentialRecordId;
    let newRecordId;
    try {
      if (connection.integrationId !== "pi" && ["contributorMode", "modelId"].some((key) => patch[key] !== void 0)) {
        const owner = this.registry.owner(connection.integrationId);
        const changes = await owner.configureConnection(connection, patch, this.binding(connection));
        if (!this.isCurrent(this.binding(connection))) throw new ConnectionError("connection-changed");
        Object.assign(connection, changes);
      }
      if (patch.authMethod !== void 0 && patch.authMethod !== connection.authMethod) {
        if (!["oauth", "api-key"].includes(patch.authMethod)) throw new ConnectionError("unsupported-method");
        connection.authMethod = patch.authMethod;
        connection.credentialRecordId = newConnectionId();
        connection.credentialGeneration++;
        connection.enabled = false;
        delete connection.credentialRef;
        delete connection.profile.apiKeyEnv;
      }
      if (patch.apiKey !== void 0) {
        if (connection.authMethod !== "api-key") throw new ConnectionError("unsupported-method");
        newRecordId = newConnectionId();
        await this.credentials.modifyRecord(credentialKey(newRecordId), () => ({ kind: "api-key", key: text(patch.apiKey, 16384) }));
        connection.credentialRecordId = newRecordId;
        connection.credentialGeneration++;
        delete connection.credentialRef;
        delete connection.profile.apiKeyEnv;
      }
      delete connection.connectionId;
      await this.write({ ...this.raw(), [connectionId2]: connection }, revision, [], token2);
    } catch (error) {
      if (newRecordId && !error.metadataCommitted) await this.credentials.deleteRecord(credentialKey(newRecordId)).catch(() => {
      });
      throw error;
    }
    if (connection.integrationId === "pi" && connection.credentialRecordId !== oldRecordId && !Object.values(this.raw()).some((value) => value.integrationId === "pi" && value.credentialRecordId === oldRecordId)) await this.credentials.deleteRecord(credentialKey(oldRecordId)).catch(() => {
    });
    return { saved: true };
  }
  async clone(connectionId2, displayName, revision) {
    const token2 = this.registry.token();
    const original = this.lookup(connectionId2);
    const id = newConnectionId();
    const owner = this.registry.owner(original.integrationId);
    const copy = {
      ...original,
      routeId: original.integrationId === "pi" ? routeForConnection(id) : owner.routeIdFor(id),
      credentialRecordId: id,
      credentialGeneration: 0,
      displayName: text(displayName ?? `${original.displayName} (copy)`),
      enabled: false
    };
    delete copy.connectionId;
    delete copy.credentialRef;
    delete copy.headerRefs;
    delete copy.legacyRoute;
    delete copy.profile.apiKeyEnv;
    delete copy.profile.headers;
    await this.write({ ...this.raw(), [id]: copy }, revision, [], token2);
    return { saved: true, connectionId: id };
  }
  async delete(connectionId2, revision) {
    const token2 = this.registry.token();
    const connection = this.lookup(connectionId2);
    const next = { ...this.raw() };
    delete next[connectionId2];
    await this.write(next, revision, [], token2);
    if (!Object.values(next).some((value) => value.integrationId === connection.integrationId && value.credentialRecordId === connection.credentialRecordId)) {
      if (connection.integrationId === "pi") await this.credentials.deleteRecord(credentialKey(connection.credentialRecordId));
      else await this.registry.owner(connection.integrationId).deleteCredentials(connection);
    }
    return { deleted: true };
  }
  async beginLogin(connectionId2) {
    const token2 = this.registry.token();
    const connection = this.lookup(connectionId2);
    if (this.pendingLogins.has(connectionId2)) throw new ConnectionError("busy");
    this.pendingLogins.add(connectionId2);
    const section = this.section();
    connection.credentialGeneration++;
    delete connection.connectionId;
    try {
      await this.write({ ...this.raw(), [connectionId2]: connection }, section?.revision, [], token2);
    } catch (error) {
      this.pendingLogins.delete(connectionId2);
      throw error;
    }
    return this.lookup(connectionId2);
  }
  endLogin(connectionId2) {
    this.pendingLogins.delete(connectionId2);
  }
  /** One atomic metadata conversion. Existing credential records and route IDs stay in place. */
  async migrate() {
    const token2 = this.registry.token();
    const section = this.section();
    if (!section || section.value.connectionMigrationVersion >= 1 || section.writable === false) return false;
    const providers = { ...section.value.legacyImported ? {} : this.legacyProviders(), ...section.value.providers ?? {} };
    for (const record of await this.credentials.listRecords()) {
      if (!record.key.startsWith(`${RECORD_SCOPE}/`)) continue;
      const id = record.key.slice(RECORD_SCOPE.length + 1);
      if (NAME.test(id) && this.registry.services().some((service) => service.integrationId === "pi" && service.serviceId === id) && !Object.hasOwn(providers, id)) providers[id] = { enabled: false };
    }
    const next = { ...this.raw() };
    for (const [serviceId, profile2] of Object.entries(providers)) {
      if (!NAME.test(serviceId)) throw new ConnectionError("migration-invalid-route");
      if (Object.values(next).some((connection) => connection.legacyRoute && connection.routeId === serviceId)) continue;
      const service = this.registry.service("pi", serviceId);
      const record = await this.credentials.describeRecord(credentialKey(serviceId));
      const stored = await this.credentials.readRecord(credentialKey(serviceId));
      const authMethod = profile2.apiKeyEnv || stored?.kind === "api-key" ? "api-key" : service.methods.some((entry) => entry.id === "oauth") ? "oauth" : "api-key";
      const id = newConnectionId();
      const copy = structuredClone(profile2);
      if (copy.headers && Object.keys(copy.headers).length) throw new ConnectionError("migration-header-repair-required");
      delete copy.headers;
      const separateStoredOAuth = !!profile2.apiKeyEnv && stored?.kind === "grant";
      next[id] = {
        integrationId: "pi",
        serviceId,
        routeId: serviceId,
        displayName: profile2.displayName ?? service.label,
        authMethod,
        credentialRecordId: separateStoredOAuth ? id : serviceId,
        credentialGeneration: 0,
        ...profile2.apiKeyEnv ? { credentialRef: profile2.apiKeyEnv } : {},
        enabled: profile2.enabled !== false,
        legacyRoute: !separateStoredOAuth,
        profile: copy
      };
      if (separateStoredOAuth) {
        const oauthId = newConnectionId();
        const oauthProfile = structuredClone(copy);
        delete oauthProfile.apiKeyEnv;
        next[oauthId] = {
          integrationId: "pi",
          serviceId,
          routeId: routeForConnection(oauthId),
          displayName: `${profile2.displayName ?? service.label} (OAuth)`,
          authMethod: "oauth",
          credentialRecordId: serviceId,
          credentialGeneration: 0,
          enabled: false,
          profile: oauthProfile
        };
      }
    }
    await this.write(next, section.revision, [
      { op: "set", path: ["connectionMigrationVersion"], value: 1 },
      { op: "set", path: ["legacyImported"], value: true },
      { op: "unset", path: ["providers"] }
    ], token2);
    return true;
  }
  dispose() {
    this.closed = true;
    this.pendingLogins.clear();
    this.verified.clear();
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
  const connectionMutations = ["connection-create", "connection-update", "connection-clone", "connection-delete"];
  for (const method of ["connection-list", ...connectionMutations, "usage", "list", "start", "state", "answer", "cancel", "enable", "models", "refresh-models", "set-model", "set-provider", "use-login", "update-status", "update-check", "update-begin", "update-reconcile"]) {
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
              else if (method === "update-begin") value = await updates.begin(payload.candidateId, payload.requestId, payload.profileKey);
              else value = await updates.reconcile(payload.requestId);
            } catch (error) {
              throw new LoginError(["busy", "profile"].includes(error.message) ? error.message : "update-failed");
            }
          } else {
            const mutation = [...connectionMutations, "start", "answer", "enable", "set-model", "set-provider", "use-login"].includes(method);
            if (mutation && updates.running) throw new LoginError("busy");
            if (mutation) writes++;
            try {
              const payload = envelope.payload;
              if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new LoginError("invalid-request");
              if (connectionMutations.includes(method)) {
                if (!options.connections) throw new LoginError("unavailable");
                options.connections.guard(payload);
                if (method === "connection-create") value = await options.connections.create(payload, payload.revision);
                else if (method === "connection-update") value = await options.connections.update(payload.connectionId, payload.patch, payload.revision);
                else if (method === "connection-clone") value = await options.connections.clone(payload.connectionId, payload.displayName, payload.revision);
                else value = await options.connections.delete(payload.connectionId, payload.revision);
              } else if (method === "connection-list") {
                if (!options.connections) throw new LoginError("unavailable");
                value = await options.connections.list();
              } else if (["models", "refresh-models"].includes(method) && payload.connectionId && options.connections?.lookup(payload.connectionId).integrationId !== "pi") {
                const connection = options.connections.lookup(payload.connectionId);
                const binding = options.connections.binding(connection);
                const owner = options.registry.owner(connection.integrationId);
                const result = await owner.readModels(binding, { signal: request.signal });
                if (!options.connections.isCurrent(binding)) throw new LoginError("connection-changed");
                value = {
                  connectionId: connection.connectionId,
                  revision: options.connections.section()?.revision,
                  enabled: connection.enabled,
                  models: result.models,
                  contributor: result.contributor,
                  executionKind: result.executionKind,
                  liveVerified: false,
                  refresh: { canRefresh: true }
                };
              } else if (method === "usage") {
                if (!options.connections || !options.usage) throw new LoginError("unavailable");
                options.connections.guard(payload);
                const connection = options.connections.lookup(payload.connectionId);
                const binding = options.connections.binding(connection);
                value = await options.usage.get(binding, { force: payload.refresh === true, signal: request.signal });
                if (!options.connections.isCurrent(binding)) throw new LoginError("connection-changed");
              } else value = await dispatch(broker, method, payload);
            } finally {
              if (mutation) writes--;
            }
          }
          return Response.json({ type: "server-response", rpcId, result: { ok: true, value } }, { headers: { "cache-control": "no-store" } });
        } catch (error) {
          if (rpcId === void 0) return new Response("invalid request", { status: 400 });
          const code = error instanceof LoginError || error instanceof ConnectionError || error instanceof RegistryError || error instanceof MuseCodeError ? error.code : "unavailable";
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
import { createHash as createHash3 } from "node:crypto";
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
function toPiReplayState(message, requestedModel = message.model, scope2, requestedProvider) {
  const response = {
    kind: "pi-ai",
    version: 2,
    api: message.api,
    provider: message.provider,
    ...requestedProvider === void 0 || requestedProvider === message.provider ? {} : { routeId: requestedProvider },
    ...scope2 === void 0 ? {} : { scope: { ...scope2 } },
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
  if (response["routeId"] !== void 0 && (typeof response["routeId"] !== "string" || !response["routeId"])) return invalidReplay("routeId must be a non-empty string");
  if (response["scope"] !== void 0) {
    const scope2 = response["scope"];
    if (typeof scope2 !== "object" || scope2 === null || Array.isArray(scope2) || typeof scope2.connectionId !== "string" || !scope2.connectionId || !Number.isSafeInteger(scope2.credentialGeneration) || scope2.credentialGeneration < 0 || typeof scope2.endpoint !== "string" || !scope2.endpoint || typeof scope2.api !== "string" || !scope2.api || scope2.legacyRoute !== void 0 && typeof scope2.legacyRoute !== "string") return invalidReplay("invalid connection scope");
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
function replayedAssistant(message, source, rawState, target) {
  const state = readReplayState(rawState);
  if ((state.response.routeId ?? state.response.provider) !== source.provider) return invalidReplay("provider route does not match assistant source");
  if (state.response.model !== source.model) return invalidReplay("model does not match assistant source");
  if (target !== void 0) {
    if (source.provider !== target.provider) return invalidReplay("assistant belongs to another provider route");
    if (target.serviceId !== void 0 && state.response.provider !== target.serviceId) return invalidReplay("assistant belongs to another native provider");
    const stored = state.response.scope;
    const expected = target.scope;
    if (stored !== void 0) {
      if (expected === void 0 || stored.connectionId !== expected.connectionId || stored.credentialGeneration !== expected.credentialGeneration || stored.endpoint !== expected.endpoint || stored.api !== expected.api || state.response.api !== expected.api) return invalidReplay("assistant belongs to another connection scope");
    } else if (expected !== void 0 && !(expected.credentialGeneration === 0 && expected.legacyRoute === source.provider && state.response.api === expected.api)) {
      return invalidReplay("assistant has no matching connection scope");
    }
  }
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
function toPiAssistant(message, onDegrade, target) {
  const source = message.source;
  if (source.replayState === void 0) return foreignAssistant(message);
  try {
    return replayedAssistant(message, source, source.replayState, target);
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
  connectionMigrationVersion: z.natural().default(0).volatile(),
  trustedEndpointOrigins: z.array(z.string()).default([]).volatile(),
  connections: z.dict(z.object({
    integrationId: z.string().required(),
    serviceId: z.string().required(),
    routeId: z.string().required(),
    displayName: z.string().required(),
    authMethod: z.union(["oauth", "api-key"]).required(),
    credentialRecordId: z.string().required(),
    credentialGeneration: z.natural().default(0),
    credentialRef: z.string().role("credential-ref"),
    headerRefs: z.dict(z.string().role("credential-ref")),
    enabled: z.boolean().default(true),
    legacyRoute: z.boolean(),
    integrationLabel: z.string(),
    serviceLabel: z.string(),
    profile,
    museCode: z.object({ contributorMode: z.boolean(), modelId: z.string() })
  })).default({}).volatile(),
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
  const text2 = [options.system];
  let end = 0;
  for (const message of options.messages) {
    if (message.role !== "system") break;
    text2.push(flattenText(message));
    end++;
  }
  const systemPrompt = text2.filter(Boolean).join("\n\n");
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
function appendAssistant(message, messages, toolNames, onReplayDegrade, replayTarget) {
  const assistant = toPiAssistant(message, onReplayDegrade, replayTarget);
  for (const block of assistant.content) {
    if (block.type === "toolCall") toolNames.set(brandString(block.id), block.name);
  }
  messages.push(assistant);
}
function appendSharedHistory(message, options, messages, toolNames, onReplayDegrade, replayTarget) {
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
    appendAssistant(message, messages, toolNames, onReplayDegrade, replayTarget);
    return true;
  }
  return false;
}
function textOnlyContext(options, onReplayDegrade, replayTarget) {
  assertSupportedHistory(options.messages);
  const split = splitSystemPrompt(options);
  const toolNames = /* @__PURE__ */ new Map();
  const messages = [];
  for (const message of split.messages) {
    if (contentHasImage(message.content)) {
      throw new LlmError2("pi-ai image conversion requires the durable attachment service", "UNSUPPORTED_CONTENT");
    }
    if (appendSharedHistory(message, options, messages, toolNames, onReplayDegrade, replayTarget)) continue;
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
function toPiContext(options, images, onReplayDegrade, replayTarget) {
  return images === void 0 ? textOnlyContext(options, onReplayDegrade, replayTarget) : toPiContextWithImages(options, images, onReplayDegrade, replayTarget);
}
async function toPiContextWithImages(options, images, onReplayDegrade, replayTarget) {
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
    if (appendSharedHistory(message, options, messages, toolNames, onReplayDegrade, replayTarget)) continue;
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
      const text2 = message.errorMessage ?? "pi-ai stream error";
      return { kind: "error", failure: { message: text2, code: classifyPiAiError(text2) } };
    }
  }
}
async function* toStreamChunks(events, contextWindow, callerSignal, requestedModel, replayScope, requestedProvider) {
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
          replayState: toPiReplayState(event.message, requestedModel, replayScope, requestedProvider)
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
var isolatedAuth = {
  authContext: { env: async () => void 0, fileExists: async () => false },
  credentials: {
    read: async () => void 0,
    list: async () => [],
    modify: async () => {
      throw new LlmError4("Connection credential store is unavailable", "MISSING_CREDENTIAL");
    },
    delete: async () => {
    }
  }
};
function requestAuth(auth, profile2, signal) {
  if (profile2.connectionId === void 0 || auth.credentials === void 0) return auth;
  const serviceId = profile2.serviceId;
  let credential = auth.credentials.read(serviceId, { signal }).then((value) => {
    if (value === void 0 || (profile2.authMethod === "oauth" ? value.type !== "oauth" : value.type !== "api_key")) return void 0;
    return structuredClone(value);
  });
  void credential.catch(() => {
  });
  return {
    authContext: isolatedAuth.authContext,
    credentials: {
      read: async (provider) => provider === serviceId ? await credential : void 0,
      list: async () => [],
      modify: async (provider, mutate, options) => {
        if (provider !== serviceId) throw new LlmError4("Credential provider does not match connection", "MISSING_CREDENTIAL");
        const next = await auth.credentials.modify(provider, mutate, options);
        credential = Promise.resolve(next === void 0 ? void 0 : structuredClone(next));
        return next;
      },
      delete: async () => {
        throw new LlmError4("Request credential snapshots are read-only", "MISSING_CREDENTIAL");
      }
    }
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
    const models = /* @__PURE__ */ new Map();
    const auth = /* @__PURE__ */ new Map();
    for (const [route, profile2] of profiles) {
      const binding = profile2.connectionId === void 0 ? this.config.auth ?? isolatedAuth : this.config.authForProfile?.(profile2) ?? isolatedAuth;
      const collection = createModels(binding);
      if (profile2.piProvider !== void 0) collection.setProvider(profile2.piProvider);
      models.set(route, collection);
      auth.set(route, binding);
    }
    this.snapshot = { profiles, models, auth };
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
    const profile2 = this.current().profiles.get(provider);
    return {
      id: provider,
      name: profile2?.connectionId === void 0 ? profile2?.displayName ?? provider : [profile2.integrationLabel ?? profile2.integrationId, profile2.serviceLabel ?? profile2.serviceId, profile2.displayName].filter(Boolean).join(" / ")
    };
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
      const scopedAuth = requestAuth(snapshot.auth.get(options.provider), profile2, options.signal);
      let models = snapshot.models.get(options.provider);
      if (profile2.connectionId !== void 0) {
        const collection = createModels(scopedAuth);
        collection.setProvider(profile2.piProvider);
        models = collection;
      }
      const replayScope = profile2.replayScope === void 0 ? void 0 : {
        ...profile2.replayScope,
        endpoint: model.baseUrl,
        api: model.api
      };
      const replayTarget = { provider: options.provider, serviceId: model.provider, ...replayScope === void 0 ? {} : { scope: replayScope } };
      const updates = conversationUpdates(model);
      const tools = options.tools ?? [];
      const needsPlaceholder = model.api === "anthropic-messages" && updates.toolUpdate === "in-history" && tools.every((tool) => tool.deferLoading === true) && options.messages.some((message) => message.role === "developer" && message.content.some((block) => block.type === "tool-addition" || block.type === "tool-removal"));
      const request = needsPlaceholder ? { ...options, tools: [ANTHROPIC_TOOL_UPDATE_PLACEHOLDER, ...tools] } : options;
      const reasoning = resolveReasoningLevel(
        model,
        options.reasoningEffort ?? profile2.reasoning
      );
      const [explicitKey, accountAuthorization, storedHeaders] = await Promise.all([
        this.config.resolveApiKey(options.provider, profile2),
        this.config.authorizeModel?.(options.provider, model, profile2),
        this.config.resolveHeaders?.(profile2)
      ]);
      const apiKey = accountAuthorization?.apiKey ?? explicitKey;
      if (profile2.connectionId !== void 0) {
        const resolvedAuth = await models.getAuth(model, { apiKey, signal: options.signal });
        if (resolvedAuth === void 0) throw new LlmError4(`Connection "${profile2.connectionId}" has no usable credential`, "MISSING_CREDENTIAL");
        if (replayScope !== void 0) replayScope.endpoint = resolvedAuth.auth.baseUrl ?? model.baseUrl;
        const collection = createModels(isolatedAuth);
        collection.setProvider({ ...profile2.piProvider, auth: {
          apiKey: { name: profile2.displayName, resolve: async () => resolvedAuth }
        } });
        models = collection;
      }
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
        const context = attachments === void 0 ? toPiContext(request, void 0, onReplayDegrade, replayTarget) : await toPiContext({ ...request, signal: watchdog.signal }, {
          attachments,
          resolveImageAccess: (ref) => this.config.resolveImageAccess?.(attachments, ref),
          maxRequestImageBytes: profile2.maxRequestImageBytes,
          requestImagePolicy: {
            maxPixels: profile2.requestImagePixelBudget,
            maxBytes: profile2.requestImageMaxBytes
          }
        }, onReplayDegrade, replayTarget);
        const streamOptions = {
          ...profileOptions(profile2, reasoning, apiKey),
          ...options.temperature === void 0 ? {} : { temperature: options.temperature },
          ...options.maxTokens === void 0 ? {} : { maxTokens: options.maxTokens },
          ...options.sessionId === void 0 ? {} : { sessionId: replayScope === void 0 ? String(options.sessionId) : createHash3("sha256").update(JSON.stringify([
            replayScope.connectionId,
            replayScope.credentialGeneration,
            replayScope.endpoint,
            replayScope.api,
            String(options.sessionId)
          ])).digest("hex") },
          signal: watchdog.signal,
          // Profile headers are deployment-owned; attribution names are
          // Harness-owned and therefore win collisions.
          headers: { ...requestHeaders({ ...profile2.headers, ...storedHeaders }), ...accountAuthorization?.headers }
        };
        const events = choice.serviceTier !== void 0 ? streamWithTier(models, model, context, streamOptions, choice.serviceTier) : models.streamSimple(model, context, streamOptions);
        const iterator = toStreamChunks(events, model.contextWindow, options.signal, options.model, replayScope, options.provider)[Symbol.asyncIterator]();
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
  credentialKey as credentialKey2,
  credentialKeyId,
  credentialKeyScope,
  credentialRef as credentialRef2,
  isCredentialKeySegment,
  isCredentialRefName
} from "@deepseek-ai/dsh-credentials";
import { launchEnvironmentOf } from "@deepseek-ai/dsh-launch-environment";
import { LlmError as LlmError5 } from "@deepseek-ai/dsh-llm";
var RECORD_SCOPE2 = "llm-pi-ai";
function recordKeyFor(recordId) {
  return credentialKey2(RECORD_SCOPE2, recordId);
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
function assertCurrent(binding) {
  if (binding.isCurrent?.() === false) {
    throw new LlmError5("This connection changed while authentication was in progress.", "STALE_CONNECTION");
  }
}
function scopedCredentialStore(ctx, binding) {
  binding = { ...binding };
  if (!isCredentialKeySegment(binding.credentialRecordId) || !binding.serviceId || !binding.connectionId) {
    throw new LlmError5("This connection cannot address its credential record.", "UNSTORABLE_PROVIDER_ID");
  }
  const key = recordKeyFor(binding.credentialRecordId);
  const credentialOf = (record) => {
    const credential = toPiCredential(record);
    return credential === void 0 ? void 0 : structuredClone(credential);
  };
  const assertProvider = (providerId) => {
    if (providerId !== binding.serviceId) {
      throw new LlmError5("This credential store belongs to another connection.", "AUTH_CONNECTION_MISMATCH");
    }
    assertCurrent(binding);
  };
  const read = async (providerId, options) => {
    if (providerId !== binding.serviceId) return void 0;
    options?.signal?.throwIfAborted();
    assertCurrent(binding);
    const record = await ctx.get("credentials")?.readRecord(key);
    assertCurrent(binding);
    options?.signal?.throwIfAborted();
    return credentialOf(record);
  };
  return {
    read,
    async list(options) {
      const credential = await read(binding.serviceId, options);
      return credential === void 0 ? [] : [{ providerId: binding.serviceId, type: credential.type }];
    },
    async modify(providerId, mutate, options) {
      assertProvider(providerId);
      options?.signal?.throwIfAborted();
      const stored = await writableStore(ctx).modifyRecord(key, async (current) => {
        assertProvider(providerId);
        options?.signal?.throwIfAborted();
        const next = await mutate(credentialOf(current));
        assertProvider(providerId);
        options?.signal?.throwIfAborted();
        return next === void 0 ? void 0 : toRecord(next);
      });
      assertCurrent(binding);
      return credentialOf(stored);
    },
    async delete(providerId, options) {
      assertProvider(providerId);
      options?.signal?.throwIfAborted();
      await writableStore(ctx).deleteRecord(key);
      assertCurrent(binding);
    }
  };
}
function credentialStoreFrom(ctx, binding) {
  if (binding !== void 0) return scopedCredentialStore(ctx, binding);
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
        if (credentialKeyScope(entry.key) !== RECORD_SCOPE2) continue;
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
function connectionAuthFrom(ctx, binding) {
  return {
    credentials: credentialStoreFrom(ctx, binding),
    authContext: {
      async env() {
        assertCurrent(binding);
        return void 0;
      },
      async fileExists() {
        assertCurrent(binding);
        return false;
      }
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

// src/runtime/connections.ts
function resolveConnectionProfiles(connections, catalogs, validation = "strict") {
  const routes = /* @__PURE__ */ new Map();
  for (const [connectionId2, connection] of Object.entries(connections ?? {})) {
    if (connection.integrationId !== "pi") continue;
    if (!connectionId2 || !connection.serviceId || !connection.routeId || !connection.credentialRecordId) {
      throw new Error("llm-pi-ai: connection identity must be non-empty");
    }
    if (!Number.isSafeInteger(connection.credentialGeneration) || connection.credentialGeneration < 0) {
      throw new Error(`llm-pi-ai: connection "${connectionId2}" has an invalid credential generation`);
    }
    if (routes.has(connection.routeId)) throw new Error(`llm-pi-ai: duplicate connection route "${connection.routeId}"`);
    const installed = catalogs?.(connection.serviceId, connectionId2);
    const defaults = installed ?? catalogModels(connection.serviceId);
    const native = catalogModels(connection.serviceId);
    const unverified = /* @__PURE__ */ new Set();
    let source = connection.profile;
    if (!connection.legacyRoute && connection.routeId !== connection.serviceId && source.baseURL !== void 0) {
      const endpoint = source.baseURL.replace(/\/+$/, "");
      for (const id of /* @__PURE__ */ new Set([...defaults.keys(), ...source.models?.map((model2) => model2.id) ?? []])) {
        const baseline = native.get(id)?.baseUrl ?? catalogProvider(connection.serviceId)?.baseUrl;
        if (baseline === void 0 || endpoint !== baseline.replace(/\/+$/, "")) unverified.add(id);
      }
      if (unverified.size && !source.models?.length) {
        const overrides = { ...source.modelOverrides };
        for (const id of unverified) {
          const declared = overrides[id];
          overrides[id] = {
            ...declared,
            reasoningEfforts: declared?.reasoningEfforts ?? false,
            input: declared?.input?.length ? [...declared.input] : ["text"]
          };
        }
        source = { ...source, modelOverrides: overrides };
      }
    }
    const profile2 = resolveProfiles({ [connection.serviceId]: {
      ...source,
      displayName: connection.displayName,
      ...connection.credentialRef === void 0 ? {} : { apiKeyEnv: connection.credentialRef }
    } }, validation, () => installed).get(connection.serviceId);
    const model = profile2.piProvider?.getModels()[0];
    routes.set(connection.routeId, {
      ...profile2,
      provider: connection.routeId,
      connectionId: connectionId2,
      integrationId: connection.integrationId,
      serviceId: connection.serviceId,
      credentialRecordId: connection.credentialRecordId,
      credentialGeneration: connection.credentialGeneration,
      authMethod: connection.authMethod,
      ...connection.credentialRef === void 0 ? {} : { credentialRef: connection.credentialRef },
      ...connection.headerRefs === void 0 ? {} : { headerRefs: { ...connection.headerRefs } },
      integrationLabel: connection.integrationLabel ?? (connection.integrationId === "pi" ? "Pi" : connection.integrationId),
      serviceLabel: connection.serviceLabel ?? catalogProvider(connection.serviceId)?.name ?? connection.serviceId,
      modelChoices: profile2.modelChoices.map((choice) => unverified.has(choice.model.id) ? { ...choice, capabilityUnverified: true } : choice),
      replayScope: {
        connectionId: connectionId2,
        credentialGeneration: connection.credentialGeneration,
        endpoint: model?.baseUrl ?? connection.profile.baseURL ?? "",
        api: model?.api ?? connection.profile.api ?? "",
        ...connection.legacyRoute ? { legacyRoute: connection.routeId } : {}
      }
    });
  }
  return routes;
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
  let text2;
  try {
    text2 = await readBounded(response, url);
  } catch (error) {
    if (request.signal?.aborted) {
      throw new LlmError6("model discovery aborted by caller", "ABORTED", { cause: error });
    }
    throw error;
  }
  let body;
  try {
    body = JSON.parse(text2);
  } catch (error) {
    throw new LlmError6(`${url} did not answer with JSON`, "DISCOVERY_FAILED", { cause: error });
  }
  return readListing(body);
}

// src/runtime/login.ts
import { randomUUID as randomUUID5 } from "node:crypto";
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
  const disposers = [];
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
    disposers.push(ctx.authorization.registerFlow({
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
            return { kind: "grant", payload: { deviceId: randomUUID5() } };
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
    }));
  }
  return () => {
    for (const dispose of disposers.splice(0)) dispose();
  };
}
function loginIdentity(connection) {
  return JSON.stringify([
    connection.integrationId,
    connection.serviceId,
    connection.credentialRecordId,
    connection.credentialGeneration,
    connection.authMethod,
    connection.credentialRef,
    connection.profile?.baseURL,
    connection.profile?.api
  ]);
}
function registerConnectionFlows(ctx, connections, onLogin) {
  const registered = /* @__PURE__ */ new Map();
  const profileContext = ctx.get("profileContext");
  let disposed = false;
  const sync = () => {
    if (disposed) return;
    const current = ctx.get("profileContext") === profileContext ? connections() : {};
    for (const [id, flow] of registered) {
      const connection = current[id];
      if (connection === void 0 || loginIdentity(connection) !== flow.identity) {
        flow.dispose();
        registered.delete(id);
      }
    }
    for (const [id, connection] of Object.entries(current)) {
      if (registered.has(id) || connection.integrationId !== "pi") continue;
      const provider = catalogProvider(connection.serviceId);
      const method = loginMethods(provider).find((method2) => method2.id === connection.authMethod);
      if (provider === void 0 || method === void 0 || !isCredentialKeySegment2(connection.credentialRecordId)) continue;
      const identity2 = loginIdentity(connection);
      const isCurrent = () => {
        const current2 = connections()[id];
        return !disposed && ctx.get("profileContext") === profileContext && current2 !== void 0 && loginIdentity(current2) === identity2;
      };
      const flow = {
        key: recordKeyFor(connection.credentialRecordId),
        get label() {
          return connections()[id]?.displayName ?? connection.displayName;
        },
        methods: [method],
        async run(session) {
          if (!isCurrent() || session.method !== connection.authMethod) throw new Error("stale-connection");
          session.signal.throwIfAborted();
          const auth = connectionAuthFrom(ctx, {
            connectionId: id,
            serviceId: connection.serviceId,
            credentialRecordId: connection.credentialRecordId,
            isCurrent: () => isCurrent() && !session.signal.aborted
          });
          const models = createModels(auth);
          models.setProvider(provider);
          const type = connection.authMethod === "oauth" ? "oauth" : "api_key";
          let deviceId;
          if (connection.serviceId === "openai" && type === "oauth") {
            const record = await ctx.credentials.modifyRecord("dsh-pi-login/installation", async (current2) => {
              session.signal.throwIfAborted();
              if (!isCurrent()) throw new Error("stale-connection");
              if (current2?.kind === "grant" && typeof current2.payload?.deviceId === "string") return current2;
              return { kind: "grant", payload: { deviceId: randomUUID5() } };
            });
            deviceId = record?.kind === "grant" ? record.payload.deviceId : void 0;
          }
          await models.login(connection.serviceId, type, {
            signal: session.signal,
            notify: (event) => {
              if (isCurrent() && !session.signal.aborted) relay(event, session);
            },
            prompt: (prompt) => {
              session.signal.throwIfAborted();
              if (!isCurrent()) throw new Error("stale-connection");
              return session.prompt(restate(prompt));
            }
          }, deviceId === void 0 ? void 0 : { getDeviceId: () => deviceId });
          session.signal.throwIfAborted();
          if (!isCurrent()) throw new Error("stale-connection");
          await onLogin?.(id);
        }
      };
      const dispose2 = ctx.authorization.registerFlow(flow);
      registered.set(id, { identity: identity2, dispose: dispose2 });
    }
  };
  const listeners = [
    ctx.on("settings/document-updated", (namespace) => {
      if (namespace === "dsh-pi-login") sync();
    }),
    ctx.on("loader/volatile-update", sync)
  ];
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    for (const unwatch of listeners) unwatch();
    for (const flow of registered.values()) flow.dispose();
    registered.clear();
  };
  ctx.effect(() => dispose);
  sync();
  return { sync, dispose };
}

// src/runtime/index.ts
var NS3 = "dsh-pi-login";
function registrationFacts(profiles) {
  return [...profiles.entries()].map(([provider, profile2]) => ({
    provider,
    displayName: profile2.displayName,
    integrationLabel: profile2.integrationLabel,
    serviceLabel: profile2.serviceLabel,
    retryPolicy: profile2.retryPolicy,
    models: profile2.piProvider === void 0 ? void 0 : profile2.modelChoices.filter((choice) => choice.enabled).map((choice) => ({ id: choice.id, name: choice.name }))
  })).sort((left, right) => left.provider.localeCompare(right.provider));
}
function directoryEntries(profiles, settingsNs, connectionMode = false) {
  const catalog = new Set(catalogProviderIds());
  const entries = /* @__PURE__ */ new Map();
  const declare = (provider, displayName, error) => {
    entries.set(provider, {
      provider,
      displayName,
      settingsNs,
      settingsPath: profiles.get(provider)?.connectionId === void 0 ? ["providers", provider] : ["connections", profiles.get(provider).connectionId, "profile"],
      // Membership of the installed catalog, not of the settings document:
      // narrowing a shipped provider's models stores a profile too, and that
      // route is still one pi-ai knows.
      declared: !catalog.has(provider),
      ...error === void 0 ? {} : { error }
    });
  };
  if (!connectionMode) for (const provider of catalog) declare(provider, provider);
  for (const [provider, profile2] of profiles) declare(provider, profile2.displayName, profile2.catalogError);
  return [...entries.values()];
}
function apply(ctx, config, live) {
  ctx.inject(["settings"], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
  const settingsNs = NS3;
  let lastRaw;
  let lastCatalogRevision;
  let memoized;
  const connections = () => config.connectionMigrationVersion.get() >= 1 ? live?.connections?.() ?? config.connections.get() : void 0;
  const profiles = () => {
    const currentConnections = connections();
    const raw = currentConnections ?? config.providers.get();
    const revision = live?.revision();
    if (raw === lastRaw && revision === lastCatalogRevision && memoized !== void 0) return memoized;
    const next = currentConnections === void 0 ? resolveProfiles(structuredClone(raw), "deferred", live?.catalog) : resolveConnectionProfiles(structuredClone(currentConnections), live?.catalog, "deferred");
    if (currentConnections === void 0) {
      for (const [provider, profile2] of Object.entries(config.providers.get())) if (profile2.enabled === false) next.delete(provider);
    } else {
      for (const connection of Object.values(currentConnections)) if (connection.enabled === false) next.delete(connection.routeId);
    }
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
    if (candidate.connectionMigrationVersion.get() >= 1) {
      const previous = config.connections.get();
      const changed = Object.fromEntries(Object.entries(candidate.connections.get()).filter(([id, entry]) => !deepEqualJson2(entry, previous[id])));
      resolveConnectionProfiles(changed, (serviceId, connectionId2) => {
        const before = previous[connectionId2], after = changed[connectionId2];
        if (before === void 0 || before.serviceId !== after.serviceId || before.credentialRecordId !== after.credentialRecordId || before.credentialGeneration !== after.credentialGeneration || before.profile.baseURL !== after.profile.baseURL || before.profile.api !== after.profile.api) return void 0;
        return live?.catalog(serviceId, connectionId2);
      });
      const routes = Object.values(candidate.connections.get()).map((connection) => connection.routeId);
      if (new Set(routes).size !== routes.length) throw new Error("llm-pi-ai: duplicate connection routes");
    }
    return raw;
  });
  const resolveApiKey = async (provider, profile2) => {
    const ref = profile2.apiKeyEnv;
    if (ref === void 0) return void 0;
    const credentials = ctx.get("credentials");
    const hit = credentials !== void 0 ? (await credentials.resolve(ref))?.value : profile2.connectionId === void 0 ? launchEnvironmentOf2(ctx).get(ref)?.value : void 0;
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
    authForProfile: (profile2) => live?.authForProfile?.(profile2) ?? (profile2.connectionId === void 0 ? auth : connectionAuthFrom(ctx, {
      connectionId: profile2.connectionId,
      serviceId: profile2.serviceId,
      credentialRecordId: profile2.credentialRecordId,
      isCurrent: () => {
        const current = connections()?.[profile2.connectionId];
        return current !== void 0 && current.serviceId === profile2.serviceId && current.credentialRecordId === profile2.credentialRecordId && current.credentialGeneration === profile2.credentialGeneration;
      }
    })),
    resolveHeaders: async (profile2) => {
      const entries = await Promise.all(Object.entries(profile2.headerRefs ?? {}).map(async ([name2, ref]) => {
        const credentials = ctx.get("credentials");
        const value = (await credentials?.resolve(ref))?.value;
        if (!value) throw new LlmError7(`llm-pi-ai: missing credential for header "${name2}"`, "MISSING_CREDENTIAL");
        new Headers([[name2, value]]);
        return [name2, value];
      }));
      return Object.fromEntries(entries);
    },
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
  let authorizedContext;
  let legacyFlows;
  let withdrawLegacyFlows;
  let connectionFlows;
  const syncFlows = () => {
    if (authorizedContext === void 0) return;
    if (connections() !== void 0) {
      withdrawLegacyFlows?.();
      withdrawLegacyFlows = void 0;
      if (legacyFlows !== void 0) {
        void legacyFlows.dispose();
        legacyFlows = void 0;
      }
      connectionFlows ??= registerConnectionFlows(authorizedContext, () => connections() ?? {}, live?.onLogin);
      connectionFlows.sync();
    } else if (legacyFlows === void 0) {
      connectionFlows?.dispose();
      connectionFlows = void 0;
      legacyFlows = authorizedContext.plugin((child) => {
        withdrawLegacyFlows = registerPiAiFlows(child, auth, live?.onLogin);
      });
    }
  };
  ctx.inject(["authorization"], (authorized) => {
    authorizedContext = authorized;
    syncFlows();
  });
  let directory;
  let directoryFacts;
  const ensureDirectory = () => {
    const currentConnections = connections();
    const entries = directoryEntries(currentConnections === void 0 ? profiles() : resolveConnectionProfiles(structuredClone(currentConnections), live?.catalog, "deferred"), settingsNs, currentConnections !== void 0);
    if (deepEqualJson2(entries, directoryFacts)) return;
    if (directory === void 0) {
      if (entries.length === 0) {
        directoryFacts = entries;
        return;
      }
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
    syncFlows();
    ensureRegistrationFacts();
    ensureDirectory();
  });
  ctx.on("loader/volatile-update", () => {
    try {
      syncFlows();
      ensureRegistrationFacts();
      ensureDirectory();
    } catch (error) {
      ctx.logger.error("llm-pi-ai: configuration conflicts with an existing provider route");
      ctx.logger.error(error);
    }
  });
  ctx.on("settings/document-updated", (namespace) => {
    if (namespace !== NS3) return;
    try {
      syncFlows();
      ensureRegistrationFacts();
      ensureDirectory();
    } catch (error) {
      ctx.logger.error("Pi plugin: could not apply model settings");
      ctx.logger.error(error);
    }
  });
  return { syncFlows };
}

// src/account-usage.mjs
import { createHash as createHash4 } from "node:crypto";

// src/provider-cache.mjs
var ProviderReadError = class extends Error {
  constructor(code = "error", retryAfterMs) {
    super(["auth-required", "unsupported", "rate-limited", "error", "aborted", "account-changed"].includes(code) ? code : "error");
    this.code = this.message;
    if (Number.isFinite(retryAfterMs) && retryAfterMs >= 0) this.retryAfterMs = retryAfterMs;
  }
};
function retryAfterMilliseconds(value, now = Date.now()) {
  if (typeof value !== "string" || !value.trim()) return void 0;
  if (/^\d+(?:\.\d+)?$/.test(value.trim())) return Number(value) * 1e3;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed - now) : void 0;
}
var ProviderCache = class {
  constructor({ ttl = 3e5, maxStale = 36e5, timeout = 2e4, now = Date.now } = {}) {
    this.ttl = ttl;
    this.maxStale = maxStale;
    this.timeout = timeout;
    this.now = now;
    this.epoch = 0;
    this.failures = 0;
    this.closed = false;
  }
  peek() {
    const age = this.value === void 0 ? Infinity : this.now() - this.observedAt;
    return {
      value: age <= this.maxStale ? this.value : void 0,
      fresh: age < this.ttl,
      stale: age >= this.ttl,
      observedAt: this.observedAt,
      checkedAt: this.checkedAt,
      retryAt: this.retryAt > this.now() ? this.retryAt : void 0,
      error: this.error
    };
  }
  get(load, { force = false, signal } = {}) {
    if (this.closed || signal?.aborted) return Promise.reject(new ProviderReadError("aborted"));
    if (this.pending) return this.consume(this.pending, signal);
    if (this.retryAt > this.now()) return Promise.reject(new ProviderReadError("rate-limited", this.retryAt - this.now()));
    const cached = this.peek();
    if (!force && cached.fresh && cached.value !== void 0) return Promise.resolve(cached.value);
    const controller = new AbortController(), epoch2 = this.epoch;
    const operation = { controller, consumers: /* @__PURE__ */ new Set() };
    operation.promise = Promise.resolve().then(async () => {
      const deadline = AbortSignal.timeout(this.timeout);
      const requestSignal = AbortSignal.any([controller.signal, deadline]);
      let onAbort;
      const cancelled = new Promise((_, reject) => {
        onAbort = () => reject(new ProviderReadError(controller.signal.aborted ? "aborted" : "error"));
        requestSignal.addEventListener("abort", onAbort, { once: true });
      });
      try {
        const value = await Promise.race([Promise.resolve().then(() => load(requestSignal)), cancelled]);
        if (requestSignal.aborted || this.epoch !== epoch2 || this.closed) throw new ProviderReadError("aborted");
        this.value = value;
        this.observedAt = this.now();
        this.checkedAt = this.observedAt;
        this.error = void 0;
        this.retryAt = void 0;
        this.failures = 0;
        return value;
      } catch (error) {
        const safe = error instanceof ProviderReadError ? error : new ProviderReadError("error");
        if (this.epoch === epoch2 && !this.closed && safe.code !== "aborted") {
          this.checkedAt = this.now();
          this.error = safe.code;
          if (safe.code === "rate-limited") {
            this.failures++;
            this.retryAt = this.now() + (safe.retryAfterMs ?? Math.min(6e4 * 2 ** (this.failures - 1), 36e5));
          }
          if (safe.code === "auth-required" || safe.code === "account-changed") this.value = void 0;
        }
        throw safe;
      } finally {
        requestSignal.removeEventListener("abort", onAbort);
      }
    }).finally(() => {
      if (this.pending === operation) this.pending = void 0;
    });
    this.pending = operation;
    return this.consume(operation, signal);
  }
  consume(operation, signal) {
    const consumer = {};
    operation.consumers.add(consumer);
    if (!signal) {
      operation.promise.then(() => operation.consumers.delete(consumer), () => operation.consumers.delete(consumer));
      return operation.promise;
    }
    return new Promise((resolve2, reject) => {
      const finish = () => {
        signal.removeEventListener("abort", abort);
        operation.consumers.delete(consumer);
      };
      const abort = () => {
        finish();
        reject(new ProviderReadError("aborted"));
        if (operation.consumers.size === 0) operation.controller.abort();
      };
      signal.addEventListener("abort", abort, { once: true });
      if (signal.aborted) return abort();
      operation.promise.then((value) => {
        finish();
        resolve2(value);
      }, (error) => {
        finish();
        reject(error);
      });
    });
  }
  invalidate() {
    this.epoch++;
    this.pending?.controller.abort();
    this.pending = void 0;
    this.value = void 0;
    this.observedAt = void 0;
    this.checkedAt = void 0;
    this.error = void 0;
    this.retryAt = void 0;
    this.failures = 0;
  }
  dispose() {
    this.closed = true;
    this.invalidate();
  }
};

// src/account-usage-providers.mjs
var USAGE_ENDPOINTS = Object.freeze({
  anthropic: "https://api.anthropic.com/api/oauth/usage",
  "openai-codex": "https://chatgpt.com/backend-api/wham/usage",
  "github-copilot": "https://api.github.com/copilot_internal/user",
  "opencode-go": "https://opencode.ai/zen/go/v1/usage",
  meta: "https://api.meta.ai/muse-code/key"
});
var invalid2 = () => {
  throw new ProviderReadError("error");
};
var object = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : invalid2();
var count = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : invalid2();
var optionalBoolean = (value) => value == null ? void 0 : typeof value === "boolean" ? value : invalid2();
var iso = (ms) => Number.isFinite(ms) && Number.isFinite(new Date(ms).getTime()) ? new Date(ms).toISOString() : invalid2();
function calendar(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || iso(Date.parse(`${value}T00:00:00Z`)).slice(0, 10) !== value) invalid2();
  return value;
}
function timestamp(value) {
  if (value == null) return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) invalid2();
  calendar(value.slice(0, 10));
  if (Number(value.slice(11, 13)) > 23 || Number(value.slice(14, 16)) > 59 || Number(value.slice(17, 19)) > 59) invalid2();
  return iso(Date.parse(value));
}
function epoch(value, unknownNonpositive = false) {
  if (value == null) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) invalid2();
  if (unknownNonpositive && (value <= 0 || !Number.isFinite(new Date(value * 1e3).getTime()))) return null;
  return iso(count(value) * 1e3);
}
var window = (id, scope2, usedPercent, resetsAt, windowSeconds) => ({ id, scope: scope2, usedPercent: count(usedPercent), resetsAt, windowSeconds });
function parseClaudeUsage(payload) {
  const data = object(payload);
  const buckets = [["five_hour", "account", 18e3], ["seven_day", "account", 604800], ["seven_day_sonnet", "sonnet", 604800], ["seven_day_opus", "opus", 604800]];
  if (!buckets.some(([id]) => Object.hasOwn(data, id))) invalid2();
  return buckets.filter(([id]) => data[id] != null).map(([id, scope2, seconds]) => {
    const bucket = object(data[id]);
    return window(id, scope2, bucket.utilization, timestamp(bucket.resets_at), seconds);
  });
}
function parseCodexUsage(payload, observedAt = Date.now()) {
  const data = object(payload);
  if (!Object.hasOwn(data, "rate_limit")) invalid2();
  if (data.rate_limit === null) return [];
  const limits = object(data.rate_limit);
  if (!["primary_window", "secondary_window"].some((id) => Object.hasOwn(limits, id))) invalid2();
  return ["primary_window", "secondary_window"].filter((id) => limits[id] != null).map((id) => {
    const bucket = object(limits[id]);
    const seconds = bucket.limit_window_seconds == null ? null : count(bucket.limit_window_seconds);
    if (seconds === 0) invalid2();
    const reset = bucket.reset_at != null ? epoch(bucket.reset_at) : bucket.reset_after_seconds != null ? iso(observedAt + count(bucket.reset_after_seconds) * 1e3) : null;
    return window(id, "account", bucket.used_percent, reset, seconds);
  });
}
function parseOpenCodeUsage(payload) {
  const usage = object(object(payload).usage);
  return [["rolling", 18e3], ["weekly", 604800], ["monthly", null]].map(([id, seconds]) => {
    const bucket = object(usage[id]), percent = count(bucket.percent);
    if (!["ok", "rate-limited"].includes(bucket.status) || percent > 100 || bucket.status === "rate-limited" !== (percent === 100)) invalid2();
    const reset = timestamp(bucket.resetsAt);
    if (reset === null) invalid2();
    return window(id, "account", percent, reset, seconds);
  });
}
function parseMuseUsage(payload) {
  const data = object(payload);
  if (optionalBoolean(data.require_payment) === true || optionalBoolean(data.is_subs_active) !== true) throw new ProviderReadError("auth-required");
  if (data.subs_usage == null) return [];
  const usage = object(data.subs_usage), primary = object(usage.window), weekly = object(usage.weekly);
  const seconds = count(primary.window_duration_mins) * 60;
  if (!Number.isSafeInteger(seconds) || seconds <= 0) invalid2();
  return [window("window", "account", primary.used_percent, epoch(primary.resets_at, true), seconds), window("weekly", "account", weekly.used_percent, epoch(weekly.resets_at, true), 604800)];
}
function copilotReset(data, bucket) {
  if (bucket.quota_reset_at != null && bucket.quota_reset_at !== 0) return { resetsAt: epoch(bucket.quota_reset_at, true) };
  const value = data.quota_reset_date_utc ?? data.quota_reset_date ?? data.limited_user_reset_date;
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? { resetsAt: null, resetsOn: calendar(value) } : { resetsAt: timestamp(value) };
}
function parseCopilotUsage(payload) {
  const data = object(payload), credits = optionalBoolean(data.token_based_billing) === true;
  if (!Object.hasOwn(data, "quota_snapshots")) invalid2();
  if (data.quota_snapshots === null) return [];
  const buckets = object(data.quota_snapshots);
  const ids = data.copilot_plan === "free" || data.access_type_sku === "free_limited_copilot" ? ["chat"] : ["premium_interactions", "chat"];
  for (const id of ids) {
    if (buckets[id] == null) continue;
    const bucket = object(buckets[id]), unlimited = optionalBoolean(bucket.unlimited);
    if (unlimited === void 0) invalid2();
    let total = bucket.entitlement;
    if (total == null || unlimited && (total === -1 || total === "-1")) total = null;
    else {
      if (typeof total === "string") {
        if (!/^\d+(?:\.\d+)?$/.test(total)) invalid2();
        total = Number(total);
      }
      total = count(total);
      if (total > Number.MAX_SAFE_INTEGER) invalid2();
    }
    if (!unlimited && total === 0) continue;
    const result = { id, scope: "account", usedPercent: null, ...copilotReset(data, bucket), windowSeconds: null };
    const unit = credits ? "credits" : "requests";
    if (unlimited) {
      result.quotaState = optionalBoolean(bucket.has_quota) === false && optionalBoolean(bucket.overage_permitted) !== true ? "unavailable" : "unlimited";
      if (credits && bucket.credits_used != null) result.quota = { used: count(bucket.credits_used), total: null, remaining: null, unit, estimated: false };
    } else {
      const remainingPercent = count(bucket.percent_remaining);
      if (remainingPercent > 100) invalid2();
      result.usedPercent = 100 - remainingPercent;
      const remaining = bucket.quota_remaining == null ? null : count(bucket.quota_remaining);
      if (total !== null) result.quota = { used: remaining === null ? total * result.usedPercent / 100 : Math.max(0, total - remaining), total, remaining, unit, estimated: remaining === null };
    }
    return [result];
  }
  return [];
}
function codexAccountId(access2) {
  try {
    const parts = access2.split(".");
    if (parts.length !== 3 || !/^[\w-]+$/.test(parts[1])) throw 0;
    const auth = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"))["https://api.openai.com/auth"];
    if (typeof auth?.chatgpt_account_id !== "string" || !/^[\x21-\x7e]{1,512}$/.test(auth.chatgpt_account_id)) throw 0;
    return auth.chatgpt_account_id;
  } catch {
    throw new ProviderReadError("auth-required");
  }
}
async function readProviderJson(response, { now = Date.now(), maxBytes = 262144 } = {}) {
  if (!response.ok) {
    await response.body?.cancel().catch(() => {
    });
    throw new ProviderReadError(response.status === 401 || response.status === 403 ? "auth-required" : response.status === 429 ? "rate-limited" : "error", response.status === 429 ? retryAfterMilliseconds(response.headers.get("retry-after"), now) : void 0);
  }
  if (Number(response.headers.get("content-length")) > maxBytes) {
    await response.body?.cancel().catch(() => {
    });
    invalid2();
  }
  const reader = response.body?.getReader();
  if (!reader) invalid2();
  const chunks = [];
  let length = 0;
  try {
    for (; ; ) {
      const next = await reader.read();
      if (next.done) break;
      length += next.value.byteLength;
      if (length > maxBytes) invalid2();
      chunks.push(next.value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return object(JSON.parse(new TextDecoder().decode(bytes)));
  } catch (error) {
    throw error instanceof ProviderReadError ? error : new ProviderReadError("error");
  } finally {
    await reader.cancel().catch(() => {
    });
  }
}
function standardProfile(connection, allowedBases) {
  const profile2 = connection.profile ?? {};
  if (connection.credentialRef || profile2.apiKeyEnv || [...Object.keys(profile2.headers ?? {}), ...Object.keys(connection.headerRefs ?? {})].some((key) => key.toLowerCase() === "authorization")) throw new ProviderReadError("unsupported");
  if (profile2.baseURL !== void 0 && !allowedBases.includes(profile2.baseURL.replace(/\/+$/, ""))) throw new ProviderReadError("unsupported");
}
var token = (value) => typeof value === "string" && /^[\x21-\x7e]+$/.test(value) && !value.startsWith("!") ? value : (() => {
  throw new ProviderReadError("auth-required");
})();
function createPiUsageProviders({ fetch: request = (...args) => globalThis.fetch(...args), now = Date.now, metaSession } = {}) {
  const definitions = {
    anthropic: { bases: ["https://api.anthropic.com"], parser: parseClaudeUsage, refreshAccess: true },
    "openai-codex": { bases: ["https://chatgpt.com/backend-api"], parser: parseCodexUsage, refreshAccess: true },
    "github-copilot": { bases: ["https://api.individual.githubcopilot.com", "https://api.business.githubcopilot.com", "https://api.enterprise.githubcopilot.com"], parser: parseCopilotUsage },
    "opencode-go": { bases: ["https://opencode.ai/zen/go", "https://opencode.ai/zen/go/v1"], parser: parseOpenCodeUsage, apiKey: true }
  };
  const providers = Object.fromEntries(Object.entries(definitions).map(([id, definition]) => [id, {
    source: "internal-http",
    refreshAccess: definition.refreshAccess === true,
    validate: (connection) => standardProfile(connection, definition.bases),
    async read({ connection, credential, signal }) {
      standardProfile(connection, definition.bases);
      let headers = { accept: "application/json" };
      if (definition.apiKey) {
        if (credential?.type !== "api_key" || credential.env || connection.authMethod !== "api-key") throw new ProviderReadError("unsupported");
        headers.authorization = `Bearer ${token(credential.key)}`;
      } else {
        if (credential?.type !== "oauth" || connection.authMethod !== "oauth") throw new ProviderReadError(credential ? "unsupported" : "auth-required");
        if (id === "github-copilot") {
          if (credential.enterpriseUrl !== void 0 && credential.enterpriseUrl !== null && credential.enterpriseUrl !== "") throw new ProviderReadError("unsupported");
          headers.authorization = `token ${token(credential.refresh)}`;
          headers["x-github-api-version"] = "2025-04-01";
        } else {
          headers.authorization = `Bearer ${token(credential.access)}`;
          if (id === "anthropic") headers["anthropic-beta"] = "oauth-2025-04-20";
          else headers["chatgpt-account-id"] = codexAccountId(credential.access);
        }
      }
      const body = await readProviderJson(await request(USAGE_ENDPOINTS[id], { method: "GET", redirect: "error", signal, headers }), { now: now() });
      const observedAt = now();
      return { source: "internal-http", sourceObservedAt: iso(observedAt), windows: definition.parser(body, observedAt) };
    }
  }]));
  if (metaSession) providers.meta = {
    source: "internal-http",
    validate: (connection) => standardProfile(connection, ["https://api.meta.ai/v1"]),
    read: ({ connection, signal, force }) => metaSession(connection).usage({ signal, force })
  };
  return providers;
}

// src/account-usage.mjs
var statuses = /* @__PURE__ */ new Set(["available", "unobserved", "unsupported", "auth-required", "stale", "rate-limited", "error"]);
var label2 = (value) => typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/.test(value) ? value : void 0;
var instant = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) return void 0;
  const calendar2 = /* @__PURE__ */ new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(calendar2.getTime()) || calendar2.toISOString().slice(0, 10) !== value.slice(0, 10)) return void 0;
  return new Date(value).toISOString();
};
var number = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
var iso2 = (value) => Number.isFinite(value) ? new Date(value).toISOString() : void 0;
function normalizeUsageSnapshot(raw = {}) {
  if (!raw || typeof raw !== "object") throw new ProviderReadError("error");
  if (!Array.isArray(raw.windows) || raw.windows.length > 50) throw new ProviderReadError("error");
  const seen = /* @__PURE__ */ new Set();
  const windows = raw.windows.map((row) => {
    const id = label2(row?.id), scope2 = label2(row?.scope ?? "account");
    if (!id || !scope2 || seen.has(`${id}:${scope2}`) || row.usedPercent !== null && number(row.usedPercent) === void 0) throw new ProviderReadError("error");
    seen.add(`${id}:${scope2}`);
    const windowSeconds = row.windowSeconds == null ? null : number(row.windowSeconds);
    if (windowSeconds === void 0 || windowSeconds === 0) throw new ProviderReadError("error");
    const result = { id, scope: scope2, usedPercent: row.usedPercent, resetsAt: instant(row.resetsAt) ?? null, windowSeconds };
    if (row.resetsAt != null && result.resetsAt === null) throw new ProviderReadError("error");
    if (row.resetsOn !== void 0) {
      if (result.resetsAt !== null || typeof row.resetsOn !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(row.resetsOn) || !Number.isFinite(Date.parse(`${row.resetsOn}T00:00:00Z`)) || (/* @__PURE__ */ new Date(`${row.resetsOn}T00:00:00Z`)).toISOString().slice(0, 10) !== row.resetsOn) throw new ProviderReadError("error");
      result.resetsOn = row.resetsOn;
    }
    if (["unlimited", "unavailable", "unallocated"].includes(row.quotaState)) result.quotaState = row.quotaState;
    if (row.quota) {
      const quota = row.quota;
      if (!["credits", "requests", "tokens", "USD"].includes(quota.unit)) throw new ProviderReadError("error");
      result.quota = { unit: quota.unit, estimated: quota.estimated === true };
      for (const field of ["used", "total", "remaining"]) {
        if (quota[field] != null && number(quota[field]) === void 0) throw new ProviderReadError("error");
        result.quota[field] = quota[field] ?? null;
      }
    }
    return result;
  });
  if (raw.source !== void 0 && !["internal-http", "last-observed"].includes(raw.source)) throw new ProviderReadError("error");
  const source = raw.source === "last-observed" ? "last-observed" : "internal-http";
  const sourceObservedAt = instant(raw.sourceObservedAt);
  if (raw.sourceObservedAt != null && !sourceObservedAt) throw new ProviderReadError("error");
  if (windows.length && !sourceObservedAt) throw new ProviderReadError("error");
  return { source, sourceObservedAt, status: statuses.has(raw.status) ? raw.status : sourceObservedAt ? "available" : "unobserved", windows };
}
function fingerprint(connection, credential) {
  if (!credential) return "absent";
  let identity2;
  if (credential.type === "oauth" && connection.serviceId === "openai-codex") {
    try {
      identity2 = codexAccountId(credential.access);
    } catch {
      identity2 = credential.refresh;
    }
  } else identity2 = credential.type === "oauth" ? credential.refresh : credential.key ?? JSON.stringify(credential.env ?? {});
  return createHash4("sha256").update(`${credential.type}:${identity2 ?? ""}`).digest("hex");
}
var scope = (connection) => JSON.stringify([connection.profileKey, connection.integrationId, connection.serviceId, connection.connectionId, connection.credentialGeneration, connection.authMethod, connection.credentialRecordId, connection.credentialRef, connection.profile?.baseURL, connection.profile?.api, Object.keys(connection.headerRefs ?? {}).some((key) => key.toLowerCase() === "authorization")]);
var publicIdentity = (connection) => ({ integrationId: connection.integrationId, serviceId: connection.serviceId, connectionId: connection.connectionId });
var AccountUsageManager = class {
  constructor({ providers = {}, credentials, now = Date.now, ttl = 3e5, maxStale = 36e5, timeout = 2e4 } = {}) {
    this.providers = new Map(Object.entries(providers));
    this.credentials = credentials;
    this.now = now;
    this.cacheOptions = { now, ttl, maxStale, timeout };
    this.entries = /* @__PURE__ */ new Map();
    this.closed = false;
  }
  provider(connection) {
    return this.providers.get(`${connection.integrationId}/${connection.serviceId}`) ?? (connection.integrationId === "pi" ? this.providers.get(connection.serviceId) : void 0);
  }
  entry(connection) {
    const key = scope(connection), existing = this.entries.get(connection.connectionId);
    if (existing?.key === key) return existing;
    existing?.cache.dispose();
    const provider = this.provider(connection);
    const entry = { key, provider, cache: new ProviderCache({ ...this.cacheOptions, ...provider?.cache }) };
    this.entries.set(connection.connectionId, entry);
    return entry;
  }
  state(connection) {
    const entry = this.entry(connection), view = entry.cache.peek();
    const base = { ...publicIdentity(connection), source: entry.provider?.source === "last-observed" ? "last-observed" : "internal-http", checkedAt: iso2(view.checkedAt), status: entry.provider?.read ? "unobserved" : "unsupported", windows: [] };
    if (view.retryAt) base.retryAt = iso2(view.retryAt);
    if (view.value) {
      Object.assign(base, view.value);
      if (view.stale || view.error || base.sourceObservedAt && this.now() - Date.parse(base.sourceObservedAt) >= entry.cache.ttl) base.status = "stale";
      if (base.sourceObservedAt && this.now() - Date.parse(base.sourceObservedAt) > entry.cache.maxStale) {
        base.windows = [];
        base.status = view.error ?? "unobserved";
      }
    } else if (view.error) base.status = view.error === "account-changed" ? "auth-required" : view.error;
    return structuredClone(base);
  }
  async get(connection, { force = false, signal } = {}) {
    const entry = this.entry(connection);
    if (this.closed) return { ...publicIdentity(connection), source: "internal-http", status: "error", windows: [] };
    if (!entry.provider?.read) return this.state(connection);
    const deadline = AbortSignal.timeout(entry.cache.timeout);
    const consumerSignal = signal ? AbortSignal.any([signal, deadline]) : deadline;
    const withinDeadline = (operation) => new Promise((resolve2, reject) => {
      const abort = () => reject(new ProviderReadError(signal?.aborted ? "aborted" : "error"));
      if (consumerSignal.aborted) return abort();
      consumerSignal.addEventListener("abort", abort, { once: true });
      Promise.resolve().then(operation).then(resolve2, reject).finally(() => consumerSignal.removeEventListener("abort", abort));
    });
    try {
      await withinDeadline(() => entry.provider.validate?.(connection));
      let credential;
      if (entry.provider.requiresCredentials !== false) {
        credential = await withinDeadline(() => this.credentials?.read(connection));
        const identity2 = fingerprint(connection, credential);
        if (entry.principal !== void 0 && entry.principal !== identity2 && !entry.refreshing) entry.cache.invalidate();
        if (!entry.refreshing) entry.principal = identity2;
      }
      await entry.cache.get(async (requestSignal) => {
        let effective = credential;
        if (entry.provider.refreshAccess && effective?.type === "oauth" && (!effective.access || !Number.isFinite(effective.expires) || effective.expires <= this.now())) {
          if (!this.credentials?.refresh) throw new ProviderReadError("auth-required");
          entry.refreshing = true;
          try {
            effective = await this.credentials.refresh(connection, effective, requestSignal);
            entry.principal = fingerprint(connection, effective);
          } catch (error) {
            throw error instanceof ProviderReadError ? error : new ProviderReadError("auth-required");
          } finally {
            entry.refreshing = false;
          }
        }
        const raw = await entry.provider.read({ connection, credential: effective, signal: requestSignal, force });
        if (entry.provider.requiresCredentials !== false) {
          const current = await this.credentials?.read(connection);
          if (fingerprint(connection, current) !== fingerprint(connection, effective)) throw new ProviderReadError("account-changed");
        }
        return normalizeUsageSnapshot(raw);
      }, { force, signal: consumerSignal });
      return this.state(connection);
    } catch (error) {
      const code = error instanceof ProviderReadError ? error.code === "aborted" && deadline.aborted && !signal?.aborted ? "error" : error.code : "error";
      if (code === "aborted") throw new ProviderReadError("aborted");
      if (code === "unsupported" || code === "auth-required" || code === "account-changed") {
        entry.cache.value = void 0;
        entry.cache.error = code === "account-changed" ? "auth-required" : code;
      } else if (!entry.cache.error) entry.cache.error = code;
      entry.cache.checkedAt = this.now();
      return this.state(connection);
    }
  }
  invalidate(connectionId2) {
    const entry = this.entries.get(connectionId2);
    entry?.cache.dispose();
    this.entries.delete(connectionId2);
  }
  dispose() {
    this.closed = true;
    for (const { cache } of this.entries.values()) cache.dispose();
    this.entries.clear();
  }
};

// src/muse-code-host.mjs
import { createHash as createHash6 } from "node:crypto";
import { mkdir as mkdir2, mkdtemp as mkdtemp2, writeFile as writeFile2, readFile as readFile2, lstat as lstat2, rm } from "node:fs/promises";
import { accessSync, constants } from "node:fs";
import { homedir as homedir2 } from "node:os";
import { join as join2, isAbsolute, delimiter } from "node:path";

// src/muse-code-observations.mjs
var EFFORTS = /* @__PURE__ */ new Set(["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"]);
var object2 = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var invalid3 = () => {
  throw new MuseCodeError("muse-code-observation-invalid");
};
var identifier = (value) => typeof value === "string" && value.length > 0 && value.length <= 200 && !/[\u0000-\u001f\u007f]/.test(value);
var label3 = (value) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 200) : invalid3();
var positive = (value) => Number.isSafeInteger(value) && value > 0;
var nonnegative = (value) => Number.isSafeInteger(value) && value >= 0;
var timestamp2 = (value) => nonnegative(value) && value <= 864e13;
var iso3 = (value) => timestamp2(value) ? new Date(value).toISOString() : invalid3();
function identity(binding) {
  if (!object2(binding) || !identifier(binding.connectionId) || !identifier(binding.routeId)) invalid3();
  return {
    integrationId: MUSE_CODE_INTEGRATION_ID,
    serviceId: MUSE_CODE_SERVICE_ID,
    connectionId: binding.connectionId
  };
}
function normalizeMuseCodeUsage(usage, binding, checkedAt = Date.now()) {
  const attribution = identity(binding);
  const checked = iso3(checkedAt);
  if (usage === void 0) return {
    ...attribution,
    source: "last-observed",
    status: "unobserved",
    checkedAt: checked,
    windows: []
  };
  if (!object2(usage) || !identifier(usage.tier) || !timestamp2(usage.observedAtMs) || !object2(usage.weekly) || !object2(usage.window) || !nonnegative(usage.weekly.usedPercent) || !timestamp2(usage.weekly.resetsAtMs) || !nonnegative(usage.window.usedPercent) || !timestamp2(usage.window.resetsAtMs) || !positive(usage.window.windowDurationMins) || !Number.isSafeInteger(usage.window.windowDurationMins * 60)) invalid3();
  return {
    ...attribution,
    source: "last-observed",
    status: "available",
    sourceObservedAt: iso3(usage.observedAtMs),
    checkedAt: checked,
    windows: [
      {
        id: "window",
        scope: "muse-code-subscription-window",
        usedPercent: usage.window.usedPercent,
        resetsAt: iso3(usage.window.resetsAtMs),
        windowSeconds: usage.window.windowDurationMins * 60
      },
      {
        id: "weekly",
        scope: "muse-code-subscription-weekly",
        usedPercent: usage.weekly.usedPercent,
        resetsAt: iso3(usage.weekly.resetsAtMs),
        windowSeconds: null
      }
    ]
  };
}
function normalizeMuseCodeCatalog(result) {
  if (!object2(result) || !identifier(result.providerId) || !identifier(result.source) || !(result.profileId === null || identifier(result.profileId)) || !Array.isArray(result.models) || result.models.length > 2e3) invalid3();
  const seen = /* @__PURE__ */ new Set();
  const models = result.models.map((row) => {
    if (!object2(row) || !identifier(row.modelId) || !identifier(row.providerId) || !(row.profileId === null || identifier(row.profileId)) || !(row.contextLimit === null || positive(row.contextLimit)) || !(row.outputLimit === null || positive(row.outputLimit)) || typeof row.isActive !== "boolean" || typeof row.isDefault !== "boolean") invalid3();
    const key = JSON.stringify([row.providerId, row.profileId, row.modelId]);
    if (seen.has(key)) invalid3();
    seen.add(key);
    let reasoningEfforts2 = null;
    if (row.variants !== void 0 && row.variants !== "unknown") {
      if (!Array.isArray(row.variants) || row.variants.some((effort) => !EFFORTS.has(effort)) || new Set(row.variants).size !== row.variants.length) invalid3();
      reasoningEfforts2 = [...row.variants];
    }
    if (row.defaultReasoningEffort !== void 0 && (!reasoningEfforts2 || !reasoningEfforts2.includes(row.defaultReasoningEffort))) invalid3();
    return {
      modelId: row.modelId,
      providerId: row.providerId,
      profileId: row.profileId,
      label: label3(row.displayLabel),
      contextLimit: row.contextLimit,
      outputLimit: row.outputLimit,
      isActive: row.isActive,
      isDefault: row.isDefault,
      reasoningEfforts: reasoningEfforts2,
      ...row.defaultReasoningEffort !== void 0 ? { defaultReasoningEffort: row.defaultReasoningEffort } : {},
      entitlement: "unverified",
      runnable: false
    };
  });
  return { providerId: result.providerId, profileId: result.profileId, source: result.source, models };
}

// src/muse-code-host.mjs
var MUSE_CODE_CONTRIBUTOR_TERMS = "https://dev.meta.ai/help/subscriptions/muse-code-contributor-mode";
var MUSE_CODE_MODELS = Object.freeze(["muse-wonder-1.0", "muse-wonder-full-1.0"]);
var ID2 = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
var object3 = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var secret = (value) => typeof value === "string" && value.length > 0 && value.length <= 1024 * 1024;
var modeKey = (key) => /^(?:[a-z_]+\.)*contributor_mode(?:_enabled)?$/.test(key);
var opaqueId = (value) => typeof value === "string" && value.length > 0 && value.length <= 200 && !/[\u0000-\u001f\u007f]/.test(value);
var EFFORTS2 = /* @__PURE__ */ new Set(["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"]);
var fail = (code) => {
  throw new MuseCodeError(code);
};
var dataSignature = (connection) => JSON.stringify([
  connection.profileKey,
  connection.integrationId,
  connection.serviceId,
  connection.connectionId,
  connection.credentialRecordId,
  connection.credentialGeneration
]);
var leaseSignature = (connection) => JSON.stringify([dataSignature(connection), connection.generation, connection.museCode]);
function museCodeModelChoices(catalog, contributor = false) {
  return MUSE_CODE_MODELS.flatMap((modelId) => {
    const model = catalog.models.find((row) => row.modelId === modelId);
    if (!model) return [];
    const name2 = modelId === "muse-wonder-1.0" ? "Wonder1" : "Wonder Full";
    return [false, true].map((mode) => ({
      ...model,
      id: `${modelId}${mode ? "::contributor" : ""}`,
      modelId,
      name: `${name2}${mode ? " Contributor" : ""}`,
      label: `${name2}${mode ? " Contributor" : ""}`,
      contributor: mode,
      runnable: false,
      sessionSupported: true,
      isActive: model.isActive && mode === contributor,
      isDefault: model.isDefault && mode === contributor
    }));
  });
}
function museCodeCredentialKey(connection) {
  if (!ID2.test(connection?.credentialRecordId)) fail("muse-code-connection-changed");
  return `dsh-muse-code/${connection.credentialRecordId}`;
}
function validateMuseCodeConnection(connection) {
  if (connection?.integrationId !== "meta-muse-code" || connection.serviceId !== "muse-code" || connection.authMethod !== "oauth" || !ID2.test(connection.connectionId) || !Number.isSafeInteger(connection.credentialGeneration) || connection.credentialGeneration < 0 || connection.credentialRef || connection.headerRefs && Object.keys(connection.headerRefs).length || connection.profile?.baseURL || connection.profile?.api || connection.profile?.apiKeyEnv || connection.profile?.headers && Object.keys(connection.profile.headers).length) fail("muse-code-connection-changed");
  museCodeCredentialKey(connection);
}
function museCodeEnvironment(home, dataRoot, environment = process.env, platform = process.platform) {
  const env = {};
  for (const key of [
    "PATH",
    "SystemRoot",
    "WINDIR",
    "ComSpec",
    "PATHEXT",
    "SSL_CERT_FILE",
    "SSL_CERT_DIR",
    "NODE_EXTRA_CA_CERTS",
    "HTTPS_PROXY",
    "HTTP_PROXY",
    "ALL_PROXY",
    "NO_PROXY",
    "https_proxy",
    "http_proxy",
    "all_proxy",
    "no_proxy"
  ]) {
    if (typeof environment[key] === "string") env[key] = environment[key];
  }
  Object.assign(env, {
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: join2(home, ".config"),
    XDG_DATA_HOME: dataRoot,
    XDG_CACHE_HOME: join2(home, ".cache"),
    TMPDIR: join2(home, "tmp"),
    TEMP: join2(home, "tmp"),
    TMP: join2(home, "tmp"),
    TBH_CREDENTIAL_BACKEND: "file",
    TBH_DISABLE_TELEMETRY: "1",
    MUSE_EXPERIMENTAL_SDK_ENABLED: "on"
  });
  if (platform === "win32") Object.assign(env, { APPDATA: join2(home, "AppData", "Roaming"), LOCALAPPDATA: join2(home, "AppData", "Local") });
  return env;
}
function resolveMuseBin(environment = process.env, home = homedir2(), platform = process.platform) {
  if (platform === "win32") return "muse";
  for (const dir of (environment.PATH ?? "").split(delimiter).filter(Boolean)) {
    const candidate = join2(dir, "muse");
    try {
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
    }
  }
  const installed = join2(home, ".local", "bin", "muse");
  try {
    accessSync(installed, constants.X_OK);
    return installed;
  } catch {
  }
  return "muse";
}
function createSdkMuseHostFactory({ museBin, sdkLoader = () => Promise.resolve().then(() => (init_src(), src_exports)) } = {}) {
  return async ({ home, dataRoot, env, signal }) => {
    let handshake, abort;
    try {
      const sdk = await sdkLoader();
      signal?.throwIfAborted();
      handshake = sdk.spawnMspConnection({
        command: museBin ?? resolveMuseBin(),
        args: ["serve"],
        cwd: home,
        env,
        shutdownTimeoutMs: 5e3
      });
      abort = () => {
        void handshake.close().catch(() => {
        });
      };
      signal?.addEventListener("abort", abort, { once: true });
      const host = await handshake.initialize({
        clientInfo: { name: "dsh_muse_code", title: "DS Harness Muse Code", version: "0.6.0" },
        capabilities: { experimentalApi: true, userInputDialogs: false }
      });
      signal?.throwIfAborted();
      const listeners = /* @__PURE__ */ new Set();
      host.connection.onNotification((notification) => {
        for (const listener of listeners) listener(notification);
      });
      host.connection.onServerRequest(async () => fail("muse-code-llm-unsupported"));
      let closed = false;
      return {
        initializeResult: host.initializeResult,
        request: (method, params) => host.connection.request(method, params),
        command: (method, params) => host.connection.command(method, params, { maxAttempts: 1 }),
        onNotification(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        async close() {
          if (closed) return;
          closed = true;
          signal?.removeEventListener("abort", abort);
          listeners.clear();
          await host.close();
        }
      };
    } catch {
      if (abort) signal?.removeEventListener("abort", abort);
      await handshake?.close().catch(() => {
      });
      fail("muse-code-cli-required");
    }
  };
}
function museCodeAuthDocument(value) {
  const meta = value?.providers?.meta;
  if (!object3(value) || !Number.isSafeInteger(value.schema_version) || value.schema_version < 1 || !object3(meta) || meta.mechanism !== void 0 && meta.mechanism !== "oauth" || !secret(meta.access_token) || meta.api_key !== void 0 && !secret(meta.api_key) || meta.storage === "keychain") fail("muse-code-login-failed");
  if (meta.api_base_url !== void 0) {
    let url;
    try {
      url = new URL(meta.api_base_url);
    } catch {
      fail("muse-code-login-failed");
    }
    if (url.origin !== "https://api.meta.ai" || !["/", "/v1", "/v1/"].includes(url.pathname) || url.search || url.hash || url.username || url.password) fail("muse-code-login-failed");
  }
  return { ...structuredClone(value), providers: { meta: structuredClone(meta) } };
}
function publicAccount(value) {
  if (!object3(value) || typeof value.state !== "string" || typeof value.credentialRequired !== "boolean") fail("muse-code-protocol-unsupported");
  return {
    state: ["loggedOut", "envKey", "apiKey", "accountLogin"].includes(value.state) ? value.state : "unknown",
    credentialRequired: value.credentialRequired
  };
}
async function bounded(work, signal, timeout = 2e4) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  timeoutId.unref?.();
  const combined = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
  let abort;
  try {
    combined.throwIfAborted();
    const cancelled = new Promise((_, reject) => {
      abort = () => reject(new MuseCodeError("muse-code-connection-changed"));
      combined.addEventListener("abort", abort, { once: true });
    });
    return await Promise.race([Promise.resolve().then(work), cancelled]);
  } catch (error) {
    if (error instanceof MuseCodeError) throw error;
    if (["methodNotFound", "experimentalRequired", "capabilityRequired"].includes(error?.kind)) fail("muse-code-protocol-unsupported");
    fail("muse-code-unavailable");
  } finally {
    clearTimeout(timeoutId);
    if (abort) combined.removeEventListener("abort", abort);
  }
}
var MuseCodeHostManager = class {
  constructor({
    credentials,
    privateRoot,
    openHost = createSdkMuseHostFactory(),
    isCurrent = () => true,
    canExecute = (connection) => connection.enabled !== false,
    environment = process.env,
    now = Date.now
  } = {}) {
    if (!credentials || !isAbsolute(privateRoot ?? "")) fail("muse-code-cli-required");
    Object.assign(this, { credentials, privateRoot, openHost, isCurrent, canExecute, environment, now });
    this.live = /* @__PURE__ */ new Map();
    this.closed = false;
  }
  check(connection, signal) {
    if (this.closed || signal?.aborted || !this.isCurrent(connection)) fail("muse-code-connection-changed");
    validateMuseCodeConnection(connection);
  }
  checkExecution(connection, signal) {
    this.check(connection, signal);
    if (!this.canExecute(connection)) fail("muse-code-connection-disabled");
  }
  async open(connection, { signal, login = false, exclusive = false, observation = false } = {}) {
    this.check(connection, signal);
    const existing = this.live.get(connection.connectionId);
    if (existing) {
      if (!observation || existing.exclusive || existing.signature !== leaseSignature(connection)) fail("muse-code-busy");
      return this.consume(existing, signal, true);
    }
    const controller = new AbortController();
    const combined = controller.signal;
    const lease = {
      connection: structuredClone(connection),
      signature: leaseSignature(connection),
      exclusive: login || exclusive,
      controller,
      consumers: 0,
      queries: /* @__PURE__ */ new Map(),
      close: async () => {
      }
    };
    this.live.set(connection.connectionId, lease);
    let home, host;
    const close = async () => {
      controller.abort();
      try {
        await host?.close();
      } catch {
      } finally {
        if (home) await rm(home, { recursive: true, force: true }).catch(() => {
        });
        if (this.live.get(connection.connectionId) === lease) this.live.delete(connection.connectionId);
      }
    };
    lease.close = close;
    lease.ready = (async () => {
      try {
        const scope2 = createHash6("sha256").update(dataSignature(connection)).digest("hex");
        const ownedRoot = join2(this.privateRoot, scope2);
        await mkdir2(ownedRoot, { recursive: true, mode: 448 });
        this.check(connection, combined);
        home = await mkdtemp2(join2(ownedRoot, "home-"));
        const config = join2(home, ".config", "muse"), dataRoot = join2(ownedRoot, "data");
        await Promise.all([
          mkdir2(config, { recursive: true, mode: 448 }),
          mkdir2(dataRoot, { recursive: true, mode: 448 }),
          mkdir2(join2(home, "tmp"), { recursive: true, mode: 448 })
        ]);
        const record = login ? void 0 : await this.credentials.readRecord(museCodeCredentialKey(connection));
        this.check(connection, combined);
        let mode = { enabled: false };
        if (record) {
          if (record.kind !== "grant" || record.payload?.format !== "muse-code-cli-auth-v1") fail("muse-code-login-required");
          const document = museCodeAuthDocument(record.payload.authDocument);
          await writeFile2(join2(config, "auth.json"), JSON.stringify(document), { mode: 384 });
          mode = record.payload.mode ?? mode;
        } else if (!login) fail("muse-code-login-required");
        if (connection.museCode) mode = {
          enabled: connection.museCode.contributorMode === true
        };
        await writeFile2(join2(config, "settings.json"), JSON.stringify({ schema_version: 1 }), { mode: 384 });
        const opening = Promise.resolve().then(() => this.openHost({
          home,
          dataRoot,
          env: museCodeEnvironment(home, dataRoot, this.environment),
          signal: combined
        })).then((opened) => {
          if (combined.aborted || this.closed || !this.isCurrent(connection)) {
            void opened.close().catch(() => {
            });
            fail("muse-code-connection-changed");
          }
          return opened;
        });
        host = await bounded(() => opening, combined);
        this.check(connection, combined);
        const request = (method, params) => bounded(() => {
          this.check(connection, combined);
          return host.request(method, params);
        }, combined);
        const schema = await request("settings/readSchema");
        const values = await request("settings/read");
        if (schema?.schemaVersion !== 1 || !object3(schema.keys) || values?.schemaVersion !== 1 || !object3(values.values)) fail("muse-code-protocol-unsupported");
        const keys = Object.keys(schema.keys).filter((key) => modeKey(key) && schema.keys[key]?.type === "boolean" && ["boolean", "undefined"].includes(typeof values.values[key]));
        if (keys.length !== 1) fail("muse-code-mode-unavailable");
        const keyPath = keys[0];
        const applyMode = async (enabled) => {
          const written = await request("settings/writeValue", { keyPath, value: enabled });
          if (written?.keyPath !== keyPath || written.effectiveValue !== enabled) fail("muse-code-mode-unavailable");
          const read = await request("settings/read");
          if (read?.values?.[keyPath] !== enabled) fail("muse-code-mode-unavailable");
          return { keyPath, enabled };
        };
        mode = await applyMode(login ? false : mode.enabled === true);
        const account = publicAccount(await request("account/read"));
        if (!login && account.state !== "accountLogin") fail("muse-code-login-required");
        return { host, home, config, dataRoot, signal: combined, request, close, applyMode, mode, account };
      } catch (error) {
        lease.failure = error instanceof MuseCodeError ? error : new MuseCodeError("muse-code-cli-required");
        await close();
        throw lease.failure;
      }
    })();
    void lease.ready.catch(() => {
    });
    return this.consume(lease, signal, false);
  }
  async consume(lease, signal, observationOnly) {
    lease.consumers++;
    const combined = signal ? AbortSignal.any([signal, lease.controller.signal]) : lease.controller.signal;
    let released = false;
    const close = async () => {
      if (released) return;
      released = true;
      if (--lease.consumers === 0) await lease.close();
    };
    try {
      const handle = await bounded(() => lease.ready, combined);
      this.check(lease.connection, combined);
      const request = (method, params) => bounded(() => {
        this.check(lease.connection, combined);
        if (!["model/list", "usage/read"].includes(method)) return handle.host.request(method, params);
        const key = JSON.stringify([method, params]);
        if (!lease.queries.has(key)) {
          const query = bounded(() => handle.host.request(method, params), lease.controller.signal).finally(() => lease.queries.delete(key));
          lease.queries.set(key, query);
        }
        return lease.queries.get(key);
      }, combined);
      return { ...handle, signal: combined, request, close, observationOnly };
    } catch (error) {
      await close();
      throw signal?.aborted ? error : lease.failure ?? error;
    }
  }
  async authDocument(handle) {
    const path = join2(handle.config, "auth.json");
    const stat = await lstat2(path);
    if (!stat.isFile() || stat.size > 2 * 1024 * 1024) fail("muse-code-login-failed");
    try {
      return museCodeAuthDocument(JSON.parse(await readFile2(path, "utf8")));
    } catch {
      fail("muse-code-login-failed");
    }
  }
  async commit(connection, handle, mode = handle.mode) {
    this.check(connection, handle.signal);
    const authDocument = await this.authDocument(handle);
    this.check(connection, handle.signal);
    await this.credentials.modifyRecord(museCodeCredentialKey(connection), async () => {
      this.check(connection, handle.signal);
      return { kind: "grant", payload: { format: "muse-code-cli-auth-v1", authDocument, mode } };
    });
    this.check(connection, handle.signal);
  }
  async login(connection, { signal, notify = () => {
  } } = {}) {
    const handle = await this.open(connection, { signal, login: true });
    let unwatch;
    try {
      const completed = new Promise((resolve2) => {
        unwatch = handle.host.onNotification((frame) => {
          if (frame.method === "account/loginCompleted") resolve2(frame.params?.outcome);
        });
      });
      const started = await handle.request("account/loginStart", { type: "deviceCode" });
      let url;
      try {
        url = new URL(started.verificationUrl);
      } catch {
        fail("muse-code-login-failed");
      }
      if (url.protocol !== "https:" || !["auth.meta.com", "accountscenter.meta.com"].includes(url.hostname) || url.username || url.password || typeof started.userCode !== "string" || !/^[A-Za-z0-9-]{1,40}$/.test(started.userCode)) fail("muse-code-login-failed");
      this.check(connection, handle.signal);
      notify({ message: "Sign in with this Muse Code account.", url: url.href, code: started.userCode });
      const outcome = await bounded(() => completed, handle.signal, 6e5);
      if (outcome !== "granted") fail("muse-code-login-failed");
      const account = publicAccount(await handle.request("account/read"));
      if (account.state !== "accountLogin") fail("muse-code-login-failed");
      handle.mode = await handle.applyMode(connection.museCode?.contributorMode === true);
      await this.commit(connection, handle);
      return { authorized: true, account, contributor: handle.mode.enabled, executionKind: "agent-session", liveVerified: false };
    } catch (error) {
      try {
        await bounded(() => handle.host.request("account/loginCancel"), void 0, 1e3);
      } catch {
      }
      if (error instanceof MuseCodeError) throw error;
      fail("muse-code-login-failed");
    } finally {
      unwatch?.();
      await handle.close();
    }
  }
  async read(connection, { signal, includeModels = true, includeUsage = true } = {}) {
    const handle = await this.open(connection, { signal, observation: true });
    let committed = false;
    try {
      const [models, usage] = await Promise.allSettled([
        includeModels ? handle.request("model/list", {}).then(normalizeMuseCodeCatalog) : void 0,
        includeUsage ? handle.request("usage/read").then((raw) => normalizeMuseCodeUsage(raw.usage, connection, this.now())) : void 0
      ]);
      if (!handle.observationOnly) await this.commit(connection, handle);
      committed = true;
      return {
        account: handle.account,
        contributor: handle.mode.enabled,
        executionKind: "agent-session",
        liveVerified: false,
        ...includeModels ? models.status === "fulfilled" ? {
          models: museCodeModelChoices(models.value, handle.mode.enabled),
          diagnostics: models.value.models.filter((model) => !MUSE_CODE_MODELS.includes(model.modelId)).map((model) => ({ ...model, runnable: false, sessionSupported: false }))
        } : { models: [], modelsError: models.reason instanceof MuseCodeError ? models.reason.code : "muse-code-observation-failed" } : {},
        ...includeUsage ? usage.status === "fulfilled" ? { usage: usage.value } : {
          usage: {
            integrationId: "meta-muse-code",
            serviceId: "muse-code",
            connectionId: connection.connectionId,
            source: "last-observed",
            status: "error",
            windows: []
          },
          usageError: usage.reason instanceof MuseCodeError ? usage.reason.code : "muse-code-observation-failed"
        } : {}
      };
    } finally {
      if (!committed && !handle.observationOnly) await this.commit(connection, handle).catch(() => {
      });
      await handle.close();
    }
  }
  async readModels(connection, options = {}) {
    const result = await this.read(connection, { ...options, includeModels: true, includeUsage: false });
    if (result.modelsError) throw new MuseCodeError(result.modelsError);
    return result;
  }
  async readUsage(connection, options = {}) {
    const result = await this.read(connection, { ...options, includeModels: false, includeUsage: true });
    if (result.usageError) throw new MuseCodeError(result.usageError);
    return result.usage;
  }
  async configure(connection, patch, { signal } = {}) {
    if (patch.modelId !== void 0 && !MUSE_CODE_MODELS.includes(patch.modelId)) fail("muse-code-model-unavailable");
    if (patch.contributorMode !== void 0 && typeof patch.contributorMode !== "boolean") fail("muse-code-mode-unavailable");
    const handle = await this.open(connection, { signal, exclusive: true });
    try {
      const next = {
        contributorMode: connection.museCode?.contributorMode ?? handle.mode.enabled,
        ...connection.museCode?.modelId ? { modelId: connection.museCode.modelId } : {}
      };
      if (patch.contributorMode !== void 0) {
        await handle.applyMode(patch.contributorMode);
        next.contributorMode = patch.contributorMode;
      }
      const requested = patch.modelId ?? next.modelId;
      if (requested !== void 0) {
        const catalog = normalizeMuseCodeCatalog(await handle.request("model/list", {}));
        if (!catalog.models.some((model) => model.modelId === requested)) fail("muse-code-model-unavailable");
        next.modelId = requested;
      }
      return { museCode: next };
    } finally {
      await this.commit(connection, handle).catch(() => {
      });
      await handle.close();
    }
  }
  async startAgentSession(connection, { modelId = connection.museCode?.modelId, workspaceRoot, signal } = {}) {
    this.checkExecution(connection, signal);
    if (!MUSE_CODE_MODELS.includes(modelId)) fail("muse-code-model-unavailable");
    if (!isAbsolute(workspaceRoot ?? "")) fail("muse-code-session-failed");
    const handle = await this.open(connection, { signal });
    try {
      const catalog = normalizeMuseCodeCatalog(await handle.request("model/list", {}));
      const model = catalog.models.find((row) => row.modelId === modelId);
      if (!model) fail("muse-code-model-unavailable");
      this.checkExecution(connection, handle.signal);
      const result = await bounded(() => handle.host.command("session/start", {
        modelId,
        providerId: model.providerId,
        workspaceRoot,
        approvalMode: "denyUnmatched"
      }), handle.signal);
      if (!opaqueId(result?.session?.sessionId) || result.session.modelId !== modelId || result.session.providerId !== model.providerId) fail("muse-code-session-failed");
      return new MuseCodeAgentSession(this, connection, handle, result.session, model.reasoningEfforts);
    } catch (error) {
      await handle.close();
      if (error instanceof MuseCodeError) throw error;
      fail("muse-code-session-failed");
    }
  }
  async resumeAgentSession(connection, { sessionId, signal } = {}) {
    if (!opaqueId(sessionId)) fail("muse-code-session-failed");
    const handle = await this.open(connection, { signal });
    try {
      const result = await bounded(() => handle.host.command("session/resume", { sessionId, excludeItems: false }), handle.signal);
      if (result?.session?.sessionId !== sessionId || !MUSE_CODE_MODELS.includes(result.session.modelId)) fail("muse-code-session-failed");
      const catalog = normalizeMuseCodeCatalog(await handle.request("model/list", { sessionId }));
      const model = catalog.models.find((row) => row.modelId === result.session.modelId && row.providerId === result.session.providerId);
      if (!model) fail("muse-code-model-unavailable");
      return new MuseCodeAgentSession(this, connection, handle, result.session, model.reasoningEfforts);
    } catch (error) {
      await handle.close();
      if (error instanceof MuseCodeError) throw error;
      fail("muse-code-session-failed");
    }
  }
  async closeConnection(connectionId2) {
    await this.live.get(connectionId2)?.close();
  }
  async dispose() {
    this.closed = true;
    await Promise.all([...this.live.values()].map((lease) => lease.close()));
  }
};
function publicItem(item) {
  if (!object3(item) || !opaqueId(item.itemId) || !opaqueId(item.kind)) fail("muse-code-session-failed");
  return {
    itemId: item.itemId,
    kind: item.kind,
    ...typeof item.status === "string" ? { status: item.status.slice(0, 100) } : {},
    ...typeof item.text === "string" ? { text: item.text.slice(0, 512 * 1024) } : {},
    ...typeof item.tool === "string" ? { tool: item.tool.slice(0, 200) } : {},
    ...typeof item.visibleOutput === "string" ? { output: item.visibleOutput.slice(0, 512 * 1024) } : {}
  };
}
var MuseCodeAgentSession = class {
  constructor(manager, connection, handle, session, reasoningEfforts2) {
    this.manager = manager;
    this.connection = structuredClone(connection);
    this.handle = handle;
    this.sessionId = session.sessionId;
    this.modelId = session.modelId;
    this.reasoningEfforts = reasoningEfforts2;
    this.activeTurnId = session.activeTurnId ?? void 0;
    this.closed = false;
    this.sending = false;
  }
  state() {
    return {
      integrationId: "meta-muse-code",
      serviceId: "muse-code",
      connectionId: this.connection.connectionId,
      routeId: this.connection.routeId,
      sessionId: this.sessionId,
      modelId: this.modelId,
      contributor: this.handle.mode.enabled,
      executionKind: "agent-session",
      toolOwner: "muse-code",
      llmCompatible: false,
      liveVerified: false,
      activeTurnId: this.activeTurnId
    };
  }
  async *send(text2, { reasoningEffort, tools } = {}) {
    if (this.closed || this.sending || this.activeTurnId) fail("muse-code-busy");
    if (typeof text2 !== "string" || !text2.length || text2.length > 512 * 1024) fail("muse-code-session-failed");
    if (tools !== void 0) fail("muse-code-llm-unsupported");
    if (reasoningEffort !== void 0 && (!EFFORTS2.has(reasoningEffort) || !this.reasoningEfforts?.includes(reasoningEffort))) fail("muse-code-mode-unavailable");
    this.manager.checkExecution(this.connection, this.handle.signal);
    this.sending = true;
    const events = [], items = /* @__PURE__ */ new Map();
    let wake, terminal = false, overflow = false, turnId;
    const unwatch = this.handle.host.onNotification((frame) => {
      if (frame.params?.sessionId !== this.sessionId) return;
      if (events.length >= 256) overflow = true;
      else events.push(frame);
      wake?.();
      wake = void 0;
    });
    try {
      const ack = await bounded(() => this.handle.host.command("turn/start", {
        sessionId: this.sessionId,
        input: [{ type: "text", text: text2 }],
        ...reasoningEffort === void 0 ? {} : { reasoningEffort }
      }), this.handle.signal);
      if (ack?.status === "accepted" && opaqueId(ack.turnId)) this.activeTurnId = turnId = ack.turnId;
      if (ack?.status !== "accepted" || !turnId) fail("muse-code-session-failed");
      if (ack.disposition !== "started") fail("muse-code-busy");
      yield { type: "started", turnId };
      while (!terminal) {
        this.manager.check(this.connection, this.handle.signal);
        if (overflow) fail("muse-code-session-failed");
        if (!events.length) await bounded(() => new Promise((resolve2) => {
          wake = resolve2;
        }), this.handle.signal, 6e4);
        while (events.length && !terminal) {
          const frame = events.shift(), params = frame.params;
          if (params.turnId !== void 0 && params.turnId !== turnId) continue;
          if (params.item?.turnId !== void 0 && params.item.turnId !== turnId) continue;
          if (["item/started", "item/updated", "item/completed"].includes(frame.method) && opaqueId(params.item?.itemId)) {
            items.set(params.item.itemId, { kind: params.item.kind, turnId: params.item.turnId });
          }
          if (frame.method === "item/delta" && typeof params.delta === "string" && opaqueId(params.itemId)) {
            if ((params.field === void 0 || params.field === "text") && items.get(params.itemId)?.kind === "agentMessage" && items.get(params.itemId)?.turnId === turnId) yield { type: "text-delta", itemId: params.itemId, text: params.delta };
          } else if (frame.method === "item/completed") {
            yield { type: "item", item: publicItem(params.item) };
          } else if (frame.method === "turn/completed") {
            terminal = true;
            if (!["completed", "cancelled", "failed"].includes(params.terminal)) fail("muse-code-session-failed");
            yield {
              type: "completed",
              turnId,
              terminal: params.terminal,
              ...params.terminal === "failed" ? { error: "muse-code-session-failed" } : {}
            };
          }
        }
      }
      await this.manager.commit(this.connection, this.handle);
    } catch (error) {
      if (error instanceof MuseCodeError) throw error;
      fail("muse-code-session-failed");
    } finally {
      unwatch();
      wake = void 0;
      this.sending = false;
      if (!terminal && turnId) await this.cancel().catch(() => {
      });
      this.activeTurnId = void 0;
    }
  }
  async cancel() {
    this.manager.check(this.connection, this.handle.signal);
    if (!this.activeTurnId) return { cancelled: false };
    await bounded(() => this.handle.host.command("turn/cancel", { sessionId: this.sessionId, turnId: this.activeTurnId }), this.handle.signal);
    return { cancelled: true };
  }
  async history() {
    this.manager.check(this.connection, this.handle.signal);
    const result = await this.handle.request("session/read", { sessionId: this.sessionId, excludeItems: false });
    if (result?.session?.sessionId !== this.sessionId || result.session.modelId !== this.modelId || result.history?.mode !== "inline" || !Array.isArray(result.history.items)) fail("muse-code-session-failed");
    return result.history.items.map(publicItem);
  }
  async close() {
    if (this.closed) return;
    this.closed = true;
    if (this.activeTurnId) await this.cancel().catch(() => {
    });
    await this.handle.close();
  }
};

// src/muse-code-owner.mjs
function createMuseCodeOwner({ ctx, connections, privateRoot, isCurrent, onLogin, openHost, environment } = {}) {
  const bind = (connection) => connection.profileKey !== void 0 ? connection : connections.binding(connection);
  const current = isCurrent ?? ((connection) => connections.isCurrent(connection));
  const manager = new MuseCodeHostManager({
    credentials: ctx.credentials,
    privateRoot,
    isCurrent: current,
    canExecute: (connection) => {
      try {
        return connections.lookup(connection.connectionId).enabled !== false;
      } catch {
        return false;
      }
    },
    ...openHost ? { openHost } : {},
    ...environment ? { environment } : {}
  });
  return {
    integrationId: MUSE_CODE_INTEGRATION_ID,
    label: "Meta",
    source: MUSE_CODE_EVIDENCE.repository,
    manager,
    listServices: () => [{
      serviceId: MUSE_CODE_SERVICE_ID,
      label: "Muse Code",
      methods: [{ id: "oauth", label: "Muse Code account" }],
      capabilities: { auth: true, models: true, usage: true, settings: true },
      executionKind: "agent-session",
      llmCompatible: false,
      requiresHostCli: true,
      liveVerified: false,
      sourceTermsUrl: MUSE_CODE_CONTRIBUTOR_TERMS
    }],
    listConnections: () => Object.entries(connections.raw()).filter(([, connection]) => connection.integrationId === MUSE_CODE_INTEGRATION_ID).map(([connectionId2, connection]) => ({ connectionId: connectionId2, serviceId: connection.serviceId, routeId: connection.routeId })),
    credentialKey: museCodeCredentialKey,
    authKey: museCodeCredentialKey,
    routeIdFor: (id) => `muse-${id}`,
    initialConnection: () => ({ museCode: { contributorMode: false, modelId: "muse-wonder-1.0" } }),
    validateConnection: validateMuseCodeConnection,
    async describeConnection(connection) {
      const description = await ctx.credentials.describeRecord(museCodeCredentialKey(connection));
      return {
        configured: description.configured === true,
        writable: description.writable !== false,
        authStatus: description.configured ? "saved" : "auth-required",
        executionKind: "agent-session",
        llmCompatible: false,
        liveVerified: false,
        requiresHostCli: true
      };
    },
    async publicConnection(connection) {
      return {
        contributor: connection.museCode?.contributorMode === true,
        sourceTermsUrl: MUSE_CODE_CONTRIBUTOR_TERMS,
        executionKind: "agent-session",
        llmCompatible: false,
        liveVerified: false,
        requiresHostCli: true
      };
    },
    registerFlow(context, connection, flowIsCurrent = () => current(bind(connection)), flowOnLogin = onLogin) {
      return context.authorization.registerFlow({
        key: museCodeCredentialKey(connection),
        label: connection.displayName,
        methods: [{ id: "oauth", label: "Muse Code account" }],
        async run(session) {
          if (session.method !== "oauth" || !flowIsCurrent()) throw new MuseCodeError("muse-code-connection-changed");
          session.signal.throwIfAborted();
          await manager.login(bind(connection), {
            signal: session.signal,
            notify: (notice) => {
              if (flowIsCurrent() && !session.signal.aborted) session.notify(notice);
            }
          });
          if (!flowIsCurrent()) throw new MuseCodeError("muse-code-connection-changed");
          await flowOnLogin?.(connection.connectionId);
        }
      });
    },
    read: (connection, options) => manager.read(bind(connection), options),
    readModels: (connection, options) => manager.readModels(bind(connection), options),
    readUsage: (connection, options) => manager.readUsage(bind(connection), options),
    startAgentSession: (connection, options) => manager.startAgentSession(bind(connection), options),
    resumeAgentSession: (connection, options) => manager.resumeAgentSession(bind(connection), options),
    configureConnection: (_connection, patch, binding) => manager.configure(binding, patch),
    async deleteCredentials(connection) {
      await manager.closeConnection(connection.connectionId);
      await ctx.credentials.deleteRecord(museCodeCredentialKey(connection));
    },
    dispose: () => manager.dispose()
  };
}

// src/external-integrations.mjs
import { createHash as createHash7 } from "node:crypto";
var ExternalIntegrationError = class extends Error {
  constructor(code = "external-unavailable") {
    super(["external-unavailable", "external-models-unsupported", "external-provider-unavailable", "external-aborted", "external-route-conflict", "external-profile-changed"].includes(code) ? code : "external-unavailable");
    this.code = this.message;
  }
};
var publicText = (value, limit = 200) => typeof value === "string" && value.length > 0 && value.length <= limit && !/[\u0000-\u001f\u007f]/.test(value) ? value : void 0;
var connectionId = (profileKey, routeId) => `x-${createHash7("sha256").update(JSON.stringify([profileKey, routeId])).digest("hex").slice(0, 32)}`;
function createExternalIntegrations({ llm, profileKey = "default", generation = () => 1, excludeRoutes = () => [], excludeSettingsNamespaces = ["dsh-pi-login", "llm-pi-ai"], allowModelRead = false, timeout = 2e4 } = {}) {
  const integrationId = "external-host";
  const omittedNamespaces = new Set(excludeSettingsNamespaces);
  let rows = [], failures = [], closed = false, revision = 0;
  const controller = new AbortController();
  const exclusions = () => new Set(typeof excludeRoutes === "function" ? excludeRoutes() : excludeRoutes);
  const allowedRow = (route) => !exclusions().has(route);
  const current = (token2) => !closed && generation() === token2;
  async function read(operation, signal, token2) {
    if (!current(token2)) throw new ExternalIntegrationError("external-profile-changed");
    const deadline = AbortSignal.timeout(timeout);
    const requestSignal = signal ? AbortSignal.any([signal, controller.signal, deadline]) : AbortSignal.any([controller.signal, deadline]);
    let onAbort;
    try {
      const abort = new Promise((_, reject) => {
        onAbort = () => reject(new ExternalIntegrationError(signal?.aborted || controller.signal.aborted ? "external-aborted" : "external-unavailable"));
        if (requestSignal.aborted) onAbort();
        else requestSignal.addEventListener("abort", onAbort, { once: true });
      });
      const value = await Promise.race([Promise.resolve().then(operation), abort]);
      if (!current(token2)) throw new ExternalIntegrationError("external-profile-changed");
      return value;
    } catch (error) {
      if (error instanceof ExternalIntegrationError) throw error;
      throw new ExternalIntegrationError("external-unavailable");
    } finally {
      if (onAbort) requestSignal.removeEventListener("abort", onAbort);
    }
  }
  function service(row) {
    return { serviceId: row.serviceId, label: row.serviceLabel, methods: [], capabilities: { ...row.capabilities } };
  }
  function copyRows() {
    return structuredClone(rows);
  }
  const descriptor = {
    integrationId,
    label: "External integrations",
    source: "Host LLM directory",
    status: "owner-managed",
    listServices: () => rows.map(service),
    listConnections: copyRows
  };
  async function publicConnections({ signal } = {}) {
    if (closed) throw new ExternalIntegrationError("external-aborted");
    const token2 = generation(), epoch2 = ++revision;
    const results = await Promise.allSettled([
      read(() => llm?.listProviders?.() ?? [], signal, token2),
      read(() => llm?.listConfigurableProviders?.() ?? [], signal, token2)
    ]);
    if (!current(token2)) throw new ExternalIntegrationError("external-profile-changed");
    if (signal?.aborted) throw new ExternalIntegrationError("external-aborted");
    const live = /* @__PURE__ */ new Map(), declared = /* @__PURE__ */ new Map(), errors = [];
    const [registered, configurable] = results;
    const ingest = (result, target, kind) => {
      if (result.status === "rejected" || !Array.isArray(result.value)) {
        errors.push(kind);
        return;
      }
      for (const raw of result.value.slice(0, 4096)) {
        const routeId = publicText(kind === "registered" ? raw?.id : raw?.provider, 512);
        if (!routeId || !allowedRow(routeId)) continue;
        if (target.has(routeId)) throw new ExternalIntegrationError("external-route-conflict");
        if (kind === "registered") target.set(routeId, { name: publicText(raw.name) ?? routeId });
        else {
          const source = publicText(raw.settingsNs);
          if (source && omittedNamespaces.has(source)) continue;
          target.set(routeId, { name: publicText(raw.displayName) ?? routeId, source: source ?? "unknown", unavailable: typeof raw.error === "string" && raw.error.length > 0 });
        }
      }
    };
    ingest(registered, live, "registered");
    ingest(configurable, declared, "declared");
    if (configurable.status === "fulfilled" && Array.isArray(configurable.value)) {
      for (const raw of configurable.value) if (omittedNamespaces.has(raw?.settingsNs)) live.delete(raw.provider);
    }
    const candidate = [.../* @__PURE__ */ new Set([...live.keys(), ...declared.keys()])].map((routeId) => {
      const entry = declared.get(routeId), active = live.has(routeId);
      const id = connectionId(profileKey, routeId), name2 = entry?.name ?? live.get(routeId).name;
      return {
        key: id,
        connectionId: id,
        integrationId,
        integrationLabel: descriptor.label,
        serviceId: routeId,
        serviceLabel: name2,
        routeId,
        displayName: name2,
        source: entry?.source ?? "unknown",
        authMethod: "owner-managed",
        authStatus: "owner-managed",
        directoryState: entry?.unavailable ? "unavailable" : active ? "live" : "declared",
        enabled: active,
        writable: false,
        inFlight: false,
        methods: [],
        profile: {},
        capabilities: { auth: false, models: allowModelRead && active && typeof llm?.listModels === "function", usage: false, settings: false },
        ownerManaged: true
      };
    });
    if (epoch2 === revision) {
      rows = candidate;
      failures = errors;
    }
    return structuredClone(candidate);
  }
  async function models(id, { signal } = {}) {
    if (closed) throw new ExternalIntegrationError("external-aborted");
    const row = rows.find((value) => value.connectionId === id);
    if (!row || !allowedRow(row.routeId)) throw new ExternalIntegrationError("external-provider-unavailable");
    if (!row.capabilities.models) throw new ExternalIntegrationError("external-models-unsupported");
    const token2 = generation(), routeId = row.routeId;
    const metadata = await read(() => llm.listModels(routeId), signal, token2);
    if (!rows.some((value) => value.connectionId === id && value.routeId === routeId && value.enabled) || !allowedRow(routeId)) throw new ExternalIntegrationError("external-provider-unavailable");
    if (!Array.isArray(metadata) || metadata.length > 4096) throw new ExternalIntegrationError("external-unavailable");
    const seen = /* @__PURE__ */ new Set(), models2 = metadata.map((value) => {
      const modelId = publicText(value?.id, 512), name2 = publicText(value?.name);
      if (!modelId || !name2 || value.provider !== routeId || seen.has(modelId)) throw new ExternalIntegrationError("external-unavailable");
      seen.add(modelId);
      return {
        provider: routeId,
        id: modelId,
        name: name2,
        ...publicText(value.description, 1e3) ? { description: value.description } : {},
        ...Array.isArray(value.inputModalities) ? { inputModalities: value.inputModalities.map((modality) => publicText(modality, 80)).filter(Boolean) } : {}
      };
    });
    const result = { connectionId: id, integrationId, provider: routeId, readOnly: true, models: models2 };
    return structuredClone(result);
  }
  return {
    descriptor,
    publicConnections,
    refresh: publicConnections,
    models,
    state: () => ({ failures: [...failures], connections: copyRows() }),
    dispose() {
      closed = true;
      revision++;
      controller.abort();
      rows = [];
      failures = [];
    }
  };
}

// src/index.mjs
import { join as join3 } from "node:path";
import { tmpdir } from "node:os";

// src/meta-catalog.mjs
import { createHash as createHash8 } from "node:crypto";
var META_CATALOG_GRANT = /* @__PURE__ */ Symbol("dsh-pi-login/meta-catalog-grant");
var LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
var principalOf = (credential) => createHash8("sha256").update(credential.refresh).digest("hex");
var oauth = (value) => value?.type === "oauth" && typeof value.refresh === "string" && value.refresh.length > 0;
var fullModel = (id) => /^muse-wonder-full(?:-|$)/.test(id);
var cleanLabel = (value) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 100) : void 0;
var positive2 = (value) => Number.isSafeInteger(value) && value > 0 ? value : void 0;
var MetaCatalogError = class extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
};
function checkProfile(profile2) {
  if (profile2.apiKeyEnv !== void 0 || profile2.credentialRef !== void 0) throw new MetaCatalogError("meta-key-override");
  if (profile2.baseURL !== void 0 && profile2.baseURL.replace(/\/+$/, "") !== "https://api.meta.ai/v1" || profile2.api !== void 0 && profile2.api !== "openai-responses" || [...Object.keys(profile2.headers ?? {}), ...Object.keys(profile2.headerRefs ?? {})].some((name2) => name2.toLowerCase() === "authorization")) {
    throw new MetaCatalogError("meta-settings-incompatible");
  }
}
function learnedModel(row, profile2, principal) {
  const context = positive2(row.contextWindow ?? row.context_window ?? row.context_length ?? row.limit?.context);
  const output = positive2(row.maxTokens ?? row.max_tokens ?? row.max_output_tokens ?? row.limit?.output);
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
  }, onUsage = () => {
  }, fetch: request = (...args) => globalThis.fetch(...args), now = Date.now, catalogTTL = 18e5, entitlementTTL = 3e5, maxStale = 36e5, timeout = 2e4 }) {
    this.credentials = credentials;
    this.profile = profile2;
    this.baseline = baseline;
    this.onChange = onChange;
    this.onUsage = onUsage;
    this.fetch = request;
    this.now = now;
    this.version = 0;
    this.catalogCache = new ProviderCache({ ttl: catalogTTL, maxStale, timeout, now });
    this.entitlementCache = new ProviderCache({ ttl: entitlementTTL, maxStale, timeout, now });
    this.closed = false;
  }
  state() {
    const contract = this.entitlementCache.peek(), models = this.catalogCache.peek();
    return {
      canRefresh: true,
      account: contract.value?.account,
      checkedAt: models.checkedAt,
      discoveredCount: models.value?.size ?? 0,
      stale: Boolean(models.value && (models.stale || models.error)),
      entitlementStale: Boolean(contract.value && (contract.stale || contract.error)),
      retryAt: models.retryAt ?? contract.retryAt
    };
  }
  invalidate() {
    const changed = this.catalogCache.value !== void 0;
    this.principal = void 0;
    this.signature = void 0;
    this.pending = void 0;
    this.catalogCache.invalidate();
    this.entitlementCache.invalidate();
    if (changed) {
      this.version++;
      if (!this.closed) this.onChange();
    }
  }
  async validate() {
    const profile2 = this.profile();
    const signature = createHash8("sha256").update(JSON.stringify({
      baseURL: profile2.baseURL,
      api: profile2.api,
      apiKeyEnv: profile2.apiKeyEnv,
      credentialRef: profile2.credentialRef,
      headers: profile2.headers,
      headerRefs: profile2.headerRefs
    })).digest("hex");
    if (this.signature !== void 0 && this.signature !== signature) this.invalidate();
    this.signature = signature;
    if (!this.principal) return;
    const current = await this.credentials.read("meta");
    if (!oauth(current) || principalOf(current) !== this.principal) this.invalidate();
  }
  catalog(provider) {
    const learned = this.catalogCache.peek().value;
    if (provider !== "meta" || !learned) return void 0;
    const catalog = new Map(this.baseline("meta"));
    for (const [id] of catalog) if (fullModel(id) && !learned.has(id)) catalog.delete(id);
    for (const [id, model] of learned) if (!catalog.has(id) || fullModel(id)) catalog.set(id, model);
    return catalog;
  }
  async readJson(response) {
    try {
      return await readProviderJson(response, { now: this.now(), maxBytes: 4 * 1024 * 1024 });
    } catch (error) {
      throw error;
    }
  }
  publicError(error) {
    if (error instanceof MetaCatalogError) return error;
    const codes = { "auth-required": "meta-login-required", "rate-limited": "meta-rate-limited", "account-changed": "meta-account-changed" };
    const result = new MetaCatalogError(codes[error?.code] ?? "meta-refresh-failed");
    if (Number.isFinite(error?.retryAfterMs)) result.retryAfterMs = error.retryAfterMs;
    return result;
  }
  async contract({ force = false, signal } = {}) {
    checkProfile(this.profile());
    await this.validate();
    const credential = await this.credentials.read("meta");
    if (!oauth(credential)) throw new ProviderReadError("auth-required");
    const principal = principalOf(credential);
    this.principal = principal;
    try {
      return await this.entitlementCache.get(async (requestSignal) => {
        let result;
        await this.credentials.modify("meta", async (current2) => {
          if (!oauth(current2) || principalOf(current2) !== principal) throw new ProviderReadError("account-changed");
          const body = await this.readJson(await this.fetch("https://api.meta.ai/muse-code/key", {
            method: "POST",
            redirect: "error",
            signal: requestSignal,
            headers: { accept: "application/json", "content-type": "application/json", "x-api-version": "1.0.0", authorization: `Bearer ${current2.refresh}` },
            body: "{}"
          }));
          const account = {
            active: typeof body.is_subs_active === "boolean" ? body.is_subs_active : null,
            tierName: cleanLabel(body.subs_tier_name),
            tierId: cleanLabel(body.subs_tier_id)
          };
          const sourceObservedAt = new Date(this.now()).toISOString();
          let usage;
          try {
            usage = { source: "internal-http", sourceObservedAt, status: "available", windows: parseMuseUsage(body) };
          } catch (error) {
            usage = { source: "internal-http", sourceObservedAt, status: error.code === "auth-required" ? "auth-required" : "error", windows: [] };
          }
          result = { account, usage };
          const { dshPiSubscription: _obsolete, ...standard } = current2;
          if (account.active !== true) return standard;
          if (typeof body.api_key !== "string" || body.api_key.length === 0) throw new ProviderReadError("auth-required");
          return { ...standard, access: body.api_key, expires: this.now() + 864e5 };
        });
        const current = await this.credentials.read("meta");
        if (this.closed || requestSignal.aborted || !oauth(current) || principalOf(current) !== principal) throw new ProviderReadError("account-changed");
        checkProfile(this.profile());
        if (result.account.active !== true && this.catalogCache.value?.size) {
          this.catalogCache.value = void 0;
          if (!this.catalogCache.pending) {
            this.version++;
            this.onChange();
          }
        }
        this.onUsage();
        return result;
      }, { force, signal });
    } catch (error) {
      if (error.code === "auth-required" || error.code === "account-changed") {
        const changed = this.catalogCache.value !== void 0;
        this.catalogCache.value = void 0;
        if (changed && !this.catalogCache.pending) {
          this.version++;
          this.onChange();
        }
      }
      throw error;
    }
  }
  /** Shared mint for usage, model discovery and host-owned credential renewal. */
  async ensureCredentials({ signal } = {}) {
    await this.validate();
    const current = await this.credentials.read("meta");
    if (!oauth(current)) throw new ProviderReadError("auth-required");
    if (!current.access || !Number.isFinite(current.expires) || current.expires <= this.now()) await this.contract({ force: true, signal });
    const next = await this.credentials.read("meta");
    if (!oauth(next) || typeof next.access !== "string" || !Number.isFinite(next.expires) || next.expires <= this.now()) throw new ProviderReadError("auth-required");
    return next;
  }
  async usage(options = {}) {
    try {
      return (await this.contract(options)).usage;
    } catch (error) {
      if (error instanceof ProviderReadError) throw error;
      if (error instanceof MetaCatalogError) throw new ProviderReadError(error.code === "meta-login-required" ? "auth-required" : error.code.includes("override") || error.code.includes("incompatible") ? "unsupported" : "error");
      throw new ProviderReadError("error");
    }
  }
  refresh(options = {}) {
    if (this.closed) return Promise.reject(new MetaCatalogError("meta-refresh-failed"));
    if (this.pending && !options.signal) return this.pending;
    const pending = this.runRefresh(options).catch((error) => {
      throw this.publicError(error);
    });
    if (options.signal) return pending;
    this.pending = pending.finally(() => {
      if (this.pending === stored) this.pending = void 0;
    });
    const stored = this.pending;
    return stored;
  }
  async runRefresh({ force = false, signal } = {}) {
    checkProfile(this.profile());
    await this.validate();
    const prior = this.catalogCache.value;
    await this.catalogCache.get(async (requestSignal) => {
      const contract = await this.contract({ signal: requestSignal });
      if (contract.account.active !== true) return /* @__PURE__ */ new Map();
      const credential = await this.ensureCredentials({ signal: requestSignal }), principal = this.principal;
      if (!oauth(credential) || principalOf(credential) !== principal) throw new ProviderReadError("account-changed");
      const body = await this.readJson(await this.fetch("https://api.meta.ai/v1/models", {
        method: "GET",
        redirect: "error",
        signal: requestSignal,
        headers: { accept: "application/json", "x-api-version": "1.0.0", authorization: `Bearer ${credential.access}` }
      }));
      if (!Array.isArray(body.data) || body.has_more === true || body.next_page !== void 0 && body.next_page !== null) throw new ProviderReadError("error");
      const current = await this.credentials.read("meta");
      if (this.closed || requestSignal.aborted || !oauth(current) || principalOf(current) !== principal) throw new ProviderReadError("account-changed");
      if (this.entitlementCache.peek().value?.account.active !== true) throw new ProviderReadError("auth-required");
      checkProfile(this.profile());
      const baseline = this.baseline("meta"), learned2 = /* @__PURE__ */ new Map(), profile2 = this.profile();
      for (const row of body.data) {
        if (!row || typeof row.id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/.test(row.id) || baseline.has(row.id) && !fullModel(row.id) || learned2.has(row.id)) continue;
        const input = row.input ?? row.modalities?.input;
        if (Array.isArray(input) && !input.some((value) => value === "text" || value === "image")) continue;
        if (["image", "classifier", "embedding", "audio"].includes(row.type)) continue;
        learned2.set(row.id, baseline.has(row.id) ? { ...baseline.get(row.id), [META_CATALOG_GRANT]: Object.freeze({ principal, verified: true }), [DISCOVERED_MODEL]: Object.freeze({ verified: true }) } : learnedModel(row, profile2, principal));
      }
      return learned2;
    }, { force, signal }).catch((error) => {
      if (prior !== void 0 && this.catalogCache.value === void 0) {
        this.version++;
        this.onChange();
      }
      throw error;
    });
    const learned = this.catalogCache.value;
    const image = (map) => map && JSON.stringify([...map].map(([id, model]) => [id, model, model[META_CATALOG_GRANT]?.verified]));
    if (image(prior) !== image(learned)) {
      this.version++;
      this.onChange();
    }
    return this.state();
  }
  async keyForModel(provider, model, profile2) {
    if (provider !== "meta") return void 0;
    const grant = model[META_CATALOG_GRANT];
    if (!grant && !fullModel(model.id)) return void 0;
    checkProfile(profile2);
    await this.validate();
    const current = await this.credentials.read("meta");
    const contract = this.entitlementCache.peek();
    if (!grant || !oauth(current) || principalOf(current) !== grant.principal || this.principal !== grant.principal || !this.catalogCache.peek().value?.has(model.id) || contract.value?.account.active !== true || contract.error === "auth-required") {
      throw new MetaCatalogError("meta-refresh-required");
    }
    if (typeof current.access !== "string" || !Number.isFinite(current.expires) || current.expires <= this.now()) throw new MetaCatalogError("meta-refresh-required");
    return current.access;
  }
  dispose() {
    this.closed = true;
    this.catalogCache.dispose();
    this.entitlementCache.dispose();
    this.principal = void 0;
  }
};

// src/meta-catalog-provider.mjs
import { LlmError as LlmError8 } from "@deepseek-ai/dsh-llm";
function metaCatalogProvider(session) {
  return {
    session,
    presentation(models) {
      const { account, entitlementStale } = session.state();
      return {
        ...account ? { status: { message: entitlementStale ? "metaSubscriptionUnknown" : account.active === true ? "metaSubscriptionActive" : account.active === false ? "metaSubscriptionInactive" : "metaSubscriptionUnknown", detail: account.tierName } } : {},
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
function apply2(ctx, config, options = {}) {
  const registry = new IntegrationRegistry(profileKeyFor(ctx.get("profileContext")?.dir));
  const legacyProviders = () => ctx.get("configEditor")?.entries().find((entry) => entry.options.id === "llm-pi-ai")?.options.config?.providers ?? {};
  let revision = 0;
  const sessions = /* @__PURE__ */ new Map();
  const legacyCatalogs = new ProviderCatalogs({ meta: metaCatalogProvider(new MetaCatalogSession({
    credentials: credentialStoreFrom(ctx),
    profile: () => config.providers.get().meta ?? {},
    baseline: catalogModels,
    onChange: () => {
      revision++;
      ctx.emit("dsh-pi-login/catalog-updated");
    }
  })) });
  const manager = new ConnectionManager({
    settings: ctx.settings,
    credentials: ctx.credentials,
    registry,
    legacyProviders,
    validateProfile: (connection) => resolveConnectionProfiles({ check: connection }),
    onChange: (connectionId2) => {
      for (const [id, value] of sessions) {
        const current = config.connections.get()[id];
        if (!current || value.identity !== sessionIdentity(current)) {
          value.catalogs.dispose();
          sessions.delete(id);
          usage.invalidate(id);
        }
      }
      ctx.emit("dsh-pi-login/connections-updated", connectionId2);
    }
  });
  const external = createExternalIntegrations({
    llm: ctx.llm,
    profileKey: registry.profileKey,
    generation: () => registry.generation,
    excludeRoutes: () => Object.values(config.connections.get()).map((connection) => connection.routeId)
  });
  manager.extraConnections = () => external.publicConnections();
  const piServices = () => {
    const ids = /* @__PURE__ */ new Set([...catalogProviderIds(), ...Object.keys(legacyProviders()), ...Object.keys(config.providers.get()), ...Object.values(config.connections.get()).filter((connection) => connection.integrationId === "pi").map((connection) => connection.serviceId)]);
    return [...ids].map((serviceId) => {
      const provider = catalogProvider(serviceId);
      const methods = [
        ...provider?.auth.oauth ? [{ id: "oauth", label: provider.auth.oauth.loginLabel ?? provider.auth.oauth.name }] : [],
        ...provider?.auth.apiKey || !provider ? [{ id: "api-key", label: provider?.auth.apiKey?.name ?? "API key" }] : []
      ];
      return {
        serviceId,
        label: serviceId === "meta" ? "Meta Model API\uFF08Pi\u7D4C\u7531\uFF09" : provider?.name ?? serviceId,
        methods,
        capabilities: { auth: methods.length > 0, models: true, settings: true, usage: ["openai-codex", "anthropic", "github-copilot", "opencode-go", "meta"].includes(serviceId) }
      };
    });
  };
  registry.register({ integrationId: "pi", label: "Pi", source: "@earendil-works/pi-ai", listServices: piServices, listConnections: () => Object.values(manager.raw()) });
  const muse = createMuseCodeOwner({
    ctx,
    connections: manager,
    privateRoot: join3(ctx.get("profileContext")?.dir ?? join3(tmpdir(), "dsh-muse-code", registry.profileKey), ".dsh-muse-code"),
    onLogin: async (id) => {
      const connection = manager.lookup(id);
      manager.markVerified(id);
      usage.invalidate(id);
      if (!connection.enabled) await manager.update(id, { enabled: true }, manager.section()?.revision);
    },
    ...options.muse
  });
  registry.register(muse);
  registry.register(external.descriptor);
  ctx.on("dsh-pi-login/register-integration", (owner) => registry.register(owner));
  const museFlows = /* @__PURE__ */ new Map();
  const syncMuseFlows = () => {
    for (const [id, flow] of museFlows) {
      const current = config.connections.get()[id];
      if (!current || flow.identity !== JSON.stringify([current.credentialRecordId, current.credentialGeneration, current.displayName])) {
        flow.dispose();
        museFlows.delete(id);
      }
    }
    for (const [id, connection] of Object.entries(config.connections.get())) {
      if (connection.integrationId !== "meta-muse-code" || museFlows.has(id)) continue;
      const value = { ...connection, connectionId: id };
      const binding = manager.binding(value);
      const dispose = muse.registerFlow(ctx, value, () => manager.isCurrent(binding));
      museFlows.set(id, { identity: JSON.stringify([connection.credentialRecordId, connection.credentialGeneration, connection.displayName]), dispose });
    }
  };
  ctx.on("dsh-pi-login/connections-updated", syncMuseFlows);
  const sessionIdentity = (connection) => JSON.stringify([connection.serviceId, connection.credentialRecordId, connection.credentialGeneration, connection.credentialRef, connection.profile?.baseURL, connection.profile?.api]);
  const authFor = (connection) => {
    const binding = manager.binding(connection);
    return connectionAuthFrom(ctx, { ...binding, isCurrent: () => manager.isCurrent(binding) });
  };
  const catalogsFor = (connection) => {
    const id = connection.connectionId;
    const identity2 = sessionIdentity(connection);
    const previous = sessions.get(id);
    if (previous?.identity === identity2) return previous.catalogs;
    previous?.catalogs.dispose();
    const meta = connection.serviceId === "meta" ? new MetaCatalogSession({
      credentials: authFor(connection).credentials,
      profile: () => {
        const current = manager.lookup(id);
        return { ...current.profile, headerRefs: current.headerRefs, credentialRef: current.credentialRef };
      },
      baseline: catalogModels,
      onChange: () => {
        revision++;
        ctx.emit("dsh-pi-login/catalog-updated");
      }
    }) : void 0;
    const catalogs = new ProviderCatalogs(meta ? { meta: metaCatalogProvider(meta) } : {});
    sessions.set(id, { identity: identity2, catalogs, meta });
    return catalogs;
  };
  const usage = new AccountUsageManager({
    providers: {
      ...createPiUsageProviders({ metaSession: (connection) => {
        catalogsFor(connection);
        return sessions.get(connection.connectionId).meta;
      } }),
      "meta-muse-code/muse-code": {
        source: "last-observed",
        requiresCredentials: false,
        read: ({ connection, signal }) => muse.readUsage(connection, { signal })
      }
    },
    credentials: {
      read: (connection) => authFor(connection).credentials.read(connection.serviceId),
      refresh: async (connection, _record, signal) => {
        const auth = authFor(connection);
        const models = createModels(auth);
        models.setProvider(catalogProvider(connection.serviceId));
        await models.getAuth(connection.serviceId, { signal });
        return auth.credentials.read(connection.serviceId);
      }
    }
  });
  const runtime = apply(ctx, config, {
    connections: () => config.connections.get(),
    authForProfile: (profile2) => authFor(profile2),
    catalog: (provider, id) => id ? catalogsFor(manager.lookup(id)).catalog(provider) : legacyCatalogs.catalog(provider),
    revision: () => revision,
    onLogin: async (id) => {
      if (!config.connections.get()[id]) return legacyCatalogs.onLogin(id);
      const connection = manager.lookup(id);
      manager.markVerified(id);
      catalogsFor(connection).onLogin(connection.serviceId);
      usage.invalidate(id);
      if (!connection.enabled) await manager.update(id, { enabled: true }, manager.section()?.revision);
    },
    authorizeModel: (route, model, profile2) => {
      if (!profile2.connectionId) return legacyCatalogs.authorizeModel(route, model, profile2);
      if (!manager.isCurrent(manager.binding(profile2))) throw new ConnectionError("connection-changed");
      return catalogsFor(manager.lookup(profile2.connectionId)).authorizeModel(profile2.serviceId, model, profile2);
    }
  });
  applyLoginUI(ctx, {
    connections: manager,
    usage,
    registry,
    syncFlows: () => {
      runtime.syncFlows();
      syncMuseFlows();
    },
    catalogs: legacyCatalogs,
    catalogsFor,
    catalog: (provider, profile2, connectionId2) => {
      const learned = connectionId2 ? catalogsFor(manager.lookup(connectionId2)).catalog(provider) : legacyCatalogs.catalog(provider);
      if (connectionId2) {
        const connection = manager.lookup(connectionId2);
        const resolved = resolveConnectionProfiles({ [connectionId2]: { ...connection, profile: profile2 } }, () => learned, "deferred").get(connection.routeId);
        return resolved.modelChoices.map((choice) => ({
          ...choice,
          capabilityUnverified: choice.capabilityUnverified || choice.discovered && !choice.model[DISCOVERED_MODEL]?.verified
        }));
      }
      const models = resolveRouteModels({ defaultInput: DEFAULT_INPUT, defaultContextWindow: DEFAULT_CONTEXT_WINDOW, defaultMaxTokens: DEFAULT_MAX_TOKENS, provider, ...profile2 }, "deferred", learned).models;
      const discovered = new Set(models.filter((model) => model[DISCOVERED_MODEL]).map((model) => model.id));
      return modelChoices(provider, models, profile2, discovered).map((choice) => ({ ...choice, capabilityUnverified: choice.discovered && !choice.model[DISCOVERED_MODEL]?.verified }));
    }
  });
  let alive = true;
  ctx.effect(() => () => {
    alive = false;
    manager.dispose();
    registry.dispose();
    external.dispose();
    usage.dispose();
    legacyCatalogs.dispose();
    for (const flow of museFlows.values()) flow.dispose();
    museFlows.clear();
    void muse.dispose();
    for (const value of sessions.values()) value.catalogs.dispose();
    sessions.clear();
  }, "AI connections: owned lifetime");
  void ctx.fiber.await().then(async () => {
    if (!alive) return;
    await manager.migrate();
    manager.changed();
  }).catch(() => {
    if (alive) ctx.logger.warn("AI connections: migration did not complete; original settings and credentials remain available");
  });
}
export {
  Config,
  ConnectionManager,
  DISCOVERED_MODEL,
  IntegrationRegistry,
  PiAiAdapter,
  ProviderCatalogs,
  apply2 as apply,
  applyLoginUI,
  connectionAuthFrom,
  createMuseCodeOwner,
  inject,
  name,
  resolveConnectionProfiles,
  resolveProfiles
};

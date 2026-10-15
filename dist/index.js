var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name2);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/semver/internal/constants.js"(exports, module) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports, module) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug;
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports, module) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src = exports.src = [];
    var safeSrc = exports.safeSrc = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token2, max] of safeRegexReplacements) {
        value = value.split(`${token2}*`).join(`${token2}{0,${max}}`).split(`${token2}+`).join(`${token2}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name2, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name2, index, value);
      t[name2] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports, module) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports, module) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/semver/classes/semver.js"(exports, module) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var isPrereleaseIdentifier = (prerelease, identifier) => {
      const identifiers = identifier.split(".");
      if (identifiers.length > prerelease.length) {
        return false;
      }
      for (let i = 0; i < identifiers.length; i++) {
        if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) {
          return false;
        }
      }
      return true;
    };
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (isPrereleaseIdentifier(this.prerelease, identifier)) {
                const prereleaseBase = this.prerelease[identifier.split(".").length];
                if (isNaN(prereleaseBase)) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module.exports = SemVer;
  }
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "node_modules/semver/functions/parse.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module.exports = parse;
  }
});

// node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "node_modules/semver/functions/valid.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var valid = (version, options) => {
      const v = parse(version, options);
      return v ? v.version : null;
    };
    module.exports = valid;
  }
});

// node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "node_modules/semver/functions/clean.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var clean = (version, options) => {
      const s = parse(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module.exports = clean;
  }
});

// node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "node_modules/semver/functions/inc.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var inc = (version, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version instanceof SemVer ? version.version : version,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module.exports = inc;
  }
});

// node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "node_modules/semver/functions/diff.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse(version1, null, true);
      const v2 = parse(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module.exports = diff;
  }
});

// node_modules/semver/functions/major.js
var require_major = __commonJS({
  "node_modules/semver/functions/major.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module.exports = major;
  }
});

// node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "node_modules/semver/functions/minor.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module.exports = minor;
  }
});

// node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "node_modules/semver/functions/patch.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module.exports = patch;
  }
});

// node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "node_modules/semver/functions/prerelease.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module.exports = prerelease;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/semver/functions/compare.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module.exports = compare;
  }
});

// node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "node_modules/semver/functions/rcompare.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module.exports = rcompare;
  }
});

// node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "node_modules/semver/functions/compare-loose.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module.exports = compareLoose;
  }
});

// node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "node_modules/semver/functions/compare-build.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module.exports = compareBuild;
  }
});

// node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "node_modules/semver/functions/sort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module.exports = sort;
  }
});

// node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "node_modules/semver/functions/rsort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module.exports = rsort;
  }
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "node_modules/semver/functions/gt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module.exports = gt;
  }
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "node_modules/semver/functions/lt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module.exports = lt;
  }
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "node_modules/semver/functions/eq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module.exports = eq;
  }
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "node_modules/semver/functions/neq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module.exports = neq;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/semver/functions/gte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module.exports = gte;
  }
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "node_modules/semver/functions/lte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module.exports = lte;
  }
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "node_modules/semver/functions/cmp.js"(exports, module) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module.exports = cmp;
  }
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "node_modules/semver/functions/coerce.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module.exports = coerce;
  }
});

// node_modules/semver/functions/truncate.js
var require_truncate = __commonJS({
  "node_modules/semver/functions/truncate.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var constants = require_constants();
    var SemVer = require_semver();
    var truncate = (version, truncation, options) => {
      if (!constants.RELEASE_TYPES.includes(truncation)) {
        return null;
      }
      const clonedVersion = cloneInputVersion(version, options);
      return clonedVersion && doTruncation(clonedVersion, truncation);
    };
    var cloneInputVersion = (version, options) => {
      const versionStringToParse = version instanceof SemVer ? version.version : version;
      return parse(versionStringToParse, options);
    };
    var doTruncation = (version, truncation) => {
      if (isPrerelease(truncation)) {
        return version.version;
      }
      version.prerelease = [];
      switch (truncation) {
        case "major":
          version.minor = 0;
          version.patch = 0;
          break;
        case "minor":
          version.patch = 0;
          break;
      }
      return version.format();
    };
    var isPrerelease = (type) => {
      return type.startsWith("pre");
    };
    module.exports = truncate;
  }
});

// node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "node_modules/semver/internal/lrucache.js"(exports, module) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module.exports = LRUCache;
  }
});

// node_modules/semver/classes/range.js
var require_range = __commonJS({
  "node_modules/semver/classes/range.js"(exports, module) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first2 = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first2];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        range = range.replace(BUILDSTRIPRE, "");
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      src,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      const z2 = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z2} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0${z2} <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z2 = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z2} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z2} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z2} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        if (invalidXRangeOrder(M, m, p)) {
          return comp;
        }
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "node_modules/semver/classes/comparator.js"(exports, module) {
    "use strict";
    var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "node_modules/semver/functions/satisfies.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module.exports = satisfies;
  }
});

// node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "node_modules/semver/ranges/to-comparators.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module.exports = toComparators;
  }
});

// node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "node_modules/semver/ranges/max-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module.exports = maxSatisfying;
  }
});

// node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "node_modules/semver/ranges/min-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module.exports = minSatisfying;
  }
});

// node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "node_modules/semver/ranges/min-version.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module.exports = minVersion;
  }
});

// node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "node_modules/semver/ranges/valid.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module.exports = validRange;
  }
});

// node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "node_modules/semver/ranges/outside.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module.exports = outside;
  }
});

// node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "node_modules/semver/ranges/gtr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, ">", options);
    module.exports = gtr;
  }
});

// node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "node_modules/semver/ranges/ltr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, "<", options);
    module.exports = ltr;
  }
});

// node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "node_modules/semver/ranges/intersects.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module.exports = intersects;
  }
});

// node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "node_modules/semver/ranges/simplify.js"(exports, module) {
    "use strict";
    var satisfies = require_satisfies();
    var compare = require_compare();
    module.exports = (versions, range, options) => {
      const set = [];
      let first2 = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version of v) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!first2) {
            first2 = version;
          }
        } else {
          if (prev) {
            set.push([first2, prev]);
          }
          prev = null;
          first2 = null;
        }
      }
      if (first2) {
        set.push([first2, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "node_modules/semver/ranges/subset.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !c.test(gt.semver)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !c.test(lt.semver)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    };
    module.exports = subset;
  }
});

// node_modules/semver/index.js
var require_semver2 = __commonJS({
  "node_modules/semver/index.js"(exports, module) {
    "use strict";
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var truncate = require_truncate();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module.exports = {
      parse,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      truncate,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
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
    const identity = (connection) => JSON.stringify([
      connection.integrationId,
      connection.authMethod,
      connection.credentialRef,
      connection.profile?.baseURL,
      connection.profile?.api,
      connection.headerRefs
    ]);
    return identity(current) === identity(binding);
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
          ...model.contributor ? { contributor: true } : {},
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
    const optIn = choice.fast || choice.contributor || choice.discovered;
    const field = choice.fast ? "enabledFastModels" : choice.contributor ? "enabledContributorModels" : choice.discovered ? "enabledDiscoveredModels" : "disabledModels";
    const selected = new Set(profile2[field] ?? []);
    if (optIn ? enabled : !enabled) selected.add(model);
    else selected.delete(model);
    const changes = { [field]: [...selected] };
    if (choice.contributor && connection && enabled) {
      const native = this.catalog(provider, profile2, connection.connectionId).find((entry) => entry.id === model)?.model;
      if (native?.id.endsWith("-contributor") && profile2.disabledModels?.includes(native.id)) {
        changes.disabledModels = profile2.disabledModels.filter((id) => id !== native.id);
      }
    }
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
  if (broker.connections && ["models", "refresh-models"].includes(method)) broker.connections.guard(payload, { optional: true });
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
var import_semver = __toESM(require_semver2(), 1);
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
  version: "0.7.4",
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
    "THIRD_PARTY_NOTICES.md",
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
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-api-remotes"
      ],
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "@deepseek-ai/dsh-client-ui-primitives"
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
    "@deepseek-ai/dsh-app-boot": ">=0.2.1-alpha.2 <0.3.0-0",
    "@deepseek-ai/dsh-attachment": ">=0.2.1-alpha.2 <0.3.0-0",
    "@deepseek-ai/dsh-brand": ">=0.2.1-alpha.2 <0.3.0-0",
    "@deepseek-ai/dsh-credentials": ">=0.2.1-alpha.2 <0.3.0-0",
    "@deepseek-ai/dsh-launch-environment": ">=0.2.1-alpha.2 <0.3.0-0",
    "@deepseek-ai/dsh-llm": ">=0.2.1-alpha.2 <0.3.0-0",
    "@deepseek-ai/dsh-timeout": ">=0.2.1-alpha.2 <0.3.0-0",
    "@deepseek-ai/dsh-util-values": ">=0.2.1-alpha.2 <0.3.0-0",
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
    "test:install": "node scripts/install-check.mjs",
    "test:peers": "node scripts/dsh-peer-check.mjs",
    "test:boot": "node scripts/host-boot-check.mjs"
  },
  devDependencies: {
    clsx: "^2.1.1",
    esbuild: "0.28.2",
    immer: "^10.2.0",
    playwright: "^1.56.1",
    react: "18.3.1",
    "react-dom": "18.3.1",
    semver: "^7.8.5",
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
var DSH_SERIES_FLOOR = "0.2.1-alpha.2";
var DSH_NEXT_SERIES = "0.3.0-0";
function boundedComparator(item, direction) {
  const exact = (item.operator === "" || item.operator === "=") && typeof item.semver?.version === "string";
  if (exact) return true;
  if (direction === "upper") return item.operator === "<" || item.operator === "<=";
  return item.operator === ">" || item.operator === ">=";
}
function peerRangeInCurrentSeries(range) {
  let parsed;
  try {
    parsed = new import_semver.default.Range(range, { includePrerelease: true });
  } catch {
    return false;
  }
  if (!parsed.set?.length) return false;
  const shaped = parsed.set.every(
    (comparators) => comparators.some((item) => boundedComparator(item, "lower")) && comparators.some((item) => boundedComparator(item, "upper"))
  );
  if (!shaped) return false;
  const options = { includePrerelease: true };
  try {
    if (import_semver.default.intersects(range, `<${DSH_SERIES_FLOOR}`, options)) return false;
    if (import_semver.default.intersects(range, `>=${DSH_NEXT_SERIES}`, options)) return false;
  } catch {
    return false;
  }
  return true;
}
function dshPeerSatisfied(range, runtime) {
  semanticVersion(runtime);
  if (typeof range !== "string") return false;
  const text2 = range.trim();
  if (text2 === "" || text2.startsWith("workspace:") || !peerRangeInCurrentSeries(text2)) return false;
  try {
    return import_semver.default.satisfies(runtime, text2, { includePrerelease: true });
  } catch {
    return false;
  }
}
function checkCompatibility(packageJson, candidate, runtime) {
  semanticVersion(runtime);
  if (!packageJson || packageJson.name !== PACKAGE || packageJson.version !== candidate.version || typeof packageJson.dsh?.bundle?.patch !== "string") throw new Error("metadata");
  const peers = Object.entries(packageJson.peerDependencies ?? {}).filter(([name2]) => name2 === "@deepseek-ai/dsh" || name2.startsWith("@deepseek-ai/dsh-"));
  if (!peers.length || peers.some(([, range]) => typeof range !== "string")) throw new Error("compatibility-unknown");
  if (peers.some(([, range]) => !dshPeerSatisfied(range, runtime))) throw new Error("incompatible");
  return runtime;
}
function bundleRecord(list, name2) {
  return list?.find((item) => item?.name === name2);
}
function installNeedsRestore(result) {
  if (!result) return true;
  if (result.application === "cancelled" || result.application === "overridden") return true;
  if (result.error || result.application === "failed") return true;
  if (result.packageResult && (result.packageResult.exitCode !== 0 || result.packageResult.timedOut)) return true;
  return result.application !== "applied" && result.application !== "restart-required";
}
function restoreOptions(previous) {
  const requestId = typeof previous.requestId === "function" ? previous.requestId() : previous.requestId;
  return { enabled: previous.enabled, requestId, saveExact: true };
}
function githubPin(spec, version) {
  if (typeof spec !== "string" || typeof version !== "string") return void 0;
  try {
    semanticVersion(version);
  } catch {
    return void 0;
  }
  if (spec === `github:${REPOSITORY}`) return `github:${REPOSITORY}#v${version}`;
  if (/^(?:git\+)?https:\/\/github\.com\/Aero123421\/dsh-pi-login(?:\.git)?$/.test(spec)) return `${spec}#v${version}`;
  return void 0;
}
function restoredIdentity(previous, restored, item) {
  if (!item?.installed) return "missing";
  const listed = typeof item.version === "string" ? item.version : void 0;
  const fromPrevious = typeof previous?.version === "string" ? previous.version : void 0;
  const fromResult = typeof restored?.version === "string" ? restored.version : void 0;
  if (installNeedsRestore(restored)) return "present";
  if (typeof fromPrevious !== "string" && typeof fromResult !== "string") return "unconfirmed";
  const expected = fromPrevious ?? fromResult;
  if (typeof listed !== "string" || listed !== expected) return "differs";
  if (typeof fromResult === "string" && fromResult !== listed) return "differs";
  return "match";
}
function versionDrift(result, previous, item) {
  const installedVersion = typeof item?.version === "string" ? item.version : void 0;
  const expectedVersion = typeof previous?.version === "string" ? previous.version : void 0;
  return {
    result,
    replaced: true,
    restored: false,
    versionDiffers: true,
    ...installedVersion ? { installedVersion } : {},
    ...expectedVersion ? { expectedVersion } : {}
  };
}
function settleRecovery(operation, admission) {
  if (admission?.restored) {
    operation.reason = "restored";
    operation.restoredVersion = admission.restoredVersion;
    operation.status = "failed";
    return true;
  }
  if (admission?.versionDiffers) {
    operation.reason = "version-differs";
    if (typeof admission.installedVersion === "string") operation.installedVersion = admission.installedVersion;
    if (typeof admission.expectedVersion === "string") operation.expectedVersion = admission.expectedVersion;
    operation.status = "failed";
    return true;
  }
  if (admission?.restoreFailed) {
    operation.reason = "restore-failed";
    operation.status = "failed";
    return true;
  }
  return false;
}
async function bundlePresence(manager, name2) {
  if (typeof manager?.listBundles !== "function") return "unknown";
  try {
    const list = await manager.listBundles();
    return bundleRecord(list, name2)?.installed ? "present" : "absent";
  } catch {
    return "unknown";
  }
}
async function listedBundle(manager, name2) {
  try {
    return { ok: true, item: bundleRecord(await manager.listBundles(), name2) };
  } catch {
    return { ok: false };
  }
}
function listedVersionMatches(previous, item) {
  return item?.installed === true && typeof previous?.version === "string" && item.version === previous.version;
}
function failedRestore(result) {
  return { result, replaced: true, restored: false, restoreFailed: true };
}
function admissionFromReceipt(result, previous) {
  if (!result || installNeedsRestore(result)) return void 0;
  const version = typeof result.version === "string" ? result.version : void 0;
  if (typeof version !== "string") return void 0;
  if (typeof previous?.version === "string" && version === previous.version) {
    return { result, replaced: true, restored: true, restoredVersion: version };
  }
  return versionDrift(result, previous, { installed: true, version });
}
async function reinstallOriginal(manager, name2, previous, fallbackResult) {
  if (typeof previous?.spec !== "string" || typeof manager.installBundle !== "function") {
    const listed2 = await listedBundle(manager, name2);
    if (listed2.ok && listed2.item?.installed) return versionDrift(fallbackResult, previous, listed2.item);
    return failedRestore(fallbackResult);
  }
  let again;
  try {
    again = await manager.installBundle(previous.spec, restoreOptions(previous));
  } catch {
    const listed2 = await listedBundle(manager, name2);
    if (listed2.ok && listed2.item?.installed) return versionDrift(fallbackResult, previous, listed2.item);
    return failedRestore(fallbackResult);
  }
  const listed = await listedBundle(manager, name2);
  if (listed.ok && listedVersionMatches(previous, listed.item)) {
    return { result: again, replaced: true, restored: true, restoredVersion: listed.item.version };
  }
  if (listed.ok && listed.item?.installed) return versionDrift(again, previous, listed.item);
  if (!listed.ok) return admissionFromReceipt(again, previous) ?? failedRestore(again);
  return failedRestore(again ?? fallbackResult);
}
async function installPinned(manager, name2, previous, pin, fallbackResult) {
  if (typeof manager.removeBundle !== "function") {
    return reinstallOriginal(manager, name2, previous, fallbackResult);
  }
  try {
    await manager.removeBundle(name2);
  } catch {
  }
  const cleared = await listedBundle(manager, name2);
  if (!cleared.ok || cleared.item?.installed) {
    if (cleared.ok && listedVersionMatches(previous, cleared.item)) {
      return { result: fallbackResult, replaced: true, restored: true, restoredVersion: cleared.item.version };
    }
    return reinstallOriginal(manager, name2, previous, fallbackResult);
  }
  let pinned;
  try {
    pinned = await manager.installBundle(pin, restoreOptions(previous));
  } catch {
    return reinstallOriginal(manager, name2, previous, fallbackResult);
  }
  const after = await listedBundle(manager, name2);
  if (after.ok && listedVersionMatches(previous, after.item)) {
    return { result: pinned, replaced: true, restored: true, restoredVersion: after.item.version };
  }
  if (!after.ok && !installNeedsRestore(pinned)) {
    return admissionFromReceipt(pinned, previous) ?? versionDrift(pinned, previous, { installed: true });
  }
  if (after.ok && after.item?.installed && !installNeedsRestore(pinned)) {
    return versionDrift(pinned, previous, after.item);
  }
  return reinstallOriginal(manager, name2, previous, pinned ?? fallbackResult);
}
async function restoreIfMissing(manager, name2, installed, previous) {
  if (!installNeedsRestore(installed)) return { result: installed, replaced: true, restored: false };
  if (typeof previous?.spec !== "string" || typeof manager.listBundles !== "function" || typeof manager.installBundle !== "function") {
    return { result: installed, replaced: true, restored: false, restoreFailed: true };
  }
  let list;
  try {
    list = await manager.listBundles();
  } catch {
    return { result: installed, replaced: true, restored: false, restoreFailed: true };
  }
  if (bundleRecord(list, name2)?.installed) return { result: installed, replaced: true, restored: false };
  let restored;
  try {
    restored = await manager.installBundle(previous.spec, restoreOptions(previous));
  } catch {
    return { result: installed, replaced: true, restored: false, restoreFailed: true };
  }
  let item;
  try {
    item = bundleRecord(await manager.listBundles(), name2);
  } catch {
    return { result: installed, replaced: true, restored: false, restoreFailed: true };
  }
  const identity = restoredIdentity(previous, restored, item);
  if (identity === "match") return { result: restored, replaced: true, restored: true, restoredVersion: item.version };
  if (identity === "missing") return { result: installed, replaced: true, restored: false, restoreFailed: true };
  const expected = typeof previous?.version === "string" ? previous.version : void 0;
  const listed = typeof item?.version === "string" ? item.version : void 0;
  const pin = expected && listed && listed !== expected ? githubPin(previous.spec, expected) : void 0;
  if (!pin) return versionDrift(restored, previous, item);
  return installPinned(manager, name2, previous, pin, restored);
}
async function recoverThrownInstall(manager, name2, previous) {
  if (typeof manager?.listBundles !== "function") return void 0;
  let list;
  try {
    list = await manager.listBundles();
  } catch {
    return void 0;
  }
  if (bundleRecord(list, name2)?.installed) return void 0;
  return restoreIfMissing(manager, name2, { application: "failed", error: { code: "install-failed" } }, previous);
}
async function installPreservingPackage(manager, name2, spec, options, previous) {
  let result;
  try {
    result = await manager.installBundle(spec, options);
  } catch (error) {
    const recovered = await recoverThrownInstall(manager, name2, previous);
    if (recovered) return recovered;
    throw error;
  }
  if (result?.error?.code !== "already-installed" || typeof manager.removeBundle !== "function") {
    return { result, replaced: false, restored: false };
  }
  let removed;
  try {
    removed = await manager.removeBundle(name2);
  } catch (error) {
    const recovered = await recoverThrownInstall(manager, name2, previous);
    if (recovered) return recovered;
    throw error;
  }
  if (installNeedsRestore(removed)) {
    if (await bundlePresence(manager, name2) === "absent") {
      return restoreIfMissing(manager, name2, removed ?? { application: "failed" }, previous);
    }
    if (removed?.error?.code !== "stop-profile") {
      return { result: removed ?? { application: "failed" }, replaced: true, restored: false };
    }
  }
  let installed;
  try {
    installed = await manager.installBundle(spec, options);
  } catch (error) {
    const recovered = await recoverThrownInstall(manager, name2, previous);
    if (recovered) return recovered;
    throw error;
  }
  if (!installNeedsRestore(installed)) return { result: installed, replaced: true, restored: false };
  return restoreIfMissing(manager, name2, installed, previous);
}
function packageManifest(bytes) {
  let tar;
  try {
    tar = gunzipSync(bytes, { maxOutputLength: 128 * 1024 * 1024 });
  } catch {
    throw new Error("metadata");
  }
  if (tar.length % 512 !== 0) throw new Error("metadata");
  let manifest, ended = false;
  const paths = /* @__PURE__ */ new Set();
  for (let offset = 0; offset + 512 <= tar.length; ) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      if (offset + 1024 > tar.length || !tar.subarray(offset).every((byte) => byte === 0)) throw new Error("metadata");
      ended = true;
      break;
    }
    const checksumText = header.subarray(148, 156).toString().replace(/\0.*$/, "").trim();
    const checksum = header.reduce((sum, byte, index) => sum + (index >= 148 && index < 156 ? 32 : byte), 0);
    if (!/^[0-7]+$/.test(checksumText) || checksum !== Number.parseInt(checksumText, 8)) throw new Error("metadata");
    const name2 = header.subarray(0, 100).toString().replace(/\0.*$/, "");
    const prefix = header.subarray(345, 500).toString().replace(/\0.*$/, "");
    const sizeText = header.subarray(124, 136).toString().replace(/\0.*$/, "").trim();
    if (!/^[0-7]+$/.test(sizeText)) throw new Error("metadata");
    const size = Number.parseInt(sizeText, 8);
    const next = offset + 512 + Math.ceil(size / 512) * 512;
    if (!Number.isSafeInteger(size) || next > tar.length) throw new Error("metadata");
    const path = prefix ? `${prefix}/${name2}` : name2;
    const directory = header[156] === 53;
    if (![0, 48, 53].includes(header[156]) || directory && size !== 0) throw new Error("metadata");
    const entry = directory && path.endsWith("/") ? path.slice(0, -1) : path;
    const parts = entry.split("/");
    if (parts[0] !== "package" || !directory && parts.length < 2 || parts.some((part) => !part || part === "." || part === ".." || part.includes("\\")) || paths.has(entry)) throw new Error("metadata");
    paths.add(entry);
    if (path === "package/package.json") {
      if (manifest || directory || size > 65536) throw new Error("metadata");
      try {
        manifest = JSON.parse(tar.subarray(offset + 512, offset + 512 + size).toString());
      } catch {
        throw new Error("metadata");
      }
    }
    offset = next;
  }
  if (!manifest || !ended) throw new Error("metadata");
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
    semanticVersion(bundle.version);
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
      const { dshVersion, bundle } = await this.capability();
      const requestId = this.running?.requestId ?? await this.lastOperation();
      if (requestId) return { ...await this.reconcile(requestId), dshVersion };
      return {
        ...this.base(),
        dshVersion,
        installedVersion: bundle.version,
        status: bundle.version !== this.version ? "restart-required" : "idle"
      };
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
        if (bundle.version !== this.version) {
          this.candidate = null;
          return { ...this.base(), installedVersion: bundle.version, status: "restart-required" };
        }
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
    let activeManager;
    let previous;
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
      activeManager = final.manager;
      previous = {
        spec: final.bundle.source,
        enabled: final.bundle.enabled,
        version: final.bundle.version,
        requestId: () => updateRequestId()
      };
      const admission = await installPreservingPackage(final.manager, PACKAGE, spec, {
        enabled: final.bundle.enabled,
        requestId: operation.requestId,
        saveExact: true
      }, previous);
      const result = admission.result;
      const recovered = settleRecovery(operation, admission);
      if (!recovered && (result?.error?.code === "already-installed" || admission.replaced && (result?.application === "failed" || result?.error))) {
        operation.reason = "replace";
      }
      operation.result = safeResult(result);
      if (!recovered) {
        const installed = (await final.manager.listBundles()).find((item) => item.name === PACKAGE);
        operation.status = resultState(result, operation.version, this.version, installed);
      }
    } catch (error) {
      let recovered;
      if (managerInvoked && activeManager && previous) {
        try {
          const list = await activeManager.listBundles();
          if (!bundleRecord(list, PACKAGE)?.installed) {
            recovered = await restoreIfMissing(activeManager, PACKAGE, { application: "failed", error: { code: "install-failed" } }, previous);
          }
        } catch {
          recovered = void 0;
        }
      }
      if (settleRecovery(operation, recovered)) {
        operation.result = safeResult(recovered.result);
      } else {
        operation.status = managerInvoked ? "unknown" : "failed";
        operation.reason = reasonOf(error);
      }
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
    const recovery = operation.reason === "restored" || operation.reason === "restore-failed" || operation.reason === "version-differs";
    if (operation.result && !recovery) operation.status = resultState(operation.result, operation.version, this.version, bundle);
    if (recovery) operation.status = "failed";
    if (!recovery && operation.result && bundle?.installed && !bundle.error && !bundle.readOnlyReason && compareVersions(installed, operation.version) > 0) {
      return {
        ...this.base(),
        ...operation,
        installedVersion: installed,
        // The recorded operation is older than the bundle now running. That is
        // not a settings override of this operation's own install.
        status: this.version === installed ? "superseded" : "restart-required"
      };
    }
    if (["installing", "restart-required", "unknown", "applied"].includes(operation.status) && this.version === operation.version) {
      operation.status = bundle?.installed && !bundle.error && !bundle.readOnlyReason && installed === operation.version ? "applied" : "unknown";
    }
    const shown = typeof installed === "string" ? installed : operation.installedVersion;
    return { ...this.base(), ...operation, installedVersion: shown };
  }
  dispose() {
    this.closed = true;
    this.abort.abort();
  }
};

// src/connections.mjs
import { createHash as createHash2 } from "node:crypto";
import { isDeepStrictEqual } from "node:util";

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
  register(owner, ownRegistration) {
    if (this.closed || !ID.test(owner.integrationId) || this.integrations.has(owner.integrationId)) throw new RegistryError("integration-conflict");
    if (typeof owner.listServices !== "function" || typeof owner.listConnections !== "function") throw new RegistryError("invalid-integration");
    this.integrations.set(owner.integrationId, owner);
    this.emit("registered", owner.integrationId);
    const unregister = () => {
      if (this.integrations.get(owner.integrationId) !== owner) return;
      this.integrations.delete(owner.integrationId);
      for (const [routeId, entry] of this.routes) if (entry.integrationId === owner.integrationId) this.routes.delete(routeId);
      this.emit("unregistered", owner.integrationId);
    };
    try {
      if (ownRegistration !== void 0) {
        if (typeof ownRegistration !== "function") throw new RegistryError("invalid-integration");
        ownRegistration(unregister);
      }
    } catch (error) {
      unregister();
      throw error;
    }
    return unregister;
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
      ...Array.isArray(service.apis) ? { apis: service.apis.filter((api) => typeof api === "string") } : {},
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

// src/sdk-service.mjs
var MUSE_CODE_INTEGRATION_ID = "meta-muse-code";
var MUSE_CODE_SERVICE_ID = "muse-code";
function sdkServiceOf(connection) {
  if (connection.integrationId === "pi") return connection.serviceId;
  if (connection.integrationId === MUSE_CODE_INTEGRATION_ID && connection.serviceId === MUSE_CODE_SERVICE_ID) return "meta";
  return void 0;
}

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
  constructor({ settings, credentials, registry, connectionSnapshot, validateProfile = () => {
  }, onChange = () => {
  }, legacyProviders = () => ({}), extraConnections = async () => [] }) {
    Object.assign(this, { settings, credentials, registry, connectionSnapshot, validateProfile, onChange, legacyProviders, extraConnections });
    this.closed = false;
    this.pendingLogins = /* @__PURE__ */ new Set();
    this.pendingDeletes = /* @__PURE__ */ new Set();
    this.pendingCredentialWrites = /* @__PURE__ */ new Set();
    this.verified = /* @__PURE__ */ new Map();
  }
  section() {
    return this.settings.describe({ redactSecrets: false }).find((row) => row.ns === NS2);
  }
  // SettingsForms describes only ACTIVE fibers. Catalog resolution also runs
  // during apply(), so read the owning fiber's live Config before activation.
  raw() {
    return this.connectionSnapshot?.() ?? this.section()?.value?.connections ?? {};
  }
  lookup(connectionId2, { allowDeleting = false } = {}) {
    if (this.closed || typeof connectionId2 !== "string" || !Object.hasOwn(this.raw(), connectionId2)) throw new ConnectionError("connection-unavailable");
    if (this.raw()[connectionId2].deletionPending && !allowDeleting) throw new ConnectionError("connection-deleting");
    return { ...structuredClone(this.raw()[connectionId2]), connectionId: connectionId2 };
  }
  isCurrent(binding) {
    if (this.closed) return false;
    const connection = this.raw()[binding.connectionId];
    return this.registry.isCurrent(binding) && !!connection && !connection.deletionPending && connection.integrationId === binding.integrationId && connection.serviceId === binding.serviceId && connection.credentialRecordId === binding.credentialRecordId && connection.credentialGeneration === binding.credentialGeneration;
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
    if (!(optional && payload.profileKey === void 0 && payload.generation === void 0) && (payload.profileKey !== this.registry.profileKey || payload.generation !== this.registry.generation)) throw new ConnectionError("profile-changed");
    if (payload.credentialGeneration !== void 0) {
      const current = this.raw()[payload.connectionId];
      if (!current) throw new ConnectionError("connection-unavailable");
      if (!Number.isSafeInteger(payload.credentialGeneration) || payload.credentialGeneration !== current.credentialGeneration) throw new ConnectionError("connection-changed");
    }
  }
  writable(revision) {
    if (this.closed) throw new ConnectionError("connection-unavailable");
    const section = this.section();
    if (!section || section.writable === false) throw new ConnectionError("read-only");
    if (!Number.isSafeInteger(revision) || section.revision !== revision) throw new ConnectionError("settings-changed");
    return section;
  }
  validate(connections, previous) {
    const routes = /* @__PURE__ */ new Set();
    const records = /* @__PURE__ */ new Set();
    for (const [id, connection] of Object.entries(connections)) {
      if (!NAME.test(id) || !NAME.test(connection.routeId) || !NAME.test(connection.credentialRecordId) || routes.has(connection.routeId)) throw new ConnectionError("route-conflict");
      const record = connection.integrationId === "pi" || this.registry.integrations.has(connection.integrationId) ? this.authKey(connection) : `${connection.integrationId}/${connection.credentialRecordId}`;
      if (records.has(record)) throw new ConnectionError("credential-conflict");
      records.add(record);
      routes.add(connection.routeId);
      if (connection.credentialCleanupIds !== void 0 && (!Array.isArray(connection.credentialCleanupIds) || connection.integrationId !== "pi" && connection.credentialCleanupIds.length > 0 || connection.credentialCleanupIds.some((id2) => typeof id2 !== "string" || !NAME.test(id2) || id2 === connection.credentialRecordId))) throw new ConnectionError("invalid-request");
      if (previous && isDeepStrictEqual(connection, previous[id])) continue;
      const service = this.registry.service(connection.integrationId, connection.serviceId);
      if (!service.capabilities.settings) throw new ConnectionError("unsupported");
      if (!["oauth", "api-key"].includes(connection.authMethod)) throw new ConnectionError("unsupported-method");
      if (connection.authMethod === "oauth" && !service.methods.some((entry) => entry.id === "oauth")) throw new ConnectionError("unsupported-method");
      if (connection.authMethod === "api-key" && !service.methods.some((entry) => entry.id === "api-key")) throw new ConnectionError("unsupported-method");
      text(connection.displayName);
      if (connection.profile?.headers && Object.keys(connection.profile.headers).length) throw new ConnectionError("secret-headers-require-reference");
      if (connection.headerRefs) validateHeaderRefs(connection.headerRefs);
      if (connection.integrationId !== "pi") {
        const owner = this.registry.owner(connection.integrationId);
        if (!owner.validateConnection) throw new ConnectionError("owner-managed");
        owner.validateConnection({ ...connection, connectionId: id });
      }
      if (sdkServiceOf(connection) !== void 0) this.validateProfile(connection);
    }
  }
  async write(connections, revision, extra = [], token2 = this.registry.token()) {
    if (this.closed || !this.registry.isCurrent(token2)) throw new ConnectionError("profile-changed");
    this.writable(revision);
    this.validate(connections, this.raw());
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
    for (const integrationId of this.registry.integrations.keys()) this.registry.replaceConnections(integrationId, this.raw());
    this.registry.emit("changed", void 0, connectionId2);
    this.onChange(connectionId2);
  }
  async list() {
    const token2 = this.registry.token();
    const section = this.section();
    const connections = await Promise.all(Object.keys(this.raw()).map(async (id) => {
      const connection = this.lookup(id, { allowDeleting: true });
      try {
        const service = this.registry.service(connection.integrationId, connection.serviceId);
        const owner = this.registry.owner(connection.integrationId);
        const key = this.authKey(connection);
        const record = connection.integrationId === "pi" ? await this.credentials.describeRecord(key) : await owner.describeConnection(connection);
        const configured = connection.credentialRef ? !!(await this.credentials.describe?.(connection.credentialRef))?.configured : record.configured === true;
        const stored = sdkServiceOf(connection) !== void 0 && connection.authMethod === "oauth" && configured ? await this.credentials.readRecord(key) : void 0;
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
          enabled: !connection.deletionPending && connection.enabled !== false,
          deletionPending: connection.deletionPending === true,
          credentialCleanupPending: !!connection.credentialCleanupIds?.length,
          inFlight: this.pendingLogins.has(id) || this.pendingDeletes.has(id) || this.pendingCredentialWrites.has(id),
          methods: service.methods.filter((method) => method.id === connection.authMethod),
          authStatus: connection.deletionPending ? "deletion-pending" : this.pendingLogins.has(id) ? "updating" : expired ? "expired" : configured && isVerified ? "verified" : record.authStatus ?? (configured ? "saved" : "auth-required"),
          capabilities: connection.deletionPending ? { auth: false, models: false, usage: false, settings: true } : service.capabilities,
          ...isVerified ? { verifiedAt: verified.verifiedAt } : {},
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
          enabled: !connection.deletionPending && connection.enabled !== false,
          deletionPending: connection.deletionPending === true,
          credentialCleanupPending: !!connection.credentialCleanupIds?.length,
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
    this.validate(next, this.raw());
    const secret = input.apiKey === void 0 ? void 0 : text(input.apiKey, 16384);
    if (secret !== void 0 && input.authMethod !== "api-key") throw new ConnectionError("unsupported-method");
    this.pendingCredentialWrites.add(id);
    let metadataCommitted = false;
    try {
      await this.write(next, revision, [], token2);
      metadataCommitted = true;
      if (secret !== void 0) {
        const current = () => {
          if (this.closed || !this.registry.isCurrent(token2)) throw new ConnectionError("profile-changed");
          const saved = this.raw()[id];
          if (!saved || saved.deletionPending || saved.credentialRecordId !== id || saved.credentialGeneration !== 0) throw new ConnectionError("connection-changed");
        };
        current();
        try {
          await this.credentials.modifyRecord(credentialKey(id), () => {
            current();
            return { kind: "api-key", key: secret };
          });
        } catch (cause) {
          if (cause instanceof ConnectionError) {
            cause.metadataCommitted = true;
            throw cause;
          }
          const error = new ConnectionError("credential-save-failed");
          error.cause = cause;
          error.metadataCommitted = true;
          throw error;
        }
        current();
        await this.write({ ...this.raw(), [id]: { ...this.raw()[id], enabled: true } }, this.section()?.revision, [], token2);
      }
    } catch (cause) {
      if (!metadataCommitted || ["profile-changed", "connection-changed", "credential-save-failed"].includes(cause?.code)) throw cause;
      const error = new ConnectionError("credential-save-failed");
      error.cause = cause;
      error.metadataCommitted = true;
      throw error;
    } finally {
      this.pendingCredentialWrites.delete(id);
    }
    return { connectionId: id, saved: true };
  }
  async update(connectionId2, patch, revision) {
    const token2 = this.registry.token();
    const section = this.writable(revision);
    const connection = this.lookup(connectionId2);
    if (this.pendingCredentialWrites.has(connectionId2) || this.pendingDeletes.has(connectionId2)) throw new ConnectionError("busy");
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) throw new ConnectionError("invalid-request");
    const allowed = /* @__PURE__ */ new Set(["displayName", "enabled", "apiKey", "endpointUrl", "api", "headerRefs", "profile", "authMethod"]);
    if (Object.keys(patch).some((key) => !allowed.has(key))) throw new ConnectionError("invalid-request");
    if (connection.integrationId !== "pi" && ["apiKey", "endpointUrl", "api", "headerRefs", "authMethod"].some((key) => patch[key] !== void 0)) throw new ConnectionError("owner-managed");
    if (sdkServiceOf(connection) === void 0 && patch.profile !== void 0) throw new ConnectionError("owner-managed");
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
      const fields = ["disabledModels", "enabledFastModels", "enabledDiscoveredModels", "enabledContributorModels", "reasoning"];
      if (Object.keys(patch.profile).some((key) => !fields.includes(key))) throw new ConnectionError("invalid-request");
      Object.assign(connection.profile, patch.profile);
    }
    const oldRecordId = connection.credentialRecordId;
    const cleanupIds = new Set(connection.credentialCleanupIds ?? []);
    let staged = false;
    this.pendingCredentialWrites.add(connectionId2);
    try {
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
        const secret = text(patch.apiKey, 16384);
        this.validate({ ...this.raw(), [connectionId2]: connection }, this.raw());
        const newRecordId = newConnectionId();
        const original = this.raw()[connectionId2];
        const generation = original.credentialGeneration + 1;
        await this.write({ ...this.raw(), [connectionId2]: { ...original, credentialGeneration: generation, credentialCleanupIds: [...cleanupIds, newRecordId] } }, revision, [], token2);
        staged = true;
        const stagedConnection = structuredClone(this.raw()[connectionId2]);
        const current = () => {
          if (this.closed || !this.registry.isCurrent(token2)) throw new ConnectionError("profile-changed");
          const saved = this.raw()[connectionId2];
          if (!saved || !isDeepStrictEqual(saved, stagedConnection)) throw new ConnectionError("connection-changed");
        };
        current();
        try {
          await this.credentials.modifyRecord(credentialKey(newRecordId), () => {
            current();
            return { kind: "api-key", key: secret };
          });
        } catch (cause) {
          if (cause instanceof ConnectionError) {
            cause.metadataCommitted = true;
            throw cause;
          }
          const error = new ConnectionError("credential-save-failed");
          error.cause = cause;
          error.metadataCommitted = true;
          throw error;
        }
        current();
        connection.credentialRecordId = newRecordId;
        connection.credentialGeneration++;
        delete connection.credentialRef;
        delete connection.profile.apiKeyEnv;
      }
      if (connection.integrationId === "pi" && connection.credentialRecordId !== oldRecordId) cleanupIds.add(oldRecordId);
      if (cleanupIds.size) connection.credentialCleanupIds = [...cleanupIds];
      else delete connection.credentialCleanupIds;
      delete connection.connectionId;
      await this.write({ ...this.raw(), [connectionId2]: connection }, staged ? this.section()?.revision : revision, [], token2);
    } finally {
      this.pendingCredentialWrites.delete(connectionId2);
    }
    if (connection.credentialCleanupIds?.length) await this.cleanupCredentials(connectionId2, this.section()?.revision);
    return { saved: true };
  }
  async clone(connectionId2, displayName, revision) {
    const token2 = this.registry.token();
    const original = this.lookup(connectionId2);
    if (this.pendingCredentialWrites.has(connectionId2)) throw new ConnectionError("busy");
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
    delete copy.museCatalog;
    delete copy.credentialCleanupIds;
    delete copy.profile.apiKeyEnv;
    delete copy.profile.headers;
    await this.write({ ...this.raw(), [id]: copy }, revision, [], token2);
    return { saved: true, connectionId: id };
  }
  /** Retry only the Pi record IDs durably retired by this connection. */
  async cleanupCredentials(connectionId2, revision) {
    const token2 = this.registry.token();
    this.writable(revision);
    const connection = this.lookup(connectionId2);
    if (connection.integrationId !== "pi") throw new ConnectionError("owner-managed");
    if (this.pendingCredentialWrites.has(connectionId2) || this.pendingDeletes.has(connectionId2)) throw new ConnectionError("busy");
    this.pendingCredentialWrites.add(connectionId2);
    const current = () => {
      if (this.closed || !this.registry.isCurrent(token2)) throw new ConnectionError("profile-changed");
      const saved = this.lookup(connectionId2);
      if (saved.credentialRecordId !== connection.credentialRecordId || saved.credentialGeneration !== connection.credentialGeneration) throw new ConnectionError("connection-changed");
      return saved;
    };
    try {
      for (const id of connection.credentialCleanupIds ?? []) {
        current();
        const key = credentialKey(id);
        if (Object.values(this.raw()).some((value) => value.credentialRecordId === id || (value.integrationId === "pi" || this.registry.integrations.has(value.integrationId)) && this.authKey(value) === key)) throw new ConnectionError("credential-conflict");
        try {
          await this.credentials.deleteRecord(key);
        } catch (cause) {
          const error = new ConnectionError("credential-cleanup-failed");
          error.cause = cause;
          error.metadataCommitted = true;
          throw error;
        }
        const saved = current();
        saved.credentialCleanupIds = saved.credentialCleanupIds.filter((value) => value !== id);
        if (!saved.credentialCleanupIds.length) delete saved.credentialCleanupIds;
        delete saved.connectionId;
        await this.write({ ...this.raw(), [connectionId2]: saved }, this.section()?.revision, [], token2);
      }
      return { saved: true };
    } finally {
      this.pendingCredentialWrites.delete(connectionId2);
    }
  }
  async delete(connectionId2, revision) {
    const token2 = this.registry.token();
    this.writable(revision);
    const connection = this.lookup(connectionId2, { allowDeleting: true });
    if (this.pendingDeletes.has(connectionId2) || this.pendingCredentialWrites.has(connectionId2)) throw new ConnectionError("busy");
    this.pendingDeletes.add(connectionId2);
    try {
      if (!connection.deletionPending) {
        connection.deletionPending = true;
        connection.enabled = false;
        connection.credentialGeneration++;
        delete connection.connectionId;
        await this.write({ ...this.raw(), [connectionId2]: connection }, revision, [], token2);
      }
      const current = () => {
        if (this.closed || !this.registry.isCurrent(token2)) throw new ConnectionError("profile-changed");
        const saved = this.raw()[connectionId2];
        if (!saved?.deletionPending || saved.credentialRecordId !== connection.credentialRecordId || saved.credentialGeneration !== connection.credentialGeneration || saved.integrationId !== connection.integrationId) throw new ConnectionError("connection-changed");
      };
      current();
      try {
        for (const recordId of /* @__PURE__ */ new Set([connection.credentialRecordId, ...connection.credentialCleanupIds ?? []])) {
          current();
          const key = this.authKey({ ...connection, credentialRecordId: recordId });
          if (Object.entries(this.raw()).some(([id, value]) => id !== connectionId2 && (value.credentialRecordId === recordId || (value.integrationId === "pi" || this.registry.integrations.has(value.integrationId)) && this.authKey(value) === key))) throw new ConnectionError("credential-conflict");
          if (connection.integrationId === "pi") await this.credentials.deleteRecord(key);
          else await this.registry.owner(connection.integrationId).deleteCredentials(connection);
        }
      } catch (cause) {
        const error = new ConnectionError("credential-delete-failed");
        error.cause = cause;
        throw error;
      }
      current();
      const next = { ...this.raw() };
      delete next[connectionId2];
      await this.write(next, this.section()?.revision, [], token2);
      return { deleted: true };
    } finally {
      this.pendingDeletes.delete(connectionId2);
    }
  }
  /** Store the account catalog a Muse Code refresh returned; no model is enabled by this. */
  async saveMuseCatalog(binding, rows, { signal } = {}) {
    signal?.throwIfAborted();
    if (!this.isCurrent(binding)) throw new ConnectionError("connection-changed");
    const token2 = this.registry.token();
    const connection = this.lookup(binding.connectionId);
    connection.museCatalog = structuredClone(rows);
    delete connection.museCode;
    delete connection.connectionId;
    await this.write({ ...this.raw(), [binding.connectionId]: connection }, this.section()?.revision, [], token2);
  }
  async beginLogin(connectionId2) {
    const token2 = this.registry.token();
    const connection = this.lookup(connectionId2);
    if (this.pendingLogins.has(connectionId2) || this.pendingCredentialWrites.has(connectionId2)) throw new ConnectionError("busy");
    this.pendingLogins.add(connectionId2);
    const section = this.section();
    connection.credentialGeneration++;
    if (connection.integrationId === "meta-muse-code") {
      delete connection.museCatalog;
      delete connection.museCode;
    }
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
    this.pendingDeletes.clear();
    this.pendingCredentialWrites.clear();
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
  const connectionMutations = ["connection-create", "connection-update", "connection-clone", "connection-delete", "connection-cleanup"];
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
                else if (method === "connection-cleanup") value = await options.connections.cleanupCredentials(payload.connectionId, payload.revision);
                else value = await options.connections.delete(payload.connectionId, payload.revision);
              } else if (method === "connection-list") {
                if (!options.connections) throw new LoginError("unavailable");
                value = await options.connections.list();
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
          const code = error instanceof LoginError || error instanceof ConnectionError || error instanceof RegistryError ? error.code : "unavailable";
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

// src/catalog-metadata.mjs
var DISCOVERED_MODEL = /* @__PURE__ */ Symbol("dsh-pi-login/discovered-model");
var MUSE_CONTRIBUTOR = /* @__PURE__ */ Symbol("dsh-pi-login/muse-contributor");
var MUSE_CONTRIBUTOR_ONLY = /* @__PURE__ */ Symbol("dsh-pi-login/muse-contributor-only");
var MUSE_CONTRIBUTOR_HEADER = "x-tbh-contributor-mode";

// src/runtime/fast.ts
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
function contributorModelId(model) {
  return `${model}::contributor`;
}
function modelChoices(provider, models, profile2, discoveredIds = /* @__PURE__ */ new Set()) {
  const ids = new Set(models.map((model) => model.id));
  const byId = new Map(models.map((model) => [model.id, model]));
  const configuredIds = new Set(profile2.models?.map((model) => model.id) ?? []);
  return models.flatMap((model) => {
    const supported = supportsFastTier(provider, model);
    const muse = model[MUSE_CONTRIBUTOR];
    if (muse !== void 0) {
      const contributorOnly = model[MUSE_CONTRIBUTOR_ONLY] === true;
      if (contributorOnly) {
        const base = byId.get(model.id.slice(0, -"-contributor".length));
        if (base && base[MUSE_CONTRIBUTOR] !== void 0) return [];
        return [{
          id: model.id,
          name: model.name,
          model,
          contributor: true,
          enabled: profile2.enabledContributorModels?.includes(model.id) === true && !profile2.disabledModels?.includes(model.id),
          headers: { [MUSE_CONTRIBUTOR_HEADER]: "1" }
        }];
      }
      const standard = {
        id: model.id,
        name: model.name,
        model,
        enabled: !profile2.disabledModels?.includes(model.id),
        headers: { [MUSE_CONTRIBUTOR_HEADER]: "0" }
      };
      const native = byId.get(`${model.id}-contributor`);
      const nativeContributor = native && native[MUSE_CONTRIBUTOR_ONLY] === true ? native : void 0;
      if (!muse && !nativeContributor) return [standard];
      const id2 = contributorModelId(model.id);
      if (ids.has(id2)) throw new PiAiCatalogError(`Contributor model ID "${id2}" conflicts with a configured model`);
      return [standard, {
        id: id2,
        name: `${model.name} Contributor`,
        model: nativeContributor ?? model,
        contributor: true,
        enabled: profile2.enabledContributorModels?.includes(id2) === true && !(nativeContributor && profile2.disabledModels?.includes(nativeContributor.id)),
        headers: { [MUSE_CONTRIBUTOR_HEADER]: "1" }
      }];
    }
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
  enabledContributorModels: z.array(z.string()),
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
    credentialCleanupIds: z.array(z.string()),
    credentialRef: z.string().role("credential-ref"),
    headerRefs: z.dict(z.string().role("credential-ref")),
    enabled: z.boolean().default(true),
    deletionPending: z.boolean(),
    legacyRoute: z.boolean(),
    integrationLabel: z.string(),
    serviceLabel: z.string(),
    profile,
    museCode: z.object({ contributorMode: z.boolean(), modelId: z.string() }),
    museCatalog: z.array(z.object({
      id: z.string().required(),
      name: z.string().required(),
      contextWindow: z.natural().required(),
      maxTokens: z.natural().required(),
      input: z.array(z.union(["text", "image"])),
      efforts: z.array(z.string()),
      contributor: z.boolean()
    }))
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
        const previous = toolIds.get(event.contentIndex);
        const partial = event.partial.content[event.contentIndex];
        const known = partial?.type === "toolCall" ? { id: partial.id || previous?.id || "", name: partial.name || previous?.name || "" } : previous;
        if (known !== void 0) toolIds.set(event.contentIndex, known);
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
  const serviceId = profile2.sdkServiceId ?? profile2.serviceId;
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
          headers: { ...requestHeaders({ ...profile2.headers, ...storedHeaders }), ...choice.headers, ...accountAuthorization?.headers }
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
    if (connection.deletionPending) continue;
    const sdkService = sdkServiceOf(connection);
    if (sdkService === void 0) continue;
    const museCode = connection.integrationId === MUSE_CODE_INTEGRATION_ID;
    if (!connectionId2 || !connection.serviceId || !connection.routeId || !connection.credentialRecordId) {
      throw new Error("llm-pi-ai: connection identity must be non-empty");
    }
    if (!Number.isSafeInteger(connection.credentialGeneration) || connection.credentialGeneration < 0) {
      throw new Error(`llm-pi-ai: connection "${connectionId2}" has an invalid credential generation`);
    }
    if (routes.has(connection.routeId)) throw new Error(`llm-pi-ai: duplicate connection route "${connection.routeId}"`);
    const installed = catalogs?.(connection.serviceId, connectionId2) ?? (museCode ? /* @__PURE__ */ new Map() : void 0);
    const defaults = installed ?? catalogModels(sdkService);
    const native = catalogModels(sdkService);
    const unverified = /* @__PURE__ */ new Set();
    let source = connection.profile;
    if (!connection.legacyRoute && connection.routeId !== connection.serviceId && source.baseURL !== void 0) {
      const endpoint = source.baseURL.replace(/\/+$/, "");
      for (const id of /* @__PURE__ */ new Set([...defaults.keys(), ...source.models?.map((model2) => model2.id) ?? []])) {
        const baseline = native.get(id)?.baseUrl ?? catalogProvider(sdkService)?.baseUrl;
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
    const profile2 = resolveProfiles({ [sdkService]: {
      ...source,
      displayName: connection.displayName,
      ...connection.credentialRef === void 0 ? {} : { apiKeyEnv: connection.credentialRef }
    } }, museCode && installed?.size === 0 ? "deferred" : validation, () => installed).get(sdkService);
    const model = profile2.piProvider?.getModels()[0];
    routes.set(connection.routeId, {
      ...profile2,
      provider: connection.routeId,
      connectionId: connectionId2,
      integrationId: connection.integrationId,
      serviceId: connection.serviceId,
      sdkServiceId: sdkService,
      credentialRecordId: connection.credentialRecordId,
      credentialGeneration: connection.credentialGeneration,
      authMethod: connection.authMethod,
      ...connection.credentialRef === void 0 ? {} : { credentialRef: connection.credentialRef },
      ...connection.headerRefs === void 0 ? {} : { headerRefs: { ...connection.headerRefs } },
      integrationLabel: connection.integrationLabel ?? (connection.integrationId === "pi" ? "Pi" : museCode ? "Meta" : connection.integrationId),
      serviceLabel: connection.serviceLabel ?? (museCode ? "Muse Code" : catalogProvider(sdkService)?.name ?? connection.serviceId),
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
function discoveryEndpoint(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new LlmError6("model discovery needs a valid HTTP endpoint", "INVALID_DISCOVERY");
  }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new LlmError6("model discovery needs an HTTP endpoint without credentials, query, or fragment", "INVALID_DISCOVERY");
  }
  return url.href.replace(/\/+$/, "");
}
function assertDiscoveryCurrent(stored) {
  if (stored?.isCurrent?.() === false) throw new LlmError6("the saved connection changed during model discovery; retry with its current settings", "DISCOVERY_CONNECTION_CHANGED");
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
  const endpoint = discoveryEndpoint(request.baseURL);
  const url = listingUrl(endpoint, api);
  const candidate = storedProfile?.();
  assertDiscoveryCurrent(candidate);
  const matches = candidate !== void 0 && candidate.baseURL !== void 0 && discoveryEndpoint(candidate.baseURL) === endpoint && candidate.api === api;
  if (candidate !== void 0 && !matches && request.apiKey === void 0) {
    throw new LlmError6("the draft endpoint or protocol differs from the saved connection; supply a key for this draft or restore its saved endpoint", "DISCOVERY_CREDENTIAL_SCOPE");
  }
  const stored = matches ? candidate : void 0;
  const supplied = request.apiKey ?? await stored?.resolveApiKey();
  assertDiscoveryCurrent(candidate);
  if (request.signal?.aborted) throw new LlmError6("model discovery aborted by caller", "ABORTED");
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
      // Even an approved endpoint cannot delegate custom secret headers to a
      // different redirect destination.
      redirect: "error",
      headers,
      ...request.signal === void 0 ? {} : { signal: request.signal }
    });
  } catch (error) {
    if (request.signal?.aborted) {
      throw new LlmError6("model discovery aborted by caller", "ABORTED", { cause: error });
    }
    throw new LlmError6(`could not reach ${url}`, "DISCOVERY_FAILED", { cause: error });
  }
  try {
    assertDiscoveryCurrent(candidate);
  } catch (error) {
    await response.body?.cancel();
    throw error;
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
  assertDiscoveryCurrent(candidate);
  return readListing(body);
}

// src/runtime/login.ts
import { randomUUID as randomUUID5 } from "node:crypto";
import { isCredentialKeySegment as isCredentialKeySegment2 } from "@deepseek-ai/dsh-credentials";
function loginMethods(provider) {
  const methods = [];
  const oauth3 = provider?.auth.oauth;
  if (oauth3 !== void 0) methods.push({ id: "oauth", label: oauth3.loginLabel ?? oauth3.name });
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
    const [first2, ...rest] = loginMethods(provider);
    if (provider === void 0 || first2 === void 0) continue;
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
      methods: [first2, ...rest],
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
    connection.profile?.api,
    connection.deletionPending
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
      const sdkService = sdkServiceOf(connection);
      if (registered.has(id) || sdkService === void 0 || connection.deletionPending) continue;
      const provider = catalogProvider(sdkService);
      const method = loginMethods(provider).find((method2) => method2.id === connection.authMethod);
      if (provider === void 0 || method === void 0 || !isCredentialKeySegment2(connection.credentialRecordId)) continue;
      const identity = loginIdentity(connection);
      const isCurrent = () => {
        const current2 = connections()[id];
        return !disposed && ctx.get("profileContext") === profileContext && current2 !== void 0 && loginIdentity(current2) === identity;
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
            serviceId: sdkService,
            credentialRecordId: connection.credentialRecordId,
            isCurrent: () => isCurrent() && !session.signal.aborted
          });
          const models = createModels(auth);
          models.setProvider(provider);
          const type = connection.authMethod === "oauth" ? "oauth" : "api_key";
          let deviceId;
          if (sdkService === "openai" && type === "oauth") {
            const record = await ctx.credentials.modifyRecord("dsh-pi-login/installation", async (current2) => {
              session.signal.throwIfAborted();
              if (!isCurrent()) throw new Error("stale-connection");
              if (current2?.kind === "grant" && typeof current2.payload?.deviceId === "string") return current2;
              return { kind: "grant", payload: { deviceId: randomUUID5() } };
            });
            deviceId = record?.kind === "grant" ? record.payload.deviceId : void 0;
          }
          await models.login(sdkService, type, {
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
      registered.set(id, { identity, dispose: dispose2 });
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
  if (connectionMode) return [];
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
      serviceId: profile2.sdkServiceId ?? profile2.serviceId,
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
    const model = profile2.piProvider?.getModels()[0];
    const transport = (value) => ({
      connectionId: value.connectionId,
      serviceId: value.serviceId,
      credentialRecordId: value.credentialRecordId,
      credentialGeneration: value.credentialGeneration,
      apiKeyEnv: value.apiKeyEnv,
      headerRefs: value.headerRefs,
      headers: value.headers,
      baseURL: value.baseURL ?? value.piProvider?.baseUrl ?? value.piProvider?.getModels()[0]?.baseUrl,
      api: value.api ?? value.piProvider?.getModels()[0]?.api
    });
    const identity = transport(profile2);
    return {
      baseURL: profile2.baseURL ?? profile2.piProvider?.baseUrl ?? model?.baseUrl,
      api: profile2.api ?? model?.api,
      isCurrent: () => {
        const current = profiles().get(provider);
        return current !== void 0 && deepEqualJson2(transport(current), identity);
      },
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
async function readProviderJson(response, { now = Date.now(), maxBytes = 262144, allowArray = false } = {}) {
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
    const value = JSON.parse(new TextDecoder().decode(bytes));
    return allowArray && Array.isArray(value) ? value : object(value);
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
  let identity;
  if (credential.type === "oauth" && connection.serviceId === "openai-codex") {
    try {
      identity = codexAccountId(credential.access);
    } catch {
      identity = credential.refresh;
    }
  } else identity = credential.type === "oauth" ? credential.refresh : credential.key ?? JSON.stringify(credential.env ?? {});
  return createHash4("sha256").update(`${credential.type}:${identity ?? ""}`).digest("hex");
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
        const identity = fingerprint(connection, credential);
        if (entry.principal !== void 0 && entry.principal !== identity && !entry.refreshing) entry.cache.invalidate();
        if (!entry.refreshing) entry.principal = identity;
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

// src/muse-code-owner.mjs
var ID2 = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
var CONTRIBUTOR_TERMS = "https://dev.meta.ai/help/subscriptions/muse-code-contributor-mode";
function createMuseCodeOwner({ ctx, connections } = {}) {
  const recordKey = (connection) => {
    if (!ID2.test(connection?.credentialRecordId ?? "")) throw new ConnectionError("invalid-request");
    return `llm-pi-ai/${connection.credentialRecordId}`;
  };
  return {
    integrationId: MUSE_CODE_INTEGRATION_ID,
    label: "Meta",
    source: "https://dev.meta.ai/docs/muse-code",
    listServices: () => [{
      serviceId: MUSE_CODE_SERVICE_ID,
      label: "Muse Code",
      methods: [{ id: "oauth", label: "Sign in with Meta" }],
      capabilities: { auth: true, models: true, usage: true, settings: true },
      sourceTermsUrl: CONTRIBUTOR_TERMS
    }],
    listConnections: () => Object.entries(connections.raw()).filter(([, connection]) => connection.integrationId === MUSE_CODE_INTEGRATION_ID).map(([connectionId2, connection]) => ({ connectionId: connectionId2, serviceId: connection.serviceId, routeId: connection.routeId })),
    authKey: recordKey,
    routeIdFor: (id) => `muse-${id}`,
    validateConnection(connection) {
      if (connection.serviceId !== MUSE_CODE_SERVICE_ID || connection.authMethod !== "oauth" || !ID2.test(connection.credentialRecordId) || connection.credentialRef || connection.headerRefs && Object.keys(connection.headerRefs).length || connection.profile?.baseURL || connection.profile?.api || connection.profile?.apiKeyEnv) throw new ConnectionError("owner-managed");
    },
    async describeConnection(connection) {
      const description = await ctx.credentials.describeRecord(recordKey(connection));
      return { configured: description.configured === true, writable: description.writable !== false };
    },
    async deleteCredentials(connection) {
      await ctx.credentials.deleteRecord(recordKey(connection));
      await ctx.credentials.deleteRecord(`dsh-muse-code/${connection.credentialRecordId}`);
    }
  };
}

// src/external-integrations.mjs
import { createHash as createHash5 } from "node:crypto";
var ExternalIntegrationError = class extends Error {
  constructor(code = "external-unavailable") {
    super(["external-unavailable", "external-models-unsupported", "external-provider-unavailable", "external-aborted", "external-route-conflict", "external-profile-changed"].includes(code) ? code : "external-unavailable");
    this.code = this.message;
  }
};
var publicText = (value, limit = 200) => typeof value === "string" && value.length > 0 && value.length <= limit && !/[\u0000-\u001f\u007f]/.test(value) ? value : void 0;
var connectionId = (profileKey, routeId) => `x-${createHash5("sha256").update(JSON.stringify([profileKey, routeId])).digest("hex").slice(0, 32)}`;
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

// src/muse-code-catalog.mjs
import { createHash as createHash6 } from "node:crypto";
var MUSE_CODE_MODELS_URL = "https://api.meta.ai/muse-code/models";
var MUSE_CODE_KEY_URL = "https://api.meta.ai/muse-code/key";
var BASE_URL = "https://api.meta.ai/v1";
var LEVELS = ["minimal", "low", "medium", "high", "xhigh", "max"];
var ID3 = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/;
var NON_CHAT = /^(?:muse-image|muse-voice|sam-)/;
var oauth = (value) => value?.type === "oauth" && typeof value.refresh === "string" && value.refresh.length > 0;
var principalOf = (credential) => createHash6("sha256").update(credential.refresh).digest("hex");
var positive = (value) => Number.isSafeInteger(value) && value > 0 ? value : void 0;
var label3 = (value) => typeof value === "string" && value.trim() ? value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 100) : void 0;
var first = (row, keys) => keys.map((key) => row[key]).find((value) => value !== void 0 && value !== null);
function rowsOf(body) {
  const rows = Array.isArray(body) ? body : first(body, ["data", "models", "rows", "items"]);
  return Array.isArray(rows) ? rows : [];
}
function effortsOf(row) {
  const variants = first(row, ["reasoning_effort_variants", "reasoningEffortVariants", "reasoning_efforts", "reasoningEfforts", "variants"]);
  if (!Array.isArray(variants)) return void 0;
  const names = variants.map((item) => typeof item === "string" ? item : item && typeof item === "object" ? first(item, ["effort", "reasoning_effort", "reasoningEffort", "level", "id", "name"]) : void 0);
  return [...new Set(names.filter((name2) => typeof name2 === "string").map((name2) => name2.toLowerCase()))];
}
function parseMuseCatalog(body) {
  const rows = [];
  for (const row of rowsOf(body)) {
    if (!row || typeof row !== "object") continue;
    const id = first(row, ["id", "model_id", "modelId", "model"]);
    if (typeof id !== "string" || !ID3.test(id) || NON_CHAT.test(id) || rows.some((entry) => entry.id === id)) continue;
    if (row.enabled === false || ["hidden", "internal", "disabled"].includes(row.visibility)) continue;
    const efforts = effortsOf(row);
    rows.push({
      id,
      name: label3(first(row, ["display_label", "displayLabel", "display_name", "displayName", "name"])) ?? id,
      contextWindow: positive(first(row, ["context_limit", "contextLimit", "context_window", "contextWindow"])) ?? 1048576,
      maxTokens: positive(first(row, ["output_limit", "outputLimit", "max_output_tokens", "maxTokens"])) ?? 131072,
      // Muse chat models accept images; the catalog only flags video and image output.
      input: ["text", "image"],
      // An absent list keeps Muse's documented minimal-through-max range.
      efforts: efforts?.length ? efforts.filter((effort) => [...LEVELS, "none"].includes(effort)) : [...LEVELS],
      contributor: false
    });
  }
  return rows;
}
function museModels(rows = []) {
  return new Map(rows.map((row) => [row.id, {
    id: row.id,
    name: row.name,
    provider: "meta",
    api: "openai-responses",
    baseUrl: BASE_URL,
    reasoning: row.efforts.some((effort) => effort !== "none"),
    ...row.efforts.some((effort) => effort !== "none") ? { thinkingLevelMap: {
      off: row.efforts.includes("none") ? "none" : null,
      ...Object.fromEntries(LEVELS.map((level) => [level, row.efforts.includes(level) ? level : null]))
    } } : {},
    input: [...row.input],
    contextWindow: row.contextWindow,
    maxTokens: row.maxTokens,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    [MUSE_CONTRIBUTOR]: row.contributor === true,
    [MUSE_CONTRIBUTOR_ONLY]: row.id.startsWith("muse-") && row.id.endsWith("-contributor")
  }]));
}
var MuseCodeCatalogSession = class {
  constructor({
    credentials,
    snapshot = () => void 0,
    persist = async () => {
    },
    refreshAuth,
    onChange = () => {
    },
    onUsage = () => {
    },
    fetch: request = (...args) => globalThis.fetch(...args),
    now = Date.now,
    ttl = 18e5,
    timeout = 2e4
  }) {
    Object.assign(this, { credentials, snapshot, persist, refreshAuth, onChange, onUsage, fetch: request, now });
    this.cache = new ProviderCache({ ttl, maxStale: Infinity, timeout, now });
    this.usageCache = new ProviderCache({ ttl: 3e5, maxStale: 36e5, timeout, now });
    this.version = 0;
    this.closed = false;
    this.useSnapshot = true;
    this.lifecycle = new AbortController();
  }
  rows() {
    return this.cache.peek().value ?? (this.useSnapshot ? this.snapshot() : void 0) ?? [];
  }
  catalog() {
    return museModels(this.rows());
  }
  state() {
    const cached = this.cache.peek();
    return { canRefresh: true, count: this.rows().length, checkedAt: cached.checkedAt, error: cached.error, account: this.usageCache.peek().value?.account };
  }
  changed() {
    this.version++;
    if (!this.closed) this.onChange();
  }
  invalidate() {
    this.principal = void 0;
    this.useSnapshot = false;
    this.cache.invalidate();
    this.usageCache.invalidate();
    this.changed();
  }
  async currentCredential(signal) {
    if (this.closed || signal?.aborted) throw new ProviderReadError("aborted");
    const deadline = AbortSignal.timeout(this.cache.timeout);
    const epoch2 = this.cache.epoch;
    const bounded = AbortSignal.any([this.lifecycle.signal, deadline, ...signal ? [signal] : []]);
    let abort;
    const cancelled = new Promise((_, reject) => {
      abort = () => reject(new ProviderReadError(signal?.aborted || this.closed ? "aborted" : "error"));
      bounded.addEventListener("abort", abort, { once: true });
    });
    try {
      const current = await Promise.race([this.credentials.read("meta"), cancelled]);
      if (this.closed) throw new ProviderReadError("aborted");
      if (this.cache.epoch !== epoch2) throw new ProviderReadError("account-changed");
      return current;
    } catch (error) {
      throw error instanceof ProviderReadError ? error : new ProviderReadError("error");
    } finally {
      bounded.removeEventListener("abort", abort);
    }
  }
  async validate() {
    const current = await this.currentCredential();
    if (this.principal && (!oauth(current) || principalOf(current) !== this.principal)) this.invalidate();
    if (!this.rows().length && oauth(current) && !this.closed) await this.refresh().catch(() => {
    });
  }
  async access(signal) {
    let current = await this.credentials.read("meta");
    if (!oauth(current)) throw new ProviderReadError("auth-required");
    if (!current.access || !Number.isFinite(current.expires) || current.expires <= this.now()) {
      if (!this.refreshAuth) throw new ProviderReadError("auth-required");
      await this.refreshAuth(signal);
      current = await this.credentials.read("meta");
    }
    if (!oauth(current) || typeof current.access !== "string" || !current.access) throw new ProviderReadError("auth-required");
    this.principal = principalOf(current);
    return current;
  }
  async list(credential, mode, signal) {
    return readProviderJson(await this.fetch(MUSE_CODE_MODELS_URL, {
      method: "GET",
      redirect: "error",
      signal,
      headers: { accept: "application/json", "x-api-version": "1.0.0", authorization: `Bearer ${credential.access}`, [MUSE_CONTRIBUTOR_HEADER]: mode }
    }), { now: this.now(), maxBytes: 4 * 1024 * 1024, allowArray: true });
  }
  refresh({ force = true, signal } = {}) {
    if (this.closed) return Promise.reject(new ProviderReadError("aborted"));
    return this.cache.get(async (requestSignal) => {
      const credential = await this.access(requestSignal);
      const principal = principalOf(credential);
      const standard = parseMuseCatalog(await this.list(credential, "0", requestSignal));
      if (!standard.length) throw new ProviderReadError("error");
      const contributor = parseMuseCatalog(await this.list(credential, "1", requestSignal));
      const offered = new Set(contributor.map((row) => row.id));
      const merged = new Map(standard.map((row) => [row.id, row]));
      for (const row of contributor) {
        if (row.id.startsWith("muse-") && row.id.endsWith("-contributor")) merged.set(row.id, row);
      }
      const rows = [...merged.values()].map((row) => ({
        ...row,
        contributor: offered.has(row.id) && !row.id.endsWith("-contributor")
      }));
      const current = await this.credentials.read("meta");
      if (this.closed || requestSignal.aborted || !oauth(current) || principalOf(current) !== principal) throw new ProviderReadError("account-changed");
      if (JSON.stringify(rows) !== JSON.stringify(this.snapshot() ?? [])) {
        await this.persist(rows, { signal: requestSignal });
      }
      const stored = await this.credentials.read("meta");
      if (this.closed || requestSignal.aborted || !oauth(stored) || principalOf(stored) !== principal) throw new ProviderReadError("account-changed");
      return rows;
    }, { force, signal }).then(() => {
      if (this.closed) throw new ProviderReadError("aborted");
      this.changed();
      return this.state();
    }).catch((error) => {
      if (error?.code === "account-changed") this.invalidate();
      throw error;
    });
  }
  /** The CLI's key mint also reports the subscription and its quota. */
  async usage({ signal, force = false } = {}) {
    const credential = await this.currentCredential(signal);
    if (!oauth(credential)) {
      this.invalidate();
      throw new ProviderReadError("auth-required");
    }
    const identity = principalOf(credential);
    if (this.principal && this.principal !== identity) this.invalidate();
    this.principal = identity;
    return this.usageCache.get(async (requestSignal) => {
      const current = await this.credentials.read("meta");
      if (!oauth(current)) throw new ProviderReadError("auth-required");
      const principal = principalOf(current);
      const body = await readProviderJson(await this.fetch(MUSE_CODE_KEY_URL, {
        method: "POST",
        redirect: "error",
        signal: requestSignal,
        body: "{}",
        headers: { accept: "application/json", "content-type": "application/json", "x-api-version": "1.0.0", authorization: `Bearer ${current.refresh}` }
      }), { now: this.now() });
      const account = { active: typeof body.is_subs_active === "boolean" ? body.is_subs_active : null, tierName: label3(body.subs_tier_name) };
      const stored = await this.credentials.read("meta");
      if (this.closed || requestSignal.aborted || !oauth(stored) || principalOf(stored) !== principal) throw new ProviderReadError("account-changed");
      if (account.active === true && typeof body.api_key === "string" && body.api_key) {
        await this.credentials.modify("meta", async (stored2) => {
          if (this.closed || requestSignal.aborted || !oauth(stored2) || principalOf(stored2) !== principal) throw new ProviderReadError("account-changed");
          return { ...stored2, access: body.api_key, expires: this.now() + 864e5 };
        });
      }
      const currentAfterWrite = await this.credentials.read("meta");
      if (this.closed || requestSignal.aborted || !oauth(currentAfterWrite) || principalOf(currentAfterWrite) !== principal) throw new ProviderReadError("account-changed");
      let status = "available", windows = [];
      try {
        windows = parseMuseUsage(body);
      } catch (error) {
        status = error?.code === "auth-required" ? "auth-required" : "error";
      }
      return { account, usage: { source: "internal-http", sourceObservedAt: new Date(this.now()).toISOString(), status, windows } };
    }, { force, signal }).then((result) => {
      if (!this.closed && this.usageCache.peek().value === result) this.onUsage();
      return result.usage;
    }).catch((error) => {
      if (error?.code === "account-changed") this.invalidate();
      throw error;
    });
  }
  dispose() {
    this.closed = true;
    this.lifecycle.abort();
    this.cache.dispose();
    this.usageCache.dispose();
  }
};
function museCatalogProvider(session) {
  return {
    session,
    presentation() {
      const { count: count2, account } = session.state();
      return {
        ...account?.tierName ? { status: { message: account.active === false ? "metaSubscriptionInactive" : "metaSubscriptionActive", detail: account.tierName } } : {},
        notes: count2 ? [] : ["museCatalogEmpty"]
      };
    },
    errorCodes: { "auth-required": "catalog-login-required", "rate-limited": "catalog-rate-limited", "account-changed": "catalog-account-changed" },
    errors: { "catalog-login-required": "museLoginRequired", "catalog-rate-limited": "metaRateLimited", "catalog-account-changed": "metaAccountChanged", "catalog-refresh-failed": "museCatalogFailed" },
    // The SDK's Meta OAuth supplies and renews the key; nothing to override.
    authorizeModel: async () => void 0
  };
}

// src/meta-catalog.mjs
import { createHash as createHash7 } from "node:crypto";
var META_CATALOG_GRANT = /* @__PURE__ */ Symbol("dsh-pi-login/meta-catalog-grant");
var LEVELS2 = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
var principalOf2 = (credential) => createHash7("sha256").update(credential.refresh).digest("hex");
var oauth2 = (value) => value?.type === "oauth" && typeof value.refresh === "string" && value.refresh.length > 0;
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
  const thinking = map && typeof map === "object" && !Array.isArray(map) ? Object.fromEntries(LEVELS2.map((level) => [level, typeof map[level] === "string" && map[level].length > 0 ? map[level] : null])) : void 0;
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
    const signature = createHash7("sha256").update(JSON.stringify({
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
    if (!oauth2(current) || principalOf2(current) !== this.principal) this.invalidate();
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
    if (!oauth2(credential)) throw new ProviderReadError("auth-required");
    const principal = principalOf2(credential);
    this.principal = principal;
    try {
      return await this.entitlementCache.get(async (requestSignal) => {
        let result;
        await this.credentials.modify("meta", async (current2) => {
          if (!oauth2(current2) || principalOf2(current2) !== principal) throw new ProviderReadError("account-changed");
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
        if (this.closed || requestSignal.aborted || !oauth2(current) || principalOf2(current) !== principal) throw new ProviderReadError("account-changed");
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
    if (!oauth2(current)) throw new ProviderReadError("auth-required");
    if (!current.access || !Number.isFinite(current.expires) || current.expires <= this.now()) await this.contract({ force: true, signal });
    const next = await this.credentials.read("meta");
    if (!oauth2(next) || typeof next.access !== "string" || !Number.isFinite(next.expires) || next.expires <= this.now()) throw new ProviderReadError("auth-required");
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
      if (!oauth2(credential) || principalOf2(credential) !== principal) throw new ProviderReadError("account-changed");
      const body = await this.readJson(await this.fetch("https://api.meta.ai/v1/models", {
        method: "GET",
        redirect: "error",
        signal: requestSignal,
        headers: { accept: "application/json", "x-api-version": "1.0.0", authorization: `Bearer ${credential.access}` }
      }));
      if (!Array.isArray(body.data) || body.has_more === true || body.next_page !== void 0 && body.next_page !== null) throw new ProviderReadError("error");
      const current = await this.credentials.read("meta");
      if (this.closed || requestSignal.aborted || !oauth2(current) || principalOf2(current) !== principal) throw new ProviderReadError("account-changed");
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
    if (!grant || !oauth2(current) || principalOf2(current) !== grant.principal || this.principal !== grant.principal || !this.catalogCache.peek().value?.has(model.id) || contract.value?.account.active !== true || contract.error === "auth-required") {
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
    connectionSnapshot: () => config.connections.get(),
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
        apis: [...supportedProtocols()],
        capabilities: { auth: methods.length > 0, models: true, settings: true, usage: ["openai-codex", "anthropic", "github-copilot", "opencode-go", "meta"].includes(serviceId) }
      };
    });
  };
  registry.register({ integrationId: "pi", label: "Pi", source: "@earendil-works/pi-ai", listServices: piServices, listConnections: () => Object.values(manager.raw()) });
  const muse = createMuseCodeOwner({ ctx, connections: manager });
  registry.register(muse);
  registry.register(external.descriptor);
  ctx.on("dsh-pi-login/register-integration", (owner, ownRegistration) => registry.register(owner, ownRegistration));
  const sessionIdentity = (connection) => JSON.stringify([connection.serviceId, connection.credentialRecordId, connection.credentialGeneration, connection.credentialRef, connection.profile?.baseURL, connection.profile?.api]);
  const authFor = (connection) => {
    const binding = manager.binding(connection);
    return connectionAuthFrom(ctx, { ...binding, serviceId: sdkServiceOf(connection) ?? connection.serviceId, isCurrent: () => manager.isCurrent(binding) });
  };
  const refreshAuth = async (connection, signal) => {
    const service = sdkServiceOf(connection) ?? connection.serviceId;
    const auth = authFor(connection);
    const models = createModels(auth);
    models.setProvider(catalogProvider(service));
    await models.getAuth(service, { signal });
    return auth.credentials.read(service);
  };
  const catalogsFor = (connection) => {
    const id = connection.connectionId;
    const identity = sessionIdentity(connection);
    const previous = sessions.get(id);
    if (previous?.identity === identity) return previous.catalogs;
    previous?.catalogs.dispose();
    if (connection.integrationId === MUSE_CODE_INTEGRATION_ID) {
      const binding = manager.binding(connection);
      const museSession = new MuseCodeCatalogSession({
        credentials: authFor(connection).credentials,
        snapshot: () => {
          try {
            return manager.lookup(id).museCatalog;
          } catch {
            return void 0;
          }
        },
        persist: (rows, options2) => manager.saveMuseCatalog(binding, rows, options2),
        refreshAuth: (signal) => refreshAuth(manager.lookup(id), signal),
        onChange: () => {
          revision++;
          ctx.emit("dsh-pi-login/catalog-updated");
        }
      });
      const catalogs2 = new ProviderCatalogs({ [connection.serviceId]: museCatalogProvider(museSession) });
      sessions.set(id, { identity, catalogs: catalogs2, muse: museSession });
      return catalogs2;
    }
    const meta = connection.serviceId === "meta" && connection.integrationId === "pi" ? new MetaCatalogSession({
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
    sessions.set(id, { identity, catalogs, meta });
    return catalogs;
  };
  const usage = new AccountUsageManager({
    providers: {
      ...createPiUsageProviders({ metaSession: (connection) => {
        catalogsFor(connection);
        return sessions.get(connection.connectionId).meta;
      } }),
      [`${MUSE_CODE_INTEGRATION_ID}/muse-code`]: {
        source: "internal-http",
        read: ({ connection, signal, force }) => {
          catalogsFor(connection);
          return sessions.get(connection.connectionId).muse.usage({ signal, force });
        }
      }
    },
    credentials: {
      read: (connection) => authFor(connection).credentials.read(sdkServiceOf(connection) ?? connection.serviceId),
      refresh: (connection, _record, signal) => refreshAuth(connection, signal)
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
      if (connection.integrationId === MUSE_CODE_INTEGRATION_ID) void catalogsFor(manager.lookup(id)).refresh(connection.serviceId).catch(() => {
      });
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
    syncFlows: () => runtime.syncFlows(),
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

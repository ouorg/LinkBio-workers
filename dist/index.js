var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str2, encoding, cb) {
    if (str2 instanceof Uint8Array) {
      str2 = new TextDecoder().decode(str2);
    }
    try {
      console.log(str2);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = /* @__PURE__ */ __name((arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      // Normalize the media type (case-insensitive) while keeping parameters like the boundary
      "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
}, "bufferToFormData");

// node_modules/hono/dist/utils/body.js
var isRawRequest = /* @__PURE__ */ __name((request) => "headers" in request, "isRawRequest");
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType = headers.get("Content-Type");
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) {
    return convertFormDataToBodyData(
      await request.bodyCache.formData,
      options
    );
  }
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str2, decoder) => {
  try {
    return decoder(str2);
  } catch {
    return str2.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str2) => tryDecode(str2, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var tryDecodeURIComponent = /* @__PURE__ */ __name((str2) => str2.indexOf("%") !== -1 ? tryDecode(str2, decodeURIComponent_) : str2, "tryDecodeURIComponent");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return tryDecodeURIComponent(value);
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && key.indexOf("%") === -1 && key.indexOf("+") === -1) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = tryDecodeURIComponent(value);
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    for (const anyCachedKey in bodyCache) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    ;
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str2, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str2 === "object" && !(str2 instanceof String)) {
    if (!(str2 instanceof Promise)) {
      str2 = str2.toString();
    }
    if (str2 instanceof Promise) {
      str2 = await str2;
    }
  }
  const callbacks = str2.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str2);
  }
  if (buffer) {
    buffer[0] += str2;
  } else {
    buffer = [str2];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str22) => resolveCallback(str22, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers();
      for (const [key, value] of new Headers(arg.headers)) {
        if (key === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      if (!responseHeaders) {
        let count3 = 0;
        for (const k in headers) {
          if (++count3 > 1 || typeof headers[k] !== "string") {
            responseHeaders = new Headers();
            break;
          }
        }
      }
      if (responseHeaders) {
        for (const k in headers) {
          const v = headers[k];
          if (typeof v === "string") {
            responseHeaders.set(k, v);
          } else {
            responseHeaders.delete(k);
            for (const v2 of v) {
              responseHeaders.append(k, v2);
            }
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch", "query"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} env - env Object
   * @param {ExecutionContext} executionCtx - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return b === TAIL_WILDCARD_REG_EXP_STR ? -1 : 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  // handler index of a dynamic path, or -1 for a static path terminal
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context2, isStatic) {
    let node = this;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : null : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
        if (name && pattern[2]) {
          if (regexpStr === ".*") {
            throw PATH_ERROR;
          }
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) {
            throw PATH_ERROR;
          }
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) {
            throw PATH_ERROR;
          }
        }
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== ONLY_WILDCARD_REG_EXP_STR && regexpStr !== TAIL_WILDCARD_REG_EXP_STR) {
            for (const k in node.#children) {
              if (
                // a single-char pattern coexists with single-char literals as a literal does
                (regexpStr.length > 1 || k.length > 1) && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
              ) {
                throw PATH_ERROR;
              }
            }
          }
          nextNode = node.#children[regexpStr] = new _Node();
        }
        if (name !== "") {
          nextNode.#varIndex ??= context2.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) {
            if (k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR) {
              throw PATH_ERROR;
            }
          }
          nextNode = node.#children[token] = new _Node();
        }
      }
      node = nextNode;
    }
    if (node.#index !== void 0) {
      throw PATH_ERROR;
    }
    node.#index = isStatic ? -1 : index;
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  #index = 0;
  // dynamic path -> [handler index, param assoc]; static paths are not registered
  paths = /* @__PURE__ */ Object.create(null);
  insert(path, isStatic) {
    if (isStatic) {
      this.#root.insert(path.split(""), 0, [], this.#context, true);
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0; ; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, false);
    this.paths[path] = [this.#index++, paramAssoc];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  #tries;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#tries = { [METHOD_NAME_ALL]: new Trie() };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      this.#tries[method] = new Trie();
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
          this.#insertPath(method, p);
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      Object.keys(middleware).forEach((m) => {
        if ((method === METHOD_NAME_ALL || method === m) && !middleware[m][path]) {
          this.#insertPath(m, path);
          middleware[m][path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        }
      });
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          if (!routes[m][path2]) {
            this.#insertPath(m, path2);
            routes[m][path2] = [
              ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
            ];
          }
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = this.#tries = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const middleware = this.#middleware[method];
    const routes = this.#routes[method];
    const trie = this.#tries[method];
    const staticMap = /* @__PURE__ */ Object.create(null);
    const handlerData = [];
    [middleware, routes].forEach((r) => {
      for (const path in r) {
        const handlers = r[path];
        const pathData = trie.paths[path];
        if (!pathData) {
          staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
          continue;
        }
        const paramAssoc = pathData[1];
        handlerData[pathData[0]] = handlers.map(([h, paramCount]) => {
          const paramIndexMap = /* @__PURE__ */ Object.create(null);
          paramCount -= 1;
          for (; paramCount >= 0; paramCount--) {
            const [key, value] = paramAssoc[paramCount];
            paramIndexMap[key] = value;
          }
          return [h, paramIndexMap];
        });
      }
    });
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (let i = 0, len = handlerData.length; i < len; i++) {
      for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
        const map = handlerData[i][j]?.[1];
        if (!map) {
          continue;
        }
        const keys = Object.keys(map);
        for (let k = 0, len3 = keys.length; k < len3; k++) {
          map[keys[k]] = paramReplacementMap[map[keys[k]]];
        }
      }
    }
    const handlerMap = [];
    for (const i in indexReplacementMap) {
      handlerMap[i] = handlerData[indexReplacementMap[i]];
    }
    return [regexp, handlerMap, staticMap];
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  node.#params,
                  params
                );
              }
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/helper/factory/index.js
var createMiddleware = /* @__PURE__ */ __name((middleware) => middleware, "createMiddleware");

// src/services/session.ts
var COOKIE_NAME = "lb_session";
var SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
async function createSessionToken(secret) {
  const now = Math.floor(Date.now() / 1e3);
  const payload = {
    sub: "admin",
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const sig = await sign(body, secret);
  return `${body}.${sig}`;
}
__name(createSessionToken, "createSessionToken");
async function verifySessionToken(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [body, sig] = parts;
  if (!body || !sig) return false;
  const expected = await sign(body, secret);
  if (!timingSafeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(base64UrlDecode(body));
    if (payload.sub !== "admin") return false;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1e3)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
__name(verifySessionToken, "verifySessionToken");
function getSessionCookieName() {
  return COOKIE_NAME;
}
__name(getSessionCookieName, "getSessionCookieName");
function buildSessionCookie(token, secure) {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_SECONDS}`
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
__name(buildSessionCookie, "buildSessionCookie");
function buildClearSessionCookie(secure) {
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0"
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
__name(buildClearSessionCookie, "buildClearSessionCookie");
function parseCookie(header, name) {
  if (!header) return null;
  const cookies = header.split(";");
  for (const part of cookies) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=") || null;
  }
  return null;
}
__name(parseCookie, "parseCookie");
async function sign(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64UrlEncodeBytes(new Uint8Array(sig));
}
__name(sign, "sign");
function base64UrlEncode(str2) {
  return base64UrlEncodeBytes(new TextEncoder().encode(str2));
}
__name(base64UrlEncode, "base64UrlEncode");
function base64UrlEncodeBytes(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(base64UrlEncodeBytes, "base64UrlEncodeBytes");
function base64UrlDecode(str2) {
  const padded = str2.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - padded.length % 4);
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
__name(base64UrlDecode, "base64UrlDecode");
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}
__name(timingSafeEqual, "timingSafeEqual");
async function constantTimeEqual(a, b) {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) {
    await crypto.subtle.digest("SHA-256", ab);
    return false;
  }
  let out = 0;
  for (let i = 0; i < ab.length; i++) out |= ab[i] ^ bb[i];
  return out === 0;
}
__name(constantTimeEqual, "constantTimeEqual");

// src/middleware/auth.ts
var attachAuth = createMiddleware(async (c, next) => {
  const secret = c.env.SESSION_SECRET || "";
  const cookie = parseCookie(c.req.header("Cookie"), getSessionCookieName());
  const ok = await verifySessionToken(cookie, secret);
  c.set("isAdmin", ok);
  await next();
});
var requireAdmin = createMiddleware(async (c, next) => {
  if (!c.get("isAdmin")) {
    const accept = c.req.header("Accept") || "";
    const isApi = c.req.path.startsWith("/api/") || accept.includes("application/json") || c.req.header("X-Requested-With") === "XMLHttpRequest";
    if (isApi) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const nextUrl = encodeURIComponent(c.req.path + (c.req.url.includes("?") ? `?${c.req.url.split("?")[1]}` : ""));
    return c.redirect(`/admin/login?next=${nextUrl}`);
  }
  await next();
});

// src/middleware/security.ts
var securityHeaders = createMiddleware(async (c, next) => {
  await next();
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  c.res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  c.res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ")
  );
});
function escapeHtml(input) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(escapeHtml, "escapeHtml");
var CSRF_COOKIE = "lb_csrf";
var CSRF_FIELD = "_csrf";
function generateCsrfToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += bytes[i].toString(16).padStart(2, "0");
  return s;
}
__name(generateCsrfToken, "generateCsrfToken");
function buildCsrfCookie(token, secure) {
  const parts = [`${CSRF_COOKIE}=${token}`, "Path=/", "SameSite=Lax", "Max-Age=86400"];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
__name(buildCsrfCookie, "buildCsrfCookie");
function parseCsrfFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === CSRF_COOKIE) return rest.join("=") || null;
  }
  return null;
}
__name(parseCsrfFromCookie, "parseCsrfFromCookie");
function validateCsrf(cookieToken, formToken) {
  if (!cookieToken || !formToken) return false;
  if (cookieToken.length < 16 || formToken.length < 16) return false;
  if (cookieToken.length !== formToken.length) return false;
  let out = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    out |= cookieToken.charCodeAt(i) ^ formToken.charCodeAt(i);
  }
  return out === 0;
}
__name(validateCsrf, "validateCsrf");
function isSecureRequest(c) {
  try {
    const url = new URL(c.req.url);
    if (url.protocol === "https:") return true;
  } catch {
  }
  const proto = c.req.header("X-Forwarded-Proto");
  return proto === "https";
}
__name(isSecureRequest, "isSecureRequest");

// src/styles/app.css.ts
var appCss = '/* LinkBio-workers - modern SaaS bio card UI (Linear / Vercel / Apple inspired) */\n\n:root {\n  --bg: #0a0a0b;\n  --bg-elevated: #141416;\n  --bg-card: #18181b;\n  --border: rgba(255, 255, 255, 0.08);\n  --border-strong: rgba(255, 255, 255, 0.14);\n  --text: #fafafa;\n  --text-secondary: #a1a1aa;\n  --text-muted: #71717a;\n  --accent: #6366f1;\n  --accent-hover: #818cf8;\n  --accent-soft: rgba(99, 102, 241, 0.15);\n  --danger: #ef4444;\n  --success: #22c55e;\n  --radius: 14px;\n  --radius-sm: 10px;\n  --shadow: 0 24px 80px rgba(0, 0, 0, 0.45);\n  --font: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\n  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;\n  --max: 420px;\n  --admin-max: 880px;\n}\n\n[data-theme="light"] {\n  --bg: #fafafa;\n  --bg-elevated: #ffffff;\n  --bg-card: #ffffff;\n  --border: rgba(0, 0, 0, 0.08);\n  --border-strong: rgba(0, 0, 0, 0.12);\n  --text: #09090b;\n  --text-secondary: #52525b;\n  --text-muted: #a1a1aa;\n  --shadow: 0 20px 60px rgba(0, 0, 0, 0.08);\n  --accent-soft: rgba(99, 102, 241, 0.1);\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\nhtml {\n  -webkit-text-size-adjust: 100%;\n}\n\nbody {\n  margin: 0;\n  min-height: 100vh;\n  font-family: var(--font);\n  background: var(--bg);\n  color: var(--text);\n  line-height: 1.5;\n  -webkit-font-smoothing: antialiased;\n}\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\nimg {\n  max-width: 100%;\n  display: block;\n}\n\nbutton,\ninput,\ntextarea,\nselect {\n  font: inherit;\n  color: inherit;\n}\n\n/* \u2500\u2500 Public bio page \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.page {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 48px 20px 32px;\n  background:\n    radial-gradient(ellipse 80% 50% at 50% -20%, var(--accent-soft), transparent 60%),\n    var(--bg);\n}\n\n.page--bg {\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n.card {\n  width: 100%;\n  max-width: var(--max);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 28px;\n}\n\n.avatar-wrap {\n  position: relative;\n}\n\n.avatar {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 2px solid var(--border-strong);\n  background: var(--bg-elevated);\n  box-shadow: var(--shadow);\n}\n\n.avatar-fallback {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  font-size: 2rem;\n  font-weight: 600;\n  letter-spacing: -0.03em;\n  background: linear-gradient(145deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #000));\n  color: #fff;\n  border: 2px solid var(--border-strong);\n  box-shadow: var(--shadow);\n}\n\n.profile {\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  width: 100%;\n}\n\n.profile h1 {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 650;\n  letter-spacing: -0.03em;\n  line-height: 1.2;\n}\n\n.profile .username {\n  color: var(--text-muted);\n  font-size: 0.95rem;\n  font-weight: 500;\n}\n\n.profile .bio {\n  margin: 4px 0 0;\n  color: var(--text-secondary);\n  font-size: 0.95rem;\n  line-height: 1.55;\n  white-space: pre-wrap;\n}\n\n.meta {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px 14px;\n  justify-content: center;\n  color: var(--text-muted);\n  font-size: 0.85rem;\n}\n\n.meta span {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.links {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.link-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  width: 100%;\n  min-height: 52px;\n  padding: 14px 18px;\n  border-radius: var(--radius);\n  background: var(--bg-card);\n  border: 1px solid var(--border);\n  color: var(--text);\n  font-weight: 550;\n  font-size: 0.95rem;\n  letter-spacing: -0.01em;\n  transition:\n    transform 0.15s ease,\n    border-color 0.15s ease,\n    background 0.15s ease,\n    box-shadow 0.15s ease;\n  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04) inset;\n}\n\n.link-btn:hover {\n  transform: translateY(-1px);\n  border-color: color-mix(in srgb, var(--accent) 50%, var(--border));\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);\n}\n\n.link-btn:active {\n  transform: translateY(0);\n}\n\n.link-btn .icon {\n  width: 20px;\n  height: 20px;\n  opacity: 0.9;\n  flex-shrink: 0;\n}\n\n.footer {\n  margin-top: auto;\n  padding-top: 40px;\n  text-align: center;\n  color: var(--text-muted);\n  font-size: 0.8rem;\n}\n\n.footer a {\n  color: var(--text-secondary);\n  border-bottom: 1px solid transparent;\n}\n\n.footer a:hover {\n  border-bottom-color: var(--text-secondary);\n}\n\n/* \u2500\u2500 Admin shell \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.admin-body {\n  min-height: 100vh;\n  background: var(--bg);\n}\n\n.admin-shell {\n  max-width: var(--admin-max);\n  margin: 0 auto;\n  padding: 28px 20px 64px;\n}\n\n.admin-nav {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 32px;\n  padding-bottom: 20px;\n  border-bottom: 1px solid var(--border);\n}\n\n.admin-brand {\n  font-weight: 650;\n  letter-spacing: -0.03em;\n  font-size: 1.1rem;\n}\n\n.admin-brand span {\n  color: var(--text-muted);\n  font-weight: 500;\n  margin-left: 8px;\n  font-size: 0.85rem;\n}\n\n.admin-nav-links {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n}\n\n.nav-link {\n  padding: 8px 12px;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n  font-weight: 500;\n}\n\n.nav-link:hover,\n.nav-link.active {\n  background: var(--bg-elevated);\n  color: var(--text);\n}\n\n.nav-link.danger:hover {\n  color: var(--danger);\n}\n\n.admin-header {\n  margin-bottom: 28px;\n}\n\n.admin-header h1 {\n  margin: 0 0 6px;\n  font-size: 1.65rem;\n  letter-spacing: -0.03em;\n  font-weight: 650;\n}\n\n.admin-header p {\n  margin: 0;\n  color: var(--text-secondary);\n  font-size: 0.95rem;\n}\n\n.panel {\n  background: var(--bg-elevated);\n  border: 1px solid var(--border);\n  border-radius: calc(var(--radius) + 2px);\n  padding: 22px;\n  margin-bottom: 18px;\n}\n\n.panel h2 {\n  margin: 0 0 16px;\n  font-size: 1rem;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n\n.grid-2 {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 14px;\n}\n\n@media (max-width: 640px) {\n  .grid-2 {\n    grid-template-columns: 1fr;\n  }\n}\n\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  margin-bottom: 14px;\n}\n\n.field:last-child {\n  margin-bottom: 0;\n}\n\n.field label {\n  font-size: 0.8rem;\n  font-weight: 550;\n  color: var(--text-secondary);\n  letter-spacing: 0.01em;\n}\n\n.field input,\n.field textarea,\n.field select {\n  width: 100%;\n  padding: 10px 12px;\n  border-radius: var(--radius-sm);\n  border: 1px solid var(--border);\n  background: var(--bg);\n  outline: none;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n\n.field input:focus,\n.field textarea:focus,\n.field select:focus {\n  border-color: color-mix(in srgb, var(--accent) 60%, var(--border));\n  box-shadow: 0 0 0 3px var(--accent-soft);\n}\n\n.field textarea {\n  min-height: 96px;\n  resize: vertical;\n}\n\n.field .hint {\n  font-size: 0.75rem;\n  color: var(--text-muted);\n}\n\n.row-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-top: 16px;\n}\n\n.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 10px 16px;\n  border-radius: var(--radius-sm);\n  border: 1px solid transparent;\n  font-weight: 550;\n  font-size: 0.875rem;\n  cursor: pointer;\n  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;\n  background: var(--accent);\n  color: #fff;\n}\n\n.btn:hover {\n  background: var(--accent-hover);\n}\n\n.btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n\n.btn-secondary {\n  background: transparent;\n  border-color: var(--border-strong);\n  color: var(--text);\n}\n\n.btn-secondary:hover {\n  background: var(--bg);\n  border-color: var(--text-muted);\n}\n\n.btn-danger {\n  background: transparent;\n  border-color: color-mix(in srgb, var(--danger) 40%, var(--border));\n  color: var(--danger);\n}\n\n.btn-danger:hover {\n  background: color-mix(in srgb, var(--danger) 12%, transparent);\n}\n\n.btn-sm {\n  padding: 6px 10px;\n  font-size: 0.8rem;\n}\n\n.alert {\n  padding: 12px 14px;\n  border-radius: var(--radius-sm);\n  font-size: 0.875rem;\n  margin-bottom: 16px;\n  border: 1px solid var(--border);\n}\n\n.alert-error {\n  background: color-mix(in srgb, var(--danger) 12%, transparent);\n  border-color: color-mix(in srgb, var(--danger) 35%, var(--border));\n  color: #fecaca;\n}\n\n[data-theme="light"] .alert-error {\n  color: #991b1b;\n}\n\n.alert-success {\n  background: color-mix(in srgb, var(--success) 12%, transparent);\n  border-color: color-mix(in srgb, var(--success) 35%, var(--border));\n  color: #bbf7d0;\n}\n\n[data-theme="light"] .alert-success {\n  color: #166534;\n}\n\n.stats {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 12px;\n}\n\n.stat {\n  padding: 16px;\n  border-radius: var(--radius);\n  border: 1px solid var(--border);\n  background: var(--bg);\n}\n\n.stat .label {\n  font-size: 0.75rem;\n  color: var(--text-muted);\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  font-weight: 600;\n}\n\n.stat .value {\n  margin-top: 6px;\n  font-size: 1.5rem;\n  font-weight: 650;\n  letter-spacing: -0.03em;\n}\n\n/* Links table */\n.links-list {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.link-row {\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 12px;\n  align-items: start;\n  padding: 14px;\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  background: var(--bg);\n}\n\n.link-row .meta-line {\n  font-size: 0.8rem;\n  color: var(--text-muted);\n  word-break: break-all;\n  margin-top: 4px;\n}\n\n.link-row .title {\n  font-weight: 600;\n  font-size: 0.95rem;\n}\n\n.badge {\n  display: inline-flex;\n  padding: 2px 8px;\n  border-radius: 999px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  border: 1px solid var(--border);\n  color: var(--text-secondary);\n  margin-left: 8px;\n  vertical-align: middle;\n}\n\n.badge-on {\n  color: #86efac;\n  border-color: color-mix(in srgb, var(--success) 40%, var(--border));\n}\n\n.badge-off {\n  color: var(--text-muted);\n}\n\n.check-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.9rem;\n  color: var(--text-secondary);\n}\n\n.check-row input {\n  width: 16px;\n  height: 16px;\n  accent-color: var(--accent);\n}\n\n/* Login */\n.login-page {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n  background:\n    radial-gradient(ellipse 70% 40% at 50% 0%, var(--accent-soft), transparent 55%),\n    var(--bg);\n}\n\n.login-card {\n  width: 100%;\n  max-width: 380px;\n  background: var(--bg-elevated);\n  border: 1px solid var(--border);\n  border-radius: calc(var(--radius) + 4px);\n  padding: 28px 24px;\n  box-shadow: var(--shadow);\n}\n\n.login-card h1 {\n  margin: 0 0 6px;\n  font-size: 1.35rem;\n  letter-spacing: -0.03em;\n}\n\n.login-card .sub {\n  margin: 0 0 22px;\n  color: var(--text-secondary);\n  font-size: 0.9rem;\n}\n\n.mono {\n  font-family: var(--mono);\n  font-size: 0.8rem;\n}\n\n.empty {\n  text-align: center;\n  color: var(--text-muted);\n  padding: 24px 12px;\n  font-size: 0.9rem;\n}\n\nhr.sep {\n  border: none;\n  border-top: 1px solid var(--border);\n  margin: 20px 0;\n}\n';

// src/components/layout.ts
function renderLayout(opts) {
  const themeAttr = opts.settings.darkMode ? "dark" : "light";
  const accent = escapeHtml(opts.settings.accentColor || "#6366f1");
  const title2 = escapeHtml(opts.title);
  const bodyClass = escapeHtml(opts.bodyClass || "");
  return `<!DOCTYPE html>
<html lang="en" data-theme="${themeAttr}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="${themeAttr}" />
  <title>${title2}</title>
  <meta name="description" content="${escapeHtml(opts.siteName)} \u2014 personal bio links" />
  <style>${appCss}</style>
  <style>:root { --accent: ${accent}; --accent-hover: color-mix(in srgb, ${accent} 80%, white); --accent-soft: color-mix(in srgb, ${accent} 18%, transparent); }</style>
  ${opts.headExtra || ""}
</head>
<body class="${bodyClass}">
${opts.children}
</body>
</html>`;
}
__name(renderLayout, "renderLayout");
function htmlResponse(html, status = 200, headers) {
  const h = new Headers(headers);
  h.set("Content-Type", "text/html; charset=utf-8");
  return new Response(html, { status, headers: h });
}
__name(htmlResponse, "htmlResponse");

// src/components/icons.ts
var ICONS = {
  github: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>`,
  globe: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>`,
  twitter: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>`,
  x: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>`,
  linkedin: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  youtube: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  instagram: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  mail: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`,
  link: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`
};
function iconSvg(name) {
  const key = (name || "link").toLowerCase().trim();
  return ICONS[key] || ICONS.link;
}
__name(iconSvg, "iconSvg");
var ICON_OPTIONS = [
  "link",
  "github",
  "globe",
  "twitter",
  "x",
  "linkedin",
  "youtube",
  "instagram",
  "mail"
];

// src/admin/forms.ts
function csrfField(token) {
  return `<input type="hidden" name="${CSRF_FIELD}" value="${escapeHtml(token)}" />`;
}
__name(csrfField, "csrfField");
function renderProfileForm(profile3, csrf, message) {
  return `
  <section class="panel">
    <h2>Profile</h2>
    ${flash(message)}
    <form method="post" action="/admin/profile">
      ${csrfField(csrf)}
      <div class="grid-2">
        <div class="field">
          <label for="name">Name</label>
          <input id="name" name="name" value="${escapeHtml(profile3.name)}" required maxlength="80" />
        </div>
        <div class="field">
          <label for="username">Username</label>
          <input id="username" name="username" value="${escapeHtml(profile3.username)}" maxlength="40" pattern="[a-zA-Z0-9._-]*" />
        </div>
      </div>
      <div class="field">
        <label for="bio">Bio</label>
        <textarea id="bio" name="bio" maxlength="500">${escapeHtml(profile3.bio)}</textarea>
      </div>
      <div class="field">
        <label for="avatar">Avatar URL</label>
        <input id="avatar" name="avatar" type="url" value="${escapeHtml(profile3.avatar)}" maxlength="2000" placeholder="https://..." />
      </div>
      <div class="grid-2">
        <div class="field">
          <label for="location">Location</label>
          <input id="location" name="location" value="${escapeHtml(profile3.location)}" maxlength="120" />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" value="${escapeHtml(profile3.email)}" maxlength="120" />
        </div>
      </div>
      <div class="row-actions">
        <button class="btn" type="submit">Save profile</button>
      </div>
    </form>
  </section>`;
}
__name(renderProfileForm, "renderProfileForm");
function renderSettingsForm(settings, csrf, message) {
  return `
  <section class="panel">
    <h2>Theme &amp; appearance</h2>
    ${flash(message)}
    <form method="post" action="/admin/settings">
      ${csrfField(csrf)}
      <div class="grid-2">
        <div class="field">
          <label for="theme">Theme</label>
          <select id="theme" name="theme">
            ${option("default", "Default", settings.theme)}
            ${option("minimal", "Minimal", settings.theme)}
            ${option("glass", "Glass", settings.theme)}
          </select>
        </div>
        <div class="field">
          <label for="accentColor">Accent color</label>
          <input id="accentColor" name="accentColor" type="text" value="${escapeHtml(settings.accentColor)}" pattern="#[0-9a-fA-F]{3,8}" placeholder="#6366f1" />
        </div>
      </div>
      <div class="field">
        <label for="background">Background image URL (optional)</label>
        <input id="background" name="background" type="url" value="${escapeHtml(settings.background)}" maxlength="2000" placeholder="https://..." />
      </div>
      <div class="field">
        <label class="check-row">
          <input type="checkbox" name="darkMode" value="1" ${settings.darkMode ? "checked" : ""} />
          Dark mode
        </label>
      </div>
      <div class="field">
        <label class="check-row">
          <input type="checkbox" name="showFooter" value="1" ${settings.showFooter ? "checked" : ""} />
          Show footer
        </label>
      </div>
      <div class="row-actions">
        <button class="btn" type="submit">Save theme</button>
      </div>
    </form>
  </section>`;
}
__name(renderSettingsForm, "renderSettingsForm");
function renderLinksPanel(links, csrf, message) {
  const rows = links.length === 0 ? `<div class="empty">No links yet. Add one below.</div>` : `<div class="links-list">${links.map((l) => {
    const badge = l.enabled ? `<span class="badge badge-on">On</span>` : `<span class="badge badge-off">Off</span>`;
    return `
          <div class="link-row">
            <div>
              <div class="title">${escapeHtml(l.title)}${badge}</div>
              <div class="meta-line">${escapeHtml(l.url)} \xB7 icon: ${escapeHtml(l.icon)} \xB7 order: ${l.order}</div>
            </div>
            <div class="row-actions" style="margin:0">
              <form method="post" action="/admin/links/${escapeHtml(l.id)}/toggle">
                ${csrfField(csrf)}
                <button class="btn btn-secondary btn-sm" type="submit">${l.enabled ? "Disable" : "Enable"}</button>
              </form>
              <form method="post" action="/admin/links/${escapeHtml(l.id)}/up">
                ${csrfField(csrf)}
                <button class="btn btn-secondary btn-sm" type="submit">\u2191</button>
              </form>
              <form method="post" action="/admin/links/${escapeHtml(l.id)}/down">
                ${csrfField(csrf)}
                <button class="btn btn-secondary btn-sm" type="submit">\u2193</button>
              </form>
              <form method="post" action="/admin/links/${escapeHtml(l.id)}/delete" onsubmit="return confirm('Delete this link?')">
                ${csrfField(csrf)}
                <button class="btn btn-danger btn-sm" type="submit">Delete</button>
              </form>
            </div>
          </div>`;
  }).join("")}</div>`;
  const iconOptions = ICON_OPTIONS.map((i) => option(i, i, "link")).join("");
  return `
  <section class="panel">
    <h2>Links</h2>
    ${flash(message)}
    ${rows}
    <hr class="sep" />
    <h2>Add link</h2>
    <form method="post" action="/admin/links">
      ${csrfField(csrf)}
      <div class="grid-2">
        <div class="field">
          <label for="title">Title</label>
          <input id="title" name="title" required maxlength="80" />
        </div>
        <div class="field">
          <label for="icon">Icon</label>
          <select id="icon" name="icon">${iconOptions}</select>
        </div>
      </div>
      <div class="field">
        <label for="url">URL</label>
        <input id="url" name="url" type="url" required maxlength="2000" placeholder="https://" />
      </div>
      <div class="field">
        <label class="check-row">
          <input type="checkbox" name="enabled" value="1" checked />
          Enabled
        </label>
      </div>
      <div class="row-actions">
        <button class="btn" type="submit">Add link</button>
      </div>
    </form>
  </section>`;
}
__name(renderLinksPanel, "renderLinksPanel");
function renderDataPanel(csrf, message) {
  return `
  <section class="panel">
    <h2>Data \xB7 Import / Export</h2>
    ${flash(message)}
    <p class="hint" style="color:var(--text-secondary);font-size:0.9rem;margin:0 0 14px">
      Export a full JSON backup of profile, links, settings, and analytics. Import overwrites existing keys.
    </p>
    <div class="row-actions">
      <a class="btn btn-secondary" href="/admin/export">Export JSON</a>
    </div>
    <hr class="sep" />
    <form method="post" action="/admin/import">
      ${csrfField(csrf)}
      <div class="field">
        <label for="json">Import JSON</label>
        <textarea id="json" name="json" required placeholder='{"profile":{...},"links":[...],"settings":{...}}'></textarea>
      </div>
      <div class="row-actions">
        <button class="btn" type="submit">Import</button>
      </div>
    </form>
  </section>`;
}
__name(renderDataPanel, "renderDataPanel");
function renderStats(analytics) {
  const clickTotal = Object.values(analytics.linkClicks).reduce((a, b) => a + b, 0);
  return `
  <section class="panel">
    <h2>Analytics</h2>
    <div class="stats">
      <div class="stat">
        <div class="label">Page views</div>
        <div class="value">${analytics.pageViews}</div>
      </div>
      <div class="stat">
        <div class="label">Link clicks</div>
        <div class="value">${clickTotal}</div>
      </div>
      <div class="stat">
        <div class="label">Last updated</div>
        <div class="value" style="font-size:0.95rem;margin-top:10px">${escapeHtml(analytics.lastUpdated || "\u2014")}</div>
      </div>
    </div>
  </section>`;
}
__name(renderStats, "renderStats");
function option(value, label, selected) {
  const sel = value === selected ? " selected" : "";
  return `<option value="${escapeHtml(value)}"${sel}>${escapeHtml(label)}</option>`;
}
__name(option, "option");
function flash(message) {
  if (!message) return "";
  const isError = message.startsWith("error:");
  const text = isError ? message.slice(6) : message.startsWith("ok:") ? message.slice(3) : message;
  const cls = isError ? "alert alert-error" : "alert alert-success";
  return `<div class="${cls}">${escapeHtml(text)}</div>`;
}
__name(flash, "flash");

// src/admin/dashboard.ts
function renderAdminDashboard(data) {
  const nav = renderNav(data.page, data.siteName);
  let body = "";
  switch (data.page) {
    case "profile":
      body = renderProfileForm(data.profile, data.csrf, data.message);
      break;
    case "links":
      body = renderLinksPanel(data.links, data.csrf, data.message);
      break;
    case "theme":
      body = renderSettingsForm(data.settings, data.csrf, data.message);
      break;
    case "data":
      body = renderDataPanel(data.csrf, data.message);
      break;
    default:
      body = `
        ${renderStats(data.analytics)}
        <section class="panel">
          <h2>Quick links</h2>
          <div class="row-actions">
            <a class="btn btn-secondary" href="/admin/profile">Edit profile</a>
            <a class="btn btn-secondary" href="/admin/links">Manage links</a>
            <a class="btn btn-secondary" href="/admin/theme">Theme</a>
            <a class="btn btn-secondary" href="/admin/data">Import / Export</a>
            <a class="btn btn-secondary" href="/" target="_blank" rel="noopener">View public site</a>
          </div>
        </section>
        <section class="panel">
          <h2>Current profile</h2>
          <p style="margin:0;color:var(--text-secondary)">
            <strong>${escapeHtml(data.profile.name)}</strong>
            ${data.profile.username ? ` \xB7 @${escapeHtml(data.profile.username)}` : ""}
          </p>
          <p style="margin:8px 0 0;color:var(--text-muted);font-size:0.9rem">${escapeHtml(data.profile.bio)}</p>
          <p style="margin:12px 0 0;color:var(--text-muted);font-size:0.85rem">${data.links.filter((l) => l.enabled).length} enabled link(s)</p>
        </section>`;
  }
  const titles = {
    overview: "Dashboard",
    profile: "Profile",
    links: "Links",
    theme: "Theme",
    data: "Data"
  };
  const html = renderLayout({
    title: `${titles[data.page]} \xB7 Admin \xB7 ${data.siteName}`,
    siteName: data.siteName,
    settings: data.settings,
    bodyClass: "admin-body",
    children: `
    <div class="admin-shell">
      ${nav}
      <header class="admin-header">
        <h1>${escapeHtml(titles[data.page])}</h1>
        <p>Manage your bio page content and appearance.</p>
      </header>
      ${body}
    </div>`
  });
  return htmlResponse(html);
}
__name(renderAdminDashboard, "renderAdminDashboard");
function renderLoginPage(opts) {
  const html = renderLayout({
    title: `Admin login \xB7 ${opts.siteName}`,
    siteName: opts.siteName,
    settings: opts.settings,
    bodyClass: "admin-body",
    children: `
    <div class="login-page">
      <div class="login-card">
        <h1>Admin</h1>
        <p class="sub">Sign in to manage ${escapeHtml(opts.siteName)}</p>
        ${opts.error ? `<div class="alert alert-error">${escapeHtml(opts.error)}</div>` : ""}
        <form method="post" action="/admin/login">
          <input type="hidden" name="_csrf" value="${escapeHtml(opts.csrf)}" />
          <div class="field">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" required autocomplete="current-password" autofocus />
            <div class="hint">Uses the ADMIN_PASSWORD secret \u2014 never stored in KV.</div>
          </div>
          <div class="row-actions">
            <button class="btn" type="submit" style="width:100%">Sign in</button>
          </div>
        </form>
      </div>
    </div>`
  });
  return htmlResponse(html);
}
__name(renderLoginPage, "renderLoginPage");
function renderNav(page2, siteName2) {
  const items = [
    { id: "overview", href: "/admin", label: "Overview" },
    { id: "profile", href: "/admin/profile", label: "Profile" },
    { id: "links", href: "/admin/links", label: "Links" },
    { id: "theme", href: "/admin/theme", label: "Theme" },
    { id: "data", href: "/admin/data", label: "Data" },
    { id: "public", href: "/", label: "Public" },
    { id: "logout", href: "/admin/logout", label: "Logout", danger: true }
  ];
  const links = items.map((item) => {
    const active = item.id === page2 ? " active" : "";
    const danger = item.danger ? " danger" : "";
    if (item.id === "logout") {
      return `<a class="nav-link${danger}" href="${item.href}">${item.label}</a>`;
    }
    return `<a class="nav-link${active}${danger}" href="${item.href}">${item.label}</a>`;
  }).join("");
  return `
  <nav class="admin-nav">
    <div class="admin-brand">LinkBio<span>${escapeHtml(siteName2)}</span></div>
    <div class="admin-nav-links">${links}</div>
  </nav>`;
}
__name(renderNav, "renderNav");

// src/types.ts
var KV_KEYS = {
  PROFILE: "profile",
  LINKS: "links",
  SETTINGS: "settings",
  ANALYTICS: "analytics"
};
var DEFAULT_PROFILE = {
  name: "Your Name",
  username: "username",
  bio: "Write a short bio about yourself.",
  avatar: "",
  location: "",
  email: ""
};
var DEFAULT_LINKS = [
  {
    id: "link-github",
    title: "GitHub",
    url: "https://github.com",
    icon: "github",
    order: 0,
    enabled: true
  },
  {
    id: "link-website",
    title: "Website",
    url: "https://example.com",
    icon: "globe",
    order: 1,
    enabled: true
  }
];
var DEFAULT_SETTINGS = {
  theme: "default",
  darkMode: true,
  accentColor: "#6366f1",
  background: "",
  showFooter: true
};
var DEFAULT_ANALYTICS = {
  pageViews: 0,
  linkClicks: {},
  lastUpdated: (/* @__PURE__ */ new Date(0)).toISOString()
};

// src/services/kv.ts
var BioStore = class {
  constructor(kv) {
    this.kv = kv;
  }
  kv;
  static {
    __name(this, "BioStore");
  }
  async getProfile() {
    return await this.getJson(KV_KEYS.PROFILE) ?? { ...DEFAULT_PROFILE };
  }
  async setProfile(profile3) {
    await this.kv.put(KV_KEYS.PROFILE, JSON.stringify(profile3));
  }
  async getLinks() {
    const links = await this.getJson(KV_KEYS.LINKS);
    if (!links) return DEFAULT_LINKS.map((l) => ({ ...l }));
    return links.sort((a, b) => a.order - b.order);
  }
  async setLinks(links) {
    const normalized = links.map((l, i) => ({ ...l, order: typeof l.order === "number" ? l.order : i })).sort((a, b) => a.order - b.order);
    await this.kv.put(KV_KEYS.LINKS, JSON.stringify(normalized));
  }
  async getSettings() {
    return await this.getJson(KV_KEYS.SETTINGS) ?? { ...DEFAULT_SETTINGS };
  }
  async setSettings(settings) {
    await this.kv.put(KV_KEYS.SETTINGS, JSON.stringify(settings));
  }
  async getAnalytics() {
    return await this.getJson(KV_KEYS.ANALYTICS) ?? { ...DEFAULT_ANALYTICS };
  }
  async setAnalytics(analytics) {
    await this.kv.put(KV_KEYS.ANALYTICS, JSON.stringify(analytics));
  }
  async getAll() {
    const [profile3, links, settings, analytics] = await Promise.all([
      this.getProfile(),
      this.getLinks(),
      this.getSettings(),
      this.getAnalytics()
    ]);
    return { profile: profile3, links, settings, analytics };
  }
  async exportAll() {
    return this.getAll();
  }
  async importAll(data) {
    const ops = [];
    if (data.profile) ops.push(this.setProfile(sanitizeProfile(data.profile)));
    if (data.links) ops.push(this.setLinks(data.links.map(sanitizeLink)));
    if (data.settings) ops.push(this.setSettings(sanitizeSettings(data.settings)));
    if (data.analytics) ops.push(this.setAnalytics(sanitizeAnalytics(data.analytics)));
    await Promise.all(ops);
  }
  async incrementPageViews() {
    const analytics = await this.getAnalytics();
    analytics.pageViews += 1;
    analytics.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    await this.setAnalytics(analytics);
  }
  async incrementLinkClick(linkId) {
    const analytics = await this.getAnalytics();
    analytics.linkClicks[linkId] = (analytics.linkClicks[linkId] ?? 0) + 1;
    analytics.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    await this.setAnalytics(analytics);
  }
  async getJson(key) {
    const raw2 = await this.kv.get(key, "text");
    if (!raw2) return null;
    try {
      return JSON.parse(raw2);
    } catch {
      return null;
    }
  }
};
function createStore(env2) {
  return new BioStore(env2.BIO_KV);
}
__name(createStore, "createStore");
function str(v, max = 500) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}
__name(str, "str");
function sanitizeProfile(input) {
  return {
    name: str(input.name, 80) || DEFAULT_PROFILE.name,
    username: str(input.username, 40).replace(/[^a-zA-Z0-9._-]/g, "") || DEFAULT_PROFILE.username,
    bio: str(input.bio, 500) || "",
    avatar: str(input.avatar, 2e3),
    location: str(input.location, 120),
    email: str(input.email, 120)
  };
}
__name(sanitizeProfile, "sanitizeProfile");
function sanitizeLink(input, index = 0) {
  const id = str(input.id, 64) || crypto.randomUUID();
  return {
    id,
    title: str(input.title, 80) || "Link",
    url: sanitizeUrl(str(input.url, 2e3)),
    icon: str(input.icon, 40) || "link",
    order: typeof input.order === "number" && Number.isFinite(input.order) ? input.order : index,
    enabled: input.enabled !== false
  };
}
__name(sanitizeLink, "sanitizeLink");
function sanitizeSettings(input) {
  const accent = str(input.accentColor, 20);
  return {
    theme: str(input.theme, 40) || DEFAULT_SETTINGS.theme,
    darkMode: input.darkMode !== false,
    accentColor: /^#[0-9a-fA-F]{3,8}$/.test(accent) ? accent : DEFAULT_SETTINGS.accentColor,
    background: str(input.background, 2e3),
    showFooter: input.showFooter !== false
  };
}
__name(sanitizeSettings, "sanitizeSettings");
function sanitizeAnalytics(input) {
  const clicks = {};
  if (input.linkClicks && typeof input.linkClicks === "object") {
    for (const [k, v] of Object.entries(input.linkClicks)) {
      if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
        clicks[str(k, 64)] = Math.floor(v);
      }
    }
  }
  return {
    pageViews: typeof input.pageViews === "number" && Number.isFinite(input.pageViews) ? Math.max(0, Math.floor(input.pageViews)) : 0,
    linkClicks: clicks,
    lastUpdated: typeof input.lastUpdated === "string" && input.lastUpdated ? input.lastUpdated : (/* @__PURE__ */ new Date()).toISOString()
  };
}
__name(sanitizeAnalytics, "sanitizeAnalytics");
function sanitizeUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.toString();
  } catch {
    return "";
  }
}
__name(sanitizeUrl, "sanitizeUrl");

// src/routes/admin.ts
var admin = new Hono2();
function ensureSecrets(c) {
  if (!c.env.ADMIN_PASSWORD) return "ADMIN_PASSWORD secret is not configured.";
  if (!c.env.SESSION_SECRET) return "SESSION_SECRET secret is not configured.";
  return null;
}
__name(ensureSecrets, "ensureSecrets");
function siteName(env2) {
  return env2.SITE_NAME || "LinkBio";
}
__name(siteName, "siteName");
function withCsrf(c) {
  const existing = parseCsrfFromCookie(c.req.header("Cookie"));
  if (existing && existing.length >= 16) return { token: existing };
  const token = generateCsrfToken();
  return { token, setCookie: buildCsrfCookie(token, isSecureRequest(c)) };
}
__name(withCsrf, "withCsrf");
function withSetCookie(res, cookie) {
  if (!cookie) return res;
  const out = new Response(res.body, res);
  out.headers.append("Set-Cookie", cookie);
  return out;
}
__name(withSetCookie, "withSetCookie");
async function requireCsrf(c) {
  const body = await c.req.parseBody();
  const form = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === "string") form[k] = v;
  }
  const cookieToken = parseCsrfFromCookie(c.req.header("Cookie"));
  const formToken = form[CSRF_FIELD];
  if (!validateCsrf(cookieToken, formToken)) {
    return { ok: false, error: "Invalid CSRF token. Refresh and try again." };
  }
  return { ok: true, body: form };
}
__name(requireCsrf, "requireCsrf");
admin.get("/login", async (c) => {
  if (c.get("isAdmin")) return c.redirect("/admin");
  const store = createStore(c.env);
  const settings = await store.getSettings().catch(() => ({ ...DEFAULT_SETTINGS }));
  const csrf = withCsrf(c);
  const cfgError = ensureSecrets(c);
  return withSetCookie(
    renderLoginPage({
      siteName: siteName(c.env),
      settings,
      csrf: csrf.token,
      error: cfgError || void 0
    }),
    csrf.setCookie
  );
});
admin.post("/login", async (c) => {
  const store = createStore(c.env);
  const settings = await store.getSettings().catch(() => ({ ...DEFAULT_SETTINGS }));
  const csrf = withCsrf(c);
  const cfgError = ensureSecrets(c);
  if (cfgError) {
    return withSetCookie(
      renderLoginPage({ siteName: siteName(c.env), settings, csrf: csrf.token, error: cfgError }),
      csrf.setCookie
    );
  }
  const checked = await requireCsrf(c);
  if (!checked.ok) {
    return withSetCookie(
      renderLoginPage({ siteName: siteName(c.env), settings, csrf: csrf.token, error: checked.error }),
      csrf.setCookie
    );
  }
  const password = checked.body.password || "";
  const ok = await constantTimeEqual(password, c.env.ADMIN_PASSWORD);
  if (!ok) {
    return withSetCookie(
      renderLoginPage({
        siteName: siteName(c.env),
        settings,
        csrf: csrf.token,
        error: "Incorrect password."
      }),
      csrf.setCookie
    );
  }
  const token = await createSessionToken(c.env.SESSION_SECRET);
  const secure = isSecureRequest(c);
  const res = c.redirect("/admin", 302);
  res.headers.append("Set-Cookie", buildSessionCookie(token, secure));
  res.headers.append("Set-Cookie", buildCsrfCookie(generateCsrfToken(), secure));
  return res;
});
admin.get("/logout", async (c) => {
  const secure = isSecureRequest(c);
  const res = c.redirect("/admin/login", 302);
  res.headers.append("Set-Cookie", buildClearSessionCookie(secure));
  return res;
});
var authed = new Hono2();
authed.use("*", requireAdmin);
async function page(c, which, message) {
  const store = createStore(c.env);
  const [profile3, links, settings, analytics] = await Promise.all([
    store.getProfile(),
    store.getLinks(),
    store.getSettings(),
    store.getAnalytics()
  ]);
  const csrf = withCsrf(c);
  const msg = message ?? c.req.query("msg");
  return withSetCookie(
    renderAdminDashboard({
      siteName: siteName(c.env),
      settings,
      profile: profile3,
      links,
      analytics,
      csrf: csrf.token,
      page: which,
      message: msg
    }),
    csrf.setCookie
  );
}
__name(page, "page");
authed.get("/", (c) => page(c, "overview"));
authed.get("/profile", (c) => page(c, "profile"));
authed.get("/links", (c) => page(c, "links"));
authed.get("/theme", (c) => page(c, "theme"));
authed.get("/data", (c) => page(c, "data"));
authed.get("/export", async (c) => {
  const store = createStore(c.env);
  const data = await store.exportAll();
  return c.json(data, 200, {
    "Content-Disposition": 'attachment; filename="linkbio-backup.json"'
  });
});
authed.post("/profile", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/profile?msg=${encodeURIComponent("error:" + checked.error)}`);
  const b = checked.body;
  const store = createStore(c.env);
  await store.setProfile(
    sanitizeProfile({
      name: b.name,
      username: b.username,
      bio: b.bio,
      avatar: b.avatar,
      location: b.location,
      email: b.email
    })
  );
  return c.redirect("/admin/profile?msg=" + encodeURIComponent("ok:Profile saved."));
});
authed.post("/settings", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/theme?msg=${encodeURIComponent("error:" + checked.error)}`);
  const b = checked.body;
  const store = createStore(c.env);
  await store.setSettings(
    sanitizeSettings({
      theme: b.theme,
      accentColor: b.accentColor,
      background: b.background,
      darkMode: b.darkMode === "1",
      showFooter: b.showFooter === "1"
    })
  );
  return c.redirect("/admin/theme?msg=" + encodeURIComponent("ok:Theme saved."));
});
authed.post("/links", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  const b = checked.body;
  const store = createStore(c.env);
  const links = await store.getLinks();
  const maxOrder = links.reduce((m, l) => Math.max(m, l.order), -1);
  const item = sanitizeLink(
    {
      id: crypto.randomUUID(),
      title: b.title,
      url: b.url,
      icon: b.icon,
      order: maxOrder + 1,
      enabled: b.enabled === "1"
    },
    maxOrder + 1
  );
  if (!item.url) {
    return c.redirect("/admin/links?msg=" + encodeURIComponent("error:Invalid URL. Use http(s) only."));
  }
  links.push(item);
  await store.setLinks(links);
  return c.redirect("/admin/links?msg=" + encodeURIComponent("ok:Link added."));
});
authed.post("/links/:id/delete", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  const id = c.req.param("id");
  const store = createStore(c.env);
  const links = (await store.getLinks()).filter((l) => l.id !== id);
  await store.setLinks(links.map((l, i) => ({ ...l, order: i })));
  return c.redirect("/admin/links?msg=" + encodeURIComponent("ok:Link deleted."));
});
authed.post("/links/:id/toggle", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  const id = c.req.param("id");
  const store = createStore(c.env);
  const links = await store.getLinks();
  const next = links.map((l) => l.id === id ? { ...l, enabled: !l.enabled } : l);
  await store.setLinks(next);
  return c.redirect("/admin/links?msg=" + encodeURIComponent("ok:Link updated."));
});
authed.post("/links/:id/up", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  return reorder(c, c.req.param("id"), -1);
});
authed.post("/links/:id/down", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/links?msg=${encodeURIComponent("error:" + checked.error)}`);
  return reorder(c, c.req.param("id"), 1);
});
async function reorder(c, id, dir3) {
  const store = createStore(c.env);
  const links = (await store.getLinks()).sort((a, b) => a.order - b.order);
  const idx = links.findIndex((l) => l.id === id);
  if (idx < 0) return c.redirect("/admin/links");
  const swap = idx + dir3;
  if (swap < 0 || swap >= links.length) return c.redirect("/admin/links");
  const tmp = links[idx];
  links[idx] = links[swap];
  links[swap] = tmp;
  const normalized = links.map((l, i) => ({ ...l, order: i }));
  await store.setLinks(normalized);
  return c.redirect("/admin/links?msg=" + encodeURIComponent("ok:Order updated."));
}
__name(reorder, "reorder");
authed.post("/import", async (c) => {
  const checked = await requireCsrf(c);
  if (!checked.ok) return c.redirect(`/admin/data?msg=${encodeURIComponent("error:" + checked.error)}`);
  const raw2 = checked.body.json || "";
  try {
    const data = JSON.parse(raw2);
    const store = createStore(c.env);
    await store.importAll({
      profile: data.profile,
      links: data.links,
      settings: data.settings,
      analytics: data.analytics
    });
    return c.redirect("/admin/data?msg=" + encodeURIComponent("ok:Import successful."));
  } catch {
    return c.redirect("/admin/data?msg=" + encodeURIComponent("error:Invalid JSON."));
  }
});
admin.route("/", authed);

// src/routes/api.ts
var api = new Hono2();
api.post("/click", async (c) => {
  let id = "";
  try {
    const body = await c.req.json();
    id = typeof body.id === "string" ? body.id.slice(0, 64) : "";
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  if (!id) return c.json({ error: "Missing id" }, 400);
  const store = createStore(c.env);
  c.executionCtx.waitUntil(store.incrementLinkClick(id));
  return c.json({ ok: true });
});
api.get("/site", async (c) => {
  const store = createStore(c.env);
  const data = await store.getAll();
  return c.json({
    siteName: c.env.SITE_NAME || "LinkBio",
    siteUrl: c.env.SITE_URL || "",
    profile: data.profile,
    links: data.links.filter((l) => l.enabled),
    settings: data.settings
  });
});
var adminApi = new Hono2();
adminApi.use("*", requireAdmin);
adminApi.get("/export", async (c) => {
  const store = createStore(c.env);
  const data = await store.exportAll();
  return c.json(data);
});
adminApi.put("/profile", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  const store = createStore(c.env);
  const profile3 = sanitizeProfile(body);
  await store.setProfile(profile3);
  return c.json({ ok: true, profile: profile3 });
});
adminApi.put("/links", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  if (!Array.isArray(body)) return c.json({ error: "Expected array" }, 400);
  const links = body.map((item, i) => sanitizeLink(item, i));
  const store = createStore(c.env);
  await store.setLinks(links);
  return c.json({ ok: true, links });
});
adminApi.put("/settings", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  const store = createStore(c.env);
  const settings = sanitizeSettings(body);
  await store.setSettings(settings);
  return c.json({ ok: true, settings });
});
adminApi.post("/import", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  const store = createStore(c.env);
  await store.importAll(body);
  return c.json({ ok: true });
});
api.route("/admin", adminApi);

// src/components/links.ts
function renderLinks(links) {
  const enabled = links.filter((l) => l.enabled && l.url).sort((a, b) => a.order - b.order);
  if (!enabled.length) {
    return `<div class="empty">No links yet.</div>`;
  }
  const items = enabled.map((link) => {
    const title2 = escapeHtml(link.title);
    const url = escapeHtml(link.url);
    const icon = iconSvg(link.icon);
    return `<a class="link-btn" href="${url}" rel="noopener noreferrer" target="_blank" data-link-id="${escapeHtml(link.id)}">
        ${icon}
        <span>${title2}</span>
      </a>`;
  }).join("\n");
  return `<nav class="links" aria-label="Links">${items}</nav>`;
}
__name(renderLinks, "renderLinks");

// src/components/profile.ts
function renderProfileBlock(profile3) {
  const name = escapeHtml(profile3.name);
  const username = escapeHtml(profile3.username);
  const bio = escapeHtml(profile3.bio);
  const location = escapeHtml(profile3.location);
  const email = escapeHtml(profile3.email);
  const avatar = escapeHtml(profile3.avatar);
  const initial = escapeHtml((profile3.name || "?").trim().charAt(0).toUpperCase() || "?");
  const avatarHtml = profile3.avatar ? `<img class="avatar" src="${avatar}" alt="${name}" width="96" height="96" loading="eager" />` : `<div class="avatar-fallback" aria-hidden="true">${initial}</div>`;
  const metaParts = [];
  if (profile3.location) {
    metaParts.push(
      `<span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>${location}</span>`
    );
  }
  if (profile3.email) {
    metaParts.push(
      `<span><a href="mailto:${email}">${email}</a></span>`
    );
  }
  return `
  <div class="avatar-wrap">${avatarHtml}</div>
  <div class="profile">
    <h1>${name}</h1>
    ${username ? `<div class="username">@${username}</div>` : ""}
    ${bio ? `<p class="bio">${bio}</p>` : ""}
    ${metaParts.length ? `<div class="meta">${metaParts.join("")}</div>` : ""}
  </div>`;
}
__name(renderProfileBlock, "renderProfileBlock");

// src/routes/public.ts
var publicRoutes = new Hono2();
publicRoutes.get("/", async (c) => {
  const store = createStore(c.env);
  const siteName2 = c.env.SITE_NAME || "LinkBio";
  const [profile3, links, settings] = await Promise.all([
    store.getProfile(),
    store.getLinks(),
    store.getSettings()
  ]);
  c.executionCtx.waitUntil(store.incrementPageViews());
  const bgStyle = settings.background && /^https?:\/\//i.test(settings.background) ? ` style="background-image:linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.75)),url('${escapeHtml(settings.background)}')"` : "";
  const pageClass = settings.background ? "page page--bg" : "page";
  const footer = settings.showFooter ? `<footer class="footer">
        <div>${escapeHtml(siteName2)}</div>
        <div style="margin-top:4px"><a href="/admin">Admin</a></div>
      </footer>` : "";
  const html = renderLayout({
    title: `${profile3.name || siteName2} \xB7 ${siteName2}`,
    siteName: siteName2,
    settings,
    children: `
    <main class="${pageClass}"${bgStyle}>
      <div class="card">
        ${renderProfileBlock(profile3)}
        ${renderLinks(links)}
      </div>
      ${footer}
    </main>
    <script>
      document.querySelectorAll('a[data-link-id]').forEach(function(a){
        a.addEventListener('click', function(){
          var id = a.getAttribute('data-link-id');
          if (!id) return;
          try {
            navigator.sendBeacon('/api/click', JSON.stringify({ id: id }));
          } catch (e) {
            fetch('/api/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }), keepalive: true });
          }
        });
      });
    <\/script>`
  });
  return htmlResponse(html);
});
publicRoutes.get(
  "/health",
  (c) => c.json({
    ok: true,
    service: "linkbio-workers",
    site: c.env.SITE_NAME || "LinkBio"
  })
);
publicRoutes.get("/robots.txt", (c) => {
  return c.text("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n", 200, {
    "Content-Type": "text/plain; charset=utf-8"
  });
});

// src/index.ts
var app = new Hono2();
app.use("*", securityHeaders);
app.use("*", attachAuth);
app.route("/", publicRoutes);
app.route("/api", api);
app.route("/admin", admin);
app.notFound((c) => {
  const accept = c.req.header("Accept") || "";
  if (accept.includes("application/json")) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.html(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Not found</title>
    <style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#0a0a0b;color:#fafafa}
    a{color:#818cf8}</style></head><body><div style="text-align:center"><h1 style="letter-spacing:-.03em">404</h1><p style="color:#a1a1aa">Page not found.</p><p><a href="/">Home</a></p></div></body></html>`,
    404
  );
});
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  const accept = c.req.header("Accept") || "";
  if (accept.includes("application/json") || c.req.path.startsWith("/api/")) {
    return c.json({ error: "Internal server error" }, 500);
  }
  return c.html(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Error</title>
    <style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#0a0a0b;color:#fafafa}</style></head>
    <body><div style="text-align:center"><h1>Something went wrong</h1><p style="color:#a1a1aa">Please try again later.</p><p><a href="/" style="color:#818cf8">Home</a></p></div></body></html>`,
    500
  );
});
var index_default = app;
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

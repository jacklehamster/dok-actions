import { parse } from 'mathjs';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var ConvertBehavior;
(function (ConvertBehavior) {
  ConvertBehavior[ConvertBehavior["NONE"] = 0] = "NONE";
  ConvertBehavior[ConvertBehavior["SKIP_REMAINING_CONVERTORS"] = 1] = "SKIP_REMAINING_CONVERTORS";
  ConvertBehavior[ConvertBehavior["SKIP_REMAINING_ACTIONS"] = 2] = "SKIP_REMAINING_ACTIONS";
})(ConvertBehavior || (ConvertBehavior = {}));
var DEFAULT_EXTERNALS = {
  log: console.log,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
};

function createContext(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$parameters = _ref.parameters,
    parameters = _ref$parameters === void 0 ? [] : _ref$parameters,
    _ref$cleanupActions = _ref.cleanupActions,
    cleanupActions = _ref$cleanupActions === void 0 ? [] : _ref$cleanupActions,
    _ref$objectPool = _ref.objectPool,
    objectPool = _ref$objectPool === void 0 ? [] : _ref$objectPool,
    _ref$postActionListen = _ref.postActionListener,
    postActionListener = _ref$postActionListen === void 0 ? new Set() : _ref$postActionListen,
    _ref$external = _ref.external,
    external = _ref$external === void 0 ? {} : _ref$external;
  return {
    parameters: parameters,
    cleanupActions: cleanupActions,
    objectPool: objectPool,
    postActionListener: postActionListener,
    external: _extends({}, DEFAULT_EXTERNALS, external),
    locked: false
  };
}

function execute(steps, parameters, context) {
  if (parameters === void 0) {
    parameters = {};
  }
  if (context === void 0) {
    context = createContext();
  }
  if (!(steps !== null && steps !== void 0 && steps.length)) {
    return;
  }
  if (!context.parameters) {
    context.parameters = [];
  }
  var changedParameters = context.parameters[context.parameters.length - 1] !== parameters;
  if (changedParameters) {
    context.parameters.push(parameters);
  }
  for (var _iterator = _createForOfIteratorHelperLoose(steps), _step; !(_step = _iterator()).done;) {
    var step = _step.value;
    step(context, parameters);
  }
  context.postActionListener.forEach(function (listener) {
    return listener(context, parameters);
  });
  if (changedParameters) {
    context.parameters.pop();
  }
}

function filterMatchesTags(filter, tags) {
  var _filter$tags;
  return (_filter$tags = filter.tags) === null || _filter$tags === void 0 ? void 0 : _filter$tags.every(function (tag) {
    if (typeof tag === "string") {
      return tags === null || tags === void 0 ? void 0 : tags.some(function (t) {
        return t === tag || Array.isArray(t) && t[0] === tag;
      });
    } else {
      return tags === null || tags === void 0 ? void 0 : tags.some(function (t) {
        return Array.isArray(t) && t[0] === tag[0] && t[1] === tag[1];
      });
    }
  });
}
function filterScripts(scripts, filter) {
  var namesToFilter = !filter.name ? undefined : Array.isArray(filter.name) ? filter.name : [filter.name];
  return scripts.filter(function (_ref) {
    var name = _ref.name,
      tags = _ref.tags;
    if (namesToFilter !== null && namesToFilter !== void 0 && namesToFilter.length && namesToFilter.indexOf(name != null ? name : "") < 0) {
      return false;
    }
    if (filter.tags && !filterMatchesTags(filter, tags)) {
      return false;
    }
    return true;
  });
}

var convertActionsProperty = function convertActionsProperty(action, results, getSteps, external, actionConvertorMap) {
  var _action$actions;
  (_action$actions = action.actions) === null || _action$actions === void 0 ? void 0 : _action$actions.forEach(function (action) {
    return convertAction(action, results, getSteps, external, actionConvertorMap);
  });
};

function hasFormula(resolution) {
  if (isFormula(resolution)) {
    return true;
  }
  if (Array.isArray(resolution)) {
    return resolution.some(function (item) {
      return hasFormula(item);
    });
  }
  if (typeof resolution === "object") {
    return hasFormula(Object.values(resolution));
  }
  return false;
}
function isFormula(value) {
  if (!value) {
    return false;
  }
  if (typeof value !== "string" && typeof value !== "object") {
    return false;
  }
  var formula = typeof value === "string" ? value : value.formula;
  return (formula === null || formula === void 0 ? void 0 : formula.charAt(0)) === "{" && (formula === null || formula === void 0 ? void 0 : formula.charAt(formula.length - 1)) === "}";
}
function calculateEvaluator(evaluator, context, formula, defaultValue) {
  var _context$parameters;
  var scope = context === null || context === void 0 ? void 0 : (_context$parameters = context.parameters) === null || _context$parameters === void 0 ? void 0 : _context$parameters[context.parameters.length - 1];
  try {
    var _evaluator$evaluate;
    return (_evaluator$evaluate = evaluator.evaluate(scope != null ? scope : {})) != null ? _evaluator$evaluate : defaultValue;
  } catch (e) {
    console.error("Error: " + e + " on formula: " + formula + ", scope: ", scope);
  }
  return defaultValue;
}
function getFormulaEvaluator(value) {
  if (!isFormula(value)) {
    throw new Error("Formula: " + value + " must start and end with brackets.");
  }
  var formula = typeof value === "string" ? value : value.formula;
  var mathEvaluator = parse(formula.substring(1, formula.length - 1)).compile();
  return mathEvaluator;
}

function calculateBoolean(value, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = false;
  }
  if (typeof value === "boolean" || typeof value === "number") {
    return !!value;
  }
  if (value === undefined) {
    return {
      valueOf: function valueOf() {
        return defaultValue;
      }
    };
  }
  var evaluator = getFormulaEvaluator(value);
  return {
    valueOf: function valueOf(context) {
      return !!calculateEvaluator(evaluator, context, value, defaultValue);
    }
  };
}

var _excluded = ["condition"];
var convertConditionProperty = function convertConditionProperty(action, results, getSteps, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (action.condition === undefined) {
    return;
  }
  if (!action.condition) {
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
  }
  var condition = action.condition,
    subAction = _objectWithoutPropertiesLoose(action, _excluded);
  var conditionResolution = calculateBoolean(condition);
  var subStepResults = [];
  convertAction(subAction, subStepResults, getSteps, external, actionConversionMap);
  results.push(function (context, parameters) {
    if (conditionResolution.valueOf(context)) {
      execute(subStepResults, parameters, context);
    }
  });
  return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
};

function calculateNumber(value, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = 0;
  }
  if (typeof value === "number") {
    return value;
  }
  if (value === undefined) {
    return {
      valueOf: function valueOf() {
        return defaultValue;
      }
    };
  }
  var evaluator = getFormulaEvaluator(value);
  return {
    valueOf: function valueOf(context) {
      return calculateEvaluator(evaluator, context, value, defaultValue);
    }
  };
}

var _excluded$1 = ["delay"],
  _excluded2 = ["pause"],
  _excluded3 = ["lock", "unlock"];
var convertDelayProperty = function convertDelayProperty(action, results, utils, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (!action.delay) {
    return;
  }
  var delay = action.delay,
    subAction = _objectWithoutPropertiesLoose(action, _excluded$1);
  var delayAmount = calculateNumber(delay);
  var postStepResults = [];
  var remainingActions = utils.getRemainingActions();
  convertAction(subAction, postStepResults, utils, external, actionConversionMap);
  remainingActions.forEach(function (action) {
    convertAction(action, postStepResults, utils, external, actionConversionMap);
  });
  var performPostSteps = function performPostSteps(context, parameters) {
    execute(postStepResults, parameters, context);
  };
  results.push(function (context, parameters) {
    var timeout = external.setTimeout(performPostSteps, delayAmount.valueOf(context), context, parameters);
    context.cleanupActions.push(function () {
      return clearTimeout(timeout);
    });
  });
  return ConvertBehavior.SKIP_REMAINING_ACTIONS;
};
var convertPauseProperty = function convertPauseProperty(action, results, utils, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (!action.pause) {
    return;
  }
  var pause = action.pause,
    subAction = _objectWithoutPropertiesLoose(action, _excluded2);
  var pauseResolution = calculateBoolean(pause);
  var postStepResults = [];
  var remainingActions = utils.getRemainingActions();
  convertAction(subAction, postStepResults, utils, external, actionConversionMap);
  remainingActions.forEach(function (action) {
    convertAction(action, postStepResults, utils, external, actionConversionMap);
  });
  var step = function step(context, parameters) {
    if (!pauseResolution.valueOf(context)) {
      context.postActionListener["delete"](step);
      execute(postStepResults, parameters, context);
    } else if (!context.postActionListener.has(step)) {
      context.postActionListener.add(step);
    }
  };
  results.push(step);
  return ConvertBehavior.SKIP_REMAINING_ACTIONS;
};
var convertLockProperty = function convertLockProperty(action, results, utils, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (!action.lock && !action.unlock) {
    return;
  }
  var lock = action.lock,
    unlock = action.unlock,
    subAction = _objectWithoutPropertiesLoose(action, _excluded3);
  if (unlock) {
    var unlockResolution = calculateBoolean(unlock);
    results.push(function (context) {
      if (unlockResolution.valueOf(context)) {
        context.locked = false;
      }
    });
  }
  if (lock) {
    var lockResolution = calculateBoolean(lock);
    var postStepResults = [];
    var remainingActions = utils.getRemainingActions();
    convertAction(subAction, postStepResults, utils, external, actionConversionMap);
    remainingActions.forEach(function (action) {
      convertAction(action, postStepResults, utils, external, actionConversionMap);
    });
    results.push(function (context, parameters) {
      if (!lockResolution.valueOf(context)) {
        execute(postStepResults, parameters, context);
      } else {
        context.locked = true;
        var step = function step(context, parameters) {
          if (!context.locked) {
            context.postActionListener["delete"](step);
            execute(postStepResults, parameters, context);
          }
        };
        context.postActionListener.add(step);
      }
    });
    return ConvertBehavior.SKIP_REMAINING_ACTIONS;
  }
  return;
};

function calculateArray(value) {
  if (!hasFormula(value)) {
    if (!Array.isArray(value)) {
      throw new Error("value is not an array");
    }
    var _array = value;
    return {
      valueOf: function valueOf() {
        return _array;
      }
    };
  }
  if (!value) {
    return undefined;
  }
  if (isFormula(value)) {
    var formula = value;
    var _evaluator = getFormulaEvaluator(formula);
    return {
      valueOf: function valueOf(context) {
        return calculateEvaluator(_evaluator, context, formula, undefined);
      }
    };
  }
  var array = value;
  var evaluator = array.map(function (resolution) {
    return calculateResolution(resolution);
  });
  return {
    valueOf: function valueOf(context) {
      var value = evaluator.map(function (evalItem) {
        return evalItem === null || evalItem === void 0 ? void 0 : evalItem.valueOf(context);
      });
      return value;
    }
  };
}

function calculateMap(value) {
  if (!hasFormula(value)) {
    var _map = value;
    return {
      valueOf: function valueOf() {
        return _map;
      }
    };
  }
  if (isFormula(value)) {
    var formula = value;
    var evaluator = getFormulaEvaluator(formula);
    return {
      valueOf: function valueOf(context) {
        return calculateEvaluator(evaluator, context, formula, undefined);
      }
    };
  }
  var map = value;
  var evaluatorEntries = Object.entries(map).map(function (_ref) {
    var key = _ref[0],
      resolution = _ref[1];
    return [key, calculateResolution(resolution)];
  });
  return {
    valueOf: function valueOf(context) {
      return Object.fromEntries(evaluatorEntries.map(function (_ref2) {
        var key = _ref2[0],
          evalItem = _ref2[1];
        return [key, evalItem === null || evalItem === void 0 ? void 0 : evalItem.valueOf(context)];
      }));
    }
  };
}

function calculateResolution(value) {
  if (value === undefined) {
    return {
      valueOf: function valueOf() {
        return undefined;
      }
    };
  }
  if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array || value instanceof Int16Array || value instanceof Uint16Array || value instanceof Int32Array || value instanceof Uint32Array) {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string" && (value.charAt(0) !== "{" || value.charAt(value.length - 1) !== "}")) {
    return value;
  }
  if (Array.isArray(value)) {
    return calculateArray(value);
  }
  if (typeof value === "object") {
    return calculateMap(value);
  }
  var evaluator = getFormulaEvaluator(value);
  return {
    valueOf: function valueOf(context) {
      return calculateEvaluator(evaluator, context, value, undefined);
    }
  };
}

var convertLogProperty = function convertLogProperty(action, results, _, external) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (action.log === undefined) {
    return;
  }
  var messages = Array.isArray(action.log) ? action.log : [action.log];
  var resolutions = messages.map(function (m) {
    return calculateResolution(m);
  });
  results.push(function (context) {
    var _external;
    return (_external = external).log.apply(_external, resolutions.map(function (r) {
      return r === null || r === void 0 ? void 0 : r.valueOf(context);
    }));
  });
};

var _excluded$2 = ["loop"];
var convertLoopProperty = function convertLoopProperty(action, stepResults, getSteps, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (actionConversionMap === void 0) {
    actionConversionMap = DEFAULT_CONVERTORS;
  }
  if (action.loop === undefined) {
    return;
  }
  if (!action.loop) {
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
  }
  var loop = action.loop,
    subAction = _objectWithoutPropertiesLoose(action, _excluded$2);
  var loopResolution = calculateNumber(loop, 0);
  var subStepResults = [];
  convertAction(subAction, subStepResults, getSteps, external, actionConversionMap);
  stepResults.push(function (context, parameters) {
    var numLoops = loopResolution.valueOf(context);
    for (var i = 0; i < numLoops; i++) {
      parameters.index = i;
      execute(subStepResults, parameters, context);
    }
  });
  return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
};

function calculateString(value, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = "";
  }
  if (typeof value === "string" && !isFormula(value)) {
    return value;
  }
  if (value === undefined) {
    return {
      valueOf: function valueOf() {
        return defaultValue;
      }
    };
  }
  var evaluator = getFormulaEvaluator(value);
  return {
    valueOf: function valueOf(context) {
      return calculateEvaluator(evaluator, context, value, defaultValue);
    }
  };
}

var _excluded$3 = ["parameters"],
  _excluded2$1 = ["hooks"];
function newParams(context) {
  var _context$objectPool$p, _context$objectPool;
  return (_context$objectPool$p = (_context$objectPool = context.objectPool) === null || _context$objectPool === void 0 ? void 0 : _context$objectPool.pop()) != null ? _context$objectPool$p : {};
}
function recycleParams(context, params) {
  var _context$objectPool2;
  for (var k in params) {
    delete params[k];
  }
  (_context$objectPool2 = context.objectPool) === null || _context$objectPool2 === void 0 ? void 0 : _context$objectPool2.push(params);
}
var convertParametersProperty = function convertParametersProperty(action, results, getSteps, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (!action.parameters) {
    return;
  }
  var parameters = action.parameters,
    subAction = _objectWithoutPropertiesLoose(action, _excluded$3);
  var paramResolutions = parameters;
  var paramEntries = Object.entries(paramResolutions).map(function (_ref) {
    var key = _ref[0],
      resolution = _ref[1];
    return [key, calculateResolution(resolution)];
  });
  var subStepResults = [];
  convertAction(subAction, subStepResults, getSteps, external, actionConversionMap);
  results.push(function (context, parameters) {
    var paramValues = newParams(context);
    for (var k in parameters) {
      paramValues[k] = parameters[k];
    }
    for (var _iterator = _createForOfIteratorHelperLoose(paramEntries), _step; !(_step = _iterator()).done;) {
      var _entry$;
      var entry = _step.value;
      var key = entry[0];
      paramValues[key] = (_entry$ = entry[1]) === null || _entry$ === void 0 ? void 0 : _entry$.valueOf(context);
    }
    execute(subStepResults, paramValues, context);
    recycleParams(context, paramValues);
  });
  return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
};
var convertHooksProperty = function convertHooksProperty(action, results, getSteps, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (!action.hooks) {
    return;
  }
  var hooks = action.hooks,
    subAction = _objectWithoutPropertiesLoose(action, _excluded2$1);
  var hooksResolution = hooks;
  var hooksValueOf = hooksResolution.map(function (hook) {
    return calculateString(hook);
  });
  var subStepResults = [];
  convertAction(subAction, subStepResults, getSteps, external, actionConversionMap);
  results.push(function (context, parameters) {
    var paramValues = newParams(context);
    for (var k in parameters) {
      paramValues[k] = parameters[k];
    }
    for (var _iterator2 = _createForOfIteratorHelperLoose(hooksValueOf), _step2; !(_step2 = _iterator2()).done;) {
      var hook = _step2.value;
      var h = hook.valueOf(context);
      var x = external[h];
      if (x) {
        paramValues[h] = x;
      }
    }
    execute(subStepResults, paramValues, context);
    recycleParams(context, paramValues);
  });
  return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
};

var convertScriptProperty = function convertScriptProperty(action, results, _ref) {
  var _action$scriptTags;
  var getSteps = _ref.getSteps;
  if (!action.script || (_action$scriptTags = action.scriptTags) !== null && _action$scriptTags !== void 0 && _action$scriptTags.length) {
    return;
  }
  var steps = getSteps({
    name: action.script,
    tags: action.scriptTags
  });
  results.push(function (context, parameters) {
    return execute(steps, parameters, context);
  });
};

function getDefaultConvertors() {
  return [convertHooksProperty, convertParametersProperty, convertLoopProperty, convertConditionProperty, convertDelayProperty, convertPauseProperty, convertLockProperty, convertLogProperty, convertScriptProperty, convertActionsProperty];
}
var DEFAULT_CONVERTORS = getDefaultConvertors();

function convertAction(action, stepResults, utils, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  for (var _iterator = _createForOfIteratorHelperLoose(actionConversionMap), _step; !(_step = _iterator()).done;) {
    var convertor = _step.value;
    var convertBehavior = convertor(action, stepResults, utils, external, actionConversionMap);
    if (convertBehavior === ConvertBehavior.SKIP_REMAINING_CONVERTORS) {
      return;
    } else if (convertBehavior === ConvertBehavior.SKIP_REMAINING_ACTIONS) {
      return convertBehavior;
    }
  }
  return;
}
function convertScripts(scripts, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (actionConversionMap === void 0) {
    actionConversionMap = DEFAULT_CONVERTORS;
  }
  var scriptMap = new Map();
  var getSteps = function getSteps(filter) {
    var filteredScripts = filterScripts(scripts, filter);
    var steps = [];
    filteredScripts.forEach(function (script) {
      var _scriptMap$get;
      return steps.push.apply(steps, (_scriptMap$get = scriptMap.get(script)) != null ? _scriptMap$get : []);
    });
    return steps;
  };
  scripts.forEach(function (script) {
    var _scriptMap$get2;
    if (!scriptMap.has(script)) {
      scriptMap.set(script, []);
    }
    var scriptSteps = (_scriptMap$get2 = scriptMap.get(script)) != null ? _scriptMap$get2 : [];
    script.actions.forEach(function (action, index, array) {
      var getRemainingActions = function getRemainingActions() {
        return array.slice(index);
      };
      convertAction(action, scriptSteps, {
        getSteps: getSteps,
        getRemainingActions: getRemainingActions
      }, external, actionConversionMap);
    });
  });
  return scriptMap;
}
function executeScript(scriptName, parameters, scripts, external, actionConversionMap) {
  if (parameters === void 0) {
    parameters = {};
  }
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (actionConversionMap === void 0) {
    actionConversionMap = DEFAULT_CONVERTORS;
  }
  var context = createContext();
  var scriptMap = convertScripts(scripts, external, actionConversionMap);
  var script = scripts.find(function (_ref) {
    var name = _ref.name;
    return name === scriptName;
  });
  var steps = script ? scriptMap.get(script) : [];
  execute(steps, parameters, context);
  return function () {
    context.cleanupActions.forEach(function (action) {
      return action();
    });
    context.cleanupActions.length = 0;
  };
}
function executeAction(action, parameters, context, utils, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  var results = [];
  convertAction(action, results, utils, external, actionConversionMap);
  execute(results, parameters, context);
}

function calculateTypedArray(value, ArrayConstructor) {
  if (ArrayConstructor === void 0) {
    ArrayConstructor = Float32Array;
  }
  if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array || value instanceof Int16Array || value instanceof Uint16Array || value instanceof Int32Array || value instanceof Uint32Array) {
    return value;
  }
  if (Array.isArray(value)) {
    var array = new ArrayConstructor(value.length);
    var compiledArray = value.map(function (value) {
      return calculateNumber(value, 0);
    });
    return {
      valueOf: function valueOf(context) {
        for (var i = 0; i < compiledArray.length; i++) {
          array[i] = compiledArray[i].valueOf(context);
        }
        return array;
      }
    };
  }
  var formula = value;
  var evaluator = getFormulaEvaluator(formula);
  var bufferArray;
  return {
    valueOf: function valueOf(context) {
      var value = calculateEvaluator(evaluator, context, formula, undefined);
      if (!value) {
        return undefined;
      }
      if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array || value instanceof Int16Array || value instanceof Uint16Array || value instanceof Int32Array || value instanceof Uint32Array) {
        return value;
      }
      if (Array.isArray(value)) {
        if (!bufferArray) {
          bufferArray = new ArrayConstructor(value.length);
        }
        bufferArray.set(value);
        return bufferArray;
      }
      if (typeof value === "number") {
        if (!bufferArray) {
          bufferArray = new ArrayConstructor(value / ArrayConstructor.BYTES_PER_ELEMENT);
        }
        return bufferArray;
      }
      throw new Error("Formula " + formula + " doesnt't evaluate to a TypedArray.");
    }
  };
}

var ScriptProcessor = /*#__PURE__*/function () {
  function ScriptProcessor(scripts, external, actionConversionMap) {
    if (external === void 0) {
      external = {};
    }
    if (actionConversionMap === void 0) {
      actionConversionMap = DEFAULT_CONVERTORS;
    }
    this.scripts = scripts;
    this.scriptMap = convertScripts(this.scripts, external, actionConversionMap);
    this.external = _extends({}, DEFAULT_EXTERNALS, external);
  }
  var _proto = ScriptProcessor.prototype;
  _proto.createLoopCleanup = function createLoopCleanup(behavior, context) {
    var cleanupActions = context.cleanupActions;
    return behavior.cleanupAfterLoop && cleanupActions ? function () {
      for (var _iterator = _createForOfIteratorHelperLoose(cleanupActions), _step; !(_step = _iterator()).done;) {
        var action = _step.value;
        action();
      }
      cleanupActions.length = 0;
    } : function () {};
  };
  _proto.getSteps = function getSteps(filter) {
    var _this = this;
    var scripts = filterScripts(this.scripts, filter);
    var steps = [];
    scripts.forEach(function (script) {
      var _this$scriptMap$get;
      return (_this$scriptMap$get = _this.scriptMap.get(script)) === null || _this$scriptMap$get === void 0 ? void 0 : _this$scriptMap$get.forEach(function (step) {
        return steps.push(step);
      });
    });
    return steps;
  };
  _proto.runByName = function runByName(name) {
    var context = createContext();
    execute(this.getSteps({
      name: name
    }), undefined, context);
    return function () {
      var _context$cleanupActio;
      return (_context$cleanupActio = context.cleanupActions) === null || _context$cleanupActio === void 0 ? void 0 : _context$cleanupActio.forEach(function (action) {
        return action();
      });
    };
  };
  _proto.runByTags = function runByTags(tags) {
    var context = createContext();
    execute(this.getSteps({
      tags: tags
    }), undefined, context);
    return function () {
      var _context$cleanupActio2;
      return (_context$cleanupActio2 = context.cleanupActions) === null || _context$cleanupActio2 === void 0 ? void 0 : _context$cleanupActio2.forEach(function (action) {
        return action();
      });
    };
  };
  _proto.loopWithFilter = function loopWithFilter(filter, behavior) {
    if (behavior === void 0) {
      behavior = {};
    }
    var context = createContext();
    var parameters = {
      time: 0
    };
    var steps = this.getSteps(filter);
    var loopCleanup = this.createLoopCleanup(behavior, context);
    var loop = function loop(time) {
      parameters.time = time;
      execute(steps, parameters, context);
      loopCleanup();
      animationFrameId = requestAnimationFrame(loop);
    };
    var animationFrameId = requestAnimationFrame(loop);
    return function () {
      loopCleanup();
      cancelAnimationFrame(animationFrameId);
    };
  };
  _proto.loopByName = function loopByName(name, behavior) {
    if (behavior === void 0) {
      behavior = {};
    }
    return this.loopWithFilter({
      name: name
    }, behavior);
  };
  _proto.loopByTags = function loopByTags(tags, behavior) {
    if (behavior === void 0) {
      behavior = {};
    }
    return this.loopWithFilter({
      tags: tags
    }, behavior);
  };
  return ScriptProcessor;
}();

export { ConvertBehavior, DEFAULT_CONVERTORS, DEFAULT_EXTERNALS, ScriptProcessor, calculateArray, calculateBoolean, calculateEvaluator, calculateNumber, calculateResolution, calculateString, calculateTypedArray, convertAction, convertScripts, createContext, execute, executeAction, executeScript, filterScripts, getDefaultConvertors, getFormulaEvaluator, hasFormula, isFormula };
//# sourceMappingURL=index.modern.js.map

var math = require('mathjs');

(function (ConvertBehavior) {
  ConvertBehavior[ConvertBehavior["NONE"] = 0] = "NONE";
  ConvertBehavior[ConvertBehavior["SKIP_REMAINING"] = 1] = "SKIP_REMAINING";
})(exports.ConvertBehavior || (exports.ConvertBehavior = {}));
var DEFAULT_EXTERNALS = {
  log: console.log
};

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

function execute(steps, parameters, context) {
  if (parameters === void 0) {
    parameters = {};
  }
  if (context === void 0) {
    context = {};
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
  if (changedParameters) {
    context.parameters.pop();
  }
}

var convertActionsProperty = function convertActionsProperty(action, results, getSteps, external) {
  var _action$actions;
  (_action$actions = action.actions) === null || _action$actions === void 0 ? void 0 : _action$actions.forEach(function (action) {
    return convertAction(action, results, getSteps, external);
  });
};

function hasFormula(resolution) {
  if (isFormula(resolution)) {
    return true;
  }
  if (Array.isArray(resolution)) {
    return resolution.some(function (item) {
      return !hasFormula(item);
    });
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
  var mathEvaluator = math.parse(formula.substring(1, formula.length - 1)).compile();
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
var convertConditionProperty = function convertConditionProperty(action, results, getSteps, external) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (action.condition === undefined) {
    return;
  }
  if (!action.condition) {
    return exports.ConvertBehavior.SKIP_REMAINING;
  }
  var condition = action.condition,
    subAction = _objectWithoutPropertiesLoose(action, _excluded);
  var conditionResolution = calculateBoolean(condition);
  var subStepResults = [];
  convertAction(subAction, subStepResults, getSteps, external);
  results.push(function (context, parameters) {
    if (conditionResolution.valueOf(context)) {
      execute(subStepResults, parameters, context);
    }
  });
  return exports.ConvertBehavior.SKIP_REMAINING;
};

function calculateArray(value) {
  if (!hasFormula(value)) {
    if (typeof value === "object") {
      throw new Error("value can't be an object.");
    }
    return value;
  }
  var evaluator = value.map(function (resolution) {
    return calculateResolution(resolution);
  });
  return {
    valueOf: function valueOf(context) {
      var value = evaluator.map(function (evalItem) {
        return evalItem.valueOf(context);
      });
      return value;
    }
  };
}

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

function calculateTypedArray(value, ArrayConstructor, defaultNumberValue) {
  if (ArrayConstructor === void 0) {
    ArrayConstructor = Float32Array;
  }
  if (defaultNumberValue === void 0) {
    defaultNumberValue = 0;
  }
  if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array || value instanceof Int16Array || value instanceof Uint16Array || value instanceof Int32Array || value instanceof Uint32Array) {
    return value;
  }
  if (Array.isArray(value)) {
    var array = new ArrayConstructor(value.length);
    var compiledArray = value.map(function (value) {
      return calculateNumber(value, defaultNumberValue);
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
      if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array || value instanceof Int16Array || value instanceof Uint16Array || value instanceof Int32Array || value instanceof Uint32Array) {
        return value;
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
  if (typeof value === "number") {
    return value;
  }
  if (Array.isArray(value)) {
    if (hasFormula(value)) {
      return calculateArray(value);
    }
    var typeArrayResolution = value;
    return calculateTypedArray(typeArrayResolution);
  }
  if (typeof value === "string" && (value.charAt(0) !== "{" || value.charAt(value.length - 1) !== "}")) {
    return value;
  }
  if (Array.isArray(value)) {
    return calculateArray(value);
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
      return r.valueOf(context);
    }));
  });
};

var _excluded$1 = ["loop"];
var convertLoopProperty = function convertLoopProperty(action, stepResults, getSteps, external) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (action.loop === undefined) {
    return;
  }
  if (!action.loop) {
    return exports.ConvertBehavior.SKIP_REMAINING;
  }
  var loop = action.loop,
    subAction = _objectWithoutPropertiesLoose(action, _excluded$1);
  var loopResolution = calculateNumber(loop, 0);
  var subStepResults = [];
  convertAction(subAction, subStepResults, getSteps, external);
  stepResults.push(function (context, parameters) {
    var numLoops = loopResolution.valueOf(context);
    for (var i = 0; i < numLoops; i++) {
      parameters.index = i;
      execute(subStepResults, parameters, context);
    }
  });
  return exports.ConvertBehavior.SKIP_REMAINING;
};

var _excluded$2 = ["parameters"];
var convertParametersProperty = function convertParametersProperty(action, results, getSteps, external) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (!action.parameters) {
    return;
  }
  var parameters = action.parameters,
    subAction = _objectWithoutPropertiesLoose(action, _excluded$2);
  var paramResolutions = parameters != null ? parameters : {};
  var paramEntries = Object.entries(paramResolutions).map(function (_ref) {
    var key = _ref[0],
      resolution = _ref[1];
    return [key, calculateResolution(resolution)];
  });
  var subStepResults = [];
  convertAction(subAction, subStepResults, getSteps, external);
  results.push(function (context, parameters) {
    var _context$objectPool$p, _context$objectPool, _context$objectPool2;
    var paramValues = (_context$objectPool$p = (_context$objectPool = context.objectPool) === null || _context$objectPool === void 0 ? void 0 : _context$objectPool.pop()) != null ? _context$objectPool$p : {};
    for (var k in parameters) {
      paramValues[k] = parameters[k];
    }
    for (var _iterator = _createForOfIteratorHelperLoose(paramEntries), _step; !(_step = _iterator()).done;) {
      var entry = _step.value;
      var key = entry[0];
      paramValues[key] = entry[1].valueOf(context);
    }
    execute(subStepResults, paramValues, context);
    for (var _k in paramValues) {
      delete paramValues[_k];
    }
    (_context$objectPool2 = context.objectPool) === null || _context$objectPool2 === void 0 ? void 0 : _context$objectPool2.push(paramValues);
  });
  return exports.ConvertBehavior.SKIP_REMAINING;
};

var convertScriptProperty = function convertScriptProperty(action, results, getSteps) {
  if (action.script === undefined) {
    return;
  }
  var steps = getSteps(action.script);
  results.push(function (context, parameters) {
    return execute(steps, parameters, context);
  });
};

var DEFAULT_CONVERTORS = [convertParametersProperty, convertLoopProperty, convertConditionProperty, convertLogProperty, convertScriptProperty, convertActionsProperty];
var convertAction = function convertAction(action, stepResults, getSteps, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (actionConversionMap === void 0) {
    actionConversionMap = DEFAULT_CONVERTORS;
  }
  for (var _iterator = _createForOfIteratorHelperLoose(actionConversionMap), _step; !(_step = _iterator()).done;) {
    var convertor = _step.value;
    if (convertor(action, stepResults, getSteps, external, actionConversionMap) === exports.ConvertBehavior.SKIP_REMAINING) {
      return;
    }
  }
  return;
};
function convertScripts(scripts, external, actionConversionMap) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (actionConversionMap === void 0) {
    actionConversionMap = DEFAULT_CONVERTORS;
  }
  var scriptMap = {};
  var getSteps = function getSteps(name) {
    return name ? scriptMap[name] : [];
  };
  scripts.forEach(function (script) {
    if (!scriptMap[script.name]) {
      scriptMap[script.name] = [];
    }
    var scriptSteps = scriptMap[script.name];
    script.actions.forEach(function (action) {
      convertAction(action, scriptSteps, getSteps, external, actionConversionMap);
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
  var context = {
    parameters: [parameters],
    cleanupActions: []
  };
  var scriptMap = convertScripts(scripts, external, actionConversionMap);
  execute(scriptMap[scriptName], {}, context);
  return function () {
    context.cleanupActions.forEach(function (action) {
      return action();
    });
    context.cleanupActions.length = 0;
  };
}

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

function filterScripts(scripts, filter) {
  return scripts.filter(function (_ref) {
    var _filter$tags;
    var name = _ref.name,
      tags = _ref.tags;
    var namesToFilter = !filter.name ? undefined : Array.isArray(filter.name) ? filter.name : [filter.name];
    if (namesToFilter !== null && namesToFilter !== void 0 && namesToFilter.length && namesToFilter.indexOf(name) < 0) {
      return false;
    }
    if (filter.tags && !((_filter$tags = filter.tags) !== null && _filter$tags !== void 0 && _filter$tags.every(function (tag) {
      if (typeof tag === "string") {
        return tags === null || tags === void 0 ? void 0 : tags.some(function (t) {
          return t === tag || Array.isArray(t) && t[0] === tag;
        });
      } else {
        return tags === null || tags === void 0 ? void 0 : tags.some(function (t) {
          return Array.isArray(t) && t[0] === tag[0] && t[1] === tag[1];
        });
      }
    }))) {
      return false;
    }
    return true;
  });
}

var ScriptProcessor = /*#__PURE__*/function () {
  function ScriptProcessor(scripts, external, actionConversionMap) {
    if (external === void 0) {
      external = DEFAULT_EXTERNALS;
    }
    if (actionConversionMap === void 0) {
      actionConversionMap = DEFAULT_CONVERTORS;
    }
    this.scripts = scripts;
    this.scriptMap = convertScripts(this.scripts, external, actionConversionMap);
    this.external = external;
  }
  var _proto = ScriptProcessor.prototype;
  _proto.createContext = function createContext() {
    return {
      parameters: [],
      cleanupActions: [],
      objectPool: []
    };
  };
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
    scripts.forEach(function (_ref) {
      var name = _ref.name;
      return _this.scriptMap[name].forEach(function (step) {
        return steps.push(step);
      });
    });
    return steps;
  };
  _proto.runByName = function runByName(name) {
    var context = this.createContext();
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
    var context = this.createContext();
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
    var context = this.createContext();
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

exports.DEFAULT_CONVERTORS = DEFAULT_CONVERTORS;
exports.DEFAULT_EXTERNALS = DEFAULT_EXTERNALS;
exports.ScriptProcessor = ScriptProcessor;
exports.calculateArray = calculateArray;
exports.calculateBoolean = calculateBoolean;
exports.calculateEvaluator = calculateEvaluator;
exports.calculateNumber = calculateNumber;
exports.calculateResolution = calculateResolution;
exports.calculateString = calculateString;
exports.calculateTypedArray = calculateTypedArray;
exports.convertAction = convertAction;
exports.convertScripts = convertScripts;
exports.execute = execute;
exports.executeScript = executeScript;
exports.filterScripts = filterScripts;
exports.getFormulaEvaluator = getFormulaEvaluator;
exports.hasFormula = hasFormula;
exports.isFormula = isFormula;
//# sourceMappingURL=index.js.map

import { parse } from 'mathjs';

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

function calculateEvaluator(evaluator, context, formula, defaultValue) {
  var scope = context === null || context === void 0 ? void 0 : context.parameters[context.parameters.length - 1];
  try {
    var _evaluator$evaluate;
    return (_evaluator$evaluate = evaluator.evaluate(scope != null ? scope : {})) != null ? _evaluator$evaluate : defaultValue;
  } catch (e) {
    console.error("Error: " + e + " on formula: " + formula + ", scope: ", scope);
  }
  return defaultValue;
}
function getFormulaEvaluator(value) {
  var formula = typeof value === "string" ? value : value.formula;
  if (formula.charAt(0) !== "{" || formula.charAt(formula.length - 1) !== "}") {
    throw new Error("Formula: " + value + " must start and end with brackets.");
  }
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
    return calculateTypedArray(value);
  }
  if (typeof value === "string" && (value.charAt(0) !== "{" || value.charAt(value.length - 1) !== "}")) {
    return value;
  }
  var evaluator = getFormulaEvaluator(value);
  return {
    valueOf: function valueOf(context) {
      return calculateEvaluator(evaluator, context, value, undefined);
    }
  };
}

var DEFAULT_EXTERNALS = {
  log: console.log
};
function convertScriptAction(action, getSteps) {
  var _action$parameters;
  var steps = getSteps(action.script);
  var elseSteps = action["else"] ? getSteps(action["else"]) : undefined;
  var resolutions = (_action$parameters = action.parameters) != null ? _action$parameters : {};
  var entries = Object.entries(resolutions).map(function (_ref) {
    var key = _ref[0],
      resolution = _ref[1];
    return [key, calculateResolution(resolution)];
  });
  var loopResolution = action.loop ? calculateNumber(action.loop) : 1;
  var conditionResolution = action.condition ? calculateBoolean(action.condition) : true;
  return function (context, parameters) {
    var _context$objectPool$p, _context$objectPool;
    var paramValues = (_context$objectPool$p = (_context$objectPool = context.objectPool) === null || _context$objectPool === void 0 ? void 0 : _context$objectPool.pop()) != null ? _context$objectPool$p : {};
    context.parameters.push(paramValues);
    for (var k in parameters) {
      paramValues[k] = parameters[k];
    }
    for (var _iterator = _createForOfIteratorHelperLoose(entries), _step; !(_step = _iterator()).done;) {
      var entry = _step.value;
      var key = entry[0];
      paramValues[key] = entry[1].valueOf(context);
    }
    var numLoops = loopResolution.valueOf(context);
    for (var index = 0; index < numLoops; index++) {
      paramValues.index = index;
      if (conditionResolution.valueOf(context)) {
        for (var _iterator2 = _createForOfIteratorHelperLoose(steps), _step2; !(_step2 = _iterator2()).done;) {
          var step = _step2.value;
          step(context, paramValues);
        }
      } else if (elseSteps) {
        for (var _iterator3 = _createForOfIteratorHelperLoose(elseSteps), _step3; !(_step3 = _iterator3()).done;) {
          var _step4 = _step3.value;
          _step4(context, paramValues);
        }
      }
    }
    var obj = context.parameters.pop();
    if (obj) {
      var _context$objectPool2;
      for (var _k in obj) {
        delete obj[_k];
      }
      (_context$objectPool2 = context.objectPool) === null || _context$objectPool2 === void 0 ? void 0 : _context$objectPool2.push(obj);
    }
  };
}
var convertAction = function convertAction(action, getSteps, external) {
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  if (typeof action.action === "string" || !action.action) {
    switch (action.action) {
      case "log":
        {
          var messages = action.messages;
          var resolutions = messages.map(function (m) {
            return calculateResolution(m);
          });
          return function (context) {
            external.log.apply(null, resolutions.map(function (r) {
              return r.valueOf(context);
            }));
          };
        }
      case undefined:
      case "execute-script":
        {
          return convertScriptAction(action, getSteps);
        }
    }
  } else {
    var dokAction = action.action;
    var elseAction = action["else"];
    var step = convertAction(dokAction, getSteps, external);
    var elseStep = action["else"] ? convertAction(elseAction, getSteps, external) : undefined;
    var loopResolution = action.loop ? calculateNumber(action.loop) : 1;
    var conditionResolution = action.condition ? calculateBoolean(action.condition) : true;
    return function (context, parameters) {
      var numLoops = loopResolution.valueOf(context);
      for (var i = 0; i < numLoops; i++) {
        parameters.index = i;
        if (conditionResolution.valueOf(context)) {
          step === null || step === void 0 ? void 0 : step(context, parameters);
        } else {
          elseStep === null || elseStep === void 0 ? void 0 : elseStep(context, parameters);
        }
      }
    };
  }
  return;
};
var DEFAULT_CONVERTORS = {
  "log": convertAction,
  "execute-script": convertAction,
  "actionAction": convertAction
};
function convertScripts(scripts, convertors, external) {
  if (convertors === void 0) {
    convertors = DEFAULT_CONVERTORS;
  }
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  var scriptMap = {};
  var getSteps = function getSteps(name) {
    return scriptMap[name];
  };
  scripts.forEach(function (script) {
    if (!scriptMap[script.name]) {
      scriptMap[script.name] = [];
    }
    var scriptSteps = scriptMap[script.name];
    script.actions.forEach(function (action) {
      var _action$action;
      var convertAction = typeof action.action === "string" ? convertors[(_action$action = action.action) != null ? _action$action : "execute-script"] : convertors.actionAction;
      var step = convertAction(action, getSteps, external);
      if (step) {
        scriptSteps.push(step);
      }
    });
  });
  return scriptMap;
}
function executeScript(scriptName, scripts, context, convertors, external) {
  if (convertors === void 0) {
    convertors = DEFAULT_CONVERTORS;
  }
  if (external === void 0) {
    external = DEFAULT_EXTERNALS;
  }
  var scriptMap = convertScripts(scripts, convertors, external);
  var scriptExecutionStep = convertScriptAction({
    script: scriptName
  }, function (name) {
    return scriptMap[name];
  });
  scriptExecutionStep(context, {});
}

function calculateString(value, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = "";
  }
  if (typeof value === "string" && (value.charAt(0) !== "{" || value.charAt(value.length - 1) !== "}")) {
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

function getByTags(scripts, tags) {
  return scripts.filter(function (script) {
    return tags.every(function (tag) {
      if (typeof tag === "string") {
        var _script$tags;
        return (_script$tags = script.tags) === null || _script$tags === void 0 ? void 0 : _script$tags.some(function (t) {
          return t === tag || Array.isArray(t) && t[0] === tag;
        });
      } else {
        var _script$tags2;
        return (_script$tags2 = script.tags) === null || _script$tags2 === void 0 ? void 0 : _script$tags2.some(function (t) {
          return Array.isArray(t) && t[0] === tag[0] && t[1] === tag[1];
        });
      }
    });
  });
}
function getByName(scripts, name) {
  return scripts.filter(function (script) {
    return name.includes(script.name);
  });
}

export { DEFAULT_CONVERTORS, DEFAULT_EXTERNALS, calculateResolution, calculateString, calculateTypedArray, convertAction, convertScripts, executeScript, getByName, getByTags };
//# sourceMappingURL=index.modern.js.map

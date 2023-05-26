import { parse } from 'mathjs';

var ConvertBehavior;
(function (ConvertBehavior) {
  ConvertBehavior[ConvertBehavior["NONE"] = 0] = "NONE";
  ConvertBehavior[ConvertBehavior["SKIP_REMAINING"] = 1] = "SKIP_REMAINING";
})(ConvertBehavior || (ConvertBehavior = {}));
var DEFAULT_EXTERNALS = {
  log: console.log
};

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

function execute(steps, context, parameters) {
  for (var _iterator = _createForOfIteratorHelperLoose(steps), _step; !(_step = _iterator()).done;) {
    var step = _step.value;
    step(context, parameters);
  }
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
function getScriptNamesByTags(scripts, tags) {
  return getByTags(scripts, tags).map(function (_ref) {
    var name = _ref.name;
    return name;
  });
}
function getByName(scripts, name) {
  return scripts.filter(function (script) {
    return name.includes(script.name);
  });
}

export { ConvertBehavior, DEFAULT_EXTERNALS, calculateResolution, calculateString, calculateTypedArray, execute, getByName, getByTags, getScriptNamesByTags };
//# sourceMappingURL=index.modern.js.map

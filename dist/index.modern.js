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

var DEFAULT_EXTERNALS = {
  log: console.log,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  fetch: global.fetch
};

var ObjectPool = /*#__PURE__*/function () {
  function ObjectPool(factory, cleanup) {
    this.pool = [];
    this.factory = factory;
    this.cleanup = cleanup;
  }
  var _proto = ObjectPool.prototype;
  _proto.generate = function generate() {
    var _this$pool$pop;
    return (_this$pool$pop = this.pool.pop()) != null ? _this$pool$pop : this.factory();
  };
  _proto.recycle = function recycle(value) {
    this.cleanup(value);
    this.pool.push(value);
  };
  return ObjectPool;
}();

function createContext(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$parameters = _ref.parameters,
    parameters = _ref$parameters === void 0 ? [] : _ref$parameters,
    _ref$cleanupActions = _ref.cleanupActions,
    cleanupActions = _ref$cleanupActions === void 0 ? [] : _ref$cleanupActions,
    _ref$objectPool = _ref.objectPool,
    objectPool = _ref$objectPool === void 0 ? new ObjectPool(function () {
      return {};
    }, function (value) {
      for (var k in value) {
        delete value[k];
      }
    }) : _ref$objectPool,
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

var ConvertBehavior;
(function (ConvertBehavior) {
  ConvertBehavior[ConvertBehavior["NONE"] = 0] = "NONE";
  ConvertBehavior[ConvertBehavior["SKIP_REMAINING_CONVERTORS"] = 1] = "SKIP_REMAINING_CONVERTORS";
  ConvertBehavior[ConvertBehavior["SKIP_REMAINING_ACTIONS"] = 2] = "SKIP_REMAINING_ACTIONS";
})(ConvertBehavior || (ConvertBehavior = {}));

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

// Asynchronously iterate through an object's values
// Uses for...of if the runtime supports it, otherwise iterates until length on a copy
function _forOf(target, body, check) {
	if (typeof target[_iteratorSymbol] === "function") {
		var iterator = target[_iteratorSymbol](), step, pact, reject;
		function _cycle(result) {
			try {
				while (!(step = iterator.next()).done && (!check || !check())) {
					result = body(step.value);
					if (result && result.then) {
						if (_isSettledPact(result)) {
							result = result.v;
						} else {
							result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
							return;
						}
					}
				}
				if (pact) {
					_settle(pact, 1, result);
				} else {
					pact = result;
				}
			} catch (e) {
				_settle(pact || (pact = new _Pact()), 2, e);
			}
		}
		_cycle();
		if (iterator.return) {
			var _fixup = function(value) {
				try {
					if (!step.done) {
						iterator.return();
					}
				} catch(e) {
				}
				return value;
			};
			if (pact && pact.then) {
				return pact.then(_fixup, function(e) {
					throw _fixup(e);
				});
			}
			_fixup();
		}
		return pact;
	}
	// No support for Symbol.iterator
	if (!("length" in target)) {
		throw new TypeError("Object is not iterable");
	}
	// Handle live collections properly
	var values = [];
	for (var i = 0; i < target.length; i++) {
		values.push(target[i]);
	}
	return _forTo(values, function(i) { return body(values[i]); }, check);
}

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

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
  var params = context.parameters;
  var changedParameters = params[params.length - 1] !== parameters;
  if (changedParameters) {
    params.push(parameters);
  }
  for (var _iterator = _createForOfIteratorHelperLoose(steps), _step; !(_step = _iterator()).done;) {
    var step = _step.value;
    step(parameters, context);
  }
  context.postActionListener.forEach(function (listener) {
    for (var i in parameters) {
      listener.parameters[i] = parameters[i];
    }
    listener.steps.forEach(function (step) {
      return step(listener.parameters, context);
    });
  });
  if (changedParameters) {
    params.pop();
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

var executeAction = function executeAction(action, parameters, context, utils, convertorSet) {
  try {
    var results = [];
    var _ConvertBehavior$SKIP = ConvertBehavior.SKIP_REMAINING_ACTIONS;
    return Promise.resolve(convertAction(action, results, utils, context.external, convertorSet)).then(function (_convertAction) {
      if (_ConvertBehavior$SKIP !== _convertAction) {
        execute(results, parameters, context);
      }
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var executeScript = function executeScript(scriptName, parameters, scripts, external, convertorSet, processorHelper) {
  if (parameters === void 0) {
    parameters = {};
  }
  try {
    var context = createContext();
    return Promise.resolve(convertScripts(scripts, external, convertorSet, processorHelper)).then(function (scriptMap) {
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
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var convertScripts = function convertScripts(scripts, external, convertorSet, processorHelper) {
  try {
    var scriptMap = new Map();
    scripts.forEach(function (script) {
      return scriptMap.set(script, []);
    });
    var getSteps = function getSteps(filter) {
      var filteredScripts = filterScripts(scripts, filter);
      var steps = [];
      filteredScripts.forEach(function (script) {
        return steps.push.apply(steps, scriptMap.get(script));
      });
      return steps;
    };
    var _temp2 = _forOf(scripts, function (script) {
      var _scriptMap$get;
      var _interrupt = false;
      var scriptSteps = (_scriptMap$get = scriptMap.get(script)) != null ? _scriptMap$get : [];
      var actions = script.actions;
      var _temp = _forTo(actions, function (i) {
        var getRemainingActions = function getRemainingActions() {
          return actions.slice(i + 1);
        };
        return Promise.resolve(convertAction(actions[i], scriptSteps, {
          getSteps: getSteps,
          getRemainingActions: getRemainingActions,
          refreshSteps: processorHelper.refreshSteps,
          stopRefresh: processorHelper.stopRefresh
        }, external, convertorSet)).then(function (convertBehavior) {
          if (convertBehavior === ConvertBehavior.SKIP_REMAINING_ACTIONS) {
            _interrupt = true;
          }
        });
      }, function () {
        return _interrupt;
      });
      if (_temp && _temp.then) return _temp.then(function () {});
    });
    return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {
      return scriptMap;
    }) : scriptMap);
  } catch (e) {
    return Promise.reject(e);
  }
};
var convertAction = function convertAction(action, stepResults, utils, external, convertorSet) {
  try {
    var _exit = false;
    return Promise.resolve(_forOf(convertorSet.actionsConvertor, function (convertor) {
      return Promise.resolve(convertor(action, stepResults, utils, external, convertorSet)).then(function (convertBehavior) {
        if (convertBehavior === ConvertBehavior.SKIP_REMAINING_CONVERTORS) {
          _exit = true;
        } else if (convertBehavior === ConvertBehavior.SKIP_REMAINING_ACTIONS) {
          _exit = true;
          return convertBehavior;
        }
      });
    }, function () {
      return _exit;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};

function newParams(parameters, context) {
  var params = context.objectPool.generate();
  for (var k in parameters) {
    params[k] = parameters[k];
  }
  return params;
}
function recycleParams(params, context) {
  context.objectPool.recycle(params);
}

var FORMULA_SEPERATORS = ["~", "{", "}"];

function hasFormula(resolution) {
  if (isFormula(resolution)) {
    return true;
  }
  if (Array.isArray(resolution)) {
    return resolution.some(function (item) {
      return hasFormula(item);
    });
  }
  if (resolution && typeof resolution === "object") {
    return hasFormula(Object.values(resolution)) || hasFormula(Object.keys(resolution));
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
  var _FORMULA_SEPERATORS$m = FORMULA_SEPERATORS.map(function (_char) {
      return formula === null || formula === void 0 ? void 0 : formula.indexOf(_char);
    }),
    startCharacter = _FORMULA_SEPERATORS$m[0],
    prefix = _FORMULA_SEPERATORS$m[1],
    suffix = _FORMULA_SEPERATORS$m[2];
  return startCharacter === 0 && prefix > startCharacter && suffix > prefix;
}
function getInnerFormulas(formula) {
  var startCharacter = FORMULA_SEPERATORS[0],
    prefix = FORMULA_SEPERATORS[1],
    suffix = FORMULA_SEPERATORS[2];
  return formula.substring(startCharacter.length).split(prefix).map(function (chunk, index) {
    if (index === 0) {
      return {
        textSuffix: chunk,
        formula: ""
      };
    }
    var _chunk$split = chunk.split(suffix),
      formula = _chunk$split[0],
      textSuffix = _chunk$split[1];
    return {
      formula: formula,
      textSuffix: textSuffix
    };
  }).filter(function (_ref) {
    var textSuffix = _ref.textSuffix,
      formula = _ref.formula;
    return textSuffix.length || formula.length;
  });
}
var IDENTIFIER_REGEX = /^([^\x00-\x7F]|[A-Za-z_])([^\x00-\x7F]|\w)+$/;
function isSimpleInnerFormula(innerFormula) {
  return IDENTIFIER_REGEX.test(innerFormula);
}

function calculateEvaluator(evaluator, parameters, formula, defaultValue) {
  if (parameters === void 0) {
    parameters = {};
  }
  var scope = parameters;
  try {
    var _evaluator$evaluate;
    return (_evaluator$evaluate = evaluator.evaluate(scope != null ? scope : {})) != null ? _evaluator$evaluate : defaultValue;
  } catch (e) {
    console.error("Error: " + e + " on formula: " + formula + ", scope: ", JSON.parse(JSON.stringify(scope)));
  }
  return defaultValue;
}
function getEvaluator(formula) {
  if (!formula.length) {
    return {
      evaluate: function evaluate() {
        return "";
      }
    };
  }
  var mathEvaluator = parse(formula).compile();
  if (isSimpleInnerFormula(formula)) {
    return {
      evaluate: function evaluate(scope) {
        var _scope$formula;
        return (_scope$formula = scope[formula]) != null ? _scope$formula : mathEvaluator.evaluate(scope);
      }
    };
  }
  return mathEvaluator;
}
function getFormulaEvaluator(value) {
  if (!isFormula(value)) {
    throw new Error("Formula: " + value + " must match the format: \"" + FORMULA_SEPERATORS[0] + "formula" + FORMULA_SEPERATORS[1] + "\".");
  }
  var values = getInnerFormulas(value);
  if (values.length === 1 && !values[0].textSuffix.length) {
    return getEvaluator(values[0].formula);
  } else {
    var evaluators = values.map(function (_ref) {
      var formula = _ref.formula,
        textSuffix = _ref.textSuffix;
      return {
        mathEvaluator: getEvaluator(formula),
        textSuffix: textSuffix
      };
    });
    return {
      evaluate: function evaluate(scope) {
        return evaluators.map(function (_ref2) {
          var mathEvaluator = _ref2.mathEvaluator,
            textSuffix = _ref2.textSuffix;
          return mathEvaluator.evaluate(scope) + textSuffix;
        }).join("");
      }
    };
  }
}

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
      valueOf: function valueOf(parameters) {
        return calculateEvaluator(_evaluator, parameters, formula, undefined);
      }
    };
  }
  var array = value;
  var evaluator = array.map(function (resolution) {
    return calculateResolution(resolution);
  });
  return {
    valueOf: function valueOf(parameters) {
      return evaluator.map(function (evalItem) {
        return evalItem === null || evalItem === void 0 ? void 0 : evalItem.valueOf(parameters);
      });
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
      valueOf: function valueOf(parameters) {
        return calculateEvaluator(evaluator, parameters, formula, undefined);
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
    valueOf: function valueOf(parameters) {
      return Object.fromEntries(evaluatorEntries.map(function (_ref2) {
        var key = _ref2[0],
          evalItem = _ref2[1];
        return [key, evalItem === null || evalItem === void 0 ? void 0 : evalItem.valueOf(parameters)];
      }));
    }
  };
}

function calculateResolution(value) {
  if (!value) {
    return {
      valueOf: function valueOf() {
        return value;
      }
    };
  }
  if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array || value instanceof Int16Array || value instanceof Uint16Array || value instanceof Int32Array || value instanceof Uint32Array) {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string" && !isFormula(value)) {
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
    valueOf: function valueOf(parameters) {
      if (parameters === void 0) {
        parameters = {};
      }
      return calculateEvaluator(evaluator, parameters, value, undefined);
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
    valueOf: function valueOf(parameters) {
      return calculateEvaluator(evaluator, parameters, value, defaultValue);
    }
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
    valueOf: function valueOf(parameters) {
      return calculateEvaluator(evaluator, parameters, value, defaultValue);
    }
  };
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
    valueOf: function valueOf(parameters) {
      return !!calculateEvaluator(evaluator, parameters, value, defaultValue);
    }
  };
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
      valueOf: function valueOf(parameters) {
        for (var i = 0; i < compiledArray.length; i++) {
          array[i] = compiledArray[i].valueOf(parameters);
        }
        return array;
      }
    };
  }
  var formula = value;
  var evaluator = getFormulaEvaluator(formula);
  var bufferArray;
  return {
    valueOf: function valueOf(parameters) {
      var value = calculateEvaluator(evaluator, parameters, formula, undefined);
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

var convertActionsProperty = function convertActionsProperty(action, results, utils, external, convertorSet) {
  try {
    var _action$actions;
    if (!((_action$actions = action.actions) !== null && _action$actions !== void 0 && _action$actions.length)) {
      return Promise.resolve();
    }
    var _temp = _forOf(action.actions, function (a) {
      return Promise.resolve(convertAction(a, results, utils, external, convertorSet)).then(function () {});
    });
    return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};

var _excluded = ["condition"];
var convertConditionProperty = function convertConditionProperty(action, results, utils, external, convertorSet) {
  try {
    if (action.condition === undefined) {
      return Promise.resolve();
    }
    if (!action.condition) {
      return Promise.resolve(ConvertBehavior.SKIP_REMAINING_CONVERTORS);
    }
    var condition = action.condition,
      subAction = _objectWithoutPropertiesLoose(action, _excluded);
    var conditionResolution = calculateBoolean(condition);
    var subStepResults = [];
    return Promise.resolve(convertAction(subAction, subStepResults, utils, external, convertorSet)).then(function () {
      results.push(function (parameters, context) {
        if (conditionResolution.valueOf(parameters)) {
          execute(subStepResults, parameters, context);
        }
      });
      return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var convertExternalCallProperty = function convertExternalCallProperty(action, results, _, external) {
  try {
    if (action.callExternal === undefined) {
      return Promise.resolve();
    }
    var callExternal = action.callExternal;
    var nameResolution = calculateString(callExternal.name);
    var args = !callExternal.arguments ? [] : Array.isArray(callExternal.arguments) ? callExternal.arguments : [callExternal.arguments];
    var resolutions = args.map(function (m) {
      return calculateResolution(m);
    });
    results.push(function (parameters) {
      var name = nameResolution.valueOf(parameters);
      var fun = external[name];
      if (typeof fun === "function") {
        fun.apply(void 0, resolutions.map(function (r) {
          return r === null || r === void 0 ? void 0 : r.valueOf(parameters);
        }));
      }
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

var _excluded$1 = ["delay"],
  _excluded2 = ["pause"],
  _excluded3 = ["lock", "unlock"];
var convertLockProperty = function convertLockProperty(action, results, utils, external, convertorSet) {
  try {
    if (!action.lock && !action.unlock) {
      return Promise.resolve();
    }
    var lock = action.lock,
      unlock = action.unlock,
      subAction = _objectWithoutPropertiesLoose(action, _excluded3);
    if (unlock) {
      var unlockResolution = calculateBoolean(unlock);
      results.push(function (parameters, context) {
        if (unlockResolution.valueOf(parameters)) {
          context.locked = false;
        }
      });
    }
    return Promise.resolve(function () {
      if (lock) {
        var lockResolution = calculateBoolean(lock);
        var postStepResults = [];
        var remainingActions = utils.getRemainingActions();
        return Promise.resolve(convertAction(subAction, postStepResults, utils, external, convertorSet)).then(function () {
          function _temp6() {
            results.push(function (parameters, context) {
              if (!lockResolution.valueOf(parameters)) {
                execute(postStepResults, parameters, context);
              } else {
                context.locked = true;
                var step = function step(parameters, context) {
                  for (var i in parameters) {
                    postExecution.parameters[i] = parameters[i];
                  }
                  if (!context.locked) {
                    context.postActionListener["delete"](postExecution);
                    execute(postStepResults, parameters, context);
                  }
                };
                var postExecution = {
                  steps: [step],
                  parameters: parameters
                };
                context.postActionListener.add(postExecution);
              }
            });
            return ConvertBehavior.SKIP_REMAINING_ACTIONS;
          }
          var _temp5 = _forOf(remainingActions, function (action) {
            return Promise.resolve(convertAction(action, postStepResults, utils, external, convertorSet)).then(function () {});
          });
          return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
        });
      }
    }());
  } catch (e) {
    return Promise.reject(e);
  }
};
var convertPauseProperty = function convertPauseProperty(action, results, utils, external, convertorSet) {
  try {
    if (!action.pause) {
      return Promise.resolve();
    }
    var pause = action.pause,
      subAction = _objectWithoutPropertiesLoose(action, _excluded2);
    var pauseResolution = calculateBoolean(pause);
    var postStepResults = [];
    var remainingActions = utils.getRemainingActions();
    return Promise.resolve(convertAction(subAction, postStepResults, utils, external, convertorSet)).then(function () {
      function _temp4() {
        var step = function step(parameters, context) {
          for (var i in parameters) {
            postExecution.parameters[i] = parameters[i];
          }
          if (!pauseResolution.valueOf(postExecution.parameters)) {
            context.postActionListener["delete"](postExecution);
            execute(postStepResults, postExecution.parameters, context);
          } else if (!context.postActionListener.has(postExecution)) {
            context.postActionListener.add(postExecution);
          }
        };
        var postExecution = {
          steps: [step],
          parameters: {}
        };
        results.push(step);
        return ConvertBehavior.SKIP_REMAINING_ACTIONS;
      }
      var _temp3 = _forOf(remainingActions, function (action) {
        return Promise.resolve(convertAction(action, postStepResults, utils, external, convertorSet)).then(function () {});
      });
      return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var convertDelayProperty = function convertDelayProperty(action, results, utils, external, convertorSet) {
  try {
    if (!action.delay) {
      return Promise.resolve();
    }
    var delay = action.delay,
      subAction = _objectWithoutPropertiesLoose(action, _excluded$1);
    var delayAmount = calculateNumber(delay);
    var postStepResults = [];
    var remainingActions = utils.getRemainingActions();
    return Promise.resolve(convertAction(subAction, postStepResults, utils, external, convertorSet)).then(function () {
      function _temp2() {
        var performPostSteps = function performPostSteps(context, parameters) {
          execute(postStepResults, parameters, context);
        };
        results.push(function (parameters, context) {
          var timeout = external.setTimeout(performPostSteps, delayAmount.valueOf(parameters), context, parameters);
          context.cleanupActions.push(function () {
            return clearTimeout(timeout);
          });
        });
        return ConvertBehavior.SKIP_REMAINING_ACTIONS;
      }
      var _temp = _forOf(remainingActions, function (action) {
        return Promise.resolve(convertAction(action, postStepResults, utils, external, convertorSet)).then(function () {});
      });
      return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var convertDefaultValuesProperty = function convertDefaultValuesProperty(action, results) {
  try {
    if (!action.defaultValues) {
      return Promise.resolve();
    }
    var defaultValues = action.defaultValues;
    var defaultValuesEntries = !defaultValues ? [] : Object.entries(defaultValues).map(function (_ref2) {
      var key = _ref2[0],
        value = _ref2[1];
      return [key, calculateResolution(value)];
    });
    results.push(function (parameters, context) {
      var paramsTemp = newParams(undefined, context);
      for (var _iterator3 = _createForOfIteratorHelperLoose(defaultValuesEntries), _step3; !(_step3 = _iterator3()).done;) {
        var _step3$value = _step3.value,
          key = _step3$value[0],
          value = _step3$value[1];
        parameters.value = parameters[key];
        paramsTemp[key] = value === null || value === void 0 ? void 0 : value.valueOf(parameters);
      }
      delete parameters.value;
      for (var _iterator4 = _createForOfIteratorHelperLoose(defaultValuesEntries), _step4; !(_step4 = _iterator4()).done;) {
        var _step4$value = _step4.value,
          _key2 = _step4$value[0];
        if (parameters[_key2] === undefined) {
          parameters[_key2] = paramsTemp[_key2];
        }
      }
      recycleParams(paramsTemp, context);
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};
var convertSetsProperty = function convertSetsProperty(action, results) {
  try {
    if (!action.sets) {
      return Promise.resolve();
    }
    var sets = action.sets;
    var setsEntries = !sets ? [] : Object.entries(sets).map(function (_ref) {
      var key = _ref[0],
        value = _ref[1];
      return [key, calculateResolution(value)];
    });
    results.push(function (parameters, context) {
      var paramsTemp = newParams(undefined, context);
      for (var _iterator = _createForOfIteratorHelperLoose(setsEntries), _step; !(_step = _iterator()).done;) {
        var _step$value = _step.value,
          key = _step$value[0],
          value = _step$value[1];
        parameters.value = parameters[key];
        paramsTemp[key] = value === null || value === void 0 ? void 0 : value.valueOf(parameters);
      }
      delete parameters.value;
      for (var _iterator2 = _createForOfIteratorHelperLoose(setsEntries), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
          _key = _step2$value[0];
        parameters[_key] = paramsTemp[_key];
      }
      recycleParams(paramsTemp, context);
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};
var convertSetProperty = function convertSetProperty(action, results) {
  try {
    var _set$access$map, _set$access;
    if (!action.set) {
      return Promise.resolve();
    }
    var set = action.set;
    var variable = calculateString(set.variable);
    var access = [variable].concat((_set$access$map = (_set$access = set.access) === null || _set$access === void 0 ? void 0 : _set$access.map(function (a) {
      return calculateResolution(a);
    })) != null ? _set$access$map : []);
    var value = calculateResolution(set.value);
    results.push(function (parameters) {
      var root = parameters;
      for (var i = 0; i < access.length; i++) {
        var _access$i;
        if (!root) {
          console.warn("Invalid access");
          return;
        }
        var key = (_access$i = access[i]) === null || _access$i === void 0 ? void 0 : _access$i.valueOf(parameters);
        if (Array.isArray(root)) {
          if (typeof key === "number") {
            if (i === access.length - 1) {
              parameters.value = root[key];
              root[key] = value === null || value === void 0 ? void 0 : value.valueOf(parameters);
            } else {
              root = root[key];
            }
          } else {
            console.warn("Invalid key for array: ", key);
          }
        } else if (typeof root === "object") {
          if (i === access.length - 1) {
            parameters.value = root[key + ""];
            root[key + ""] = value === null || value === void 0 ? void 0 : value.valueOf(parameters);
          } else {
            root = root[key + ""];
          }
        }
      }
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

var convertHooksProperty = function convertHooksProperty(action, results, _, external) {
  try {
    if (!action.hooks) {
      return Promise.resolve();
    }
    var hooks = action.hooks;
    var hooksResolution = hooks;
    var hooksValueOf = hooksResolution.map(function (hook) {
      return calculateString(hook);
    });
    results.push(function (parameters) {
      for (var _iterator = _createForOfIteratorHelperLoose(hooksValueOf), _step; !(_step = _iterator()).done;) {
        var hook = _step.value;
        var h = hook.valueOf(parameters);
        var x = external[h];
        if (x) {
          parameters[h] = x;
        } else {
          console.warn("Does not exist", x);
        }
      }
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

var convertLogProperty = function convertLogProperty(action, results, _, external) {
  try {
    if (action.log === undefined) {
      return Promise.resolve();
    }
    var messages = Array.isArray(action.log) ? action.log : [action.log];
    var resolutions = messages.map(function (m) {
      return calculateResolution(m);
    });
    results.push(function (parameters) {
      return external.log.apply(external, resolutions.map(function (r) {
        return r === null || r === void 0 ? void 0 : r.valueOf(parameters);
      }));
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

var _excluded$2 = ["loop"],
  _excluded3$1 = ["loopEach"];
var convertLoopEachProperty = function convertLoopEachProperty(action, stepResults, utils, external, convertorSet) {
  try {
    if (action.loopEach === undefined) {
      return Promise.resolve();
    }
    var loopEach = action.loopEach,
      subAction = _objectWithoutPropertiesLoose(action, _excluded3$1);
    var loopEachResolution = calculateArray(loopEach);
    var subStepResults = [];
    return Promise.resolve(convertAction(subAction, subStepResults, utils, external, convertorSet)).then(function () {
      stepResults.push(function (parameters, context) {
        var array = loopEachResolution === null || loopEachResolution === void 0 ? void 0 : loopEachResolution.valueOf(parameters);
        if (array) {
          for (var i = 0; i < array.length; i++) {
            parameters.index = i;
            parameters.element = array[i];
            execute(subStepResults, parameters, context);
          }
        }
      });
      return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var convertLoopProperty = function convertLoopProperty(action, stepResults, utils, external, convertorSet) {
  try {
    if (action.loop === undefined) {
      return Promise.resolve();
    }
    if (!action.loop) {
      return Promise.resolve(ConvertBehavior.SKIP_REMAINING_CONVERTORS);
    }
    var loop = action.loop,
      subAction = _objectWithoutPropertiesLoose(action, _excluded$2);
    var loops = Array.isArray(loop) ? loop : [loop];
    if (!loops.length) {
      return Promise.resolve(ConvertBehavior.SKIP_REMAINING_CONVERTORS);
    }
    var loopResolution = loops.map(function (loop) {
      return calculateNumber(loop, 0);
    });
    var subStepResults = [];
    return Promise.resolve(convertAction(subAction, subStepResults, utils, external, convertorSet)).then(function () {
      stepResults.push(function (parameters, context) {
        return keepLooping(parameters, context, loopResolution, subStepResults);
      });
      return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var VARIABLE_NAMES = "ijklmnopqrstuvwxyzabcdefgh".split("");
function keepLooping(parameters, context, loops, steps, depth) {
  if (depth === void 0) {
    depth = 0;
  }
  if (depth >= loops.length) {
    execute(steps, parameters, context);
    return;
  }
  var length = loops[depth].valueOf(parameters);
  var p = parameters;
  var letter = VARIABLE_NAMES[depth];
  for (var i = 0; i < length; i++) {
    p.index = p[letter] = i;
    keepLooping(p, context, loops, steps, depth + 1);
  }
}

var _excluded$3 = ["parameters"];
var convertParametersProperty = function convertParametersProperty(action, results, utils, external, convertorSet) {
  try {
    if (!action.parameters) {
      return Promise.resolve();
    }
    var parameters = action.parameters,
      subAction = _objectWithoutPropertiesLoose(action, _excluded$3);
    var paramEntries = Object.entries(parameters != null ? parameters : {}).map(function (_ref) {
      var key = _ref[0],
        resolution = _ref[1];
      return [key, calculateResolution(resolution)];
    });
    var subStepResults = [];
    return Promise.resolve(convertAction(subAction, subStepResults, utils, external, convertorSet)).then(function () {
      results.push(function (parameters, context) {
        var paramValues = newParams(undefined, context);
        for (var _iterator = _createForOfIteratorHelperLoose(paramEntries), _step; !(_step = _iterator()).done;) {
          var _entry$;
          var entry = _step.value;
          var key = entry[0];
          paramValues[key] = (_entry$ = entry[1]) === null || _entry$ === void 0 ? void 0 : _entry$.valueOf(parameters);
        }
        execute(subStepResults, paramValues, context);
        recycleParams(paramValues, context);
      });
      return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var _excluded$4 = ["refresh"];
var convertRefreshProperty = function convertRefreshProperty(action, stepResults, utils, external, convertorSet) {
  try {
    if (!action.refresh) {
      return Promise.resolve();
    }
    var refresh = action.refresh,
      subAction = _objectWithoutPropertiesLoose(action, _excluded$4);
    var subStepResults = [];
    var processId = calculateString(refresh.processId, "");
    var stop = calculateBoolean(refresh.stop);
    var cleanupAfterRefresh = calculateBoolean(refresh.cleanupAfterRefresh);
    var frameRate = calculateNumber(refresh.frameRate, 60);
    return Promise.resolve(convertAction(subAction, subStepResults, utils, external, convertorSet)).then(function () {
      stepResults.push(function (parameters, context) {
        if (stop.valueOf(parameters)) {
          utils.stopRefresh(processId.valueOf(parameters));
        } else {
          var cleanup = utils.refreshSteps(subStepResults, {
            cleanupAfterRefresh: cleanupAfterRefresh.valueOf(parameters),
            frameRate: frameRate.valueOf(parameters),
            parameters: parameters
          }, processId.valueOf(parameters));
          context.cleanupActions.push(cleanup);
        }
      });
      return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var convertScriptProperty = function convertScriptProperty(action, results, _ref) {
  var getSteps = _ref.getSteps;
  try {
    if (!action.executeScript) {
      return Promise.resolve();
    }
    var executeScript = action.executeScript;
    var name = executeScript;
    var steps = getSteps({
      name: name
    });
    results.push(function (parameters, context) {
      return execute(steps, parameters, context);
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

function getDefaultConvertors() {
  return {
    actionsConvertor: [convertHooksProperty, convertParametersProperty, convertDefaultValuesProperty, convertRefreshProperty, convertLoopEachProperty, convertLoopProperty, convertConditionProperty, convertDelayProperty, convertPauseProperty, convertLockProperty, convertSetProperty, convertSetsProperty, convertLogProperty, convertExternalCallProperty, convertScriptProperty, convertActionsProperty]
  };
}

var ScriptProcessor = /*#__PURE__*/function () {
  function ScriptProcessor(scripts, external, convertorSet) {
    if (external === void 0) {
      external = {};
    }
    if (convertorSet === void 0) {
      convertorSet = getDefaultConvertors();
    }
    this.refreshCleanups = {};
    this.scripts = scripts;
    this.convertorSet = convertorSet;
    this.external = _extends({}, DEFAULT_EXTERNALS, external);
  }
  var _proto = ScriptProcessor.prototype;
  _proto.clear = function clear() {
    var _this = this;
    Object.values(this.refreshCleanups).forEach(function (cleanup) {
      cleanup();
    });
    Object.keys(this.refreshCleanups).forEach(function (key) {
      delete _this.refreshCleanups[key];
    });
  };
  _proto.fetchScripts = function fetchScripts() {
    try {
      var _temp2 = function _temp2() {
        return _this2.scriptMap;
      };
      var _this2 = this;
      var _temp = function () {
        if (!_this2.scriptMap) {
          return Promise.resolve(convertScripts(_this2.scripts, _this2.external, _this2.convertorSet, {
            refreshSteps: _this2.refreshSteps.bind(_this2),
            stopRefresh: _this2.stopRefresh.bind(_this2)
          })).then(function (_convertScripts) {
            _this2.scriptMap = _convertScripts;
          });
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.createRefreshCleanup = function createRefreshCleanup(behavior, context) {
    var cleanupActions = context.cleanupActions;
    return behavior.cleanupAfterRefresh && cleanupActions ? function () {
      for (var _iterator = _createForOfIteratorHelperLoose(cleanupActions), _step; !(_step = _iterator()).done;) {
        var cleanup = _step.value;
        cleanup();
      }
      cleanupActions.length = 0;
    } : function () {};
  };
  _proto.getSteps = function getSteps(filter) {
    try {
      var _this3 = this;
      return Promise.resolve(_this3.fetchScripts()).then(function (scriptMap) {
        var scripts = filterScripts(_this3.scripts, filter);
        var steps = [];
        scripts.forEach(function (script) {
          var _scriptMap$get;
          return (_scriptMap$get = scriptMap.get(script)) === null || _scriptMap$get === void 0 ? void 0 : _scriptMap$get.forEach(function (step) {
            return steps.push(step);
          });
        });
        return steps;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.runByName = function runByName(name, parameters) {
    try {
      var _this4 = this;
      var context = createContext();
      return Promise.resolve(_this4.getSteps({
        name: name
      })).then(function (_this4$getSteps) {
        execute(_this4$getSteps, parameters, context);
        return function () {
          var _context$cleanupActio;
          return (_context$cleanupActio = context.cleanupActions) === null || _context$cleanupActio === void 0 ? void 0 : _context$cleanupActio.forEach(function (action) {
            return action();
          });
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.runByTags = function runByTags(tags, parameters) {
    try {
      var _this5 = this;
      var context = createContext();
      return Promise.resolve(_this5.getSteps({
        tags: tags
      })).then(function (_this5$getSteps) {
        execute(_this5$getSteps, parameters, context);
        return function () {
          var _context$cleanupActio2;
          return (_context$cleanupActio2 = context.cleanupActions) === null || _context$cleanupActio2 === void 0 ? void 0 : _context$cleanupActio2.forEach(function (action) {
            return action();
          });
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.refreshWithFilter = function refreshWithFilter(filter, behavior) {
    if (behavior === void 0) {
      behavior = {};
    }
    try {
      var _this6 = this;
      var _refreshSteps = _this6.refreshSteps;
      return Promise.resolve(_this6.getSteps(filter)).then(function (_this6$getSteps) {
        return _refreshSteps.call(_this6, _this6$getSteps, behavior);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.stopRefresh = function stopRefresh(processId) {
    var _this$refreshCleanups, _this$refreshCleanups2;
    (_this$refreshCleanups = (_this$refreshCleanups2 = this.refreshCleanups)[processId]) === null || _this$refreshCleanups === void 0 ? void 0 : _this$refreshCleanups.call(_this$refreshCleanups2);
    delete this.refreshCleanups[processId];
  };
  _proto.refreshSteps = function refreshSteps(steps, behavior, processId) {
    var _behavior$frameRate;
    if (behavior === void 0) {
      behavior = {};
    }
    var context = createContext();
    var parameters = _extends({}, behavior.parameters, {
      time: 0,
      frame: 0
    });
    var refreshCleanup = this.createRefreshCleanup(behavior, context);
    var frameRate = (_behavior$frameRate = behavior.frameRate) != null ? _behavior$frameRate : 60;
    var frameMs = 1000 / frameRate;
    var lastFrameTime = Number.MIN_SAFE_INTEGER;
    var frame = 0;
    var loop = function loop(time) {
      if (time >= lastFrameTime + frameMs) {
        parameters.time = time;
        parameters.frame = frame;
        execute(steps, parameters, context);
        refreshCleanup();
        frame++;
        lastFrameTime = time;
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    var animationFrameId = requestAnimationFrame(loop);
    var cleanup = function cleanup() {
      refreshCleanup();
      cancelAnimationFrame(animationFrameId);
    };
    if (processId !== null && processId !== void 0 && processId.length) {
      this.refreshCleanups[processId] = cleanup;
    }
    return cleanup;
  };
  _proto.refreshByName = function refreshByName(name, behavior) {
    if (behavior === void 0) {
      behavior = {};
    }
    return this.refreshWithFilter({
      name: name
    }, behavior);
  };
  _proto.refreshByTags = function refreshByTags(tags, behavior) {
    if (behavior === void 0) {
      behavior = {};
    }
    return this.refreshWithFilter({
      tags: tags
    }, behavior);
  };
  return ScriptProcessor;
}();

export { ConvertBehavior, DEFAULT_EXTERNALS, FORMULA_SEPERATORS, ObjectPool, ScriptProcessor, calculateArray, calculateBoolean, calculateEvaluator, calculateNumber, calculateResolution, calculateString, calculateTypedArray, convertAction, convertScripts, createContext, execute, executeAction, executeScript, filterScripts, getDefaultConvertors, getFormulaEvaluator, getInnerFormulas, hasFormula, isFormula, isSimpleInnerFormula, newParams, recycleParams };
//# sourceMappingURL=index.modern.js.map

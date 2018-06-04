(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("vue-chromecast-plugin", [], factory);
	else if(typeof exports === 'object')
		exports["vue-chromecast-plugin"] = factory();
	else
		root["vue-chromecast-plugin"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _chromecastSdk = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  install: function install(Vue, options) {
    var $chromecast = {};

    var VueEvents = new _utils2.default.Events(Vue);

    _chromecastSdk.Sender.prototype.$events = VueEvents.$events;
    _chromecastSdk.Receiver.prototype.$events = VueEvents.$events;

    if (_utils2.default.checkIfChromecast()) {
      $chromecast.Receiver = new _chromecastSdk.Receiver(options);
    } else {
      $chromecast.Sender = new _chromecastSdk.Sender(options);
    }

    $chromecast.$on = function (eventName, eventHandler) {
      VueEvents.$events.$on(eventName, eventHandler);
    };

    // Register the vue plugin
    Vue.prototype.$chromecast = $chromecast;
  }
};
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = function Events(Vue) {
  _classCallCheck(this, Events);

  this.$events = new Vue({
    methods: {
      /**
       * Emit the given event.
       *
       * @param {string|object} event
       * @param {...*} args
       */
      emit: function emit(event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        this.$emit.apply(this, [event].concat(_toConsumableArray(args)));
      },


      /**
       * Listen for the given event.
       *
       * @param {string} event
       * @param {function} callback
       */
      on: function on(event, callback) {
        this.$on(event, callback);
      },


      /**
       * Remove one or more event listeners.
       *
       * @param {string} event
       * @param {function} callback
       */
      off: function off(event, callback) {
        this.$off(event, callback);
      }
    }
  });
};

function checkIfChromecast() {
  return navigator.userAgent.indexOf('CrKey') !== -1;
}

exports.default = { Events: Events, checkIfChromecast: checkIfChromecast };
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _console = console,
    log = _console.log;

var Sender = function () {
  function Sender(params) {
    var _this = this;

    _classCallCheck(this, Sender);

    this.log = log;
    this.session = null;
    this.params = params;

    // If isn't a google chrome browser, obviously don't even try to start
    // ChromeCast Web SDK.
    if (window.chrome) {
      this.loadScript();

      window['__onGCastApiAvailable'] = function (isAvailable) {
        if (isAvailable) {
          _this.initialize();
        }
      };
    }
  }

  _createClass(Sender, [{
    key: 'loadScript',
    value: function loadScript() {
      // Inject chromecast script
      var castScript = document.createElement('script');

      castScript.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js' + '?loadCastFramework=1';
      document.getElementsByTagName('head')[0].appendChild(castScript);
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      this.chrome = window.chrome;
      this.cast = window.cast;

      if (!this.cast || !this.cast.framework) {
        setTimeout(this.initialize.bind(this), 150);
        return;
      }

      this.context = this.cast.framework.CastContext.getInstance();

      this.cast.framework.setLoggerLevel(0);

      // Set Cast options
      this.context.setOptions({
        receiverApplicationId: this.params.appId,
        autoJoinPolicy: this.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        language: 'en'
      });

      this.context.addEventListener(this.cast.framework.CastContextEventType.CAST_STATE_CHANGED, function (response) {
        return _this2.stateChangedHandler(response);
      });

      this.context.addEventListener(this.cast.framework.CastContextEventType.SESSION_STATE_CHANGED, function (response) {
        return _this2.stateChangedHandler(response);
      });
    }
  }, {
    key: 'requestSession',
    value: function requestSession(callback) {
      this.context.requestSession().then(function () {
        if (callback) {
          callback();
        }
      });
    }
  }, {
    key: 'stateChangedHandler',
    value: function stateChangedHandler(response) {
      if (response.sessionState === 'SESSION_ENDED') {
        this.session = null;
      }

      if (response.sessionState === 'SESSION_RESUMED' || response.sessionState === 'SESSION_STARTED') {
        this.session = response.session.getSessionObj();
      }

      if (response.sessionState) {
        this.$events.$emit(response.type, response.sessionState);
      }

      if (response.type === 'sessionstatechanged') {
        this.log('[SESSION] ' + response.sessionState + ': ' + (this.session && this.session.sessionId));
      } else {
        this.log('[DEBUG] ' + response.type + ': ' + JSON.stringify(response));
      }
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(message) {
      var _this3 = this;

      if (this.session) {
        this.session.sendMessage(this.params.appNamespace, message, function () {
          return _this3.onMessageSuccess(message);
        }, function (e) {
          return _this3.onMessageError(e);
        });
      } else {
        this.requestSession(function () {
          _this3.session.sendMessage(_this3.params.appNamespace, message, function () {
            return _this3.onMessageSuccess(message);
          }, function (e) {
            return _this3.onMessageError(e);
          });
        });
      }
    }
  }, {
    key: 'casting',
    value: function casting(callback) {
      // If isn't a google chrome browser, obviously don't even try
      if (this.chrome) {
        this.requestSession(callback);
      }
    }
  }, {
    key: 'stopCasting',
    value: function stopCasting(callback) {
      // If isn't a google chrome browser, obviously don't even try
      if (!this.chrome) {
        return;
      }

      this.$events.$emit('sessionstatechanged', 'SESSION_ENDING');

      if (this.session) {
        this.context.endCurrentSession(true);
      } else if (callback) {
        this.stateChangedHandler({
          sessionState: 'SESSION_ENDED',
          type: 'sessionstatechanged'
        });

        callback();
      }
    }
  }, {
    key: 'onMessageError',
    value: function onMessageError(message) {
      this.log('onMessageError: ' + JSON.stringify(message));

      // Erase the local session in case mismatch with the receiver
      if (message.code === 'invalid_parameter' || message.code === 'timeout' || message.code === 'cancel') {
        this.session = null;
      }

      if (message.code) {
        this.$events.$emit('sessionstatechanged', message.code);
      }
    }
  }, {
    key: 'onMessageSuccess',
    value: function onMessageSuccess(message) {
      this.log('onSuccess: ' + JSON.stringify(message));

      if (message.callback) {
        message.callback();
      }
    }
  }]);

  return Sender;
}();

var Receiver = function () {
  function Receiver(params) {
    _classCallCheck(this, Receiver);

    this.log = log;
    this.params = params;

    this.loadScript();
    this.initialize();
  }

  _createClass(Receiver, [{
    key: 'loadScript',
    value: function loadScript() {
      // Inject chromecast script
      var castScript = document.createElement('script');

      castScript.src = '//www.gstatic.com/cast/sdk/libs/caf_receiver/v3/' + 'cast_receiver_framework.js';
      document.getElementsByTagName('head')[0].appendChild(castScript);
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this4 = this;

      if (!window.cast || !window.cast.framework) {
        setTimeout(this.initialize.bind(this), 150);
        return;
      }

      var _window = window,
          cast = _window.cast;


      var options = new cast.framework.CastReceiverOptions();

      // Set inactivity at 60 minutes if option maxInactivity is not passed
      options.maxInactivity = this.params.maxInactivity || 3600000;

      var context = cast.framework.CastReceiverContext.getInstance();

      context.addCustomMessageListener(this.params.appNamespace, function (customEvent) {
        var dataStringified = JSON.stringify(customEvent.data);

        if (customEvent.data.method) {
          _this4.$events.$emit('message', dataStringified);
        }

        _this4.log('Message [' + customEvent.senderId + ']: ' + dataStringified);
      });

      context.start(options);
    }
  }]);

  return Receiver;
}();

exports.Sender = Sender;
exports.Receiver = Receiver;

/***/ })
/******/ ]);
});
//# sourceMappingURL=vue-chromecast-plugin.js.map
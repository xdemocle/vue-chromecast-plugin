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
    var $chromecast = new Vue();

    if (_utils2.default.checkIfChromecast()) {
      $chromecast.Receiver = new _chromecastSdk.Receiver(options);
    } else {
      $chromecast.Sender = new _chromecastSdk.Sender(options);
    }

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
function checkIfChromecast() {
  return navigator.userAgent.indexOf('CrKey') !== -1;
}

exports.default = { checkIfChromecast: checkIfChromecast };
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
var _window = window,
    chrome = _window.chrome;

var Sender = function () {
  function Sender(params) {
    var _this = this;

    _classCallCheck(this, Sender);

    this.log = log;
    this.params = params;

    // If isn't a google chrome browser, obviously don't even try to start
    // ChromeCast Web SDK.
    if (chrome) {
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

      castScript.src = '//www.gstatic.com/cv/js/sender/v1/cast_sender.js' + '?loadCastFramework=1';
      document.getElementsByTagName('head')[0].appendChild(castScript);
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _window2 = window,
          cast = _window2.cast,
          chrome = _window2.chrome;


      if (!cast || !cast.framework) {
        setTimeout(this.initialize.bind(this), 150);
        return;
      }

      this.context = cast.framework.CastContext.getInstance();

      cast.framework.setLoggerLevel(0);

      // Set Cast options
      this.context.setOptions({
        receiverApplicationId: this.params.appId,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        language: 'en'
      });

      this.eventListeners();
    }
  }, {
    key: 'eventListeners',
    value: function eventListeners() {
      var _this2 = this;

      var _window3 = window,
          cast = _window3.cast;


      this.context.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, function (response) {
        return _this2.stateChangedHandler(response);
      });

      this.context.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, function (response) {
        return _this2.stateChangedHandler(response);
      });
    }
  }, {
    key: 'stateChangedHandler',
    value: function stateChangedHandler(response) {
      var _window4 = window,
          cast = _window4.cast;


      if (response.sessionState) {
        this.$events.$emit(response.type, response.sessionState);
      }

      if (response.type === 'sessionstatechanged') {
        var castSession = cast.framework.CastContext.getInstance().getCurrentSession();

        this.log('[SESSION] ' + response.sessionState + ': ' + (castSession && castSession.getSessionId() || '...'));
      } else {
        this.log('[DEBUG] ' + response.type + ': ' + JSON.stringify(response));
      }
    }
  }, {
    key: 'requestSession',
    value: function requestSession() {
      return this.context.requestSession();
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(message) {
      var _this3 = this;

      var _window5 = window,
          cast = _window5.cast;

      var castSession = cast.framework.CastContext.getInstance().getCurrentSession();

      return castSession.sendMessage(this.params.appNamespace, message).then(function () {
        return _this3.onMessageSuccess(message);
      }).catch(function (e) {
        return _this3.onMessageError(e);
      });
    }
  }, {
    key: 'casting',
    value: function casting() {
      // If isn't a google chrome browser, obviously don't even try
      if (chrome) {
        return this.requestSession();
      }

      return {};
    }
  }, {
    key: 'stopCasting',
    value: function stopCasting(callback) {
      var _window6 = window,
          cast = _window6.cast,
          chrome = _window6.chrome;

      // If isn't a google chrome browser, obviously don't even try

      if (!chrome) {
        return;
      }

      this.$events.$emit('sessionstatechanged', 'SESSION_ENDING');

      var castSession = cast.framework.CastContext.getInstance().getCurrentSession();

      if (castSession) {
        // End the session and pass 'true' to indicate
        // that receiver application should be stopped.
        castSession.endSession(true);
        if (callback) {
          callback();
        }
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
      if (message.code) {
        this.$events.$emit('sessionstatechanged', message.code);
      }

      this.log('onMessageError: ' + JSON.stringify(message));
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
      var _window7 = window,
          cast = _window7.cast;


      if (!cast || !cast.framework) {
        setTimeout(this.initialize.bind(this), 150);
        return;
      }

      var options = new cast.framework.CastReceiverOptions();

      // Set inactivity at 6 hours if option maxInactivity is not passed
      options.maxInactivity = this.params.maxInactivity || 21600000;

      var context = cast.framework.CastReceiverContext.getInstance();

      this.registerListenersCore(context);

      // Set inactivity at 6 hours if option maxInactivity is not passed
      context.setInactivityTimeout(this.params.maxInactivity || 21600000);

      context.start(options);
    }
  }, {
    key: 'registerListenersCore',
    value: function registerListenersCore(context) {
      var _this4 = this;

      context.addCustomMessageListener(this.params.appNamespace, function (customEvent) {
        var dataStringified = JSON.stringify(customEvent.data);

        if (customEvent.data.method) {
          _this4.$events.$emit('message', dataStringified);
        }

        _this4.log('Message [' + customEvent.senderId + ']: ' + dataStringified);
      });
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
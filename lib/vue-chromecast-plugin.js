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
    var applicationId = options.applicationId,
        applicationName = options.applicationName,
        applicationNamespace = options.applicationNamespace;


    var VueEvents = new _utils2.default.Events(Vue);

    _chromecastSdk.Sender.prototype.$events = VueEvents.$events;
    _chromecastSdk.Receiver.prototype.$events = VueEvents.$events;

    if (_utils2.default.checkIfChromecast()) {
      $chromecast.Receiver = new _chromecastSdk.Receiver({
        applicationName: applicationName,
        applicationNamespace: applicationNamespace
      });
    } else {
      $chromecast.Sender = new _chromecastSdk.Sender({
        applicationId: applicationId,
        applicationNamespace: applicationNamespace
      });
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

      if (!window.cast || !window.cast.framework) {
        setTimeout(function () {
          return _this2.initialize();
        }, 150);
        return;
      }

      var _window = window,
          cast = _window.cast;


      var context = cast.framework.CastContext.getInstance();

      // Set Cast options
      context.setOptions({
        receiverApplicationId: this.params.applicationId,
        // autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        autoJoinPolicy: 'origin_scoped',
        language: 'en'
      });

      this.sessionRequest = context.requestSession();

      this.sessionRequest.then(function (e) {
        debugger;
      }).catch(function (e) {
        debugger;
      });

      // this.sessionRequest = new chrome.cast.SessionRequest(this.params.applicationId);

      // // DELETED
      // this.apiConfig = new chrome.cast.ApiConfig(
      //   this.sessionRequest,
      //   (e) => this.sessionListener(e),
      //   (e) => this.availabilityListener(e)
      // );

      // // DELETED
      // chrome.cast.initialize(
      //   this.apiConfig,
      //   (e) => this.onInitSuccess(e),
      //   (e) => this.onError(e)
      // );
    }
  }, {
    key: 'onInitSuccess',
    value: function onInitSuccess(e) {
      this.$events.$emit('onInitSuccess', e);
    }
  }, {
    key: 'onError',
    value: function onError(message) {
      this.log('onError: ' + JSON.stringify(message));

      // Erase the local session in case mismatch with the receiver
      if (message.code === 'invalid_parameter' || message.code === 'timeout') {
        this.session = null;
      }

      if (message.code) {
        this.$events.$emit('sessionUpdate', message.code);
      }
    }
  }, {
    key: 'onSuccess',
    value: function onSuccess(message) {
      this.log('onSuccess: ' + JSON.stringify(message));

      if (message.callback) {
        message.callback();
      }
    }
  }, {
    key: 'sessionListener',
    value: function sessionListener(e) {
      var _this3 = this;

      this.log('New session ID: ' + e.sessionId);
      this.session = e;
      this.session.addUpdateListener(function (e) {
        return _this3.sessionUpdateListener;
      });

      this.$events.$emit('sessionUpdate', 'new');
    }
  }, {
    key: 'sessionUpdateListener',
    value: function sessionUpdateListener(isAlive) {
      var sessionStatus = isAlive ? 'updated' : 'removed';

      this.log('Session ' + sessionStatus + ': ' + this.session.sessionId);

      if (!isAlive) {
        this.session = null;
      }

      this.$events.$emit('sessionUpdate', sessionStatus);
    }
  }, {
    key: 'availabilityListener',
    value: function availabilityListener(e) {
      console.log('availabilityListener', e);
      this.$events.$emit('availabilityListener', e);
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(message) {
      var _this4 = this;

      if (this.session !== null) {
        this.session.sendMessage(this.params.applicationNamespace, message, function () {
          return _this4.onSuccess(message);
        }, function (e) {
          return _this4.onError(e);
        });
      } else {
        chrome.cast.requestSession(function (e) {
          _this4.session = e;
          _this4.sessionListener(e);

          _this4.session.sendMessage(_this4.params.applicationNamespace, message, function () {
            return _this4.onSuccess(message);
          }, function (e) {
            return _this4.onError(e);
          });
        }, function (e) {
          return _this4.onError(e);
        });
      }
    }
  }, {
    key: 'cast',
    value: function cast(callback) {
      // If isn't a google chrome browser, obviously don't even try
      if (chrome) {
        this.sendMessage({ callback: callback });
        this.$events.$emit('sessionUpdate', 'connecting');
      }
    }
  }, {
    key: 'stopCasting',
    value: function stopCasting(callback) {
      var _this5 = this;

      // If isn't a google chrome browser, obviously don't even try
      if (!chrome) {
        return;
      }

      this.$events.$emit('sessionUpdate', 'disconnecting');

      // Ugly piece shit of code below, but we need to listen any case during
      // disconnection in order to provide a rapid and certain connection
      // from the UI.
      if (this.session) {
        this.session.stop(function (e) {
          _this5.session = null;
          if (callback) {
            callback(e);
          }
          _this5.$events.$emit('sessionUpdate', 'disconnected');
        }, function (e) {
          return _this5.onError(e);
        });
      } else if (callback) {
        callback();
        this.$events.$emit('sessionUpdate', 'disconnected');
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
      if (!window.cast || !window.cast.framework.CastReceiverContext) {
        setTimeout(this.initialize.bind(this), 150);
        return;
      }

      var _window2 = window,
          cast = _window2.cast;


      var context = cast.framework.CastReceiverContext.getInstance();
      var playerManager = context.getPlayerManager();

      // intercept the LOAD request to be able to read in a contentId and get data
      playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, function (loadRequestData) {
        debugger;
        if (loadRequestData.media && loadRequestData.media.contentId) {
          debugger;
        }
        return loadRequestData;
      });

      // listen to all Core Events
      playerManager.addEventListener(cast.framework.events.category.CORE, function (event) {
        console.log(event);
      });

      debugger;

      // this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

      // this.log('Starting Receiver Manager');

      // this.castReceiverManager.onReady = (event) => {
      //   this.log(`Received Ready event: ${JSON.stringify(event.data)}`);
      //   this.castReceiverManager.setApplicationState(`${this.params.applicationName} is ready...`);
      // };

      // this.castReceiverManager.onSenderConnected = (event) => {
      //   this.log(`Received Sender Connected event: ${event.senderId}`);
      // };

      // this.castReceiverManager.onSenderDisconnected = (event) => {
      //   this.log(`Received Sender Disconnected event: ${event.senderId}`);
      // };

      // this.messageBus = this.castReceiverManager.getCastMessageBus(
      //   this.params.applicationNamespace,
      //   cast.receiver.CastMessageBus.MessageType.JSON
      // );

      // this.messageBus.onMessage = (event) => {
      //   this.log(`Message [${event.senderId}]: ${event.data}`);

      //   if (event.data.method) {
      //     this.$events.$emit('message', JSON.stringify(event.data));
      //   }
      // };

      // Initialize the CastReceiverManager with an application status message.
      // this.castReceiverManager.start({ statusText: 'Application is starting' });

      this.log('Receiver Manager started');
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
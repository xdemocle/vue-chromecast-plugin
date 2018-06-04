const { log } = console;

class Sender {
  constructor(params) {
    this.log = log;
    this.session = null;
    this.params = params;

    // If isn't a google chrome browser, obviously don't even try to start
    // ChromeCast Web SDK.
    if (window.chrome) {
      this.loadScript();

      window['__onGCastApiAvailable'] = (isAvailable) => {
        if (isAvailable) {
          this.initialize();
        }
      };
    }
  }

  loadScript() {
    // Inject chromecast script
    const castScript = document.createElement('script');

    castScript.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js' +
      '?loadCastFramework=1';
    document.getElementsByTagName('head')[0].appendChild(castScript);
  }

  initialize() {
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

    this.context.addEventListener(
      this.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      (response) => this.stateChangedHandler(response)
    );

    this.context.addEventListener(
      this.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      (response) => this.stateChangedHandler(response)
    );
  }

  requestSession(callback) {
    this.context.requestSession().then(() => {
      if (callback) {
        callback();
      }
    });
  }

  stateChangedHandler(response) {
    if (response.sessionState === 'SESSION_ENDED') {
      this.session = null;
    }

    if (response.sessionState === 'SESSION_RESUMED' ||
        response.sessionState === 'SESSION_STARTED') {
      this.session = response.session.getSessionObj();
    }

    if (response.sessionState) {
      this.$events.$emit(response.type, response.sessionState);
    }

    if (response.type === 'sessionstatechanged') {
      this.log(`[SESSION] ${response.sessionState}: ${this.session && this.session.sessionId}`);
    } else {
      this.log(`[DEBUG] ${response.type}: ${JSON.stringify(response)}`);
    }
  }

  sendMessage(message) {
    if (this.session) {
      this.session.sendMessage(
        this.params.appNamespace,
        message,
        () => this.onMessageSuccess(message),
        (e) => this.onMessageError(e)
      );
    } else {
      this.requestSession(() => {
        this.session.sendMessage(
          this.params.appNamespace,
          message,
          () => this.onMessageSuccess(message),
          (e) => this.onMessageError(e)
        );
      });
    }
  }

  casting(callback) {
    // If isn't a google chrome browser, obviously don't even try
    if (this.chrome) {
      this.requestSession(callback);
    }
  }

  stopCasting(callback) {
    // If isn't a google chrome browser, obviously don't even try
    if (!this.chrome) { return; }

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

  onMessageError(message) {
    this.log(`onMessageError: ${JSON.stringify(message)}`);

    // Erase the local session in case mismatch with the receiver
    if (
      message.code === 'invalid_parameter' ||
      message.code === 'timeout' ||
      message.code === 'cancel'
    ) {
      this.session = null;
    }

    if (message.code) {
      this.$events.$emit('sessionstatechanged', message.code);
    }
  }

  onMessageSuccess(message) {
    this.log(`onSuccess: ${JSON.stringify(message)}`);

    if (message.callback) {
      message.callback();
    }
  }
}

class Receiver {
  constructor(params) {
    this.log = log;
    this.params = params;

    this.loadScript();
    this.initialize();
  }

  loadScript() {
    // Inject chromecast script
    const castScript = document.createElement('script');

    castScript.src = '//www.gstatic.com/cast/sdk/libs/caf_receiver/v3/' +
      'cast_receiver_framework.js';
    document.getElementsByTagName('head')[0].appendChild(castScript);
  }

  initialize() {
    if (!window.cast || !window.cast.framework) {
      setTimeout(this.initialize.bind(this), 150);
      return;
    }

    const { cast } = window;

    // const options = new cast.framework.CastReceiverOptions();
    //
    // Set inactivity at 60 minutes if option maxInactivity is not passed
    // options.maxInactivity = this.params.maxInactivity || 3600000;

    const context = cast.framework.CastReceiverContext.getInstance();

    context.addCustomMessageListener(this.params.appNamespace, (customEvent) => {
      const dataStringified = JSON.stringify(customEvent.data);

      if (customEvent.data.method) {
        this.$events.$emit('message', dataStringified);
      }

      this.log(`Message [${customEvent.senderId}]: ${dataStringified}`);
    });

    // Set inactivity at 6 hours if option maxInactivity is not passed
    context.setInactivityTimeout(this.params.maxInactivity || 21600000);

    context.start();
  }
}

export { Sender, Receiver };

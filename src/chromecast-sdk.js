const { log } = console;
const { chrome } = window;

class Sender {
  constructor(params) {
    this.log = log;
    this.params = params;

    // If isn't a google chrome browser, obviously don't even try to start
    // ChromeCast Web SDK.
    if (chrome) {
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

    castScript.src = '//www.gstatic.com/cv/js/sender/v1/cast_sender.js' +
      '?loadCastFramework=1';
    document.getElementsByTagName('head')[0].appendChild(castScript);
  }

  initialize() {
    const { cast, chrome } = window;

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

  eventListeners() {
    const { cast } = window;

    this.context.addEventListener(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      (response) => this.stateChangedHandler(response)
    );

    this.context.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      (response) => this.stateChangedHandler(response)
    );
  }

  stateChangedHandler(response) {
    const { cast } = window;

    if (response.sessionState) {
      this.$emit(response.type, response.sessionState);
    }

    if (response.type === 'sessionstatechanged') {
      const castSession = cast.framework.CastContext.getInstance().getCurrentSession();

      this.log(`[SESSION] ${response.sessionState}: ${castSession && castSession.getSessionId() || '...'}`);
    } else {
      this.log(`[DEBUG] ${response.type}: ${JSON.stringify(response)}`);
    }
  }

  requestSession() {
    return this.context.requestSession();
  }

  sendMessage(message) {
    const { cast } = window;
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();

    return castSession.sendMessage(this.params.appNamespace, message)
      .then(() => this.onMessageSuccess(message))
      .catch((e) => this.onMessageError(e));
  }

  casting() {
    // If isn't a google chrome browser, obviously don't even try
    if (chrome) {
      return this.requestSession();
    }

    return {};
  }

  stopCasting(callback) {
    const { cast, chrome } = window;

    // If isn't a google chrome browser, obviously don't even try
    if (!chrome) { return; }

    this.$emit('sessionstatechanged', 'SESSION_ENDING');

    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();

    if (castSession) {
      // End the session and pass 'true' to indicate
      // that receiver application should be stopped.
      castSession.endSession(true);
      if (callback) { callback(); }
    } else if (callback) {
      this.stateChangedHandler({
        sessionState: 'SESSION_ENDED',
        type: 'sessionstatechanged'
      });

      callback();
    }
  }

  onMessageError(message) {
    if (message.code) {
      this.$emit('sessionstatechanged', message.code);
    }

    this.log(`onMessageError: ${JSON.stringify(message)}`);
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
    const { cast } = window;

    if (!cast || !cast.framework) {
      setTimeout(this.initialize.bind(this), 150);
      return;
    }

    const options = new cast.framework.CastReceiverOptions();

    // Set inactivity at 6 hours if option maxInactivity is not passed
    options.maxInactivity = this.params.maxInactivity || 21600000;

    const context = cast.framework.CastReceiverContext.getInstance();

    this.registerListenersCore(context);

    // Set inactivity at 6 hours if option maxInactivity is not passed
    context.setInactivityTimeout(this.params.maxInactivity || 21600000);

    context.start(options);
  }

  registerListenersCore(context) {
    context.addCustomMessageListener(this.params.appNamespace, (customEvent) => {
      const dataStringified = JSON.stringify(customEvent.data);

      if (customEvent.data.method) {
        this.$emit('message', dataStringified);
      }

      this.log(`Message [${customEvent.senderId}]: ${dataStringified}`);
    });
  }
}

export { Sender, Receiver };

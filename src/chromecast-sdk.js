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

    this.context.addEventListener(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      (response) => this.stateChangedHandler(response)
    );

    this.context.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      (response) => this.stateChangedHandler(response)
    );
  }

  requestSession() {
    // return this.context.requestSession().then(() => this.loadBackgroundMedia());
    return this.context.requestSession();
  }

  loadBackgroundMedia() {
    const { cast, chrome } = window;

    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();

    const currentMediaURL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    const mediaInfo = new chrome.cast.media.MediaInfo(currentMediaURL, 'video/mp4');

    mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;
    mediaInfo.duration = null;

    const request = new chrome.cast.media.LoadRequest(mediaInfo);

    castSession.loadMedia(request).then(
      () => { console.log('Load succeed'); },
      (errorCode) => { console.log('Error code: ' + errorCode); }
    );
  }

  stateChangedHandler(response) {
    const { cast } = window;

    if (response.sessionState) {
      this.$events.$emit(response.type, response.sessionState);
    }

    if (response.type === 'sessionstatechanged') {
      const castSession = cast.framework.CastContext.getInstance().getCurrentSession();

      this.log(`[SESSION] ${response.sessionState}: ${castSession && castSession.getSessionId() || '...'}`);
    } else {
      this.log(`[DEBUG] ${response.type}: ${JSON.stringify(response)}`);
    }
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

    this.$events.$emit('sessionstatechanged', 'SESSION_ENDING');

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
      this.$events.$emit('sessionstatechanged', message.code);
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
    this.params = params;

    // this.injectMediaPLayerTag();
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

  injectMediaPLayerTag() {
    const newp = document.createElement('cast-media-player');

    // Hide by default and append it to body
    newp.style.display = 'none';
    document.body.appendChild(newp);
  }

  initialize() {
    if (!window.cast || !window.cast.framework) {
      setTimeout(this.initialize.bind(this), 150);
      return;
    }

    const { cast } = window;

    const context = cast.framework.CastReceiverContext.getInstance();
    const options = new cast.framework.CastReceiverOptions();

    options.maxInactivity = 15000; // Development only
    // options.queue = new this.BackgroundQueue();
    // options.customNamespaces = {
    //   [this.params.appNamespace]: cast.framework.system.MessageType.JSON
    // };

    this.registerListenersCore(context);

    context.start(options);

    // context.sendCustomMessage(this.params.appNamespace, {
    //   type: 'status',
    //   message: 'Playing'
    // });
  }

  registerListenersCore(context) {
    context.addCustomMessageListener(this.params.appNamespace, (customEvent) => {
      const dataStringified = JSON.stringify(customEvent.data);

      if (customEvent.data.method) {
        this.$events.$emit('message', dataStringified);
      }

      this.log(`Message [${customEvent.senderId}]: ${dataStringified}`);
    });
  }
}

export { Sender, Receiver };

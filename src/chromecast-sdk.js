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
    if (!window.cast || !window.cast.framework) {
      setTimeout(() => this.initialize(), 150);
      return;
    }

    const { cast } = window;

    const context = cast.framework.CastContext.getInstance();

    // Set Cast options
    context.setOptions({
      receiverApplicationId: this.params.applicationId,
      // autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      autoJoinPolicy: 'origin_scoped',
      language: 'en'
    });

    this.sessionRequest = context.requestSession();

    this.sessionRequest
      .then((e) => {
        debugger
      })
      .catch((e) => {
        debugger
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

  onInitSuccess(e) {
    this.$events.$emit('onInitSuccess', e);
  }

  onError(message) {
    this.log(`onError: ${JSON.stringify(message)}`);

    // Erase the local session in case mismatch with the receiver
    if (message.code === 'invalid_parameter' || message.code === 'timeout') {
      this.session = null;
    }

    if (message.code) {
      this.$events.$emit('sessionUpdate', message.code);
    }
  }

  onSuccess(message) {
    this.log(`onSuccess: ${JSON.stringify(message)}`);

    if (message.callback) {
      message.callback();
    }
  }

  sessionListener(e) {
    this.log(`New session ID: ${e.sessionId}`);
    this.session = e;
    this.session.addUpdateListener((e) => this.sessionUpdateListener);

    this.$events.$emit('sessionUpdate', 'new');
  }

  sessionUpdateListener(isAlive) {
    const sessionStatus = isAlive ? 'updated' : 'removed';

    this.log(`Session ${sessionStatus}: ${this.session.sessionId}`);

    if (!isAlive) {
      this.session = null;
    }

    this.$events.$emit('sessionUpdate', sessionStatus);
  }

  availabilityListener(e) {
    console.log('availabilityListener', e);
    this.$events.$emit('availabilityListener', e);
  }

  sendMessage(message) {
    if (this.session !== null) {
      this.session.sendMessage(
        this.params.applicationNamespace,
        message,
        () => this.onSuccess(message),
        (e) => this.onError(e)
      );
    } else {
      chrome.cast.requestSession((e) => {
        this.session = e;
        this.sessionListener(e);

        this.session.sendMessage(
          this.params.applicationNamespace,
          message,
          () => this.onSuccess(message),
          (e) => this.onError(e)
        );

      }, (e) => this.onError(e));
    }
  }

  cast(callback) {
    // If isn't a google chrome browser, obviously don't even try
    if (chrome) {
      this.sendMessage({ callback });
      this.$events.$emit('sessionUpdate', 'connecting');
    }
  }

  stopCasting(callback) {
    // If isn't a google chrome browser, obviously don't even try
    if (!chrome) {
      return;
    }

    this.$events.$emit('sessionUpdate', 'disconnecting');

    // Ugly piece shit of code below, but we need to listen any case during
    // disconnection in order to provide a rapid and certain connection
    // from the UI.
    if (this.session) {
      this.session.stop((e) => {
        this.session = null;
        if (callback) {
          callback(e);
        }
        this.$events.$emit('sessionUpdate', 'disconnected');
      }, (e) => this.onError(e));
    } else if (callback) {
      callback();
      this.$events.$emit('sessionUpdate', 'disconnected');
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
    if (!window.cast || !window.cast.framework.CastReceiverContext) {
      setTimeout(this.initialize.bind(this), 150);
      return;
    }

    const { cast } = window;

    const context = cast.framework.CastReceiverContext.getInstance();
    const playerManager = context.getPlayerManager();

    // intercept the LOAD request to be able to read in a contentId and get data
    playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.LOAD, loadRequestData => {
        debugger;
        if (loadRequestData.media && loadRequestData.media.contentId) {
          debugger;
        }
        return loadRequestData;
      });

    // listen to all Core Events
    playerManager.addEventListener(cast.framework.events.category.CORE,
      event => {
        console.log(event);
      });

    debugger

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
}

export { Sender, Receiver };

const { chrome, cast } = window;
const { log } = console;

class Sender {
  constructor(params) {
    this.log = log;
    this.session = null;
    this.params = params;

    this.initialize();
  }

  initialize() {
    if (!chrome.cast || !chrome.cast.isAvailable) {
      setTimeout(() => {
        this.constructor(this.params);
      }, 150);
      return;
    }

    this.sessionRequest = new chrome.cast.SessionRequest(this.params.applicationId);

    this.apiConfig = new chrome.cast.ApiConfig(
      this.sessionRequest,
      () => this.sessionListener,
      () => this.availabilityListener
    );

    chrome.cast.initialize(
      this.apiConfig,
      () => this.onInitSuccess,
      () => this.onError
    );
  }

  onInitSuccess(e) {
    this.$events.$emit('onInitSuccess', e);
  }

  onError(message) {
    this.log(`onError: ${JSON.stringify(message)}`);

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
    this.session.addUpdateListener(() => this.sessionUpdateListener);

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
    this.$events.$emit('availabilityListener', e);
  }

  sendMessage(message) {
    if (this.session !== null) {
      this.session.sendMessage(
        this.params.applicationNamespace,
        message,
        this.onSuccess.bind(this, message),
        this.onError
      );
    } else {
      chrome.cast.requestSession((e) => {
        this.session = e;
        this.sessionListener(e);
        this.session.sendMessage(
          this.params.applicationNamespace,
          message,
          this.onSuccess.bind(this, message),
          this.onError
        );
      }, this.onError);
    }
  }

  cast(callback) {
    this.sendMessage({ callback });
  }

  stopCasting(callback) {
    if (this.session) {
      this.session.stop(callback, this.onError);
    } else if (callback) {
      callback();
    }
  }
}

class Receiver {
  constructor(params) {
    this.log = log;
    this.params = params;
    this.initialize();
  }

  initialize() {
    if (!cast || !cast.receiver) {
      setTimeout(() => {
        this.constructor();
      }, 150);
      return;
    }

    cast.receiver.logger.setLevelValue(0);

    this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

    this.log('Starting Receiver Manager');

    this.castReceiverManager.onReady = (event) => {
      this.log(`Received Ready event: ${JSON.stringify(event.data)}`);
      this.castReceiverManager.setApplicationState(`${this.params.applicationName} is ready...`);
    };

    this.castReceiverManager.onSenderConnected = (event) => {
      this.log(`Received Sender Connected event: ${event.senderId}`);
    };

    this.castReceiverManager.onSenderDisconnected = (event) => {
      this.log(`Received Sender Disconnected event: ${event.senderId}`);
    };

    this.messageBus = this.castReceiverManager.getCastMessageBus(
      this.params.applicationNamespace,
      cast.receiver.CastMessageBus.MessageType.JSON
    );

    this.messageBus.onMessage = (event) => {
      this.log(`Message [${event.senderId}]: ${event.data}`);

      if (event.data.method) {
        this.$events.$emit('message', JSON.stringify(event.data));
      }
    };

    // Initialize the CastReceiverManager with an application status message.
    this.castReceiverManager.start({ statusText: 'Application is starting' });

    this.log('Receiver Manager started');
  }
}

export { Sender, Receiver };

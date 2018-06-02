import Utils from './utils';
import { Sender, Receiver } from './chromecast-sdk';

export default {
  install(Vue, options) {
    const $chromecast = {};
    const { applicationId, applicationName, applicationNamespace } = options;

    const VueEvents = new Utils.Events(Vue);

    Sender.prototype.$events = VueEvents.$events;
    Receiver.prototype.$events = VueEvents.$events;

    if (Utils.checkIfChromecast()) {
      $chromecast.Receiver = new Receiver({
        applicationName,
        applicationNamespace
      });
    } else {
      $chromecast.Sender = new Sender({
        applicationId,
        applicationNamespace
      });
    }

    $chromecast.$on = (eventName, eventHandler) => {
      VueEvents.$events.$on(eventName, eventHandler);
    };

    // Register the vue plugin
    Vue.prototype.$chromecast = $chromecast;
  }
};

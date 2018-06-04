import Utils from './utils';
import { Sender, Receiver } from './chromecast-sdk';

export default {
  install(Vue, options) {
    const $chromecast = {};

    const VueEvents = new Utils.Events(Vue);

    Sender.prototype.$events = VueEvents.$events;
    Receiver.prototype.$events = VueEvents.$events;

    if (Utils.checkIfChromecast()) {
      $chromecast.Receiver = new Receiver(options);
    } else {
      $chromecast.Sender = new Sender(options);
    }

    $chromecast.$on = (eventName, eventHandler) => {
      VueEvents.$events.$on(eventName, eventHandler);
    };

    // Register the vue plugin
    Vue.prototype.$chromecast = $chromecast;
  }
};

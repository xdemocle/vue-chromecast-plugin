import Utils from './utils';
import { Sender, Receiver } from './chromecast-sdk';

export default {
  install(Vue, options) {
    const $chromecast = new Vue();

    if (Utils.checkIfChromecast()) {
      Receiver.prototype.$vueEvents = $chromecast;
      $chromecast.Receiver = new Receiver(options);
    } else {
      Sender.prototype.$vueEvents = $chromecast;
      $chromecast.Sender = new Sender(options);
    }

    // Register the vue plugin
    Vue.prototype.$chromecast = $chromecast;
  }
};

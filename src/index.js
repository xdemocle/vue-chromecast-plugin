import Utils from './utils';
import { Sender, Receiver } from './chromecast-sdk';

export default {
  install(Vue, options) {
    const $chromecast = new Vue();

    if (Utils.checkIfChromecast()) {
      $chromecast.Receiver = new Receiver(options);
      $chromecast.Receiver.$emit = $chromecast.$emit;
    } else {
      $chromecast.Sender = new Sender(options);
      $chromecast.Sender.$emit = $chromecast.$emit;
    }

    // Register the vue plugin
    Vue.prototype.$chromecast = $chromecast;
  }
};

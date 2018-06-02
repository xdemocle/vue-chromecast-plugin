/* eslint no-param-reassign: ["error", { "props": false }] */
import Utils from './utils';
import { Sender, Receiver } from './chromecast-sdk';

export default {
  install(Vue, options) {
    const $chromecast = {};
    const { applicationId, applicationName, applicationNamespace } = options;

    const VueEvents = new Utils.Events(Vue);

    Sender.prototype.$events = VueEvents.$events;
    Receiver.prototype.$events = VueEvents.$events;

    debugger

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

    // $chromecast.$on = (eventName, eventHandler) => {
    //   Events.$events.$on(eventName, eventHandler);
    // };

    // $chromecast.$on = VueEvents.$events.$on;

    // Register the vue plugin
    Vue.prototype.$chromecast = $chromecast;
  }
};

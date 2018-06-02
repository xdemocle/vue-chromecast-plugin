class Events {
  constructor(Vue) {
    this.$events = new Vue({
      methods: {
        /**
         * Emit the given event.
         *
         * @param {string|object} event
         * @param {...*} args
         */
        emit(event, ...args) {
          this.$emit(event, ...args);
        },

        /**
         * Listen for the given event.
         *
         * @param {string} event
         * @param {function} callback
         */
        on(event, callback) {
          this.$on(event, callback);
        },

        /**
         * Remove one or more event listeners.
         *
         * @param {string} event
         * @param {function} callback
         */
        off(event, callback) {
          this.$off(event, callback);
        }
      }
    });
  }
}

function checkIfChromecast() {
  return navigator.userAgent.indexOf('CrKey') !== -1;
}

export default { Events, checkIfChromecast };

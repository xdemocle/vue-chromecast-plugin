function checkIfChromecast() {
  return navigator.userAgent.indexOf('CrKey') !== -1;
}

export default { checkIfChromecast };

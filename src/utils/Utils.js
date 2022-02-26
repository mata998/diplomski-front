const { UAParser } = require("ua-parser-js");

function serverURL() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000";
  } else {
    return "http://138.3.250.151:3000";
  }
}

function getGPU() {
  const gl = document.createElement("canvas").getContext("webgl");

  if (!gl) {
    return "GPU error";
  }

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

  if (debugInfo) {
    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  }

  return {
    error: "GPU error",
  };
}

function getFingerprint() {
  // na http nema:
  //    ram: navigator.deviceMemory
  //    mobile: navigator.userAgentData.mobile

  const parser = new UAParser();
  const results = parser.getResult();
  console.log(results);

  const fingerprint = {
    gpu: getGPU(),
    cores: navigator.hardwareConcurrency,
    platform: navigator.platform,
    screen: `[${window.screen.height}, ${window.screen.width}]`,
    pixelDepth: window.screen.pixelDepth,
    colorDepth: window.screen.colorDepth,
    orientation: window.screen.orientation.type,
    userAgent: navigator.userAgent,
    //
    browser: results.browser.name,
    cpu: results.cpu.architecture,
    device: results.device,
    engine: results.engine.name,
    os: `${results.os.name} ${results.os.version}`,
  };

  return fingerprint;
}

function shortenString(text, length) {
  if (text.length > length) {
    return `${text.substr(0, length)}...`;
  } else {
    return text;
  }
}

module.exports = { serverURL, getFingerprint, shortenString };

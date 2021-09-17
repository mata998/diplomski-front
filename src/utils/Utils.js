function serverURL() {
  if (window.location.hostname == "localhost") {
    return "http://localhost:3000";
  } else {
    return "";
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
  const fingerprint = {
    gpu: getGPU(),
    ram: navigator.deviceMemory,
    cores: navigator.hardwareConcurrency,
    platform: navigator.platform,
    screen: `[${window.screen.height}, ${window.screen.width}]`,
    pixelDepth: window.screen.pixelDepth,
    colorDepth: window.screen.colorDepth,
    orientation: window.screen.orientation.type,
    userAgent: navigator.userAgent,
    mobile: navigator.userAgentData.mobile,
  };

  console.log({ a: JSON.stringify(fingerprint) });
  return fingerprint;
}

module.exports = { serverURL, getFingerprint };

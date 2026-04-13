class MonitorSDK {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.endpoint = "https://your-api-gateway.com/collect";
    this.init();
  }

  init() {
    // 1. Global JavaScript Errors capture karna
    window.onerror = (message, source, lineno, colno, error) => {
      this.sendError({
        type: "JS_ERROR",
        message,
        stack: error?.stack,
        location: { source, lineno, colno }
      });
    };

    // 2. Unhandled Promise Rejections (e.g., API failures)
    window.onunhandledrejection = (event) => {
      this.sendError({
        type: "PROMISE_REJECTION",
        message: event.reason?.message || "Unhandled Rejection",
        stack: event.reason?.stack
      });
    };
  }

  sendError(errorData) {
    const payload = {
      ...errorData,
      apiKey: this.apiKey,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 'sendBeacon' use karna best hai taaki page navigation block na ho
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(this.endpoint, blob);
  }
}

export default MonitorSDK;
class LCPImagePreloader {
  constructor() {
    (this.preloaded = new WeakMap()),
      (this.observer = new PerformanceObserver((e) => this.handleEntries(e)));
  }
  handleEntries(e) {
    for (const r of e.getEntries())
      if (
        "largest-contentful-paint" === r.entryType &&
        "IMG" === r.element?.tagName
      ) {
        this.maybePreloadImage(r.element), this.stop();
        break;
      }
  }
  maybePreloadImage(e) {
    !this.preloaded.has(e) &&
      e.currentSrc &&
      (this.preloadImage(e.currentSrc), this.preloaded.set(e, !0));
  }
  preloadImage(e) {
    const r = document.createElement("link");
    (r.rel = "preload"),
      (r.as = "image"),
      (r.href = e),
      (r.crossOrigin = "anonymous"),
      document.head.appendChild(r);
  }
  start() {
    this.observer.observe({ type: "largest-contentful-paint", buffered: !0 });
  }
  stop() {
    this.observer.disconnect();
  }
}
const lcpImagePreloader = new LCPImagePreloader();
lcpImagePreloader.start();

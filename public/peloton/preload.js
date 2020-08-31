// eslint-disable-next-line
const ipcRenderer = require("electron").ipcRenderer;

const readyCallback = () => {
  const playerNodeStateRelay = (nodes, state) => {
    if (nodes && nodes.length > 0) {
      // element added to DOM
      const hasClass = [].some.call(nodes, function (el) {
        let containsClass = false;
        if (el.classList) {
          containsClass = el.classList.contains("jwplayer");
        }
        return containsClass;
      });
      if (hasClass) {
        ipcRenderer.send("peloton:in-video", state);
      }
    }
  };

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      playerNodeStateRelay(mutation.addedNodes, true);
      playerNodeStateRelay(mutation.removedNodes, false);
    });
  });

  const config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  };

  observer.observe(document.documentElement, config);
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  readyCallback();
} else {
  document.addEventListener("DOMContentLoaded", readyCallback);
}

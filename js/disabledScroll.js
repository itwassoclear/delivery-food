window.disableScroll = () => {
  // const widthScroll = window.innerWidth - document.body.offsetWidth;

  document.body.dbScrollY = window.scrollY;

  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    overflow: hidden;
    height: 100vh;
  `;
  // padding: ${widthScroll}px;
};

window.enableScroll = () => {
  document.body.style.cssText = ``;
  window.scroll({ top: document.body.dbScrollY });
};

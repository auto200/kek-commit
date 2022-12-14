//@ts-check

//@ts-ignore
const KEK_IMG_SRC = chrome.runtime.getURL("assets/kek.png");
const CALENDAR_WRAPPER_SELECTOR = ".js-calendar-graph";
const calenderWrapperEl = document.querySelector(CALENDAR_WRAPPER_SELECTOR);

const commitDaysEls = document.querySelectorAll(
  `${CALENDAR_WRAPPER_SELECTOR} g rect`
);

const isNotNullable = (a) => a !== null && a !== undefined;

// https://stackoverflow.com/a/47768164
const getOffsetAndDims = (element) => {
  const bound = element.getBoundingClientRect();
  const html = document.documentElement;

  return {
    top: bound.top + window.pageYOffset - html.clientTop,
    left: bound.left + window.pageXOffset - html.clientLeft,
    width: bound.width,
    height: bound.height,
  };
};

const kekify = (elementsAndOverlays) => {
  if (!calenderWrapperEl) return;

  elementsAndOverlays.forEach(({ commitDayEl, overlayImgEl }) => {
    const { left: wrapperLeft } = calenderWrapperEl.getBoundingClientRect();
    const { top, left, width, height } = getOffsetAndDims(commitDayEl);

    const isNodeInvisible = left < wrapperLeft;
    if (isNodeInvisible) {
      overlayImgEl.style.display = "none";
      return;
    }

    overlayImgEl.style.display = "block";
    overlayImgEl.style.position = "absolute";
    overlayImgEl.style.width = `${width}px`;
    overlayImgEl.style.height = `${height}px`;
    overlayImgEl.style.top = `${top}px`;
    overlayImgEl.style.left = `${left}px`;
  });
};

const main = () => {
  const elementsAndOverlays = [...commitDaysEls]
    .map((commitDayEl) => {
      const hasCommit = commitDayEl.getAttribute("data-level") !== "0";
      if (hasCommit) return null;

      const overlayImgEl = document.createElement("img");
      overlayImgEl.src = KEK_IMG_SRC;
      overlayImgEl.style.display = "none";
      document.body.appendChild(overlayImgEl);
      return { commitDayEl, overlayImgEl };
    })
    .filter(isNotNullable);

  kekify(elementsAndOverlays);

  window.addEventListener("resize", () => {
    kekify(elementsAndOverlays);
  });
};
//give it a extra time to load assets, it seems that there are differences
//between load point in time of extension between firefox and chrome. In some cases there
//maybe assets that are still loading, causing ui shift after they load.
//Resulting in overlay images being placed in the not proper (at the time) place
setTimeout(main, 1000);

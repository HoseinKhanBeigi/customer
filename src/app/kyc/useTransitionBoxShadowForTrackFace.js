import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

export const useTransitionBoxShadowForTrackFace =
  (removeToggle, boxRef, isActiveRef) => (boxShadow) => {
    let start;
    let box = "";

    const boxShadowRightDown = "104px 104px 43px 52px lime";
    const boxShadowLeftDown = "-104px 104px  43px 52px lime";
    const boxShadowRightUp = "104px -104px  43px 52px lime";
    const boxShadowLeftUp = "-104px -104px 43px 52px lime";
    const boxShadowDown = "0px 104px 43px 52px lime";
    const boxShadowUp = "0px -104px 43px 52px lime";
    const boxShadowRight = "104px 0px 43px 52px lime";
    const boxShadowLeft = "-104px 0px 43px 52px lime";
    const center = "0px 0px 255px 91px lime";
    const toggleClass = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (elapsed >= 500) {
        if (boxShadow === "left") {
          box = boxShadowLeft.current;
        }
        if (boxShadow === "right") {
          box = boxShadowRight.current;
        }
        if (boxShadow === "up") {
          box = boxShadowUp.current;
        }
        if (boxShadow === "down") {
          box = boxShadowDown.current;
        }
        if (boxShadow === "right up") {
          box = boxShadowRightUp.current;
        }
        if (boxShadow === "left up") {
          box = boxShadowLeftUp.current;
        }
        if (boxShadow === "left down") {
          box = boxShadowLeftDown.current;
        }
        if (boxShadow === "right down") {
          box = boxShadowRightDown.current;
        }
        if (boxShadow === "center") {
          box = center;
        }
        isActiveRef.current = !isActiveRef.current;
        if (boxRef.current) {
          console.log(isActiveRef);
          boxRef.current.style.boxShadow = isActiveRef.current
            ? box
            : "0px 0px 29px -28px transparent";
        }
        start = timestamp; // Reset the start time
      }

      // Request the next frame
      removeToggle.current = requestAnimationFrame(toggleClass);
    };

    // Start the animation
    removeToggle.current = requestAnimationFrame(toggleClass);
  };

export const useStopTransitionBoxShadowForTrackFace = (
  removeToggle,
  boxRef
) => {
  return () => {
    if (removeToggle.current) {
      cancelAnimationFrame(removeToggle.current);
      boxRef.current.style.boxShadow = "0px 0px 29px -28px transparent";
    }
  };
};

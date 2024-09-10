import { useRef } from "react";

export const usePlayTransitionColorForActions = (removeToggle, boxRef) => {
  const isActiveRef = useRef();
  return (id) => {
    let start;
    const toggleClass = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      if (elapsed >= 500) {
        isActiveRef.current = !isActiveRef.current;
        if (boxRef.current[id]) {
          boxRef.current[id].className = isActiveRef.current
            ? "chip active"
            : "chip inactive";
        }
        start = timestamp; // Reset the start time
      }

      // Request the next frame
      removeToggle.current = requestAnimationFrame(toggleClass);
    };

    // Start the animation
    removeToggle.current = requestAnimationFrame(toggleClass);
  };
};

export const useStopTransitionColorForActions = (removeToggle, boxRef) => {
  return (id) => {
    if (removeToggle.current) {
      cancelAnimationFrame(removeToggle.current);
      boxRef.current[id].className = "chip active";
    }
  };
};

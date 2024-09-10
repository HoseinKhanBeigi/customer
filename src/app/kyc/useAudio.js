import react, { useEffect } from "react";

export const useAudioPlay = (audioRef) => {
  return () => {
    const audio = new Audio(`/${audioRef}`);
    audio.play();
  };
};

export const useAudioStop = (audioRef) => {
  return () => {
    const audio = new Audio(`/${audioRef}`);
    audio.s();
  };
};

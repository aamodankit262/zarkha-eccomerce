import { useEffect, useRef, useState } from "react";

export const useAudioPlayer = (src?: string, enabled = false) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!enabled || !audioRef.current) return;

    const audio = audioRef.current;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", () =>
      setDuration(audio.duration)
    );

    return () => {
      audio.removeEventListener("timeupdate", onTime);
    };
  }, [enabled]);

  return { audioRef, isPlaying, progress, currentTime, duration, toggle };
};

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useAtom } from 'jotai';
import {
  audioCurrentTime,
  audioDuration,
  audioFile,
  audioPlaying,
} from '@/containers/Apps/SpeechToText/states/jotai';
import { activeTranscriptSentence, audioPlayerInstance, enableTranscriptEdit, transcript } from '@/containers/Apps/SpeechToText/states/transcript';
import { useInterval } from '@/hooks/client/useInterval';
import { useAtomCallback } from 'jotai/utils';

export type PlayerContextType = {
  currentTime: number;
  isPlaying: boolean;
  togglePause: () => void;
  toggleEdit: () => void;
  backward: () => void;
  forward: () => void;
  handleSeek: (value: number) => void;
  enableEdit: boolean;
  setEnableEdit: (value: boolean) => void;
};

export const PlayerContext = createContext<PlayerContextType>({
  currentTime: 0,
  isPlaying: false,
  togglePause: () => {},
  toggleEdit: () => {},
  backward: () => {},
  forward: () => {},
  handleSeek: () => {},
  enableEdit: false,
  setEnableEdit: () => {},
});

export const PlayerProvider = ({ children }: {children: React.ReactNode}): React.ReactNode => {
  const [currentTime, setCurrentTime] = useAtom(audioCurrentTime);
  // const [currentTimeActiveSentenceState, setCurrentTimeActiveSentence] = useAtom(audioCurrentTimeActiveSentence);
  const [duration, _] = useAtom(audioDuration);
  const [enableEdit, setEnableEdit] = useAtom(enableTranscriptEdit);
  const [isPlaying, setIsPlaying] = useAtom(audioPlaying);
  const [currentFile] = useAtom(audioFile);
  const [audioInstance, setAudioPlayerInstance] = useAtom(audioPlayerInstance);
  // const [activeSentence, setActiveTranscriptSentence] = useAtom(activeTranscriptSentence);
  // const [transcriptList] = useAtom(transcript);
  // const soundRef = useRef<Howl | null>(null);

  const { start: startInterval, stop: stopInterval } = useInterval(
    () => setCurrentTime((s) => s + 50),
    50,
  );

  const initializeAudio = useCallback(() => {
    if (currentFile && !audioInstance) {
      setAudioPlayerInstance(
        new Howl({
          src: [currentFile.url],
          autoplay: false,
          html5: true,
          onload: () => {
          },
          onplay: () => {
            setIsPlaying(true);
            startInterval();
          },
          onpause: () => {
            setIsPlaying(false);
            stopInterval();
          },
          onend: () => {
            setIsPlaying(false);
            stopInterval();
            setCurrentTime(0);
          },
          onseek: () => {
          },
        }));
    }
  }, [currentFile, setAudioPlayerInstance, setCurrentTime, setIsPlaying, startInterval, stopInterval]);

  useEffect(() => {
    initializeAudio();
    // document.addEventListener('click', initializeAudio, { once: true });
    // return () => {
    //   document.removeEventListener('click', initializeAudio);
    // };
  }, [initializeAudio]);

  const togglePause = () => {
    if (audioInstance) {
      if (isPlaying) {
        audioInstance.pause();
      } else {
        audioInstance.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleEdit = () => setEnableEdit(!enableEdit);

  const backward = () => {
    const newTime = Math.max(currentTime - 5000, 0);
    setCurrentTime(newTime);
    audioInstance?.seek(newTime / 1000);
  };

  const forward = () => {
    const newTime = Math.min(currentTime + 5000, duration);
    setCurrentTime(newTime);
    audioInstance?.seek(newTime / 1000);
  };

  const handleSeek = useAtomCallback((get, set, value: number) => {
    const audioInstance = get(audioPlayerInstance);
    console.log('handle seek', value);
    if (audioInstance) {
      // console.log('seeked to ', value);
      audioInstance.seek(value / 1000);
      console.log('seeked to ', value);
    }
  });

  // useEffect(() => {
  //   handleSeek(currentTime);
  //   console.log('seek in,', currentTime);
  // }, [audioInstance, currentFile, currentTime]);
  
  useEffect(() => {
    if (currentTime >= duration) {
      stopInterval();
      setIsPlaying(false);
      setCurrentTime(0);
    } else if (isPlaying) {
      // handleSeek(currentTime);
    }
  }, [currentTime, duration, isPlaying, setCurrentTime, stopInterval]);

  return (
    <PlayerContext.Provider value={{
      currentTime,
      isPlaying,
      togglePause,
      toggleEdit,
      backward,
      forward,
      handleSeek,
      enableEdit,
      setEnableEdit,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
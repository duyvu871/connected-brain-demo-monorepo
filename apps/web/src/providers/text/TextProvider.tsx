"use client";

import type { PropsWithChildren, FC} from 'react';
import { useLayoutEffect , useCallback , useEffect, useContext, useState } from 'react';
import { useSearchParams } from "next/navigation";

import type { Socket } from 'socket.io-client';
import { io as SocketIO } from 'socket.io-client';

import {
  DEBOUNCE_TIME,
  languageByValue,
  // DEBOUNCE_TIME,
  MAX_TEXT_TO_TRANSLATE_LENGTH,
  MIN_TEXT_TO_TRANSLATE_LENGTH,
  SearchParams,
} from '@/lib/constants';
import { languageContext, textContext } from '@/providers';
import axios from '@/libs/axios/v1/axios';
import { useDebounce } from '@uidotdev/usehooks';
import { constants } from '@repo/utils';

export const TextProvider: FC<PropsWithChildren> = ({ children }) => {
  const {api_route: APIRoute} = constants;
  const searchParams = useSearchParams();

  const textToTranslate = searchParams.get(SearchParams.TEXT) ?? "";

  const [textToTranslateState, setTextToTranslateState] =
    useState<string>(textToTranslate);
  const textToTranslateDebounce = useDebounce(textToTranslateState, DEBOUNCE_TIME);
  const [completion, setCompletion] = useState<string>("");
  const [io, setIo] = useState<Socket | null>(null);
  const { fromLanguage, toLanguage } = useContext(languageContext);

  const getCompletion = useCallback(async (text: string) => {
    if (!text.trim().length) {
      setCompletion("");
      return;
    }

    try {
      console.log(io);
      if (io?.connected) {
        io.emit('translate-transmit', {
          text,
          from: languageByValue[fromLanguage].query,
          to: languageByValue[toLanguage].query,
        });
        return;
      }

      const response = await axios.v1.translate({
        text,
        from: languageByValue[fromLanguage].query ,
        to: languageByValue[toLanguage].query,
      });
      if (response) {
        setCompletion(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, [fromLanguage, toLanguage]);
  
  const setTextToTranslate = (value: string) => {
    setTextToTranslateState(value);
  };

  const handleSetTextToTranslate = (value: string) => {
    setTextToTranslateState(value);
  };

  const handleChangeTextToTranslate = useCallback((textToTranslate: string) => {
    if (textToTranslate.trim().length > MAX_TEXT_TO_TRANSLATE_LENGTH) return;

    setTextToTranslate(textToTranslate);
    if (textToTranslate.trim().length < MIN_TEXT_TO_TRANSLATE_LENGTH)
      return setCompletion("");
  }, []);

  useEffect(() => {
    if (textToTranslateDebounce.trim().length < MIN_TEXT_TO_TRANSLATE_LENGTH) {
      setCompletion("");
      return;  
    } 
      void (async () => {
        await getCompletion(textToTranslateDebounce);
      })();
  }, [fromLanguage, getCompletion, textToTranslateDebounce, toLanguage]);

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_API_BASE_URL + APIRoute.API.feature.TRANSLATE.socket);
    const socketIO = SocketIO(process.env.NEXT_PUBLIC_API_BASE_URL + APIRoute.API.feature.TRANSLATE.socket, {
      transports: ["websocket"], // use websocket only
      addTrailingSlash: false, // remove trailing slash
      path: '/socket/socket.io',
    });

    socketIO.on('connect', () => {
      console.log('connected');
    });

    socketIO.on('translate-completion', (data: { completion: string }) => {
      setCompletion(data.completion);
    });
    console.log(socketIO);
    setIo(socketIO);
    return () => {
      if (io?.connected) {
        io.close();
      }
    }
  }, [io]);
  
  return (
    <textContext.Provider
      value={{
        completion,
        textToTranslate: textToTranslateState,
        handleChangeTextToTranslate,
        handleSetTextToTranslate,
      }}
    >
      {children}
    </textContext.Provider>
  );
};

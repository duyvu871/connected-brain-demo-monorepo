"use client";

import type { PropsWithChildren, FC} from 'react';
import { useCallback , useEffect, useContext, useState } from 'react';

import { useSearchParams } from "next/navigation";

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

export const TextProvider: FC<PropsWithChildren> = ({ children }) => {
  // const router = useRouter();
  // const pathname = usePathname();
  const searchParams = useSearchParams();

  const textToTranslate = searchParams.get(SearchParams.TEXT) ?? "";

  const [textToTranslateState, setTextToTranslateState] =
    useState<string>(textToTranslate);
  const textToTranslateDebounce = useDebounce(textToTranslateState, DEBOUNCE_TIME);
  const [completion, setCompletion] = useState<string>("");
  const { fromLanguage, toLanguage } = useContext(languageContext);

  const getCompletion = useCallback(async (text: string) => {
    if (!text.trim().length) {
      setCompletion("");
      return;
    }

    try {
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

    // const newSearchParams = new URLSearchParams(searchParams);
    //
    // if (value.trim().length) {
    //   newSearchParams.set(SearchParams.TEXT, value);
    // } else {
    //   newSearchParams.delete(SearchParams.TEXT);
    // }
    //
    // const queryString = newSearchParams.toString();
    // router.replace(`${pathname}?${queryString}`);
  };

  const handleSetTextToTranslate = (value: string) => {
    setTextToTranslateState(value);
  };

  const handleChangeTextToTranslate = useCallback((textToTranslate: string) => {
    if (textToTranslate.trim().length > MAX_TEXT_TO_TRANSLATE_LENGTH) return;

    setTextToTranslate(textToTranslate);
    console.log(textToTranslate);
    if (textToTranslate.trim().length < MIN_TEXT_TO_TRANSLATE_LENGTH)
      return setCompletion("");

    // void getCompletion(textToTranslateState);
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

"use client";

import type { PropsWithChildren, FC} from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  DEFAULT_FROM_QUERY_LANGUAGE,
  DEFAULT_TO_QUERY_LANGUAGE,
  SearchParams,
  languageByQueryLanguage, languageByValue,
} from '@/lib/constants';
import { getFirstNextLanguage } from "@/lib/utils";
import { languageContext } from '@/providers';

interface SetNewSearchParamsArgs {
  fromLanguage?: string;
  toLanguage?: string;
  text?: string;
}

export const LanguageProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fromQueryLanguage =
    searchParams.get(SearchParams.FROM_LANGUAGE) ?? DEFAULT_FROM_QUERY_LANGUAGE;

  const toQueryLanguage =
    searchParams.get(SearchParams.TO_LANGUAGE) ?? DEFAULT_TO_QUERY_LANGUAGE;

  const fromLanguage = languageByQueryLanguage[fromQueryLanguage].value;
  const toLanguage = languageByQueryLanguage[toQueryLanguage].value;

  const setNewSearchParams = ({
    fromLanguage,
    toLanguage,
    text,
  }: SetNewSearchParamsArgs) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (toLanguage) {
      const queryToLanguage = languageByValue[toLanguage].query;
      newSearchParams.set(SearchParams.TO_LANGUAGE, queryToLanguage);
    }

    if (fromLanguage) {
      const queryFromLanguage = languageByValue[fromLanguage].query;

      newSearchParams.set(SearchParams.FROM_LANGUAGE, queryFromLanguage);
    }

    if (text) {
      // newSearchParams.set(SearchParams.TEXT, text);
    }

    const queryString = newSearchParams.toString();
    router.replace(`${pathname}?${queryString}`);
  };

  const handleChangeToLanguage = (toLanguage: string) => {
    setNewSearchParams({
      toLanguage,
      fromLanguage:
        toLanguage === fromLanguage
          ? getFirstNextLanguage(fromLanguage)
          : undefined,
    });
  };

  const handleChangeFromLanguage = (fromLanguage: string) => {
    setNewSearchParams({
      fromLanguage,
      toLanguage:
        fromLanguage === toLanguage
          ? getFirstNextLanguage(toLanguage)
          : undefined,
    });
  };

  const handleSwitchLanguage = () => {
    setNewSearchParams({
      fromLanguage: toLanguage,
      toLanguage: fromLanguage,
    });
  };

  useEffect(() => {
    
  }, []);

  return (
    <languageContext.Provider
      value={{
        fromLanguage,
        toLanguage,
        handleChangeToLanguage,
        handleChangeFromLanguage,
        handleSwitchLanguage,
      }}
    >
      {children}
    </languageContext.Provider>
  );
};

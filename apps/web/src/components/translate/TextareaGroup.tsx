"use client";
import type { ChangeEvent} from 'react';
import { useState , useEffect , useContext } from 'react';

import { textContext } from "@/providers";
import { TranslationBoxTypes } from "@/lib/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { TranslationBox } from "./TranslationBox";

export function TextareaGroup() {
  const { completion, textToTranslate,  handleChangeTextToTranslate} =
    useContext(textContext);
  const [sourceText, setSourceText] = useState<string>("");
  const debounceTranslate = useDebounce(sourceText, 2000);
  const _handleChangeTextToTranslate = ({
    target,
  }: ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(target.value);
  };

  useEffect(() => {
      if (debounceTranslate) {
        setSourceText(debounceTranslate.trim());
        handleChangeTextToTranslate(debounceTranslate.trim());
      }
  }, [debounceTranslate, handleChangeTextToTranslate]);

  return (
    <div className="flex flex-col md:flex-row md:gap-14 gap-5">
      <TranslationBox
        textareaProps={{
          placeholder: "Type your text here.",
          value: textToTranslate,
          onChange: _handleChangeTextToTranslate,
        }}
        type={TranslationBoxTypes.SOURCE}
      />

      <TranslationBox
        textareaProps={{
          readOnly: true,
          value: completion,
          placeholder: "Translated text here.",
        }}
        type={TranslationBoxTypes.TARGET}
      />
    </div>
  );
}

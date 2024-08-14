import type { FC, TextareaHTMLAttributes} from "react";
import React, { useContext } from "react";

import { Cross1Icon, KeyboardIcon } from "@radix-ui/react-icons";
// import { Textarea } from "@ui/shadcn-ui/ui/textarea";
import { Button } from "@ui/shadcn-ui/ui/button";
import {
  MAX_TEXT_TO_TRANSLATE_LENGTH,
  TranslationBoxTypes,
} from "@/lib/constants";
import { textContext } from "@/providers";
import { cn } from '@repo/utils';
import ResizeWithContent from '@ui/textarea/resize-with-content.tsx';
import CopyToClipboard from '@/components/CopyToClipboard.tsx';

export interface TranslationBoxProps {
  type: TranslationBoxTypes;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export const TranslationBox: FC<TranslationBoxProps> = ({
  type,
  textareaProps,
}) => {
  const { handleChangeTextToTranslate } = useContext(textContext);

  const value = textareaProps?.value?.toString().trim() ?? "";

  const handleCleanTextToTranslate = () => {
    handleChangeTextToTranslate("");
  };

  return (
    <div className={cn(
      "flex flex-col gap-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 text-sm shadow-sm text-white p-3 pb-0 pr-1",
      {
        "bg-zinc-800 border-0": TranslationBoxTypes.TARGET === type
      }
    )}>
      <div className="flex gap-1 flex-1 rounded-lg">
        <ResizeWithContent
          autoComplete="off"
          autoresize={value.toString().length > 0}
          className="w-full resize-none min-h-20 md:min-h-32 max-h-72 border-none outline-none focus-visible:ring-0 overflow-auto"
          {...textareaProps} />

        {TranslationBoxTypes.SOURCE === type && value !== "" && (
          <Button
            onClick={handleCleanTextToTranslate}
            size="sm"
            variant="ghost"
          >
            <Cross1Icon />
          </Button>
        )}
      </div>

      <div className="flex justify-between items-center">
        <CopyToClipboard text={value} />

        <div className="flex items-center gap-2 ml-auto">

          <p className="text-xs">
            {value.length} / {MAX_TEXT_TO_TRANSLATE_LENGTH}
          </p>

          <Button disabled size="sm" variant="ghost">
            <KeyboardIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

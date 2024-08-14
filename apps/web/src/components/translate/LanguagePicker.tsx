"use client";
import { useContext } from "react";
// import { WidthIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/shadcn-ui/ui/button";
import ComboboxLanguage from "@ui/shadcn-ui/ui/combobox-language.tsx";
import { languages } from "@/lib/constants";
import { languageContext, textContext } from "@/providers";
import { CgArrowsExchange } from "react-icons/cg";

export function LanguagePicker() {
  const {
    fromLanguage,
    toLanguage,
    handleChangeToLanguage,
    handleChangeFromLanguage,
    handleSwitchLanguage,
  } = useContext(languageContext);

  const { handleSetTextToTranslate } = useContext(textContext);

  const _handleSwitchLanguage = () => {
    handleSwitchLanguage();
  };

  const _handleChangeFromLanguage = (fromLanguage: string) => {
    handleChangeFromLanguage(fromLanguage);
    handleSetTextToTranslate("")
  };

  const _handleChangeToLanguage = (toLanguage: string) => {
    handleChangeToLanguage(toLanguage);
    handleSetTextToTranslate("")
  };

  return (
    <div className="flex items-center">
      <ComboboxLanguage
        onChange={_handleChangeFromLanguage}
        options={languages}
        value={fromLanguage}
      />

      <Button className="hover:opacity-75 transition-all w-14 p-0 m-3" onClick={_handleSwitchLanguage} size="sm" variant="ghost">
        <CgArrowsExchange className="text-white text-4xl"/>
      </Button>

      <ComboboxLanguage
        onChange={_handleChangeToLanguage}
        options={languages}
        value={toLanguage}
      />
    </div>
  );
}

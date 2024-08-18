"use"
import { LanguagePicker } from "@/components/translate/LanguagePicker";
import { TextareaGroup } from "@/components/translate/TextareaGroup";

const Translate = () => {
  return (
    <div className="container px-3 sm:px-10 mb-6 pt-10 max-w-[1000px] flex flex-col gap-5">
      <LanguagePicker />
      <TextareaGroup />
    </div>
  );
};

export default Translate;
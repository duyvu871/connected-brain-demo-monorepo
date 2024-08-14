"use"
import { LanguagePicker } from "@/components/translate/LanguagePicker";
import { TextareaGroup } from "@/components/translate/TextareaGroup";

const Translate = () => {
  return (
    <main className="container px-3 mb-6 max-w-[1000px] flex flex-col gap-5">
      <LanguagePicker />
      <TextareaGroup />
    </main>
  );
};

export default Translate;
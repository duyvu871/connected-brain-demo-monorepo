"use client";

import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import { Button } from "@ui/shadcn-ui/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@ui/shadcn-ui/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/shadcn-ui/ui/popover'
import { CheckIcon } from 'lucide-react'
import { cn } from '@repo/utils'

export const languages = [
    { name: 'Vietnamese', code: 'vi' },
    { name: 'English', code: 'en' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Chinese', code: 'zh' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Spanish', code: 'es' },
    { name: 'Russian', code: 'ru' },
    { name: 'Italian', code: 'it' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Dutch', code: 'nl' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Turkish', code: 'tr' },
    { name: 'Thai', code: 'th' },
    { name: 'Indonesian', code: 'id' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Malay', code: 'ms' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Filipino', code: 'fil' },
    { name: 'Urdu', code: 'ur' },
];

type Language = typeof languages[number];
type LanguageCode = Language['code'];

interface LanguagePickerProps {
    defaultlang?: LanguageCode;
    trigger?: React.ReactNode;
    className?: string;
    select?: (code: LanguageCode) => void;
    customLanguage?: Language[];
}

export function LanguagePicker({ select, trigger, className, customLanguage, defaultlang }: LanguagePickerProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(defaultlang || 'en');

    const languageList = customLanguage || languages;

    return (
        <div className="relative w-full">
            {/* Trigger button or custom trigger */}
            {trigger
                ? (<div className={cn("flex items-center", className)} onClick={() => setIsOpen(true)}>
                    {trigger}
                </div>
                ) : (
                    <Button
                        className="w-full justify-between dark:text-zinc-400 text-zinc-700 bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
                        onClick={() => setIsOpen(true)}
                        role="combobox"
                        variant="outline"
                    >
                        {languageList.find(lang => lang.code === selectedLanguage)?.name || "Select language..."}
                    </Button>)
            }
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <div />
                </PopoverTrigger>
                <PopoverContent className="z-[600] rounded-lg overflow-hidden p-0 border-0">
                    <Command className="bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700">
                        <CommandInput
                            className="h-9 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-400"
                            placeholder="Search language..."
                        />
                        <CommandList className="border-zinc-300 dark:border-zinc-700">
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                                {languageList.map((language, index) => (
                                    <CommandItem
                                        key={`lang-${language.code}`}
                                        className={cn(
                                            "flex items-center p-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800",
                                            selectedLanguage === language.code && "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground",
                                            index !== languages.length - 1 && "mb-0.5"
                                        )}
                                        onSelect={() => {
                                            setSelectedLanguage(language.code);
                                            if (select) {
                                                select(language.code);
                                            }
                                            setIsOpen(false);
                                        }}
                                        value={language.name}
                                    >
                                        {language.name}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedLanguage === language.code ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
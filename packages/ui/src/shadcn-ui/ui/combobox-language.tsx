"use client";

import { useState } from "react";
import type { FC } from "react";
import { CaretSortIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { cn } from "@repo/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { DialogPortal } from "@radix-ui/react-dialog";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
// import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Dialog, DialogOverlay, DialogTrigger } from "./dialog";

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

interface Option {
  value: string;
  label: string;
}
const ComboboxLanguage: FC<Props> = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          aria-expanded={open}
          className="w-full justify-between bg-zinc-400/0 border-zinc-200 dark:border-zinc-700 dark:text-zinc-200 text-zinc-700"
          role="combobox"
          variant="outline"
        >
          {value
            ? options.find((options) => options.value === value)?.label
            : "Select language..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            "p-5 md:w-[460px] md:p-0 bg-opacity-0 border-0"
          )}
        >
          <Command className="bg-white">
            <CommandInput className="h-9" placeholder="Search language..." />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    className="text-zinc-700 cursor-pointer hover:bg-zinc-100 transition-all"
                    key={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    value={option.value}
                  >
                    {option.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogPrimitive.Close className="absolute right-7 top-7 sm:right-2 sm:top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default ComboboxLanguage;
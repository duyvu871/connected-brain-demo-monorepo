import type { GetAvailableModelsResponse } from "@/types/apps/chatbot/api.type";
import { atom } from "jotai";

export const availableModels = atom<GetAvailableModelsResponse['models']>([]);
export const selectedModel = atom<string | null>(null);
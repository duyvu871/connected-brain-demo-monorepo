import { z } from "zod";


export class VoiceIdentificationValidation {
    public static registerBody = z.object({
        userName: z.string({
            message: "User name must be a string",
            required_error: "User name is required",
        }).min(3).max(255),
    });
}
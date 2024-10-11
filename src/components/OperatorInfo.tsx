import { z } from 'zod';

export interface QuotaSettings {
    count: number;
    window: number;
    authValidityWindow: number;
}

export interface OperatorInfo {
    credentialEvents: number[];
    quotaSettings: QuotaSettings;
}

export const QuotaSettingsSchema = z.object({
    count: z.number(),
    window: z.number(),
    authValidityWindow: z.number(),
})

export const OperatorInfoSchema = z.object({
    credentialEvents: z.array(z.number()),
    quotaSettings: QuotaSettingsSchema,
})
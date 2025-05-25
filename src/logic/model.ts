import * as v from 'valibot';

export const ProfileSchema = v.object({
    id: v.string(),
    name: v.string(),
    color: v.string(),
});
export type Profile = v.InferOutput<typeof ProfileSchema>;

export const LogSchema = v.object({
    profile_id: v.string(),
    message: v.string(),
    timestamp: v.optional(v.date()),
});
export type Log = v.InferOutput<typeof LogSchema>;

export const TabSchema = v.object({
    id: v.string(),
    name: v.string(),
});
export type Tab = v.InferOutput<typeof TabSchema>;

export const LogDocSchema = v.object({
    name: v.string(),
    logs: v.array(LogSchema),
    profiles: v.array(ProfileSchema),
    tabs: v.array(TabSchema),
});
export type LogDoc = v.InferOutput<typeof LogDocSchema>;

import * as v from 'valibot';

export const ProfileDisplaySchema = v.union([v.literal('full'), v.literal('message'), v.literal('hidden')]);
export type ProfileDisplay = v.InferOutput<typeof ProfileDisplaySchema>;

export const ProfileSchema = v.object({
    id: v.string(),
    name: v.string(),
    color: v.string(),
    display: ProfileDisplaySchema,
});
export type Profile = v.InferOutput<typeof ProfileSchema>;

export const LogSchema = v.object({
    profile_id: v.string(),
    room_id: v.string(),
    message: v.string(),
    color_override: v.optional(v.string()),
    hidden: v.optional(v.boolean()),
});
export type Log = v.InferOutput<typeof LogSchema>;

export const RoomSchema = v.object({
    id: v.string(),
    name: v.string(),
});
export type Room = v.InferOutput<typeof RoomSchema>;

export const LogDocSchema = v.object({
    name: v.string(),
    logs: v.array(LogSchema),
    profiles: v.array(ProfileSchema),
    room: v.array(RoomSchema),
});
export type LogDoc = v.InferOutput<typeof LogDocSchema>;

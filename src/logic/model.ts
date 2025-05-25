import * as v from 'valibot';

export const ProfileSchema = v.object({
    id: v.string(),
    name: v.string(),
    color: v.string(),
});
export type Profile = v.InferOutput<typeof ProfileSchema>;

export const LogSchema = v.object({
    profile_id: v.string(),
    room_id: v.string(),
    message: v.string(),
    color_override: v.optional(v.string()),
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

import { parse } from "valibot";
import { LogDocSchema, type LogDoc } from "../model";
import type { LogDocParser } from "./base";

export class JsonLogDocParser implements LogDocParser {
    async parse(log: string): Promise<LogDoc> {
        return parse(LogDocSchema, JSON.parse(log));
    }
}
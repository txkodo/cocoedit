import type { LogDoc } from "../model";


export interface LogDocParser {
    parse: (text: string) => Promise<LogDoc>
}

export function validateLogDoc(doc: unknown): LogDoc {
    
}
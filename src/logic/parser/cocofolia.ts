import type { LogDoc, Log, Profile, Room } from "../model";
import type { LogDocParser } from "./base";
import { NodeHtmlParser, type HtmlParser } from "../service/htmlParser";

export class CocofoliaLogDocParser implements LogDocParser {
    #htmlParser: HtmlParser;
    constructor(htmlParser: HtmlParser) {
        this.#htmlParser = htmlParser;
    }

    async parse(html: string): Promise<LogDoc> {
        const doc = await this.#htmlParser.parse(html);

        const logs: Log[] = []
        const profileMap = new Map<string, Profile>();
        const roomMap = new Map<string, Room>();

        // ログエントリを探す (p タグ)
        const logEntries = doc.querySelectorAll('body > p');
        // 各ログエントリを処理
        logEntries.forEach((entry) => {
            // すべてのspanを取得
            const spans = Array.from(entry.querySelectorAll('span'));
            const [roomName, profileName, message] = spans.map(x => x.textContent?.trim() || '');

            // プロフィール ID の生成または取得
            const profileId = (() => {
                const profile = profileMap.get(profileName);
                if (profile) {
                    return profile.id;
                } else {
                    const newId = `profile_${profileMap.size + 1}`;

                    // 色を取得（p タグのスタイルから）
                    const colorStyle = entry.getAttribute('style') || '';
                    const colorMatch = colorStyle.match(/color:\s*([^;]+)/);
                    const color = colorMatch ? colorMatch[1] : '#000000';

                    profileMap.set(profileName, {
                        id: newId,
                        name: profileName,
                        color: color
                    });
                    return newId;
                }
            })();

            // ルーム ID の生成または取得
            const roomId = (() => {
                const trimmedRoomName = roomName.replace(/^\s*(?:\[\s*)?/, '').replace(/(?:\s*])?\s*$/, '');
                const room = roomMap.get(trimmedRoomName);
                if (room) {
                    return room.id;
                } else {
                    const newId = `room_${roomMap.size + 1}`;
                    roomMap.set(trimmedRoomName, {
                        id: newId,
                        name: trimmedRoomName
                    });
                    return newId;
                }
            })();

            // 結果にログを追加
            logs.push({
                profile_id: profileId,
                room_id: roomId,
                message: message
            });
        });

        return {
            name: 'Cocofolia Log',
            logs: logs,
            profiles: Array.from(profileMap.values()),
            room: Array.from(roomMap.values())
        }
    }
}

// In-source testing with Vitest
if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest;

    describe('parseCocofolia', () => {
        const head = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>ccfolia - logs</title>
        </head>
        <body>`;
        const foot = `
        </body>
        </html>
        `;

        type TestCase = {
            explain: string;
            before: string;
            after: LogDoc;
        }
        const testCases: TestCase[] = [
            {
                explain: '基本的なログエントリのパース',
                before: `
                ${head}
                <p style="color:#888888;">
                <span> [部屋A]</span>
                <span>キャラクター名</span> :
                <span>コメント</span>
                </p>
                ${foot}`,
                after: {
                    name: 'Cocofolia Log',
                    logs: [
                        {
                            profile_id: 'profile_1',
                            room_id: 'room_1',
                            message: 'コメント'
                        }
                    ],
                    profiles: [
                        {
                            id: 'profile_1',
                            name: 'キャラクター名',
                            color: '#888888'
                        }
                    ],
                    room: [
                        {
                            id: 'room_1',
                            name: '部屋A'
                        }
                    ]
                }
            }
        ]

        it.each(testCases)('$explain', async ({ before, after }) => {
            const result = await new CocofoliaLogDocParser(new NodeHtmlParser()).parse(before);
            expect(result).toEqual(after);
        })
    });
}

import type { LogDoc, Log, Profile, Room } from "../model";
import type { LogDocParser } from "./base";
import { NodeHtmlParser, type HtmlParser } from "../service/htmlParser";

export class TekeyDocParser implements LogDocParser {
    #htmlParser: HtmlParser;
    constructor(htmlParser: HtmlParser) {
        this.#htmlParser = htmlParser;
    }
    async parse(text: string): Promise<LogDoc> {
        const doc = await this.#htmlParser.parse(text);

        const logs: Log[] = [];
        // 最も登場回数の多かった色をメインカラーとするため、色のカウントを保持
        const multiColorProfileMap = new Map<string, { id: string; name: string; colors: Map<string, number>; }>();
        const roomMap = new Map<string, Room>();

        // ルームのマッピングを取得
        doc.querySelectorAll('.tab-list > .tab-checkbox').forEach((label) => {
            const input = label.querySelector('input');
            if (input && input.id) {
                const roomName = label.textContent?.trim() || `(${input.id})`;
                const roomId = input.id;
                roomMap.set(roomId, {
                    id: roomId,
                    name: roomName
                });
            }
        })

        // 各ログエントリを処理
        doc.querySelectorAll('.chatlog > div').forEach((entry) => {

            // プロフィール名を抽出 (例: "太郎：")
            const boldElement = entry.querySelector('b');
            if (!boldElement) return;
            const profileNameWithColon = boldElement.textContent || '';
            const profileName = profileNameWithColon.replace(/：$/, ''); // コロンを削除
            boldElement.remove(); // b タグを削除

            // 時間タグを削除
            entry.querySelector('span')?.remove();

            const color = (() => {
                const styleAttr = entry.getAttribute('style') || '';
                const colorMatch = styleAttr.match(/color:\s*([^;]+)/);
                return colorMatch ? colorMatch[1] : '#000000';
            })()

            // プロフィール ID の生成または取得
            const profileId = (() => {
                const profile = multiColorProfileMap.get(profileName);

                if (profile) {
                    // 色のカウントを更新
                    profile.colors.set(color, (profile.colors.get(color) || 0) + 1);
                    return profile.id;
                } else {
                    const newId = `profile_${multiColorProfileMap.size + 1}`;
                    multiColorProfileMap.set(profileName, {
                        id: newId,
                        name: profileName,
                        colors: new Map<string, number>().set(color, 1)
                    });
                    return newId;
                }
            })();

            // ルーム ID の生成または取得
            const roomId = (() => {
                const classId = [...entry.classList].find(x => x.startsWith('tab')) ?? "unknown";
                const room = roomMap.get(classId);
                if (room) {
                    return room.id;
                } else {
                    const roomName = `(${classId})`;
                    roomMap.set(classId, {
                        id: classId,
                        name: roomName
                    });
                    return classId;
                }
            })();

            // メッセージを抽出
            const message = entry.textContent?.trim() || '';

            // 結果にログを追加
            logs.push({
                profile_id: profileId,
                room_id: roomId,
                message: message.trim(),
                color_override: color
            });
        });

        // プロフィールのデフォルト色を決定
        const profiles = new Map<string, Profile>();
        multiColorProfileMap.forEach((profile) => {
            // 最も頻繁に使用された色を選択
            const mostFrequentColor = Array.from(profile.colors.entries()).reduce((prev, curr) => {
                return curr[1] > prev[1] ? curr : prev;
            }, ['#000000', 0])[0];
            profiles.set(profile.id, { id: profile.id, name: profile.name, color: mostFrequentColor });
        });

        // デフォルト色のcolor_overrideを削除
        logs.forEach(log => {
            const profile = profiles.get(log.profile_id);
            if (profile && profile.color === log.color_override) {
                delete log.color_override; // デフォルト色の場合は削除
            }
        });

        return {
            name: 'Tekey Log',
            logs: logs,
            profiles: Array.from(profiles.values()),
            room: Array.from(roomMap.values())
        };
    }
}

// In-source testing with Vitest
if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest;

    describe('parseCocofolia', () => {
        const html = (logs: string[], rooms: string[]) => `
<!DOCTYPE html>
<html>

<body>
    <div class="chatlog-wrap">
        <div class="chatlog">${logs.join('\n')}</div>
    </div>
    <div class="controll hidden">
        <div class="controll-buttons">
            <div class="tab-list">
                ${rooms.join('\n')}
            </div>
        </div>
        </details>
    </div>
</body>

</html>
`;

        type TestCase = {
            explain: string;
            before: string;
            after: Partial<LogDoc>;
        }
        const testCases: TestCase[] = [
            {
                explain: '基本的なログエントリのパース',
                before: html(
                    [
                        `<div class="tab1" style="color: #4caf50;"><b>キャラクター名：</b>コメント<span>[10:30]</span></div>`,
                    ],
                    [
                        `<label class="tab-checkbox"><input id="tab1" type="checkbox" checked="true" />メイン</label>`
                    ]
                ),
                after: {
                    name: 'Tekey Log',
                    logs: [
                        { profile_id: 'profile_1', room_id: 'tab1', message: 'コメント' }
                    ],
                    profiles: [
                        { id: 'profile_1', name: 'キャラクター名', color: '#4caf50' }
                    ],
                    room: [
                        { id: 'tab1', name: 'メイン' }
                    ]
                }
            },
            {
                explain: 'もっとの登場回数の多い色をメインカラーとする',
                before: html(
                    [
                        `<div class="tab1" style="color: #111111;"><b>キャラクター名：</b>コメントA<span>[10:30]</span></div>`,
                        `<div class="tab1" style="color: #999999;"><b>キャラクター名：</b>コメントB<span>[10:30]</span></div>`,
                        `<div class="tab1" style="color: #111111;"><b>キャラクター名：</b>コメントC<span>[10:30]</span></div>`,
                    ],
                    [
                        `<label class="tab-checkbox"><input id="tab1" type="checkbox" checked="true" />メイン</label>`
                    ]
                ),
                after: {
                    name: 'Tekey Log',
                    logs: [
                        { profile_id: 'profile_1', room_id: 'tab1', message: 'コメントA' },
                        { profile_id: 'profile_1', room_id: 'tab1', message: 'コメントB', color_override: '#999999' },
                        { profile_id: 'profile_1', room_id: 'tab1', message: 'コメントC' }
                    ],
                    profiles: [
                        { id: 'profile_1', name: 'キャラクター名', color: '#111111' }
                    ]
                }
            }
        ]

        it.each(testCases)('$explain', async ({ before, after }) => {
            const result = await new TekeyDocParser(new NodeHtmlParser()).parse(before);
            expect(result).toEqual(expect.objectContaining(after));
        })
    });
}

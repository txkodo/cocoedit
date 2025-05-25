import type { LogDoc, Log, Profile, Tab } from "../model";
import { JSDOM } from "jsdom";

export function parseCocofolia(html: string): LogDoc {
    // HTML文字列をDOMとしてパース
    let doc: Document;

    // ブラウザ環境とNode環境で分岐
    if (typeof window !== 'undefined' && window.DOMParser) {
        // ブラウザ環境
        const parser = new window.DOMParser();
        doc = parser.parseFromString(html, 'text/html');
    } else {
        // Node環境（テスト用）
        const dom = new JSDOM(html);
        doc = dom.window.document;
    }

    // 結果として返す LogDoc オブジェクトの初期化
    const result: LogDoc = {
        name: 'Cocofolia Log',
        logs: [],
        profiles: [],
        tabs: []
    };

    // デフォルトのタブを追加
    const defaultTab: Tab = {
        id: 'default',
        name: 'メインログ'
    };
    result.tabs.push(defaultTab);

    // ログエントリを探す (p タグ)
    const logEntries = doc.querySelectorAll('body > p');

    // プロフィール ID を追跡するためのマップ
    const profileMap = new Map<string, string>();

    // 各ログエントリを処理
    logEntries.forEach((entry, index) => {
        // すべてのspanを取得
        const spans = Array.from(entry.querySelectorAll('span'));

        // キャラクター名は2番目のspanに含まれることが多い
        let profileName = 'Unknown';
        if (spans.length >= 2) {
            profileName = spans[1].textContent?.trim() || 'Unknown';
        }

        // 色を取得（p タグのスタイルから）
        const colorStyle = entry.getAttribute('style') || '';
        const colorMatch = colorStyle.match(/color:\s*([^;]+)/);
        const color = colorMatch ? colorMatch[1] : '#888888';

        // プロフィール ID の生成または取得
        let profileId = '';
        if (profileMap.has(profileName)) {
            profileId = profileMap.get(profileName)!;
        } else {
            profileId = `profile_${result.profiles.length + 1}`;
            profileMap.set(profileName, profileId);

            // 新しいプロフィールを追加
            const profile: Profile = {
                id: profileId,
                name: profileName,
                color: color
            };
            result.profiles.push(profile);
        }

        // メッセージを取得（最後の span の内容）
        const messageSpans = Array.from(entry.querySelectorAll('span'));
        let message = '';
        if (messageSpans.length >= 3) {
            message = messageSpans[messageSpans.length - 1].innerHTML;
        }

        // ログを作成
        const log: Log = {
            profile_id: profileId,
            message: message
        };

        // 結果にログを追加
        result.logs.push(log);
    });

    return result;
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
                    tabs: [
                        {
                            id: '部屋A',
                            name: 'メインログ'
                        }
                    ]
                }
            }
        ]

        it.each(testCases)('should parse Cocofolia log correctly', ({ before, after }) => {
            const result = parseCocofolia(before);
            expect(result).toEqual(after);
        })
    });
}

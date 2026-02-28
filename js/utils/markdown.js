/**
 * markdown.js — 경량 Markdown → HTML 파서
 * 순수 Vanilla JS, 외부 의존성 없음
 *
 * 지원 문법:
 *   ## 헤딩 (h1 ~ h3)
 *   **굵게**  *기울임*
 *   `인라인 코드`
 *   ```lang\n코드 블록\n```
 *   - / * / + 순서 없는 목록
 *   1. 순서 있는 목록
 *   > 인용문
 *   [링크](url)
 *   ---  구분선
 *   빈 줄로 단락 구분
 *   두 칸 스페이스 + 줄바꿈으로 강제 줄바꿈 (<br>)
 */
const Markdown = {

    /**
     * Markdown 문자열을 HTML 문자열로 변환
     * @param  {string} md
     * @returns {string} HTML
     */
    parse(md) {
        if (!md || typeof md !== 'string') return '';

        // ── 1단계: 코드 블록 추출 (내부를 inline 처리에서 보호) ──────
        const codeBlocks = [];
        let text = md.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
            codeBlocks.push({ lang: lang.trim(), code: this._escape(code.trimEnd()) });
            return `\x00CB${codeBlocks.length - 1}\x00`;
        });

        // ── 2단계: 인라인 코드 추출 ────────────────────────────────
        const inlineCodes = [];
        text = text.replace(/`([^`\n]+)`/g, (_, code) => {
            inlineCodes.push(this._escape(code));
            return `\x00IC${inlineCodes.length - 1}\x00`;
        });

        // ── 3단계: 줄 단위 블록 요소 처리 ───────────────────────────
        const lines  = text.split('\n');
        const output = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // 코드 블록 플레이스홀더
            const cbMatch = line.match(/^\x00CB(\d+)\x00$/);
            if (cbMatch) {
                const { lang, code } = codeBlocks[+cbMatch[1]];
                const cls = lang ? ` class="language-${this._escape(lang)}"` : '';
                output.push(`<pre><code${cls}>${code}</code></pre>`);
                i++; continue;
            }

            // 헤딩 (h1 ~ h3)
            const hMatch = line.match(/^(#{1,3}) (.+)/);
            if (hMatch) {
                const lvl = hMatch[1].length;
                output.push(`<h${lvl}>${this._inline(hMatch[2])}</h${lvl}>`);
                i++; continue;
            }

            // 구분선
            if (/^[-*_]{3,}\s*$/.test(line)) {
                output.push('<hr>');
                i++; continue;
            }

            // 인용문 (연속 줄 수집)
            if (line.startsWith('> ')) {
                const rows = [];
                while (i < lines.length && lines[i].startsWith('> ')) {
                    rows.push(this._inline(lines[i].slice(2)));
                    i++;
                }
                output.push(`<blockquote><p>${rows.join('<br>')}</p></blockquote>`);
                continue;
            }

            // 순서 없는 목록 (연속 줄 수집)
            if (/^[-*+] /.test(line)) {
                const items = [];
                while (i < lines.length && /^[-*+] /.test(lines[i])) {
                    items.push(`<li>${this._inline(lines[i].replace(/^[-*+] /, ''))}</li>`);
                    i++;
                }
                output.push(`<ul>\n${items.join('\n')}\n</ul>`);
                continue;
            }

            // 순서 있는 목록 (연속 줄 수집)
            if (/^\d+\. /.test(line)) {
                const items = [];
                while (i < lines.length && /^\d+\. /.test(lines[i])) {
                    items.push(`<li>${this._inline(lines[i].replace(/^\d+\. /, ''))}</li>`);
                    i++;
                }
                output.push(`<ol>\n${items.join('\n')}\n</ol>`);
                continue;
            }

            // 빈 줄 — 건너뜀
            if (line.trim() === '') {
                i++; continue;
            }

            // 단락 — 다음 빈 줄 / 블록 요소가 나올 때까지 줄 수집
            const paraLines = [];
            while (
                i < lines.length &&
                lines[i].trim() !== '' &&
                !/^#{1,3} /.test(lines[i]) &&
                !lines[i].startsWith('> ') &&
                !/^[-*+] /.test(lines[i]) &&
                !/^\d+\. /.test(lines[i]) &&
                !/^[-*_]{3,}\s*$/.test(lines[i]) &&
                !/^\x00CB\d+\x00$/.test(lines[i])
            ) {
                paraLines.push(lines[i]);
                i++;
            }

            if (paraLines.length) {
                // 두 칸 스페이스 + \n → <br>
                const paraText = paraLines
                    .join('\n')
                    .replace(/  \n/g, '<br>');
                output.push(`<p>${this._inline(paraText)}</p>`);
            }
        }

        // ── 4단계: 인라인 코드 복원 ────────────────────────────────
        let html = output.join('\n');
        html = html.replace(/\x00IC(\d+)\x00/g, (_, n) =>
            `<code>${inlineCodes[+n]}</code>`
        );

        return html;
    },

    // ── 인라인 요소 처리 ──────────────────────────────────────────
    _inline(text) {
        return text
            // **굵게** / __굵게__
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.+?)__/g,     '<strong>$1</strong>')
            // *기울임* / _기울임_  (단어 경계 고려)
            .replace(/\*([^*\n]+?)\*/g, '<em>$1</em>')
            .replace(/_([^_\n]+?)_/g,   '<em>$1</em>')
            // [링크](url)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
                '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            // 두 칸 강제 줄바꿈 (단락 내)
            .replace(/  \n/g, '<br>');
    },

    // ── HTML 특수문자 이스케이프 (코드 블록용) ───────────────────
    _escape(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },
};

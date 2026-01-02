# 📦 Personal Archive

GitHub Pages 기반 개인용 정적 파일 아카이브입니다.
HTML 프로젝트, 이미지, 동영상을 호스팅하고 URL로 쉽게 공유할 수 있습니다.

## 🌟 주요 기능

- ✨ **심플하고 모던한 UI** - Notion 스타일의 미니멀 디자인
- 🔍 **실시간 검색** - 파일 이름과 설명으로 즉시 검색
- 🏷️ **카테고리 필터링** - Web Projects, Images, Videos 탭으로 분류
- 📱 **완전한 반응형** - 모바일, 태블릿, PC 모두 지원
- 🚀 **순수 HTML/CSS/JS** - 빌드 과정 없이 바로 사용 가능

## 📁 폴더 구조

```
balloonf.github.io/
├── index.html          # 메인 대시보드 (파일 목록 진입점)
├── css/
│   └── style.css       # 전체 스타일링
├── js/
│   ├── data.js         # 파일 목록 데이터 (여기에 파일 추가!)
│   └── main.js         # 검색/필터링 로직
├── html/               # HTML 프로젝트 파일 저장
├── img/                # 이미지 파일 저장
├── video/              # 동영상 파일 저장
└── README.md           # 이 파일
```

## 🚀 빠른 시작

### 1. 파일 업로드

원하는 파일을 해당 폴더에 넣으세요:

```bash
# HTML 파일
html/my-project.html

# 이미지 파일
img/screenshot.png

# 동영상 파일
video/demo.mp4
```

### 2. 파일 목록에 추가

`js/data.js` 파일을 열고 `filesData` 배열에 새 항목을 추가하세요:

```javascript
const filesData = [
    {
        name: "내 프로젝트 이름",      // 표시될 제목
        type: "html",                  // 타입: html, img, video
        path: "html/my-project.html",  // 실제 파일 경로
        description: "프로젝트 설명"    // 설명 (선택사항)
    },
    // 다른 파일들...
];
```

### 3. Git에 커밋 & 푸시

```bash
git add .
git commit -m "Add new file: my-project"
git push
```

몇 분 후 GitHub Pages에서 자동으로 배포됩니다!

## 📝 파일 추가 상세 가이드

### HTML 프로젝트 추가

```javascript
{
    name: "포트폴리오 사이트",
    type: "html",
    path: "html/portfolio.html",
    description: "개인 포트폴리오 웹사이트"
}
```

### 이미지 추가

```javascript
{
    name: "제품 사진",
    type: "img",
    path: "img/product-photo.jpg",
    description: "신제품 홍보 이미지"
}
```

### 동영상 추가

```javascript
{
    name: "데모 영상",
    type: "video",
    path: "video/product-demo.mp4",
    description: "제품 시연 동영상"
}
```

## 🎨 디자인 커스터마이징

`css/style.css` 파일 상단의 CSS 변수를 수정하여 색상 테마를 변경할 수 있습니다:

```css
:root {
    /* Primary Colors */
    --color-primary: #2563eb;        /* 메인 색상 */
    --color-primary-dark: #1e40af;   /* 메인 색상 (어두운) */

    /* Background Colors */
    --color-bg: #ffffff;             /* 배경색 */
    --color-bg-secondary: #f8f9fa;   /* 보조 배경색 */

    /* Text Colors */
    --color-text-primary: #1a1a1a;   /* 주 텍스트 색상 */
    --color-text-secondary: #6b7280; /* 보조 텍스트 색상 */
}
```

### 예시: 다크 모드로 변경

```css
:root {
    --color-primary: #60a5fa;
    --color-bg: #1a1a1a;
    --color-bg-secondary: #2d2d2d;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #9ca3af;
    --color-card-bg: #2d2d2d;
    --color-border: #404040;
}
```

## 🔧 고급 설정

### 파일 아이콘 변경

`js/data.js`에서 아이콘을 변경할 수 있습니다:

```javascript
const fileIcons = {
    html: "🌐",  // 원하는 이모지로 변경
    img: "🖼️",
    video: "🎬",
    default: "📄"
};
```

### 타입 라벨 변경

```javascript
const fileTypeLabels = {
    html: "웹 프로젝트",
    img: "이미지",
    video: "영상"
};
```

## 📱 로컬에서 테스트하기

### 방법 1: VS Code Live Server

1. VS Code에서 프로젝트 폴더 열기
2. Live Server 확장 프로그램 설치
3. `index.html` 우클릭 → "Open with Live Server"

### 방법 2: Python 간이 서버

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

브라우저에서 `http://localhost:8000` 접속

## 🌐 GitHub Pages 배포

### 처음 설정할 때

1. GitHub 저장소 Settings로 이동
2. Pages 섹션 선택
3. Source: `Deploy from a branch` 선택
4. Branch: `main` (또는 현재 브랜치) 선택
5. 폴더: `/ (root)` 선택
6. Save 클릭

### 배포 URL

`https://[사용자명].github.io/` 에서 사이트를 확인할 수 있습니다.

## 🛠️ 문제 해결

### Q: 파일을 추가했는데 목록에 안 나타나요

A: `js/data.js`의 `filesData` 배열에 파일 정보를 추가했는지 확인하세요.

### Q: 이미지/동영상이 깨져서 나와요

A: 파일 경로가 정확한지 확인하세요. 경로는 `index.html`을 기준으로 상대경로입니다.

### Q: CSS가 적용이 안 돼요

A: 브라우저 캐시를 지우거나 (`Ctrl + F5`) 시크릿 모드에서 확인해보세요.

### Q: 검색이 안 돼요

A: 브라우저 콘솔(F12)에서 JavaScript 에러가 있는지 확인하세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자유롭게 사용하세요!

## 💡 팁

- 파일명은 영문과 숫자, 하이픈(-)만 사용하는 것을 권장합니다
- 대용량 동영상은 GitHub의 용량 제한(100MB)을 초과하지 않도록 주의하세요
- 정기적으로 Git 커밋을 하여 변경 이력을 관리하세요

---

Made with ❤️ for easy file sharing

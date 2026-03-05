/**
 * Personal Archive - File List Data
 *
 * GitHub Contents API를 사용하여 html/, img/, video/ 디렉토리의
 * 파일 목록을 자동으로 감지합니다.
 * API 실패 시 하단의 정적 fallback 데이터를 사용합니다.
 */

// GitHub 레포 정보
const GITHUB_OWNER = 'balloonf';
const GITHUB_REPO = 'balloonf.github.io';
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

// 스캔할 디렉토리 목록
const SCAN_DIRS = ['html', 'img', 'video'];

// 확장자 → 타입 매핑
const extensionTypeMap = {
    '.html': 'html',
    '.jpg': 'img', '.jpeg': 'img', '.png': 'img', '.gif': 'img',
    '.svg': 'img', '.webp': 'img', '.bmp': 'img',
    '.mp4': 'video', '.webm': 'video', '.mov': 'video',
    '.avi': 'video', '.mkv': 'video'
};

/**
 * 동적으로 채워지는 파일 데이터 배열
 * loadFilesFromGitHub() 호출 후 업데이트됨
 */
let filesData = [];

/**
 * API 실패 시 사용할 정적 fallback 데이터
 */
const fallbackFilesData = [
    {
        name: "Sample Project",
        type: "html",
        path: "../html/sample-project.html",
        description: "샘플 프로젝트"
    }
];

/**
 * 파일명에서 표시용 이름 생성
 * 확장자 제거, 하이픈/언더스코어를 공백으로 변환
 */
function formatFileName(filename) {
    const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
    return nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * 확장자로부터 파일 타입 결정
 */
function getFileType(filename) {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return extensionTypeMap[ext] || null;
}

/**
 * 이미지 파일의 GitHub raw URL 생성
 */
function getRawUrl(filePath) {
    return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${filePath}`;
}

/**
 * 파일 타입별 아이콘 매핑
 */
const fileIcons = {
    html: "🌐",
    img: "🖼️",
    video: "🎬",
    default: "📄"
};

/**
 * 파일 타입별 라벨 매핑
 */
const fileTypeLabels = {
    html: "웹 프로젝트",
    img: "이미지",
    video: "동영상"
};

/**
 * GitHub Contents API에서 파일 목록을 가져와 filesData를 채움
 * @returns {Promise<boolean>} 성공 여부
 */
async function loadFilesFromGitHub() {
    try {
        const responses = await Promise.all(
            SCAN_DIRS.map(dir =>
                fetch(`${GITHUB_API_BASE}/${dir}`)
                    .then(res => {
                        if (!res.ok) throw new Error(`${dir}: ${res.status}`);
                        return res.json();
                    })
                    .then(files => ({ dir, files }))
                    .catch(() => ({ dir, files: [] }))
            )
        );

        const allFiles = [];

        for (const { dir, files } of responses) {
            if (!Array.isArray(files)) continue;

            for (const file of files) {
                if (file.type !== 'file') continue;
                if (file.name === '.gitkeep') continue;

                const fileType = getFileType(file.name);
                if (!fileType) continue;

                const entry = {
                    name: formatFileName(file.name),
                    type: fileType,
                    path: `../${dir}/${file.name}`,
                    description: fileTypeLabels[fileType] || ''
                };

                // 이미지 파일은 썸네일 URL 추가
                if (fileType === 'img') {
                    entry.thumbnail = getRawUrl(`${dir}/${file.name}`);
                }

                allFiles.push(entry);
            }
        }

        if (allFiles.length > 0) {
            filesData = allFiles;
            return true;
        }

        // API는 성공했지만 파일이 없는 경우
        filesData = [];
        return true;
    } catch (error) {
        console.warn('GitHub API 로드 실패, fallback 데이터 사용:', error);
        filesData = fallbackFilesData;
        return false;
    }
}

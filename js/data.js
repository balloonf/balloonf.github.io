/**
 * Personal Archive - File List Data
 *
 * 📝 파일 추가 방법:
 * 1. 아래 filesData 배열에 새로운 객체를 추가하세요.
 * 2. 각 파일은 다음 속성을 가집니다:
 *    - name: 파일 이름 (표시될 제목)
 *    - type: 파일 타입 ('html', 'img', 'video')
 *    - path: 실제 파일 경로
 *    - description: 파일 설명 (선택사항)
 *
 * 💡 예시:
 * {
 *     name: "프로젝트 이름",
 *     type: "html",
 *     path: "html/my-project.html",
 *     description: "프로젝트 설명"
 * }
 */

/**
 * ⚠️  경로 기준: archive/index.html 위치 기준 상대경로
 *     HTML 파일  →  ../html/파일명.html
 *     이미지     →  ../img/파일명.jpg
 *     동영상     →  ../video/파일명.mp4
 */
const filesData = [
    // ========================================
    // Web Projects (HTML Files)
    // ========================================
    {
        name: "Sample Project",
        type: "html",
        path: "../html/sample-project.html",
        description: "샘플 프로젝트 - 실제 프로젝트로 교체하여 사용하세요"
    }

    // 아래와 같은 형식으로 파일을 추가하세요:
    // {
    //     name: "Portfolio Website",
    //     type: "html",
    //     path: "../html/portfolio.html",
    //     description: "개인 포트폴리오 웹사이트"
    // },

    // ========================================
    // Images
    // ========================================
    // {
    //     name: "Header Image",
    //     type: "img",
    //     path: "../img/header-bg.jpg",
    //     description: "웹사이트 헤더 배경 이미지"
    // },

    // ========================================
    // Videos
    // ========================================
    // {
    //     name: "Product Demo Video",
    //     type: "video",
    //     path: "../video/product-demo.mp4",
    //     description: "제품 시연 영상"
    // }
];

/**
 * 파일 타입별 아이콘 매핑
 * 원하는 이모지로 변경 가능합니다
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

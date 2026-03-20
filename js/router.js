/**
 * router.js — 해시 기반 클라이언트 사이드 라우터
 *
 * 사용법:
 *   Router.register('/', handler)
 *   Router.register('/post/:id', ({ params, query }) => ...)
 *   Router.navigate('/blog')
 *   Router.init()
 */
const Router = {
    /** @type {Record<string, Function>} */
    routes: {},

    /**
     * 라우트 등록
     * @param {string}   path     — '/post/:id' 형식
     * @param {Function} handler  — ({ params, query }) 콜백
     */
    register(path, handler) {
        this.routes[path] = handler;
    },

    /**
     * 프로그래매틱 이동
     * @param {string} path — '#' 없이 '/', '/blog' 등
     */
    navigate(path) {
        window.location.hash = path;
    },

    /**
     * 현재 해시를 파싱해서 매칭 라우트의 핸들러 실행
     */
    resolve() {
        const raw   = decodeURIComponent(window.location.hash.slice(1) || '/');
        const [pathPart, queryPart] = raw.split('?');
        const query  = new URLSearchParams(queryPart || '');
        const segments = pathPart.split('/');

        let handler = null;
        let params  = {};

        for (const route of Object.keys(this.routes)) {
            const routeSegments = route.split('/');

            if (routeSegments.length !== segments.length) continue;

            let matched = true;
            const tempParams = {};

            for (let i = 0; i < routeSegments.length; i++) {
                if (routeSegments[i].startsWith(':')) {
                    // 동적 세그먼트 (:id 등)
                    tempParams[routeSegments[i].slice(1)] = segments[i];
                } else if (routeSegments[i] !== segments[i]) {
                    matched = false;
                    break;
                }
            }

            if (matched) {
                handler = this.routes[route];
                params  = tempParams;
                break;
            }
        }

        if (handler) {
            handler({ params, query });
        } else {
            // 404 → 홈으로
            this.navigate('/');
        }
    },

    /** 라우터 시작 */
    init() {
        window.addEventListener('hashchange', () => this.resolve());
        this.resolve();
    },
};

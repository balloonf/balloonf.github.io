---
title: Vanilla JS로 SPA 만들기
summary: 빌드 도구 없이 순수 자바스크립트로 해시 라우터 기반 SPA를 구현하는 전 과정을 정리합니다.
tags: [javascript, web]
date: 2026-02-28
readTime: 5
---

## 들어가며

React, Vue 같은 프레임워크 없이도 SPA를 만들 수 있습니다.
핵심은 `hashchange` 이벤트와 동적 렌더링입니다.

## 해시 라우터 구조

`window.location.hash`를 파싱해 현재 경로를 확인하고,
등록된 핸들러를 실행하는 간단한 라우터를 만들 수 있습니다.

```javascript
const Router = {
    routes: {},

    register(path, handler) {
        this.routes[path] = handler;
    },

    resolve() {
        const path = window.location.hash.slice(1) || '/';
        const handler = this.routes[path];
        if (handler) handler();
    },

    init() {
        window.addEventListener('hashchange', () => this.resolve());
        this.resolve();
    }
};
```

## 컴포넌트 패턴

각 페이지는 `render(selector)` 메서드를 가진 객체로 정의합니다.
상태가 단순한 사이트에 적합합니다.

```javascript
const HomePage = {
    render(selector) {
        const root = document.querySelector(selector);
        root.textContent = '안녕하세요!';
    }
};
```

## 장단점

**장점**

- 외부 의존성이 전혀 없어 번들 크기가 0입니다
- GitHub Pages 같은 정적 호스팅에 바로 배포 가능합니다
- 빌드 단계가 없으므로 배포가 단순합니다

**단점**

- 복잡한 상태 관리는 직접 구현해야 합니다
- 앱이 커질수록 유지보수가 어려워질 수 있습니다

## 마치며

소규모 프로젝트라면 프레임워크 없이도 충분합니다.
도구에 의존하기 전에, 브라우저 API가 얼마나 강력한지 직접 경험해보세요.

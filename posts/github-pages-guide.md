---
title: GitHub Pages 완전 정복
summary: 정적 사이트를 GitHub Pages로 무료 배포하는 방법부터 커스텀 도메인 설정까지 한 번에 정리합니다.
tags: [web, tips]
date: 2026-02-15
readTime: 3
---

## GitHub Pages란?

GitHub 저장소를 그대로 정적 웹사이트로 서빙해주는 **무료 호스팅 서비스**입니다.
`username.github.io` 형태의 도메인을 자동으로 제공합니다.

## 배포 설정 방법

1. GitHub 저장소 **Settings** 탭으로 이동
2. 좌측 메뉴에서 **Pages** 선택
3. Source: `Deploy from a branch` 선택
4. Branch: `main`, 폴더: `/ (root)` 선택
5. **Save** 클릭

몇 분 후 `https://username.github.io`에서 사이트를 확인할 수 있습니다.

## 커스텀 도메인 연결

```
# 저장소 루트에 CNAME 파일 생성
echo "yourdomain.com" > CNAME
```

DNS 설정에서 `A` 레코드를 GitHub IP로 등록하면 됩니다.

## 주의 사항

- 파일 크기 제한: **100MB / 파일**, **1GB / 저장소**
- 대용량 동영상은 외부 CDN(YouTube, Vimeo 등)을 활용하세요
- 서버 사이드 처리 불가 — 순수 정적 파일만 호스팅됩니다

> 무료이고 설정도 간단해서 개인 블로그나 포트폴리오를 시작하기에 최적입니다.

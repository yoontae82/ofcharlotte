# 쇼핑몰 설정 가이드

## 1단계 — 구글 시트 연동 (5분)

1. **구글 시트** 새로 만들기 → 이름 아무거나 (예: "내쇼핑몰DB")
2. 상단 메뉴 **확장 프로그램 → Apps Script** 클릭
3. 기존 코드 전체 삭제 후 `google-apps-script.gs` 파일 내용 붙여넣기
4. 💾 저장 (Ctrl+S)
5. **배포 → 새 배포** 클릭
   - 유형: **웹 앱**
   - 실행 계정: **나**
   - 액세스: **모든 사용자**
6. **배포** 클릭 → 권한 허용
7. 웹 앱 URL 복사 (https://script.google.com/... 로 시작)

## 2단계 — URL 설정

`js/config.js` 파일 열어서 아래 부분 수정:

```js
const API_URL = '여기에_복사한_URL_붙여넣기';
const SHOP_NAME = '내 쇼핑몰 이름';
const ADMIN_PASSWORD = '원하는비밀번호';
```

## 3단계 — 무료 호스팅 올리기

### GitHub Pages (무료, 추천)
1. GitHub 계정 만들기 (github.com)
2. 새 Repository 만들기 (예: `my-shop`)
3. shop 폴더 안의 파일 전체 업로드
4. Settings → Pages → Branch: main → Save
5. 주소: `https://아이디.github.io/my-shop`

---

## 사용 방법

### 상품 등록
- `admin.html` 접속 → 비밀번호 입력
- **상품 등록** 탭에서 상품명, 가격, 이미지URL, 마감일시 입력
- 필요한 옵션(색상/사이즈/호수 등) 체크
- **상품 등록하기** 버튼

### 고객에게 공유
- `index.html` 주소를 카카오톡, 문자 등으로 공유
- 각 상품 페이지 링크 직접 공유도 가능

### 주문 확인
- `admin.html` → **주문 확인** 탭
- 상품별 필터 가능
- **엑셀(CSV) 다운로드** 버튼으로 저장

---

## 이미지 올리는 방법

이미지 URL이 필요합니다. 아래 중 하나 사용:
- **카카오톡 오픈채팅** 이미지 공유 후 URL 복사
- **Google Photos** → 공유 → 링크 복사
- **Imgur** (imgur.com) 무료 이미지 호스팅 업로드

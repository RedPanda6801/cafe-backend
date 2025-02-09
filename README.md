# My Stamp-backend

소규모 카페를 위한 쿠폰 관리 솔루션, "마이 스탬프"의 백엔드 입니다.<br/>
[프론트엔드 깃허브](https://github.com/RedPanda6801/cafe_front)



# 전체 구조
```

├── config                          
│   └── corsConfig.json             # cors 설정 파일
├── controllers                     # 로직 폴더
│   ├── answer.js
│   ├── auth.js
│   ├── cafe.js
│   ├── customer.js
│   ├── find.js
│   ├── mail.js
│   ├── main.js
│   ├── profile.js
│   ├── question.js
│   └── stamp.js
├── lib                             # 자체 제작한 라이브러리 모음 폴더
│   ├── error.js                    # error 처리용 유틸
│   └── util.js                     # 인증, 만료기한 모듈 모음
├── log                             # 로그 폴더
│   └── ...
├── models                          # DB를 모델링하는 sequelize의 모델 함수용 폴더
│   ├── cafe.js                     
│   ├── index.js                    # sequelize를 이용한 DB설정 파일
│   ├── owner.js
│   ├── question.js                    
│   ├── question.js
│   └── stamp.js
├── node_modules                    # npm install후 생성되는 라이브러리 모음 폴더
│   └── ...
├── routes                          # Router 폴더
│   ├── answer.js
│   ├── auth.js
│   ├── cafe.js
│   ├── customer.js
│   ├── find.js
│   ├── mail.js
│   ├── main.js
│   ├── profile.js
│   ├── question.js
│   └── stamp.js
├── .env                            # (개발용)환경설정 파일(직접 생성)
├── .gitignore                      # git not-push 설정 파일
├── app.js                          # 앱 실행 메인 파일
├── package-lock.json
├── package.json
├── README.md
└── socket.js                       # socket.io 실행 파일
```

# ERD
![image](https://user-images.githubusercontent.com/110373172/196595614-cfeb1786-1769-4891-b045-956497c5d952.png)

# 순서도
![image](https://user-images.githubusercontent.com/110373172/196579182-d46075cb-edb5-4e1b-bd98-3bfb669a9c38.png)

# 설정
## 개발환경
개발용 PC의 OS는 `windows 10`을 사용 한다.
개발용 디렉토리는 다음과 같다.
`c:\Workspace`
```console
> cd C:\Workspace
```
위 디렉토리로 이동 한다.


## node.js 설치
version: v14.15.4
(nvm을 이용하여 버전관리 할 것. (윈도우용 nvm: [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) ))

```console
> nvm install 14.15.4 64
> nvm use 14.15.4 64
> nvm list
  * 14.15.4 (Currently using 64-bit executable)
    12.20.0
```

## npm 패키지 설치
위에 생성된 프로젝트 폴더로 이동 한 후 npm을 이용해서 nodejs패키지들을 설치 한다.

```console
> cd BACKEND
> npm install

!낮은 버전 이슈로 강제로 버전 다운이 필요할 때 해당 코드 이후에 run 필요!
$env:NODE_OPTIONS="--openssl-legacy-provider"  // windows
```

## env 파일 설정
.env 파일을 미리 설정해야 한다. .env 파일 추가 후 아래의 형식에 맞춰 추가한다.

++) naver의 경우 smtp 설정을, google의 경우 앱비밀번호 설정을 해주어야 한다.
```
COOKIE_SECRET=mystamp-cookie
EMAIL=실제 사용하는 이메일
PASSWORD=실제 사용하는 비밀번호
JWT_SECRET=jwtjwt
```

### nodemon을 통한 node서비스 실행
이제 앞으로 개발할때에는 다음과 같이 `nodemon`을 통해 실행 시키도록 한다.
```console
> npm run start
```



# 마음 연구소 코딩 테스트

## 사용 기술

- typescript
- nest.js
- graphql
- typeorm
- postgresql
- jwt
- bcrypt

## 서버 실행 방법

1. 해당 프로젝트를 clone 받은 뒤, `.env.sample` 파일을 참고 하여 `.env` 파일을 생성 후 필요한 정보를 기입한다.

2. 정보를 기입한 뒤, 아래 명령어를 터미널에 작성해 DB를 생성 해준다.

### DB 생성

```bash
#postgresql DB생성
$ createdb dbname
```

.env에 작성한 DB_DATABASE 와 dbname은 동일해야 한다.

### DB 마이그레이션

```bash
# dbmigration
$ npm run typeorm -- migration:run -d ./src/dataSource.ts
```

3. 서버 실행

```bash
#project start
$ npm run start
```

## DB오류

DB 마이그레이션 혹은 서버 구동 중 DB에러가 발생할 경우, postgresql의 해당 DB / Table 권한 문제에 의한 경우가 많다. 해당 문제의 경우 https://postgresql.kr/docs/11/sql-createrole.html 참고

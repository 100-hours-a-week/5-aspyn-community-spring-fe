# Node.js 기반 이미지 사용
FROM node:latest

# 컨테이너 내부에서 사용할 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 컨테이너로 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 애플리케이션 파일 복사
COPY . .

# 환경 변수 받아오기
ARG SERVER_NAME
ENV SERVER_NAME=$SERVER_NAME

# 애플리케이션 실행
CMD ["node", "app.js"]

# 컨테이너가 열어야 하는 포트
EXPOSE 3000
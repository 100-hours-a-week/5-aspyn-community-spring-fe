# nginx 기반 이미지 사용
FROM nginx:latest

# 환경변수 설정
ENV API_URL=${API_URL}

#custom nginx.conf 적용
COPY nginx.conf.template /etc/nginx/nginx.conf

# 정적 파일 복사
COPY public /usr/share/nginx/html

# 컨테이너가 열 포트
EXPOSE 80 443

CMD envsubst '$$API_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'
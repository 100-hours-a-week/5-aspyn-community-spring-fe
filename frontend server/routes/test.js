// express 모듈을 불러옵니다.
import express, { json } from "express";
import fs from "fs";
import { getuid } from "process";

// express 애플리케이션을 생성합니다.
const app = express();
// 웹 서버가 사용할 포트 번호를 정의합니다.
//const port = 4000;

app.use(express.static("/Users/sy/Desktop/kakao/community/routes"));
app.use(express.json());

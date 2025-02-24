// express 모듈을 불러옵니다.
require("dotenv").config(); // 환경변수 fhem
const express = require("express");
const process = require("process");
const cors = require("cors");
const path = require("path");

// express 애플리케이션을 생성합니다.
const app = express();
// 웹 서버가 사용할 포트 번호를 정의합니다.
const port = 3000;

const corsOrigin = process.env.API_URL;
let corsOptions = {
  origin: corsOrigin,
  optionsSuccessStatus: 200,
  credentials: true,
};

// 정적 파일 제공 경로 설정
app.use("/public", express.static(path.join(__dirname, "./public")));

app.use(express.json());
app.use(cors(corsOptions));

// 라우트 정의
const authRoute = require("./routes/auth-route.js");
const boardRoute = require("./routes/board-route.js");

app.use("/", authRoute);
app.use("/", boardRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// 프론트엔드에서 환경변수를 가져갈 수 있도록 API 제공
app.get("/config", (req, res) => {
  res.json({ API_URL: process.env.API_URL });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

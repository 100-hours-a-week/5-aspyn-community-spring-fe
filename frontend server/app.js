// express 모듈을 불러옵니다.
const express = require("express");
const process = require("process");
const cors = require("cors");
const path = require("path");

// express 애플리케이션을 생성합니다.
const app = express();
// 웹 서버가 사용할 포트 번호를 정의합니다.
const port = 3000;

let corsOptions = {
  origin: "http://localhost:8080/",
  optionsSuccessStatus: 200,
  credentials: true,
};

// 정적 파일 제공 경로 설정
app.use("/public", express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(cors(corsOptions));

// 라우트 정의
const authRoute = require("./routes/auth-route.js");
const boardRoute = require("./routes/board-route.js");

app.use("/", authRoute);
app.use("/", boardRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const path = require("path");

// 회원가입 페이지 열기
exports.join = (req, res) => {
  const filePath = path.join(__dirname, "../../public/community-join.html");
  res.sendFile(filePath);
};

// 비밀번호 변경 페이지 열기
exports.password = (req, res) => {
  const filePath = path.join(__dirname, "../../public/community-password.html");
  res.sendFile(filePath);
};

// 닉네임 변경 페이지 열기
exports.nickname = (req, res) => {
  const filePath = path.join(__dirname, "../../public/community-user.html");
  res.sendFile(filePath);
};

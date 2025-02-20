const path = require("path");

// 회원가입 페이지 열기
exports.join = (req, res) => {
  const filePath = path.join(__dirname, "../public/community-join.html");
  res.sendFile(filePath);
};

// 회원정보 변경 페이지 열기 (닉네임, 비밀번호)
exports.nickname = (req, res) => {
  const filePath = path.join(__dirname, "../public/community-user.html");
  res.sendFile(filePath);
};

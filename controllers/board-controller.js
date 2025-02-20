const path = require("path");

// 게시글 목록 페이지 열기
exports.getList = (req, res) => {
  const filePath = path.join(__dirname, "../public/community-conlist.html");
  res.sendFile(filePath);
};

// 게시글 상세 페이지 열기
exports.getDetail = (req, res) => {
  const filePath = path.join(__dirname, "../public/community-detail.html");
  res.sendFile(filePath);
};

// 게시글 수정 페이지 열기
exports.getModify = (req, res) => {
  const filePath = path.join(__dirname, "../public/community-modify.html");
  res.sendFile(filePath);
};

// 게시글 신규 작성 페이지 열기
exports.getNew = (req, res) => {
  const filePath = path.join(__dirname, "../public/community-edit.html");
  res.sendFile(filePath);
};

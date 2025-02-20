const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth-controller");

// 회원가입 페이지
router.get("/user/join", AuthController.join);

// 회원정보 변경 페이지 (닉네임, 비밀번호)
router.get("/user/info", AuthController.nickname);

module.exports = router;

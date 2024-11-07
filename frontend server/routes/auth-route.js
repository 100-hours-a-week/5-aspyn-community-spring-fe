const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth-controller");

// 회원가입 페이지
router.get("/user/join", AuthController.join);

// 비밀번호 변경 페이지
router.get("/user/infp/:userId", AuthController.password);

// 닉네인 변경 페이지
router.get("/user/inf/:userId", AuthController.nickname);

module.exports = router;

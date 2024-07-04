let id = document.getElementsByClassName("input-box")[0];
let pw = document.getElementsByClassName("input-box")[1];
let loginbtn = document.getElementsByClassName("login-button")[0];

const loginEmail = (str) =>
  /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(str);

const strongPassword = (str) =>
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/.test(str);

// 세션 유저 아이디 클리어
sessionStorage.clear();

//아이디 유효성 검사
id.onkeyup = () => {
  //값을 입력한 경우
  if (id.value.length > 0) {
    //이메일 형식이 아닌 경우
    if (loginEmail(id.value) === false) {
      document.querySelector(".helpertxt").innerText =
        "* 올바른 이메일 주소 형식을 입력하세요. (예: example@example.com)";
      document.querySelector(".helpertxt").style.opacity = 1;
    } else {
      document.querySelector(".helpertxt").style.opacity = 0;
      //아이디, 비번 모두 유효성 검사 통과하면 버튼 색상 변경
      if (loginEmail(id.value) == true && strongPassword(pw.value) == true) {
        loginbtn.style.backgroundColor = "#7F6AEE";
      }
    }
  }
};

//비밀번호 유효성 검사
pw.onkeyup = () => {
  if (pw.value.length > 0) {
    if (strongPassword(pw.value) === false) {
      document.querySelector(".helpertxt").innerText =
        "* 8~20자 영문, 숫자, 특수문자를 사용하세요.";
      document.querySelector(".helpertxt").style.opacity = 1;
    } else {
      document.querySelector(".helpertxt").style.opacity = 0;
      //아이디, 비번 모두 유효성 검사 통과하면 버튼 색상 변경
      if (loginEmail(id.value) == true && strongPassword(pw.value) == true) {
        loginbtn.style.backgroundColor = "#7F6AEE";
        loginbtn.classList.add("cursor");
      }
    }
  } else {
    document.querySelector(".helpertxt").innerText = "* 비밀번호를 입력하세요.";
    document.querySelector(".helpertxt").style.opacity = 1;
  }
};

//로그인 버튼 클릭
loginbtn.onclick = () => {
  const loginInf = {
    email: id.value,
    password: pw.value,
  };

  fetch("http://localhost:8080/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginInf),
    credentials: "include", // 세션과 쿠키를 포함하여 요청을 보냄
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "ERROR") {
        alert(data.message);
        return false;
      } else {
        alert(data.message);
        window.location.href = "/post/list";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    });
};

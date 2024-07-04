const id = document.getElementsByClassName("input-box")[0];
const pw = document.getElementsByClassName("input-box")[1];
const pwch = document.getElementsByClassName("input-box")[2];
const nickname = document.getElementsByClassName("input-box")[3];

const imgtxt = document.querySelectorAll(".helpertxt")[0];
const idtxt = document.querySelectorAll(".helpertxt")[1];
const pwtxt = document.querySelectorAll(".helpertxt")[2];
const pwchtxt = document.querySelectorAll(".helpertxt")[3];
const nicknametxt = document.querySelectorAll(".helpertxt")[4];

const joinBtn = document.getElementsByClassName("login-button")[0];

const loginEmail = (str) => {
  // 이메일 유효성 검사 정규식
  return /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(str);
};

//비밀번호 유효성 검사 정규식(8-20자,영문/숫자/특수문자 무조건 포함)
const strongPassword = (str) => {
  return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/.test(str);
};

//닉네임 유효성 검사 정규식
const korEngNum = (str) => /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;

//아이디 유효성 검사
id.onkeyup = () => {
  //값을 입력한 경우
  if (id.value.length > 0) {
    //이메일 형식이 아닌 경우
    if (loginEmail(id.value) == false) {
      idtxt.innerText =
        "* 올바른 이메일 주소 형식을 입력하세요. (예: example@example.com)";
      idtxt.style.opacity = 1;
    } else {
      idtxt.style.opacity = 0;
    }
  } else {
    idtxt.innerText = "* 이메일을 입력해주세요.";
    idtxt.style.opacity = 1;
  }
};

//비밀번호 유효성 검사
pw.onkeyup = () => {
  if (pw.value.length > 0) {
    if (strongPassword(pw.value) == false) {
      pwtxt.innerText = "* 8~20자 영문, 숫자, 특수문자를 사용하세요.";
      pwtxt.style.opacity = 1;
    } else {
      pwtxt.style.opacity = 0;
    }
  } else {
    pwtxt.innerText = "* 비밀번호를 입력하세요.";
    pwtxt.style.opacity = 1;
  }
};

//비밀번호 확인 유효성 검사
pwch.onkeyup = () => {
  if (pw.value == pwch.value) {
    pwchtxt.innerText = "* 비밀번호가 확인되었습니다.";
    pwchtxt.style.opacity = 1;
  } else {
    pwchtxt.innerText = "* 비밀번호가 다릅니다.";
    pwchtxt.style.opacity = 1;
  }
};

//닉네임 유효성 검사
nickname.onkeyup = () => {
  if (nickname.value.length < 11) {
    if (nickname.value.includes(" ") == true) {
      nicknametxt.innerText = "* 띄어쓰기를 제거해주세요.";
      nicknametxt.style.opacity = 1;
    } else if (nickname.value.includes(" ") == false) {
      nicknametxt.style.opacity = 0;
    } else if (korEngNum(nickname.value) === true) {
      nicknametxt.style.opacity = 0;
      console.log("닉네임 통과"); //여기 제대로 동작 안 함. 확인 필요.
    }
  } else {
    nicknametxt.innerText = "* 닉네임은 최대 10자까지 가능합니다.";
    nicknametxt.style.opacity = 1;
  }
};

//마우스 오버 시 버튼 색상 변경 (모든 유효성 검사를 통과한 경우)
joinBtn.onmouseover = () => {
  if (
    loginEmail(id.value) == true &&
    strongPassword(pw.value) == true &&
    pw.value == pwch.value
    //&& korEngNum(nickname.value) == true
  ) {
    joinBtn.style.backgroundColor = "#7F6AEE";
    console.log("완료");
  } else {
    joinBtn.style.backgroundColor = "#ACA0EB";
    console.log("실패");
  }
};

// 회원가입 버튼 클릭
joinBtn.onclick = () => {
  // const btnColor = joinBtn.style.backgroundColor
  let userInf = {
    email: id.value,
    password: pw.value,
    nickname: nickname.value,
  };

  if (
    loginEmail(id.value) == true &&
    strongPassword(pw.value) == true &&
    pw.value == pwch.value
    //&& korEngNum(nickname.value) == true
  ) {
    fetch("http://localhost:8080/user/isExist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInf),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("사용 가능한 이메일");
          fetch("http://localhost:8080/user/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInf),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status == "SUCCESS") {
                console.log("회원가입 완료");
                alert("회원가입이 완료되었습니다. 로그인을 해주세요.");
                window.location.href = "/";
              } else {
                throw new Error("회원가입 시 오류가 발생했습니다.");
              }
            });
        } else {
          console.log("중복 이메일");
          alert("중복된 이메일입니다. 다른 이메일을 입력하세요.");
        }
      });
  } else {
    alert("회원가입 실패. 입력 정보를 확인하세요.");
  }
};


const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const nicknameInput = document.getElementById("nickname");

const emailHelper = document.getElementById("email-helper");
const passwordHelper = document.getElementById("password-helper");
const confirmPasswordHelper = document.getElementById("confirm-password-helper");
const nicknameHelper = document.getElementById("nickname-helper");

const submitBtn = document.getElementById("submit-btn");

// 이메일 유효성 검사
const loginEmail = (str) =>
  /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(str);

// 비밀번호 유효성 검사
const strongPassword = (str) =>
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/.test(str);

//닉네임 유효성 검사 정규식
const korEngNum = (str) => /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;

// 세션 유저 아이디 클리어
sessionStorage.clear();

// 아이디 입력 유효성 검사
emailInput.addEventListener("keyup",() => {
  if(loginEmail(emailInput.value)) {
    emailHelper.style.opacity = 0;
  } else {
    emailHelper.textContent = "* 올바른 이메일 주소 형식을 입력하세요.";
    emailHelper.style.opacity = 1;
  }
});

// 비밀번호 입력 유효성 검사
passwordInput.addEventListener("keyup", () => {
  if (strongPassword(passwordInput.value)) {
    passwordHelper.style.opacity = 0;
  } else if (passwordInput.value.length === 0) {
    passwordHelper.style.opacity = 0;
  } else {
    passwordHelper.textContent = "* 8~20자 영문, 숫자, 특수문자를 사용하세요.";
    passwordHelper.style.opacity = 1;
  }
});

// 비밀번호 확인 입력 유효성 검사
confirmPasswordInput.addEventListener("keyup", () => {
  if (confirmPasswordInput.value === passwordInput.value) {
      confirmPasswordHelper.textContent = "* 비밀번호가 일치합니다.";
      confirmPasswordHelper.style.opacity = 1;
  } else {
      confirmPasswordHelper.textContent = "* 비밀번호가 일치하지 않습니다.";
      confirmPasswordHelper.style.opacity = 1;
  }
});

//닉네임 입력 유효성 검사
nicknameInput.addEventListener("keyup", () => {
  if (nicknameInput.value.length < 11) {
    if (nicknameInput.value.length == 0) {
      nicknameHelper.style.opacity = 0;
    } else if (nicknameInput.value.includes(" ") == true) {
      nicknameHelper.textContent = "* 띄어쓰기를 제거해주세요.";
      nicknameHelper.style.opacity = 1;
    } else if (korEngNum(nicknameInput.value)) {
      nicknameHelper.style.opacity = 0;
    }
 } else {
    nicknameHelper.textContent = "* 닉네임은 최대 10자까지 가능합니다.";
    nicknameHelper.style.opacity = 1;
  }
});


function resetClass(element, classname){
  element.classList.remove(classname);
}

// 로그인 탭 클릭
document.getElementsByClassName("show-signin")[0].addEventListener("click", function() {
  let form = document.getElementsByClassName("login-box")[0];
  resetClass(form, "signup");
  form.classList.add("signin");
  document.getElementById("submit-btn").innerText = "로그인";
});

// 회원가입 탭 클릭
document.getElementsByClassName("show-signup")[0].addEventListener("click", function() {
  let form = document.getElementsByClassName("login-box")[0];
  resetClass(form, "signin");
  form.classList.add("signup");
  document.getElementById("submit-btn").innerText = "회원가입";
});

// 하단 회원가입하기 텍스트링크 클릭
document.getElementsByClassName("signup")[0].addEventListener("click", function() {
  let form = document.getElementsByClassName("login-box")[0];
  resetClass(form, "signin");
  form.classList.add("signup");
  document.getElementById("submit-btn").innerText = "회원가입";
});

// 로그인 or 회원가입 버튼 클릭
document.getElementById("submit-btn").addEventListener("click", function(event) {
  event.preventDefault(); // 기본 폼 제출 방지
  const form = document.querySelector('.login-box');

  if (form.classList.contains('signin')) {
    handleSignIn();
  } else if (form.classList.contains('signup')) {
    handleSignUp();
  } 
});


// 회원가입 동작
function handleSignUp() {
  // const email = document.querySelector('.email input').value;
  // const password = document.querySelector('.password input').value;
  // const confirmPassword = document.querySelector('.confirm-password input').value;
  // const nickname = document.querySelector('.nickname input').value;

  if (passwordInput !== confirmPasswordInput) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  // alert(`Sign Up Successful!\nUsername: ${email}`);
  // 서버에 회원가입 요청 전송 (예: fetch API 사용)

  // let userInfo = {
  //   email: id.value,
  //   password: pw.value,
  //   nickname: nickname.value,
  // };

  let userInfo = {
    email: emailInput.value,
    password: passwordInput.value,
    nickname: nicknameInput.value,
  };

  if (
    loginEmail(emailInput) == true &&
    strongPassword(passwordInput) == true &&
    passwordInput == confirmPasswordInput &&
    korEngNum(nicknameInput) == true
  ) {
    fetch("http://localhost:8080/api/user/isExist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("사용 가능한 이메일");
          fetch("http://localhost:8080/api/user/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInfo),
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
}

// 로그인 동작
function handleSignIn() {
  // const email = document.querySelector('.username input').value;
  // const password = document.querySelector('.password input').value;

  if (emailInput === "" || passwordInput === "") {
    alert("아이디와 비밀번호를 입력하세요.");
    return;
  }

  // 서버에 로그인 요청 전송 (예: fetch API 사용)
  // const loginInfo = {
  //   email: id.value,
  //   password: pw.value,
  // };
  const loginInfo = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  fetch("http://localhost:8080/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginInfo),
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
}

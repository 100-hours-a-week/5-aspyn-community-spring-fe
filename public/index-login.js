const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const nicknameInput = document.getElementById("nickname");

const emailHelper = document.getElementById("email-helper");
const passwordHelper = document.getElementById("password-helper");
const confirmPasswordHelper = document.getElementById(
  "confirm-password-helper"
);
const nicknameHelper = document.getElementById("nickname-helper");

const preview = document.getElementById("profile-preview");
const profileBtn = document.querySelector(".profile-button");
const submitBtn = document.getElementById("submit-btn");

// 이메일 유효성 검사
const loginEmail = (str) =>
  /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(str);

// 비밀번호 유효성 검사
const strongPassword = (str) =>
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/.test(str);

//닉네임 유효성 검사 정규식
const korEngNum = (str) => /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;

// 아이디 입력 유효성 검사
emailInput.addEventListener("keyup", () => {
  if (loginEmail(emailInput.value)) {
    emailHelper.style.opacity = 0;
  } else {
    emailHelper.textContent = "* 올바른 이메일 주소 형식을 입력하세요.";
    emailHelper.style.opacity = 1;
  }
});

// 비밀번호 입력 유효성 검사
passwordInput.addEventListener("keyup", () => {
  if (passwordInput.value.length == 0) {
    passwordHelper.style.opacity = 0;
  } else if (strongPassword(passwordInput.value)) {
    passwordHelper.style.opacity = 0;
  } else {
    passwordHelper.textContent = "* 8~20자 영문, 숫자, 특수문자를 사용하세요.";
    passwordHelper.style.opacity = 1;
  }
});

// 비밀번호 확인 입력 유효성 검사
confirmPasswordInput.addEventListener("keyup", () => {
  if (confirmPasswordInput.value.length == 0) {
    confirmPasswordHelper.style.opacity = 0;
  }
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

function resetClass(element, classname) {
  element.classList.remove(classname);
}

// 로그인 탭 클릭
document
  .getElementsByClassName("show-signin")[0]
  .addEventListener("click", function () {
    let form = document.getElementsByClassName("login-box")[0];
    resetClass(form, "signup");
    form.classList.add("signin");
    document.getElementById("submit-btn").innerText = "로그인";
  });

// 회원가입 탭 클릭
document
  .getElementsByClassName("show-signup")[0]
  .addEventListener("click", function () {
    let form = document.getElementsByClassName("login-box")[0];
    resetClass(form, "signin");
    form.classList.add("signup");
    document.getElementById("submit-btn").innerText = "회원가입";
  });

// 하단 회원가입하기 텍스트링크 클릭
document
  .getElementsByClassName("signup")[0]
  .addEventListener("click", function () {
    let form = document.getElementsByClassName("login-box")[0];
    resetClass(form, "signin");
    form.classList.add("signup");
    document.getElementById("submit-btn").innerText = "회원가입";
  });

// 로그인 or 회원가입 버튼 클릭
document
  .getElementById("submit-btn")
  .addEventListener("click", function (event) {
    event.preventDefault(); // 기본 폼 제출 방지
    const form = document.querySelector(".login-box");

    if (form.classList.contains("signin")) {
      handleSignIn();
    } else if (form.classList.contains("signup")) {
      handleSignUp();
    }
  });

// 회원가입 동작
function handleSignUp() {
  if (passwordInput.value !== confirmPasswordInput.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  } else if (emailInput.value == "") {
    alert("이메일을 입력하세요.");
    return;
  } else if (passwordInput.value == "") {
    alert("비밀번호를 입력하세요.");
    return;
  } else if (nicknameInput.value == "") {
    alert("닉네임을 입력하세요.");
    return;
  }

  // 유효성 검사 통과 시 서버에 회원가입 요청 전송
  if (
    loginEmail(emailInput.value) &&
    strongPassword(passwordInput.value) &&
    passwordInput.value == confirmPasswordInput.value &&
    korEngNum(nicknameInput.value) &&
    nicknameInput.value.includes(" ") == false &&
    nicknameInput.value.length > 0
  ) {
    // formData 객체 생성
    const formData = new FormData();

    // 회원 정보
    const userInfo = {
      email: emailInput.value,
      password: passwordInput.value,
      nickname: nicknameInput.value,
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(userInfo)], { type: "application/json" })
    );

    // 프로필 이미지 추가 (파일이 선택된 경우에만)
    const fileInput = document.getElementById("imageInput");
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }

    // 서버로 api 요청
    fetch("http://localhost:8080/api/user/join", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "SUCCESS") {
          console.log("회원가입 완료");
          alert("회원가입이 완료되었습니다. 로그인을 해주세요.");
          window.location.href = "/";
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  } else {
    alert("회원가입 실패. 입력 정보를 확인하세요.");
  }
}

// 로그인 동작
function handleSignIn() {
  if (emailInput.value === "" || passwordInput.value === "") {
    alert("아이디와 비밀번호를 입력하세요.");
    return;
  }

  const formData = new FormData();
  formData.append("email", emailInput.value);
  formData.append("password", passwordInput.value);

  fetch("http://localhost:8080/login", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        // 로그인 실패 처리
        alert("로그인 실패");
        return false;
      }
      // JWT 토큰 수신
      return response.headers.get("Authorization");
    })
    .then((token) => {
      if (token) {
        // Bearer 토큰 저장
        localStorage.setItem("jwt", token);

        alert("로그인 성공");
        window.location.href = "/post/list";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    });
}

// 프로필 이미지 [파일선택] 버튼 클릭
profileBtn.addEventListener("click", function () {
  imageInput.click();
});

// 파일 선택 시 미리보기 업데이트
imageInput.addEventListener("change", previewImage);

function previewImage(event) {
  const input = event.target;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}
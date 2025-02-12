document.addEventListener("DOMContentLoaded", async function () {
  // 로그인 유저 확인
  async function fetchUserInfo() {
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/userinfo`,
        "GET"
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status == "ERROR") {
          alert(data.message);
          window.location.href = "/"; // 로그인 페이지로 리다이렉트
          return null;
        } else {
          return data; // user_id : 'n'
        }
      } else {
        throw new Error("로그인 해주세요.");
      }
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  }

  // 뒤로가기 버튼
  const back = document.getElementsByClassName("header-box")[0];
  back.onclick = () => (window.location.href = `/post/list`);

  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  if (!user) return;
  const loginUser = user.user_id;
  const userEmail = user.email;
  let userNick = user.nickname;

  // 로그인 유저 프로필
  const loginProfile = document.getElementById("login-profile");
  const profileImg = document
    .getElementsByClassName("profile-image")[0]
    .querySelector("img"); // 기존 프로필 이미지

  if (user.profile_url) {
    loginProfile.src = user.profile_url;
    profileImg.src = user.profile_url;
  }

  const profileBox = document.getElementsByClassName("header-box")[1];
  const options = document.querySelector(".opt-pos");

  // 옵션 박스 보이기
  function showOptions() {
    options.classList.remove("hide"); // 옵션 박스 보이기
  }

  // 옵션 박스 숨기기
  function hideOptions() {
    options.classList.add("hide"); // 옵션 박스 숨기기
  }

  // 프로필 이미지에 마우스를 올리면 옵션 박스 보이기
  profileBox.addEventListener("mouseover", showOptions);

  // 옵션 박스에 마우스를 올리면 계속 보이기
  options.addEventListener("mouseover", showOptions);

  // 프로필 이미지와 옵션 박스에서 마우스를 벗어나면 옵션 박스 숨기기
  profileBox.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!options.matches(":hover")) {
        hideOptions();
      }
    }, 100); // 짧은 지연 시간 추가
  });

  options.addEventListener("mouseleave", hideOptions);

  const userInfo = document.getElementsByClassName("opt-box")[0]; // 회원정보수정
  const logout = document.getElementsByClassName("opt-box")[1]; // 로그아웃

  userInfo.onclick = () => {
    window.location.href = `/user/info`;
  };

  // 로그아웃
  logout.onclick = () => {
    localStorage.removeItem("jwt");
    console.log("로그아웃");
    window.location.href = `/`;
  };

  function resetClass(element, classname) {
    element.classList.remove(classname);
  }

  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const nicknameInput = document.getElementById("nickname");
  const fileInput = document.getElementById("imageInput");

  const nicknameHelper = document.getElementById("nickname-helper");
  const passwordHelper = document.getElementById("password-helper");
  const confirmPasswordHelper = document.getElementById(
    "confirm-password-helper"
  );

  const preview = document.getElementById("profile-preview");
  const profileBtn = document.querySelector(".profile-button");
  const submitBtn = document.getElementById("submit-btn");

  // 회원정보수정 탭 클릭
  document
    .getElementsByClassName("show-userinfo")[0]
    .addEventListener("click", function () {
      let form = document.getElementsByClassName("login-box")[0];
      resetClass(form, "pw");
      form.classList.add("userinfo");
      submitBtn.innerText = "회원정보 변경";
    });

  // 비밀번호수정 탭 클릭
  document
    .getElementsByClassName("show-pw")[0]
    .addEventListener("click", function () {
      let form = document.getElementsByClassName("login-box")[0];
      resetClass(form, "userinfo");
      form.classList.add("pw");
      submitBtn.innerText = "비밀번호 변경";
    });

  // 로그인 유저의 아이디, 닉네임 보여주기
  document.getElementById("user-email").innerText = userEmail;
  nickname.setAttribute("value", userNick);

  //닉네임 유효성 검사 정규식
  const korEngNum = (str) => /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;

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

  // 비밀번호 유효성 검사
  const strongPassword = (str) =>
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/.test(str);

  // 비밀번호 입력 유효성 검사
  passwordInput.addEventListener("keyup", () => {
    if (passwordInput.value.length == 0) {
      passwordHelper.style.opacity = 0;
    } else if (strongPassword(passwordInput.value)) {
      passwordHelper.style.opacity = 0;
    } else {
      passwordHelper.textContent =
        "* 8~20자 영문, 숫자, 특수문자를 사용하세요.";
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

  // 변경 버튼 클릭
  submitBtn.addEventListener("click", function (event) {
    event.preventDefault(); // 기본 폼 제출 방지
    const form = document.querySelector(".login-box");

    if (form.classList.contains("userinfo")) {
      changeUserinfo();
    } else if (form.classList.contains("pw")) {
      changePassword();
    }
  });

  // 회원정보 변경 (프로필 및 닉네임)
  function changeUserinfo() {
    if (nicknameInput.value == "") {
      alert("닉네임을 입력하세요.");
      return;
    } else if (nicknameInput.value == userNick && !fileInput.files.length) {
      // console.log("변경된 정보 없음");
      return;
    } else {
      // formData 객체 생성
      const formData = new FormData();

      // 회원 정보
      const userInfo = {
        nickname: nicknameInput.value,
      };

      formData.append(
        "request",
        new Blob([JSON.stringify(userInfo)], { type: "application/json" })
      );

      // 프로필 이미지 추가 (파일이 선택된 경우에만)
      if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
      }

      // 닉네임 중복확인
      if (
        nicknameInput.value != userNick &&
        korEngNum(nicknameInput.value) &&
        nickname.value.includes(" ") == false
      ) {
        fetchWithAuth(
          `http://localhost:8080/api/user/isExist/${nickname.value}`,
          "GET"
        )
          .then((response) => response.json())
          .then((data) => {
            // true이면 중복, false이면 중복된 닉네임 없음
            if (data) {
              alert("중복된 닉네임입니다. 다른 닉네임을 입력해주세요.");
              return;
            }
          });
      }

      // 닉네임 및 프로필 이미지 변경
      fetchWithImg(
        "http://localhost:8080/api/user/info",
        "PATCH",
        formData
      ).then((response) => {
        if (!response.errorCode) {
          toastOn();
          alert("회원정보가 변경되었습니다.");
          // console.log("회원정보 변경 완료");
          location.reload();
        } else {
          throw new Error("닉네임 변경 시 오류가 발생했습니다.");
        }
      });
    }
  }

  // 비밀번호 변경
  function changePassword() {
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    } else if (passwordInput.value == "") {
      alert("비밀번호를 입력하세요.");
      return;
    }

    // 유효성 검사 통과 시 비밀번호 변경 요청 전송
    if (
      strongPassword(passwordInput.value) &&
      passwordInput.value == confirmPasswordInput.value
    ) {
      // formData 객체 생성
      const newPassword = new FormData();
      // 회원 정보
      const userInfo = {
        id: loginUser,
        password: passwordInput.value,
      };

      newPassword.append(
        "request",
        new Blob([JSON.stringify(userInfo)], { type: "application/json" })
      );

      fetchWithImg(
        "http://localhost:8080/api/user/password",
        "PATCH",
        newPassword
      ).then((response) => {
        if (response) {
          toastOn();
          // console.log("비밀번호 변경");
        } else {
          throw new Error("비밀번호 변경 중 오류가 발생했습니다.");
        }
      });
    } else {
      alert("비밀번호를 확인하세요.");
    }
  }

  // 회원탈퇴 모달 버튼 (취소-확인)
  const modal = document.getElementsByClassName("modalBackground")[0];
  const modalCancel = document.getElementsByClassName("modal-btn-cancel")[0];
  const modalComplete =
    document.getElementsByClassName("modal-btn-complete")[0];
  const leave = document.getElementsByClassName("leave")[0];

  // 탈퇴하기 클릭
  leave.addEventListener("click", () => {
    modal.classList.add("show");
  });

  // 탈퇴하기 모달 - 취소 클릭
  modalCancel.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  modal.addEventListener("click", (event) => {
    // 배경(overlay)만 클릭된 경우에만 모달 닫기
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  });

  // 탈퇴하기 모달 - 탈퇴 클릭
  modalComplete.addEventListener("click", () => {
    fetchWithAuth("http://localhost:8080/api/user/leave", "DELETE")
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "SUCCESS") {
          alert("회원 탈퇴가 완료되었습니다.");
          // console.log("회원탈퇴 완료");
          window.location.href = "/";
        } else {
          alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
          // console.log("회원탈퇴 오류");
          throw new Error("회원 탈퇴 처리 중 오류가 발생했습니다.");
        }
      });
  });

  // 파일 선택 시 미리보기 업데이트
  fileInput.addEventListener("change", previewImage);

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

  const toast = document.getElementById("toast");

  const toastOn = () => {
    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 1500);
  };
});

// JWT 포함한 fetch 함수
async function fetchWithAuth(url, method, body = null) {
  const token = localStorage.getItem("jwt"); // JWT를 localStorage에서 가져옴
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${token}`, // Authorization 헤더에 JWT 추가
  };

  const options = {
    method: method,
    headers: headers,
  };

  if (body) {
    options.body = JSON.stringify(body); // 요청에 body가 필요한 경우 추가
  }

  return fetch(url, options);
}

// 이미지를 포함하는 fetch 함수
async function fetchWithImg(url, method, body = null) {
  const token = localStorage.getItem("jwt"); // JWT를 localStorage에서 가져옴
  const headers = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  headers["Authorization"] = `${token}`; // Authorization 헤더에 JWT 추가

  const options = {
    method: method,
    headers: headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  };

  return fetch(url, options);
}

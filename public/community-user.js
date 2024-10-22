// 로그인 유저 확인
async function fetchUserInfo() {
  try {
    const response = await fetch(`http://localhost:8080/api/userinfo`, {
      method: "GET",
      credentials: "include", // 세션과 쿠키를 포함하여 요청을 보냄
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status == "ERROR") {
        alert(data.message);
        window.location.href = "/"; // 로그인 페이지로 리다이렉트
        return null;
      } else {
        // console.log("USER Info: ", data);
        return data; // user_num : 'n'
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
let back = document.getElementsByClassName("profile-box")[0];
back.onclick = () => (window.location.href = `/post/list`);

//프로필 박스 클릭 시 옵션 리스트 노출
profile = document.getElementsByClassName("profile-box")[1];
option = document.getElementsByClassName("opt-pos")[0];

profile.onmouseover = () => profile.classList.add("cursor");
profile.onclick = () => option.classList.toggle("hide");

// 옵션박스 회원정보수정,비밀번호수정 클릭
document.getElementsByClassName("opt-box")[0].onclick = () => {
  window.location.href = `/user/inf`;
};
document.getElementsByClassName("opt-box")[1].onclick = () => {
  window.location.href = `/user/infp`;
};
// 로그아웃
document.getElementsByClassName("opt-box")[2].onclick = () => {
  fetch(`http://localhost:8080/api/user/logout`, {
    method: "POST",
    credentials: "include", // 세션과 쿠키를 포함하여 요청을 보냄
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("로그아웃 실패");
      }
    })
    .catch((error) => {
      console.error("로그아웃 중 오류 발생: ", error);
    });
};

nickname = document.getElementsByClassName("input-box")[0];
nicknametxt = document.getElementsByClassName("helpertxt")[1];
button = document.getElementsByClassName("login-button")[0];

// 로그인 유저의 아이디, 닉네임 보여주기
window.addEventListener("load", async () => {
  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  id = user.user_num;

  fetch(`http://localhost:8080/api/user/loginUser/${id}`)
    .then((response) => response.json())
    .then((data) => {
      let userEmail = data.email;
      let userNick = data.nickname;
      document.querySelector(".usermail").innerText = userEmail;
      nickname.setAttribute("value", userNick);
    })
    .catch((error) => console.error("불러오기 실패", error));
});

//닉네임 유효성 검사 정규식
korEngNum = (str) => /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;

//닉네임 유효성 검사
nickname.onkeyup = () => {
  if (nickname.value.length == 0) {
    nicknametxt.innerText = "* 닉네임을 입력하세요.";
    nicknametxt.style.opacity = 1;
  } else if (nickname.value.length < 11) {
    if (nickname.value.includes(" ") == false) {
      nicknametxt.style.opacity = 0;
      console.log("닉네임 유효성 검사 완료");
      button.classList.add("cursor");
    } else {
      nicknametxt.innerText = "* 띄어쓰기를 제거해주세요.";
      nicknametxt.style.opacity = 1;
    }
  } else {
    nicknametxt.innerText = "* 닉네임은 최대 10자까지 가능합니다.";
    nicknametxt.style.opacity = 1;
    alert("닉네임은 최대 10자까지 가능합니다.");
  }
};

const toast = document.getElementById("toast");

const toastOn = () => {
  toast.classList.add("active");
  setTimeout(() => {
    toast.classList.remove("active");
  }, 1000);
};

// 수정하기 버튼
button.onclick = async () => {
  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  loginUser = user.user_num;

  if (!user) {
    alert("로그인 해주세요.");
    window.location.href = "/";
  } else {
    // 중복확인
    if (nickname.value.length !== 0 && nickname.value.includes(" ") == false) {
      fetch(`http://localhost:8080/api/user/isExist/${nickname.value}`)
        .then((response) => response.json())
        .then((data) => {
          // true이면 중복, false이면 중복된 닉네임 없음
          if (data) {
            alert("중복된 닉네임입니다. 다른 닉네임을 입력해주세요.");
          } else {
            // 닉네임 변경
            fetch("http://localhost:8080/api/user/modifyNickname", {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_num: loginUser,
                nickname: nickname.value,
              }),
            }).then((response) => {
              if (!response.errorCode) {
                toastOn();
                console.log("닉네임 변경 완료");
              } else {
                throw new Error("닉네임 변경 시 오류가 발생했습니다.");
              }
            });
          }
        });
    } else {
      alert("닉네임을 확인하세요.");
    }
  }
};

// 회원탈퇴 모달 버튼 (취소-확인)
const modalCancel = document.getElementsByClassName("modal-btn-cancel")[0];
const modalComplete = document.getElementsByClassName("modal-btn-complete")[0];
const leave = document.getElementsByClassName("txtlink")[0];

leave.onclick = () =>
  (document.getElementsByClassName("modalBackground")[0].style.display =
    "block");

// 회원탈퇴 취소
modalCancel.onclick = () => {
  document.getElementsByClassName("modalBackground")[0].style.display = "none";
  console.log("회원탈퇴 취소");
};
// 회원탈퇴 완료
modalComplete.onclick = async () => {
  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  loginUser = user.user_num;

  fetch("http://localhost:8080/api/user/leaveUser", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_num: loginUser }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "SUCCESS") {
        alert("회원 탈퇴가 완료되었습니다.");
        console.log("회원탈퇴 완료");
      } else {
        throw new Error("회원 탈퇴 처리 중 오류가 발생했습니다.");
      }
    });
  window.location.href = "/";
};

// 프로필 이미지 변경 버튼 클릭 시
document.getElementsByClassName("btn-change")[0].onclick = () =>
  alert("아직 할 줄 몰라요");

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
let back = document.getElementsByClassName("profile-box")[0];

back.onclick = () => (window.location.href = `/post/list`);

//프로필 박스 클릭 시 옵션 리스트 노출
profile = document.getElementsByClassName("profile-box")[1];
option = document.getElementsByClassName("opt-pos")[0];

profile.onmouseover = () => profile.classList.add("cursor");
profile.onclick = () => option.classList.toggle("hide");

// 옵션박스 회원정보수정,비밀번호수정 클릭
document.getElementsByClassName("opt-box")[0].onclick = () =>
  (window.location.href = `/user/inf`);
document.getElementsByClassName("opt-box")[1].onclick = () =>
  (window.location.href = `/user/infp`);

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

const pw = document.getElementsByClassName("input-box")[0];
const pwch = document.getElementsByClassName("input-box")[1];
const pwtxt = document.querySelectorAll(".helpertxt")[0];
const pwchtxt = document.querySelectorAll(".helpertxt")[1];

const button = document.getElementsByClassName("login-button")[0];

const strongPassword = (str) => {
  return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/.test(str);
};

//비밀번호 유효성 검사
pw.onkeyup = () => {
  if (pw.value.length > 0) {
    if (strongPassword(pw.value) == false) {
      pwtxt.innerText = "* 8~20자 영문, 숫자, 특수문자를 사용하세요.";
      pwtxt.style.opacity = 1;
    } else {
      pwtxt.style.opacity = 0;
      if (strongPassword(pw.value) == true) {
        button.style.backgroundColor = "#7F6AEE";
        button.classList.add("cursor");
      } else {
        button.style.backgroundColor = "#ACA0EB";
      }
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
    if (strongPassword(pw.value) == true) {
      button.style.backgroundColor = "#7F6AEE";
      button.classList.add("cursor");
    } else {
      button.style.backgroundColor = "#ACA0EB";
    }
  } else {
    pwchtxt.innerText = "* 비밀번호가 다릅니다.";
    pwchtxt.style.opacity = 1;
  }
};

const toast = document.getElementById("toast");

const toastOn = () => {
  toast.classList.add("active");
  setTimeout(() => {
    toast.classList.remove("active");
  }, 1000);
};

// 비밀번호 수정하기 버튼 클릭 시
button.onclick = async () => {
  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  loginUser = user.user_id;

  if (pw.value == pwch.value && strongPassword(pw.value) == true) {
    fetch("http://localhost:8080/api/user/modifyPassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: loginUser, password: pw.value }),
    }).then((response) => {
      if (response) {
        toastOn();
        console.log("수정완료");
      } else {
        throw new Error("비밀번호 수정 시 오류가 발생했습니다.");
      }
    });
  } else {
    alert("비밀번호를 확인하세요.");
  }
};

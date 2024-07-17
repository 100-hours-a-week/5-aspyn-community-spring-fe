document.addEventListener("DOMContentLoaded", async function () {
  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  if (!user) return;

  const loginUser = user.user_num;
  const profileImageElement = document.querySelector(".profile-pic");

  // 로그인 유저 프로필 이미지 가져오기
  fetchProfileImage(loginUser)
    .then((profileImageSrc) => {
      profileImageElement.src = profileImageSrc;
    })
    .catch((error) => {
      console.error("Error fetching profile image:", error);
    });

  // 게시글 작성 버튼
  const editBtn = document.querySelector(".btn-edit");
  editBtn.onclick = () => {
    if (loginUser !== null) {
      window.location.href = `/post/edit`;
    } else {
      alert("비회원은 게시글 작성이 불가합니다. 로그인 해주세요.");
    }
  };

  // 게시글 목록 가져오기
  fetchPosts();

  function fetchPosts() {
    fetch("http://localhost:8080/post/list")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const posts = data.data;
        posts.forEach((post) => createBox(post));
      })
      .catch((error) => {
        console.error("Error fetching board list: ", error);
      });
  }
});

// 로그인 유저 확인
async function fetchUserInfo() {
  try {
    const response = await fetch(`http://localhost:8080/userinfo`, {
      method: "GET",
      credentials: "include", // 세션과 쿠키를 포함하여 요청을 보냄
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "ERROR") {
        alert(data.message);
        window.location.href = "/"; // 로그인 페이지로 리다이렉트
        return null;
      } else {
        return data; // user_num: 'n'
      }
    } else {
      alert("로그인 해주세요.");
      window.location.href = "/";
      throw new Error("로그인 해주세요.");
    }
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

// 콘텐츠 목록 div 박스 추가
function createBox(item) {
  let newDiv = document.createElement("div");
  newDiv.classList.add("content-box", "cursor");

  let modify_date = formatDate(item.modify_date);

  newDiv.innerHTML = `
      <div>
          <p class="con-title">${item.title}</p>
          <p class="con-react">좋아요 ${item.like} 댓글 ${item.comment} 조회수 ${item.view}</p>
          <p class="write-date" style="float: right;">${modify_date}</p>
          <div style="clear: both;"></div>
      </div>
      <hr class="horizontal-rule">
      <div class="list-profile">
          <div class="profile-box">
              <img class="profile-pic" src="/public/images/graycircle.png">
          </div>
          <p class="list-user">${item.nickname}</p>
      </div>`;

  document.querySelector("article.contents").append(newDiv);

  // 프로필 이미지 설정
  const profilePic = newDiv.querySelector(".profile-pic");

  // 게시글 작성자 프로필 이미지 가져오기
  fetchProfileImage(item.user_num)
    .then((profileImageSrc) => {
      profilePic.src = profileImageSrc;
    })
    .catch((error) => {
      console.error("Error fetching profile image:", error);
    });

  // 클릭 시 해당 게시글로 이동
  newDiv.onclick = () => {
    window.location.href = `/post/detail?post=${item.id}`;
  };
}

// 프로필 이미지를 서버에서 불러오는 함수
function fetchProfileImage(userId) {
  return fetch(`http://localhost:8080/profile/${userId}`)
    .then((response) => {
      if (response.ok) {
        return response.arrayBuffer();
      } else {
        throw new Error("Profile image not found");
      }
    })
    .then((buffer) => {
      const base64Flag = "data:image/jpeg;base64,";
      const imageStr = arrayBufferToBase64(buffer);
      return base64Flag + imageStr;
    });
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// 날짜 형식을 변환하는 함수
function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

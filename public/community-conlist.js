document.addEventListener("DOMContentLoaded", async function () {
  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  if (!user) return;

  const loginUser = user.user_id;
  const profileImageElement = document.querySelector(".header-box img");

  // 로그인 유저 프로필 이미지 가져오기
  fetchProfileImage(loginUser)
    .then((profileUrl) => {
      profileImageElement.src = profileUrl;
    })
    .catch((error) => {
      console.error("Error fetching profile image:", error);
    });

  // 게시글 작성 버튼
  const editBtn = document.querySelector(".post-button");
  editBtn.onclick = () => {
    if (loginUser !== null) {
      window.location.href = `/post/new`;
    } else {
      alert("비회원은 게시글 작성이 불가합니다. 로그인 해주세요.");
    }
  };

  // 게시글 목록 가져오기
  fetchPosts();

  function fetchPosts() {
    fetch("http://localhost:8080/api/post/list")
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
    const response = await fetch(`http://localhost:8080/api/userinfo`, {
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
        return data; // user_id: 'n'
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
  let newPost = document.createElement("article");
  newPost.classList.add("post-card", "rel");

  newPost.innerHTML = `
    <div class="post-image rel cursor">
      <img src="${item.imgUrl || "/public/images/photo.jpg"}" />
    </div>
    <h3 class="post-title cursor">${item.title}</h3>
    <div class="post-info">
      <div class="post-info">
        <span class="author-profile">
          <img src="${item.profileUrl || "/public/images/basic_user.png"}" />
        </span>
        <span class="post-author">${item.nickname}</span>
      </div>
      <div class="post-icon">
        <img class="thumbnail" src="/public/images/camera.png" />
      </div>
    </div>`;

  // 생성한 게시글을 목록에 추가
  document.querySelector(".post-list").append(newPost);

  let postImg = newPost.querySelector(".post-image");
  let title = newPost.querySelector(".post-title");

  // 클릭 시 해당 게시글로 이동
  postImg.onclick = () => {
    window.location.href = `/post/detail/${item.id}`;
  };
  title.onclick = () => {
    window.location.href = `/post/detail/${item.id}`;
  };
}

// 프로필 이미지를 서버에서 불러오는 함수
function fetchProfileImage(userId) {
  return fetch(`http://localhost:8080/api/user/loginUser/${userId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("프로필 이미지가 없습니다.");
      }
    })
    .then((data) => {
      return data.profileUrl;
    });
}

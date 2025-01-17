document.addEventListener("DOMContentLoaded", async function () {
  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  if (!user) return;

  const loginUser = user.user_id;
  const profileImage = document.querySelector(".header-box img");
  
  // 상단 로그인 유저의 프로필 이미지
  if (user.profile_url){
    profileImage.src = user.profile_url;
  }
  
  const profileBox = document.querySelector(".header-box");
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

  logout.onclick = () => {
    // 로그아웃
    console.log("로그아웃");
  };

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
    fetchWithAuth("http://localhost:8080/api/post/list", "GET")
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
    const response = await fetchWithAuth(
      "http://localhost:8080/api/userinfo",
      "GET"
    );

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
    window.location.href = `/post/${item.id}`;
  };
  title.onclick = () => {
    window.location.href = `/post/${item.id}`;
  };
}

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

// 로그인 유저 확인
async function fetchUserInfo() {
  try {
    const response = await fetch(`http://localhost:8080/userinfo`, {
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
      alert("로그인 해주세요.");
      window.location.href = "/";
      throw new Error("로그인 해주세요.");
    }
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

//게시글 작성 버튼
let editBtn = document.querySelector(".btn-edit");

// 로그인 시에만 가능
(async function () {
  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  loginUser = user.user_num;

  editBtn.onclick = () => {
    if (loginUser !== null) {
      window.location.href = `/post/edit`;
    } else {
      alert("비회원은 게시글 작성이 불가합니다. 로그인 해주세요.");
    }
  };

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
    fetch(`http://localhost:8080/user/logout`, {
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

  fetch("http://localhost:8080/post/list")
    .then((response) => {
      // console.log(response);
      // console.log(">>>>>>>>" + response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(">>>>>" + data.data);

      let posts = data.data;
      //콘텐츠 개수만큼 반복
      for (let i = 0; i < posts.length; i++) {
        createBox(posts[i]);
      }
    })
    .catch((error) => {
      console.error("Error fetching board list: ", error);
    });
})();

//마우스 오버 시 색상 변경
editBtn.onmouseover = () => (editBtn.style.backgroundColor = "#7F6AEE");
editBtn.onmouseout = () => (editBtn.style.backgroundColor = "#ACA0EB");

//프로필 박스 클릭 시 옵션 리스트 노출
profile = document.getElementsByClassName("profile-pic")[0];
option = document.getElementsByClassName("opt-pos")[0];

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

//콘텐츠 목록 div 박스 추가
function createBox(item) {
  let newDiv = document.createElement("div");
  newDiv.classList.add("content-box", "cursor");

  let modify_date = formatDate(item.modify_date);

  newDiv.innerHTML = `
      <div>
      <p class="con-title">${item.title}</p>
      <p class="con-react">좋아요 ${item.like}   댓글 ${item.comment}   조회수 ${item.view}</p>
      <p class="write-date" style="float: right;">${modify_date}</p>
      <div style="clear: both;"></div>
      </div>
      <hr class="horizontal-rule" >
      <div class="list-profile">
      <div class="profile-box">
          <img class="profile-pic" src="/public/images/graycircle.png" >
      </div>
      <p class="list-user">${item.nickname}</p>
      </div>`;
  //newDiv를 'contents' 클래스를 가지고 있는 <article> 태그 안에 삽입
  document.querySelector("article.contents").append(newDiv);

  // 클릭 시 해당 게시글로 이동
  newDiv.onclick = () => {
    // alert("로그인 유저 : " + user);
    window.location.href = `/post/detail?post=${item.id}`;
  };
}

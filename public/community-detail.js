document.addEventListener("DOMContentLoaded", () => {
  // 로그인 유저 확인
  async function fetchUserInfo() {
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/userinfo`,
        "GET"
      );

      if (response.ok) {
        const data = await response.json();

        // console.log(data);
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
  // URL에서 마지막 경로 세그먼트 가져오기 (게시글 아이디)
  const pathSegments = window.location.pathname.split("/");
  const postId = pathSegments[pathSegments.length - 1];

  const title = document.getElementsByClassName("post-title")[0]; //제목
  const writer = document.getElementsByClassName("profile-nickname")[0]; // 게시글 작성자
  const writer_profile = document.getElementById("post-profile"); // 게시글 작성자 프로필 이미지
  const date = document.getElementsByClassName("post-date")[0]; // 게시글 작성시간
  const post_button = document.getElementsByClassName("right")[1]; // 게시글 수정/삭제 버튼
  const post_img = document
    .getElementsByClassName("post-image")[0]
    .querySelector("img"); // 게시글 이미지
  const post_content = document.getElementsByClassName("post-text")[0]; //게시글 내용

  // 댓글 창에 표시되는 로그인 유저 정보
  const commentLoginNickname =
    document.getElementsByClassName("profile-nickname")[1];
  const commentLoginProfile = document
    .getElementsByClassName("profile-box")[1]
    .querySelector("img");

  // 뒤로가기 버튼
  const back = document.getElementsByClassName("header-box")[0];
  back.onclick = () => (window.location.href = `/post/list`);

  // 상단 로그인 유저 프로필 이미지
  const loginProfile = document
    .getElementsByClassName("header-box")[1]
    .querySelector("img");

  // 게시글 수정-삭제 버튼
  const postUpdate = document.getElementsByClassName("small-button")[0]; // 게시글 수정 버튼
  const postDelete = document.getElementsByClassName("small-button")[1]; // 게시글 삭제 버튼

  // 모달창
  const modal = document.getElementsByClassName("modal-bg")[0]; // 모달창 전체
  const modalTitle = document.getElementsByClassName("modal-title")[0]; // 게시글을 삭제하시겠습니까?
  const modalCancel = document.getElementsByClassName("modal-button")[0]; // 취소버튼
  const modalComplete = document.getElementsByClassName("modal-button")[1]; // 완료버튼

  //댓글 등록 버튼
  const commentSubBtn = document.getElementsByClassName("button")[0];
  const comment = document.getElementsByClassName("comment-text")[0]; //댓글 입력창

  let loginUser = null;

  // 로그인 유저 정보 가져오기
  fetchUserInfo()
    .then((user) => {
      loginUser = user.user_id;

      // 상단 및 댓글 창 로그인 유저 프로필 사진 표시하기
      if (user.profile_url) {
        loginProfile.src = user.profile_url;
        commentLoginProfile.src = user.profile_url;
        loginProfileUrl = user.profile_url;
      }

      // 댓글 창에 표시되는 로그인 유저 닉네임 표시하기
      commentLoginNickname.innerHTML = user.nickname;
    })
    .catch((error) => {
      console.error("Error fetching user info:", error);
    });

  //----------------------------- 게시글 ---------------------------
  // 게시글 수정
  postUpdate.onclick = () => (window.location.href = `/post/update/${postId}`);

  // 게시글 삭제 버튼 클릭 시 모달창 노출
  postDelete.onclick = function () {
    modal.classList.remove("hide");
    modalTitle.innerHTML = "게시글을 삭제하시겠습니까?";

    // 모달창 - 취소버튼
    modalCancel.onclick = () => {
      modal.classList.add("hide");
      console.log("게시글 삭제 취소");
    };

    // 모달창 - 삭제버튼
    modalComplete.onclick = () => {
      // 게시글 삭제
      fetchWithAuth(`http://localhost:8080/api/post/${postId}`, "DELETE")
        .then((response) => {
          if (!response.errorCode) {
            alert("게시글이 삭제 되었습니다");
            window.location.href = `/post/list`;
          } else {
            throw new Error("게시글 삭제 시 오류가 발생했습니다.");
          }
        })
        .catch((error) => {
          console.error("게시글 삭제 중 오류가 발생했습니다:", error);
          alert("게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
        });

      modal.classList.add("hide");
      console.log("게시글 삭제");
    };
  };

  // ----------------------------------- 댓글 --------------------------

  // 댓글 입력 시 버튼 색상 변경
  comment.addEventListener("keyup", () => {
    if (comment.value.trim().length > 0) {
      commentSubBtn.classList.remove("color-purple");
      commentSubBtn.classList.add("color-red", "cursor");
    } else {
      commentSubBtn.classList.remove("color-red", "cursor");
      commentSubBtn.classList.add("color-purple");
    }
  });

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

  // 게시글 내용 불러와서 보여주기
  async function loadContent(item) {
    // 줄바꿈 문자를 <br> 태그로 변환
    const post_text = item.text.replace(/\n/g, "<br>");

    title.innerHTML = item.title;
    writer.innerHTML = item.nickname;
    date.innerHTML = formatDate(item.updatedAt);
    post_content.innerHTML = `<p>${post_text}</p>`;
    post_img.src = item.imgUrl;

    if (item.imgUrl === "-") {
      alert("삭제된 게시글 입니다.");
      window.location.href = `/post/list`;
    }

    // 게시글 작성자의 프로필 이미지가 있는 경우(없으면 기본값)
    if (item.profileUrl) {
      writer_profile.src = item.profileUrl;
    }

    if (item.iris == null) {
      document
        .getElementsByClassName("metadata")[0]
        .querySelector("p")
        .classList.add("hide");
    } else {
      document.getElementsByClassName(
        "metadata"
      )[0].innerHTML = `<p>F${item.iris}</p>`;
    }

    if (item.shutterSpeed == null) {
      document
        .getElementsByClassName("metadata")[1]
        .querySelector("p")
        .classList.add("hide");
    } else {
      document.getElementsByClassName(
        "metadata"
      )[1].innerHTML = `<p>${item.shutterSpeed}초</p>`;
    }

    if (item.iso == null) {
      document
        .getElementsByClassName("metadata")[2]
        .querySelector("p")
        .classList.add("hide");
    } else {
      document.getElementsByClassName(
        "metadata"
      )[2].innerHTML = `<p>ISO ${item.iso}</p>`;
    }

    console.log("콘텐츠 가져오기 완료------------");

    // 로그인 유저 넘버와 게시글 작성 유저 넘버가 같으면 수정/삭제 노출
    if (loginUser == item.userId) {
      console.log("지금 로그인한 유저가 게시글 작성자임");
      post_button.classList.remove("hide");
    }
  }

  // 게시글&댓글 불러오기
  fetchWithAuth(`http://localhost:8080/api/post/${postId}`, "GET")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("api 호출 성공: ", data);

      if (data.status == "SUCCESS") {
        const post = data.post;
        loadContent(post);

        if (Array.isArray(post.comments)) {
          post.comments.forEach((comment) => {
            createCmtBox(comment);
          });
        } else {
          console.error("댓글 데이터가 올바르지 않습니다.");
        }
      } else if (data.status == "ERROR") {
        alert(data.message);
        window.location.href = `/post/list`;
      }
    }) // then 종료
    .catch((error) => console.error("Fetch 오류:", error));

  // 댓글 박스 삽입
  async function createCmtBox(c) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("comment-box");

    // 날짜 형식 변환
    const modifyDate = formatDate(c.updatedAt);
    // 줄바꿈 문자를 <br> 태그로 변환
    const text = c.text.replace(/\n/g, "<br>");

    if (loginUser == c.userId) {
      newDiv.innerHTML = `
          <div class="postinfo-box">
            <div class="post-info">
              <div class="profile-box">
                <img src="${
                  c.profileUrl ? c.profileUrl : "/public/images/basic_user.png"
                }" />
              </div>
              <p class="profile-nickname">${c.nickname}</p>
              <p class="post-date">${modifyDate}</p>
            </div>
            <!--댓글을 작성한 유저인 경우-->
            <div class="right">
              <button class="small-button" id="comment-update" data-edit-seq=${
                c.id
              }>수정</button>
              <button class="small-button" id="comment-delete" data-remove-seq=${
                c.id
              }>삭제</button>
            </div>
          </div>
          <p class="comment-content" data-seq=${c.id}>${text}</p>`;
    } else {
      newDiv.innerHTML = `
          <div class="postinfo-box">
            <div class="post-info">
              <div class="profile-box">
                <img src="${
                  c.profileUrl ? c.profileUrl : "/public/images/basic_user.png"
                }" />
              </div>
              <p class="profile-nickname">${c.nickname}</p>
              <p class="post-date">${modifyDate}</p>
            </div>
          </div>
          <p class="comment-content" data-seq=${c.id}>${text}</p>`;
    }

    //newDiv를 'content' 클래스를 가지고 있는 <article> 태그 안에 삽입
    document.querySelector("article.content").append(newDiv);
  }

  // 수정 버튼 클릭 이벤트 추가
  document.addEventListener("click", (e) => {
    // 수정 버튼 클릭 시
    if (
      e.target.classList.contains("small-button") &&
      e.target.id === "comment-update"
    ) {
      e.stopImmediatePropagation();

      const seq = e.target.dataset.editSeq; // 댓글의 고유 ID

      const commentContent = document.querySelector(
        `.comment-content[data-seq='${seq}']`
      );

      const updateCommentBtn = document.querySelector(
        `.small-button[data-edit-seq='${seq}']`
      );

      const cancelCommentBtn = document.querySelector(
        `.small-button[data-remove-seq='${seq}']`
      );

      if (commentContent) {
        const currentText = commentContent.innerHTML.replace(/<br>/g, "\n"); // <br>을 줄바꿈으로 변환

        // 댓글의 원래 텍스트를 data-original-text 속성에 저장
        commentContent.setAttribute("data-original-text", currentText);

        // cancelCommentBtn이 존재하는지 확인 후 처리
        if (cancelCommentBtn) {
          // 기존 '삭제' 버튼을 '취소' 버튼으로 변경
          cancelCommentBtn.innerText = "취소";
          cancelCommentBtn.id = "comment-cancel"; // 취소 버튼으로 변경
        }

        // 댓글 내용을 인풋 박스로 변경
        commentContent.innerHTML = `
        <input type="text" class="edit-comment-input" value="${currentText}" />
      `;
      }

      // 수정 버튼을 '저장' 버튼으로 변경
      updateCommentBtn.innerText = "저장"; // 수정 버튼을 '저장'으로 변경
      updateCommentBtn.id = "comment-save";

      return;
    }

    // 취소 버튼 클릭 시 원래 상태로 복원
    if (e.target.id === "comment-cancel") {
      e.stopImmediatePropagation();

      const seq = e.target.dataset.removeSeq; // 댓글의 고유 ID
      const commentContent = document.querySelector(
        `.comment-content[data-seq='${seq}']`
      );
      const cancelCommentBtn = e.target;
      const updateCommentBtn = document.querySelector(
        `.small-button[data-edit-seq='${seq}']`
      );

      if (commentContent && cancelCommentBtn) {
        // '취소' 버튼을 다시 '삭제' 버튼으로 변경
        cancelCommentBtn.innerText = "삭제";
        cancelCommentBtn.id = "comment-delete"; // 삭제 버튼으로 복원

        // 입력된 텍스트를 원래 내용으로 복원
        const originalText = commentContent.getAttribute("data-original-text");
        commentContent.innerHTML = originalText.replace(/\n/g, "<br>");

        updateCommentBtn.innerHTML = "수정";
        updateCommentBtn.id = "comment-update"; // 수정 버튼으로 복원
      }

      return;
    }

    // 저장 버튼 클릭 시 댓글 수정 내용 저장
    if (e.target.id === "comment-save") {
      e.stopImmediatePropagation();

      const seq = e.target.dataset.editSeq; // 댓글의 고유 ID
      const commentContent = document.querySelector(
        `.comment-content[data-seq='${seq}']`
      );

      if (commentContent) {
        const newText = commentContent.querySelector(
          ".edit-comment-input"
        ).value;

        let modComment = { id: seq, text: newText };

        fetchWithAuth(
          "http://localhost:8080/api/comment/modify",
          "PATCH",
          modComment
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status == "SUCCESS") {
              alert("댓글이 성공적으로 수정되었습니다.");
              location.reload();
              console.log("댓글 수정 완료");
            } else {
              throw new Error("댓글 수정이 실패되었습니다.");
            }
          })
          .catch((error) => {
            console.error("댓글 수정 중 오류가 발생했습니다:", error);
            alert("댓글 수정에 실패했습니다. 다시 시도해주세요.");
          });
      }

      return;
    }

    // 댓글 삭제버튼 클릭 이벤트 할당
    if (e.target.id === "comment-delete") {
      e.stopImmediatePropagation();

      const seq = e.target.dataset.removeSeq; // 댓글의 고유 ID
      console.log("삭제하려는 댓글: ", seq);

      modal.classList.remove("hide");
      modalTitle.innerHTML = "댓글을 삭제하시겠습니까?";

      // 모달창 - 취소버튼(댓글)
      modalCancel.onclick = () => {
        modal.classList.add("hide");
        console.log("댓글 삭제 취소");
      };

      // 모달창 - 삭제버튼(댓글) -> 댓글 삭제
      modalComplete.onclick = () => {
        // 댓글 삭제처리
        fetchWithAuth(`http://localhost:8080/api/comment/${seq}`, "DELETE")
          .then((response) => {
            if (!response.errorCode) {
              alert("댓글이 삭제 되었습니다.");
              location.reload();
              console.log("댓글 삭제");
            } else {
              throw new Error("댓글 삭제 시 오류가 발생했습니다.");
            }
          })
          .catch((error) => {
            console.error("댓글 삭제 중 오류가 발생했습니다:", error);
            alert("댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
          });

        modal.classList.remove("hide"); // 모달 닫기(미노출)
      };

      return;
    }
  });

  //-------------------------- 댓글 등록 -------------------------
  //댓글 등록 버튼
  commentSubBtn.onclick = async () => {
    let newComment = {
      postId: postId,
      text: comment.value,
    };

    if (comment.value.length == 0) {
      alert("댓글을 입력하세요");
    } else if (loginUser == null) {
      alert("비회원은 댓글 작성이 불가합니다. 로그인 해주세요.");
    } else {
      // 새로운 댓글 등록
      fetchWithAuth(
        "http://localhost:8080/api/comment/edit",
        "POST",
        newComment
      )
        .then((response) => {
          if (!response.errorCode) {
            console.log("댓글 등록 완료");
            alert("댓글이 등록되었습니다.");
            location.reload();
          } else {
            throw new Error("댓글 저장이 실패되었습니다.");
          }
        })
        .catch((error) => {
          console.error("댓글 저장 중 오류가 발생했습니다:", error);
          alert("댓글 저장에 실패했습니다. 다시 시도해주세요.");
        });
    }
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

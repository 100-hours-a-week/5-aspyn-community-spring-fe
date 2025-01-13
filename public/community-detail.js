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

        console.log(data);
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
  // const loginProfile = document.getElementById("login-profile");
  const loginProfile = document
    .getElementsByClassName("header-box")[1]
    .querySelector("img");

  // 게시글 수정-삭제 버튼
  const postUpdate = document.getElementsByClassName("update-button")[0]; // 수정버튼
  const postDelete = document.getElementsByClassName("update-button")[1]; // 삭제버튼

  // 모달창
  const modal = document.getElementsByClassName("modal-bg")[0]; // 모달창 전체
  const modalTitle = document.getElementsByClassName("modal-title")[0]; // 게시글을 삭제하시겠습니까?
  const modalCancel = document.getElementsByClassName("modal-button")[0]; // 취소버튼
  const modalComplete = document.getElementsByClassName("modal-button")[1]; // 완료버튼

  // TODO: 새로 매칭 필요
  // 게시글 삭제 모달 버튼 (취소-확인)
  const modalConCancel = document.getElementsByClassName("modal-btn-cancel")[0];
  const modalConComplete =
    document.getElementsByClassName("modal-btn-complete")[0];

  // TODO: 새로 매칭 필요
  // 댓글 삭제 모달 버튼 (취소-확인))
  const modalCmtCancel = document.getElementsByClassName("modal-btn-cancel")[1];
  const modalCmtComplete =
    document.getElementsByClassName("modal-btn-complete")[1];

  //댓글 등록 버튼
  const commentSubBtn = document.getElementsByClassName("comment-button")[0];
  const comment = document.getElementsByClassName("comment-text")[0]; //댓글 입력창

  // 로그인 유저 정보 가져오기
  fetchUserInfo()
    .then((user) => {
      console.log(user);
      loginUser = user.user_id;

      // 상단 및 댓글 창 로그인 유저 프로필 사진 표시하기
      if (user.profile_url) {
        loginProfile.src = user.profile_url;
        commentLoginProfile.src = user.profile_url;
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
      // TODO : api 엔드포인트 수정 예정
      fetchWithAuth(`http://localhost:8080/api/post/${postId}`, "DELETE", {
        id: postId,
      })
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
  comment.onkeyup = () => {
    if (comment.value.length > 0) {
      commentSubBtn.style.backgroundColor = "#7F6AEE";
      commentSubBtn.classList.add("cursor");
    } else {
      commentSubBtn.style.backgroundColor = "#ACA0EB";
      commentSubBtn.classList.remove("cursor");
    }
  };

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
    writer_profile.src = item.profileUrl;
    date.innerHTML = formatDate(item.updatedAt);
    post_content.innerHTML = `<p>${post_text}</p>`;
    post_img.src = item.imgUrl;

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
    const modifyDate = formatDate(c.modifyDate);
    // 줄바꿈 문자를 <br> 태그로 변환
    const text = c.text.replace(/\n/g, "<br>");

    if (loginUser == c.userNum) {
      newDiv.innerHTML = `
          <div class="postinfo-box">
            <div class="post-info">
              <div class="profile-box">
                <img src="/public/images/basic_user.png" />
              </div>
              <p class="profile-nickname">${c.nickname}</p>
              <p class="post-date">${modifyDate}</p>
            </div>
            <!--게시글을 작성한 유저인 경우-->
            <div class="right">
              <button class="update-button" data-edit-seq=${c.seq}>수정</button>
              <button class="update-button" data-remove-seq=${c.seq}>삭제</button>
            </div>
          </div>
          <p class="comment-content">${text}</p>`;
    } else {
      newDiv.innerHTML = `
          <div class="postinfo-box">
            <div class="post-info">
              <div class="profile-box">
                <img src="/public/images/basic_user.png" />
              </div>
              <p class="profile-nickname">${c.nickname}</p>
              <p class="post-date">${modifyDate}</p>
            </div>
            <!--게시글을 작성한 유저인 경우에만 버튼 노출-->
            <div class="right">
              <button class="update-button">수정</button>
              <button class="update-button">삭제</button>
            </div>
          </div>
          <p class="comment-content">${text}</p>`;
    }

    //newDiv를 'contents' 클래스를 가지고 있는 <article> 태그 안에 삽입
    document.querySelector("article.contents").append(newDiv);

    // 댓글 삭제버튼 클릭 이벤트 할당
    let commentRemoveBtns = document.querySelectorAll("[data-remove-seq]");
    commentRemoveBtns.forEach(function (btn) {
      btn.onclick = function () {
        let removeSeq = this.getAttribute("data-remove-seq");

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
          // TODO : api 엔드포인트 수정 예정
          fetchWithAuth(
            `http://localhost:8080/api/comment/${removeSeq}`,
            "DELETE",
            { seq: removeSeq }
          )
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
      };
    }); // 댓글 삭제 foreach 종료 중괄호

    // 댓글 수정버튼 클릭 이벤트 할당
    let commentEditBtns = document.querySelectorAll("[data-edit-seq]");
    commentEditBtns.forEach(function (btn) {
      btn.onclick = function () {
        // 댓글 수정 버튼을 클릭하면
        let seq = this.getAttribute("data-edit-seq");
        // 수정할 댓글을 댓글창에 노출하고 댓글등록 버튼을 수정버튼으로 변경
        console.log("시퀀스 : ", seq);

        fetchWithAuth(`http://localhost:8080/api/comment/${seq}`, "GET")
          .then((response) => response.json())
          .then((data) => {
            let modComment = data;
            console.log(modComment);

            comment.setAttribute("value", modComment.text);
            commentSubBtn.innerHTML = "댓글 수정";

            commentSubBtn.onclick = function () {
              if (comment.value.length == 0) {
                alert("수정할 댓글을 입력하세요");
              } else {
                let modCmt = { seq: seq, text: comment.value };

                fetchWithAuth(
                  "http://localhost:8080/api/comment/modify",
                  "PATCH",
                  modCmt
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
              } // else 닫는 중괄호
            }; // 댓글 수정 작업 종료 commentSubBtn 버튼
          });
      }; // btn.onclick 종료 중괄호
    }); //댓글 수정 foreach문 중괄호
  }

  //-------------------------- 댓글 등록 -------------------------
  //댓글 등록 버튼
  commentSubBtn.onclick = async () => {
    let newCmt = {
      postId: postId,
      text: comment.value,
      userNum: loginUser,
    };

    if (comment.value.length == 0) {
      alert("댓글을 입력하세요");
    } else if (user == null) {
      alert("비회원은 댓글 작성이 불가합니다. 로그인 해주세요.");
    } else {
      // 새로운 댓글 등록
      fetchWithAuth("http://localhost:8080/api/comment/edit", "POST", newCmt)
        .then((response) => {
          if (!response.errorCode) {
            alert("댓글이 성공적으로 저장되었습니다.");
            location.reload();
            console.log("댓글 등록 완료");
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

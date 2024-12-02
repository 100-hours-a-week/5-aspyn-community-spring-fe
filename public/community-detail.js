document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded 이벤트가 트리거되었습니다.");

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

  // 뒤로가기 버튼
  let back = document.getElementsByClassName("profile-box")[0];
  back.onclick = () => (window.location.href = `/post/list`);

  // 로그인 유저 프로필 이미지
  const loginProfile = document.getElementsByClassName("profile-pic")[1];

  // 게시글 수정-삭제 버튼
  const contentModBtn = document.getElementsByClassName("btn-rel")[0];
  const contentDelBtn = document.getElementsByClassName("btn-rel")[1];

  // 게시글 삭제 모달 버튼 (취소-확인)
  const modalConCancel = document.getElementsByClassName("modal-btn-cancel")[0];
  const modalConComplete =
    document.getElementsByClassName("modal-btn-complete")[0];

  // 댓글 삭제 모달 버튼 (취소-확인))
  const modalCmtCancel = document.getElementsByClassName("modal-btn-cancel")[1];
  const modalCmtComplete =
    document.getElementsByClassName("modal-btn-complete")[1];

  //댓글 등록 버튼
  const commentSubBtn = document.getElementsByClassName("comment-sub-btn")[0];
  const comment = document.getElementsByClassName("comment-int")[0]; //댓글 입력창

  //----------------------------- 게시글 ---------------------------
  // 게시글 수정
  contentModBtn.onclick = () =>
    (window.location.href = `/post/${postId}/update`);

  // 게시글 삭제 버튼 클릭 시 모달창 노출
  contentDelBtn.onclick = function () {
    document.getElementsByClassName("modalBackground")[0].style.display =
      "block";

    modalConCancel.onclick = () => {
      // 취소
      document.getElementsByClassName("modalBackground")[0].style.display =
        "none";
      console.log("게시글 삭제 취소");
    };

    // 게시글 삭제 - 모달창
    modalConComplete.onclick = () => {
      // 완료
      document.getElementsByClassName("modalBackground")[0].style.display =
        "none";

      fetch(`http://localhost:8080/api/post/remove/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: postId }),
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

  let title = document.getElementsByClassName("con-title")[0]; //제목
  let writer = document.getElementsByClassName("list-user")[0]; // 게시글 작성자
  let writerProfile = document.getElementsByClassName("profile-pic")[2]; // 게시글 작성자 프로필 이미지
  let date = document.getElementsByClassName("write-date")[0]; // 게시글 작성시간
  let postImage = document.getElementsByClassName("detail-img")[0]; // 게시글 이미지
  let contentTxt = document.getElementsByClassName("detail-text")[0]; //게시글 내용

  // 게시글 내용 불러와서 보여주기
  async function loadContent(item) {
    // 로그인 유저 정보 가져오기
    const user = await fetchUserInfo();
    loginUser = user.user_id;
    loginNickname = user.nickname;
    loginProfile.src = user.profile_url;

    // 줄바꿈 문자를 <br> 태그로 변환
    const post_text = item.text.replace(/\n/g, "<br>");

    console.log(item);
    title.innerHTML = item.title;
    writer.innerHTML = item.nickname;
    writerProfile.src = item.profileUrl;
    date.innerHTML = formatDate(item.updatedAt);
    contentTxt.innerHTML = `<p>${post_text}</p>`;
    postImage.src = item.imgUrl;
    document.getElementsByClassName(
      "detail-view"
    )[0].innerHTML = `<p style="font-size: 20px; font-weight: 700;">${item.view}</p>
         <p style="font-size: 16px; font-weight: 700;">조회수</p>`;
    document.getElementsByClassName(
      "detail-view"
    )[1].innerHTML = `<p style="font-size: 20px; font-weight: 700;">${item.comment}</p>
         <p style="font-size: 16px; font-weight: 700;">댓글</p>`;

    console.log("콘텐츠 가져오기 완료");

    // 세션 로그인 유저 넘버와 게시글 작성 유저 넘버가 같으면
    if (loginUser == item.userId) {
      document
        .getElementsByClassName("profile-right")[1]
        .classList.remove("hide");
    }
  }

  // 게시글&댓글 불러오기
  fetch(`http://localhost:8080/api/post/${postId}`)
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
    // 로그인 유저 정보 가져오기
    const user = await fetchUserInfo();
    loginUser = user.user_id;

    let newDiv = document.createElement("div");
    newDiv.classList.add("detail-comment");

    // 날짜 형식 변환
    const modifyDate = formatDate(c.modifyDate);
    // 줄바꿈 문자를 <br> 태그로 변환
    const text = c.text.replace(/\n/g, "<br>");

    if (loginUser == c.userNum) {
      newDiv.innerHTML = `
          <div>
              <div class="list-profile">
                  <div class="profile-box">
                      <img class="profile-pic" src="/public/images/graycircle.png" >
                  </div>
                  <p class="list-user">${c.nickname}</p>
                  <p class="write-date">${modifyDate}</p>
              </div>
              <p class="cmt-content">${text}</p>
          </div>
          <!--게시글을 작성한 유저인 경우에만 버튼 노출-->
          <div style="margin-left: auto;">
              <button class="btn-rel" data-edit-seq=${c.seq}>수정</button>
              <button class="btn-rel" data-remove-seq=${c.seq}>삭제</button>
          </div>`;
    } else {
      newDiv.innerHTML = `
          <div>
            <div class="list-profile">
                  <div class="profile-box">
                      <img class="profile-pic" src="/public/images/graycircle.png" >
                  </div>
                  <p class="list-user">${c.nickname}</p>
                  <p class="write-date">${modifyDate}</p>
              </div>
            <p class="cmt-content">${text}</p>
          </div>`;
    }

    //newDiv를 'contents' 클래스를 가지고 있는 <article> 태그 안에 삽입
    document.querySelector("article.contents").append(newDiv);

    // 댓글 삭제버튼 클릭 이벤트 할당
    let commentRemoveBtns = document.querySelectorAll("[data-remove-seq]");
    commentRemoveBtns.forEach(function (btn) {
      btn.onclick = function () {
        let removeSeq = this.getAttribute("data-remove-seq");
        document.getElementsByClassName("modalBackground")[1].style.display =
          "block";
        // 댓글 삭제 모달 - 취소버튼
        modalCmtCancel.onclick = () => {
          document.getElementsByClassName("modalBackground")[1].style.display =
            "none";
          console.log("댓글 삭제 취소");
        };

        // 댓글 삭제 모달 - 확인버튼(댓글 삭제처리)
        modalCmtComplete.onclick = () => {
          document.getElementsByClassName("modalBackground")[1].style.display =
            "none"; //모달창 미노출

          //댓글 삭제처리
          fetch(`http://localhost:8080/api/comment/remove/${removeSeq}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              seq: removeSeq,
            }),
          })
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

        fetch(`http://localhost:8080/api/comment/${seq}`)
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

                fetch("http://localhost:8080/api/comment/modify", {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(modCmt),
                })
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
    // 로그인 유저 정보 가져오기
    const user = await fetchUserInfo();
    loginUser = user.user_id;

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
      fetch("http://localhost:8080/api/comment/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCmt),
      })
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

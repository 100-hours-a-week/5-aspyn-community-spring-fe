document.addEventListener("DOMContentLoaded", () => {
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

  //뒤로가기 버튼
  let back = document.getElementsByClassName("profile-box")[0];

  back.onclick = () => (window.location.href = `/post/list`);

  const title = document.getElementsByClassName("mod-titleint")[0];
  const content = document.getElementsByClassName("mod-conint")[0];
  const imageInput = document.getElementById("imageInput"); // 이미지 파일 입력 요소
  const upload = document.getElementsByClassName("login-button")[0];

  upload.onclick = async () => {
    // 로그인 유저 정보 가져오기
    const user = await fetchUserInfo();
    loginUser = user.user_id;

    if (loginUser == null) {
      alert("비회원은 게시글 작성이 불가합니다. 로그인 해주세요.");
    } else {
      // imageInput이 존재하고 files 속성이 있는지 확인
      if (imageInput && imageInput.files) {
        const files = imageInput.files;
        // 파일 처리 로직
        console.log("선택된 파일:", files);
      } else {
        console.log("파일 입력 요소가 없거나 파일이 선택되지 않았습니다.");
        alert("이미지 파일을 선택해주세요.");
      }

      if (
        title.value.length !== 0 &&
        content.value.length !== 0 &&
        imageInput.files.length > 0
      ) {
        // 게시글 등록 기능
        let newContent = new FormData();
        newContent.append(
          "postDto",
          JSON.stringify({
            title: title.value,
            text: content.value,
            user_id: loginUser,
          })
        );
        newContent.append("image", imageInput.files[0]); // 이미지 파일 추가

        try {
          const response = await fetch("http://localhost:8080/api/post/edit", {
            method: "POST",
            body: newContent, // FormData 전송
          });

          if (!response.ok) {
            throw new Error("서버 응답 오류: " + response.status);
          }

          const resData = await response.json(); // JSON 데이터 추출

          if (!resData.errorCode) {
            alert("게시글이 성공적으로 저장되었습니다.");
            let post = resData.postId; // controller에서 { postId: newPostId } 이렇게 보내고 있음
            window.location.href = `/post/${post}`;
            console.log("게시글 등록 완료");
          } else {
            throw new Error("게시글 저장이 실패되었습니다.");
          }
        } catch (error) {
          console.error("게시글 저장 중 오류가 발생했습니다.", error);
          alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        alert("제목 및 내용을 모두 입력하세요.");
      }
    }
  };

  title.onkeyup = () => {
    if (title.value.length < 27) {
      console.log("게시글 제목 입력");
      if (title.value.length > 0 && content.value.length > 0) {
        upload.style.backgroundColor = "#7F6AEE";
      } else {
        upload.style.backgroundColor = "#ACA0EB";
      }
    } else {
      console.log("입력 글자 수 초과(최대 26글자)");
      alert("제목은 최대 26글자까지 입력 가능합니다.");
    }
  };

  content.onkeyup = () => {
    if (title.value.length > 0 && content.value.length > 0) {
      upload.style.backgroundColor = "#7F6AEE";
    } else {
      upload.style.backgroundColor = "#ACA0EB";
    }
  };
});

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

  let title = document.getElementsByClassName("mod-titleint")[0];
  let content = document.getElementsByClassName("mod-conint")[0];

  let modify = document.getElementsByClassName("modify-button")[0];
  let back = document.getElementsByClassName("profile-box")[0];

  //현재 페이지 url의 쿼리스트링을 가져옴.(?부터)
  let queryString = window.location.search;
  // console.log(queryString);

  // 쿼리 문자열을 분석하여 객체로 변환
  let params = new URLSearchParams(queryString);
  // console.log(params);

  // 특정 매개변수의 값을 가져오기
  let post = params.get("post"); // 콘텐츠아이디 값

  //뒤로가기
  back.onclick = () => {
    window.location.href = `/post/detail?post=${post}`;
  };

  (async function () {
    // 로그인 유저 정보 가져오기
    const user = await fetchUserInfo();
    if (!user || !user.user_num) {
      alert("로그인 해주세요.");
      window.location.href = "/";
      return;
    }

    const loginUser = user.user_num;

    //수정할 게시글 불러오기
    fetch(`http://localhost:8080/api/post/${post}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const dbPost = data.post;
          title.value = dbPost.title; // 인풋박스의 value 속성 값 변경
          content.innerHTML = dbPost.text; // innerHTML을 value로 변경함
          const postWriter = dbPost.user_num;

          // 로그인 유저와 콘텐츠 작성 유저가 같을 시에만 수정 가능
          if (loginUser == postWriter) {
            console.log("작성자: ", postWriter);
            console.log("로그인 유저: ", loginUser);

            //게시글 수정하기 버튼
            modify.onclick = () => {
              console.log("게시글id>>>>> ", post);
              let modifyContent = {
                id: post,
                title: title.value,
                text: content.value,
                user_num: loginUser,
              };
              if (title.value.length !== 0 && content.value.length !== 0) {
                fetch(`http://localhost:8080/api/post/modify/${post}`, {
                  method: "P",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(modifyContent),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.status == "SUCCESS") {
                      alert("게시글 수정이 완료되었습니다.");
                      window.location.href = `/post/detail?post=${post}`;
                    } else {
                      throw new Error("게시글 수정이 실패되었습니다.");
                    }
                  })
                  .catch((error) => {
                    console.error("게시글 수정 중 오류가 발생했습니다.", error);
                    alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
                  });
              } else {
                alert("제목 및 내용을 모두 입력하세요.");
              }
            };
          } else {
            alert("수정 권한이 없습니다.");
            window.location.href = `/post/detail?post=${post}`;
          }
        } else {
          alert("해당 게시글을 찾을 수 없습니다.");
          window.location.href = `/post/list`;
        }
      })
      .catch((error) => console.error("Fetch 오류:", error));

    content.onkeyup = function () {
      if (title.value.length > 0 && content.value.length > 0) {
        modify.style.backgroundColor = "#7F6AEE";
      } else {
        modify.style.backgroundColor = "#ACA0EB";
      }
    };
  })();

  title.onkeyup = () => {
    if (title.value.length < 27) {
      console.log("게시글 제목 입력");
      if (title.value.length > 0 && content.value.length > 0) {
        modify.style.backgroundColor = "#7F6AEE";
      } else {
        modify.style.backgroundColor = "#ACA0EB";
      }
    } else {
      console.log("입력 글자 수 초과(최대 26글자)");
      alert("제목은 최대 26글자까지 입력 가능합니다.");
    }
  };
});

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

  // 상단 로그인 유저 프로필 이미지
  const loginProfile = document
    .getElementsByClassName("header-box")[1]
    .querySelector("img");

  let title = document.getElementsByClassName("text-box")[0];
  let content = document.getElementsByClassName("text-box")[1];

  let picture = document
    .getElementsByClassName("image-container")[0]
    .querySelector("img");
  const iris = document.getElementById("iris");
  const shutterSpeed = document.getElementById("shutterSpeed");
  const iso = document.getElementById("iso");

  let update = document.getElementsByClassName("button")[0];
  let back = document.getElementsByClassName("left")[0];

  // URL에서 마지막 경로 세그먼트 가져오기 (게시글 아이디)
  const pathSegments = window.location.pathname.split("/");
  const post = pathSegments[pathSegments.length - 1];

  //뒤로가기
  back.onclick = () => {
    window.location.href = `/post/${post}`;
  };

  // 조리개 유효성 검사 (숫자와 마침표만 입력 가능)
  function validateIris(input) {
    const regex = /^(?!0)([1-9][0-9]*)(\.[0-9]*[1-9])?$/;
    return regex.test(input);
  }

  // 셔터스피드 유효성 검사 (숫자와 /만 가능)
  function validateShutterSpeed(input) {
    const regex = /^(1\/([2-9]|[1-9][0-9]*0)|[1-9][0-9]*)$/;
    return regex.test(input); // true, false 반환
  }

  // iso 유효성 검사 (두 자리 수 이상이며, 마지막은 반드시 0)
  function validateISO(input) {
    const regex = /^[1-9][0-9]*0$/;
    return regex.test(input);
  }

  (async function () {
    // 로그인 유저 정보 가져오기
    const user = await fetchUserInfo();
    if (!user || !user.user_id) {
      alert("로그인 해주세요.");
      window.location.href = "/";
      return;
    }

    const loginUser = user.user_id;

    // 상단 로그인 유저 프로필 사진 표시하기
    if (user.profile_url) {
      loginProfile.src = user.profile_url;
    }

    //수정할 게시글 불러오기
    fetchWithAuth(`http://localhost:8080/api/post/${post}`, "GET")
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const dbPost = data.post;
          title.value = dbPost.title; // 인풋박스의 value 속성 값 변경
          content.innerHTML = dbPost.text; // innerHTML을 value로 변경함
          picture.src = dbPost.imgUrl; // 게시물 이미지
          iris.value = dbPost.iris;
          shutterSpeed.value = dbPost.shutterSpeed;
          iso.value = dbPost.iso;

          const postWriter = dbPost.userId;

          // 로그인 유저와 콘텐츠 작성 유저가 같을 시에만 수정 가능
          if (loginUser == postWriter) {
            //게시글 수정하기 버튼
            update.onclick = async () => {
              console.log("게시글id>>>>> ", post);
              let updatePost = new FormData();
              updatePost.append(
                "request",
                JSON.stringify({
                  id: post,
                  title: title.value,
                  text: content.value,
                  userId: loginUser,
                })
              );

              // Iris 추가
              if (iris.value) {
                if (!validateIris(iris.value)) {
                  alert("조리개 값이 올바르지 않습니다.");
                  return;
                }
                updatePost.append("iris", iris.value);
              } else {
                updatePost.append("iris", "");
              }

              // ShutterSpeed 추가
              if (shutterSpeed.value) {
                if (!validateShutterSpeed(shutterSpeed.value)) {
                  alert("셔터스피드 값이 올바르지 않습니다.");
                  return;
                }
                updatePost.append("shutterSpeed", shutterSpeed.value);
              } else {
                updatePost.append("shutterSpeed", "");
              }

              // ISO 추가
              if (iso.value) {
                if (!validateISO(iso.value)) {
                  alert("ISO 값이 올바르지 않습니다.");
                  return;
                }
                updatePost.append("iso", iso.value);
              } else {
                updatePost.append("iso", "");
              }

              console.log("Iris:", iris.value);
              console.log("ShutterSpeed:", shutterSpeed.value);
              console.log("ISO:", iso.value);
              console.log("수정된 내용: ", updatePost);
              for (let pair of updatePost.entries()) {
                console.log(pair[0], pair[1]);
              }

              // TODO: 사진 메타데이터 값이 append 되지 않아 수정이 안 되고 있음 -> 수정 필요

              if (title.value.length !== 0 && content.value.length !== 0) {
                try {
                  const response = await fetchWithAuth(
                    `http://localhost:8080/api/post/${post}`,
                    "PATCH",
                    updatePost
                  );

                  const resData = await response.json();

                  if (resData.status == "SUCCESS") {
                    alert("게시글 수정이 완료되었습니다.");
                    window.location.href = `/post/${post}`;
                  } else {
                    throw new Error("게시글 수정에 실패했습니다.");
                  }
                } catch (error) {
                  console.error("게시글 수정 중 오류가 발생했습니다.", error);
                  alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
                }
              } else {
                alert("제목 및 내용을 모두 입력하세요.");
              }
            };
          } else {
            alert("수정 권한이 없습니다.");
            window.location.href = `/post/${post}`;
          }
        } else {
          alert("해당 게시글을 찾을 수 없습니다.");
          window.location.href = `/post/list`;
        }
      })
      .catch((error) => console.error("Fetch 오류:", error));

    content.onkeyup = function () {
      if (title.value.length > 0 && content.value.length > 0) {
        update.style.backgroundColor = "#ff5c5c";
      } else {
        update.style.backgroundColor = "#ff9191";
      }
    };
  })();

  title.onkeyup = () => {
    if (title.value.length < 27) {
      console.log("게시글 제목 입력");
      if (title.value.length > 0 && content.value.length > 0) {
        update.style.backgroundColor = "#7F6AEE";
      } else {
        update.style.backgroundColor = "#ff9191";
      }
    } else {
      console.log("입력 글자 수 초과(최대 26글자)");
      alert("제목은 최대 26글자까지 입력 가능합니다.");
    }
  };

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

  // 이미지를 포함한 게시글 업로드 fetch 함수
  async function fetchWithImg(url, method, body = null) {
    const token = localStorage.getItem("jwt"); // JWT를 localStorage에서 가져옴
    const headers = {};

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    headers["Authorization"] = `${token}`; // Authorization 헤더에 JWT 추가

    const options = {
      method: method,
      headers: headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    };

    return fetch(url, options);
  }
});

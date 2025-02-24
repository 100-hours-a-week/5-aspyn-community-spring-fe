document.addEventListener("DOMContentLoaded", async () => {
  async function getConfig() {
    const response = await fetch("/config");
    const config = await response.json();
    return config.API_URL;
  }

  const API_URL = await getConfig();

  // 로그인 유저 확인
  async function fetchUserInfo() {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/userinfo`, "GET");

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

  // 뒤로가기 버튼
  let back = document.getElementsByClassName("header-box")[0];
  back.onclick = () => (window.location.href = `/post/list`);

  // 로그인 유저 정보 가져오기
  const user = await fetchUserInfo();
  const loginUser = user.user_id;

  // 로그인 유저 프로필
  const loginProfile = document.getElementById("login-profile");
  loginProfile.src = user.profile_url;

  const title = document.getElementsByClassName("text-box")[0];
  const content = document.getElementsByClassName("text-box")[1];
  const imageButton = document.getElementsByClassName("image-button")[0];
  const imageInput = document.getElementById("upload-image"); // 이미지 파일 입력 요소
  const upload = document.getElementsByClassName("button")[0]; // 게시글 등록 버튼

  const iris = document.getElementById("iris");
  const shutterSpeed = document.getElementById("shutterSpeed");
  const iso = document.getElementById("iso");

  // 이미지 [파일선택] 버튼 클릭
  imageButton.addEventListener("click", function () {
    imageInput.click();
  });

  // 파일 선택 시 미리보기 업데이트
  imageInput.addEventListener("change", previewImage);

  function previewImage(event) {
    const file = event.target.files[0];

    const previewContainer =
      document.getElementsByClassName("image-container")[0];
    const previewImage = document.getElementsByClassName("preview")[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewContainer.style.display = "block"; // 미리보기 컨테이너 표시
      };

      reader.readAsDataURL(file);
      imageButton.classList.remove("before");
      imageButton.classList.add("after");
    } else {
      console.log("파일이 선택되지 않았습니다."); // 파일이 선택되지 않은 경우 확인
      previewContainer.style.display = "none";
      previewImage.src = "";
    }
  }

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

  // 게시글 업로드 버튼 클릭
  upload.onclick = async () => {
    if (loginUser == null) {
      alert("비회원은 게시글 작성이 불가합니다. 로그인 해주세요.");
    } else {
      // imageInput이 존재하고 files 속성이 있는지 확인
      if (imageInput && imageInput.files) {
        const files = imageInput.files;
        // 파일 처리 로직
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
        let newPost = {
          title: title.value,
          text: content.value,
          userId: loginUser,
        };

        // 조리개, 셔터스피드, ISO 값 검증 및 추가
        if (iris.value) {
          if (!validateIris(iris.value)) {
            alert("조리개 값이 올바르지 않습니다.");
            return;
          }
          newPost.iris = iris.value;
        }

        // ShutterSpeed 추가
        if (shutterSpeed.value) {
          if (!validateShutterSpeed(shutterSpeed.value)) {
            alert("셔터스피드 값이 올바르지 않습니다.");
            return;
          }
          newPost.shutterSpeed = shutterSpeed.value;
        }

        // ISO 추가
        if (iso.value) {
          if (!validateISO(iso.value)) {
            alert("ISO 값이 올바르지 않습니다.");
            return;
          }
          newPost.iso = iso.value;
        }

        let request = new FormData();
        request.append("request", JSON.stringify(newPost)); // JSON 문자열로 변환
        request.append("file", imageInput.files[0]); // 이미지 파일 추가

        try {
          const response = await fetchWithImg(
            `${API_URL}/api/post/edit`,
            "POST",
            request
          );

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

  // 게시글 내용 작성
  content.onkeyup = () => {
    if (title.value.length > 0 && content.value.length > 0) {
      upload.style.backgroundColor = "#ff4c3b";
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

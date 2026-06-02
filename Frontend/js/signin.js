/*

// 로컬스토리지 데이터 생성
localStorage.setItem("x-access-token", "dummy token");

// 로컬스토리지 데이터 조회
console.log( localStorage.getItem("x-access-token") );

// 로컬스토리지 데이터 삭제
localStorage.removeItem("x-access-token");

*/


// 토큰 검사 (로그인이 되어있으면 페이지에 못들어오게 막음)
const token = localStorage.getItem("x-access-token");

if (token) {
    alert("로그아웃 후에 이용해주세요.");
    location.href = "index.html";
}



// 토큰 생성

const buttonSignin = document.getElementById("signin");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

buttonSignin.addEventListener("click", signin);


// 로그인 처리 함수
async function signin(event) {
    const currentEmail = inputEmail.value;
    const currentPassword = inputPassword.value;

    if (!currentEmail || !currentPassword) {
        return false;
    }

    // Logic API 요청 (axios)
    const config = {
        method: "post",
        url: url + "/sign-in",
        data: {
            email: currentEmail,
            password: currentPassword,
        },
    };

    // await 함수로 axios 받기 위해 async function 씀
    try {
        const res = await axios(config);

        if (res.data.code !== 200) {
            alert(res.data.message);
            return false;
        }

        localStorage.setItem("x-access-token", res.data.result.token);
        alert(res.data.message);

        // 원래 창으로 되돌리기
        location.href = "index.html";

        return true;
    }
    catch (err) {
        console.error(err);
    }
}
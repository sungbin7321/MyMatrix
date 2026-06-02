setHeader();

async function setHeader() {
    // Localstorage token 검사
    const token = localStorage.getItem("x-access-token");

    // Token 없으면 div.signed 에 hidden class, 있으면 unsigned 에 hidden
    if (!token) {
        const signed = document.querySelector(".signed");
        //add hidden
        signed.classList.add("hidden");
        return;
    }

    // Token 검증
    const config = {
        method: "get",
        url: url + "/jwt",
        headers: {
            "x-access-token": token
        }
    };
    
    const res = await axios(config);

    if (res.data.code !== 200) {
        console.log("잘못된 토큰입니다.");
        return;
    }


    // 검증 성공
    const nickname = res.data.result.nickname;
    const spanNickname = document.querySelector("span.nickname");
    
    // Tag 안의 글자 바꾸기 (Tag 안에 HTML 넣으려면 innerHTML)
    spanNickname.innerText = nickname;

    const unsigned = document.querySelector(".unsigned");
    unsigned.classList.add("hidden");
}


// Logout 기능
const buttonSignout = document.getElementById("sign-out");
buttonSignout.addEventListener("click", signout);

function signout() {
    localStorage.removeItem("x-access-token");
    location.reload();
}
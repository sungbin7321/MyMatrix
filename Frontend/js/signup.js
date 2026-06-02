// 토큰 검사 (로그인이 되어있으면 페이지에 못들어오게 막음)
const token = localStorage.getItem("x-access-token");

if (token) {
    alert("로그아웃 후에 이용해주세요.");
    location.href = "index.html";
}




// 입력값 유효성 검사


// Email
const inputEmail = document.getElementById("email");
const emailMessage = document.querySelector("div.email-message")

inputEmail.addEventListener("input", isValidEmail);

// Password
const inputPassword = document.getElementById("password");
const passwordMessage = document.querySelector("div.password-message");

inputPassword.addEventListener("input", isValidPassword);

// Password confirm
const inputPasswordConfirm = document.getElementById("password-confirm");
const passwordConfirmMessage = document.querySelector("div.password-confirm-message");

inputPasswordConfirm.addEventListener("input", isValidPasswordConfirm);

// Nickname
const inputNickname = document.getElementById("nickname");
const nicknameMessage = document.querySelector("div.nickname-message");

inputNickname.addEventListener("input", isValidNickname);



// 이메일 형식 검사
// (.value -> input 같은 사용자가 데이터 입력 가능한 폼 요소 속성에서 사용 가능, 입력값 반환)
function isValidEmail(event) {
    const currentEmail = inputEmail.value;

    // TEST PRINT
    // console.log(currentEmail);

    const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

    if (!emailReg.test(currentEmail) && currentEmail.length != 0) {
        emailMessage.style.visibility = "visible"
        return false;
    }

    emailMessage.style.visibility = "hidden"
    return true;
}

// 비밀번호 형식 검사
function isValidPassword(event) {
    const currentPassword = inputPassword.value;

    const passwordReg = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/;

    // 취약점? (0글자면 true?)
    if (!passwordReg.test(currentPassword) && currentPassword.length != 0) {
        passwordMessage.style.visibility = "visible";
        return false;
    }

    passwordMessage.style.visibility = "hidden";
    return true;
}

// 비밀번호 확인 검사
function isValidPasswordConfirm(event) {
    const currentPassword = inputPassword.value;
    const currentPasswordConfirm = inputPasswordConfirm.value;

    if (currentPassword != currentPasswordConfirm) {
        passwordConfirmMessage.style.visibility = "visible";
        return false;
    }

    passwordConfirmMessage.style.visibility = "hidden";
    return true;
}

// 닉네임 검사
function isValidNickname(event) {
    const currentNickname = inputNickname.value;

    //console.log(inputNickname);
    
    if (currentNickname.length < 2 || currentNickname.length > 10) {
        nicknameMessage.style.visibility = "visible";
        return false;
    }

    nicknameMessage.style.visibility = "hidden";
    return true;

}



// ######### 회원가입 API 요청
const buttonSignup = document.getElementById("signup");
buttonSignup.addEventListener("click", signup);

async function signup(event) {
    const isValidReq = isValidEmail() && isValidNickname() && isValidPassword() && isValidPasswordConfirm();
    if (!isValidReq) {
        alert("회원 정보를 확인해주세요.");
        return false;
    }
    
    const currentEmail = inputEmail.value;
    const currentPassword = inputPassword.value;
    const currentNickname = inputNickname.value;

    // Axios
    const config = {
        method: "post",
        // HTML에서 common.js를 signup.js 위에 위치하게 했음.
        url: url + "/user",
        data: {
            email: currentEmail,
            password: currentPassword,
            nickname: currentNickname,
        },
    }

    try {
        const res = await axios(config);
        // console.log(res);

        // 회원가입 실패
        if (res.data.code === 400) {
            alert(res.data.message);

            // 새로 고침
            // location.reload();

            return false;
        }
        
        if (res.data.code === 200) {
            alert(res.data.message);

            // 페이지 이동
            location.href = "./signin.html";
            return true;
        }
    }
    catch (err) {
        console.error(err);
    }
    


}
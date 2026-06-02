const userdao = require("../dao/userdao");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../../secret");

exports.signup = async function (req, res) {
    // 보통 회원가입 정보는 POST의 body에서 꺼내옴
    const { email, password, nickname } = req.body;

    // console.log(req.body);
    // console.log(nickname);

    // Validation
    if (!email || !password || !nickname) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "회원가입 입력 값을 확인해주세요."
        });
    }

    // Email Validation
    const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (!isValidEmail.test(email)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "이메일 형식을 확인해주세요."
        });
    }

    // Password Validation (영문, 숫자 조합 8자 이상, 20자 이하)
    const isValidPassword = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/;
    if (!isValidPassword.test(password)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "비밀번호 형식을 확인해주세요."
        });
    }

    // Nickname Validation (2글자 이상 10글자 이하)
    if (nickname.length < 2 || nickname.length > 10) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "닉네임 형식을 확인해주세요."
        });
    }


    // 중복 회원 방지
    const isDuplicatedEmail = await userdao.selectUserByEmail(email);

    // 하나라도 있으면 중복
    if (isDuplicatedEmail.length > 0) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "이미 가입된 회원입니다."
        });
    }


    // DB 입력
    const insertUserRow = await userdao.insertUser(email, password, nickname);


    
    if (!insertUserRow) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "회원가입 실패, 관리자에게 문의해주세요."
        });
    }


    // 요청 성공
    return res.send({
        isSuccess: true,
        code: 200,
        message: "회원가입 성공"
    });

};


exports.signin = async function (req, res) {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "회원정보를 입력해주세요."
        });
    }

    // 회원여부 검사
    const isValidUser = await userdao.selectUser(email, password);
    
    if (!isValidUser) {
        // Query error or DB error
        return res.send({
            isSuccess: false,
            code: 400,
            message: "DB 에러, 담당자에게 문의해주세요."
        });
    }

    if (isValidUser.length < 1) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "존재하지 않는 회원입니다."
        });
    }


    // jwt 토큰 발급
    const [userInfo] = isValidUser; // 원래 isValidUser는 하나여야함. test할 때 중복 ID 대비
    const userIdx = userInfo.userIdx;

    const token = jwt.sign(
        // Payload(userIdx), secretkey
        {userIdx: userIdx},
        jwtSecret
    );

    
    // 요청 성공
    return res.send({
        result: {token: token}, //Payload 담는 필드
        isSuccess: true,
        code: 200,
        message: "로그인 성공"
    });
};


exports.getNicknameByToken = async function (req, res) {
    const {userIdx} = req.verifiedToken;
    
    const [userInfo] = await userdao.selectNicknameByUserIdx(userIdx);
    const nickname = userInfo.nickname;

    return res.send({
        result: {nickname: nickname},
        isSuccess: true,
        code: 200,
        message: "토큰 검증 성공"
    });
};
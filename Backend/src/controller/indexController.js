const indexdao = require("../dao/indexdao");


// 1. Create
exports.createTodo = async function (req, res) {

    //const { userIdx, contents, type } = req.body;

    // userIdx를 token으로 대체, body 요청에 contents, type만 보내면 됨. (Login이 되어있으니까)
    const { userIdx } = req.verifiedToken;
    const { contents, type } = req.body;

    // Validation
    if (!userIdx || !contents || !type) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "입력값 누락"
        });
    }

    // (userIdx는 토큰으로 처리)
    // Contents 20글자 초과 불가
    if (contents.length > 20) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "Content는 20글자 이하로 설정해주세요."
        });
    }

    // Type: do, decide, delete, delegate
    const validTypes = ["do", "decide", "delete", "delegate"];
    if (!validTypes.includes(type)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "유효한 타입이 아닙니다."
        });
    }


    // Promise 반환할 경우, await 쓸 수 있음.
    // async function -> 항상 promise 객체 반환
    const insertTodoRow = await indexdao.insertTodo(userIdx, contents, type);


    // 나머지 에러, Logic이 잘못되었을때
    if (!insertTodoRow) {
        return res.send({
            isSuccess: false,
            code: 403,
            message: "요청에 실패했습니다. 관리자에게 문의해주세요."
        });
    }


    // 요청 성공
    return res.send({
        isSuccess: true,
        code: 200,
        message: "일정 생성 성공."
    });
};




// 2. Read
// params -> URL에 있는 경로 변수 파싱
exports.readTodo = async function (req, res) {
    const { userIdx } = req.verifiedToken;

    const todos = {};
    const types = ["do", "decide", "delete", "delegate"];

    for (let type of types) {
        let selectTodoByTypeRows = await indexdao.selectTodoByType(userIdx, type);

        // Logic 실패
        if (!selectTodoByTypeRows) {
            return res.send({
                isSuccess: false,
                code: 400,
                message: "일정 조회 실패. 관리자에게 문의해주세요."
            });
        }

        todos[type] = selectTodoByTypeRows;
    }


    // Express는 응답할 때 JSON 형식
    // return res.send(todos);

    // 요청 성공
    return res.send({
        result: todos,
        isSuccess: true,
        code: 200,
        message: "일정 조회 성공."
    });
}



// 3. Update
exports.updateTodo = async function (req, res) {
    // userIdx, todoIdx 는 필수 값
    // contents, status 는 optional
    const { userIdx } = req.verifiedToken;
    let { todoIdx, contents, status } = req.body;


    // Validation
    if (!userIdx || !todoIdx) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "userIdx, todoIdx를 보내주세요."
        });
    }

    if (!contents) {
        contents = null;
    }

    if (!status) {
        status = null;
    }


    // 유효성 검증 (userIdx, todoIdx 가 DB에 존재하는가)
    const isValidTodoRow = await indexdao.selectValidTodo(userIdx, todoIdx);

    // 유효할 경우에는 DB에서 값이 나와야 함
    if (isValidTodoRow.length < 1) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "유효한 요청이 아닙니다. userIdx, todoIdx를 확인하세요."
        });
    }



    // Update Query
    const updateTodoRow = await indexdao.updateTodo(userIdx, todoIdx, contents, status);


    // Logic 실패
    if (!updateTodoRow) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "수정 실패, 관리자에게 문의해주세요."
        });
    }


    // 요청 성공
    return res.send({
        isSuccess: true,
        code: 200,
        message: "일정 수정 성공."
    });
};


// 4. Delete
exports.deleteTodo = async function (req, res) {
    const { userIdx } = req.verifiedToken;
    const { todoIdx } = req.params;

    // Validation
    if (!userIdx || !todoIdx) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "userIdx, todoIdx를 입력해주세요."
        });
    }

    // 유효성 검사
    const isValidTodoRow = await indexdao.selectValidTodo(userIdx, todoIdx);

    // 유효할 경우에는 DB에서 값이 나와야 함
    if (isValidTodoRow.length < 1) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "유효한 요청이 아닙니다. userIdx, todoIdx를 확인하세요."
        });
    }


    //
    const deleteTodoRow = await indexdao.deleteTodo(userIdx, todoIdx);

    // Logic 실패
    if (!deleteTodoRow) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "삭제 실패, 관리자에게 문의해주세요."
        });
    }


    // 요청 성공
    return res.send({
        isSuccess: true,
        code: 200,
        message: "일정 삭제 성공."
    });
}
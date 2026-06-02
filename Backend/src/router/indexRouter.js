const indexController = require("../controller/indexController");

// 회원 token 검증
const { jwtMiddleware } = require("../../jwtMiddleware");

// Router 저장
exports.indexRouter = function (app) {
    // 일정 CRUD API

    // 1. Create
    app.post("/todo", jwtMiddleware, indexController.createTodo);
    
    // 2. Read
    // /user/1/todos 형식으로 전달 (Login 없는 버전)
    //app.get("/user/:userIdx/todos", indexController.readTodo);

    // Login 있는 버전
    app.get("/todos", jwtMiddleware, indexController.readTodo);

    // 3. Update
    app.patch("/todo", jwtMiddleware, indexController.updateTodo);

    // 4. Delete
    // delete 할 때는 body 비권장 (REST API 원칙), Query String이나 path variable 사용

    // /user/1/todo/1/ (Login 없는 버전)
    //app.delete("/user/:userIdx/todo/:todoIdx", indexController.deleteTodo);

    // Login 있는 버전
    app.delete("/todo/:todoIdx", jwtMiddleware, indexController.deleteTodo);


    /*
    회원 전용으로 만드려면, (jwtMiddleware, next 함수 이용)
    app.post("/todo", jwtMiddleware, indexController.createTodo);
    */
};
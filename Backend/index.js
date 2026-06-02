// 외부 모듈
const { indexRouter } = require("./src/router/indexRouter");
const { userRouter } = require("./src/router/userRouter");



// 미들웨어
const compression = require("compression");
const cors = require("cors");

// Express
const express = require("express");
const app = express();
const port = 3000;


/* Express 미들웨어 설정 */

// cors 설정
app.use(cors());

// packet body json 파싱
app.use(express.json());

// HTTP 요청 압축
app.use(compression());



// Router 분리
indexRouter(app);
userRouter(app);






// 서버 실행 (반드시 맨 아래에)
app.listen(port, () => {
    console.log(`Server Running on... express port: ${port}`);
});
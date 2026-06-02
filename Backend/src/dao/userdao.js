const { pool } = require("../../database");

exports.insertUser = async function (email, password, nickname) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            //Query
            const insertUserQuery = "INSERT INTO users (email, password, nickname) VALUES (?, ?, ?); "
            const insertUserParams = [email, password, nickname];

            // Query 실행
            const [row] = await connection.query(insertUserQuery, insertUserParams);

            // SQL 실행 결과 데이터
            return row;
        }
        catch (err) {
            console.error("insertUser QUERY ERROR");
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error("insertUser DB ERROR");
        return false;
    }
};

exports.selectUserByEmail = async function (email) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            //Query
            const selectUserByEmailQuery = "SELECT * FROM users WHERE email = ?; "
            const selectUserByEmailParams = [email];

            // Query 실행
            const [row] = await connection.query(selectUserByEmailQuery, selectUserByEmailParams);

            // SQL 실행 결과 데이터
            return row;
        }
        catch (err) {
            console.error("selectUserByEmail QUERY ERROR");
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error("selectUserByEmail DB ERROR");
        return false;
    }
};

exports.selectUser = async function (email, password) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            //Query
            const selectUserQuery = "SELECT * FROM users WHERE email = ? AND password = ?; "
            const selectUserParams = [email, password];

            // Query 실행
            const [row] = await connection.query(selectUserQuery, selectUserParams);

            // SQL 실행 결과 데이터
            return row;
        }
        catch (err) {
            console.error("selectUser QUERY ERROR");
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error("selectUser DB ERROR");
        return false;
    }
};

exports.selectNicknameByUserIdx = async function (userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            //Query
            const selectNicknameByUserIdxQuery = "SELECT * FROM users WHERE userIdx = ?; "
            const selectNicknameByUserIdxParams = [userIdx];

            // Query 실행
            const [row] = await connection.query(selectNicknameByUserIdxQuery, selectNicknameByUserIdxParams);

            // SQL 실행 결과 데이터
            return row;
        }
        catch (err) {
            console.error("selectNicknameByUserIdx QUERY ERROR");
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error("selectNicknameByUserIdx DB ERROR");
        return false;
    }
}
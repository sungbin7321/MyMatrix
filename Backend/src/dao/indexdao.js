// Data accessing object
const e = require("express");
const { pool } = require("../../database");

exports.getUserRows = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            //Query
            const selectUserQuery = "SELECT * FROM member;"

            // Query 실행
            const [row] = await connection.query(selectUserQuery);

            // SQL 실행 결과 데이터
            return row;
        }
        catch (err) {
            console.error("getUserRows QUERY ERROR");
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error("getUserRows DB ERROR");
        return false;
    }
}

// 1. Create
exports.insertTodo = async function (userIdx, contents, type) {
    try {
        // DB 연결 검사
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            //Query
            const insertTodoQuery = "INSERT INTO Todos (userIdx, contents, type) VALUES (?, ?, ?);";
            
            const insertTodoParams = [userIdx, contents, type];

            const [row] = await connection.query(insertTodoQuery, insertTodoParams);

            return row;
        }
        catch (err) {
            console.error(`insertTodo QUERY ERROR, \n ${err}`);
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error(`insertTodo DB ERROR \n ${err}`);
        return false;
    }
}


// 2. Read
exports.selectTodoByType = async function (userIdx, type) {
    try {
        // DB 연결 검사
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            //Query
            const selectTodoByTypeQuery =
            "SELECT todoIdx, contents, status FROM Todos WHERE userIdx = ? AND type = ? AND NOT (status = 'D') ; " ;
            
            const selectTodoByTypeParams = [userIdx, type];

            const [row] = await connection.query(selectTodoByTypeQuery, selectTodoByTypeParams);

            return row;
        }
        catch (err) {
            console.error(`selectTodoByType QUERY ERROR, \n ${err}`);
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error(`selectTodoByType DB ERROR \n ${err}`);
        return false;
    }
};




// Validation (before update, delete)
exports.selectValidTodo = async function(userIdx, todoIdx) {
    try {
        // DB 연결 검사
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            // Query
            // 존재하지 않으면 NULL (D일 경우에도 SELECT X)
            const selectValidTodoQuery =
            " SELECT * FROM Todos WHERE userIdx = ? AND todoIdx = ? AND NOT (status = 'D'); " ;
            
            const selectValidTodoParams = [userIdx, todoIdx];

            const [row] = await connection.query(selectValidTodoQuery, selectValidTodoParams);

            return row;
        }
        catch (err) {
            console.error(`selectValidTodo QUERY ERROR, \n ${err}`);
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error(`selectValidTodo DB ERROR \n ${err}`);
        return false;
    }
}





// 3. Update
exports.updateTodo = async function (userIdx, todoIdx, contents, status) {
    try {
        // DB 연결 검사
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            // Query
            const updateTodoQuery =
            " UPDATE Todos SET contents = ifnull(?, contents) , status = ifnull(?, status) WHERE userIdx = ? AND todoIdx = ?; " ;
            
            const updateTodoParams = [contents, status, userIdx, todoIdx];

            const [row] = await connection.query(updateTodoQuery, updateTodoParams);

            return row;
        }
        catch (err) {
            console.error(`updateTodo QUERY ERROR, \n ${err}`);
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error(`updateTodo DB ERROR \n ${err}`);
        return false;
    }
};



// 4. Delete
exports.deleteTodo =  async function(userIdx, todoIdx) {
    try {
        // DB 연결 검사
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            // Query
            const deleteTodoQuery =
            " UPDATE Todos SET status = 'D' WHERE userIdx = ? AND todoIdx = ?; " ;
            
            const deleteTodoParams = [userIdx, todoIdx];

            const [row] = await connection.query(deleteTodoQuery, deleteTodoParams);

            return row;
        }
        catch (err) {
            console.error(`deleteTodo QUERY ERROR, \n ${err}`);
            return false;
        }
        finally {
            connection.release(); //Query 끝나면 해야함, 아니면 충돌 일어남
        }
    }
    catch (err) {
        console.error(`deleteTodo DB ERROR \n ${err}`);
        return false;
    }
};
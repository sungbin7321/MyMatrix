// Todo 조회 함수 (화면 조회)
readTodo();

async function readTodo() {
    // Token 없으면 return
    const token = localStorage.getItem("x-access-token");
    if (!token) {
        return;
    }

    // 일정 조회 API 호출
    const config = {
        method: "get",
        url: url + "/todos",
        headers: { "x-access-token": token },
    };

    try {
        // axios 요청해야해서 async function
        const res = await axios(config);
        if (res.data.code !== 200) {
            alert(res.data.message);
            return false;
        }

        // 조회 성공
        const todoDataSet = res.data.result;
        //console.log(todoDataSet);

        for (let section in todoDataSet) {
            // console.log(section);

            // 각 Section의 ul tag 선택
            const sectionUl = document.querySelector(`#${section} ul`);

            // 각 Section에 해당하는 data
            const arrayForEachSection = todoDataSet[section];
            //console.log(arrayForEachSection);

            let result = ""
            for (let todo of arrayForEachSection) {
                // HTML 넣기
                // <input type="checkbox" checked> 하면 체크된 상태임.
                let element = `
                    <li class="list-item" id=${todo.todoIdx}>
                        <div class="done-text-container">
                            <input type="checkbox" class="todo-done" ${todo.status === 'C' ? "checked": ""}>
                                <p class="todo-text">${todo.contents}</p>
                        </div>
                        <!-- done-text-container -->

                        <div class="update-delete-container">
                            <i class="todo-update fa-solid fa-pencil"></i>
                            <i class="todo-delete fa-solid fa-trash"></i>
                        </div>
                        <!-- update-delete-container -->
                    </li>
                    <!-- list-item -->
                `

                result += element;
            }

            sectionUl.innerHTML = result;
        }
    }
    catch (err) {
        console.error(err);
    }
}




// CUD

// Event Propagation 이용
const matrixContainer = document.querySelector(".matrix-container");
matrixContainer.addEventListener("keypress", cudConctroller);
matrixContainer.addEventListener("click", cudConctroller);



function cudConctroller(event) {
    // token 검사 (회원만 사용가능)
    const token = localStorage.getItem("x-access-token");
    if (!token) {
        return;
    }

    const target = event.target; // id: matrix-input
    const targetTagName = target.tagName; // tag 이름
    const eventType = event.type;
    const key = event.key;

    

    // Create
    if (targetTagName === "INPUT" && key === "Enter") {
        createTodo(event, token);
        return;
    }

    
    // Update
    // Checkbox
    if (target.className === "todo-done" && eventType === "click") {
        updateTodoDone(event, token);
        return;
    }
    // Pencil (contents update)
    const firstClassName = target.className.split(" ")[0]; // Class 이름들이 모두 반환되기 때문에
    if (firstClassName === "todo-update" && eventType === "click") {
        updateTodoContents(event, token);
        return;
    }


    // Delete
    if (firstClassName === "todo-delete" && eventType === "click") {
        deleteTodo(event, token);
        return;
    }




    // Event Check debug
    // Click 하면 class 이름 나옴
    // console.log(target.className);
    // console.log(target, targetTagName, eventType, key);
}


// Create
async function createTodo(event, token) {
    const contents = event.target.value; // input 안에 있는 값 선택
    const type = event.target.closest(".matrix-item").id; // 가장 가까운 부모, 조상의 이름을 찾음.

    // console.log(contents, type);

    if (!contents) {
        alert("내용을 입력해주세요.");
        return false;
    }

    // 일정 생성 API 호출
    const config = {
        method: "post",
        url: url + "/todo",
        headers: {"x-access-token": token},
        data: {
            contents: contents,
            type: type,
        },
    };

    try {
        const res = await axios(config);   
        
        // 동일한 패턴
        if (res.data.code !== 200) {
            alert(res.data.message);
            return false;
        }

        // DOM update
        readTodo();

        // input 비우기
        event.target.value = "";
        return true;
    }
    catch(err) {
        console.error(err);
        return false;
    }
}



// Update
// todo-done
async function updateTodoDone (event, token) {
    const status = event.target.checked ? "C" : "A";
    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method: "patch",
        url: url + "/todo",
        headers: {"x-access-token": token},
        data: {
            status: status,
            todoIdx: todoIdx,
        },
    };

    try {
        const res = await axios(config);

        if (res.data.code !== 200) {
            alert(res.data.message);
            return false;
        }

        // DOM update
        readTodo();
    }
    catch (err) {
        console.error(err);
    }
}

// todo-update
async function updateTodoContents(event, token) {
    const contents = prompt("내용을 입력해주세요.");
    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method: "patch",
        url: url + "/todo",
        headers: {"x-access-token": token},
        data: {
            contents: contents,
            todoIdx: todoIdx,
        },
    };

    try {
        const res = await axios(config);

        if (res.data.code !== 200) {
            alert(res.data.message);
            return false;
        }

        // DOM update
        readTodo();
    }
    catch (err) {
        console.error(err);
    }
}

// Delete
async function deleteTodo(event, token) {
    const todoIdx = event.target.closest(".list-item").id;

    // Confirm message
    const isValidReq = confirm("삭제하시겠습니까? 삭제 후에는 복구가 어렵습니다.");

    if (!isValidReq) {
        return false;
    }


    const config = {
        method: "delete",
        url: url + "/todo/" + todoIdx,
        headers: {"x-access-token": token},
    };

    console.log(config.url);

    try {
        const res = await axios(config);

        if (res.data.code !== 200) {
            alert(res.data.message);
            return false;
        }

        // DOM update
        readTodo();
    }
    catch (err) {
        console.error(err);
    }
}
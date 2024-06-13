import express from 'express';
import Todo from "../schemas/todo.schema.js";
import joi from "joi";

const router = express.Router();

// 1. `value` 데이터는 **필수적으로 존재**해야한다.
// 2. `value` 데이터는 **문자열 타입**이어야한다.
// 3. `value` 데이터는 **최소 1글자 이상**이어야한다.
// 4. `value` 데이터는 **최대 50글자 이하**여야한다.
// 5. 유효성 검사에 실패했을 때, 에러가 발생해야한다.
const createdTodoSchema = joi.object({
  value: joi.string().min(1).max(50).required(),
});

// 할 일 등록 api
router.post("/todos", async (req, res, next) => {
  // 1. 클라이언트로부터 받아온 value 데이터를 가져온다
  try {
    const validation = await createdTodoSchem46a.validateAsync(req.body);

    const { value } = validation;

    // 1-5. 클라이언트가 value 데이터를 전달하지 않았을 때, 클라이언트에게 에러 메시지 전달
    if (!value) {
      return res
        .status(400)
        .json({ errorMessage: "해야 할 일 데이터가 존재하지 않습니다." });
    }

    // 2. 해당하는 마지막 order 데이터를 조회한다
    // findOne = 1개의 데이터만 조회
    // sort = 정렬
    const todoMaxOrder = await Todo.findOne().sort("-order").exec();

    // 3. 만약 존재한다면 현재 해야 할 일을 +1 하고, order 데이터가 존재하지 않다면 1로 할당한다
    const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

    // 4. 해야 햘 일 등록
    const todo = new Todo({ value, order });
    await todo.save();

    // 5. 해야 할 일을 클라이언트에게 반환
    return res.status(201).json({ todo: todo });
  } catch (error) {
    next(error);
    // router 다음에 있는 에러처리 미들웨어를 실행하는 코드
  }
});

// 해야 할 일 목록 조회 api
router.get("/todos", async (req, res, next) => {
  // 1. 해야 할 일 목록 조회 진행
  const todos = await Todo.find().sort("-order").exec();

  // 2. 해야 할 일 목록 조회 결과를 클라이언트에게 반환
  return res.status(201).json({ todos });
});

// 해야 할 일 순서 변경, 완료 / 해제, 내용 변경 api

router.patch("/todos/:todoId", async (req, res, next) => {
  const { todoId } = req.params;
  const { order, done, value } = req.body;

  // 현재 나의 order가 무엇인지 알아야 함
  const currentTodo = await Todo.findById(todoId).exec();
  if (!currentTodo) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 해야 할 일입니다." });
  }

  if (order) {
    const targetTodo = await Todo.findOne({ order: order }).exec();
    if (targetTodo) {
      targetTodo.order = currentTodo.order;
      await targetTodo.save();
    }

    currentTodo.order = order;
  }

  if (done !== undefined) {
    currentTodo.doneAt = done ? new Date() : null;
  }

  if (value) {
    currentTodo.value = value;
  }

  await currentTodo.save();

  return res.status(200).json({});
});

// 할 일 삭제 api
router.delete("/todos/:todoId", async (req, res, next) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId).exec();
  if (!todo) {
    return res.status(404).json({ errorMessage: "존재하지 않는 할 일입니다." });
  }
  await Todo.deleteOne({ _id: todoId });

  return res.status(200).json({});
});

export default router;

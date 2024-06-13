export default (error, req, res, next) => {
  console.error(error); // 콘솔에 에러를 먼저 찍고
  console.log("에러처리 미들웨어가 실행되었습니다.");
  if (error.name === "ValidationError") {
    return res.status(400).json({ errorMessage: error.message }); // 예상한 에러면 에러 메시지 출력
  }

  return res
    .status(500)
    .json({ errorMessage: "서버에서 에러가 발생했습니다." }); // 예상하지 못한 에러면 서버 에러 메시지 출력
};

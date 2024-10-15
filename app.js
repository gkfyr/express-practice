const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

// MongoDB Atlas 연결 설정 (연결 문자열을 자신의 것으로 변경)
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas에 성공적으로 연결되었습니다.");
  })
  .catch((error) => {
    console.error("MongoDB Atlas 연결 오류:", error);
  });

// 요청 본문 파싱을 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 데이터 스키마 정의
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// 모델 생성
const User = mongoose.model("User", UserSchema);

// 사용자 데이터를 저장하는 API
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ message: "유저 정보가 저장되었습니다.", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "유저 정보 저장 중 오류가 발생했습니다." });
  }
});

// 저장된 사용자 데이터를 조회하는 API
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "유저 정보 조회 중 오류가 발생했습니다." });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

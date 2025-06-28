const express = require('express');
const cors = require('cors');
const {connectDB} = require('./DB_Config');
const {authRouter} = require('./routes/authentication.routes');
const {userRouter} = require('./routes/user.routes');
const {authorRouter} = require('./routes/author.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/authors", authorRouter)

app.listen(8080, () => {
    connectDB();
    console.log("Server is running on port http://localhost:8080");
})
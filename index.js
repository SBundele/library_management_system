const express = require('express');
const {connectDB} = require('./DB_Config');
const {authRouter} = require('./routes/authentication.routes');
const {userRouter} = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(8080, () => {
    connectDB();
    console.log("Server is running on port http://localhost:8080");
})
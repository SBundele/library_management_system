const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        mongoose.connect(process.env.DB_BASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}


module.exports = {connectDB};
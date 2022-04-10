const express = require("express");
const { connectDB } = require("./utils/database");

const app = express();

connectDB();


app.get('/', (req, res) => {
	res.send('API Running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`);
});
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "8080", 10);

app.use(cors());
app.use(express.json());

app.get("/api/v1/test", (req, res) => {
	res.json({ message: "Hello from the backend! :)" });
});

try {
	app.listen(PORT, () => {
		console.log(`Backend server running on http://localhost:${PORT}`);
	});
} catch (error) {
	console.error(`Error occurred: ${error.message}`);
}

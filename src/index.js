import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import multer from "multer";
import methodOverride from "method-override";
import crypto from "crypto";
const app = express();

const MONGO_URI = "mongodb://localhost:27017/uploadFiles";
const conn = mongoose.createConnection(MONGO_URI);

app.use(cors());
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));

let gfs;
conn.once("open", () => {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection("uploads");
});
const storage = new GridFsStorage({
	url: MONGO_URI,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) return reject(err);

				const filename = buf.toString("hex") + path.extname(file.originalname);
				const fileInfo = { filename: filename, bucketName: "uploads" };
				resolve(fileInfo);
			});
		});
	},
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
	res.end();
});

app.listen(8080, () => {
	console.log(`server is up and runing on port ${8080}`);
});

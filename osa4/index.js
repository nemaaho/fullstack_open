const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

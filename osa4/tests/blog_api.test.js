const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
});

test("bloglist is returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are 4 blogs", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, 4);
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "React patterns 2",
    author: "Michael Chan",
    url: "https://reactpatterns2.com/",
    likes: 17,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

  const addedBlog = response.body.find(
    (blog) => blog.title === "React patterns 2"
  );
  assert(addedBlog, "New blog was not added");
  assert.strictEqual(addedBlog.author, "Michael Chan");
  assert.strictEqual(addedBlog.url, "https://reactpatterns2.com/");
  assert.strictEqual(addedBlog.likes, 17);
});

test("blogs have an id field instead of _id", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});

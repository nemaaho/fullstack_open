const Blog = ({ blog, user, deleteBlog }) => {
  const showDeleteButton = user.username && blog.user.username === user.username

  return (
    <div>
      <h3>
        {blog.title} by {blog.author}
      </h3>
      <p>{blog.url}</p>
      {showDeleteButton && (
        <button onClick={() => deleteBlog(blog.id, blog.title)}>remove</button>
      )}
    </div>
  )
}

export default Blog



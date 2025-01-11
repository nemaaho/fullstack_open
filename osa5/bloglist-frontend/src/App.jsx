import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs)
    })
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(
          `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
        )
        setTimeout(() => setErrorMessage(null), 5000)
      })
      .catch((error) => {
        setErrorMessage('Error creating a blog')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const deleteBlog = (id, title) => {
    const confirmDelete = window.confirm(`Remove blog "${title}"?`)
    if (!confirmDelete) return

    blogService
      .deleteBlog(id)
      .then(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
        setErrorMessage(`Blog "${title}" removed successfully`)
        setTimeout(() => setErrorMessage(null), 5000)
      })
      .catch((error) => {
        setErrorMessage('Error removing the blog')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const toggleImportanceOf = (id) => {
    const blog = blogs.find((n) => n.id === id)
    const changedBlog = { ...blog }

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      })
      .catch((error) => {
        setErrorMessage(
          `Blog '${blog.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username)

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <input value={newBlog} onChange={handleBlogChange} />
      <button type="submit">save</button>
    </form>
  )

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <div>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>logout</button>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          </div>

          <h2>Blog list</h2>
          <ul>
            {blogs.map((blog, i) => (
              <Blog key={i} blog={blog} user={user} deleteBlog={deleteBlog} toggleImportance={() => toggleImportanceOf(blog.id)} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App

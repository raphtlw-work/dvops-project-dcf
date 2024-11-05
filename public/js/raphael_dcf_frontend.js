const MAIN_VIEW = "home"

window.onload = () => {
  showView(MAIN_VIEW)

  document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    // Regular expression for a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.")
      return false
    }

    // Password validation
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.")
      return false
    }

    // Regular expression to check for at least one uppercase letter, lowercase letter, digit, and special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      )
      return false
    }

    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Login Success!')
        showView('game')
      } else {
        console.log(data.error)
        alert('Error submitting form')
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('Error submitting form.')
    })
  });

  document.getElementById('register-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('register-username').value
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value
    const confirmPassword = document.getElementById('register-confirm-password').value

    // Username validation: At least 3 characters and alphanumeric
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/
    if (!usernameRegex.test(username)) {
      alert(
        "Username must be at least 3 characters long and contain only letters and numbers.",
      )
      return false
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.")
      return false
    }

    // Password length and complexity validation
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.")
      return false
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      )
      return false
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please re-enter.")
      return false
    }

    fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Account created! Please login.')
        showView('login')
      } else {
        console.log(data.error)
        alert('Error submitting form')
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('Error submitting form.')
    })
  });
}

let viewStack = [MAIN_VIEW]

function pushView(name) {
  viewStack.push(name)

  const viewName = viewStack.pop()

  showView(viewName)
}

function popView() {
  const viewName = viewStack.pop()

  showView(viewName)
}

function showView(viewName) {
  document.querySelectorAll("main").forEach((el) => el.classList.add("hidden"))
  document.getElementById(`view-${viewName}`).classList.remove("hidden")

  if (viewName !== MAIN_VIEW) {
    document
      .querySelector("#back-navigation .back-btn")
      .classList.remove("hidden")
  } else {
    viewStack = [MAIN_VIEW]
    document.querySelector("#back-navigation .back-btn").classList.add("hidden")
  }
}

const SECONDS = 1000
const LIVERELOAD_INTERVAL = 0.5 * SECONDS
const livereload = setInterval(() => {
  fetch("/livereload")
    .then((res) => res.json())
    .then((data) => {
      if (data.reload) {
        window.location.reload()
      }
    })
}, LIVERELOAD_INTERVAL)

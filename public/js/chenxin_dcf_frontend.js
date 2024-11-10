function fetchUserProfile(token) {
    fetch("/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("profile-username").textContent = data.username
          document.getElementById("profile-email").textContent = data.email
        } else {
          console.log(data.error)
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error)
      })
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
  function editProfile() {
    const usernameElement = document.getElementById("profile-username");
    const emailElement = document.getElementById("profile-email");
  
    const currentUsername = usernameElement.textContent;
    const currentEmail = emailElement.textContent;
  
    usernameElement.innerHTML = `<input type="text" id="edit-username" value="${currentUsername}" />`;
    emailElement.innerHTML = `<input type="email" id="edit-email" value="${currentEmail}" />`;
  
    const editButton = document.querySelector("#view-profile button");
    editButton.textContent = "Save";
    editButton.onclick = saveProfile;
  }
  
  function saveProfile() {
    const newUsername = document.getElementById("edit-username").value;
    const newEmail = document.getElementById("edit-email").value;
  
    const token = window.localStorage.getItem("authToken");
  
    fetch("/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: newUsername,
        email: newEmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("profile-username").textContent = data.username;
          document.getElementById("profile-email").textContent = data.email;
  
          const editButton = document.querySelector("#view-profile button");
          editButton.textContent = "Edit";
          editButton.onclick = editProfile;
        } else {
          console.log(data.error);
          alert("Error updating profile.");
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Error updating profile.");
      });
  }
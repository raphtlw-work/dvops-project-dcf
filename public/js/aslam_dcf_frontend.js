document.addEventListener("DOMContentLoaded", async function () {
    const balanceElement = document.getElementById("userbalance")
    balanceElement.innerText = "loading..."

    try {
      const response = await fetch("/user/balance", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        balanceElement.innerText = `Error: ${errorData.error}`
        return
      }

      const data = await response.json()
      balanceElement.innerText = data.balance
    } catch (error) {
      console.error("Error fetching balance:", error)
      balanceElement.innerText = "Failed to fetch balance. Please try again."
    }
  })

  async function flipCoin() {
    const choice = document.querySelector('input[name="choice"]:checked')?.value
    if (!choice) {
      alert("Please select Heads or Tails.")
      return
    }
  
    const resultElement = document.getElementById("result")
    const balanceElement = document.getElementById("userbalance")
    const flipAnimation = document.getElementById("flip-animation")
  
    resultElement.textContent = ""
    flipAnimation.style.display = "block"
  
    try {
      const response = await fetch("http://localhost:3001/coinflip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ choice }),
      })
  
      // Check for network-related errors
      if (!response.ok) {
        flipAnimation.style.display = "none"
  
        // Handling different response status codes
        if (response.status === 403) {
          console.error("Authorization error: Invalid or missing token.")
          resultElement.textContent = "Authorization error. Please log in again."
        } else if (response.status === 404) {
          console.error("User not found or endpoint doesn't exist.")
          resultElement.textContent = "User not found. Please contact support."
        } else if (response.status === 400) {
          const errorData = await response.json()
          if (errorData.error === "Insufficient balance") {
            console.error("Error: Insufficient balance.")
            resultElement.textContent = "You have insufficient balance to play."
          } else {
            console.error("Bad request:", errorData.error)
            resultElement.textContent = `Error: ${errorData.error}`
          }
        } else {
          console.error("Unexpected error:", response.status)
          resultElement.textContent = "An unexpected error occurred. Please try again later."
        }
        return
      }
  
      // If response is OK, process the result
      const result = await response.json()
      flipAnimation.style.display = "none"
      resultElement.textContent = result.message
      balanceElement.textContent = result.balance
    } catch (error) {
      // Handling network failures or unexpected errors
      flipAnimation.style.display = "none"
      console.error("Network error or unexpected failure:", error)
      resultElement.textContent = "Network error or unexpected issue. Please try again."
    } finally {
      flipAnimation.style.display = "none"
    }
  }
  
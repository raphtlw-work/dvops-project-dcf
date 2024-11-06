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

function earnCredits() {
  let currentBalance =
    parseInt(document.getElementById("userbalance").textContent) || 0

  currentBalance += 1

  document.getElementById("userbalance").textContent = currentBalance

  const token = window.localStorage.getItem("authToken")

  fetch(`/ocean/balance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      balance: currentBalance,
    }),
  })
    .then(async (response) => {
      if (response.ok) {
        const body = await response.json()
        console.log("Balance updated successfully.")
        document.getElementById("user-balance").innerText = body.balance
      } else {
        console.error("Failed to update balance.")
      }
    })
    .catch((error) => {
      console.error("Error updating balance:", error)
    })
}

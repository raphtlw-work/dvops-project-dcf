document.addEventListener("DOMContentLoaded", async function () {
  const balanceElement = document.getElementById("userbalance");
  balanceElement.innerText = "loading...";

  try {
    const response = await fetch("/user/balance", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      balanceElement.innerText = `Error: ${errorData.error}`;
      return;
    }

    const data = await response.json();
    balanceElement.innerText = data.balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    balanceElement.innerText = "Failed to fetch balance. Please try again.";
  }
});

function earnCredits() {
  let currentBalance =
    parseInt(document.getElementById("userbalance").textContent) || 0;

  currentBalance += 1;

  document.getElementById("userbalance").textContent = currentBalance;

  const userId = 123; // Example user ID, replace with actual logic to get the logged-in user ID

  fetch(`/balance?userId=${userId}&newBalance=${currentBalance}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      balance: currentBalance,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Balance updated successfully.");
      } else {
        console.error("Failed to update balance.");
      }
    })
    .catch((error) => {
      console.error("Error updating balance:", error);
    });
}

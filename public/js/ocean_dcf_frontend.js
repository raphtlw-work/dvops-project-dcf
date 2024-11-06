window.onload = async() => {
    const userId = 123;  // Replace with actual userId (or dynamically get it)
    const balanceElement = document.getElementById('userbalance');

    // Show loading state initially
    balanceElement.innerText = 'loading...';

    try {
      // Fetch balance from the backend
      const response = await fetch(`/ocean/balance?userId=${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        balanceElement.innerText = `Error: ${errorData.error}`;
        return;
      }

      // If the request is successful, update the balance
      const data = await response.json();
      balanceElement.innerText = `$${data.balance.toFixed(2)}`;
    } catch (error) {
      // Handle any network or server errors
      console.error('Error fetching balance:', error);
      balanceElement.innerText = 'Failed to fetch balance. Please try again.';
    }
}

function earnCredits() {
  // Get the current user balance from the DOM
  let currentBalance = parseInt(document.getElementById('userbalance').textContent) || 0;

  // Simulate adding 1 credit on the frontend
  currentBalance += 1;

  // Update the UI with the new balance
  document.getElementById('userbalance').textContent = currentBalance;

  // Get the user ID (you need to make sure the user ID is available on the client side, 
  // either via a global variable or session info)
  const userId = 123; // Example user ID, replace with actual logic to get the logged-in user ID

  // Send the updated balance to the backend to persist it in the database
  fetch(`/balance?userId=${userId}&newBalance=${currentBalance}`, {
    method: 'POST', // Use POST to update data
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      balance: currentBalance,
    }),
  })
  .then(response => {
    if (response.ok) {
      console.log("Balance updated successfully.");
    } else {
      console.error("Failed to update balance.");
    }
  })
  .catch(error => {
    console.error("Error updating balance:", error);
  });
}

// Simulate initial user balance (this would be fetched from an API in a real app)
document.addEventListener("DOMContentLoaded", function() {
  const initialBalance = 69; // Fetch this from your server
  document.getElementById('userbalance').textContent = initialBalance;
});

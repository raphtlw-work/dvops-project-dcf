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


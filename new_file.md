# CRUD Functionality Documentation

| Function Name | User Interaction | Inputs | Actions | Expected Outputs |
|---------------|------------------|--------|---------|------------------|
| Register User | User fills out registration form and submits | Username, Email, Password | Validates input, creates new user record in database | Success message, user account created |
| Login User | User fills out login form and submits | Email, Password | Validates credentials, generates JWT token | Success message, JWT token returned |
| Fetch User Profile | User navigates to profile page | JWT token | Verifies token, retrieves user data from database | User profile data displayed |
| Edit User Profile | User edits profile information and submits | JWT token, New Username, New Email | Verifies token, updates user data in database | Success message, updated profile data |
| Credit Machine Balance (READ) | User navigates to balance page | JWT token | Verifies token, retrieves user balance from database | User balance displayed |
| Update User Balance | User earns credits or plays game | JWT token, New Balance | Verifies token, updates user balance in database | Success message, updated balance |
| Coin Flip Game | User selects heads or tails and initiates game | JWT token, User Choice (heads/tails) | Verifies token, simulates coin flip, updates balance based on result | Game result message, updated balance |
| Record Game Result | Internal process after game completion | User ID, Game Result, Amount | Records game result in database | Confirmation of game result recorded |

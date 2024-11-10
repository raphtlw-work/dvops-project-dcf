# CRUD Functionality Documentation

| Function Name | User Interaction | Inputs | Actions | Expected Outputs |
|---------------|------------------|--------|---------|------------------|
| Register User (CREATE) | User fills out registration form and submits | Username, Email, Password | Validates input, creates new user record in database | Success message, user account created |
| Login User (READ) | User fills out login form and submits | Email, Password | Validates credentials, generates JWT token | Success message, JWT token returned |
| Fetch User Profile (READ) | User navigates to profile page | JWT token | Verifies token, retrieves user data from database | User profile data displayed |
| Edit User Profile (UPDATE) | User edits profile information and submits | JWT token, New Username, New Email | Verifies token, updates user data in database | Success message, updated profile data |
| Credit Machine Balance (READ) | User navigates to balance page | JWT token | Verifies token, retrieves user balance from database | User balance displayed |
| Update User Balance (UPDATE) | User earns credits or plays game | JWT token, New Balance | Verifies token, updates user balance in database | Success message, updated balance |
| Coin Flip Game (UPDATE) | User selects heads or tails and initiates game | JWT token, User Choice (heads/tails) | Verifies token, simulates coin flip, updates balance based on result | Game result message, updated balance |
| Record Game Result (CREATE) | Internal process after game completion | User ID, Game Result, Amount | Records game result in database | Confirmation of game result recorded |

```tsv
Function Name	Register User (CREATE)
User Interaction	User fills out a registration form and submits it.
Inputs	Username, Email, Password
Actions	Validates input and creates a new user record in the database.
Expected Outputs	Displays a success message, user account created successfully.

Function Name	Login User (READ)
User Interaction	User fills out the login form and submits it.
Inputs	Email, Password
Actions	Validates user credentials, generates JWT token if valid.
Expected Outputs	Displays a success message and returns the JWT token.

Function Name	Fetch User Profile (READ)
User Interaction	User navigates to their profile page.
Inputs	JWT token
Actions	Verifies the JWT token, retrieves user data from the database.
Expected Outputs	User profile data is displayed on the screen.

Function Name	Edit User Profile (UPDATE)
User Interaction	User updates their profile information and submits the changes.
Inputs	JWT token, New Username, New Email
Actions	Verifies the JWT token, updates user data in the database.
Expected Outputs	Displays a success message, and the updated profile data is shown.

Function Name	Credit Machine Balance (READ)
User Interaction	User navigates to the credit machine balance page.
Inputs	JWT token
Actions	Verifies the JWT token, retrieves user balance from the database.
Expected Outputs	The user’s credit balance is displayed.

Function Name	Update User Balance (UPDATE)
User Interaction	User earns credits through activities or gameplay.
Inputs	JWT token, New Balance
Actions	Verifies the JWT token, updates the user balance in the database.
Expected Outputs	Displays a success message, and the updated balance is shown.

Function Name	Coin Flip Game (UPDATE)
User Interaction	User selects heads or tails and initiates the game.
Inputs	JWT token, User Choice (heads/tails)
Actions	Verifies the JWT token, simulates a coin flip, updates user balance based on the game result.
Expected Outputs	Displays the game result and the updated user balance.

Function Name	Record Game Result (CREATE)
User Interaction	Internal process triggered after game completion.
Inputs	User ID, Game Result, Amount
Actions	Records the game result in the database.
Expected Outputs	Confirms that the game result has been successfully recorded.
```

---

| Function Name | Register User (CREATE) |
|---------------|------------------------|
| **User Interaction** | User fills out a registration form and submits it. |
| **Inputs** | Username, Email, Password |
| **Actions** | Validates input and creates a new user record in the database. |
| **Expected Outputs** | Displays a success message, user account created successfully. |

---

| Function Name | Login User (READ) |
|---------------|-------------------|
| **User Interaction** | User fills out the login form and submits it. |
| **Inputs** | Email, Password |
| **Actions** | Validates user credentials, generates JWT token if valid. |
| **Expected Outputs** | Displays a success message and returns the JWT token. |

---

| Function Name | Fetch User Profile (READ) |
|---------------|---------------------------|
| **User Interaction** | User navigates to their profile page. |
| **Inputs** | JWT token |
| **Actions** | Verifies the JWT token, retrieves user data from the database. |
| **Expected Outputs** | User profile data is displayed on the screen. |

---

| Function Name | Edit User Profile (UPDATE) |
|---------------|----------------------------|
| **User Interaction** | User updates their profile information and submits the changes. |
| **Inputs** | JWT token, New Username, New Email |
| **Actions** | Verifies the JWT token, updates user data in the database. |
| **Expected Outputs** | Displays a success message, and the updated profile data is shown. |

---

| Function Name | Credit Machine Balance (READ) |
|---------------|-------------------------------|
| **User Interaction** | User navigates to the credit machine balance page. |
| **Inputs** | JWT token |
| **Actions** | Verifies the JWT token, retrieves user balance from the database. |
| **Expected Outputs** | The user's credit balance is displayed. |

---

| Function Name | Update User Balance (UPDATE) |
|---------------|------------------------------|
| **User Interaction** | User earns credits through activities or gameplay. |
| **Inputs** | JWT token, New Balance |
| **Actions** | Verifies the JWT token, updates the user balance in the database. |
| **Expected Outputs** | Displays a success message, and the updated balance is shown. |

---

| Function Name | Coin Flip Game (UPDATE) |
|---------------|-------------------------|
| **User Interaction** | User selects heads or tails and initiates the game. |
| **Inputs** | JWT token, User Choice (heads/tails) |
| **Actions** | Verifies the JWT token, simulates a coin flip, updates user balance based on the game result. |
| **Expected Outputs** | Displays the game result and the updated user balance. |

---

| Function Name | Record Game Result (CREATE) |
|---------------|-----------------------------|
| **User Interaction** | Internal process triggered after game completion. |
| **Inputs** | User ID, Game Result, Amount |
| **Actions** | Records the game result in the database. |
| **Expected Outputs** | Confirms that the game result has been successfully recorded. |

---

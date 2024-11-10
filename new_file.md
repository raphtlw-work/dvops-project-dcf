# Project Documentation

## Overview

This project is a web-based Coin Flip Game where users can register, log in, and play a coin flip game to earn or lose credits. The application is built using a combination of TypeScript, JavaScript, and HTML/CSS, with a backend powered by Express.js and a PostgreSQL database managed through Drizzle ORM.

## Website Functionality

1. **User Registration and Login**: Users can create an account by providing a username, email, and password. They can then log in to access the game and their profile.

2. **Profile Management**: Users can view and edit their profile information, including their username and email.

3. **Coin Flip Game**: Users can participate in a coin flip game where they choose heads or tails. If they win, their balance doubles; if they lose, their balance is reset to zero.

4. **Credit Machine**: Users can earn credits by interacting with a credit machine feature on the website.

5. **Balance Management**: Users can view their current balance and it gets updated based on their game results and interactions with the credit machine.

## Team Contributions

### Aslam
- **Backend Development**: Implemented the `/coinflip` route in `aslam_dcf_backend.ts` to handle the coin flip game logic, including balance updates and game result recording.

### Chenxin
- **Profile Management**: Developed the `/user/profile` routes in `chenxin_dcf_backend.ts` for fetching and updating user profile information.
- **Frontend Integration**: Created `chenxin_dcf_frontend.js` to handle profile fetching and editing on the client side.

### Ocean
- **Balance Management**: Implemented the `/user/balance` route in `ocean_dcf_backend.ts` to update user balances.
- **Frontend Integration**: Developed `ocean_dcf_frontend.js` to manage balance display and updates on the client side.

### Raphael
- **Frontend Development**: Created `raphael_dcf_frontend.js` to handle user authentication, balance fetching, and view management.
- **Backend Integration**: Developed the `/flip` route in `raphael_dcf_backend.ts` to manage the coin flip game logic and balance updates.

## Website Workflow

1. **User Registration**: Users sign up by providing their details, which are validated and stored in the database.

2. **Login**: Users log in using their credentials, receiving a JWT token for authentication.

3. **Profile Access**: Users can view and edit their profile information, which is fetched and updated through secure API calls.

4. **Playing the Game**: Users select heads or tails and initiate a coin flip. The result is determined server-side, and the user's balance is updated accordingly.

5. **Earning Credits**: Users can interact with the credit machine to earn additional credits, which are updated in real-time.

6. **Balance Management**: Users can view their current balance at any time, with updates reflecting their game results and credit earnings.

This documentation provides a comprehensive overview of the project's functionality and the contributions of each team member. The website offers a seamless user experience, integrating various features to engage users in a fun and interactive way.

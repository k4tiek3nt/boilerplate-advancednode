# boilerplate-advancednode
A boilerplate for the freeCodeCamp curriculum referenced in 'Advanced Node/Express Introduction'.


Advanced Node and Express

Now it's time to take a deep dive into Node.js and Express.js by building a chat application with a sign-in system.

To implement the sign-in system safely, you'll need to learn about authentication. This is the act of verifying the identity of a person or process.

In this course, you'll learn how to use Passport to manage authentication, Pug to create reusable templates for quickly building the front end, and web sockets for real-time communication between the clients and server.

Project URL/URI: https://boilerplate-advancednode.k4tiek3nt.repl.co/

Commits:

Set up a Template Engine

Updated server.js to set view (template) engine to pug and render the index.pug file.

Use a Template Engine's Powers

Updated server.js to set the title and message on index.pug page.

Set up Passport

Updated replit "Secrets" (padlock icon) to set hash for cookie. Tried adding to sample.env file, also tried adding new .env file called process.env, but replit would not access the info.

This had to be added to allow the variable to be accessed:
//added to provide SESSION_SECRET variable
const mySecret = process.env.SESSION_SECRET;

Updated server.js to setup passport

Serialization of a User Object

Updated server.js to connect to MongoDB, encrypt session, and decrypt session. These things can only properly happen when valid credentials are provided (even if they are only for a test account).

Implement the Serialization of a Passport User

Updated replit "Secrets" (padlock icon) to set MONGO_URI, which is the database connection. Updated server.js to test connection and implement the newly created MongoDB with new Passport User.

Authentication Strategies

Updated server.js to include authentication strategy.

How to Use Passport Strategies

Updated server.js to show login form and accept a login and authenticate it.

Create New Middleware

Updated server.js to include new middleware that confirms user trying to login is authenticated / is a valid user.

Corrected Middleware Implementation

Corrected app.route('/profile') to properly implement middleware, removed incorrect duplicate.

How to Put a Profile Together

Updated server.js for app.route('/profile') to include the welcome message based on the authenticated user. Updated profile.pug to include a welcome message based on logged in user and a link for logging out, only available when a valid user is logged in.

Logging a User Out

Updated server.js to include app.route('/logout') to handle logging out a user (unauthentication process) and added middleware to handle 404 errors (page not found).

Registration of New Users

Updated server.js to include app.route('/register') which replaces the old app.route('/login'). This process accepts user info, queries database, and if is not found adds the user to the database.

Hashing Your Passwords

Updated server.js to hash the user password and handle if hashed password doesn't match expected password. This is designed to work seamlessly with the existing serializing and deserializing process.

Clean Up Your Project with Modules

Updated server.js to separate out two modules - routes (routes.js) and authorization (auth.js).

Implementation of Social Authentication

Updated routes.js to implement OAuth with GitHub.

Implementation of Social Authentication

Updated routes.js to implement OAuth with GitHub. (Corrected to be inside the module instead of below. This was causing an error with being able to route for GitHub).

Implementation of Social Authentication II

Updated auth.js to have GitHub Authentication. Updated spacing on routes.js.

Implementation of Social Authentication II

Removed 'dotenv' as my setup uses the secrets env instead of the env file.

Implementation of Social Authentication II

Updated order of auth.js to have serialize and deserialize before the two authentication types (local and GitHub) instead of after.

Implementation of Social Authentication II

Updated spacing on auth.js.

Implementation of Social Authentication II

Rearranged auth.js

Implementation of Social Authentication II

Replaced process.env.GITHUB_REDIRECT_URI with 'https://boilerplate-advancednode.k4tiek3nt.repl.co/auth/github/callback'

Note: This change is what made the tests pass. Previously was failing "GitHub strategy should be setup correctly thus far."

Implementation of Social Authentication III

Updated auth.js to include Database logic with callback inside GitHub Authentication Strategy

Set up the Environment

Updated routes.js to set GitHub user id based on session and redirect to chat instead of profile. Updated server.js to include a socket to listen for connections to server. Updated client.js to initialize socket to listen for connections to server.

Note: PORT was not updated in server.js at this point, but should have been. See "Announce New Users" for the update that should have happened here to port.

Communicate by Emitting

Updated client.js to count connections/users. Updated server.js to define the logic for counting connections/users and moved app initialization above http initialization because it uses app.

Handle a Disconnect

Updated server.js to handle a disconnect, previously it only counted the number of connections. Now it counts the connections and removes one when a user disconnects.

Authentication with Socket.IO

Updated server.js to allow for Authentication with Socket.IO.

Authentication with Socket.IO

Added missing comma on cookie: { secure: false }.

Announce New Users

Updated client.js to announce new users connecting or disconnecting and listing the count of users. Updated server.js to announce new users connecting or disconnecting and listing count of users. Also updated PORT in server.js as it should have been done back in "Set up the Environment." This change doesn't impact what info is shown, just how it's accessed, which is why it didn't fail the previous tests.

Send and Display Chat Messages

Updated server.js and client.js to Send and Display Chat Messages. Updated index.pug to not display the success message of loading the pug page and connection to database. This last part was just clean up to make main page look more professional.




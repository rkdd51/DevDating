# DevDating APIs

## authRouter
- POST API - Signup
- POST API - Login
- POST API - Logout

## profileRouter
- GET API - Profile/view
- PATCH API - Profile/edit
- PATCH API - Profile/password

## connectionRequestRouter
- POST API - request/send/interested/:userID
- POST API - request/send/ignored/:userID
- POST API - request/review/accepted/:requestedID
- POST API - request/review/rejected/:requestedID

## userRouter
- GET API - /user/connections
- GET API - /user/requests
- GET API - /user/feed        - To get the profile of other users on platforms
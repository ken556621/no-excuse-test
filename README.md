# No Excuse


## Features

| Features | Details  | Routes   |
| -------- | -------- | -------- |
| Search   | Date | /account/selectDate |
| Add new list | Date is required | /account/new |
| Edit         |          | /account/edit         | 
| Delete         | Confirm message          |/account/delete          | 
| Chart display         |  Week & Month & Half year        |  /chart/week or month or Half year        |
| Login & Logout     | Facebook login included     | /users/login & /users/logout    |

## Front page

![](https://i.imgur.com/xQiiT1e.png)
![](https://i.imgur.com/9fM2nCO.png)



## Installation
1. Github clone

    `git clone https://github.com/ken556621/FatherLedger.git`
    
2. Use terminal open file 'myRestaurantList'

     `cd FatherLedger`
     
3. Use terminal add new file name '.env'

    `touch .env`
    
4. Inside the env folder type

    `FACEBOOK_ID=//your client ID`
    `FACEBOOK_SECRET=//your facebook secret`
    `FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback`
    > This is for facebook login secret key
     
5. NPM install

    `npm install`
    
6. NPM run start

    `npm run start`
    
7. Open browser 
    
    `http://localhost:3000`
    
## Testing data

|   User | Email |  password |
| -------- | -------- | -------- |
|  user1        |  user1@example.com        | 12345678         |
|  user2|user2@example.com|12345678

   
## Environment
1. React
2. Redux
> Data base
1. Firebase


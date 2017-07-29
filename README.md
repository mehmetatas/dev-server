# dev-server

When you want to focus on UI design but need persistence for some demo data dev-server may help you.

## How to install and run

Clone the repository or just copy the `server.js` and `package.json` files to your local machine.

    git clone https://github.com/mehmetatas/dev-server.git
    cd dev-server
    npm install
    node server
    
Now your simple rest-like crud service is running at `localhost:8080`

## Usage

dev-server supports POST, GET, PUT and DELETE http verbs.

### POST - Insert

    POST http://localhost:8080/users    
    {
        "name": "mehmet",
        "surname": "atas"
    }
    
This, inserts the request body as a new user entity to the `users` collection.

The id generated for the newly inserted entity will return as `X-Id` parameter of the http response header.

### GET - Search

    GET http://localhost:8080/users?name=mehmet&surname=atas
    
This, searches for the users whose name is "mehmet" **and** surname is "atas" and returns an array. Without any parameters this will return all the users.

    [
        { "id": "17625348342", "name": "mehmet", "surname": "atas" }
    ]

Search works case sensitive and only supports equality.

### PUT - Update

    PUT http://localhost:8080/users/17625348342
    {
        "name": "ali",
        "surname": "atas"
    }

This, updates the user entity with the id "17625348342", using the data in the request body.

Update simply overrides the existing data. For instance, while updating, if you do not re-send surname field inside body, you will see that the surname field is removed after update.

### DELETE - Remove

    DELETE http://localhost:8080/users/17625348342
   
This, removes the user entity with the id "17625348342".

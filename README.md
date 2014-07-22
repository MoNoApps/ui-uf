# Alternative UI For Unfuddle

# Warnings
This app it is not ready for production usage.

Unfuddle API use Basic Authentication then we store your user and password
on a key valye DB.

We create and send to you the key to acckess your credentials it works like a
token system.

This is an Alpha project then we can change any part of this software whitout warnings.

## LevelDB config
Change config.json leveldb key. mongodb key is for future usage.
````json
{
  "mongodb": "mongodb://admin:admin@localhost:270001/",
  "leveldb": "../../data/lebeldb/uf/"
}
````

## Usage
node app.js

## Todos
  1 Delete credentias after certain time.
  2 Remember tasks
  3 Make work schedulle
  4 Ensure stats are fine
  5 Enable persistence with mongodb
  6 Define new reports

## bgfxc4s Discord-Bot

this is a little experiment by me, testing out the Discord.js library.

All you have to do is add an "config.json" file in the "configs" directory.
You need to add a string "prefix" which is gonna used as prefix, a string "ownerID" with your discord ID, a string "token" with the private token of your Discord bot to this config.json and a string named "mongo_url" with the url of your mongo database, or simply rename the "example_config.json" to "config.json" and edit the parameters.
It could look like this:

```
{
    "token":"YourPrivateToken",
    "prefix":"!!",
    "userID":"YourDiscordId",
	"mongo_url": "mongodb://localhost:27017"
}
```

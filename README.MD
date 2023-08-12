# CSCHAT
## Introduction
CSCHAT is an end-to-end encrypted chat platform, provides a secure and easy to use environment for communication. All messages are encrypted at frontend, your messages can only visible for you and the receiver.
### Encryption
Messages are encrypted at the frontend, the encryption is based on RSA, only the public key will be stored on the server and visible for you contacts. Private keys will be generated at sign in.  
The encryption API is using [wwwtyro/cryptico](https://github.com/wwwtyro/cryptico)
## Deployment
- Database
  Database structure: `./db.sql`
  - Import databse  
  This project is developed on MySQL, using PHPMyAdmin to export the database structure. You can use any other database management software to import the database.
  - Database user settings  
  Create a new user or use existing user for CSCHAT, grant SELECT, INSERT, UPDATE and DELETE privileges to that user.  
  Modify `./api/include/dbdetails.php` according to the account.
- Webserver  
  You can choose any webserver which includes PHP, eg. Nginx with PHP or Apache. Put all files under the webserver's web directory and you are good to go.
  - Notice  
  The sign in function uses `SubtleCrypto.digest()`, it requires secure network environment to work. Which means it only works on HTTPS or localhost.  
  Grant read and write access to upload directory  
  Do not put db.sql in your web server.

## Working functions
- Basic functions
  - Sign in
  - Sign out
  - Multidevice sign in
- Account
  - Registration
  - Store/modify basic profile
  - Store/modify avatar
  - Store/modify password
- Contacts
  - Display chat list
- Encryption
  - Encrypt/decrypt messages
  - Encrypt password
- Messages
  - Text messages
  - Emoji
- UI
  - Animation
  - Mobile version compatable
## Todo list
- Basic functions
  - Web page auto jumping
  - Multidevice session management
- Account
  - Store/modify detail profiles
- Contacts
  - Friends requests
  - Display contact list
- Encryption
  - Encrypt/decrypt multimedia messages
- Messages
  - Multimedia (image/audio/video)
- UI
  - Bug fix
## Known Bugs
- Contacts with the same password, system can not distinguish sender and receiver.
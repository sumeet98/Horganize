# About / Horganize



# Installation



# Usage

To run the horganize server, simply clone the github repository into an empty folder.
NPM installed, open up a command prompt in the same folder and run the "npm install" command to install dependencies.
Afterwards you can start the server application running "node index.js" or (if installed) "nodemon index.js".
Make sure a mongo db server is running in the background on the standard port: 27017.
The horganize server will automatically set up an admin account with the following credentials:
Username: "admin@horganize.com"
Password: ADMIN
The admin account will be recreated everytime the server starts up. 
The admin account is also able to call the admin console. Therefore request the URL: "http://[ipadress/localhost]:3000/admin".
This account is not intended for normal use of the program. For normal use, please create a normal account via the user interface. 

The URL "http://[ipadress/localhost]:3000/" is called for opening up the website. On the start page you can register by clicking the register button.
After the registration has been successfully completed, the e-mail address must be confirmed. This can be done by clicking on the link in the delivered email.
The setup starts with the first login. There you can either create a new room or join an existing one. 
Once a room has been assigned, the normal use can be started. The setup is only called if the account is not assigned to a room. 
This happens either at the first start or when the room is actively left. 


# Resources

## References

*****************************************************
* REFERENCES (FOREIGN CODE)
*    Title: cssicon
*    Author: Wenting Zhang
*    Retrieved: 03/21/2019
*    Availability: https://github.com/wentin/cssicon
*    License: CC0 1.0 Universal
*    Used: ../public/styles/dashboard.css (Lines 9-12)
*****************************************************
*    Title: fullCalendar
*    Author: fullCalendar
*    Retrieved: 2019-03-21
*    Availability: https://fullcalendar.io/ 
*    License: 
*    Used: ../public/scripts/calendar.js
*****************************************************

# License

[ISC License] 
(https://www.isc.org/downloads/software-support-policy/isc-license/)






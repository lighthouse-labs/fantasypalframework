# FantasyPal ReadMe
  
  FantasyPal is an app designed to maximize your potential scoring output for your fantasy hockey team! 
  Comparing two teams' schedules from the current date to the end of the year, it will return a number.
  This number will tell you how many days the two teams play on coinciding dates.
  You no longer have to sit that extra player on the bench!

### CONFIGURATION INSTRUCTIONS

  ##### Clone project from github repository git@github.com:NateBainer/FantasyPalFramework.git

  ##### Initialize Repository 
  - GIT INIT

  ##### Install following dependcies
  Make sure you have the following dependencies installed (these versions or newer) with npm install
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.2",
    "cookie-session": "^2.0.0",
    "ejs": "^3.1.7",
    "express": "^4.17.3",
    "method-override": "^3.0.0"
    "sass": "^1.35.1"


### OPERATING INSTRUCTIONS
  When you get to the homepage, register an email and a password.
  Once inside, you will see an empty My Matchups page. In the top part of the webpage, you will see a button: Compare Schedules.
  Click that.
  On this page (Compare Schedules), you will choose two teams and input the current date [YYMMDD].
  Once you submit this information, you will be taken back to My Matchups and you will see the two teams your compared, the date on which you compared their schedules, and the coinciding dates they play on for the rest of the season!  You can use this information to choose between players you want to add to your team, and players you may want to trade away!

### FILE MANIFEST
  FantasyPalFramework
    app.js
    express_server
    package-lock
    package
    README
  views
    partials
      _header
    urls_error
    urls_index
    urls_login
    urls_new
    urls_register
    urls_show

### CONTACT INFORMATION
  Nate Bain
  nate.bain9@gmail.com

### CONTACT INFO FOR LICENSE
  Loopy Lighthouse

### KNOWN BUGS
  Only bug I've seen is when I switched wifi, but did not replicate when switching again.

### CHANGELOG FOR PROGRAMMERS 
  git@github.com:NateBainer/FantasyPalFramework.git

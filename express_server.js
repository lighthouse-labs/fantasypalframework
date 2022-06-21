//requires
const express = require("express");
const bcrypt =require("bcryptjs");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const { generateRandomString, emailCheck, schedForUser } = require('./helpers');
// const sassMiddleware = require("./lib/sass-middleware");



//server info
const app = express();
const PORT = 8080; // default port 8080

// app.use(
//   "/styles",
//   sassMiddleware({
//     source: __dirname + "/styles",
//     destination: __dirname + "/public/styles",
//     isSass: false, // false => scss, true => sass
//   })
// );

//Some consts
const schedDatabase = {};
const users = {
  "userID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple"
  }
}


//app.use lines
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession( {
  name: 'session',
  keys: ['lighthouse'],
  secret: 'this is a secret'
}));
app.set("view engine", "ejs");



//GET CALLS

//get call for login, once logged in redirect to My Matchups page.
app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (user) {
    return res.redirect("/scheds");
  }
  const templateVars = {
    user
  };
  res.render("login", templateVars);
})

//get call for registration. redirects to My Matchups page
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (user) {
    return res.redirect("/scheds");
  }
  const templateVars = {
    user
  };
  res.render('user-registration', templateVars);
})

//get request for home page that redirects user to login page
app.get("/", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID]
  if (user) {
    res.redirect("/scheds");
  }
  if (!user) {
    return res.redirect('/login'); 
  }
});

// error code for user that isnt logged in trying to access Matchups.. 
app.get("/scheds", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    return res.status(401).send("Please login");
  }
  const userDB = schedForUser(userId, schedDatabase);
  const templateVars = {
    user,
    scheds: userDB
  };

  res.render("sched_index", templateVars);
});

app.get("/scheds.json", (req, res) => {
  res.send(schedDatabase);
})

//get request for new user
app.get("/scheds/new", (req, res) => {
  let templateVars = { scheds: schedDatabase, user: users[req.session.user_id] };
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
  res.render('sched_new', templateVars);
  }
});

//get request with for loop that checks for past matchups.. Error code if the matchup does not exist.
app.get("/scheds/:id", (req, res) => {
  let schedForID = {};
  let shortsched = req.params.id;
  for (let user in schedDatabase) {     
    if (schedDatabase[user].userID === req.session.user_id) {       
      schedForID[user] = schedDatabase[user];    
    }
  }
 
  if (schedDatabase[shortsched]) {
    const templateVars = {shortsched: shortsched, longsched: schedDatabase[shortsched].longsched, user: users[req.session["userID"]]};
    res.render("sched_show", templateVars);
  }
  res.send("matchup does not exist!")
  return
});

app.get('/u/:id', (req, res) => {
  const shortsched = req.params.id;
  if (schedDatabase[shortsched]) {
    res.redirect(schedDatabase[shortsched].longsched);
  } else if (!req.session["userID"]) {
    res.status(404).send("<a href='/login'>sched not found.</a>");
  } else {
    res.status(404).send("<a href='/scheds'>sched not found.</a>");
  }
});

//POST CALLS

//post call that checks if email is already registered during registration.. generates encrypted passwords.. error messages if user already exists
app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (email && password) {
    if (!emailCheck(email, users)){
      let userID = generateRandomString();
    users[userID] = {
    id: userID,
    email: email,
    password: bcrypt.hashSync(password, 10)
  }
  req.session.user_id = userID;
  
  res.redirect('/scheds')
    } else {
      res.statusCode = 400;
      res.send('<h2>400 Email already exists. Please try again.</h2>')
    }
  } else {
    res.statusCode = 400;
    res.send('<h2>400 Please try again.</h2>')
  } 
});

// Delete a Matchup in My Matchups
app.post('/scheds/:id/delete', (req, res) => {
  const shortsched = req.params.id;
  if (req.session.user_id === schedDatabase[shortsched].userID) {
    delete schedDatabase[shortsched];
  }
  res.redirect('/scheds');
});

// Post request that requires a login to access Matchups
app.post("/scheds/:id", (req, res) => {
  const shortsched = req.params.id;
  const longsched = req.body.longsched;
  const user = req.session.user_id;

  if (!user) {
    return res.status(401).send("Please login!");
  }
  const userDB = schedForUser(user, schedDatabase);
  if (!userDB[shortsched]) {
    return res.status(401).send("Access Denied!");
  } else {
    schedDatabase[shortsched].longsched = longsched;
    res.redirect("/scheds");
  }
});


//function for email check when logging in that verifies if the email and the password match
app.post("/login", (req,res) => {

  if (!emailCheck(req.body.email, users)) {
    res.statusCode = 403;
    res.send('<h2>403 This email is not registered. Please try again or resgister a new account!</h2>')
  } else {
    let user = emailCheck(req.body.email, users);
    let userPassword = user.password;
    let userID = user.id;
    const comparePassword = bcrypt.compareSync(req.body.password, user.password);
    if (!comparePassword) {
      res.statusCode = 403;
      return res.send('<h2>403 You entered the wrong password, please try again.</h2>')
    } else {
      req.session.user_id = userID;
      res.redirect("/scheds")
    }
  }
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect("/login");
})

//post function that calls generate random string to creat the Matchups
app.post("/scheds", (req, res) => {
  const shortsched = generateRandomString();
  schedDatabase[shortsched] = {
    longsched: req.body.longsched,
    userID: req.session.user_id
  }
  res.redirect(`/scheds/${shortsched}`);
});

//Listen call
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
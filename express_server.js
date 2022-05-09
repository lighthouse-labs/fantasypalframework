//requires
const express = require("express");
const bcrypt =require("bcryptjs");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

//Functions, tried leaving them in helpers and for some reason error kept happening
const emailCheck = function(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
}

function generateRandomString() {
  let r = (Math.random().toString(36).substring(7))
return r;
}



function urlsForUser(id) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
      }
  }
  return userUrls;
}



//server info
const app = express();
const PORT = 8080; // default port 8080

//Some consts
const urlDatabase = {};
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

//get call for login, once logged in redirect to urls page.
app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (user) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user
  };
  res.render("login", templateVars);
})

//get call for registration. redirects to urls
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (user) {
    return res.redirect("/urls");
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
    res.redirect("/urls");
  }
  if (!user) {
    return res.redirect('/login');
  }
});

// error code for user that isnt logged in trying to access urls.. 
app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    return res.status(401).send("Please login");
  }
  const userDB = urlsForUser(userId, urlDatabase);
  const templateVars = {
    user,
    urls: userDB
  };

  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
})

//get request for new user
app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
  res.render('urls_new', templateVars);
  }
});

//get request with for loop that checks for past urls.. Error code if the URL does not exist.
app.get("/urls/:id", (req, res) => {
  let urlsForID = {};
  for (let user in urlDatabase) {     
    if (urlDatabase[user].userID === req.session.user_id) {       
      urlsForID[user] = urlDatabase[user];    
    }
  }
  for (let shortUrl in urlsForID) {
    if (req.params.id == shortUrl) {
      let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: users[req.session.user_id]};
      res.render("urls_show", templateVars);
      return
    }
  }
  res.send("URL does not exist!")
  return
});

app.get("/u/:id", (req, res) => {
  res.redirect(urlDatabase[req.params.id].longURL);
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
  
  res.redirect('/urls')
    } else {
      res.statusCode = 400;
      res.send('<h2>400 Email already exists. Please try again.</h2>')
    }
  } else {
    res.statusCode = 400;
    res.send('<h2>400 Please try again.</h2>')
  } 
});

// Delete a URL in MyUrls
app.post('/urls/:id/delete', (req, res) => {
  const shortURL = req.params.id;
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
});

// Post request that requires a login to access urls
app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.id;
  const longURL = req.body.newLongURL;
  const user = users[userId];

  if (!user) {
    return res.status(401).send("Please login!");
  }
  const userDB = urlsForUser(userId, urlDatabase);
  if (!userDB[shortURL]) {
    return res.status(401).send("Access Denied!");
  }

  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
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
      res.redirect("/urls")
    }
  }
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect("/login");
})

//post function that calls generate random string to creat the tinyURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }
  res.redirect(`/urls/${shortURL}`);
});

//Listen call
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
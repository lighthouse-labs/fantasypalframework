//const
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const urlDatabase = {};
const cookieSession = require("cookie-session");
const users = {
  "userID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple"
  }
}
const bcrypt =require("bcryptjs");

//app.use lines
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession( {
  name: 'session',
  keys: ['lighthouse'],
  secret: 'this is a secret'
}));
app.set("view engine", "ejs");

// Functions
function generateRandomString() {
  let r = (Math.random().toString(36).substring(7))
return r;
}

function emailCheck(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
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

//GET CALLS
app.get("/login", (req, res) => {
  let templateVars = {user: users[req.session.user_id]};
  res.render('login', templateVars);
})

app.get("/register", (req, res) => {
  let templateVars = {user: users[req.session.user_id]};
  res.render('user-registration', templateVars);
})


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  console.log('this is the user', users)
  //res.cookie("check cookie", 112)
  
  const userID = req.session.user_id;

  console.log(userID, "checking register cookie")
  const userUrls = urlsForUser(userID);
  let templateVars = { urls: userUrls, user: users[userID] };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
})

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
  res.render('urls_new', templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

//POST CALLS
app.post("/register", (req, res) => {
  console.log(req.body.password, 'this is the password')
  if (req.body.email && req.body.password) {
    if (!emailCheck(req.body.email, users)){
      let userID = generateRandomString();
    users[userID] = {
    id: userID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  }
  req.session.user_id = userID;
  
  console.log(userID, 'check user id')
  //test code console.log(users[userID])
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


app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
});

app.post("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  res.redirect('/urls_show', templateVars);
})

app.post("/login", (req,res) => {
  // const userID = req.cookies['user_id'];
  // console.log(req.body);
  // console.log(userID, "this is the userID")
  if (!emailCheck(req.body.email, users)) {
    res.statusCode = 403;
    res.send('<h2>403 This email is not registered. Please try again or resgister a new account!</h2>')
  } else {
    let user = emailCheck(req.body.email, users);
    let userPassword = user.password;
    let userID = user.id;
    console.log(userPassword, "checking userPassword")
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

app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect("/urls");
})

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
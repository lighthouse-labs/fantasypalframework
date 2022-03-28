//const
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const cookieParser = require("cookie-parser");
const users = {}

//app.use lines
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

// Functions
function generateRandomString() {
  let r = (Math.random().toString(36).substring(7))
return r;
}

function emailCheck(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
}

//GET CALLS
app.get("/register", (req, res) => {
  let templateVars = {user: users[req.cookies['user_id']]};
  res.render('user-registration', templateVars);
})


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
    res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
})

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
  res.render('urls_new', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies['user_id']]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

//POST CALLS
app.post("/register", (req, res) => {
  if (req.body.email && req.body.password) {
    if (!emailCheck(req.body.email)){
      let userID = generateRandomString();
    users[userID] = {
    userID,
    email: req.body.email,
    password: req.body.password,
  }
  res.cookie('user_id', userID)
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
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.redirect('/urls_show', templateVars);
})

app.post("/login", (req,res) => {
  console.log(req.body);
  res.cookie("user_id", req.body.username);
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

//Listen call
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
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



function urlsForUser(id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
      }
  }
  return userUrls;
}


module.exports = { emailCheck, generateRandomString, urlsForUser }
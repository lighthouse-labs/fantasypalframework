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

const ANAsched = require('./db/ANAsched')
const ARIsched = require('./db/ARIsched')
const BOSsched = require('./db/BOSsched')
const BUFsched = require('./db/BUFsched')
const CALsched = require('./db/CALsched')
const CARsched = require('./db/CARsched')
const CHIsched = require('./db/CHIsched')
const COLsched = require('./db/COLsched')
const CBJsched = require('./db/CBJsched')
const DALsched = require('./db/DALsched')
const DETsched = require('./db/DETsched')
const EDMsched = require('./db/EDMsched')
const FLOsched = require('./db/FLOsched')
const LAKsched = require('./db/LAKsched')
const MINsched = require('./db/MINsched')
const MTLsched = require('./db/MTLsched')
const NASsched = require('./db/NASsched')
const NJDsched = require('./db/NJDsched')
const NYIsched = require('./db/NYIsched')
const NYRsched = require('./db/NYRsched')
const OTTsched = require('./db/OTTsched')
const PHIsched = require('./db/PHIsched')
const PITsched = require('./db/PITsched')
const SJSsched = require('./db/SJSsched')
const SEAsched = require('./db/SEAsched')
const STLsched = require('./db/STLsched')
const TBLsched = require('./db/TBLsched')
const TMLsched = require('./db/TMLsched')
const VANsched = require('./db/VANsched')
const VGKsched = require('./db/VGKsched')
const WASsched = require('./db/WASsched')
const WINsched = require('./db/WINsched')




const scheduleComparison = (arr1, arr2, date) => {
  const sameDays = [];  // Array to contain match elements
  for(var i=0 ; i<arr1.length ; ++i) {
    for(var j=0 ; j<arr2.length ; ++j) {
      if (date >= arr1[i]) { // only access numbers greater than current date (later days)
        
      } else {
      if(arr1[i] == arr2[j]) {    // If element is in both the arrays
        sameDays.push(arr1[i]);        // Push to arr array
        }
      }
    }
  }
   
  return sameDays.length;  // Return the number of same days played on in sameDays 
}  

console.log(scheduleComparison(TMLsched, MTLsched, 220101))


module.exports = scheduleComparison


module.exports = { emailCheck, generateRandomString, urlsForUser }
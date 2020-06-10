/* VARIABLES */
let mainEl = document.getElementById('main');
const showBillionairesBtn = document.getElementById('show-billionaires-button');
const convertBtn = document.getElementById('convert-currency-button');
const wealthDescBtn = document.getElementById('sort-descending-button');
const wealthAscBtn = document.getElementById('sort-ascending-button');
const totalWealthBtn = document.getElementById('calculate-total-wealth-button');
let data = [];
let currencyBool = false;

/* FUNCTIONS */

// Generates a specified amount of users
for (let i = 0; i < 10; i++) {
  getRandomUser();
}

// Grabs a random user from the random.me api and creates a new user object
async function getRandomUser() {
  const userData = (await (await fetch('https://randomuser.me/api')).json())
    .results[0]['name'];
  const firstName = userData['first'];
  const lastName = userData['last'];
  const fullName = `${firstName} ${lastName}`;
  const randomBTC = getRandomBTC();
  const dollars = randomBTC / 9741.82; // exchange rate as at 8 Jun 2020 07:24 UTC

  const user = { name: fullName, dollars: dollars, btc: randomBTC };
  addUserToData(user);
  const userEl = document.createElement('div');
  userEl.classList.add('person');
  userEl.innerHTML = `${user.name} <strong>${
    '₿' + formatMoney(user.btc)
  }</strong>`;
  mainEl.appendChild(userEl);
}

// Generates a random amount of Bitcoin. Roughly 50% should be Bitcoin billionaires
function getRandomBTC() {
  if (Math.random() > 0.5) {
    return Math.random() * 10000000000;
  } else {
    return Math.random() * 1000000000;
  }
}

// Format number as money with commas and decimal places
function formatMoney(number) {
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Ads users to the data array
function addUserToData(user) {
  data.push(user);
}

// Updates the UI with data array information
function updateUI(providedData = data, btc = true) {
  mainEl.innerHTML = `<div class="table-title" id="table-title">
  <strong>Name</strong><span>Wealth</span>
</div>`;
  data.forEach((item) => {
    let dataEl = document.createElement('div');
    if (btc) {
      dataEl.innerHTML = `${item.name} <strong>${
        '₿' + formatMoney(item.btc)
      }</strong>`;
    } else {
      dataEl.innerHTML = `${item.name} <strong>${
        '$' + formatMoney(item.dollars)
      }</strong>`;
    }
    dataEl.classList.add('person');
    mainEl.appendChild(dataEl);
  });
}

// Filter to show only Bitcoin billionaires
function showBillionaires() {
  data = data.filter((item) => item.btc >= 1000000000);
  updateUI(data, !currencyBool);
}

// Converts currency from BTC to USD and vice versa
function convertCurrency() {
  updateUI(data, currencyBool);
  if (currencyBool) {
    convertBtn.innerText = 'Convert to US Dollars';
  } else {
    convertBtn.innerText = 'Convert to Bitcoin';
  }
  currencyBool = !currencyBool;
}

// Sorts data by wealth in descending order
function sortByWealthDesc() {
  data = data.sort((a, b) => b.btc - a.btc);
  updateUI(data, !currencyBool);
}

// Sorts data by wealth in ascending order
function sortByWealthAsc() {
  data = data.sort((a, b) => a.btc - b.btc);
  updateUI(data, !currencyBool);
}

// Calculate the total wealth of all of the users present
function calculateTotalWealth() {
  if (!currencyBool) {
    let totalWealth = data.reduce((acc, currentValue) => {
      return acc + currentValue.btc;
    }, 0);
    totalWealth = `₿${formatMoney(totalWealth)}`;
    showTotalWealth(totalWealth);
  } else {
    let totalWealth = data.reduce((acc, currentValue) => {
      return acc + currentValue.dollars;
    }, 0);
    totalWealth = `$${formatMoney(totalWealth)}`;
    showTotalWealth(totalWealth);
  }
}

function showTotalWealth(total) {
  if (!document.getElementById('total-wealth')) {
    let totalWealthEl = document.createElement('div');
    totalWealthEl.setAttribute('id', 'total-wealth');
    totalWealthEl.classList.add('total');
    mainEl.appendChild(totalWealthEl);
  }

  totalWealthEl = document.getElementById('total-wealth');
  totalWealthEl.innerHTML = `Total Wealth: <strong>${total}</strong>`;
}

/* EVENT LISTENERS */

showBillionairesBtn.addEventListener('click', showBillionaires);
convertBtn.addEventListener('click', convertCurrency);
wealthDescBtn.addEventListener('click', sortByWealthDesc);
wealthAscBtn.addEventListener('click', sortByWealthAsc);
totalWealthBtn.addEventListener('click', calculateTotalWealth);

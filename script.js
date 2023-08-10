'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// display Movements
const displayMovements = function (movements, sort = false) {

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements

  containerMovements.innerHTML = '';

  movs.forEach(function (mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>`

    containerMovements.insertAdjacentHTML('afterbegin', html)

  })
}

//calc display balance
const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov,0)
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`
}

//calc display summary
const calcDisplaySummary = acc => {

  const inComes = acc.movements
   .filter(mov => mov > 0)
   .reduce((acc, mov) => acc + mov,0)
  labelSumIn.textContent = `${inComes.toFixed(2)}€`

  const out = acc.movements
   .filter(mov => mov < 0)
   .reduce((acc, mov) => acc + mov,0)
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`

  const interest =  acc.movements
   .filter(mov => mov > 0)
   .map(deposit => (deposit * acc.interestRate)/100)
   .filter(int => int >= 1)
   .reduce((acc, int) => acc + int,0)
  labelSumInterest.textContent = `${interest.toFixed(2)}€` 
}

// creat User Name
const creatUserNames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(letterfirst => letterfirst[0])
    .join('')
  })
}
creatUserNames(accounts)

// Update UI
const updateUI = function(acc){

   // Display movements
   displayMovements(acc.movements)

   // Display balance
   calcDisplayBalance(acc)

   // Display summary
   calcDisplaySummary(acc)
}

//Event handler
let currentAccont

btnLogin.addEventListener('click', function(e){

  // prevent form from submitting
  e.preventDefault()

  currentAccont = accounts.find(acc => acc.username ===  inputLoginUsername.value)

  if(currentAccont?.pin === +(inputLoginPin.value)){

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccont.owner.split(' ')[0]}` 

    containerApp.style.opacity = 100

    // Clear input field
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()

    // Update UI
    updateUI(currentAccont)
  }
})

// Transfer money
btnTransfer.addEventListener('click', function(e){

  // prevent form from submitting
  e.preventDefault()

  const amount = +(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)

  inputTransferAmount.value = inputTransferTo.value =''

  if(
    receiverAcc &&
    amount > 0 &&
    currentAccont.balance >= amount &&
    receiverAcc &&
    receiverAcc.username !== currentAccont.username 
  ){

    // Doing the transfer
    currentAccont.movements.push(-amount)
    receiverAcc.movements.push(amount)

    // Update UI
    updateUI(currentAccont)
  }
})

// Repuest load
btnLoan.addEventListener('click', function(e){
  e.preventDefault()
  
  const amount = Math.floor(inputLoanAmount.value)
  if(
    amount > 0 && 
    currentAccont.movements.some(mov => mov > amount * 0.1)
    ){
      currentAccont.movements.push(amount)

      // Update UI
      updateUI(currentAccont)
    }
  
  inputLoanAmount.value = '' 
})

// Delete account
btnClose.addEventListener('click', function(e){

   // prevent form from submitting
   e.preventDefault()

   if(
    inputCloseUsername.value === currentAccont.username &&
    Number(inputClosePin.value) === currentAccont.pin
   ){
      const index = accounts.findIndex(acc => currentAccont.username === acc.username)

      // Delete account
      accounts.splice(index, 1)

      // Hide UI
      containerMovements.style.opacity = 0
   }

   inputCloseUsername.value = inputClosePin.value = ''
})

// Sort
let sorted = false

btnSort.addEventListener('click', function(e){

  e.preventDefault()
  displayMovements(currentAccont.movements, !sorted)
  sorted = !sorted
})
/////////////////////////////////////////////////

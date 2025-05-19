import bcrypt from 'bcrypt'
import db from './db.js'
import User from './models/user.js'
import Cryptocurrency from './models/cryptocurrency.js'
import InterestTerm from './models/interest_term.js'
import LoanRequest from './models/loan_request.js'
import Wallet from './models/wallet.js'
import Deal from './models/deal.js'
import Collateral from './models/collateral.js'

// Connect to DB
db.connect()

// User seed data
const users = [
    {
        email: 'admin@app.com',
        password: await bcrypt.hash('Password123', 10),
        isAdmin: true
    },
    {
        // walletId: 'ABCD87654321',
        email: 'hodl@satoshi.com',
        password: await bcrypt.hash('1Password', 10)
    },
    {
        // walletId: '1122334455AB',
        email: 'degen@daytrade.com',
        password: await bcrypt.hash('2thamoon!', 10)
    }
]

// Erase any existing Users
await User.deleteMany()
console.log('Users erased.')
// Creates and saves a new User to MongoDB for each document in users
const u = await User.create(users)
console.log('Users created.')

// Cryptocurrency seed data
const cryptocurrencies = [
    {
        symbol: 'BTC',
        name: 'Bitcoin'
    }
    // Will look at adding other cryptocurrencies in the future
]

await Cryptocurrency.deleteMany()
console.log('Cryptocurrencies erased.')
// Creates and saves the cryptocurrencies to MongoDB
const c = await Cryptocurrency.create(cryptocurrencies)
console.log('Cryptocurrencies created.')

// Interest Term seed data
const interestTerm = [
    {
        loan_length: 1,
        interest_rate: 5.9
    },
    {
        loan_length: 3,
        interest_rate: 5.7
    },
    {
        loan_length: 6,
        interest_rate: 5.5
    }
]

await InterestTerm.deleteMany()
console.log('Interest terms erased.')
// Creates and saves the interest terms to MongoDB
const i = await InterestTerm.create(interestTerm)
console.log('Interest terms created.')

// Loan Request seed data
const loanRequest = [
    {
        borrower_id: u[0]._id,
        request_amount: 0.5,
        interest_term: i[1]._id,
        cryptocurrency: c[0]._id,
        request_date: Date.now(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }
]

await LoanRequest.deleteMany()
console.log('Loan Requests have been erased')
const lr = await LoanRequest.create(loanRequest);
console.log('Loan Requests have been created')

const deals = [
    {
        lenderId: u[1]._id,
        loanDetails: lr[0]._id,
        isComplete: false
    }
]

await Deal.deleteMany()
console.log('Deals have been erased')
const d = await Deal.create(deals);
console.log('Deals have been created')


// Collateral seed data
const collateral = [
    {
        deal_id: d[0]._id,
        amount: 0.5,
        status: 'pending',
        date_created: Date.now()
    }
]

await Collateral.deleteMany()
console.log('Collateral has been erased')
const col = await Collateral.create(collateral);
console.log('Collateral has been created')




// Wallet seed data
const wallet = [
    {
        userId: u[0]._id,
        cryptoType: c[0]._id,
        balance: 20.2
    },
    {
        userId: u[1]._id,
        cryptoType: c[0]._id,
        balance: 8.81769123
    },
    {
        userId: u[2]._id,
        cryptoType: c[0]._id,
        balance: 2.51242
    }
]
await Wallet.deleteMany()
console.log('Wallets have been erased')
const wal = await Wallet.create(wallet);
console.log('Wallets have been seeded')

// Disconnect from DB
db.disconnect()
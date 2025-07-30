// tests/models/deal.test.js
import 'dotenv/config'
import mongoose from 'mongoose'
import Deal from '../../models/deal.js'
import User from '../../models/user.js'
import LoanRequest from '../../models/loan_request.js'
import InterestTerm from '../../models/interest_term.js' // adjust if needed
import Cryptocurrency from '../../models/cryptocurrency.js'

let mongo

beforeAll(async () => {
    const uri = process.env.DATABASE_URL

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    await mongoose.connection.db.dropDatabase()
    await Deal.syncIndexes()
    await LoanRequest.syncIndexes()
    await InterestTerm.syncIndexes()
    await User.syncIndexes()
})

beforeEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        await collections[key].deleteMany({})
    }
})


afterAll(async () => {
    await mongoose.connection.close()
})

describe('Deal model', () => {
    test('throws an error when loanDetails is missing interest_term', async () => {
        const user = await User.create({ email: 'fail@example.com', password: 'Password123' })
        const crypto = await Cryptocurrency.create({ name: 'Bitcoin', symbol: 'BTC' })

        let error
        try {
            const loanRequest = await LoanRequest.create({
                borrower_id: user._id,
                cryptocurrency: crypto._id,
                request_amount: 1000
                // missing interest_term
            })

            // Add delay
            await new Promise(resolve => setTimeout(resolve, 50))

            const deal = await Deal.create({
                lenderId: user._id,
                loanDetails: loanRequest._id
            })

            await deal.populate('loanDetails').execPopulate()

            await deal.save()

        } catch (err) {
            error = err
        }

        expect(error).toBeDefined()
        expect(error.message).toMatch(/LoanRequest validation failed: interest_term: Path `interest_term` is required./)
    })
})

// tests/models/cryptocurrency.test.js
import 'dotenv/config'
import mongoose from 'mongoose'
import Cryptocurrency from '../../models/cryptocurrency.js' // adjust if necessary

let mongo

beforeAll(async () => {
  const uri = process.env.DATABASE_URL

  if (!uri) {
    throw new Error('DATABASE_URL environment variable not set')
  }
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

describe('Cryptocurrency model', () => {
  it('should be defined', () => {
    expect(Cryptocurrency).toBeDefined()
  })

  test('creates and saves a valid cryptocurrency', async () => {
    const validCrypto = new Cryptocurrency({
      name: 'Bitcoin',
      symbol: 'BTC'
    })

    const saved = await validCrypto.save()
    expect(saved._id).toBeDefined()
    expect(saved.name).toBe('Bitcoin')
    expect(saved.symbol).toBe('BTC')
  })

  test('throws validation error for missing name', async () => {
    const invalidCrypto = new Cryptocurrency({
      symbol: 'ETH'
    })

    let err
    try {
      await invalidCrypto.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.name).toBeDefined()
  })

  test('throws validation error for missing symbol', async () => {
    const invalidCrypto = new Cryptocurrency({
      name: 'Ethereum',
      max_supply: 100000000,
      decimal_places: 18
    })

    let err
    try {
      await invalidCrypto.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.symbol).toBeDefined()
  })
})



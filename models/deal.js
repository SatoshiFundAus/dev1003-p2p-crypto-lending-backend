import mongoose, { Schema, model } from 'mongoose'
import User from './user.js'
import LoanRequest from './loan_request.js'

const dealSchema = new Schema({
  lenderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanDetails: {
    type: Schema.Types.ObjectId,
    ref: 'LoanRequest',
    required: true
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  expectedCompletionDate: {
    type: Date,
    // Default is handled by pre-save hook
  }
}, { timestamps: true })



// Pre-save hook to set expectedCompletionDate
dealSchema.pre('save', async function (next) {
  if (!this.isModified('loanDetails') && this.expectedCompletionDate) {
    return next()
  }

  try {
    const loanDetails = await LoanRequest.findById(this.loanDetails).populate('interest_term')

    if (!loanDetails) {
      return next(new Error('LoanRequest document not found'))
    }

    if (!loanDetails.interest_term) {
      return next(new Error('LoanRequest missing interest_term'))
    }

    const interestTerm = loanDetails.interest_term

    if (!interestTerm || typeof interestTerm.loan_length !== 'number') {
      return next(new Error('Interest term is missing or invalid'))
    }

    const loanTermMonths = interestTerm.loan_length
    const creationDate = loanDetails.createdAt || new Date()

    const expectedDate = new Date(creationDate)
    expectedDate.setMonth(expectedDate.getMonth() + loanTermMonths)

    this.expectedCompletionDate = expectedDate

    next()
  } catch (err) {
    next(err)
  }
})



const Deal = model('Deal', dealSchema)

export default Deal
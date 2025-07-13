import { model, Schema } from "mongoose";

const interestTermSchema = new Schema({
    loan_length: { 
        type: Number, 
        required: true,
        min: [1, 'Loan length must be at least 1 month'],
        validate: {
            validator: Number.isInteger,
            message: 'Loan length must be an integer (in months)'
        }
    },
    interest_rate: { 
        type: Number, 
        required: true,
        min: [0, 'Interest rate must be greater than 0%'],
        max: [100, 'Interest rate cannot exceed 100%'],
        validate: {
            validator: (v) => v >= 0 && v <= 100, // Ensure interest rate is between 0 and 100
            message: 'Interest rate must be between 0 and 100%' 
        }
    }
});

const InterestTerm = model('InterestTerm', interestTermSchema)


export default InterestTerm
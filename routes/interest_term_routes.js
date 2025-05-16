import { Router } from "express";
import { adminOnly, auth } from "../auth.js";
import InterestTerm from "../models/interest_term.js";

const router = Router()

// Get all interest terms
router.get('/interest-terms', auth, async (req, res) => {
    try {
        const interestTerms = await InterestTerm.find()
        if (!interestTerms) {
            res.status(404).send({error: "No interest terms exist"})
        }

        res.send(interestTerms)

    } catch (err) {
        res.status(400).send({error: err.message })
    }
})

// Get one interest term
router.get('/interest-terms/:id', auth, async (req, res) => {
    try {
        // Get the ID from the req.params.id
        const interestId = req.params.id

        const interestTerm = await InterestTerm.findById(interestId)
        if (!interestTerm) {
            res.status(404).send({error: `Interest term with ID ${interestId} not found.`})
        }

        res.send(interestTerm)

    } catch (err) {
        res.status(400).send({error : err.message})
    }
})

// ADMIN Route - Create an interest term
router.post('/admin/interest-terms', auth, adminOnly, async (req, res) => {
    try {
        // Get the bodyData from req.body
        const bodyData = req.body

        const interestTerm = {
            loan_length: bodyData.loan_length,
            interest_rate: bodyData.interest_rate
        }

        // Add the new Interest Term to the database
        InterestTerm.create(interestTerm)

        res.status(201).send({ message: "New interest Term created", post: interestTerm})
        

    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

// ADMIN Route - Delete an interest term by ID
router.delete('/admin/interest-terms/:id', auth, adminOnly, async (req, res) => {
    try {
        // Get the ID from the params
        const interestId = req.params.id

        const interestTerm = await InterestTerm.findByIdAndDelete(interestId)
        if (!interestTerm) {
            res.status(404).send({error: `Interest term with ID ${interestId} not found`})
        }
        res.send({message : "Interest Term deleted"})

    } catch (err) {
        res.status(400).send({error: err.message})
    }
})




export default router
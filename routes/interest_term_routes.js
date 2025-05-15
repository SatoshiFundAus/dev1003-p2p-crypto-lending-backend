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
    //TODO: Finish Route
})



export default router
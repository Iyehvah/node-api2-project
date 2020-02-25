const express = require ("express");

const router = express.Router()

router.get ("/", (req, res) => {
    res.send(`
    <h1>Checkout Our blog API</h1>
    
    `)
})

router.get("/api", (req, res) => {
	res.json({
		message: "Welcome to your Blog API, just use your favorite endpoint from here!",
	})
})

module.exports = router
const express = require("express");

const welcomeRouter = require("./router/welcome-router")
const postRouter = require("./router/posts")

const server = express()
const port = 3000

server.use(express.json())


server.use("/",welcomeRouter )
server.use("/api/posts", postRouter)



server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})
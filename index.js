const express = require('express');
const { connection } = require('./configs/db');
const { default: axios } = require('axios');
require('dotenv').config();
const cors = require('cors');
const userRouter = require('./Routes/User.route');
const favouriteRecipeRouter = require('./Routes/Fav.route');

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
    res.send("hello");
})

app.use('/user' , userRouter);

app.get("/recipes", async (req, res) => {
    try {
        let url = `https://api.spoonacular.com/recipes/random?apiKey=${process.env.API}&number=20`
        let resp = await axios.get(url)
        res.status(200).send(resp.data);
        // console.log(resp.data);
    }
    catch (error) {
        console.log("Error fetching random recipes:", error);
        res.status(500).send({ error: "An error occurred while fetching random recipes" });
    }
})

app.post("/search", async (req, res) => {
    const { query } = req.body;
    console.log(query);

    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API}&query=${query}`

    let result = await axios.get(url)
    res.send(result.data);
})

app.use('/fav' , favouriteRecipeRouter);

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("connected to DB");
    }
    catch (err) {
        console.log(err);
        console.log("Error while connecting to DB");
    }
    console.log(`Listening on port localhost:${process.env.PORT}`);
})
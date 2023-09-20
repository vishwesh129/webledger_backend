const express = require('express');
const router = express.Router();
const { favouriteModel } = require('../Models/FavModel');
const authenticate = require('../Middlewares/authenticate');

// Route to add a recipe to favorites

const favouriteRecipeRouter = express.Router();


favouriteRecipeRouter.get('/', (req, res)=>{
    res.send("fav recipe");
})

favouriteRecipeRouter.post('/add', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { recipe } = req.body;

        // Check if the recipe is already in favorites for the user
        const existingFavorite = await favouriteModel.findOne({ user: user.userID, 'recipe.id': recipe.id });

        if (existingFavorite) {
            return res.status(400).json({ error: 'Recipe already in favorites' });
        }

        // Create a new favorite entry
        const newFavorite = new favouriteModel({
            user: user.userID,
            recipe,
        });

        await newFavorite.save();

        res.status(201).json({ message: 'Recipe added to favorites successfully' });
    } catch (error) {
        console.error('Error adding recipe to favorites:', error);
        res.status(500).json({ error: 'An error occurred while adding the recipe to favorites' });
    }
});

// Route to get a user's favorite recipes
favouriteRecipeRouter.get('/get', authenticate, async (req, res) => {
    try {
        const { user } = req;

        // Retrieve all favorite recipes for the user
        const favorites = await favouriteModel.find({ user: user.userID });

        res.status(200).json({ favorites });
    } catch (error) {
        console.error('Error fetching user favorites:', error);
        res.status(500).json({ error: 'An error occurred while fetching user favorites' });
    }
});

module.exports = favouriteRecipeRouter;

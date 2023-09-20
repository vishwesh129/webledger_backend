const mongoose = require("mongoose");

const favouriteRecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user",
  },
  recipe: {
    type: Object,
  },
});

const favouriteModel = mongoose.model(
  "favourite",
  favouriteRecipeSchema
);

module.exports = {
  favouriteModel,
};
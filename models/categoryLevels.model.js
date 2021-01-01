import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categoryLevelScheme = new Schema(
  {
    levelName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryLevel = mongoose.model("CategoryLevel", categoryLevelScheme);
export default CategoryLevel;

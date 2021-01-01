import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    categoryLevel: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryDetail: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subCategoryScheme = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      required: true,
      trim: true,
    },
    view : {
      type : Number,
      required: true
    },
    numOfCourses : {
      type : Number,
      required : true
    },
    parent : {
      type : Schema.Types.ObjectId,
      ref : 'Category',
      required : true
    }
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model("SubCategory", subCategoryScheme);
export default SubCategory;

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    avatarLink: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["finish, unfinished"],
    },
    updated: {
      type: Date,
      default: Date.now(),
    },
    briefDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    numOfStudent: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    reviewList: [
      {
        studentName: String,
        numOfStar: Number,
        feedback: { type: String, trim: true, minlength: 2 },
      },
    ],
    videos: [
      {
        title: { type: String, required: true },
        link: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    teacherID: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    view: {
      type: Number,
      required: true,
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
    isFinish: {
      type: Boolean,
      required: true,
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
        description: { type: String, required: true },
        link: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ title: "text", category: "text" });

const Course = mongoose.model("Course", courseSchema);

export default Course;

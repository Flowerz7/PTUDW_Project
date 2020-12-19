import mongoose from "mongoose";

const Schema = mongoose.Schema;

const teacherShema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    courses: [Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherShema);
export default Teacher;

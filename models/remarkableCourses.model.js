import mongoose from "mongoose";

const Schema = mongoose.Schema;

const remarkableCoursesSchema = new Schema({
    remarkableCourses : [{
        type: Schema.Types.ObjectId,
        ref: "Course",
    }]
},
{
    timestamps : true
})

const RemarkableCourse = mongoose.model("RemarkableCourse", remarkableCoursesSchema);

export default RemarkableCourse;
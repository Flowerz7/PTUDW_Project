import Course from "../models/courses.model.js";

export const handleQuery = async (req, res) => {
    const _id  = req.query.id
    const course = await Course.findById(_id)
    
    res.render('vwCourse/course', course)
}

export const loadAllCourses = async (req, res) => {
    const courses = await Course.find().lean()
    const props = {
        Courses : courses
    }
    res.render('vwCourse/all', props)
}
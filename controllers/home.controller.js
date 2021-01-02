import Course from "../models/courses.model.js";
import Category from '../models/categories.model.js'

const addMockCourse = async () => {
    // await Course.find().remove()

    const docs = [{
        title : 'test1',
        avatarLink : 'https://i.ibb.co/qdrpnCL/02.jpg',
        price : 3000,
        status : "unfinished",
        briefDescription: 'a',
        description: 'a',
        numOfStudent: 10,
        category : 'Information Technology',
        reviewList: [{
            studentName: 'test1',
            numOfStar: 3,
            feedback : 'test1'
        }],
        videos : [{
            title : 'test1',
            link : 'a'
        }]
    }]

    const options = { ordered: true };
    const result = await Course.insertMany(docs, options)
}

export const loadCourses = async (req , res) => {
    const remarkableCourses = await Course.aggregate([{ $sample: { size: 4 } }])
    const mostViewedCourses = await Course.aggregate([{ $sample: { size: 10 } }])
    const newestCourses = await Course.aggregate([{ $sample: { size: 10 } }])
    const mostSubscribedCategories = await Category.aggregate([{$sample : {size : 5}}])

    const props = {
        RemarkableCourses : remarkableCourses,
        MostViewedCoureses : mostViewedCourses,
        NewestCourses : newestCourses,
        MostSubscribedCategories : mostSubscribedCategories,

        isAuth : req.session.isAuth,
        username : req.session.username
    }
    res.render('vwHome/home', props)
}

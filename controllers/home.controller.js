import Course from "../models/courses.model.js";
import RemarkableCourses from '../models/remarkableCourses.model.js'
import SubCategory from "../models/subCategory.model.js";

export const loadCourses = async (req , res) => {
    const milestone = new Date(2021, 0, 1)
    const countDocs = await RemarkableCourses.find().countDocuments()

    if (countDocs < 1){
        const remarkableCoursesHolder = new RemarkableCourses({
            remarkableCourses : []
        })

        await remarkableCoursesHolder.save()
    }

    var rmkCourses = await RemarkableCourses.findOne()
    
    const diff = (Math.round(rmkCourses.updatedAt - milestone) % 7) === 0
    if (diff === true){
        const newRemarkableCourses = await Course.aggregate([{ $sample: { size: 4 } }])
        rmkCourses.remarkableCourses = [...newRemarkableCourses]
        await rmkCourses.save()
    } 

    rmkCourses = await RemarkableCourses.findOne().populate('remarkableCourses').lean()
    const mostViewedCourses = await Course.find().sort({view : -1}).limit(10).lean()
    const newestCourses = await Course.find().sort({$natural:-1}).limit(10).lean()
    const mostSubscribedCategories = await SubCategory.aggregate([{$sample : {size : 5}}])

    const props = {
        RemarkableCourses : rmkCourses.remarkableCourses,
        MostViewedCoureses : mostViewedCourses,
        NewestCourses : newestCourses,
        MostSubscribedCategories : mostSubscribedCategories,

        isAuth : req.session.isAuth,
        username : req.session.username
    }

    res.render('vwHome/home', props)
}

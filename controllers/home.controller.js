import Course from "../models/courses.model.js";
import SubCategory from "../models/subCategory.model.js";

import MostSubscribedCategory from '../models/mostSubscribedCategories.model.js'
import RemarkableCourses from '../models/remarkableCourses.model.js'

import { getCategories } from '../controllers/category.controller.js'

export const loadHome = async (req , res) => {
    const countRemarkableCourses = await RemarkableCourses.find().countDocuments()
    const countMostSubscribedCategories = await MostSubscribedCategory.find().countDocuments()

    if (countRemarkableCourses < 1){
        const remarkableCourseContainer = new RemarkableCourses({
            remarkableCourses : []
        })

        await remarkableCourseContainer.save()
    }

    if (countMostSubscribedCategories < 1){
        const mostSubscribedCategoryContainer = new MostSubscribedCategory({
            mostSubscribedCategories : []
        })

        await mostSubscribedCategoryContainer.save()
    }

    var courseContainer = await RemarkableCourses.findOne()
    var categoryContainer = await MostSubscribedCategory.findOne()
    
    const milestone = new Date(2021, 0, 1)
    const isCourseNotUpdated = (Math.round(courseContainer.updatedAt - milestone) % 7) === 0
    const isCategoryNotUpdated = (Math.round(categoryContainer.updatedAt - milestone) & 7) === 0

    if (isCourseNotUpdated === true){
        const newRemarkableCourses = await Course.aggregate([{ $sample: { size: 4 } }])
        courseContainer.remarkableCourses = [...newRemarkableCourses]
        await courseContainer.save()
    }

    if (isCategoryNotUpdated === true){
        const newCategories = await SubCategory.find().sort({subscribe : -1}).limit(5)
        categoryContainer.mostSubscribedCategories = [...newCategories]
        await categoryContainer.save()
    }

    courseContainer = await RemarkableCourses.findOne().populate('remarkableCourses').lean()
    categoryContainer = await MostSubscribedCategory.findOne().populate('mostSubscribedCategories').lean()

    const mostViewedCourses = await Course.find().sort({view : -1}).limit(10).populate('teacherID').lean()
    const newestCourses = await Course.find().sort({$natural : -1}).limit(10).populate('teacherID').lean()

    mostViewedCourses.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    newestCourses.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    const categories = await getCategories()

    const props = {
        RemarkableCourses : courseContainer.remarkableCourses,
        MostViewedCoureses : mostViewedCourses,
        NewestCourses : newestCourses,
        MostSubscribedCategories : categoryContainer.mostSubscribedCategories,

        categories : [...categories],

        isAuth : req.session.isAuth,
        username : req.session.username
    }

    res.render('vwHome/home', props)
}

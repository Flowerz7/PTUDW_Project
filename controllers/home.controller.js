import Course from "../models/courses.model.js";
import SubCategory from "../models/subCategory.model.js";

import MostSubscribedCategory from '../models/mostSubscribedCategories.model.js'
import RemarkableCourses from '../models/remarkableCourses.model.js'

import { getCategories } from '../controllers/category.controller.js'
import { setBadge } from '../controllers/badge.controller.js'

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
    const isCategoryNotUpdated = (Math.round(categoryContainer.updatedAt - milestone) & 7*86400000) === 0
    var isCourseNotUpdated = (Math.round(courseContainer.updatedAt - milestone) % 7*86400000) === 0

    courseContainer.remarkableCourses.map((item) => {
        if (item.disabled == true){
            isCourseNotUpdated = true
        }
    })

    if (isCourseNotUpdated === true){
        const newRemarkableCourses = await Course.find().lean()
        newRemarkableCourses.forEach((item) => {
            item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
                return accumulator + item.numOfStar
            }, 0) / item.reviewList.length) || 0
        })

        newRemarkableCourses.filter(item => item.disabled === false)

        newRemarkableCourses.sort((course1, course2) => {
            return course2.averageReviewPoint - course1.averageReviewPoint
        })

        courseContainer.remarkableCourses = [...(newRemarkableCourses.splice(0, 4))]
        await courseContainer.save()
    }

    if (isCategoryNotUpdated === true){
        const newCategories = await SubCategory.find().sort({subscribe : -1}).limit(5)
        categoryContainer.mostSubscribedCategories = [...newCategories]
        await categoryContainer.save()
    }

    courseContainer = await RemarkableCourses.findOne().populate('remarkableCourses').lean()
    categoryContainer = await MostSubscribedCategory.findOne().populate('mostSubscribedCategories').lean()

    var mostViewedCourses = await Course.find().sort({view : -1}).populate('teacherID').lean()
    var newestCourses = await Course.find().sort({$natural : -1}).populate('teacherID').lean()

    newestCourses = newestCourses.filter(item => item.disabled === false)
    mostViewedCourses = mostViewedCourses.filter(item => item.disabled === false)

    newestCourses = newestCourses.splice(0, 10)
    mostViewedCourses = mostViewedCourses.splice(0, 10)

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
    await setBadge()

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

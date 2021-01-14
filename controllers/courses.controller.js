import Course from "../models/courses.model.js";
import Student from "../models/students.model.js";

import { getCategories } from '../controllers/category.controller.js'
import Category from "../models/categories.model.js";
import SubCategory from '../models/subCategory.model.js'

export const loadSingleCourse = async (req, res) => {
    const _id  = req.query.id

    var course = await Course.findById(_id)
    course.view += 1

    await course.save()

    course = await Course.findById(_id).populate('teacherID').lean()

    course.reviewCount = course.reviewList.length
    course.averageReviewPoint = Math.floor(course.reviewList.reduce((accumulator, item) => {
        return accumulator + item.numOfStar
    }, 0) / course.reviewCount) || 0

    const category = await SubCategory.findOne({name : course.category}).populate('parent').lean()
    const suggestingCourse = await Course.find({ category : course.category}).sort({numOfStudent : -1}).limit(6).lean()

    const selfCourse = await Course.findById(_id).lean()
    var indexToDelete = -1

    suggestingCourse.forEach((item, index) => {
        if (item._id.toString() == selfCourse._id.toString()){
            indexToDelete = index
        }
    })

    if (indexToDelete !== -1){
        suggestingCourse.splice(indexToDelete, 1)
    }
    
    if(suggestingCourse.length === 6){
        suggestingCourse.pop()
    }


    suggestingCourse.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    const categories = await getCategories()

    res.render('vwCourse/course', {
        ...course, username : req.session.username,
        parentCate : category.parent.name,
        isAuth : req.session.isAuth, 
        categories : [...categories],
        suggestignCourse : [...suggestingCourse]
    })
}

export const loadAllCourses = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    
    const options = {
        page: page,
        limit: 5,
        lean : true
    };
    const courses = (await Course.paginate({}, options)).docs
    const docsCount = await Course.find().countDocuments()

    const categories = await getCategories()
    const props = {
        Courses : courses,
        docsCount : docsCount,
        current : page,
        start : page === 1,
        last : (options.page * options.limit) > docsCount,
        isAuth : req.session.isAuth,
        categories : [...categories],
        username : req.session.username
    }

    res.render('vwCourse/all', props)
}

export const loadCoursesBySubcategory = async (req, res) => {
    const subcategory_params = req.params.subcategory

    const page = parseInt(req.query.page) || 1
    const options = {
        page: page,
        limit: 5,
        lean : true
    };

    const courses = (await Course.paginate({category : subcategory_params}, options)).docs
    const docsCount = await Course.find().countDocuments()

    result.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    const categories = await getCategories()
    const props = {
        Courses : courses,
        docsCount : docsCount,
        current : page,
        start : page === 1,
        last : (options.page * options.limit) > docsCount,
        isAuth : req.session.isAuth,
        username : req.session.username,
        categories : [...categories]
    }

    res.render('vwCourse/all', props)
}

export const loadCoursesByCategory = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const options = {
        page: page,
        limit: 5,
        lean : true
    };
    const docsCount = await Course.find().countDocuments()

    const cate_params = req.params.category
    const cate = await Category.findOne({name : cate_params}).populate('subCategories').lean()

    const reducer = async (accumulator, item) => {
        const courses = await Course.find({category : item.name}).lean()
        return [...(await accumulator), ...courses]
    }

    const result = await cate.subCategories.reduce(reducer, [])
    
    result.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    const categories = await getCategories()
    const props = {
        Courses : result,
        docsCount : docsCount,
        current : page,
        start : page === 1,
        last : (options.page * options.limit) > docsCount,
        isAuth : req.session.isAuth,
        username : req.session.username,
        categories : [...categories]
    }

    res.render('vwCourse/all', props)
}


export const loadQueriedCourse = async (req, res) => {
    const q = req.query.q
    const page = parseInt(req.query.page) || 1
    const limit = 5

    const result = await Course.find({$text: {$search : q, $caseSensitive : false}}).lean()
    const docsCount = result.length

    result.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    const categories = await getCategories()
    const props = {
        Courses : result,
        docsCount : docsCount,
        q : q,
        current : page,
        start : page === 1,
        last : (page * limit) > docsCount,
        isAuth : req.session.isAuth,
        username : req.session.username,
        categories : [...categories]
    }

    res.render('vwCourse/search', props)
}

export const createFeedback = async (req, res) => {
    const {stars, comment} = req.body
    const username = req.query.username
    const id = req.query.id
    
    try{
        const course = await Course.findById(id)
        const studentName = (await Student.findOne({username})).name

        course.reviewList = [...course.reviewList, {studentName, numOfStar : stars, feedback : comment}]
        await course.save()

        res.json({isSuccess : true})
    }
    catch (e) {
        res.json({isSuccess : false})
    }
}
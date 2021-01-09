import Course from "../models/courses.model.js";
import Student from "../models/students.model.js";

import { getCategories } from '../controllers/category.controller.js'
import Category from "../models/categories.model.js";
import SubCategory from '../models/subCategory.model.js'

export const loadSingleCourse = async (req, res) => {
    const _id  = req.query.id

    var course = await Course.findById(_id)
    course.view += 1

    course = await Course.findById(_id).populate('teacherID').lean()

    res.render('vwCourse/course', {...course, isAuth : req.session.isAuth})
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

    const props = {
        Courses : courses,
        current : page,
        start : page === 1,
        last : (options.page * options.limit) > docsCount,
        isAuth : req.session.isAuth
    }

    res.render('vwCourse/all', props)
}

export const loadCoursesByCategory = async (req, res) => {
    const category_params = req.params.category
    const subcategory_params = req.params.subcategory

    const page = parseInt(req.query.page) || 1
    const options = {
        page: page,
        limit: 5,
        lean : true
    };

    if (subcategory_params === undefined){
        const category = await Category.findOne({name : category_params}).populate('subCategories').lean()

        const result = await category.subCategories.reduce(async (accumulator, current) => {
            const courses = await Course.find({category : current.name}).lean()
            return [...accumulator, ...courses]
        }, [])

        const courseToPass = result.splice((options.page * options.limit) - 1, options.limit)
        const props = {
            Courses : courseToPass.length === 0 ? result : courseToPass,
            current : page,
            start : page === 1,
            last : (options.page * options.limit) > result.length,
            isAuth : req.session.isAuth
        }

        res.render('vwCourse/all', props)
    }
    else {
        const courses = (await Course.paginate({category : category_params}, options)).docs
        const docsCount = await Course.find().countDocuments()

        const props = {
            Courses : courses,
            current : page,
            start : page === 1,
            last : (options.page * options.limit) > docsCount,
            isAuth : req.session.isAuth
        }

        res.render('vwCourse/all', props)
    }
}

export const loadQueriedCourse = async (req, res) => {
    const q = req.query.q
    const page = parseInt(req.query.page) || 1
    const limit = 5

    const result = await Course.find({$text: {$search : q, $caseSensitive : false}}).lean()
    const docsCount = result.length
    const props = {
        Courses : result,
        q : q,
        current : page,
        start : page === 1,
        last : (page * limit) > docsCount,
        isAuth : req.session.isAuth
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
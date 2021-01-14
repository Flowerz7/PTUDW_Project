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

const sortListCourse = (filterType, courses) => {
    switch (filterType) {
        case 'price-asc':
            courses.sort((course1, course2) => {
                return course1.price - course2.price
            })
            break;
        case 'price-desc':
            courses.sort((course1, course2) => {
                return course2.price - course1.price
            })
            break;
        case 'review-asc':
            courses.sort((course1, course2) => {
                return course1.averageReviewPoint - course2.averageReviewPoint
            })
            break;
        case 'review-desc':
            courses.sort((course1, course2) => {
                return course2.averageReviewPoint - course1.averageReviewPoint
            })
            break;

        default:
            break;
    }
}

export const loadAllCourses = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const filter = req.query.filter
    
    const options = {
        page: page,
        limit: 5,
        lean : true
    };

    var courses = await Course.find().lean()
    const docsCount = courses.length

    courses = courses.splice((options.page - 1) * options.limit, options.limit)

    courses.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    sortListCourse(filter, courses)

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

    const filter = req.query.filter

    var courses = await Course.find({category : subcategory_params}).lean()
    const docsCount = courses.length

    courses = courses.splice((options.page - 1) * options.limit, options.limit)

    courses.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    sortListCourse(filter, courses)

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

    const filter = req.query.filter
    
    const cate_params = req.params.category
    const cate = await Category.findOne({name : cate_params}).populate('subCategories').lean()
    
    const reducer = async (accumulator, item) => {
        const courses = await Course.find({category : item.name}).lean()
        return [...(await accumulator), ...courses]
    }
    var result = await cate.subCategories.reduce(reducer, [])
    const docsCount = result.length

    result = result.splice((options.page - 1) * options.limit, options.limit)
    
    result.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    sortListCourse(filter, result)

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
    const options = {
        page: page,
        limit: 5,
        lean : true
    };

    const filter = req.query.filter

    var result = await Course.find({$text: {$search : q, $caseSensitive : false}}).lean()
    const docsCount = result.length
    result = result.splice((options.page - 1) * options.limit, options.limit)

    result.forEach((item) => {
        item.reviewCount = item.reviewList.length
        item.averageReviewPoint = Math.floor(item.reviewList.reduce((accumulator, item) => {
            return accumulator + item.numOfStar
        }, 0) / item.reviewList.length) || 0
    })

    sortListCourse(filter, result)

    const categories = await getCategories()
    const props = {
        Courses : result,
        docsCount : docsCount,
        q : q,
        current : page,
        start : page === 1,
        last : (options.page * options.limit) > docsCount,
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
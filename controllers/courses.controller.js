import Course from "../models/courses.model.js";

export const loadSingleCourse = async (req, res) => {
    const _id  = req.query.id
    const course = await Course.findById(_id).lean()
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
    const docsCount = (await Course.find().lean()).length

    const props = {
        Courses : courses,
        current : page,
        start : page === 1,
        last : (options.page * options.limit) > docsCount,
        isAuth : req.session.isAuth
    }

    res.render('vwCourse/all', props)
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
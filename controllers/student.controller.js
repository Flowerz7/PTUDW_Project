import Student from '../models/students.model.js'
import Course from '../models/courses.model.js'
import SubCategory from '../models/subCategory.model.js'
import Category from '../models/categories.model.js'

export const addToWatchList = async (req, res) => {
    const {username, course_id} = req.body

    try {
        const course = await Course.findById(course_id).lean()
        const user = await Student.findOne({username})

        user.watchList = [...user.watchList, course._id]
        await user.save()

        res.json({isSuccess : true})
    }
    catch(e){
        res.json({isSuccess : false})
    } 

}

export const removeFromWatchList = async (req, res) => {
    const {username, course_id} = req.body

    try{
        const user = await Student.findOne({username})
        const index = user.watchList.indexOf(course_id)

        if (index > -1){
            user.watchList.splice(index, 1)
        }

        await user.save()

        res.json({isSuccess : true})
    }
    catch(e){
        res.json({isSuccess : false})
    }

}

export const checkWatchList = async (req, res) => {
    const username = req.query.username
    const courseID = req.query.id

    const user = await Student.findOne({ username }).populate('watchList').lean()
        
    var isInWatchList = false
    user.watchList.forEach(element => {
        if (element._id == courseID){
            isInWatchList = true;
        }
    })

    res.json({isInWatchList})
}

export const checkJoinedCourses = async (req, res) => {
    const username = req.query.username
    const courseID = req.query.id

    const user = await Student.findOne({ username })
        
    var isJoined = user.joinedCourses.indexOf(courseID) > -1
    res.json({isJoined})
}

export const addToJC = async (req, res) => {
    const { username, course_id } = req.body

    try{
        const user = await Student.findOne({ username })
        const course = await Course.findById(course_id)
        
        user.joinedCourses = [...user.joinedCourses, course]
        course.numOfStudent += 1

        const subcate = await SubCategory.find({name : course.category})
        subcate.subscribe += 1

        const cate = await Category.findById(subcate._id)
        cate.subscribe += 1

        await cate.save()
        await subcate.save()
        await user.save()
        await course.save()

        res.json({isSuccess : true})
    }
    catch (e) {
        res.json({isSuccess : false})
    }
}
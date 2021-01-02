import Student from '../models/students.model.js'
import Course from '../models/courses.model.js'

export const loadSingleStudent = async (req, res) => {
    const username = req.query.username
    const student = await Student.findOne({ username }).populate('watchList').populate('joinedCourses').lean()
    console.log(student)
    const props = {
        watchList : student.watchList,
        joinedCourses : student.joinedCourses,
        name : student.name,
        email : student.email
    }
    res.render('vwStudent/profile', props)
} 

export const addToWatchList = async (req, res) => {
    const username = req.query.username
    const courseID = req.query.id

    try {
        const course = await Course.findById(courseID).lean()
        const user = await Student.findOne({username})

        user.watchList = [...user.watchList, course._id]
        await user.save()

        res.json({isSuccess : true})
        return
    }
    catch(e){
        res.json({isSuccess : false})
    } 

}

export const removeFromWatchList = async (req, res) => {
    const username = req.query.username
    const courseID = req.query.id

    try{
        const user = await Student.findOne({username})
        const index = user.watchList.indexOf(courseID)

        if (index > -1){
            user.watchList.splice(index, 1)
        }

        await user.save()

        res.json({isSuccess : true})
        return
    }
    catch(e){
        res.json({isSuccess : false})
    }

}

export const checkWatchList = async (req, res) => {
    const username = req.query.username
    const courseID = req.query.courseId

    const user = await Student.findOne({ username }).populate('watchList').lean()
        
    var isInWatchList = false
    user.watchList.forEach(element => {
        if (element._id == courseID){
            isInWatchList = true;
        }
    })

    res.json({isInWatchList})
}
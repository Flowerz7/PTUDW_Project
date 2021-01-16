import Badge from '../models/badge.model.js'
import Course from '../models/courses.model.js'

export const setBadge = async () => {
    const courses = await Course.find().lean()
    const countBadgeContainer = await Badge.find().countDocuments()

    if (countBadgeContainer < 1){
        const BadgeContainer = new Badge({
            bestSeller: [],
            trendy: [],
            newBreeze: []
        })

        await BadgeContainer.save()
    }

    const badgeContainer = await Badge.findOne()

    badgeContainer.bestSeller = []
    badgeContainer.trendy = []
    badgeContainer.newBreeze = []

    courses.sort((course1, course2) => {
        return course2.numOfStudent - course1.numOfStudent
    })

    courses.map((item, index) => {
        if (index < 5 && item.numOfStudent !== 0){
            badgeContainer.bestSeller.push(item._id)
        }
    })

    courses.sort((course1, course2) => {
        return course2.view - course1.view
    })

    courses.map((item, index) => {
        if (index < 5 && item.view !== 0){
            badgeContainer.trendy.push(item._id)
        }
    })

    courses.sort((course1, course2) => {
        return course2.createdAt - course1.createdAt
    })

    courses.map((item, index) => {
        if (index < 5 && (item.createdAt - Date.now())/86400000 <= 7){
            badgeContainer.newBreeze.push(item._id)
        }
    })

    await badgeContainer.save()
}
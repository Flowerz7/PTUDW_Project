import Category from '../models/categories.model.js'

export const getCategories = async () => {
    const result = []
    // const categories = await Category.find().populate('subCategories').lean()

    // categories.forEach(cate => {
    //     let temp = {
    //         name : cate.name,
    //         subcates : []
    //     }

    //     cate.subCategories.forEach(subCate => {
    //         temp.subcates.push(subCate.name)
    //     })

    //     result.push(temp)
    // });

    return result
}
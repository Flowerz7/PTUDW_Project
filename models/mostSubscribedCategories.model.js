import mongoose from "mongoose";

const Schema = mongoose.Schema;

const mostSubscribedCategoriesSchema = new Schema({
    mostSubscribedCategories : [{
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
    }]
},
{
    timestamps : true
})

const MostSubscribedCategory = mongoose.model("MostSubscribedCategories", mostSubscribedCategoriesSchema);

export default MostSubscribedCategory;
const { Mongoose } = require("mongoose");
const Category = require("../models/Category");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

exports.createCategory = async (req,res) => {
    try{
        const {name,description} = req.body;

        if(!name){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
    
        const categoryDetails = await Category.create({
            name:name,
            description: description
        })
        console.log(categoryDetails)
    
        return res.status(400).json({
            success: true,
            message: "Category created successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.showAllCategories = async (req,res) => {
    try{
        const allCategories = await Category.find({});
        return res.status(200).json({
            success: true,
            data:allCategories
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.categoryPageDetails = async (req,res) => {
    try{
        const {categoryId} = req.body;
        const selectedCategory = await Category.findById(categoryId)
                                    .populate({
                                        path: "courses",
                                        match: { status: "Published" },
                                        populate: "ratingAndReviews",
                                      })
                                    .exec();

        if(selectedCategory.courses.length === 0){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        const differentCategory = await Category.find({ _id: { $ne: categoryId } }).populate({
            path: "courses",
            match: { status: "Published" }}).exec();

        const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },})
        .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10)

        res.status(200).json({
            success: true,
            data: {selectedCategory, differentCategory, mostSellingCourses}
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

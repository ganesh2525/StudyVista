const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req,res) => {
    try{
        const {sectionName,courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }

        const newSection = await Section.create({sectionName});

        console.log(courseId);
        console.log(newSection._id);

        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                        courseId,
                                        {
                                            $push: {
                                                courseContent: newSection._id,
                                            }
                                        },
                                        {new: true}
                                    ).populate({path: "courseContent",populate: {path: "subSection",}}).exec();            

        return res.status(200).json({
            success:true,
            message: "Section created successfully",
            updatedCourseDetails
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Something went wrong",
            error:error.message,
        })
    }
}

exports.updateSection = async (req,res) => {
    try {
        const {sectionName, sectionId , courseId} = req.body;                  //data input
        if(!sectionName || !sectionId) {                                      //data validation
            return res.status(400).json({success:false,  message:'Missing Properties', });
        }
        
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});            //it find section that id is matched with sectionid and in that section {sectionName} is updated;
                                                                                                         // await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true}); agar hm itna bhi likhe to koi effect nhi padega;
        const course = await Course.findById(courseId).populate({path:"courseContent" , populate:{path:"subSection"} , }).exec();
       
       return res.status(200).json({                                            //return res
            success:true,
            data:course,
            message:'Section Updated Successfully',
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, please try again",
            error:error.message,
        });
    }
};

 
// DELETE a section
exports.deleteSection = async (req, res) => {
	try {
		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {$pull: {courseContent: sectionId,}})                 

		const section = await Section.findById(sectionId);
		if(!section) {
			return res.status(404).json({success:false, message:"Section not Found",})	 
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({                               //here there is no use of const course , its only store updated course;
			path:"courseContent",                                                               // if you also write without  "const course = " then it also work;
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} 
    catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   
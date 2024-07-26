import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"



export default function EnrolledCourses() {

  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState([])

  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);              //fetch all the data of backend in res (all courses in which user enrolled)
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, [])

   
  return (
    <>
      <div className="text-2xl md:text-3xl text-richblack-50 text-center">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>  
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5"> You have not enrolled in any course yet. </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div className={`flex flex-col md:flex-row items-center rounded-t-lg border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"}`} key={i} >
              <div className="flex flex-col md:flex-row w-full cursor-pointer items-center gap-4 px-4 py-3"
                onClick={() => {navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}}
               >
                <div className="w-[100%] flex mx-auto">
                  <img src={course.thumbnail}  alt="course_img" className="mx-2 my-auto h-14 w-14 rounded-lg object-cover" />
                  <div className="flex max-w-xs flex-col gap-2">
                    <p className="font-semibold">{course.courseName}</p>
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.length > 50 ? `${course.courseDescription.slice(0, 50)}...` : course.courseDescription}  
                    </p>
                  </div>
                </div>
                <div className="flex w-full">
                  <p className="w-full">Duration: {course?.totalDuration}</p>
                  <div className="w-full flex flex-col gap-2">
                  <p>Progress: {course.progressPercentage || 0}%</p>
                  <ProgressBar completed={course.progressPercentage || 0} height="8px" isLabelVisible={false} />                {/* progressbar show how many percentange course is completed; */}
                </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
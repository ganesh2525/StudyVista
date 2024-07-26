import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"


export default function Instructor(){

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      console.log(instructorApiData)
      if (instructorApiData?.length) setInstructorData(instructorApiData)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  )

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  )

  return (
    
    <div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">  Hi {user?.firstName} 👋 </h1>
        <p className="font-medium text-richblack-200"> Let's start something new  </p>
      </div>

      {loading ? (
          <div className="grid place-items-center mt-60 ">
              <div className="spinner"></div>
          </div>  
       ) : courses?.length > 0 ? (
        <div className="flex flex-col gap-2">
            <div className="my-4 w-full flex flex-col gap-4 md:flex-row">

              {/* Render chart / graph */}
              {totalAmount > 0 || totalStudents > 0 ? (<InstructorChart courses={instructorData} />) : (
          
                <div className="rounded-2xl bg-richblack-800 p-6">
                  <p className="text-lg font-bold text-richblack-5">Visualize</p>
                  <p className="mt-4 text-xl font-medium text-richblack-50">Not Enough Data To Visualize</p>
                </div>
              )}

              {/* Total Statistics */}
              <div className="w-full md:w-[30%] flex flex-col rounded-2xl bg-richblack-800 p-6">

                <p className="text-lg my-5 font-bold text-richblack-5">Statistics</p>
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-lg text-richblack-200">Total Courses</p>
                    <p className="text-3xl font-semibold text-richblack-50">{courses?.length}</p>
                  </div>
                  <div>
                    <p className="text-lg text-richblack-200">Total Students</p>
                    <p className="text-3xl font-semibold text-richblack-50">{totalStudents} </p>
                  </div>
                  <div>
                    <p className="text-lg text-richblack-200">Total Income</p>
                    <p className="text-3xl font-semibold text-richblack-50"> Rs. {totalAmount} </p>
                  </div>
                </div>
            </div>
          </div>
          
          <div className="rounded-2xl bg-richblack-800 p-6">
            {/* Render 3 courses */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-md text-yellow-50">View All</p>
              </Link>
            </div>

            <div className="my-4 flex flex-col md:flex-row gap-4">
              {courses?.slice(0,3).map((course) => (
                <div key={course._id} className="w-full">
                  <img src={course?.thumbnail} alt={course?.courseName} className="h-[160px] md:h-[150px] lg:h-[180px] w-full rounded-2xl object-cover"/>
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50"> {course?.courseName} </p>
                    <div className="mt-1 flex items-center">
                      <p className="text-xs font-medium text-richblack-300">{course?.studentsEnroled?.length} students </p>
                      <p className="text-xs font-medium text-richblack-300"> |  </p>
                      <p className="text-xs font-medium text-richblack-300"> Rs. {course?.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-2xl bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5"> You have not created any courses yet</p> 
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50"> Create a course </p> 
          </Link>
        </div>
      )}

    </div>
  
)}

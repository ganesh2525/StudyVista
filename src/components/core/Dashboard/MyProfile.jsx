import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"

export default function MyProfile(){

  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()


  return (

    <div className="mx-auto">
      <h1 className="mb-5 text-2xl md:text-3xl font-medium text-richblack-5 text-center"> My Profile </h1>
        
      <div className="flex flex-col text-xl lg:flex-row items-center justify-between rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 md:p-12 gap-5">
       
        <div className="flex flex-col items-center gap-2 lg:flex-row lg:gap-4">
          <img src={user?.image} alt={`profile-${user?.firstName}`} className="aspect-square w-[60px] lg:w-[70px] rounded-full object-cover"  />
          
          <div className="flex flex-col items-center justify-center gap-y-2 lg:items-start">
            <p className="text-lg font-semibold text-richblack-5"> {user?.firstName + " " + user?.lastName} </p>
            <p className="text-base text-richblack-100">{user?.email}</p>
          </div>
        </div>
        <IconBtn text="Edit" onclick={() => {navigate("/dashboard/settings")}} >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      <div className="my-5 flex flex-col gap-y-10 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 md:p-12">
     
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn text="Edit" onclick={() => {navigate("/dashboard/settings")}}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p className={`${user?.additionalDetails?.about ? "text-richblack-100" : "text-richblack-600"} text-base font-medium`} >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>

      </div>

      <div className="my-5 flex flex-col gap-y-10 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 md:p-12">
       
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5"> Personal Details </p>
          <IconBtn text="Edit" onclick={() => {navigate("/dashboard/settings")}} >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="flex flex-col lg:flex-row max-w-[500px] justify-between">

          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-base text-richblack-600">First Name</p>
              <p className="text-base text-richblack-100"> {user?.firstName} </p>
            </div>
            <div>
              <p className="mb-2 text-base text-richblack-600">Email</p>
              <p className="text-base text-richblack-100"> {user?.email} </p>
            </div>
            <div>
              <p className="mb-2 text-base text-richblack-600">Gender</p>
              <p className="text-base text-richblack-100"> {user?.additionalDetails?.gender ?? "Add Gender"} </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-base text-richblack-600">Last Name</p>
              <p className="text-base text-richblack-100"> {user?.lastName} </p>
            </div>
            <div>
              <p className="mb-2 text-base text-richblack-600">Phone Number</p>
              <p className="text-base text-richblack-100"> {user?.additionalDetails?.contactNumber ?? "Add Contact Number"} </p>
            </div>
            <div>
              <p className="mb-2 text-base text-richblack-600">Date Of Birth</p>
              <p className="text-base text-richblack-100">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??  "Add Date Of Birth"}   
              </p>
            </div>
          </div>
          
        </div>

      </div>

    </div>
  
)}
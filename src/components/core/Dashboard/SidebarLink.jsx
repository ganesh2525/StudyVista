import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { resetCourseState } from "../../../slices/courseSlice"


export default function SidebarLink({ link, iconName }) {

  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (

    <NavLink to = {link.path} onClick = {() => dispatch(resetCourseState())}
             className = {`relative w-full md:px-8 md:py-2 text-sm font-medium ${matchRoute(link.path) ? "bg-yellow-800 text-yellow-50" : "bg-opacity-0 text-richblack-300" } transition-all duration-200`} >
     
      <span className={`hidden md:block absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${matchRoute(link.path) ? "opacity-100" : "opacity-0" }`}></span>
      <span className={`block md:hidden absolute left-0 bottom-0 w-full h-[0.15rem] bg-yellow-50 ${matchRoute(link.path) ? "opacity-100" : "opacity-0" }`}></span>
                                                                                  {/* here matchRoute means link is opened or not , if opened then its color is yellow  */}
      <div className="flex py-3 md:py-0 justify-center md:justify-start md:gap-x-2">
        <Icon className="text-lg" />              {/* Icon Goes Here */}
        <span className="hidden md:block">{link.name}</span>
      </div>

    </NavLink>
  
)}
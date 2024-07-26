import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar(){

  const { user, loading: profileLoading } = useSelector( (state) => state.profile )
  const { loading: authLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)               // to keep track of confirmation modal

  if(profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col fixed md:relative bottom-0 left-0 w-full z-50  md:h-[calc(100vh-3.5rem)] md:min-w-[220px] md:max-w-[220px] md:border-r-[1px] md:border-r-richblack-700 bg-richblack-800 md:py-10">
        <div className="border border-t-richblack-700 md:border-none flex items-center justify-between md:flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
          <SidebarLink link={{ name: "Settings", path: "/dashboard/settings" }} iconName="VscSettingsGear" />
          <button className="w-full md:px-8 md:py-2 text-sm font-medium text-richblack-300"
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
          >
            <div className="flex justify-center md:justify-start gap-x-2">
              <VscSignOut className="text-lg" />
              <span className="hidden md:block">Logout</span>
            </div>
          </button>
        </div>
        <div className="hidden md:block mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
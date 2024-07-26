import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth); // fetch token from auth reducer using useSelector hook
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const location = useLocation(); // location is used for location.pathname

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // state to manage mobile menu visibility
  const [catalogOpen, setCatalogOpen] = useState(false); // state to manage catalog submenu visibility

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  function matchRoute(route) {
    // if route is matched with (current route) then return true and color of text turn yellow otherwise white;
    return matchPath({ path: route }, location.pathname);
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />{" "}
          {/* Logo */}
        </Link>

        <nav className="hidden md:block"> {/* Navigation links */}
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p> {link.title} </p> <BsChevronDown />{" "}
                      {/* "Catalog \/" */}
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        {loading ? (
                          <p className="text-center"> Loading... </p>
                        ) : subLinks?.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={` ${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      } `}
                    >
                      {" "}
                      {link.title}{" "}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            // if user is present(login) and user is not instructor then we show cart icon in place of login and signup;
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />{" "}
              {/* icon of cart */}
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}{" "}
                  {/* no of item(courses) present in cart , we take it absolute because we want to overlap it over cart icon */}
                </span>
              )}
            </Link>
          )}

          {/* if token === null then user are not login so we show login icon and sign icon  */}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                {" "}
                Log in
              </button>
            </Link>
          )}

          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropdown />}{" "}
          {/* added profile dropdown if token is not equal to null means user is present*/}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {" "}
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />{" "}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mt-10 p-5 fixed top-0 right-0 max-h-max w-64 rounded-3xl border border-richblack-5 bg-richblack-800 text-richblack-25 transition-transform transform ${
          mobileMenuOpen ? "m-10 translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <button
          className="absolute top-4 right-4 text-richblack-100"
          onClick={() => setMobileMenuOpen(false)}
        >
          <AiOutlineClose fontSize={24} />
        </button>

        <ul className="flex flex-col items-center p-4 mt-8">
          {NavbarLinks.map((link, index) => (
            <li className="my-2 w-full" key={index}>
              {link.title === "Catalog" ? (
                <>
                  <div
                    className={`group flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                    onClick={() => setCatalogOpen(!catalogOpen)} // Toggle catalog visibility
                  >
                    <p> {link.title} </p> <BsChevronDown />
                  </div>
                  {catalogOpen && (
                    <div className="w-full flex flex-col rounded-md bg-richblack-5 p-1 text-richblack-900">
                      {loading ? (
                        <p className="text-center"> Loading... </p>
                      ) : subLinks?.length ? (
                        <>
                          {subLinks
                            ?.filter((subLink) => subLink?.courses?.length > 0)
                            ?.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="rounded-md bg-transparent hover:bg-richblack-50"
                                key={i}
                                onClick={() => setMobileMenuOpen(false)} // Close menu after selecting a link
                              >
                                <p className="border-b">{subLink.name}</p>
                              </Link>
                            ))}
                        </>
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link to={link?.path} onClick={() => setMobileMenuOpen(false)}> {/* Close menu after selecting a link */}
                  <p
                    className={` ${
                      matchRoute(link?.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    } `}
                  >
                    {" "}
                    {link.title}{" "}
                  </p>
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-row items-center gap-4 md:mt-4 md:flex-col md:items-center md:justify-center">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative pl-5">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}

          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

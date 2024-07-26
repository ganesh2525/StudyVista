import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"
import Course_Card from '../components/core/Catalog/Course_Card'


const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
    const { catalogName } = useParams()
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogaPageData(categoryId);
                setCatalogPageData(res);
            }
            catch(error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        } 
   },[categoryId]);


    if(loading || !catalogPageData){
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

    if(!loading && !catalogPageData.success) return <Error />
        
    
      return (
        <>
          {/* Hero Section */}
          <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `} <span className="text-yellow-25"> {catalogPageData?.data?.selectedCategory?.name} </span>
              </p>
              <p className="text-3xl text-richblack-5"> {catalogPageData?.data?.selectedCategory?.name} </p>
              <p className="max-w-[870px] text-richblack-200"> {catalogPageData?.data?.selectedCategory?.description} </p>
            </div>
          </div>
    
          {/* Section 1 */}
          <div className="hidden md:block mx-auto w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">

            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm"></div>
            <div className="w-full mx-auto">
              <CourseSlider Courses = {catalogPageData?.data?.selectedCategory?.courses} />
            </div>

          </div>

          <div className="block md:hidden mx-auto w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">

            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm"></div>
            <div className="flex flex-col">
              {
                catalogPageData?.data?.selectedCategory?.courses?.map((course)=>(
                  <Course_Card course={course} Height={"h-[150px]"} />
                ))
              }
            </div>
          </div>

          {/* Section 2 */}
          
          <div className="hidden md:block mx-auto w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            {catalogPageData?.data?.differentCategory?.map((category) => (
            <div key={category.id}> {/* Add a unique key if available */}
              {category.courses.length > 0 && (
                <div>
                  <div className="section_heading">
                    All Courses in {category.name}
                  </div>
                  <div className="my-4 flex border-b border-b-richblack-600 text-sm"></div>
                  <div>
                    <CourseSlider Courses={category.courses} />
                  </div>
                </div>
              )}
            </div>
            ))}
          </div>

          <div className="block md:hidden mx-auto w-full max-w-maxContentTab px-4 lg:max-w-maxContent">
            {catalogPageData?.data?.differentCategory?.map((category) => (
            <div key={category.id}> {/* Add a unique key if available */}
              {category.courses.length > 0 && (
                <div>
                  <div className="section_heading">
                    All Courses in {category.name}
                  </div>
                  <div className="my-4 flex border-b border-b-richblack-600 text-sm"></div>
                  <div className="flex flex-col">
                  {category.courses?.map((course, i) => (
                    <Course_Card course={course} Height={"h-[150px]"} />
                  ))}
                  </div>
                </div>
              )}
            </div>
            ))}
          </div>


          <Footer/>
        </>
      
)}
 

 export default Catalog
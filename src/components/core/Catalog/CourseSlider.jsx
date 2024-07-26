import React from 'react'
import "./swiper.css"
import {Swiper, SwiperSlide} from "swiper/react"                           //this is the slider"swiper" which contain many type of slider     
import "swiper/css/bundle";
import { Autoplay, Pagination, Navigation } from "swiper/modules";                                                  //only we have to insert data into slider and styling or position 
import Course_Card from './Course_Card'


const CourseSlider = ({Courses}) => { 

  return (
    <>
      {Courses?.length ? (
        <Swiper 
        spaceBetween={30}
        pagination={ { clickable: true }}
        navigation= {true}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        loop={true}
        slidesPerView={3}
        modules={[Autoplay, Pagination, Navigation]} >
          {Courses?.map((course, i) => (
            <SwiperSlide key = {i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
            ) : ( <p className="text-xl text-richblack-5">No Course Found</p> )
         
       }
    </>
  
)}


export default CourseSlider

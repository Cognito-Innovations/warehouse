"use client";

import React from "react";
import { Box } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; 

const dummyImages = [
  "/carousel/carousel1.jpg",
  "/carousel/carousel2.jpg",
  "/carousel/carousel3.jpg",
];

const EcommerceCarousel: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    adaptiveHeight: true,

  };

  return (
    <Box sx={{ mb: 3 }}>
      <Slider {...settings}>
        {dummyImages.map((img, index) => (
          <Box key={index} sx={{ position: "relative", px: 1 }}>
            <img
              src={img}
              alt={`carousel-${index}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default EcommerceCarousel;
"use client";

import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; 

const dummyImages = [
  "/carousel/carousel1.jpg",
  "/carousel/carousel2.jpg",
  "/carousel/carousel3.jpg",
];

const EcommerceCarousel: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isDesktop ? 3 : 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    adaptiveHeight: false,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 4000,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 4000,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 4000,
        }
      }
    ]
  };

  return (
    <Box 
      sx={{ 
        mt: { xs: 3, sm: 4, md: 3 },
        mb: { xs: 6, sm: 7, md: 2 },
        "& .slick-slider": {
          margin: "0 auto",
        },
        "& .slick-list": {
          margin: { xs: "0 -8px", sm: "0 -12px", md: "0 -6px" },
        },
        "& .slick-slide": {
          padding: { xs: "0 8px", sm: "0 12px", md: "0 6px" },
        },
        "& .slick-dots": {
          bottom: { xs: "-32px", sm: "-36px", md: "-40px" },
          "& li": {
            margin: { xs: "0 4px", sm: "0 6px" },
          },
          "& li button:before": {
            fontSize: { xs: "10px", sm: "12px" },
            color: "#9ca3af",
            opacity: 0.6,
          },
          "& li.slick-active button:before": {
            color: "#7c3aed",
            opacity: 1,
          },
        },
      }}
    >
      <Slider key={isDesktop ? 'desktop' : 'mobile'} {...settings}>
        {dummyImages.map((img, index) => (
          <Box 
            key={index} 
            sx={{ 
              position: "relative",
              height: { xs: "180px", sm: "220px", md: "260px", lg: "280px" },
              borderRadius: "12px",
              
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            <img
              src={img}
              alt={`carousel-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default EcommerceCarousel;
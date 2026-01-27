import { useCallback, useEffect, useRef, useState } from "react";
import {useMediaQuery, useTheme } from "@mui/material";
import { debounce } from "@/utils/debounce";
import CategorySection from "../ecommerce/category_temp/CategorySection";
import useCategoryStore from "@/store/categoryStore";
import { useDetectUserLocation } from "@/hooks/useDetectUserLocation";

const Category = ({ slug }: { slug: string | undefined }) => {
    const { countryCode } = useDetectUserLocation();
    const theme = useTheme();
    const skeletonRef = useRef<HTMLDivElement | null>(null);
    const [rowHeight, setRowHeight] = useState(300);
    const isSm = useMediaQuery(theme.breakpoints.up('sm'));

    const [categoryBottom, setCategoryBottom] = useState(100);
    const { getCategories, selectedCategory, setCategory } = useCategoryStore();

    const syncCategoryWithSlug = useCallback(() => {
        const nextCategory = slug ?? null;
        if (nextCategory !== selectedCategory) {
          setCategory(nextCategory);
        }
      }, [slug, selectedCategory, setCategory]);

    useEffect(() => {
    syncCategoryWithSlug();
    }, []);

    const fetchCategoryList = useCallback(() => {
    if (!countryCode) return [];
    getCategories(countryCode);
    }, [countryCode, getCategories]);

    useEffect(() => {
        fetchCategoryList();
    }, [fetchCategoryList]);

    useEffect(() => {
        const measureLayout = () => {
            if (skeletonRef.current) {
                const cardHeight = skeletonRef.current.getBoundingClientRect().height;
                const gap = parseFloat(theme.spacing(isSm ? 2 : 1));
                setRowHeight(cardHeight + gap);
            }
            if (categoryRef.current) {
                setCategoryBottom(categoryRef.current.getBoundingClientRect().bottom);
            }
        };

        const timer = setTimeout(measureLayout, 0);
        // Add resize listener specific to layout shifts
        const handleResize = debounce(measureLayout, 200);
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", handleResize);
        };
    }, [isSm, theme]);


    const categoryRef = useRef<HTMLDivElement | null>(null);
    return (
        <div ref={categoryRef}>
            <CategorySection />
        </div>
    )
}

export default Category
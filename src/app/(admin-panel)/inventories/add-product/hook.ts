"use client";

import { useState } from "react";
import { getCategories } from "@/services/category";
import { getBrands } from "@/services/brand";
import { getColors } from "@/services/color";
import { getSizes } from "@/services/size";
import { Brands, Categories, Colors, Sizes } from "@/types/shared";

export const useProductAuxiliaryData = () => {
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [colors, setColors] = useState<Colors[]>([]);
  const [sizes, setSizes] = useState<Sizes[]>([]);

  const fetchCategories = async () => {
    setIsApiLoading(true);
    const data = await getCategories();
    setCategories(data);
    setIsApiLoading(false);
  };

  const fetchBrands = async () => {
    setIsApiLoading(true);
    const data = await getBrands();
    setBrands(data);
    setIsApiLoading(false);
  };

  const fetchColors = async () => {
    setIsApiLoading(true);
    const data = await getColors();
    setColors(data);
    setIsApiLoading(false);
  };

  const fetchSizes = async () => {
    setIsApiLoading(true);
    const data = await getSizes();
    setSizes(data);
    setIsApiLoading(false);
  };

  const fetchAll = async () => {
    setIsApiLoading(true);
    await fetchCategories();
    await fetchBrands();
    await fetchColors();
    await fetchSizes();
    setIsApiLoading(false);
  };


  return {
    isApiLoading,
    categories,
    brands,
    colors,
    sizes,
    fetchAll,
    fetchCategories,
    fetchBrands,
    fetchColors,
    fetchSizes,
  };
};

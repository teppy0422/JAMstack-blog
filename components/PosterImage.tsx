import React, { useState, useEffect } from "react";
import { Image } from "@chakra-ui/react";

const filters = [
  "sepia(0.6)",
  "sepia(0.4)",
  "sepia(0.2)",
  "none",
  "sepia(0.2)",
  "sepia(0.4)",
];

interface FilteredImageProps {}
const FilteredImage: React.FC<FilteredImageProps> = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([
    "/images/poster/poster001.webp",
    "/images/poster/poster002.webp",
    "/images/poster/poster003.webp",
    "/images/poster/poster004.webp",
    "/images/poster/poster005.webp",
    "/images/poster/poster006.webp",
    "/images/poster/poster007.webp",
    "/images/poster/poster008.webp",
    "/images/poster/poster009.webp",
    "/images/poster/poster010.webp",
    "/images/poster/poster011.webp",
    "/images/poster/poster012.webp",
    "/images/poster/poster013.webp",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * images.length);
      setImageIndex(randomIndex);
    }, 60000); // 60秒ごとにランダムな画像を選択

    return () => clearInterval(interval); // クリーンアップ
  }, [images.length]);

  const handleImageClick = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length); // クリックで次の画像に変更
  };

  const [filterIndex, setFilterIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setFilterIndex((prevIndex) => (prevIndex + 1) % filters.length);
    }, 10000); // 10秒ごとにフィルターを切り替え
    return () => clearInterval(interval); // クリーンアップ
  }, []);

  return (
    <Image
      src={images[imageIndex]}
      filter={filters[filterIndex]}
      transition="filter 10s ease-in-out" // フィルター変更時のトランジション
      width="auto"
      onClick={handleImageClick} // クリックイベントを追加
    />
  );
};

export default FilteredImage;

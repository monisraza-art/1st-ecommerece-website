"use client"

import { ImgHTMLAttributes, useEffect, useState } from "react";
import { media as wixMedia } from "@wix/sdk";

type WixImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  mediaIdentifier: string | undefined;
  placeholder?: string;
  alt?: string | null | undefined;
  width: number;
  height: number;
};

export default function WixImage({
  mediaIdentifier,
  placeholder = "/placeholder.png",
  alt,
  width,
  height,
  ...props
}: WixImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (mediaIdentifier) {
      const computedImageUrl = wixMedia.getScaledToFillImageUrl(
        mediaIdentifier,
        width,
        height,
        {}
      );
      setImageUrl(computedImageUrl); // Only set image URL on the client side
    }
  }, [mediaIdentifier, width, height]);

  // Return a placeholder image if the URL is not yet computed
  return (
    <img
      src={imageUrl || placeholder}
      alt={alt || ""}
      width={width}
      height={height}
      className="blurred-placeholder" // You can use TailwindCSS for a blur effect
      {...props}
    />
  );
}

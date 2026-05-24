"use client";

import React, { useState, useEffect } from "react";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

export default function UserAvatar({ src, alt = "User avatar", className = "w-10 h-10 rounded-full" }: UserAvatarProps) {
  const [imgSrc, setImgSrc] = useState<string>("/avatar.png");

  useEffect(() => {
    if (src && src.trim() !== "") {
      setImgSrc(src);
    } else {
      setImgSrc("/avatar.png");
    }
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== "/avatar.png") {
          setImgSrc("/avatar.png");
        }
      }}
      className={`object-cover shrink-0 ${className}`}
    />
  );
}

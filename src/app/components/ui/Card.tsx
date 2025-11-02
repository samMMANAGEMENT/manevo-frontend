import React from "react";

interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function Card({
  title,
  description,
  image,
  onClick,
  children,
}: CardProps) {
  return (
    <div
      className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-4">
        {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
        {description && <p className="text-gray-600 text-sm mb-3">{description}</p>}
        {children}
      </div>
    </div>
  );
}

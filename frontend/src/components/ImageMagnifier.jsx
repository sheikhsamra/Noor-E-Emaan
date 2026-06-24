import React, { useState } from "react";

const ImageMagnifier = ({
  src,
  width = "100%",
  height = "100%",
  magnifierSize = 210,
  zoomLevel = 2.3,
  imgClassName,
}) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  const imageSrc =
    src?.startsWith("http") || src?.startsWith("/") ? src : `/${src}`;

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-crosshair"
      style={{ width, height }}
    >
      <img
        src={imageSrc}
        alt="Product"
        className={imgClassName ?? "w-full h-full object-contain object-center p-4 sm:p-6 lg:p-8 transition-transform duration-700 hover:scale-[1.02]"}
        onMouseEnter={(e) => {
          const { width, height } = e.currentTarget.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          const elem = e.currentTarget;
          const { top, left } = elem.getBoundingClientRect();
          setXY([
            e.pageX - left - window.pageXOffset,
            e.pageY - top - window.pageYOffset,
          ]);
        }}
        onMouseLeave={() => setShowMagnifier(false)}
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/700x900?text=Image+Not+Found";
        }}
      />

      {showMagnifier && (
        <div
          className="hidden lg:block"
          style={{
            position: "absolute",
            pointerEvents: "none",
            height: `${magnifierSize}px`,
            width: `${magnifierSize}px`,
            top: `${y - magnifierSize / 2}px`,
            left: `${x - magnifierSize / 2}px`,
            border: "2px solid #8A5A44",
            borderRadius: "50%",
            backgroundColor: "#fff",
            backgroundImage: `url('${imageSrc}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPositionX: `${-x * zoomLevel + magnifierSize / 2}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierSize / 2}px`,
            boxShadow: "0 25px 60px rgba(63,49,43,0.25)",
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;
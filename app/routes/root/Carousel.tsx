import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Using react-icons for arrows

// Define the type for a carousel item
interface CarouselItem {
  src: string;
  alt: string;
}

// Define props for the Carousel component
interface CarouselProps {
  images: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const CARD_LENGTH = images.length;
  const TRANSITION_DURATION_MS = 800; // Must match the CSS transition duration

  // --- Core Logic Functions ---
  const updateCarousel = useCallback(
    (newIndex: number) => {
      if (isAnimating || CARD_LENGTH === 0) return;
      setIsAnimating(true);

      const normalizedIndex =
        (newIndex % CARD_LENGTH) + (newIndex < 0 ? CARD_LENGTH : 0);
      setCurrentIndex(normalizedIndex);

      // Reset animation state after the transition duration
      setTimeout(() => {
        setIsAnimating(false);
      }, TRANSITION_DURATION_MS);
    },
    [isAnimating, CARD_LENGTH]
  );

  // Click handler for navigation arrows
  const handleNavigation = useCallback(
    (direction: "prev" | "next") => {
      if (direction === "prev") {
        updateCarousel(currentIndex - 1);
      } else {
        updateCarousel(currentIndex + 1);
      }
    },
    [currentIndex, updateCarousel]
  );

  // ✅ CORRECTED: Click handler for cards (to center the clicked card)
  const handleCardClick = useCallback(
    (index: number) => {
      updateCarousel(index);
    },
    [updateCarousel]
  );

  // --- Side Effects (Keyboard/Swipe) ---

  // Keyboard navigation (ArrowLeft/ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleNavigation("prev");
      } else if (e.key === "ArrowRight") {
        handleNavigation("next");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleNavigation]);

  // Touch/Swipe Logic
  useEffect(() => {
    let touchStartX = 0;
    const swipeThreshold = 50;
    const container = document.querySelector(".carousel-container");

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          handleNavigation("next"); // Swipe left (show next)
        } else {
          handleNavigation("prev"); // Swipe right (show previous)
        }
      }
    };

    if (container) {
      container.addEventListener(
        "touchstart",
        handleTouchStart as EventListener
      );
      container.addEventListener("touchend", handleTouchEnd as EventListener);
    }

    return () => {
      if (container) {
        container.removeEventListener(
          "touchstart",
          handleTouchStart as EventListener
        );
        container.removeEventListener(
          "touchend",
          handleTouchEnd as EventListener
        );
      }
    };
  }, [handleNavigation]);

  // ✅ CORRECTED: Use inline style for the 3D transforms since they are complex
  const getCardStyle = (index: number): React.CSSProperties => {
    // Calculate the offset from the current center index
    let offset = (index - currentIndex + CARD_LENGTH) % CARD_LENGTH;

    // Normalize offset for continuous look (e.g., -1 for left-1, 1 for right-1)
    if (offset > CARD_LENGTH / 2) {
      offset = offset - CARD_LENGTH;
    }

    // Define the transform based on the offset
    let transform = "scale(0.5) translateZ(-500px)"; // Default hidden (far away)
    let zIndex = 1;
    let opacity = 0;
    let filter = "grayscale(100%)";
    let pointerEvents: "none" | "auto" = "none";
// 3D positioning logic
    if (offset === 0) {
      // Center Card (front and center)
      transform = "scale(1.1) translateZ(0)";
      zIndex = 10;
      opacity = 1;
      filter = "none";
      pointerEvents = "auto";
    } else if (offset === -1) {
      // Left-1 Card
      transform = "translateX(-200px) scale(0.9) translateZ(-100px)";
      zIndex = 5;
      opacity = 1;
      pointerEvents = "auto";
    } else if (offset === 1) {
      // Right-1 Card
      transform = "translateX(200px) scale(0.9) translateZ(-100px)";
      zIndex = 5;
      opacity = 1;
      pointerEvents = "auto";
    } else if (offset === -2) {
      // Left-2 Card
      transform = "translateX(-400px) scale(0.8) translateZ(-300px)";
      zIndex = 1;
      opacity = 1;
    } else if (offset === 2) {
      // Right-2 Card
      transform = "translateX(400px) scale(0.8) translateZ(-300px)";
      zIndex = 1;
      opacity = 1;
    }

    return {
      transform,
      zIndex,
      opacity,
      filter,
      pointerEvents,
      transition: `all ${TRANSITION_DURATION_MS / 1000}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    };
  };

  if (CARD_LENGTH === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No tour images to display.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-16 bg-gray-50">
      {/* --- Carousel Container (The Viewport) --- */}
      <div
        className="carousel-container relative w-full max-w-[1200px] h-[450px]"
        style={{ perspective: "1000px" }} // 3D effect depth
      >
        {/* Navigation Arrows */}
        <button
          className="absolute top-1/2 -translate-y-1/2 left-4 bg-green-600/60 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all hover:bg-black hover:scale-110"
          onClick={() => handleNavigation("prev")}
          aria-label="Previous Image"
        >
          <FaChevronLeft className="text-xl" />
        </button>

        {/* --- Carousel Track (The Moving Element) --- */}
        <div
          className="carousel-track w-full h-full flex justify-center items-center relative"
          style={{ transformStyle: "preserve-3d" }} // Key for 3D effect
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="card absolute w-[280px] h-[380px] bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              style={getCardStyle(index)}
              onClick={() => handleCardClick(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <button
          className="absolute top-1/2 -translate-y-1/2 right-4 bg-green-600/60 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all hover:bg-black hover:scale-110"
          onClick={() => handleNavigation("next")}
          aria-label="Next Image"
        >
          <FaChevronRight className="text-xl" />
        </button>
      </div>

      {/* --- Dots (Pagination) --- */}
      <div className="dots flex justify-center gap-2 mt-16">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              index === currentIndex
                ? "bg-green-600 scale-125"
                : "bg-green-600/30"
            }`}
            onClick={() => updateCarousel(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
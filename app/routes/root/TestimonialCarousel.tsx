import React from "react";

import TestimonialCard from "./TestimonialCard";
interface Testimonial {
  text: string;
  avatar: string;
  name: string;
  rating: number;
}

// Mock testimonial data
const testimonials: Testimonial[] = [
  {
    text: "Intuitive interface. Lightning-fast performance. Reliable security. Perfect for any business.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=160&h=160&auto=format&fit=crop",
    name: "Michael Thompson",
    rating: 5,
  },
  {
    text: "Amazing experience! Everything was smooth and professional.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=160&h=160&auto=format&fit=crop",
    name: "Sarah Williams",
    rating: 4,
  },
  {
    text: "Great support and easy to use. Highly recommended!",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=160&h=160&auto=format&fit=crop",
    name: "John Doe",
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  return (
    <div
      id="testimonial-carousel"
      className="relative w-full"
      data-carousel="slide"
    >
      {/* Carousel wrapper */}
      <div className="relative h-96 overflow-hidden rounded-base">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="hidden duration-700 ease-in-out"
            data-carousel-item
          >
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>

      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {testimonials.map((_, index) => (
          <button
            key={index}
            type="button"
            className="w-3 h-3 rounded-base"
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            data-carousel-slide-to={index}
          ></button>
        ))}
      </div>

      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 group-hover:bg-white/50">
          <svg
            className="w-5 h-5 text-white rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m15 19-7-7 7-7"
            />
          </svg>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 group-hover:bg-white/50">
          <svg
            className="w-5 h-5 text-white rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m9 5 7 7-7 7"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}

// TestimonialCard.tsx
import React from "react";

export interface Testimonial {
  text: string;
  avatar: string;
  name: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-white/40 p-6 shadow-sm shadow-zinc-300 backdrop-blur-xs mb-4">
      <div className="flex flex-col gap-5 rounded-xl bg-white p-10 text-center shadow-sm">
        <div className="flex items-center justify-center gap-1 text-amber-500">
          {Array.from({ length: testimonial.rating }).map((_, j) => (
            <svg
              key={j}
              className="hi-mini hi-star inline-block size-7"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
        <p className="text-xl/relaxed font-semibold text-black">
          {testimonial.text}
        </p>
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="mx-auto aspect-square w-20 rounded-full object-cover shadow-sm ring-4 ring-amber-500/50"
        />
        <div className="text-sm">
          <span className="text-lg font-semibold text-black">
            {testimonial.name}
          </span>
        </div>
      </div>
    </div>
  );
}

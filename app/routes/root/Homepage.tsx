import React, { useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaBars,
  FaTimes,
  FaTelegram,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router";
import { homeSidebarItems } from "~/constants";
import { useNavigate } from "react-router";
import { useLoaderData } from "react-router";
import { cn, formatDate } from "~/lib/utils";
import { getAllPosts } from "~/appwrite/posts";
import { getUser } from "~/appwrite/auth";
import type { Route } from "./+types/Homepage";
import Carousel from "./Carousel";
//flow bite imports
import "flowbite";
import { useEffect } from "react"; // ⭐ add this here (new)
import { initFlowbite } from "flowbite"; // ⭐ add this here (new)
import TestimonialCarousel from "./TestimonialCarousel";

export const clientLoader = async () => {
  const [user, posts] = await Promise.all([getUser(), getAllPosts(3, 0)]);

  const allPosts = posts.allPosts.map(
    ({
      $id,
      postDetails,
      title,
      location,
      tags,
      imageUrls,
      tittleDescription,
      createdAt,
    }) => {
      let details = {};

      try {
        details =
          typeof postDetails === "string"
            ? JSON.parse(postDetails)
            : postDetails;
      } catch (e) {
        console.error("Invalid JSON in postDetails", postDetails);
      }

      return {
        id: $id,
        ...details,
        location,
      };
    }
  ) as any[];
  return { user, allPosts };
};

const tourCarouselImages = [
  // FIX 1: Path corrected to include 'new/' folder
  // FIX 2: Alt text simplified to only use the image name
  { src: "/assets/icons/Hambericho777.jpg", alt: "h2.jpg" },
  { src: "/assets/images/photo/sarobira.jpg", alt: "sarobira.jpg" },
  { src: "/assets/images/Ham1.jpg", alt: "h4.jpg" },
  { src: "/assets/images/photo/hanakalo.jpg", alt: "hanakalo.jpg" },
  { src: "/assets/images/abiy.jpg", alt: "h6.jpg" },
  { src: "/assets/images/culturalfood2.jpg", alt: "h7.jpg" },
  { src: "/assets/images/culturalfood3.jpg", alt: "h8.jpg" },
  { src: "/assets/images/culturalfood4.jpg", alt: "h8.jpg" },
  {
    src: "/assets/images/photo/AJORA SINGLE PHOTO.jpg",

    alt: "ajora single photo.jpg",
  },
  { src: "/assets/images/photo/Aziga.jpg", alt: "Aziga.jpg" },
  { src: "/assets/images/photo/Doje waterfall.jpg", alt: "Doje waterfall.jpg" },
  { src: "/assets/images/photo/AYIB.jpg", alt: "AYIB.jpg" },
];

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const user = loaderData.user as User | null;
  const { allPosts } = loaderData;
  console.log("allPosts", allPosts);

  // ⭐Initialize Flowbite(new)
  useEffect(() => {
    initFlowbite();
  }, []);

  // const user = useLoaderData();
  const navigate = useNavigate();
  const hanldeLogout = () => {
    navigate("/sign-in");
  };

  const path = useLocation();
  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      <section className="hidden lg:block my-2">
        <header className="hidden lg:block fixed top-0 left-0 right-0 w-full bg-white shadow z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/assets/images/Visit-kembata-logo.jpg"
                  alt="Visit Kembata"
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-lg font-bold text-green-700">
                  VISIT KEMBATA
                </span>
              </Link>

              {/* Center: horizontal nav links (no social icons) */}
              <nav
                aria-label="Main navigation"
                className="flex gap-4 items-center"
              >
                {homeSidebarItems.map(({ id, href, icon, label }) => (
                  <NavLink
                    key={id}
                    to={href}
                    className="inline-flex items-center"
                  >
                    {({ isActive }: { isActive: boolean }) => (
                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded transition",
                          {
                            "bg-green-400 !text-white": isActive,
                            "text-gray-700 hover:bg-green-400": !isActive,
                          }
                        )}
                      >
                        <img
                          src={icon}
                          alt={label}
                          className={`group-hover:brightness-0 size-5 group-hover:invert w-5 h-5 object-contain ${isActive ? "brightness-0 invert" : "text-green-500"}`}
                        />
                        <span className="hidden md:inline-block font-medium">
                          {label}
                        </span>
                      </div>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Right: compact user block */}
              <div className="flex items-center gap-3">
                <img
                  src={user?.imageUrl ?? "/assets/images/david.webp"}
                  alt={user?.name ?? "User"}
                  className="w-9 h-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={hanldeLogout}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </header>
      </section>
      <section>
        <div className="flex items-center justify-start mx-8 font-bold">
          <article>
            <h4 className="text-green-500 text-3xl lg:text-5xl font-bold my-10 text-center">
              Visit Kembata
            </h4>
          </article>

          <div></div>
        </div>
      </section>

      {/* 🏞 3D Image Carousel Section */}
      <section className="w-full bg-gray-50 py-10">
        {/* <h3 className="text-3xl font-bold text-center mb-10 bg-green-200 lg:mx-37 text-green-500 p-4 rounded-2xl">
          Popular Destinations
        </h3> */}
        <Carousel images={tourCarouselImages} />
      </section>

      {/* Hero Section */}

      {/* Destinations Grid */}
      {/* <section className="py-16 bg-gray-50 mx-4">
        <div></div>
      </section> */}
      <section>
        <div className="flex justify-center items-center my-1 gap-2 flex-wrap mx-2">
          {allPosts
            .slice(0, 4)
            .map(
              ({
                id,
                title,
                tags,
                imageUrls,
                titleDescription,
                createdAt,
                location,
              }) => (
                <div className="flex justify-center items-center my-5 gap-6 flex-wrap mx-2">
                  <Link
                    to={
                      path.pathname === "/" || path.pathname.startsWith("/home")
                        ? `/home/${id}`
                        : `/posts/${id}`
                    }
                    className="trip-card"
                  ></Link>
                  <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-slate-200 bg-white ring-4 ring-slate-300/25">
                    <div className="flex flex-col gap-4 rounded-xl p-0">
                      <Link to="/blog" className="group relative">
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/50 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-active:opacity-90">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="hi-outline hi-arrow-up-right inline-block size-6 transition duration-200 group-hover:scale-150 group-active:scale-100"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                            />
                          </svg>
                        </div>
                        <div className="absolute top-7 right-7 rounded-xl bg-purple-700/50 px-2 py-1 text-xs font-semibold tracking-wider text-white uppercase">
                          {location || "UNAVAILBLE"}
                        </div>
                        <img
                          src={imageUrls?.[0]}
                          alt="Story Image"
                          className="aspect-16/9 w-full rounded-xl object-cover"
                        />
                      </Link>
                      <div className="grow">
                        <div className="mb-1.5 text-sm font-medium text-slate-500 mx-2">
                          {formatDate(createdAt)} ∙ 20 min read
                        </div>
                        <h2 className="mb-2 text-xl font-extrabold text-green-400 font-figtree mx-2">
                          <Link
                            to="/blog"
                            className="hover:opacity-75 active:opacity-100"
                          >
                            {title}
                          </Link>
                        </h2>
                        <p className="text-md font-semibold leading-relaxed text-slate-500 mx-2">
                          {titleDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
        </div>
      </section>

      {/* About Section will be edited */}
      <section className="py-20 px-6 md:px-20 bg-white text-center">
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 lg:px-8 lg:py-32">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-blue-600 sm:text-4xl font-figtree">
              💼 Our Services
            </h2>
            <p className="mt-2 text-lg font-medium text-green-500">
              Whether you’re a solo traveler, a family, or a group of
              adventurers — we’ve got something for you.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-9 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 ring-8 ring-gray-900/5">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-100">
                <svg
                  className="inline-block size-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* eyepieces */}
                  <circle cx="8" cy="10" r="3" />
                  <circle cx="16" cy="10" r="3" />

                  {/* bridge & body */}
                  <path d="M5 10v5a2 2 0 0 0 2 2h2" />
                  <path d="M19 10v5a2 2 0 0 1-2 2h-2" />
                  <path d="M9 6h6v2H9z" />

                  {/* straps / lower detail */}
                  <path d="M4 7v-1a1 1 0 0 1 1-1h2" />
                  <path d="M18 7v-1a1 1 0 0 0-1-1h-2" />
                </svg>
              </div>
              <h4 className="mb-2 font-bold text-gray-950 font-figtree">
                🏞️ Cultural Tours
              </h4>
              <p className="text-sm/relaxed text-gray-600 font-figtree">
                Experience Kembata’s traditions, festivals, and local cuisine.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 ring-8 ring-gray-900/5">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-green-100">
                {/* <svg
          className="inline-block size-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg> */}
                <svg
                  className="inline-block size-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {/* Lock body */}
                  <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
                  {/* Shackle */}
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                  {/* Keyhole */}
                  <circle cx="12" cy="16" r="1" />
                </svg>
              </div>
              <h4 className="mb-2 font-bold text-gray-950">🔒Safe Tours</h4>
              <p className="text-sm/relaxed text-gray-600">
                We prioritize your safety and ensure every tour is secure,
                providing a worry-free and enjoyable travel experience.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 ring-8 ring-gray-900/5">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-purple-100">
                {/* <svg
          className="inline-block size-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          ></path>
        </svg> */}
                <svg
                  className="inline-block size-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {/* Roof */}
                  <path d="M3 11L12 3l9 8" />
                  {/* House base */}
                  <path d="M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" />
                  {/* Door */}
                  <rect x="10" y="14" width="4" height="6" rx="1" />
                </svg>
              </div>
              <h4 className="mb-2 font-bold text-gray-950 font-figtree">
                🏡 Homestay Experiences
              </h4>
              <p className="text-sm/relaxed text-gray-600">
                Stay with welcoming local families and feel at home.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 ring-8 ring-gray-900/5">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-yellow-100">
                {/* <svg
          className="inline-block size-6 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg> */}
                <svg
                  className="inline-block size-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {/* Bus body */}
                  <rect x="4" y="5" width="16" height="12" rx="2" ry="2" />

                  {/* Front window divider */}
                  <path d="M12 5v12" />

                  {/* Wheels */}
                  <circle cx="8" cy="17" r="1.2" />
                  <circle cx="16" cy="17" r="1.2" />

                  {/* Headlights */}
                  <path d="M4 10h16" />
                </svg>
              </div>
              <h4 className="mb-2 font-bold text-gray-950 font-figtree">
                🚌 Transportation & Guidance
              </h4>
              <p className="text-sm/relaxed text-gray-600">
                Reliable local guides and comfortable travel options.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 ring-8 ring-gray-900/5">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-green-100">
                {/* <svg
          className="inline-block size-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg> */}
                <svg
                  className="inline-block size-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {/* Main mountain peaks */}
                  <path d="M2 20l6-10 4 6 6-8 4 12" />
                  {/* Snow cap on highest peak */}
                  <path d="M12 8l2-3 1 2" />
                </svg>
              </div>
              <h4 className="mb-2 font-bold text-gray-950 font-figtree">
                🏕️ Nature & Adventure Trips
              </h4>
              <p className="text-sm/relaxed text-gray-600">
                Explore mountain trails, waterfalls, and scenic viewpoints.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 ring-8 ring-gray-900/5">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-indigo-100">
                {/* <svg
          className="inline-block size-6 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg> */}
                <svg
                  className="inline-block size-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <h4 className="mb-2 font-bold text-gray-950">
                🔭Explore Attractions
              </h4>
              <p className="text-sm/relaxed text-gray-600">
                Discover and visit a variety of tourism sites, experiencing the
                unique culture, history, and landscapes each destination has to
                offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div>
          <TestimonialCarousel />
        </div>
      </section>

      <footer className="bg-gray-300 text-white py-10 text-center">
        <div className="relative mx-auto w-full max-w-lg rounded-xl p-4 shadow-sm backdrop-blur-xs">
          <div className="rounded-lg p-4">
            <div className="mb-4 border-b border-slate-200 pb-2 text-center text-xl font-extrabold">
              <h1 className="text-dark-100 font-bold">
                Follow us on our social media
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Facebook */}
              <a
                href="https://web.facebook.com/visitKembata"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#1877f2] text-white transition duration-150 hover:ring-4 hover:ring-[#1877f2]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-facebook inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/visitkembata/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#e1306c] text-white transition duration-150 hover:ring-4 hover:ring-[#e1306c]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-instagram inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </div>
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@visit_kambata"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-black text-white transition duration-150 hover:ring-4 hover:ring-black/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="currentColor"
                  >
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                  </svg>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://et.linkedin.com/in/samson-thomas-260071328"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#0a66c2] text-white transition duration-150 hover:ring-4 hover:ring-[#0a66c2]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-linkedin inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </div>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@visitkembata"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#FF0000] text-white transition duration-150 hover:ring-4 hover:ring-[#FF0000]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-youtube inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                  </svg>
                </div>
              </a>

              {/* Twitter */}
              <a
                href="#"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#0f1419] text-white transition duration-150 hover:ring-4 hover:ring-[#0f1419]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-twitter-x inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
        <p className="lg:text-xl text-dark-100 font-bold mt-2">
          © {new Date().getFullYear()} Visit Kembata. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

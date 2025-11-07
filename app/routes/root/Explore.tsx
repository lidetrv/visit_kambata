import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { Link } from "react-router";
import { homeSidebarItems } from "~/constants";
import type { Route } from "./+types/Explore";
import { getAllPosts } from "~/appwrite/posts";
import { getUser } from "~/appwrite/auth";
import { cn } from "~/lib/utils";

export const clientLoader = async () => {
  const [user, posts] = await Promise.all([getUser(), getAllPosts(3, 0)]);

  const allPosts = posts.allPosts.map(
    ({
      $id,
      postDetails,
      title,
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
      };
    }
  ) as any[];
  return { user, allPosts };
};

const Explore = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData.user as User | null;
  const { allPosts } = loaderData;
  console.log("allPosts", allPosts);

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
      {/* HOTELS  */}
      <section>
        <div>
          <h1 className="text-dark-100 font-bold text-5xl text-center justify-center lg:mt-20">
            Hotels
          </h1>
        </div>
        <div className="lg:flex mt-8">
          <div className="relative mx-auto w-full max-w-xs rounded-3xl border border-zinc-200 bg-white ring-4 ring-zinc-300/25 mb-8">
            <div className="relative overflow-hidden rounded-3xl bg-white">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 left-0 p-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/50 px-2.5 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="hi-micro hi-star inline-block size-4 text-orange-400"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Popular</span>
                  </span>
                </div>
                <div className="absolute top-0 right-0 p-6">
                  <button
                    type="button"
                    className="inline-flex size-8 items-center justify-center rounded-full bg-zinc-900/50 text-white backdrop-blur-sm hover:bg-zinc-900 hover:text-red-400"
                    aria-label="Favorite"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      className="lucide lucide-heart inline-block size-4"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>
                </div>
                <img
                  src="/assets/images/yichalal-2.jpg"
                  alt="Yichalal Hotel"
                  className="aspect-16/9 w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="mb-1 text-xl font-bold text-zinc-800">
                    Yichalal Hotel
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-zinc-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      className="lucide lucide-map-pin inline-block size-4 text-zinc-400"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Shinshicho, Kembata</span>
                  </div>
                </div>
                <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 invisible">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        className="lucide lucide-clock-2 inline-block size-4 text-zinc-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 10" />
                      </svg>
                      <span className="text-sm text-zinc-600">
                        Premium Service
                      </span>
                    </div>
                    <div className="flex items-center gap-2 invisible">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        className="lucide lucide-trending-up inline-block size-4 text-zinc-400"
                      >
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                      <span className="text-sm text-zinc-600">
                        Premium service
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-orange-400"
                    >
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                    <span className="text-lg font-medium text-zinc-700">
                      4.9
                    </span>
                  </div>
                </div>

                <hr className="my-4 border-zinc-100" />

                <div className="mb-4 flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Safety and security
                  </span>
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Wifi
                  </span>
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Room Service
                  </span>
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Food and beverages
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                          className="lucide lucide-mountain-snow inline-block size-4"
                        >
                          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                          <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-800">
                          Yichalal Hotel
                        </div>
                        <div className="text-xs text-zinc-600">
                          Premium Service
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="hi-micro hi-check inline-block size-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Available</span>
                  </span>
                </div>

                <hr className="my-4 border-zinc-100" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-800 invisible"></span>
                      <span className="text-xs text-zinc-600 invisible"></span>
                    </div>
                    <p className="text-xs text-emerald-600 invisible"></p>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/50"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div></div>
          <div className="relative mx-auto w-full max-w-xs rounded-3xl border border-zinc-200 bg-white ring-4 ring-zinc-300/25 mb-8">
            <div className="relative overflow-hidden rounded-3xl bg-white">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 left-0 p-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/50 px-2.5 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="hi-micro hi-star inline-block size-4 text-orange-400"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Popular</span>
                  </span>
                </div>
                <div className="absolute top-0 right-0 p-6">
                  <button
                    type="button"
                    className="inline-flex size-8 items-center justify-center rounded-full bg-zinc-900/50 text-white backdrop-blur-sm hover:bg-zinc-900 hover:text-red-400"
                    aria-label="Favorite"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      className="lucide lucide-heart inline-block size-4"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>
                </div>
                <img
                  src="/assets/images/aberash.jpg"
                  alt="Aberash Hotel"
                  className="aspect-16/9 w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="mb-1 text-xl font-bold text-dark-100">
                    Aberash Hotel
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-zinc-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      className="lucide lucide-map-pin inline-block size-4 text-zinc-400"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Durame, Kembata</span>
                  </div>
                </div>
                <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 invisible">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        className="lucide lucide-clock-2 inline-block size-4 text-zinc-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 10" />
                      </svg>
                      <span className="text-sm text-zinc-600"></span>
                    </div>
                    <div className="flex items-center gap-2 invisible">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        className="lucide lucide-trending-up inline-block size-4 text-zinc-400"
                      >
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                      <span className="text-sm text-zinc-600"></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-orange-400"
                    >
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                    <span className="text-lg font-medium text-zinc-700">
                      4.9
                    </span>
                  </div>
                </div>

                <hr className="my-4 border-zinc-100" />

                <div className="mb-4 flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Safety and security
                  </span>
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Wfi
                  </span>
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Room Service
                  </span>
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Food and Beverages
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                          className="lucide lucide-mountain-snow inline-block size-4"
                        >
                          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                          <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-800">
                          Aberash Hotel
                        </div>
                        <div className="text-xs text-zinc-600">
                          Premium Service
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="hi-micro hi-check inline-block size-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Available</span>
                  </span>
                </div>

                <hr className="my-4 border-zinc-100" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-800 invisible"></span>
                      <span className="text-xs text-zinc-600 invisible"></span>
                    </div>
                    <p className="text-xs text-emerald-600 invisible"></p>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/50"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div></div>
          <div className="relative mx-auto w-full max-w-xs rounded-3xl border border-zinc-200 bg-white ring-4 ring-zinc-300/25 mb-8">
            <div className="relative overflow-hidden rounded-3xl bg-white">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 left-0 p-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/50 px-2.5 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="hi-micro hi-star inline-block size-4 text-orange-400"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Popular</span>
                  </span>
                </div>
                <div className="absolute top-0 right-0 p-6">
                  <button
                    type="button"
                    className="inline-flex size-8 items-center justify-center rounded-full bg-zinc-900/50 text-white backdrop-blur-sm hover:bg-zinc-900 hover:text-red-400"
                    aria-label="Favorite"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      className="lucide lucide-heart inline-block size-4"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>
                </div>
                <img
                  src="/assets/images/wojo.jpg"
                  alt="Wojo Hotel"
                  className="aspect-16/9 w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="mb-1 text-xl font-bold text-dark-100">
                    Wojo Hotel
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-zinc-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      className="lucide lucide-map-pin inline-block size-4 text-zinc-400"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Durame, Kembata</span>
                  </div>
                </div>
                <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 invisible">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        className="lucide lucide-clock-2 inline-block size-4 text-zinc-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 10" />
                      </svg>
                      <span className="text-sm text-zinc-600"></span>
                    </div>
                    <div className="flex items-center gap-2 invisible">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        className="lucide lucide-trending-up inline-block size-4 text-zinc-400"
                      >
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                      <span className="text-sm text-zinc-600"></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-orange-400"
                    >
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                    <span className="text-lg font-medium text-zinc-700">
                      4.9
                    </span>
                  </div>
                </div>

                <hr className="my-4 border-zinc-100" />

                <div className="mb-4 flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Safety and Security
                  </span>
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Food and Beverages
                  </span>
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Wifi
                  </span>
                  <span className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700">
                    Room Service
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                          className="lucide lucide-mountain-snow inline-block size-4"
                        >
                          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                          <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-800">
                          Wojo Hotel
                        </div>
                        <div className="text-xs text-zinc-600">
                          Premium Service
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="hi-micro hi-check inline-block size-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Available</span>
                  </span>
                </div>

                <hr className="my-4 border-zinc-100" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-800"></span>
                      <span className="text-xs text-zinc-600"></span>
                    </div>
                    <p className="text-xs text-emerald-600"></p>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/50"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div></div>
        </div>
      </section>
      {/* DESTINATION AND CULTURAL FOOD */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10">Destinations</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Hambaricho Mountain */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/icons/Hambericho777.jpg"
                alt="Hambaricho Mountain"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Hambaricho Mountain</h3>
                <p className="text-gray-700 leading-relaxed">
                  A sacred mountain and symbol of unity for the Kembata people,
                  offering beautiful cultural heritage and stunning views.
                </p>
              </div>
            </div>
            {/* assets/images/kocho.jpg */}
            {/* Filwuha Hot Spring */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/icons/Hambericho777.jpg"
                alt="Hambaricho Mountain"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Filwuha Hot Spring</h3>
                <p className="text-gray-700 leading-relaxed">
                  A natural hot spring with warm therapeutic waters, perfect for
                  relaxation and wellness.
                </p>
              </div>
            </div>
            {/* Ajora Waterfalls & Caves */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/sodicho cave.jpg"
                alt="Sodicho Cave"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Sodicho Cave</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-4"></div>
                <p className="text-gray-700 leading-relaxed">
                  An ancient cave rich with mystery, tradition, and historical
                  significance. A must visit for cultural explorers.
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="lucide lucide-map-pin inline-block size-4 text-green-500"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Kembata Zone, Ethiopia</span>
              </div>
            </div>
            {/* <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/ajora3.jpg"
                alt="Ajora Waterfalls"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">
                  Ajora Waterfalls & Caves
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  A breathtaking natural wonder featuring waterfalls and ancient
                  caves — ideal for explorers.
                </p>
              </div>
            </div> */}
            {/* Aziga Waterfall */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/Aziga Waterfall.jpg"
                alt="Aziga Waterfall"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Aziga Waterfall</h3>
                <p className="text-gray-700 leading-relaxed">
                  Located in Angacha City, just 32km from Durame — Aziga blends
                  refreshing nature and peaceful scenery in the heart of
                  Kembata.
                </p>
              </div>
            </div>
            {/* Sana Waterfall */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/sanawaterfall.jpg"
                alt="Sana Waterfall"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Sana Waterfall</h3>
                <p className="text-gray-700 leading-relaxed">
                  A charming waterfall surrounded by lush greenery, offering a
                  calm and refreshing atmosphere for nature lovers.
                </p>
              </div>
            </div>
            {/* Sodicho Cave */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/sodicho cave.jpg"
                alt="Sodicho Cave"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Sodicho Cave</h3>
                <p className="text-gray-700 leading-relaxed">
                  An ancient cave rich with mystery, tradition, and historical
                  significance. A must visit for cultural explorers.
                </p>
              </div>
            </div>
            {/* Sarobira Landscape */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/sarobira.jpg"
                alt="Sarobira Landscape"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Sarobira Landscape</h3>
                <p className="text-gray-700 leading-relaxed">
                  A wide open scenic landscape with natural formations and
                  panoramic views — perfect for photography and meditation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FOODS SECTION  */}
      <section className="py-16 bg-white-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10">
            Traditional Foods
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Kocho */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/kocho.jpg"
                alt="Kocho"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Kocho</h3>
                <p className="text-gray-700 leading-relaxed">
                  A traditional bread made from the Enset plant. Often served
                  with meat, milk, or vegetables — a cultural symbol of unity
                  and hospitality.
                </p>
              </div>
            </div>

            {/* Bulla */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/bulla.jpg"
                alt="Bulla"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Bulla</h3>
                <p className="text-gray-700 leading-relaxed">
                  A smooth, highly digestible porridge made from the purified
                  starch extract of the Enset plant. It provides a quick and
                  powerful source of sustained energy and vital minerals (like
                  Calcium and Potassium).
                </p>
              </div>
            </div>

            {/* Hankalo */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/hanakalo.jpg"
                alt="Hankalo"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Hankalo</h3>
                <p className="text-gray-700 leading-relaxed">
                  Roasted and crushed barley (or wheat) mixed with traditional
                  spices and butter. This deep-flavor dish is rich in fiber (if
                  using barley) and provides B vitamins and a warm, nourishing
                  meal for gatherings.
                </p>
              </div>
            </div>

            {/* Atakana */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/culturalfood7.jpg" // Changed image src
                alt="Atakana"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Atakana</h3>
                <p className="text-gray-700 leading-relaxed">
                  A special celebratory meal traditionally prepared during major
                  holidays on a flat earthen oven. It is usually made with rich,
                  varied ingredients that offer a high content of protein,
                  healthy fats, and micronutrients.
                </p>
              </div>
            </div>

            {/* Godere (Gebiza) */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/godere.jpg" // Changed image src
                alt="Godere (Gebiza)"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">(Gebiza) Godere</h3>
                <p className="text-gray-700 leading-relaxed">
                  A traditional staple food item, often derived from ground
                  cereals or Enset. It contributes a strong base of sustained
                  caloric energy and important dietary fiber to the daily
                  Kembata diet.
                </p>
              </div>
            </div>

            {/* Mucho */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/mucho.jpg" // Changed image src
                alt="Mucho"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Mucho</h3>
                <p className="text-gray-700 leading-relaxed">
                  A dense, highly filling Kembata specialty food, often related
                  to the Kocho/Bula family. It is valued for its contribution to
                  food security and its dense concentration of carbohydrates and
                  minerals.
                </p>
              </div>
            </div>

            {/* Kitifo */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/kitifo.jpg" // Changed image src
                alt="Kitifo"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Kitifo</h3>
                <p className="text-gray-700 leading-relaxed">
                  A traditional dish of minced raw beef mixed with *mitmita*
                  (chili) and /niter kibbeh/ (spiced butter). It is an excellent
                  source of high-quality complete protein, essential Iron, and
                  Vitamin B12.
                </p>
              </div>
            </div>

            {/* Ayib (Cheese) */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="assets/images/photo/AYIB.jpg"
                alt="Ayib (Ethiopian Cottage Cheese)"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">
                  Ayib (Cottage Cheese)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Ethiopian fresh cottage cheese, often served with spicy meat
                  dishes or Kocho. It is a vital and easily digestible **protein
                  supplement** that provides a rich source of **calcium** for
                  bone health.
                </p>
              </div>
            </div>

            {/* Cheka (Traditional Drink) */}
            {/* <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="https://via.placeholder.com/400x250?text=Cheka"
                alt="Cheka"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">
                  Cheka (Traditional Drink)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  A traditional fermented drink shared in community gatherings.
                  Known for connecting people, culture, and conversation.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <footer className="bg-gray-300 text-white py-10 text-center glassmorphism">
        {/* <div className="flex justify-center space-x-6 mb-6 text-2xl">
          <FaInstagram className="hover:text-green-300 cursor-pointer transition" />
          <FaFacebookF className="hover:text-green-300 cursor-pointer transition" />
          <FaTwitter className="hover:text-green-300 cursor-pointer transition" />
          <FaYoutube className="hover:text-green-300 cursor-pointer transition" />
        </div> */}
        <div className="relative mx-auto w-full max-w-lg rounded-xl  p-4 shadow-sm backdrop-blur-xs">
          <div className="rounded-lg p-4">
            <div className="mb-4 border-b border-slate-200 pb-2 text-center text-xl font-extrabold">
              <h1 className="text-dark-100 font-bold">
                Follow us on our social media
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#0f1419] text-white transition duration-150 hover:ring-4 hover:ring-[#0f1419]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-twitter-x inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex translate-y-full items-center justify-center opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    className="hi-mini hi-arrow-up-tray inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                </div>
              </button>
              <button
                type="button"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#1877f2] text-white transition duration-150 hover:ring-4 hover:ring-[#1877f2]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-facebook inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex translate-y-full items-center justify-center opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    className="hi-mini hi-arrow-up-tray inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                </div>
              </button>
              <button
                type="button"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#e1306c] text-white transition duration-150 hover:ring-4 hover:ring-[#e1306c]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-instagram inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex translate-y-full items-center justify-center opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    className="hi-mini hi-arrow-up-tray inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                </div>
              </button>
              <button
                type="button"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#FF0000] text-white transition duration-150 hover:ring-4 hover:ring-[#FF0000]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-youtube inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex translate-y-full items-center justify-center opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    className="hi-mini hi-arrow-up-tray inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                </div>
              </button>
              <button
                type="button"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#0a66c2] text-white transition duration-150 hover:ring-4 hover:ring-[#0a66c2]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-linkedin inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex translate-y-full items-center justify-center opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    className="hi-mini hi-arrow-up-tray inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                </div>
              </button>
              <button
                type="button"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#7bb32e] text-white transition duration-150 hover:ring-4 hover:ring-[#7bb32e]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-wechat inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018 0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.324.324 0 0 0-.12.366l.218.81a.616.616 0 0 1 .029.117.166.166 0 0 1-.162.162.177.177 0 0 1-.092-.03l-1.057-.61a.519.519 0 0 0-.256-.074.509.509 0 0 0-.142.021 5.668 5.668 0 0 1-1.576.22ZM9.064 9.542a.647.647 0 1 0 .557-1 .645.645 0 0 0-.646.647.615.615 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1 .645.645 0 0 0-.644.644.627.627 0 0 0 .098.356Z" />
                    <path d="M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6-.1.373a.499.499 0 0 0-.032.14.192.192 0 0 0 .193.193c.039 0 .077-.01.111-.029l1.268-.733a.622.622 0 0 1 .308-.088c.058 0 .116.009.171.025a6.83 6.83 0 0 0 1.625.26 4.45 4.45 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02.05 0 .1 0 .15.002C10.587 3.429 8.392 2 5.796 2 2.596 2 0 4.16 0 6.826Zm4.632-1.555a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0Zm3.875 0a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0Z" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex translate-y-full items-center justify-center opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    className="hi-mini hi-arrow-up-tray inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                </div>
              </button>
              <button
                type="button"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#333] text-white transition duration-150 hover:ring-4 hover:ring-[#333]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-github inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex translate-y-full items-center justify-center opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    className="hi-mini hi-arrow-up-tray inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                </div>
              </button>
              <button
                type="button"
                className="group relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#e60023] text-white transition duration-150 hover:ring-4 hover:ring-[#e60023]/25 active:ring-0"
              >
                <span className="absolute size-24 scale-0 rounded-full bg-white/25 transition duration-200 ease-out group-active:scale-100"></span>
                <div className="absolute inset-0 flex items-center justify-center transition duration-150 ease-in group-hover:-translate-y-full group-hover:opacity-0">
                  <svg
                    className="bi bi-pinterest inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex translate-y-full items-center justify-center opacity-0 transition duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    className="hi-mini hi-arrow-up-tray inline-block size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        <p className="lg:text-xl text-dark-100 font-bold mt-2">
          © {new Date().getFullYear()} Visit Kembata. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Explore;

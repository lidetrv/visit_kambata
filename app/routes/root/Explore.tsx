import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router'
import { homeSidebarItems } from '~/constants'
import type { Route } from './+types/Explore';
import { getAllPosts } from '~/appwrite/posts';
import { getUser } from '~/appwrite/auth';
import { cn } from '~/lib/utils';

export const clientLoader = async () => {
  const [user, posts] = await Promise.all([
    getUser(),
    getAllPosts(3,0),
  ]);

  const allPosts = posts.allPosts.map(({ $id, postDetails, title, tags, imageUrls, tittleDescription,createdAt }) => {
  let details = {};

  try {
    details = typeof postDetails === "string" ? JSON.parse(postDetails) : postDetails;

  } catch (e) {
    console.error("Invalid JSON in postDetails", postDetails);
  }

  return {
    id: $id,
    ...details
  };
}) as any[];
 return { user, allPosts};
};

const Explore = ({loaderData}: Route.ComponentProps) => {
  const user = loaderData.user as User | null;
  const {allPosts} = loaderData;
  console.log('allPosts', allPosts);

  // const user = useLoaderData();
    const navigate = useNavigate();
    const hanldeLogout = () =>{
        navigate('/sign-in')
    }

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
                                className={`group-hover:brightness-0 size-5 group-hover:invert w-5 h-5 object-contain ${isActive ? 'brightness-0 invert' : 'text-green-500' }`}
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
                        src={user?.imageUrl  ?? "/assets/images/david.webp"}
                        alt={user?.name  ?? "User"}
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
                <div>
                  <h1 className='text-dark-100 font-bold text-5xl text-center justify-center lg:mt-20'>Hotels</h1>
                </div>
                <div className='lg:flex mt-8'>
                  <div
  className="relative mx-auto w-full max-w-xs rounded-3xl border border-zinc-200 bg-white ring-4 ring-zinc-300/25 mb-8"
>
  <div className="relative overflow-hidden rounded-3xl bg-white">
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0 p-6">
        <span
          className="inline-flex items-center gap-1 rounded-full bg-zinc-900/50 px-2.5 py-1 text-sm font-medium text-white backdrop-blur-sm"
        >
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
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            />
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
            <path
              d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
            />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Shinshicho, Kembata</span>
        </div>
      </div>
      <div
        className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center"
      >
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
            <span className="text-sm text-zinc-600">Premium Service</span>
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
            <span className="text-sm text-zinc-600">Premium service</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-orange-400"
          >
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            />
          </svg>
          <span className="text-lg font-medium text-zinc-700">4.9</span>
        </div>
      </div>

      <hr className="my-4 border-zinc-100" />

      <div className="mb-4 flex flex-wrap gap-1.5">
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Safety and security
        </span>
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Wifi
        </span>
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Room Service
        </span>
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Food and beverages
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
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
                className="lucide lucide-mountain-snow inline-block size-4"
              >
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                <path
                  d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-800">Yichalal Hotel</div>
              <div className="text-xs text-zinc-600">Premium Service</div>
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
        >
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

                <div>

                </div>
                <div
  className="relative mx-auto w-full max-w-xs rounded-3xl border border-zinc-200 bg-white ring-4 ring-zinc-300/25 mb-8"
>
  <div className="relative overflow-hidden rounded-3xl bg-white">
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0 p-6">
        <span
          className="inline-flex items-center gap-1 rounded-full bg-zinc-900/50 px-2.5 py-1 text-sm font-medium text-white backdrop-blur-sm"
        >
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
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            />
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
            <path
              d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
            />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Durame, Kembata</span>
        </div>
      </div>
      <div
        className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center"
      >
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
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            />
          </svg>
          <span className="text-lg font-medium text-zinc-700">4.9</span>
          
        </div>
      </div>

      <hr className="my-4 border-zinc-100" />

      <div className="mb-4 flex flex-wrap gap-1.5">
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Safety and security
        </span>
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Wfi
        </span>
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Room Service
        </span>
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Food and Beverages
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
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
                className="lucide lucide-mountain-snow inline-block size-4"
              >
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                <path
                  d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-800">Aberash Hotel</div>
              <div className="text-xs text-zinc-600">Premium Service</div>
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
        >
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

                <div>

                </div>
                <div
  className="relative mx-auto w-full max-w-xs rounded-3xl border border-zinc-200 bg-white ring-4 ring-zinc-300/25 mb-8"
>
  <div className="relative overflow-hidden rounded-3xl bg-white">
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0 p-6">
        <span
          className="inline-flex items-center gap-1 rounded-full bg-zinc-900/50 px-2.5 py-1 text-sm font-medium text-white backdrop-blur-sm"
        >
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
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            />
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
            <path
              d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
            />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Durame, Kembata</span>
        </div>
      </div>
      <div
        className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center"
      >
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
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            />
          </svg>
          <span className="text-lg font-medium text-zinc-700">4.9</span>
        </div>
      </div>

      <hr className="my-4 border-zinc-100" />

      <div className="mb-4 flex flex-wrap gap-1.5">
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Safety and Security
        </span>
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Food and Beverages
        </span>
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Wifi
        </span>
        <span
          className="rounded-lg bg-zinc-200/50 px-2 py-1 text-xs font-medium text-zinc-700"
        >
          Room Service
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
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
                className="lucide lucide-mountain-snow inline-block size-4"
              >
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                <path
                  d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-800">Wojo Hotel</div>
              <div className="text-xs text-zinc-600">Premium Service</div>
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
        >
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

<div>

</div>
      </div>
                
              </section>
    </div>
  )
}

export default Explore
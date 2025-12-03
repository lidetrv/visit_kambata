import { Link, NavLink } from "react-router-dom"; // Use react-router-dom for Link/NavLink
import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaMapMarkedAlt, // Added for Geography icon
  FaHistory, // Added for History icon
} from "react-icons/fa";
import { motion } from "framer-motion";
// import NavBar from "./NavBar"; // NavBar is commented out as it's not defined
import { homeSidebarItems, user } from "~/constants";
import { cn } from "~/lib/utils";

// Helper component for the Footer
const Footer = () => (
  <footer className="bg-green-300 text-white py-10 text-center">
    <div className="flex justify-center space-x-6 mb-6 text-2xl">
      <FaInstagram className="hover:text-green-300 cursor-pointer transition" />
      <FaFacebookF className="hover:text-green-300 cursor-pointer transition" />
      <FaTwitter className="hover:text-green-300 cursor-pointer transition" />
      <FaYoutube className="hover:text-green-300 cursor-pointer transition" />
    </div>
    <p className="text-sm text-green-100">
      © {new Date().getFullYear()} Visit Kembata. All rights reserved.
    </p>
  </footer>
);

// NOTE: The Blog Post Data and related components (BlogPost, BlogPostCard) are kept but not used
// in the main export function, as the request focused on the "About Us" section.

export default function Blog() {
  function hanldeLogout(event: React.MouseEvent<HTMLButtonElement>): void {
    // implement logout behavior here
    console.log("Logout clicked");
  }

  return (
    <div className="font-sans text-gray-800">
      {/* Header (Top Navigation) - Retained */}
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
                {/* @ts-ignore */}
                {homeSidebarItems?.map(({ id, href, icon, label }) => (
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
                  src={(user as any)?.imageUrl ?? "/assets/images/david.webp"}
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

      {/* Hero Header - Retained */}
      <header className="bg-white p-6 m-6 text-black py-16 text-center shadow-lg rounded-2xl mt-16 lg:mt-24">
        <h3 className="text-4xl font-bold mb-6 text-green-500 font-figtree">
          🧭 About Us
        </h3>
        <p className="text-lg bg-green-200 opacity-90 max-w-3xl mx-auto text-black rounded-2xl p-2 py-2">
          Welcome to Visit Kembata, your guide to exploring the beauty and
          culture of Kembata! We showcase the region’s breathtaking landscapes,
          rich traditions, and warm hospitality. Our mission is to promote local
          tourism and connect visitors with authentic experiences. Discover
          Kembata’s hidden gems and make memories that last a lifetime.
        </p>

        <p className="text-lg bg-green-200 opacity-90 max-w-3xl mx-auto text-black rounded-2xl p-2 py-2 m-3">
          Visit Kembata is a local travel agency dedicated to showcasing the
          hidden beauty of the Kembata Zone and nearby regions. Founded by{" "}
          <span className="text-dark-100 font-bold">Samson Thomas</span>, we
          specialize in authentic cultural experiences, guided nature tours, and
          personalized travel services. Our mission is simple — to connect
          people with the vibrant spirit, traditions, and landscapes of our
          homeland. With our team’s deep knowledge of the area, we promise safe,
          affordable, and unforgettable trips that go beyond the usual tourist
          paths.
        </p>

        {/* About Purpose Section - Styled Like Destinations */}
        <h2 className="text-4xl font-extrabold text-green-700 mb-10 mt-20 text-center border-b-4 border-green-500/50 pb-2 max-w-2xl mx-auto">
          Who We Are & What We Stand For
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          {/* Our Mission */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-600 transition duration-300"
          >
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              Our Mission
            </h3>
            <p className="text-gray-700">
              We aim to promote local tourism, preserve cultural identity, and
              support community-based travel experiences.
            </p>
          </motion.div>

          {/* What Makes Kembata Special */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-600 transition duration-300"
          >
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              What Makes Kembata Special
            </h3>
            <p className="text-gray-700">
              From Mount Hambaricho to the warmth of our people, Kembata offers
              unforgettable experiences in nature, culture, history, and
              celebration.
            </p>
          </motion.div>

          {/* Why We Created This Site */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-600 transition duration-300"
          >
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              Why We Created This Site
            </h3>
            <p className="text-gray-700">
              We believe showcasing the region’s beauty helps visitors explore
              with confidence while supporting local communities and traditions.
            </p>
          </motion.div>

          {/* Join Us */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-600 transition duration-300"
          >
            <h3 className="text-2xl font-bold text-green-700 mb-2">Join Us</h3>
            <p className="text-gray-700">
              Explore our attractions, learn our culture, and experience the
              spirit of Kembata. Your adventure begins here.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Kembata Information Section - RESTRUCTURED AND RESTYLED */}
      <section className="py-12 bg-gray-50 text-gray-800 px-4 md:px-8">
        {/* Map Image and Title - Retained (Slightly Styled) */}
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-dark-100 mb-2 font-figtree">
            Kembata Tembaro Zone
          </h2>
          <p className="text-lg  mb-8 text-gray-500 font-semibold">
            The heart of cultural pride, resilience, and natural beauty in
            Southern Ethiopia.
          </p>
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-4  max-w-4xl mx-auto">
            <a
              href="https://www.google.com/maps/place/Kembata+Tembaro+Zone"
              target="_blank"
            >
              <img
                src="/assets/images/Kem_map.jpg"
                alt="Map of Kembata Tembaro Zone"
                className="w-full max-h-96 object-cover rounded-lg bg-white"
              />
            </a>
          </div>
          <div className="text-center">
            {/* <img src="/images/kembata-tembaro-zone.jpg" alt="Kembata Tembaro Zone" className="rounded-lg shadow-lg w-full h-auto mb-3"> */}
            <a
              href="https://www.google.com/maps/place/Kembata+Tembaro+Zone"
              target="_blank"
              className="text-blue-600 underline hover:text-blue-800"
            >
              📍 View on Google Maps
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: History, Culture, and People */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white border border-green-300 p-8 rounded-3xl shadow-2xl hover:shadow-green-400/50 transition-all duration-500"
          >
            <div className="flex items-center mb-4 text-green-700">
              <FaHistory className="text-4xl mr-3" />
              <h3 className="text-3xl font-extrabold">History & Culture</h3>
            </div>
            <div className="space-y-4 text-left text-gray-700">
              <p>
                Kembata Tembaro Zone was located in Ethiopia Historically, the
                Kembata and Tembaro people share common linguistic and cultural
                roots, belonging to the larger Kambaata language group.
              </p>
              <p>
                The people are known for their rich cultural traditions,
                hospitality, and colorful celebrations. The Kembata language is
                widely spoken, and local festivals like{" "}
                <span className="font-semibold text-green-600">Maasala</span>{" "}
                are central to community life, recognized by UNESCO as an
                intangible cultural heritage.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Geography, Location, and Economy */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-white border border-green-300 p-8 rounded-3xl shadow-2xl hover:shadow-green-400/50 transition-all duration-500"
          >
            <div className="flex items-center mb-4 text-green-700">
              <FaMapMarkedAlt className="text-4xl mr-3" />
              <h3 className="text-3xl font-extrabold">Geography & Economy</h3>
            </div>
            <div className="space-y-4 text-left text-gray-700">
              <p>
                The zone is located in the central-southern part of Ethiopia.
                Its administrative capital is Durame, which acts as the
                economic, political, and educational center. The area features
                fertile soils, mild climate, and a mix of highland and midland
                terrains.
              </p>
              <p>
                Agriculture is the backbone of the economy, focusing on
                essential crops like enset (false banana), maize, and barley. In
                recent years, trade, small industries, and education have seen
                significant growth, driving development and modernization.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form - Retained */}
      <section className="py-12 bg-gray-50 flex justify-center">
        <form
          action="#"
          method="post"
          className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md border-t-8 border-green-600  m-3"
        >
          <div className="mb-6 text-center">
            <h4 className="text-2xl font-bold text-green-700 mb-3">
              Get in Touch
            </h4>
            <p className="text-gray-700">
              Contact us <br />
              <span className="font-semibold">+251 93 137 0119</span> <br />
              <span className="font-semibold">visitkembata@gmail.com</span>
              <br />
              Durame, Kembata, Ethiopia
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="pageName"
              className="block text-gray-700 font-semibold mb-2"
            >
              Full Name:
            </label>
            <input
              type="text"
              id="pageName"
              name="pageName"
              placeholder="Write Full Name"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700  font-semibold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Write your email"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-gray-700 font-semibold mb-2"
            >
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Write message here..."
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all shadow-md"
          >
            Send Message
          </motion.button>
        </form>
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

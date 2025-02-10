"use client";

import React from "react";
import LogoutBtn from "./logoutBtn";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  // Add path aliases if needed (e.g. root path -> /home)
  const isHomeActive = currentPath === "/" || currentPath === "/home";

  return (
    <aside className="bg-gray-900 text-white p-6 h-full sticky top-0">
      <p className="mb-20">Admin Dashboard</p>
      <nav className="flex flex-col gap-2">
        <button
          onClick={() => handleTabClick("/home")}
          className={`px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 text-left ${
            isHomeActive ? "bg-gray-800 text-blue-400 font-semibold" : ""
          }`}
        >
          Home
        </button>

        <button
          onClick={() => handleTabClick("/home/parent")}
          className={`px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 text-left ${
            currentPath === "/home/parent"
              ? "bg-gray-800 text-blue-400 font-semibold"
              : ""
          }`}
        >
          Parent Management
        </button>

        <button
          onClick={() => handleTabClick("/home/infant")}
          className={`px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 text-left ${
            currentPath === "/home/infant"
              ? "bg-gray-800 text-blue-400 font-semibold"
              : ""
          }`}
        >
          Infant Management
        </button>

        <button
          onClick={() => handleTabClick("/home/vaccine")}
          className={`px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 text-left ${
            currentPath === "/home/vaccine"
              ? "bg-gray-800 text-blue-400 font-semibold"
              : ""
          }`}
        >
          Vaccine Management
        </button>

        <button
          onClick={() => handleTabClick("/about")}
          className={`px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 text-left ${
            currentPath === "/about"
              ? "bg-gray-800 text-blue-400 font-semibold"
              : ""
          }`}
        >
          About
        </button>

        <button
          onClick={() => handleTabClick("/contact")}
          className={`px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 text-left ${
            currentPath === "/contact"
              ? "bg-gray-800 text-blue-400 font-semibold"
              : ""
          }`}
        >
          Contact Us
        </button>
      </nav>
      <div className="mt-10 align-middle">
        <LogoutBtn />
      </div>
    </aside>
  );
};

export default Sidebar;

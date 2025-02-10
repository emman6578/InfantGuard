"use client";

import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import React from "react";

const VaccineManagement = () => {
  return (
    <div className="grid grid-cols-[250px_1fr] grid-rows-[1fr_auto] min-h-screen">
      {/* Sticky Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col gap-8">
        Vaccine management here
      </main>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );
};

export default VaccineManagement;

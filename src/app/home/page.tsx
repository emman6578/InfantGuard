"use client";

import React from "react";
import Footer from "@/components/footer";
import VaccineGraph from "@/components/graphVaccine";
import Sidebar from "@/components/sidebar";
import { useProtectedRoutesApi } from "@/libraries/API/ProtectedRoute/secureRoutes";
import { useQuery } from "@tanstack/react-query";
import DashboardData from "./dashboard-data";
import Notifications from "./notifPanel";

export interface Overview {
  totalParents: number;
  totalInfants: number;
  totalVaccinations: number;
}

export interface Parent {
  id: string;
  fullname: string;
  created: string;
  lastLogin: string | null;
  role: string;
}

export interface VaccineSchedule {
  vaccineName: string;
  percentage: number;
  sort: string;
}

export interface Infant {
  id: string;
  fullname: string;
  image: string;
  vaccinationSched: VaccineSchedule[];
}

export interface DoseSummary {
  DONE: number;
  ONGOING: number;
  NOT_DONE: number;
}

export interface VaccinationSummary {
  [dose: string]: DoseSummary;
}

export interface NotificationType {
  id: string;
  parentId: string;
  title: string;
  body: string;
  data: string;
  created: string;
  updated: string;
  parent: {
    fullname: string;
  };
}

export interface DashboardDataResponse {
  overview: Overview;
  recentParents: Parent[];
  infants: Infant[];
  vaccinationSummary: VaccinationSummary;
  notifications: NotificationType[];
  message: string;
}

/** COMPONENT **/

export default function Home() {
  const { getAdminDataDashBoard } = useProtectedRoutesApi();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin"],
    queryFn: getAdminDataDashBoard,
  });

  return (
    <div className="grid grid-cols-[250px_1fr] grid-rows-[1fr_auto] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {isLoading ? (
          <div className="flex items-center justify-center bg-white shadow rounded-lg p-6">
            Loading dashboard data...
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center bg-white shadow rounded-lg p-6 text-red-500">
            Error: {error?.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-8">
            {/* Left Column: VaccineGraph and Main Dashboard Data */}
            <div className="space-y-8">
              <VaccineGraph />
              <DashboardData data={data} />
            </div>
            {/* Right Column: Notifications Panel */}
            <div>
              <Notifications notifications={data?.notifications} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

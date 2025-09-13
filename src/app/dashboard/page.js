"use client";

import { Suspense } from "react";
import DashboardComponent from "@/components/DashboardComponent";

const DashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <DashboardComponent />
    </Suspense>
  );
};

export default DashboardPage;

"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import React from "react";

const DashboardPage = () => {
  const { handleSignOut } = useAuth();

  return (
    <div>
      <h1>Dashboard Page</h1>
      <div className="">
        {" "}
        <p>LogOut</p>
        <Button onClick={handleSignOut}>LogOut</Button>
      </div>
    </div>
  );
};

export default DashboardPage;

"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import React from "react";

const Home = () => {
  const { handleSignOut } = useAuth();

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        {" "}
        <p>LogOut</p>
        <Button onClick={handleSignOut}>LogOut</Button>
      </div>
    </div>
  );
};

export default Home;

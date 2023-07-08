import React, { useState, useEffect } from "react";
import { useAuction } from "@/context/AuctionContext.jsx";

export default function AuctionDetails() {
  const { currMintPrice } = useAuction();
  const [flexDirection, setFlexDirection] = useState("row");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1040) {
        setFlexDirection("column");
      } else {
        setFlexDirection("row");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="w-fit md:w-full"
    >
      <h2 className={`${
        flexDirection === "column" ? "text-white" : "text-[#1C2228]"
      } md:text-3xl font-['PT Sans']`}>
        Ξ{currMintPrice.slice(0, 6) || "0.00"}
      </h2>
    </div>
  );
}

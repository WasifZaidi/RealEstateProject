"use client";

import ListingCard from "../ListingCard";
import React, { useState } from "react";

export default function ClientListingCard({ listing }) {
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  return (
    <ListingCard
      listing={listing}
      selectedForCompare={selectedForCompare}
      setSelectedForCompare={setSelectedForCompare}
    />
  );
}

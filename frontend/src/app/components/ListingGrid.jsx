"use client";
import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import NoListings from "./SideComponents/NoListings";
import Listing_card_results from "./SideComponents/ListingCardResults";
const ListingsGrid = ({ listings, pagination, searchParams, hasError }) => {
  if (hasError) return null;

  if (!listings || listings.length === 0) {
    return (
      <NoListings/>
    );
  }

  // Generate URL for Next.js Link
  const generatePageUrl = (page) => {
    const params = new URLSearchParams(
      typeof searchParams === "string"
        ? searchParams
        : Object.fromEntries(searchParams?.entries?.() || [])
    );
    params.set("page", page);
    return `/results?${params.toString()}`;
  };

  return (
    <>
      {/* Grid Layout */}
      <div className="results_grid mb-8">
        {listings.map((listing) => (
          <Listing_card_results key={listing._id} listing={listing} />
        ))}
      </div>

      {/* MUI Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center border-t border-gray-200 pt-6">
          <Stack spacing={2}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              variant="outlined"
              color="primary"
              showFirstButton
              showLastButton
              onChange={(e, value) => {
                window.location.href = generatePageUrl(value);
              }}
            />
          </Stack>
        </div>
      )}
    </>
  );
};


export default ListingsGrid;

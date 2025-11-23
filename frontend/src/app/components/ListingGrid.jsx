import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
// import NoListings from "./SideComponents/NoListings";
import Listing_card_results from "./SideComponents/ListingCardResults";
import { generatePageUrl } from "../../lib/url_utils";

// Server component - remove "use client"
const ListingsGrid = ({ 
  listings, 
  wishlistId_s, 
  pagination, 
  searchParams, 
  hasError 
}) => {
  if (hasError) return null;

  if (!listings || listings.length === 0) {
    return (
      <></>
    );
  }

  return (
    <>
      {/* Grid Layout */}
      <div className="results_grid mb-8">
        {listings.map((listing, index) => (
          <Listing_card_results 
            key={listing._id} 
            listing={listing} 
            isSaved={wishlistId_s.includes(listing._id)}
            // Add structured data position for SEO
            position={index + 1}
          />
        ))}
      </div>

      {/* MUI Pagination - Converted to server-side navigation */}
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
              // Use Link component for server-side navigation
              renderItem={(item) => (
                <Link 
                  href={generatePageUrl(item.page, searchParams)}
                  className={`MuiPaginationItem-root MuiPaginationItem-outlined ${
                    item.page === pagination.currentPage 
                      ? 'Mui-selected' 
                      : ''
                  }`}
                >
                  {item.type === 'page' ? item.page : 
                   item.type === 'first' ? '«' :
                   item.type === 'last' ? '»' :
                   item.type === 'previous' ? '‹' : '›'}
                </Link>
              )}
            />
          </Stack>
        </div>
      )}
    </>
  );
};

export default ListingsGrid;
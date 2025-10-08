"use client";

import React from "react";
import Link from "next/link";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const MuiPagination = ({ pagination, searchParams }) => {
  // Generate the URL for a given page number
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
    <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-6">
      {/* Showing results info */}
      <div className="text-sm text-gray-700 mb-4 md:mb-0">
        Showing {pagination.totalCount === 0 ? 0 : (pagination.currentPage - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{" "}
        {pagination.totalCount.toLocaleString()} results
      </div>

      {/* MUI Pagination */}
      <Stack spacing={2}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          onChange={(event, value) => {
            // Redirect to the new page
            window.location.href = generatePageUrl(value);
          }}
        />
      </Stack>
    </div>
  );
};

export default MuiPagination;

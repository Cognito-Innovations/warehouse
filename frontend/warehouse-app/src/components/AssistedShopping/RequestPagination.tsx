"use client";
import React from "react";

interface RequestPaginationProps {
  count: number;
}

export default function RequestPagination({ count }: RequestPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-600">
        Showing 1 to {count} of {count} Requests
      </p>
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded disabled:opacity-50"
          disabled
        >
          Previous
        </button>
        <button
          className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded disabled:opacity-50"
          disabled
        >
          Next
        </button>
      </div>
    </div>
  );
}
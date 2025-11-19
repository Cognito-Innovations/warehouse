"use client";
import React from "react";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  searchTerm,
  onSearchTermChange,
  placeholder = "Search by package id",
}: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
      />
    </div>
  );
}
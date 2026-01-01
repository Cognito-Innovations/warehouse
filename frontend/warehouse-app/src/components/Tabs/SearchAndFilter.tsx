import React from "react";
import SearchBar from "./SearchBar";
import FilterDropdown from "../Filter/FilterDropdown";
import { filterOptions } from "@/data/filterOptionsData";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  placeholder: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  placeholder
}) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 my-2 sm:my-4">
      <div className="flex-grow sm:flex-initial sm:w-[300px]">
        <SearchBar
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="hidden sm:block flex-1" />
      <div className="flex-shrink-0">
        <FilterDropdown
          options={filterOptions}
          buttonLabel="Filter"
          onSelect={(opt) => onFilterChange(opt.value)}
        />
      </div>
    </div>
  );
};

export default SearchAndFilter;

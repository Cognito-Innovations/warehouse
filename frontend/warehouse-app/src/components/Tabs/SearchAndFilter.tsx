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
    <div className="flex items-center gap-3 my-4">
      <div className="flex-shrink-0 w-[250px]">
        <SearchBar 
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex-1" /> {/* empty area */}
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

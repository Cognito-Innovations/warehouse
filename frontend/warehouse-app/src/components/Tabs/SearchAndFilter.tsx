import React from "react";
import SearchBar from "./SearchBar";
import FilterDropdown from "../Filter/FilterDropdown";
import { filterOptions } from "@/data/filterOptionsData";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  showFilter?: boolean;
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  placeholder,
  showFilter = true,
  onFilterChange,
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

      {showFilter && onFilterChange && (
        <>
          <div className="hidden sm:block flex-1" />
          <div className="flex-shrink-0">
            <FilterDropdown
              options={filterOptions}
              buttonLabel="Filter"
              onSelect={(opt) => onFilterChange(opt.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchAndFilter;

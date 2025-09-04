"use client";
import { ListFilterPlusIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Option = { label: string; value: string };

interface FilterDropdownProps {
  options: Option[];
  onSelect?: (option: Option) => void;
  buttonLabel?: string;
  className?: string;
}

export default function FilterDropdown({ options, onSelect, buttonLabel = "Filter", className = "", }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={ref}>
      <div>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open} className="inline-flex w-full justify-center leading-5 rounded-md px-4 py-2 text-sm border-gray-300 border m-1 font-semibold text-gray-500 bg-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <ListFilterPlusIcon className="w-4 h-4 mx-1 mt-[0.1rem]"/>
          {buttonLabel}
        </button>
      </div>

      {open && (
        <div className="absolute z-50 right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((opt) => (
              <button key={opt.value} type="button" onClick={() => { onSelect?.(opt), setOpen(false) }}
                className="text-gray-900 group flex w-full items-center rounded-md px-4 py-2 text-sm hover:bg-gray-100">
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

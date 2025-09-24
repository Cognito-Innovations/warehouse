"use client";

import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="w-full border border-gray-200 pb-3">
      <nav className="max-w-7xl mx-auto px-4 mt-3" aria-label="Breadcrumb">
        <ol className="flex items-center text-sm text-gray-500 space-x-2">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <li>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-gray-400 font-semibold hover:text-gray-700"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-500 font-semibold">
                    {item.label}
                  </span>
                )}
              </li>
              {index < items.length - 1 && (
                <li className="text-gray-300">/</li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
}

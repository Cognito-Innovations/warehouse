"use client";

import React from "react";
import Link from "next/link";

import { ROUTES } from "@/utils/constants";
import { usePathname } from "next/navigation";

const HeaderNavigation = () => {
    const pathname = usePathname();

    const navItems = [
      { name: "My Suite", path: ROUTES.DASHBOARD },
      { name: "Ecommerce", path: ROUTES.ECOMMERCE },
      { name: "Orders", path: ROUTES.ORDER_HISTORY },
      { name: "Assisted Shopping", path: ROUTES.ASSISTED_SHOPPING },
      { name: "Pickup Request", path: ROUTES.PICKUP_REQUEST },
    ]; 

    return (
      <nav className="flex-1 flex justify-center">
        <ul className="flex space-x-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  pathname === item.path
                    ? "bg-purple-600 text-white font-semibold"
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
};

export default HeaderNavigation;
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Temporarily disable middleware to test if it's causing the redirect loop
export function middleware(request: NextRequest) {
  // Allow all requests to pass through without any authentication checks
  return NextResponse.next();
}

// Disable middleware completely for now
export const config = {
  matcher: [],
};

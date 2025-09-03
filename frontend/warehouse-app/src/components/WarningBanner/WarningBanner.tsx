'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowForward } from '@mui/icons-material';


export default function ProfileAlert() {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg mb-6">
      <div className="flex-shrink-0 pl-2 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5 text-red-400"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
      </div>
      
      <div className="flex-1">
        <p className="text-red-700 text-sm font-medium">
          Your profile is incomplete. Please fill in all the required information in order to verify your user.
        </p>
      </div>
      
      <Link href="/profile" className="no-underline">
        <button className="flex items-center gap-1 text-red-600 text-sm font-medium hover:bg-red-100 px-3 py-2 rounded-md transition-colors duration-200">
          Profile
          <ArrowForward className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );
}
'use client';

import TabsSection from '../components/Tabs/TabsSection';
import WarningBanner from '../components/WarningBanner/WarningBanner';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <WarningBanner />
        <TabsSection />
      </div>
    </div>
  );
}

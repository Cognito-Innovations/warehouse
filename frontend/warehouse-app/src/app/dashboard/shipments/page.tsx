import ShipmentsContent from "@/components/Dashboard/ShipmentsContent";

export const metadata = {
    title: "Shipments | Dashboard",
};

export default function ShipmentsPage() {
    return <main className="min-h-screen bg-white">
        <ShipmentsContent />
    </main>;
}

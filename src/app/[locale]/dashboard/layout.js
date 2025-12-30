import { BraiderSidebar } from "@/components/generics/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <BraiderSidebar />
      
      {/* This div creates the main content area to the right of the sidebar */}
      <div className="md:ml-64">
        {children} {/* The content from your page.js will be rendered here */}
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  GalleryVertical,
  Globe,
  Settings,
  LifeBuoy,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

// Reusable NavLink component for links within the sidebar
const NavLink = ({ href, icon: Icon, children, active = false }) => {
  const activeClass = active ? "bg-white/20" : "hover:bg-white/10";
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeClass}`}
      >
        <Icon className="w-5 h-5" />
        <span className="ml-4 font-medium">{children}</span>
      </Link>
    </li>
  );
};

// The content of the sidebar (logo, links, etc.)
// Extracted to a separate component to be used in both desktop and mobile views
const SidebarContent = () => (
  <div className="flex flex-col justify-between h-full p-4 text-black">
    {/* Top Section: Logo and Main Navigation */}
    <div>
      <div className="flex items-center mb-10 pl-2">
        <Image
          src="/images/setuplogo.png"
          alt="Logo"
          width={500}
          height={500}
          className="h-10 w-auto"
        />
      </div>
      <ul className="space-y-2">
        <NavLink href="/dashboard" icon={LayoutDashboard} active>
          Dashboard
        </NavLink>
        <NavLink href="/dashboard/bookings" icon={CalendarDays}>
          Bookings
        </NavLink>
        <NavLink href="/dashboard/clients" icon={Users}>
          Clients
        </NavLink>
        <NavLink href="/dashboard/earnings" icon={Wallet}>
          Earnings
        </NavLink>
        <NavLink href="/dashboard/portfolio" icon={GalleryVertical}>
          Portfolio
        </NavLink>
      </ul>
    </div>
    {/* Bottom Section: Settings and Support */}
    <div>
      <ul className="space-y-2">
        <NavLink href="/dashboard/settings" icon={Settings}>
          Settings
        </NavLink>
        <NavLink href="/dashboard/language" icon={Globe}>
          Language
        </NavLink>
        <NavLink href="/dashboard/support" icon={LifeBuoy}>
          Support
        </NavLink>
      </ul>
    </div>
  </div>
);

// The main Sidebar component that handles responsive behavior
export const BraiderSidebar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible on md screens and up) */}
      <aside className="hidden md:flex md:flex-col w-64 h-screen fixed top-0 left-0 bg-white">
        <SidebarContent />
      </aside>

      {/* MOBILE EXPERIENCE                            */}

      {/* --- Mobile Top Bar --- */}
      <header className="md:hidden flex justify-between items-center p-4 text-white bg-[#b5734c] sticky top-0 z-20">
        <Image
          src="/images/setuplogo.png"
          alt="Logo"
          width={500}
          height={500}
          className="h-8 w-auto"
        />
        <button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* --- Mobile Slide-out Drawer Menu --- */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-white transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-4 right-4 text-white"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
        <SidebarContent />
      </div>

      {/* --- Overlay (for when mobile menu is open) --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

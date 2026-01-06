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
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/navigation";
import { signOut } from "next-auth/react";

const NavLink = ({ href, icon: Icon, children }) => {
  const pathname = usePathname();

  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const activeClass = isActive
    ? "bg-[#b5734c]/10 text-[#b5734c]"
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center p-3 rounded-lg transition-colors duration-200 group ${activeClass}`}
      >
        <Icon
          className={`w-5 h-5 ${
            isActive
              ? "text-[#b5734c]"
              : "text-gray-400 group-hover:text-gray-600"
          }`}
        />
        <span className="ml-4 font-medium">{children}</span>
      </Link>
    </li>
  );
};

const SidebarContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const switchLanguage = (locale) => {
    router.replace(pathname, { locale });
    setIsLangOpen(false);
  };

  const languages = [
    { code: "en", label: "English (EN)" },
    { code: "de", label: "Deutsch (DE)" },
    { code: "fr", label: "Français (FR)" },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex flex-col justify-between h-full p-4">
      <div>
        <div className="flex items-center mb-10 pl-2">
          <Link href="/dashboard">
            <Image
              src="/images/setuplogo.png"
              alt="Logo"
              width={150}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        <ul className="space-y-2">
          <NavLink href="/dashboard" icon={LayoutDashboard}>
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

      <div>
        <ul className="space-y-2">
          <NavLink href="/dashboard/settings" icon={Settings}>
            Settings
          </NavLink>

          <li>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${
                isLangOpen ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="ml-4 font-medium">Language</span>
              </div>
              {isLangOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isLangOpen && (
              <div className="mt-1 ml-12 space-y-1 border-l-2 border-gray-100 pl-2 animate-in slide-in-from-top-2 duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-[#b5734c] hover:bg-orange-50 rounded-md transition-colors"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </li>

          <NavLink href="/dashboard/support" icon={LifeBuoy}>
            Support
          </NavLink>

          <li className="pt-2 mt-2 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg transition-colors duration-200 group text-gray-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
              <span className="ml-4 font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const BraiderSidebar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <aside className="hidden md:flex md:flex-col w-64 h-screen fixed top-0 left-0 bg-white border-r border-gray-100 z-30">
        <SidebarContent />
      </aside>

      <header className="md:hidden flex justify-between items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <Image
          src="/images/setuplogo.png"
          alt="Logo"
          width={120}
          height={32}
          className="h-8 w-auto object-contain"
        />
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div
        className={`fixed inset-y-0 left-0 w-64 z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
          <SidebarContent />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

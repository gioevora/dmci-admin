'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeSwitch } from './theme-switch';
import {
  Box, Building, Badge, Calendar, Handshake, HardHat, HelpingHand,
  LogOut, Newspaper, Star, User, LayoutDashboard, Settings,
  Building2, Image,
} from 'lucide-react';
import { Link } from "@heroui/react";
import { setCookie } from 'nookies';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserType(sessionStorage.getItem('type'));
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    setCookie(null, 'abic-admin-login', '', { path: '/', maxAge: -1 });
    sessionStorage.clear();
    window.location.href = '/admin-login';
  };

  return (
    <>
      {/* Navbar */}
      <nav className="md:hidden fixed top-0 z-50 bg-white shadow-md w-full dark:bg-[#18181b] dark:border-gray-700 md:z-30">
        <div className="flex justify-between items-center px-3 py-3 lg:px-5 lg:pl-3">
          {/* Sidebar Toggle Button */}
          <div className='flex items-center gap-2'>
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#27272a] focus:outline-none"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
              </svg>
            </button>
            {/* Mobile Logo */}
            <a href="/" className="md:hidden">
              <img
                src="https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/media/ABIC+Realty.png"
                className="h-12"
                alt="Abic Realty & Consultancy Corporation"
              />
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <ThemeSwitch />
            <img
              className="w-8 h-8 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="User Profile"
            />
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 dark:bg-[#18181b] dark:border-gray-700 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Desktop Logo */}
        <div className="hidden md:flex justify-center py-6">
          <a href="/">
            <img
              src="https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/media/ABIC+Realty.png"
              alt="Abic Realty & Consultancy Corporation"
              className="h-20"
            />
          </a>
        </div>

        {/* Sidebar Menu */}
        <div className="h-screen px-6 pb-4 overflow-y-auto">
          <ul className="space-y-2 top-20">
            {sidebarLinks.map(({ href, icon, text }) => (
              <SidebarItem key={href} href={href} icon={icon} text={text} pathname={pathname} />
            ))}
          </ul>
          <div className='py-8'>
            <button
              onClick={handleLogout}
              className="flex w-full items-center p-2 rounded-lg text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#27272a] transition duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const sidebarLinks = [
  { href: "/admin", icon: <LayoutDashboard size={18} />, text: "Dashboard" },
  { href: "/admin/property", icon: <Building2 size={18} />, text: "Properties" },
  { href: "/admin/inquiries", icon: <HelpingHand size={18} />, text: "Inquiries" },
  { href: "/admin/schedules", icon: <Calendar size={18} />, text: "Schedules" },
  { href: "/admin/articles", icon: <Newspaper size={18} />, text: "Articles" },
  { href: "/admin/careers", icon: <HardHat size={18} />, text: "Careers" },
  { href: "/admin/certificates", icon: <Badge size={18} />, text: "Certificates" },
  { href: "/admin/items", icon: <Box size={18} />, text: "Items" },
  { href: "/admin/partners", icon: <Handshake size={18} />, text: "Partners" },
  { href: "/admin/testimonials", icon: <Star size={18} />, text: "Testimonials" },
  { href: "/admin/photos", icon: <Image size={18} />, text: "Photos" },
  { href: "/admin/user", icon: <User size={18} />, text: "User" },
  { href: "/admin/settings", icon: <Settings size={18} />, text: "Settings" },
];

const SidebarItem: React.FC<{ href: string; icon: JSX.Element; text: string; pathname: string }> = ({ href, icon, text, pathname }) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center top-24 md:top-0 p-2 rounded-lg transition duration-200 ${isActive ? 'bg-violet-500 font-bold dark:bg-gray-700 text-white' : 'text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#27272a]'}`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="ml-3">{text}</span>
    </Link>
  );
};

export default Navbar;

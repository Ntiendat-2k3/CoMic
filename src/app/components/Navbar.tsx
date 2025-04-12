"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Category, Comic } from "../types";
import OTruyenService from "../services/otruyen.service";
import Search from "./Search";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const Dropdown = dynamic(() => import("./Dropdown"), {
  loading: () => <div className="w-40 h-6 bg-gray-100 animate-pulse" />,
});

interface NavbarProps {
  categories: Category[];
}

const Navbar = ({ categories }: NavbarProps) => {
  const [searchResults, setSearchResults] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { isSignedIn, user } = useUser();
  console.log("🚀 ~ Navbar ~ user:", user);

  const handleSearch = useCallback(async (keyword: string) => {
    if (keyword.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await OTruyenService.searchComics(keyword);
      setSearchResults(response.data.data.items);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <nav className="w-full bg-primary text-white shadow-md">
      <div className="container px-4 py-2 flex items-center justify-between">
        {/* Phần logo */}
        <div className="flex items-center space-x-2 py-4">
          {/* <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="h-15 w-16 object-contain"
            />
          </Link> */}
          <span className="font-love font-bold text-3xl animate-gradient bg-clip-text text-transparent bg-[length:200%] bg-[linear-gradient(90deg,#4f46e5,#ec4899,#4f46e5)]">
            TruyenHay
          </span>
        </div>

        {/* Phần chức năng */}
        <div className="flex items-center gap-6">
          {/* tìm kiếm */}
          <Search
            searchResults={searchResults}
            isLoading={isLoading}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSearch={handleSearch}
          />

          <Dropdown categories={categories} />

          {/* Các nút đăng nhập/đăng ký */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <span>Hi, {user?.fullName}</span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonBox: "flex-row-reverse",
                      userButtonAvatarBox: "size-11",
                      userButtonTrigger: "text-white hover:bg-white/10 size-10",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="hover:opacity-80 transition-opacity px-3 py-2 rounded hover:bg-white/10">
                    Đăng nhập
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="bg-white text-primary px-4 py-2 rounded-md hover:bg-primary-light hover:text-white transition-colors">
                    Đăng ký
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

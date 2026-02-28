"use client";

import ProfileButton from "./ProfileButton";
import SearchBar from "./SearchBar";
import CreateClientButton from "./CreateClientButton";
import { useSelector } from "react-redux";
import { selectFilteredClients } from "@/store/features/clientSlice";

interface DashboardNavbarProps {
  userName: string;
  userImage?: string;
  userEmail?: string;
  onSearch: (query: string) => void;
  onCreateClient: () => void;
}

export default function DashboardNavbar({
  userName,
  userImage,
  userEmail,
  onSearch,
  onCreateClient,
}: DashboardNavbarProps) {
  const clients = useSelector(selectFilteredClients);
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <button onClick={() => console.log("btn clicked :" , clients)}>Click me</button>
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Profile */}
        <div className="shrink-0">
          <ProfileButton
            userName={userName}
            userImage={userImage}
            userEmail={userEmail}
          />
        </div>

        {/* Center: Search */}
        <div className="flex flex-1 justify-center px-4">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Right: Create Client */}
        <div className="shrink-0">
          <CreateClientButton onClick={onCreateClient} />
        </div>
      </div>
    </nav>
  );
}

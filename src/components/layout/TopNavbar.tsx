
import { Logo } from "./navbar/Logo";
import { SearchBar } from "./navbar/SearchBar";
import { NotificationsButton } from "./navbar/NotificationsButton";
import { UserAvatar } from "./navbar/UserAvatar";
import { WebsiteLink } from "./navbar/WebsiteLink";
import { useAuth } from '@/contexts/AuthContext';

export function TopNavbar() {
  const { user } = useAuth();
  
  return (
    <div className="border-b border-border/40 py-3 px-4 flex items-center justify-between backdrop-blur-md bg-black/30">
      <div className="flex-1 flex items-center gap-4">
        <Logo />
        <SearchBar />
      </div>
      <div className="flex items-center gap-4">
        <NotificationsButton />
        <UserAvatar 
          username={user?.email?.split('@')[0] || "User"}
          email={user?.email || undefined}
        />
        <WebsiteLink url="www.scserp.com.au" />
      </div>
    </div>
  );
}

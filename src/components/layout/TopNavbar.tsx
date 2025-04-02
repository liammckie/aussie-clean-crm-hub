
import { SidebarToggle } from "./navbar/SidebarToggle";
import { Logo } from "./navbar/Logo";
import { SearchBar } from "./navbar/SearchBar";
import { NotificationsButton } from "./navbar/NotificationsButton";
import { UserAvatar } from "./navbar/UserAvatar";
import { WebsiteLink } from "./navbar/WebsiteLink";

export function TopNavbar() {
  return (
    <div className="border-b border-border/40 py-3 px-4 flex items-center justify-between">
      <div className="flex-1 flex items-center gap-4">
        <SidebarToggle />
        <Logo />
        <SearchBar />
      </div>
      <div className="flex items-center gap-4">
        <NotificationsButton />
        <UserAvatar />
        <WebsiteLink url="www.scserp.com.au" />
      </div>
    </div>
  );
}

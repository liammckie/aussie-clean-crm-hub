
import { Bell } from "lucide-react";

export function NotificationsButton() {
  return (
    <button className="relative">
      <Bell className="h-5 w-5 text-muted-foreground" />
      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
        3
      </span>
    </button>
  );
}

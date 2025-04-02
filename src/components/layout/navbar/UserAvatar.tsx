
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserAvatar() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  );
}


import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search..." 
        className="pl-8 bg-muted/50 border-muted" 
      />
    </div>
  );
}

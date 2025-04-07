
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ErrorReporting } from "@/utils/errorReporting";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Report 404 errors to Sentry
    ErrorReporting.captureMessage(
      `404: Route not found: ${location.pathname}`, 
      "warning"
    );
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center max-w-md p-8">
        <h1 className="text-7xl font-bold text-red-500 mb-4">404</h1>
        <div className="h-1 w-16 bg-indigo-500 mx-auto mb-6"></div>
        <p className="text-xl text-slate-300 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          variant="default" 
          onClick={() => window.location.href = "/"}
          className="gap-2"
        >
          <HomeIcon className="w-4 h-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

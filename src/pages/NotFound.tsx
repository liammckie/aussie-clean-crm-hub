
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ErrorReporting } from "@/utils/errorReporting";
import { Custom404Page } from "@/components/error/Custom404Page";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Report 404 errors to Sentry with correct parameter count
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
    <Custom404Page
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      returnToHomepageLink="/"
    />
  );
};

export default NotFound;

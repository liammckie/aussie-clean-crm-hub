
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { getErrorPageTranslations, getBrowserLanguage } from "@/utils/i18n";

interface Custom404PageProps {
  title?: string;
  description?: string;
  returnToHomepageLink?: string;
}

export function Custom404Page({
  title,
  description,
  returnToHomepageLink = "/",
}: Custom404PageProps) {
  const navigate = useNavigate();
  const [translations, setTranslations] = useState(getErrorPageTranslations());
  
  useEffect(() => {
    // Set translations based on browser language
    setTranslations(getErrorPageTranslations());
  }, []);
  
  const handleReturnHome = () => {
    navigate(returnToHomepageLink);
  };

  const pageTitle = title || translations.pageNotFound;
  const pageDescription = description || translations.pageNotFoundDescription;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 shadow-xl text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 animate-float">
              <span className="text-4xl font-bold text-red-500">404</span>
            </div>
          </div>
          
          <Heading title={pageTitle} />
          
          <p className="mt-3 text-muted-foreground">
            {pageDescription}
          </p>
          
          <div className="mt-8">
            <Button 
              onClick={handleReturnHome}
              className="gap-2"
              variant="gradient"
            >
              <HomeIcon className="h-4 w-4" />
              {translations.returnToHomepage}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

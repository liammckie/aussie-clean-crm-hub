
import React from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginBackground } from "@/components/login/LoginBackground";
import { BrandSection } from "@/components/login/BrandSection";
import { LoginForm } from "@/components/login/LoginForm";
import { ErrorTest } from "@/components/error/ErrorTest";

export default function Login() {
  // For development/testing - will only show in development mode
  const showErrorTest = import.meta.env.DEV;

  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-slate-950 relative">
        {/* Background elements */}
        <LoginBackground />
        
        {/* Content container */}
        <div className="min-h-screen flex flex-col md:flex-row items-stretch w-full z-10">
          {/* Left side: Brand and FAQs */}
          <BrandSection />
          
          {/* Right side: Login Form */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 relative">
            <LoginForm />
            
            {/* Only show error test component in development mode */}
            {showErrorTest && (
              <div className="mt-8 w-full max-w-md">
                <ErrorTest />
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

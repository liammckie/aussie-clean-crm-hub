
import React from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginBackground } from "@/components/login/LoginBackground";
import { BrandSection } from "@/components/login/BrandSection";
import { LoginForm } from "@/components/login/LoginForm";

export default function Login() {
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
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

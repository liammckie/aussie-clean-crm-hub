
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/App";

// Create a schema for login validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Initialize react-hook-form with zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // This is a mock authentication - in a real application, this would call an API
      // For demo purposes, we'll simulate a successful login after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });
      
      // Call the login function from auth context
      login();
      
      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      // Show error message if login fails
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="w-full max-w-2xl mb-8 relative">
          {/* Glass morphism container for video */}
          <div className="absolute inset-0 bg-purple-500/5 backdrop-blur-sm rounded-xl border border-purple-400/10 z-0"></div>
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-radial-gradient rounded-xl z-0 opacity-40"></div>
          
          {/* Video container */}
          <div className="relative z-10 p-3 rounded-xl overflow-hidden shadow-[0_0_45px_rgba(139,92,246,0.15)]">
            <video 
              src="/loading-intro.mp4"
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-auto rounded-lg shadow-inner bg-[rgb(2,8,23)] border border-indigo-900/30"
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Tech decoration elements */}
            <div className="absolute top-3 left-3 w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
            <div className="absolute top-3 right-3 w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-150"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 bg-violet-500 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
        
        <Card className="w-full max-w-md border-purple-900/20 bg-slate-900/90 backdrop-blur-sm shadow-[0_10px_40px_rgba(91,33,182,0.1)]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Aussie Clean CRM</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the ERP system
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} className="bg-slate-800/50 border-slate-700 focus:border-purple-500 transition-colors" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="bg-slate-800/50 border-slate-700 focus:border-purple-500 transition-colors" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Form>
          <div className="px-6 pb-6 pt-2 text-center">
            <p className="text-xs text-slate-500">
              Secure Enterprise Resource Planning System
            </p>
          </div>
        </Card>
        
        {/* Tech decoration lines */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
      </div>
    </AuthLayout>
  );
}

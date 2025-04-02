
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/App";

// Create a schema for login validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
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
    <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 relative">
      {/* Glass form card with enhanced effects */}
      <Card className="w-full max-w-md bg-white/[0.02] backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden rounded-2xl">
        {/* Subtle light reflection effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-md transform rotate-45"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-t from-white/5 to-transparent rounded-full blur-md"></div>
        
        {/* Colored edge glow */}
        <div className="absolute inset-0 rounded-2xl p-px z-[-1] bg-gradient-to-br from-purple-500/20 via-indigo-500/5 to-transparent opacity-50"></div>
        
        <CardHeader className="space-y-1 relative">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
            Sign In
          </CardTitle>
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
                      <Input 
                        placeholder="you@example.com" 
                        {...field} 
                        className="bg-white/[0.02] border-white/10 focus:border-purple-500 transition-colors focus:bg-white/[0.03]" 
                      />
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
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white/[0.02] border-white/10 focus:border-purple-500 transition-colors focus:bg-white/[0.03]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button variant="link" className="p-0 h-auto text-xs text-purple-400 hover:text-purple-300">
                  Forgot password?
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full relative group overflow-hidden"
                disabled={isLoading}
              >
                {/* Button background with gradient & glow */}
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300"></span>
                
                {/* Light reflection effect */}
                <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <span className="absolute -top-10 -left-10 w-20 h-20 bg-white/60 rounded-full blur-md transform rotate-12 translate-x-0 group-hover:translate-x-[400%] transition-transform duration-700"></span>
                </span>
                
                {/* Button content */}
                <span className="relative text-white">
                  {isLoading ? "Signing in..." : "Sign In"}
                </span>
              </Button>
              
              <div className="text-xs text-center text-slate-500 mt-4">
                <p>
                  Secure Enterprise Resource Planning System
                </p>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

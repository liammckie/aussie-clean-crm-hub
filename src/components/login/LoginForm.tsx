import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useAuth } from "@/contexts/AuthContext";
import { ErrorReporting } from "@/utils/errorReporting";

// Create a schema for login validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(true)
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth(); // Changed from login to signIn to match the AuthContext
  
  // Initialize react-hook-form with zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true, // Default to remember me
    },
    mode: "onChange", // Enable validation as the user types
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Log login attempt (with privacy protection)
      ErrorReporting.captureMessage(
        "Login attempt", 
        { email: data.email, hasPassword: !!data.password },
        "info"
      );
      
      // Call the signIn function from auth context instead of login
      await signIn(data.email, data.password);
      
      // Show success message
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });
      
      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      // Report the error to Sentry (password filtered out for privacy)
      ErrorReporting.captureException(
        error as Error,
        { email: data.email, formData: "filtered-for-privacy" }
      );
      
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
    <div className="w-full max-w-md">
      {/* Glass form card with enhanced effects */}
      <Card className="w-full bg-white/[0.02] backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden rounded-2xl">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        type="email"
                        autoComplete="email"
                        className="bg-white/[0.02] border-white/10 focus:border-purple-500 transition-colors focus:bg-white/[0.03]"
                        {...field} 
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
                        autoComplete="current-password"
                        className="bg-white/[0.02] border-white/10 focus:border-purple-500 transition-colors focus:bg-white/[0.03]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" 
                        />
                      </FormControl>
                      <div className="space-y-0 leading-none">
                        <FormLabel className="text-xs text-slate-300 cursor-pointer">
                          Remember me
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
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


import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from 'lucide-react';

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export function LoginForm() {
  const { signIn, setAdminSession } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      await signIn(values.email, values.password);
      navigate('/dashboard'); // Navigate to dashboard after successful login
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  const handleDevMode = () => {
    setAdminSession();
    navigate('/dashboard'); // Navigate to dashboard after setting admin session
  };

  return (
    <Card className="w-full max-w-md bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Login to CleanMap</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your.email@example.com" 
                      {...field}
                      className="bg-slate-800 border-slate-700 text-slate-300" 
                      aria-label="Email address"
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
                      placeholder="••••••••" 
                      {...field} 
                      className="bg-slate-800 border-slate-700 text-slate-300"
                      aria-label="Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              aria-label={isLoading ? "Logging in..." : "Login"}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 pt-4">
          <Separator className="my-4 bg-slate-700" />
          <div className="flex items-center justify-center gap-1 text-sm text-amber-400 mb-4">
            <AlertCircle size={16} />
            <span>Development Options Only</span>
          </div>
          <Button 
            variant="outline" 
            className="w-full bg-slate-800 hover:bg-slate-700 border-slate-700"
            onClick={handleDevMode}
            aria-label="Use Development Mode"
          >
            Use Development Mode
          </Button>
          <div className="mt-2 text-xs text-slate-500 text-center">
            This bypasses authentication for testing purposes only
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-slate-500">
        <span>Need help? Contact support</span>
        <span>v1.0.0</span>
      </CardFooter>
    </Card>
  );
}

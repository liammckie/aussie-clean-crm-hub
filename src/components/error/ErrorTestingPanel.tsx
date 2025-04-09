
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ErrorTestTab,
  MessageTestTab,
  FeedbackTestTab,
  SystemControlTab,
  StatusDisplay
} from "@/components/error/testing";

export const ErrorTestingPanel = () => {
  const [status, setStatus] = useState<string | null>(null);
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Error Reporting Test Panel</CardTitle>
        <CardDescription>
          Test the error reporting system by generating errors, messages, and feedback.
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="errors">
        <TabsList className="mx-6 mb-2">
          <TabsTrigger value="errors">Test Errors</TabsTrigger>
          <TabsTrigger value="messages">Test Messages</TabsTrigger>
          <TabsTrigger value="feedback">Test Feedback</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <CardContent>
          <TabsContent value="errors">
            <ErrorTestTab setStatus={setStatus} />
          </TabsContent>
          
          <TabsContent value="messages">
            <MessageTestTab setStatus={setStatus} />
          </TabsContent>
          
          <TabsContent value="feedback">
            <FeedbackTestTab setStatus={setStatus} />
          </TabsContent>
          
          <TabsContent value="system">
            <SystemControlTab setStatus={setStatus} />
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex-col items-start">
        <StatusDisplay status={status} />
      </CardFooter>
    </Card>
  );
};

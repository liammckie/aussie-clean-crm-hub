
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorTester } from "@/utils/testing/errorTester";
import { ErrorReporting } from "@/utils/errorReporting";
import { AppLogger, LogCategory } from "@/utils/logging";

export const ErrorTestingPanel = () => {
  const [errorMessage, setErrorMessage] = useState("Test error message");
  const [messageText, setMessageText] = useState("Test info message");
  const [messageLevel, setMessageLevel] = useState<"info" | "warning" | "error">("info");
  const [feedbackText, setFeedbackText] = useState("Test feedback message");
  const [feedbackCategory, setFeedbackCategory] = useState("general");
  const [status, setStatus] = useState<string | null>(null);
  
  const handleGenerateError = () => {
    try {
      setStatus("Generating test error...");
      ErrorTester.generateTestError(errorMessage);
      setStatus("Test error successfully generated and logged!");
    } catch (err) {
      setStatus("Error occurred while testing: " + String(err));
    }
  };
  
  const handleSendMessage = () => {
    try {
      setStatus("Sending test message...");
      ErrorTester.generateTestMessage(messageText, messageLevel);
      setStatus("Test message successfully sent and logged!");
    } catch (err) {
      setStatus("Error occurred while sending message: " + String(err));
    }
  };
  
  const handleSendFeedback = () => {
    try {
      setStatus("Sending test feedback...");
      ErrorTester.generateTestFeedback(feedbackText, feedbackCategory);
      setStatus("Test feedback successfully sent and logged!");
    } catch (err) {
      setStatus("Error occurred while sending feedback: " + String(err));
    }
  };
  
  const checkInitialization = () => {
    AppLogger.info(LogCategory.SYSTEM, "Checking error reporting initialization");
    setStatus(ErrorReporting.isInitialized ? 
      "Error reporting is initialized" : 
      "Error reporting is NOT initialized");
  };
  
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="error-message">Error Message</Label>
                <Input 
                  id="error-message" 
                  value={errorMessage} 
                  onChange={(e) => setErrorMessage(e.target.value)}
                />
              </div>
              
              <Button onClick={handleGenerateError} variant="secondary">
                Generate Test Error
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="messages">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message-text">Message Text</Label>
                <Input 
                  id="message-text" 
                  value={messageText} 
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message-level">Message Level</Label>
                <Select 
                  value={messageLevel} 
                  onValueChange={(value) => setMessageLevel(value as any)}
                >
                  <SelectTrigger id="message-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleSendMessage} variant="secondary">
                Send Test Message
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="feedback">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback-text">Feedback Text</Label>
                <Input 
                  id="feedback-text" 
                  value={feedbackText} 
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback-category">Feedback Category</Label>
                <Input 
                  id="feedback-category" 
                  value={feedbackCategory} 
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                />
              </div>
              
              <Button onClick={handleSendFeedback} variant="secondary">
                Send Test Feedback
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="system">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Check the initialization status of the error reporting system.
                </p>
                <Button onClick={checkInitialization} variant="outline">
                  Check Initialization Status
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Toggle error reporting on/off.
                </p>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => {
                      ErrorReporting.setEnabled(true);
                      setStatus("Error reporting enabled");
                    }} 
                    variant="outline"
                    className="flex-1"
                  >
                    Enable
                  </Button>
                  <Button 
                    onClick={() => {
                      ErrorReporting.setEnabled(false);
                      setStatus("Error reporting disabled");
                    }} 
                    variant="outline"
                    className="flex-1"
                  >
                    Disable
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex-col items-start">
        {status && (
          <div className="p-2 w-full rounded bg-secondary/50 text-sm">
            <p>{status}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

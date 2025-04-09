
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorTester } from "@/utils/testing/errorTester";

interface MessageTestTabProps {
  setStatus: (status: string) => void;
}

export const MessageTestTab: React.FC<MessageTestTabProps> = ({ setStatus }) => {
  const [messageText, setMessageText] = React.useState("Test info message");
  const [messageLevel, setMessageLevel] = React.useState<"info" | "warning" | "error">("info");
  
  const handleSendMessage = () => {
    try {
      setStatus("Sending test message...");
      ErrorTester.generateTestMessage(messageText, messageLevel);
      setStatus("Test message successfully sent and logged!");
    } catch (err) {
      setStatus("Error occurred while sending message: " + String(err));
    }
  };
  
  return (
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
  );
};

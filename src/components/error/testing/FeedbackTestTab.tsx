
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorTester } from "@/utils/testing/errorTester";

interface FeedbackTestTabProps {
  setStatus: (status: string) => void;
}

export const FeedbackTestTab: React.FC<FeedbackTestTabProps> = ({ setStatus }) => {
  const [feedbackText, setFeedbackText] = React.useState("Test feedback message");
  const [feedbackCategory, setFeedbackCategory] = React.useState("general");
  
  const handleSendFeedback = () => {
    try {
      setStatus("Sending test feedback...");
      ErrorTester.generateTestFeedback(feedbackText, feedbackCategory);
      setStatus("Test feedback successfully sent and logged!");
    } catch (err) {
      setStatus("Error occurred while sending feedback: " + String(err));
    }
  };
  
  return (
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
  );
};

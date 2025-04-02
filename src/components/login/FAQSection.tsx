
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Info, Shield, Users } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
};

export function FAQSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    if (expandedFAQ === id) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(id);
    }
  };

  const faqs: FAQ[] = [
    {
      id: 'faq1',
      question: 'What is Aussie Clean ERP?',
      answer: 'Aussie Clean ERP is a comprehensive enterprise resource planning system designed specifically for cleaning businesses to manage operations, scheduling, inventory, and client relationships.',
      icon: <Info className="w-5 h-5" />
    },
    {
      id: 'faq2',
      question: 'How secure is my data?',
      answer: 'We implement industry-leading security measures including end-to-end encryption, regular security audits, and multi-factor authentication to ensure your data remains protected.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'faq3',
      question: 'Can I manage my team through this platform?',
      answer: 'Yes, our ERP system includes robust team management features including scheduling, performance tracking, and automated task assignment to optimize your workforce.',
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <div className="grid gap-5 mt-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/0 via-purple-900/5 to-purple-900/0 rounded-xl"></div>
      <div className="space-y-4 relative">
        {faqs.map((faq) => (
          <Collapsible 
            key={faq.id} 
            open={expandedFAQ === faq.id}
            className="backdrop-blur-lg bg-white/[0.02] border border-white/10 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-200 hover:bg-white/[0.03]"
          >
            <CollapsibleTrigger 
              onClick={() => toggleFAQ(faq.id)}
              className="flex items-center justify-between w-full p-4 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-md">
                  {faq.icon}
                </div>
                <h3 className="text-white font-medium">{faq.question}</h3>
              </div>
              {expandedFAQ === faq.id ? 
                <ChevronUp className="h-5 w-5 text-purple-400" /> : 
                <ChevronDown className="h-5 w-5 text-purple-400" />
              }
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-1 text-purple-200/80 text-sm">
              {faq.answer}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

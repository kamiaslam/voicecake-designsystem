import { useState, useEffect } from "react";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface ToolSelectorProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
}

// Mock tool data - in a real app, this would come from an API
const availableTools = [
  { id: "1", name: "Calendar Integration", description: "Schedule meetings and manage appointments" },
  { id: "2", name: "Email Management", description: "Send and receive emails" },
  { id: "3", name: "CRM Access", description: "Access customer relationship data" },
  { id: "4", name: "File Upload", description: "Handle file uploads and downloads" },
  { id: "5", name: "Database Query", description: "Query and retrieve data" },
  { id: "6", name: "Payment Processing", description: "Process payments and transactions" },
  { id: "7", name: "Weather API", description: "Get current weather information" },
  { id: "8", name: "Translation Service", description: "Translate text between languages" }
];

export function ToolSelector({ value, onValueChange, placeholder }: ToolSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToolToggle = (toolId: string) => {
    const newValue = value.includes(toolId)
      ? value.filter(id => id !== toolId)
      : [...value, toolId];
    onValueChange(newValue);
  };

  const selectedTools = availableTools.filter(tool => value.includes(tool.id));
  const displayTools = isExpanded ? availableTools : selectedTools.length > 0 ? selectedTools : availableTools.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Available Tools</span>
        {availableTools.length > 3 && (
          <Button
            isStroke
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs h-8 px-3"
          >
            {isExpanded ? "Show Less" : `Show All (${availableTools.length})`}
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {displayTools.map((tool) => (
          <div key={tool.id} className="flex items-start space-x-3 p-3 border border-s-stroke2 rounded-2xl hover:border-s-highlight transition-colors">
            <Checkbox
              checked={value.includes(tool.id)}
              onChange={() => handleToolToggle(tool.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-t-primary">{tool.name}</div>
              <div className="text-xs text-t-secondary mt-1">{tool.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      {value.length > 0 && (
        <div className="text-xs text-t-secondary">
          {value.length} tool{value.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}

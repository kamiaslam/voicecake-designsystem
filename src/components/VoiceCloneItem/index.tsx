"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import { VoiceCloneResponse } from "@/types/voice";
import { voiceCloneAPI } from "@/services/api";
import { toast } from "sonner";

interface VoiceCloneItemProps {
  voice: VoiceCloneResponse;
  index: number;
  onDelete?: (id: number) => void;
  onUpdate?: () => void;
}

export default function VoiceCloneItem({ 
  voice, 
  index,
  onDelete,
  onUpdate
}: VoiceCloneItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "success";
      case "training": return "warning";
      case "failed": return "error";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return "check_circle";
      case "training": return "clock";
      case "failed": return "error";
      default: return "help";
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // TODO: Implement audio playback
    setTimeout(() => setIsPlaying(false), 2000);
    toast.info("Audio playback would start here");
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      setIsDeleting(true);
      await voiceCloneAPI.deleteVoiceClone(voice.id.toString());
      onDelete(voice.id);
      toast.success("Voice clone deleted successfully");
    } catch (error) {
      console.error('Error deleting voice clone:', error);
      toast.error("Failed to delete voice clone");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-depth transition-all duration-200 group">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon 
              name="microphone" 
              className="w-5 h-5 text-primary-01" 
            />
            <Badge 
              variant={getStatusColor(voice.status || "ready")}
              className="text-xs"
            >
              {voice.status || "ready"}
            </Badge>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handlePlay}
              disabled={isPlaying}
            >
              <Icon 
                name={isPlaying ? "pause" : "play"} 
                className="w-4 h-4" 
              />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-primary-05 hover:text-primary-05"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Icon 
                  name={isDeleting ? "spinner" : "trash"} 
                  className="w-4 h-4" 
                />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-h6 text-t-primary font-medium mb-1">
              {voice.name}
            </h3>
            {voice.description && (
              <p className="text-body-2 text-t-secondary line-clamp-2">
                {voice.description}
              </p>
            )}
          </div>

          {/* Details */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Icon name="calendar" className="w-4 h-4 text-t-tertiary" />
                <span className="text-t-tertiary">
                  {formatDate(voice.created_at)}
                </span>
              </div>
              {voice.language && (
                <div className="flex items-center gap-1">
                  <Icon name="earth" className="w-4 h-4 text-t-tertiary" />
                  <span className="text-t-tertiary uppercase">
                    {voice.language}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Icon 
                name={getStatusIcon(voice.status || "ready")} 
                className="w-4 h-4 text-t-tertiary" 
              />
              <span className="text-t-tertiary">
                {voice.provider || "VoiceCake"}
              </span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              voice.status === "ready" ? "bg-primary-02" :
              voice.status === "training" ? "bg-primary-03" :
              voice.status === "failed" ? "bg-primary-05" : "bg-t-tertiary"
            }`}></div>
            <span className="text-caption text-t-tertiary">
              {voice.status === "ready" ? "Ready to use" :
               voice.status === "training" ? "Training in progress" :
               voice.status === "failed" ? "Training failed" : "Unknown status"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

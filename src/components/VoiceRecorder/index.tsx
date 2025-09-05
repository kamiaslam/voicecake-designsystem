"use client";

import { useState, useRef, useCallback } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onError?: (error: string) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

export default function VoiceRecorder({ 
  onRecordingComplete, 
  onError,
  maxDuration = 30,
  className = ""
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startTimer = useCallback(() => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxDuration) {
          stopRecording();
          return maxDuration;
        }
        return prev + 1;
      });
    }, 1000);
  }, [maxDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setIsProcessing(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete(audioBlob);
        setIsProcessing(false);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      startTimer();
      
      toast.success("Recording started");
    } catch (error) {
      console.error('Error starting recording:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      onError?.(errorMessage);
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      toast.success("Recording completed");
    }
  };

  const resetRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error("Failed to play recording");
      });
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="microphone" className="w-5 h-5 text-primary-01" />
            <h3 className="text-h6 text-t-primary font-medium">
              Voice Recording
            </h3>
          </div>
          {recordingTime > 0 && (
            <div className="flex items-center gap-1">
              <Icon name="clock" className="w-4 h-4 text-t-tertiary" />
              <span className="text-body-2 text-t-tertiary font-mono">
                {formatTime(recordingTime)}
              </span>
            </div>
          )}
        </div>

        {/* Recording Status */}
        <div className="flex items-center justify-center py-4">
          {isRecording ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary-05 flex items-center justify-center animate-pulse">
                  <Icon name="microphone" className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary-05 opacity-30 animate-ping"></div>
              </div>
              <div className="text-center">
                <p className="text-body-2 text-t-primary font-medium">
                  Recording in progress...
                </p>
                <p className="text-caption text-t-secondary">
                  Speak clearly into your microphone
                </p>
              </div>
            </div>
          ) : audioURL ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary-02 flex items-center justify-center">
                <Icon name="check_circle" className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-body-2 text-t-primary font-medium">
                  Recording complete
                </p>
                <p className="text-caption text-t-secondary">
                  Duration: {formatTime(recordingTime)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-b-surface1 flex items-center justify-center">
                <Icon name="microphone" className="w-8 h-8 text-t-tertiary" />
              </div>
              <div className="text-center">
                <p className="text-body-2 text-t-primary font-medium">
                  Ready to record
                </p>
                <p className="text-caption text-t-secondary">
                  Click to start recording your voice
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRecording && !audioURL && (
            <Button
              onClick={startRecording}
              disabled={isProcessing}
              className="gap-2"
            >
              <Icon name="microphone" className="w-4 h-4" />
              {isProcessing ? "Starting..." : "Start Recording"}
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              className="gap-2 bg-primary-05 hover:bg-primary-05/90 text-white"
            >
              <Icon name="stop" className="w-4 h-4" />
              Stop Recording
            </Button>
          )}

          {audioURL && (
            <>
              <Button
                onClick={playRecording}
                isStroke
                className="gap-2"
              >
                <Icon name="play" className="w-4 h-4" />
                Play
              </Button>
              <Button
                onClick={resetRecording}
                isStroke
                className="gap-2"
              >
                <Icon name="refresh" className="w-4 h-4" />
                Record Again
              </Button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-b-surface1 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Icon name="info" className="w-4 h-4 text-t-tertiary mt-0.5" />
            <div className="text-caption text-t-secondary">
              <p className="font-medium mb-1">Recording Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Record in a quiet environment</li>
                <li>• Keep the microphone 6-12 inches away</li>
                <li>• Maximum recording time: {maxDuration} seconds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

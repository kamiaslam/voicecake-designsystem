import React, { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

interface CallTranscriptPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CallTranscriptPanel: React.FC<CallTranscriptPanelProps> = ({ isOpen, onClose }) => {
    const [callDuration, setCallDuration] = useState(0);
    const [isRecording, setIsRecording] = useState(true);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isOpen && isRecording) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Modal open={isOpen} onClose={onClose} isSlidePanel>
            {/* Header */}
            <div className="flex items-center h-20 pl-10 pr-20 pt-5 pb-3 text-h5 max-md:h-18 max-md:pt-3 max-md:pl-9">
                Call Transcript
            </div>
            
            {/* Content Area */}
            <div className="h-[calc(100svh-5rem)] px-5 pb-5 overflow-y-auto max-md:h-[calc(100svh-4.5rem)] max-md:px-4">
                {/* Assistant Message */}
                <div className="space-y-3 mb-6">
                    <div className="text-primary-02 text-sm font-medium">Assistant</div>
                    <div className="bg-b-surface2 rounded-2xl p-4 text-t-primary">
                        Hello. This is Jess from Park Street Medical Centre. How can I help you today?
                    </div>
                </div>

                {/* Call Status and Timer */}
                <div className="flex items-center justify-between mb-6 p-4 bg-b-surface2 rounded-2xl">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-02 rounded-full animate-pulse"></div>
                        <span className="text-primary-02 text-sm font-medium">Call in progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Icon name="clock" className="w-4 h-4 fill-t-secondary" />
                        <span className="text-t-secondary text-sm font-medium">{formatTime(callDuration)}</span>
                    </div>
                </div>

                {/* Audio Visualization */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {/* Audio Bars */}
                        <div className="flex items-center justify-center space-x-1">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-gradient-to-t from-primary-02 to-primary-01 rounded-full animate-pulse"
                                    style={{
                                        height: `${Math.random() * 20 + 10}px`,
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: '0.8s'
                                    }}
                                />
                            ))}
                        </div>
                        
                        {/* Center Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-primary-02 rounded-full flex items-center justify-center">
                                <Icon name="microphone" className="w-4 h-4 fill-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center space-x-4">
                    <Button 
                        onClick={() => setIsRecording(!isRecording)}
                        className={`p-3 rounded-full ${isRecording ? 'bg-primary-02 hover:bg-primary-01' : 'bg-t-tertiary hover:bg-t-secondary'}`}
                    >
                        <Icon name={isRecording ? "pause" : "play"} className="w-5 h-5 fill-white" />
                    </Button>
                    
                    <Button 
                        onClick={onClose}
                        className="p-3 rounded-full bg-red-500 hover:bg-red-600"
                    >
                        <Icon name="phone" className="w-5 h-5 fill-white rotate-90" />
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CallTranscriptPanel;

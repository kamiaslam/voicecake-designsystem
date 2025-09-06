"use client";

import { useState, useEffect, useRef } from "react";
import { Element, scroller } from "react-scroll";
import { useRouter, useSearchParams } from "next/navigation";

// Extend Window interface to include scrollSpy
declare global {
    interface Window {
        scrollSpy?: {
            destroy: () => void;
            update: () => void;
        };
    }
}
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Badge from "@/components/Badge";
import Range from "@/components/Range";
import Search from "@/components/Search";
import { Link } from "react-scroll";
import CallTranscriptPanel from "@/components/CallTranscriptPanel";
import { CreateAgentModal } from "@/components/CreateAgentModal";
import { agentAPI } from "@/services/api";
import { toast } from "sonner";
import { allVoices, getVoicesByProvider, getCategoriesByProvider } from "@/lib/voiceConfig";
import { SelectOption } from "@/types/select";
import { AgentType } from "@/types/agent";
import { ToolSelector } from "@/components/ui/tool-selector";
import { useAgentEdit } from "@/context/agentEditContext";

const ElementWithOffset = ({
    className,
    name,
    children,
}: {
    className?: string;
    name: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="relative">
            <Element
                className={`absolute -top-21 left-0 right-0 ${className || ""}`}
                name={name}
            ></Element>
            {children}
        </div>
    );
};

// Model options from CreateAgentModal
const modelOptions = [
  { provider: "VOICECAKE", simpleName: "voicecake STS", displayName: "VoiceCake STS" },
  { provider: "OPEN_AI", simpleName: "gpt-5", displayName: "GPT 5" },
  { provider: "OPEN_AI", simpleName: "gpt-5-mini", displayName: "GPT 5 Mini" },
  { provider: "OPEN_AI", simpleName: "gpt-5-nano", displayName: "GPT 5 Nano" },
  { provider: "ANTHROPIC", simpleName: "claude-sonnet-4-20250514", displayName: "Claude Sonnet 4" },
  { provider: "OPEN_AI", simpleName: "gpt-4.1", displayName: "GPT 4.1" },
  { provider: "GOOGLE", simpleName: "gemini-2.5-flash", displayName: "Gemini 2.5 Flash" },
  { provider: "GROQ", simpleName: "kimi-k2-instruct", displayName: "Kimi K2" },
  { provider: "SAMBANOVA", simpleName: "Llama-4-Maverick-17B-128E-Instruct", displayName: "Llama 4 Maverick (17Bx128E)" },
  { provider: "CEREBRAS", simpleName: "qwen-3-235b-a22b-thinking-2507", displayName: "Qwen3 235B Thinking" },
  { provider: "CEREBRAS", simpleName: "qwen-3-235b-a22b-instruct-2507", displayName: "Qwen3 235B Instruct" },
  { provider: "ANTHROPIC", simpleName: "claude-3-7-sonnet-latest", displayName: "Claude 3.7 Sonnet" },
  { provider: "ANTHROPIC", simpleName: "claude-3-5-sonnet-latest", displayName: "Claude 3.5 Sonnet (latest)" },
  { provider: "AMAZON_BEDROCK", simpleName: "claude-3-5-sonnet-20240620-v1", displayName: "Claude 3.5 Sonnet (Amazon Bedrock)" },
  { provider: "OPEN_AI", simpleName: "gpt-4o", displayName: "GPT 4o" },
  { provider: "SAMBANOVA", simpleName: "Qwen3-32B", displayName: "Qwen3 32B" },
  { provider: "SAMBANOVA", simpleName: "DeepSeek-R1-Distill-Llama-70B", displayName: "DeepSeek R1-Distill (Llama 3.3 70B Instruct)" },
  { provider: "CEREBRAS", simpleName: "gpt-oss-120b", displayName: "Cerebras OpenAI GPT OSS" },
  { provider: "ANTHROPIC", simpleName: "claude-3-5-haiku-latest", displayName: "Claude 3.5 Haiku (latest)" },
  { provider: "ANTHROPIC", simpleName: "claude-3-5-sonnet-20240620", displayName: "Claude 3.5 Sonnet (20240620)" },
  { provider: "ANTHROPIC", simpleName: "claude-3-haiku-20240307", displayName: "Claude 3 Haiku (20240307)" },
  { provider: "AMAZON_BEDROCK", simpleName: "claude-3-5-haiku-20241022-v1", displayName: "Claude 3.5 Haiku (Amazon Bedrock Latency Optimized)" },
  { provider: "AMAZON_BEDROCK", simpleName: "claude-3-haiku-20240307-v1", displayName: "Claude 3 Haiku (Amazon Bedrock)" },
  { provider: "GOOGLE", simpleName: "gemini-2.0-flash", displayName: "Gemini 2.0 Flash" },
  { provider: "OPEN_AI", simpleName: "gpt-4-turbo", displayName: "GPT 4 Turbo" },
  { provider: "OPEN_AI", simpleName: "gpt-4o-mini", displayName: "GPT 4o Mini" },
  { provider: "GROQ", simpleName: "llama3-8b-8192", displayName: "Llama 3 8B (8192)" },
  { provider: "GROQ", simpleName: "llama3-70b-8192", displayName: "Llama 3 70B (8192)" },
  { provider: "GROQ", simpleName: "llama-3.3-70b-versatile", displayName: "Llama 3.3 70B (versatile)" },
  { provider: "GROQ", simpleName: "llama-3.1-8b-instant", displayName: "Llama 3.1 8B (instant)" },
  { provider: "FIREWORKS", simpleName: "mixtral-8x7b-instruct", displayName: "Mixtral 8x7B" },
  { provider: "FIREWORKS", simpleName: "llama-v3p1-405b-instruct", displayName: "Llama V3.1 405B" },
  { provider: "FIREWORKS", simpleName: "llama-v3p1-70b-instruct", displayName: "Llama V3.1 70B" },
  { provider: "FIREWORKS", simpleName: "llama-v3p1-8b-instruct", displayName: "Llama V3.1 8B" }
];

const CreateAssistantPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { editingAgent, isEditMode, clearEditState } = useAgentEdit();
    
    // Ref to track if component is mounted
    const isMountedRef = useRef(true);
    // Ref to track scroll spy state
    const scrollSpyEnabledRef = useRef(true);
    
    // Call Transcript Panel
    const [isCallPanelOpen, setIsCallPanelOpen] = useState(false);

    // Create Agent Modal
    const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState(false);

    // System Prompt expandable state
    const [isSystemPromptExpanded, setIsSystemPromptExpanded] = useState(false);

    // Agent Type Selection
    const [selectedAgentType, setSelectedAgentType] = useState<AgentType | null>(null);

    // Edit mode state is now managed by context

    // Form Data (matching CreateAgentModal structure)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        voice_provider: "",
        voice_category: "",
        voice_id: "",
        model_provider: "",
        model_resource: "",
        instructions: "",
        tool_ids: [] as string[]
    });

    // Loading state
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [createdAgentId, setCreatedAgentId] = useState<number | null>(null);

    // Performance Metrics (keeping existing)
    const [costRange, setCostRange] = useState([0, 50]);
    const [latencyRange, setLatencyRange] = useState([0, 100]);

    // Legacy fields (keeping for existing design compatibility)
    const [language, setLanguage] = useState("English");
    const [turnTaking, setTurnTaking] = useState("auto");
    const [emotionsSensitivity, setEmotionsSensitivity] = useState("0.5");

    // Training Data
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Handle mode parameter to force create mode
    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'create') {
            // Clear edit state when explicitly creating a new agent
            console.log('Mode=create detected, clearing edit state');
            clearEditState();
        }
    }, [searchParams, clearEditState]);

    // Initialize scroll spy safely
    useEffect(() => {
        // Clean up any existing scroll spy instances first
        try {
            if (typeof window !== 'undefined' && window.scrollSpy) {
                window.scrollSpy.destroy();
            }
        } catch (error) {
            console.warn('Scroll spy cleanup on mount warning:', error);
        }

        // Add a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            try {
                // Reset scroll spy state
                scrollSpyEnabledRef.current = true;
                isMountedRef.current = true;
                console.log('Scroll spy initialization completed');
            } catch (error) {
                console.warn('Scroll spy initialization warning:', error);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Cleanup effect
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            scrollSpyEnabledRef.current = false;
            
            // Clean up any scroll spy references
            try {
                if (typeof window !== 'undefined') {
                    // Disable scroll spy completely
                    if (window.scrollSpy) {
                        window.scrollSpy.destroy();
                    }
                    
                    // Remove any scroll event listeners
                    const scrollHandler = () => {};
                    window.removeEventListener('scroll', scrollHandler);
                    window.removeEventListener('scroll', scrollHandler, true);
                }
            } catch (error) {
                console.warn('Scroll spy cleanup warning:', error);
            }
        };
    }, []);

    // Initialize edit mode from context
    useEffect(() => {
        console.log('Context state:', { isEditMode, editingAgent: editingAgent?.name });
        if (isEditMode && editingAgent) {
            console.log('Setting up edit mode for agent:', editingAgent.name);
            // Set agent type
            setSelectedAgentType(editingAgent.agent_type || editingAgent.type || null);
            
            // Set form data
            setFormData({
                name: editingAgent.name || "",
                description: editingAgent.description || "",
                voice_provider: editingAgent.voice_provider === "hume" ? "voicecake" : editingAgent.voice_provider || "", // Map hume back to voicecake for form
                voice_category: "", // Will be set based on voice_id lookup
                voice_id: editingAgent.voice_id || "",
                model_provider: editingAgent.model_provider || "",
                model_resource: (editingAgent as any).model_resource || "",
                instructions: editingAgent.custom_instructions || "",
                tool_ids: editingAgent.tool_ids || []
            });
            
            // Set voice category based on voice_id lookup
            if (editingAgent.voice_provider && editingAgent.voice_id) {
                const mappedProvider = editingAgent.voice_provider === "hume" ? "voicecake" : editingAgent.voice_provider;
                const allVoicesForProvider = getVoicesByProvider(mappedProvider);
                const foundVoice = allVoicesForProvider.find(voice => voice.id === editingAgent.voice_id);
                if (foundVoice?.category) {
                    setFormData(prev => ({ ...prev, voice_category: foundVoice.category || "" }));
                }
            }
        } else {
            console.log('Setting up create mode');
            // Reset form when not in edit mode (create mode)
            setSelectedAgentType(null);
            setFormData({
                name: "",
                description: "",
                voice_provider: "",
                voice_category: "",
                voice_id: "",
                model_provider: "",
                model_resource: "",
                instructions: "",
                tool_ids: []
            });
        }
    }, [isEditMode, editingAgent]);

    // Debug: Log form data changes (commented out to prevent potential issues)
    // useEffect(() => {
    //     console.log('Form data updated:', formData);
    // }, [formData]);

    // Assign Numbers
    const phoneNumbers = [
        "+12025550123",
        "+12025550123", 
        "+12025550123"
    ];

    // Assign Automations
    const automations = [
        "Inbound → Empth → CRM",
        "Voice → Email",
        "Miscalled → Whatsapp"
    ];

    // Share Options
    const shareOptions = [
        { name: "Assistant Link", icon: "link" },
        { name: "WhatsApp", icon: "whatsapp" },
        { name: "Email", icon: "mail" },
        { name: "Facebook", icon: "facebook" },
        { name: "Twitter", icon: "twitter" },
        { name: "Instagram", icon: "instagram" }
    ];

    // Base navigation items
    const baseNavigation = [
        {
            title: "Agent Type",
            icon: "robot",
            description: "Select agent type",
            to: "agent-type",
        },
        {
            title: "Performance",
            icon: "chart",
            description: "Cost and latency metrics",
            to: "performance",
        },
        {
            title: "Model",
            icon: "model",
            description: "AI model configuration",
            to: "model",
        },
        {
            title: "Details",
            icon: "details",
            description: "Assistant details and settings",
            to: "details",
        },
        {
            title: "System Prompt",
            icon: "message",
            description: "Define assistant behavior",
            to: "system-prompt",
        },
        {
            title: "Tools",
            icon: "tools",
            description: "Select agent tools",
            to: "tools",
        },
        {
            title: "Training Data",
            icon: "file",
            description: "Upload training files",
            to: "training-data",
        },
        {
            title: "Assignments",
            icon: "link",
            description: "Phone numbers and automations",
            to: "assignments",
        },
    ];

    // Add Share section only when agent is created or editing
    const navigation = (isSuccess || isEditMode) 
        ? [
            ...baseNavigation,
        {
            title: "Share",
            icon: "share",
            description: "Share assistant with others",
            to: "share",
        },
        ]
        : baseNavigation;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleCreateAgent = (agentData: any) => {
        console.log("Agent created:", agentData);
        // Handle the created agent data here
        // You can redirect to the agents page or show a success message
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (isLoading || isSuccess) {
            console.log('Form submission blocked - already processing or completed');
            return;
        }
        
        if (!selectedAgentType) {
            toast.error("Please select an agent type");
            return;
        }

        // Validate required fields
        if (!formData.name.trim()) {
            toast.error("Agent name is required");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Description is required");
            return;
        }

        if (selectedAgentType === 'SPEECH') {
            if (!formData.voice_provider) {
                toast.error("Voice provider is required for Speech-to-Speech agents");
                return;
            }
            if (!formData.voice_id) {
                toast.error("Voice is required for Speech-to-Speech agents");
                return;
            }
            if (!formData.model_provider) {
                toast.error("AI model provider is required for Speech-to-Speech agents");
                return;
            }
            if (!formData.model_resource) {
                toast.error("AI model is required for Speech-to-Speech agents");
                return;
            }
        } else if (selectedAgentType === 'TEXT') {
            if (!formData.voice_provider) {
                toast.error("Voice provider is required for Text-to-Speech agents");
                return;
            }
            if (!formData.voice_id) {
                toast.error("Voice is required for Text-to-Speech agents");
                return;
            }
            if (!formData.instructions.trim()) {
                toast.error("Instructions are required for Text-to-Speech agents");
                return;
            }
        }

        // Additional validation for voice data
        if (selectedAgentType === 'TEXT' && (!formData.voice_provider || !formData.voice_id)) {
            toast.error("Please select both voice provider and voice");
            console.error('Voice validation failed:', { voice_provider: formData.voice_provider, voice_id: formData.voice_id });
            return;
        }

        setIsLoading(true);

        try {
            // Prepare the payload according to the API specification
            const agentPayload = {
                name: formData.name,
                voice_provider: formData.voice_provider === "voicecake" ? "hume" : formData.voice_provider, // Map voicecake to hume
                voice_id: formData.voice_id,
                description: formData.description,
                custom_instructions: formData.instructions,
                model_provider: formData.model_provider,
                model_resource: formData.model_resource,
                agent_type: selectedAgentType === 'SPEECH' ? 'SPEECH' : 'TEXT',
                tool_ids: formData.tool_ids
            };

            // Debug: Log the form data and payload
            console.log('Form Data:', formData);
            console.log('Agent Payload:', agentPayload);

            let response;
            if (isEditMode && editingAgent) {
                // Update existing agent
                console.log('Updating agent with payload:', agentPayload);
                response = await agentAPI.updateAgent(editingAgent.id.toString(), agentPayload);
                console.log("Agent updated successfully:", response);
                toast.success(`Agent "${formData.name}" updated successfully!`, {
                    description: "Your agent has been updated and is ready to use.",
                    duration: 5000,
                });
            } else {
                // Create new agent
                console.log('Creating agent with payload:', agentPayload);
                response = await agentAPI.createAgent(agentPayload);
                console.log("Agent created successfully:", response);
                toast.success(`Agent "${formData.name}" created successfully!`, {
                    description: "Your new agent is ready to use. Redirecting to agents page...",
                    duration: 5000,
                });
            }
            
            // Set success state (preserve edit mode for success display)
            setIsSuccess(true);
            setCreatedAgentId(response.data?.id || response.data?.data?.id || editingAgent?.id || null);
            
            // Reset form but don't clear edit state yet (needed for success display)
            // clearEditState(); // Moved to after navigation
            setFormData({
                name: "",
                description: "",
                voice_provider: "",
                voice_category: "",
                voice_id: "",
                model_provider: "",
                model_resource: "",
                instructions: "",
                tool_ids: []
            });
            
            // Navigate back to agents page after a short delay
            setTimeout(() => {
                try {
                    clearEditState(); // Clear edit state before navigation
                    router.push('/agents');
                } catch (navError) {
                    console.error("Navigation error:", navError);
                }
            }, 2000);
            
        } catch (error: any) {
            console.error("Error in agent operation:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response,
                stack: error.stack
            });
            
            // Extract error message from different possible sources
            let errorMessage = isEditMode ? "Failed to update agent" : "Failed to create agent";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Share functions
    const handleShare = (platform: string) => {
        if (!createdAgentId && !editingAgent?.id) {
            toast.error("No agent available to share");
            return;
        }

        const agentId = createdAgentId || editingAgent?.id;
        const shareUrl = `${window.location.origin}/share/${agentId}`;
        const shareText = `Try out ${formData.name || editingAgent?.name} - an AI voice agent: ${formData.description || editingAgent?.description}`;

        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);
        
        let shareLink = "";
        
        switch (platform) {
            case "link":
                // Copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    toast.success("Link copied to clipboard!");
                }).catch(() => {
                    // Fallback for browsers that don't support clipboard API
                    const textArea = document.createElement("textarea");
                    textArea.value = shareUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    toast.success("Link copied to clipboard!");
                });
                return;
            case "whatsapp":
                shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case "email":
                shareLink = `mailto:?subject=Check out this AI agent: ${formData.name || editingAgent?.name}&body=${encodedText}%0A%0A${encodedUrl}`;
                break;
            case "facebook":
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case "twitter":
                shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case "instagram":
                // Instagram doesn't support direct sharing, so copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    toast.success("Link copied to clipboard! You can paste it in your Instagram story or post.");
                }).catch(() => {
                    const textArea = document.createElement("textarea");
                    textArea.value = shareUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    toast.success("Link copied to clipboard! You can paste it in your Instagram story or post.");
                });
                return;
            default:
                return;
        }
        
        if (shareLink) {
            window.open(shareLink, "_blank", "width=600,height=400");
        }
    };

    return (
        <Layout title="Create Assistant">
            <div className="flex items-start max-lg:block">
                {/* Sidebar Menu */}
                <div className="card sticky top-22 shrink-0 w-120 max-3xl:w-100 max-2xl:w-74 max-lg:hidden p-6">
                    <Search
                        className="mb-3"
                        value=""
                        onChange={(e) => {}}
                        placeholder="Search sections"
                        isGray
                    />
                    <div className="flex flex-col gap-1">
                        {navigation.map((item, index) => (
                            <Link
                                className="group relative flex items-center h-18 px-3 cursor-pointer"
                                activeClass="[&_.box-hover]:!visible [&_.box-hover]:!opacity-100"
                                key={index}
                                to={item.to}
                                smooth={true}
                                duration={500}
                                isDynamic={true}
                                spy={true}
                                offset={-5.5}
                                onSetActive={(to) => {
                                    try {
                                        // Only handle if component is still mounted and scroll spy is enabled
                                        if (isMountedRef.current && scrollSpyEnabledRef.current) {
                                            console.log('Active section:', to);
                                        }
                                    } catch (error) {
                                        console.warn('Scroll spy active callback error:', error);
                                    }
                                }}
                                onSetInactive={(to) => {
                                    try {
                                        // Only handle if component is still mounted and scroll spy is enabled
                                        if (isMountedRef.current && scrollSpyEnabledRef.current) {
                                            console.log('Inactive section:', to);
                                        }
                                    } catch (error) {
                                        console.warn('Scroll spy inactive callback error:', error);
                                    }
                                }}
                            >
                                <div className="box-hover"></div>
                                <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                                    <Icon
                                        className="fill-t-secondary"
                                        name={item.icon}
                                    />
                                </div>
                                <div className="relative z-2 w-[calc(100%-2.75rem)] pl-4">
                                    <div className="text-button">{item.title}</div>
                                    <div className="mt-1 truncate text-caption text-t-secondary">
                                        {item.description}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-3 w-[calc(100%-30rem)] pl-3 max-3xl:w-[calc(100%-25rem)] max-2xl:w-[calc(100%-18.5rem)] max-lg:w-full max-lg:pl-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-h6 font-bold">
                            {isEditMode ? `Edit Agent: ${editingAgent?.name || 'Unknown'}` : 'Create New Agent'}
                        </h1>
                        {isEditMode && editingAgent && (
                        <Button 
                                onClick={() => setIsCallPanelOpen(true)}
                                isStroke
                            className="flex items-center gap-2"
                        >
                                <Icon name="play" className="w-4 h-4" />
                                Test Agent
                        </Button>
                        )}
                    </div>

                    {/* Success Banner */}
                    {isSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Icon name="check-circle" className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="font-medium text-green-800">
                                        {isEditMode ? 'Agent Updated Successfully!' : 'Agent Created Successfully!'}
                                    </p>
                                    <p className="text-sm text-green-600">
                                        {isEditMode 
                                            ? 'Your agent has been updated and is ready to use.' 
                                            : `Agent ID: ${createdAgentId || 'N/A'}. Your new agent is ready to use. Redirecting to agents page...`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Agent Type Selection */}
                    <ElementWithOffset name="agent-type">
                        <Card title="Agent Type" className="p-6">
                            {!selectedAgentType ? (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-center">Choose Agent Type</h3>
                                        <p className="text-t-secondary text-center">Select the type of agent you want to create</p>
                                        {isEditMode && (
                                            <p className="text-xs text-t-secondary text-center mt-1">
                                                Agent type cannot be changed in edit mode
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div 
                                            className={`cursor-pointer transition-all hover:shadow-md border-2 rounded-3xl p-6 text-center hover:border-primary-01/50 ${
                                                isEditMode ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            onClick={() => !isEditMode && setSelectedAgentType('SPEECH')}
                                        >
                                            <Icon name="microphone" className="w-12 h-12 mx-auto mb-4 text-primary-01" />
                                            <h4 className="font-semibold text-lg mb-2">Speech to Speech</h4>
                                            <p className="text-t-secondary text-sm">
                                                Full voice conversation with AI. User speaks, AI responds with voice.
                                            </p>
                                        </div>
                                        
                                        <div 
                                            className={`cursor-pointer transition-all hover:shadow-md border-2 rounded-3xl p-6 text-center hover:border-primary-01/50 ${
                                                isEditMode ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            onClick={() => !isEditMode && setSelectedAgentType('TEXT')}
                                        >
                                            <Icon name="chat" className="w-12 h-12 mx-auto mb-4 text-primary-01" />
                                            <h4 className="font-semibold text-lg mb-2">Text to Speech</h4>
                                            <p className="text-t-secondary text-sm">
                                                Text input, AI responds with voice. Perfect for chatbots with voice output.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-primary-01/5 border border-primary-01/20 rounded-3xl">
                                    <div className="flex items-center gap-3">
                                        {selectedAgentType === 'SPEECH' ? (
                                            <Icon name="microphone" className="w-6 h-6 text-primary-01" />
                                        ) : (
                                            <Icon name="chat" className="w-6 h-6 text-primary-01" />
                                        )}
                                        <div>
                                            <span className="font-semibold text-primary-01">
                                                {selectedAgentType === 'SPEECH' ? 'Speech to Speech' : 'Text to Speech'} Agent
                                            </span>
                                            <p className="text-xs text-t-secondary">
                                                {selectedAgentType === 'SPEECH' 
                                                    ? 'Full voice conversation with AI' 
                                                    : 'Text input, AI responds with voice'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    {!isEditMode && (
                                        <Button 
                                            type="button" 
                                            isStroke 
                                            onClick={() => setSelectedAgentType(null)}
                                            className="h-8 px-3 text-sm"
                                        >
                                            Change Type
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Card>
                    </ElementWithOffset>

                    {/* Performance Metrics */}
                    <ElementWithOffset name="performance">
                        <Card title="Performance Metrics" className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-4">
                                            <div className="text-sm text-t-secondary">Cost: -0.09 / min (est.)</div>
                                            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="text-sm text-t-secondary">Latency: -0.09 / min (est.)</div>
                                            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    className="ml-4"
                                    onClick={() => setIsCallPanelOpen(true)}
                                >
                                    <Icon name="play" className="w-4 h-4 mr-2" />
                                    Test Assistant
                                </Button>
                            </div>
                        </Card>
                    </ElementWithOffset>

                    {/* Model Configuration */}
                    <ElementWithOffset name="model">
                        <Card title="Voice & Model Configuration" className="p-6">
                            {selectedAgentType ? (
                                <div className="space-y-6">
                                    {/* Voice Provider Selection */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">TTS Provider</label>
                                    <Select
                                            value={(() => {
                                                const providerOptions = [
                                                    { id: 1, name: "voicecake" },
                                                    { id: 2, name: "cartesia" },
                                                    { id: 3, name: "elevenlabs" },
                                                    { id: 4, name: "openai" }
                                                ];
                                                return providerOptions.find(option => option.name === formData.voice_provider) || null;
                                            })()}
                                            onChange={(value) => {
                                                setFormData(prev => ({ 
                                                    ...prev, 
                                                    voice_provider: value.name,
                                                    voice_category: "", // Reset voice_category when provider changes
                                                    voice_id: "" // Reset voice_id when provider changes
                                                }));
                                            }}
                                        options={[
                                                { id: 1, name: "voicecake" },
                                                { id: 2, name: "cartesia" },
                                                { id: 3, name: "elevenlabs" },
                                                { id: 4, name: "openai" }
                                            ]}
                                            placeholder="Select a TTS provider"
                                        />
                                    </div>

                                    {/* Voice Selection */}
                                    {formData.voice_provider && (
                                        <div className="space-y-4">
                                            {/* Voice Category Selection */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Voice Category</label>
                                                <Select
                                                    value={(() => {
                                                        const categories = getCategoriesByProvider(formData.voice_provider);
                                                        const selectedCategory = categories.find(cat => cat === formData.voice_category);
                                                        return selectedCategory ? { id: categories.indexOf(selectedCategory) + 1, name: selectedCategory } : null;
                                                    })()}
                                                    onChange={(value) => {
                                                        setFormData(prev => ({ 
                                                            ...prev, 
                                                            voice_category: value.name,
                                                            voice_id: "" // Reset voice when category changes
                                                        }));
                                                    }}
                                                    options={getCategoriesByProvider(formData.voice_provider).map((category, index) => ({
                                                        id: index + 1,
                                                        name: category
                                                    }))}
                                                    placeholder="Select voice category"
                                                />
                                            </div>

                                            {/* Voice Selection based on Category */}
                                            {formData.voice_category && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Voice</label>
                                    <Select
                                                        value={(() => {
                                                            const voicesInCategory = getVoicesByProvider(formData.voice_provider)
                                                                .filter(voice => voice.category === formData.voice_category);
                                                            const selectedVoice = voicesInCategory.find(voice => voice.id === formData.voice_id);
                                                            return selectedVoice ? { id: voicesInCategory.indexOf(selectedVoice) + 1, name: selectedVoice.name } : null;
                                                        })()}
                                                        onChange={(value) => {
                                                            const voicesInCategory = getVoicesByProvider(formData.voice_provider)
                                                                .filter(voice => voice.category === formData.voice_category);
                                                            const selectedVoice = voicesInCategory[value.id - 1];
                                                            setFormData(prev => ({ 
                                                                ...prev, 
                                                                voice_id: selectedVoice.id 
                                                            }));
                                                        }}
                                                        options={getVoicesByProvider(formData.voice_provider)
                                                            .filter(voice => voice.category === formData.voice_category)
                                                            .map((voice, index) => ({
                                                                id: index + 1,
                                                                name: voice.name
                                                            }))}
                                                        placeholder="Select a voice"
                                    />
                                </div>
                                            )}

                                            {/* Voice Info Display */}
                                            {formData.voice_id && (
                                                <div className="text-xs text-t-secondary bg-b-surface2 p-2 rounded-lg">
                                                    <div className="font-medium">Selected Voice: {(() => {
                                                        const voicesInCategory = getVoicesByProvider(formData.voice_provider)
                                                            .filter(voice => voice.category === formData.voice_category);
                                                        const selectedVoice = voicesInCategory.find(voice => voice.id === formData.voice_id);
                                                        return selectedVoice?.name || formData.voice_id;
                                                    })()}</div>
                                                    <div className="text-xs opacity-75">
                                                        {(() => {
                                                            const voicesInCategory = getVoicesByProvider(formData.voice_provider)
                                                                .filter(voice => voice.category === formData.voice_category);
                                                            const selectedVoice = voicesInCategory.find(voice => voice.id === formData.voice_id);
                                                            return selectedVoice?.description || "No description available";
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* AI Model - Only for Speech-To-Speech */}
                                    {selectedAgentType === 'SPEECH' && (
                                <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">AI Model Provider</label>
                                    <Select
                                                    value={(() => {
                                                        const providerOptions = [
                                                            { id: 1, name: "VOICECAKE" },
                                                            { id: 2, name: "OPEN_AI" },
                                                            { id: 3, name: "ANTHROPIC" },
                                                            { id: 4, name: "GOOGLE" },
                                                            { id: 5, name: "GROQ" },
                                                            { id: 6, name: "SAMBANOVA" },
                                                            { id: 7, name: "CEREBRAS" },
                                                            { id: 8, name: "AMAZON_BEDROCK" },
                                                            { id: 9, name: "FIREWORKS" }
                                                        ];
                                                        return providerOptions.find(option => option.name === formData.model_provider) || null;
                                                    })()}
                                                    onChange={(value) => {
                                                        setFormData(prev => ({ 
                                                            ...prev, 
                                                            model_provider: value.name,
                                                            model_resource: "" // Reset model when provider changes
                                                        }));
                                                    }}
                                        options={[
                                                        { id: 1, name: "VOICECAKE" },
                                                        { id: 2, name: "OPEN_AI" },
                                                        { id: 3, name: "ANTHROPIC" },
                                                        { id: 4, name: "GOOGLE" },
                                                        { id: 5, name: "GROQ" },
                                                        { id: 6, name: "SAMBANOVA" },
                                                        { id: 7, name: "CEREBRAS" },
                                                        { id: 8, name: "AMAZON_BEDROCK" },
                                                        { id: 9, name: "FIREWORKS" }
                                                    ]}
                                                    placeholder="Select AI Model Provider"
                                                />
                                            </div>

                                            {/* Model Selection based on Provider */}
                                            {formData.model_provider && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Model</label>
                                    <Select
                                                        value={(() => {
                                                            const modelsForProvider = modelOptions.filter(model => model.provider === formData.model_provider);
                                                            const selectedModel = modelsForProvider.find(model => model.simpleName === formData.model_resource);
                                                            return selectedModel ? { id: modelsForProvider.indexOf(selectedModel) + 1, name: selectedModel.simpleName } : null;
                                                        })()}
                                                        onChange={(value) => {
                                                            setFormData(prev => ({ 
                                                                ...prev, 
                                                                model_resource: value.name 
                                                            }));
                                                        }}
                                                        options={(() => {
                                                            const modelsForProvider = modelOptions.filter(model => model.provider === formData.model_provider);
                                                            return modelsForProvider.map((model, index) => ({
                                                                id: index + 1,
                                                                name: model.simpleName
                                                            }));
                                                        })()}
                                                        placeholder="Select a model"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-t-secondary">
                                    Please select an agent type first to configure voice and model settings.
                            </div>
                            )}
                        </Card>
                    </ElementWithOffset>

                    {/* Details */}
                    <ElementWithOffset name="details">
                        <Card title="Assistant Details" className="p-6">
                            {selectedAgentType ? (
                                <div className="space-y-4">
                                    <Field
                                        label="Agent Name"
                                        placeholder="e.g., Customer Support AI"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                    
                                    <Field
                                        label="Description"
                                        placeholder="Describe what this agent does and how it helps users..."
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        textarea
                                        classInput="h-24"
                                        maxLength={1500}
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-t-secondary">
                                            {formData.description.length}/1,500 characters
                                        </span>
                                        {formData.description.length > 1400 && (
                                            <span className="text-xs text-orange-500">
                                                {1500 - formData.description.length} characters remaining
                                            </span>
                                        )}
                                    </div>

                                    {/* Legacy fields for existing design compatibility */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field
                                        label="Language"
                                        placeholder="English"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    />
                                    <Field
                                        label="Turn Taking"
                                        placeholder="auto"
                                        value={turnTaking}
                                        onChange={(e) => setTurnTaking(e.target.value)}
                                    />
                                </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-t-secondary">
                                    Please select an agent type first to configure details.
                            </div>
                            )}
                        </Card>
                    </ElementWithOffset>

                    {/* System Prompt */}
                    <ElementWithOffset name="system-prompt">
                        <Card title="Instructions" className="p-6">
                            {selectedAgentType ? (
                                <div className="space-y-4">
                                <Field
                                        label={
                                            selectedAgentType === 'SPEECH' ? 'Custom Instructions' : 'Agent Instructions'
                                        }
                                        placeholder={
                                            selectedAgentType === 'SPEECH' 
                                                ? `You are a helpful AI assistant. Provide detailed instructions for how you should behave, respond, and interact with users.

Examples:
• Your personality and communication style
• Specific topics you're knowledgeable about
• How to handle different types of questions
• Any specific behaviors or responses to avoid
• Context about your role or purpose

Be as detailed as possible to ensure consistent and helpful responses.`
                                                : `Provide detailed instructions for how the agent should respond to text inputs.

Examples:
• Response style and tone
• Specific topics or domains of expertise
• How to handle different types of requests
• Any limitations or guidelines
• Context about the agent's purpose

Be specific to ensure the agent provides helpful and consistent responses.`
                                        }
                                        value={formData.instructions}
                                        onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                                    textarea
                                    classInput={isSystemPromptExpanded ? "h-72" : "h-24"}
                                        required={selectedAgentType === 'TEXT'}
                                />
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-t-secondary">
                                            💡 Tip: The more detailed your instructions, the better the agent will perform. Include personality traits, response style, and specific guidelines.
                                        </p>
                                    <Button
                                        onClick={() => setIsSystemPromptExpanded(!isSystemPromptExpanded)}
                                        className="text-sm"
                                        isStroke
                                    >
                                        <Icon 
                                            name={isSystemPromptExpanded ? "chevron-up" : "chevron-down"} 
                                            className="w-4 h-4 mr-2" 
                                        />
                                        {isSystemPromptExpanded ? "Show less" : "Show more"}
                                    </Button>
                                </div>
                            </div>
                            ) : (
                                <div className="text-center py-8 text-t-secondary">
                                    Please select an agent type first to configure instructions.
                                </div>
                            )}
                        </Card>
                    </ElementWithOffset>

                    {/* Tools Selection */}
                    <ElementWithOffset name="tools">
                        <Card title="Tools & Capabilities" className="p-6">
                            {selectedAgentType ? (
                                <div className="space-y-4">
                                    <ToolSelector
                                        value={formData.tool_ids}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, tool_ids: value }))}
                                        placeholder="Select tools for this agent..."
                                    />
                                    <p className="text-xs text-t-secondary">
                                        💡 Tip: Select tools that your agent can use to perform specific tasks. Tools will be available to the agent during conversations.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-t-secondary">
                                    Please select an agent type first to configure tools.
                                </div>
                            )}
                        </Card>
                    </ElementWithOffset>

                    {/* Training Data */}
                    <ElementWithOffset name="training-data">
                        <Card title="Training Data" className="p-6">
                            <div className="border-2 border-dashed border-s-stroke2 rounded-3xl p-6 text-center">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Button className="mb-4">
                                        Choose File
                                    </Button>
                                    <div className="text-t-secondary">
                                        {selectedFile ? selectedFile.name : "No File Chosen"}
                                    </div>
                                </label>
                            </div>
                        </Card>
                    </ElementWithOffset>

                    {/* Assignments */}
                    <ElementWithOffset name="assignments">
                        <div className="space-y-3">
                            <Card title="Assign Phone Numbers" className="p-6">
                                <div className="space-y-3">
                                    {phoneNumbers.map((number, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-b-surface2 rounded-2xl">
                                            <span className="text-t-primary">{number}</span>
                                            <Badge className="bg-primary-02/20 text-primary-02 border border-primary-02/30">
                                                Active
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Assign Automations" className="p-6">
                                <div className="space-y-3">
                                    {automations.map((automation, index) => (
                                        <div key={index} className="p-3 bg-b-surface2 rounded-2xl">
                                            <span className="text-t-primary">{automation}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </ElementWithOffset>

                    {/* Share - Only show when agent is created or editing */}
                    {(isSuccess || isEditMode) && (
                    <ElementWithOffset name="share">
                        <Card title="Share" className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {shareOptions.map((option, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => handleShare(option.icon)}
                                        className="flex flex-col items-center gap-2 p-4 h-auto"
                                        isStroke
                                    >
                                        <Icon name={option.icon} className="w-6 h-6" />
                                        <span className="text-sm">{option.name}</span>
                                    </Button>
                                ))}
                            </div>
                        </Card>
                    </ElementWithOffset>
                    )}

                    {/* Footer Buttons */}
                    <form onSubmit={handleSubmit}>
                    <div className="flex justify-end gap-3 pt-6">
                            <Button 
                                type="button" 
                                isStroke
                                onClick={() => {
                                    try {
                                        // Disable scroll spy immediately to prevent errors
                                        scrollSpyEnabledRef.current = false;
                                        isMountedRef.current = false;
                                        
                                        // Clear edit state if in edit mode
                                        if (isEditMode) {
                                            clearEditState();
                                        }
                                        
                                        // Force cleanup of scroll spy
                                        try {
                                            if (typeof window !== 'undefined' && window.scrollSpy) {
                                                window.scrollSpy.destroy();
                                            }
                                        } catch (cleanupError) {
                                            console.warn('Scroll spy cleanup error:', cleanupError);
                                        }
                                        
                                        // Immediate navigation without delay
                                        router.push('/agents');
                                    } catch (error) {
                                        console.warn('Cancel button error:', error);
                                        // Fallback: direct navigation
                                        router.push('/agents');
                                    }
                                }}
                            >
                            Cancel
                        </Button>
                            <Button 
                                type="submit"
                                disabled={isLoading || !selectedAgentType || isSuccess}
                                className="flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Icon name="loader" className="w-4 h-4 animate-spin" />
                                        {isEditMode ? 'Updating Agent...' : 'Creating Agent...'}
                                    </>
                                ) : isSuccess ? (
                                    <>
                                        <Icon name="check-circle" className="w-4 h-4 text-green-500" />
                                        {isEditMode ? 'Agent Updated!' : 'Agent Created!'}
                                    </>
                                ) : (
                                    <>
                            <Icon name="save" className="w-4 h-4" />
                                        {isEditMode ? 'Update Agent' : 'Create Agent'}
                                    </>
                                )}
                        </Button>
                    </div>
                    </form>
                </div>
            </div>

            {/* Call Transcript Panel */}
            <CallTranscriptPanel 
                isOpen={isCallPanelOpen}
                onClose={() => setIsCallPanelOpen(false)}
                agentData={isEditMode ? editingAgent : null}
            />

            {/* Create Agent Modal */}
            <CreateAgentModal
                isOpen={isCreateAgentModalOpen}
                onClose={() => setIsCreateAgentModalOpen(false)}
                onSubmit={handleCreateAgent}
            />
        </Layout>
    );
};

export default CreateAssistantPage;

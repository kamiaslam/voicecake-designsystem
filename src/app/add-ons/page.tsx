"use client";

import { useState, useEffect, useCallback } from "react";
import { Element, scroller } from "react-scroll";
import { Link } from "react-scroll";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Badge from "@/components/Badge";
import Search from "@/components/Search";
import Field from "@/components/Field";
import VoiceCloneItem from "@/components/VoiceCloneItem";
import VoiceRecorder from "@/components/VoiceRecorder";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/authContext";
import { useFinance } from "@/context/financeContext";
import { voiceCloneAPI } from "@/services/api";
import { VoiceCloneResponse, VoiceCloneCreate, VoiceCloneLanguage } from "@/types/voice";
import { toast } from "sonner";

interface WalletInfo {
  balance_cents: number;
  premium_voice_surcharge_cents: number;
  updated_at: string;
}

interface VoiceCloneEligibility {
  eligible: boolean;
  eligible_type: "free" | "paid";
}

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


export default function AddOnsPage() {
  const { token, user, isInitialized } = useAuth();
  const { getWallet, topupWallet } = useFinance();
  
  // State for voice clones
  const [voiceClones, setVoiceClones] = useState<VoiceCloneResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // State for wallet
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [eligibility, setEligibility] = useState<VoiceCloneEligibility | null>(null);
  
  // State for voice cloning form
  const [newVoiceClone, setNewVoiceClone] = useState({
    name: "",
    description: "",
    language: VoiceCloneLanguage.EN,
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  // State for wallet top-up
  const [topUpAmount, setTopUpAmount] = useState(500);
  const [isToppingUp, setIsToppingUp] = useState(false);
  
  // State for component mounting
  const [mounted, setMounted] = useState(false);

  // Navigation items following add-agent pattern
  const navigation = [
    {
      title: "Voice Cloning",
      icon: "microphone",
      description: "Create custom voice clones",
      to: "voice-cloning",
    },
    {
      title: "Premium Voices",
      icon: "volume_1",
      description: "Access premium voice options",
      to: "premium-voices",
    },
    {
      title: "Wallet",
      icon: "credit_card",
      description: "Manage your wallet balance",
      to: "wallet",
    },
  ];

  // Ensure component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch voice clones and wallet info on component mount
  useEffect(() => {
    if (mounted && isInitialized && user) {
      fetchVoiceClones();
      fetchWalletAndEligibility();
    }
  }, [mounted, isInitialized, user]);

  const fetchVoiceClones = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await voiceCloneAPI.getVoiceClones();
      setVoiceClones(response);
    } catch (error) {
      console.error('Error fetching voice clones:', error);
      toast.error("Failed to fetch voice clones. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWalletAndEligibility = useCallback(async () => {
    try {
      const walletData = await getWallet();
      setWalletInfo(walletData);
      setEligibility({
        eligible: true,
        eligible_type: walletData.balance_cents > 0 ? "paid" : "free"
      });
    } catch (error) {
      console.error('Error fetching wallet and eligibility:', error);
    }
  }, [getWallet]);

  const handleVoiceCloneCreate = useCallback(async () => {
    if (!audioFile) {
      toast.error("Please record an audio sample first");
      return;
    }

    setIsCreating(true);
    try {
      const voiceCloneData: VoiceCloneCreate = {
        name: newVoiceClone.name,
        description: newVoiceClone.description,
        language: newVoiceClone.language,
      };

      await voiceCloneAPI.createVoiceCloneWithAudio(voiceCloneData, audioFile);
      
      setNewVoiceClone({ name: "", description: "", language: VoiceCloneLanguage.EN });
      setAudioFile(null);
      toast.success("Voice clone created successfully! Training will begin shortly.");
      
      await fetchVoiceClones();
    } catch (error) {
      console.error('Error creating voice clone:', error);
      toast.error("Failed to create voice clone. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }, [audioFile, newVoiceClone, fetchVoiceClones]);

  const handleVoiceCloneDelete = useCallback(async (id: number) => {
    try {
      await voiceCloneAPI.deleteVoiceClone(id.toString());
      setVoiceClones(prev => prev.filter(vc => vc.id !== id));
      toast.success("Voice clone deleted successfully");
    } catch (error) {
      console.error('Error deleting voice clone:', error);
      toast.error("Failed to delete voice clone");
    }
  }, []);

  const handleTopUp = useCallback(async () => {
    try {
      setIsToppingUp(true);
      const updatedWallet = await topupWallet(topUpAmount);
      setWalletInfo(updatedWallet);
      toast.success(`Successfully topped up $${(topUpAmount / 100).toFixed(2)}`);
      setEligibility({
        eligible: true,
        eligible_type: "paid"
      });
    } catch (error) {
      console.error('Error topping up wallet:', error);
      toast.error("Failed to top up wallet. Please try again.");
    } finally {
      setIsToppingUp(false);
    }
  }, [topUpAmount, topupWallet]);

  const handleCreateVoiceClone = useCallback(() => {
    scroller.scrollTo('voice-cloning', {
      duration: 500,
      smooth: true,
      offset: -100,
    });
  }, []);

  const handleCancelCreate = useCallback(() => {
    setNewVoiceClone({ name: "", description: "", language: VoiceCloneLanguage.EN });
    setAudioFile(null);
  }, []);


  // Show loading state until mounted and auth is initialized
  if (!mounted || !isInitialized) {
    return (
      <Layout title="Add-ons">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader text="Loading Add-ons..." />
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state if not authenticated
  if (!token || !user) {
    return (
      <Layout title="Add-ons">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-gray-600">Please sign in to access Add-ons.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Add-ons">
      <div className="flex items-start max-lg:block">
        {/* Sidebar Navigation */}
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
            <h1 className="text-h6 font-bold">Add-ons</h1>
          </div>

          {/* Voice Cloning Section */}
          <ElementWithOffset name="voice-cloning">
            <Card title="Voice Cloning" className="p-6">
              <div className="space-y-4">
                {/* Wallet Status Notification */}
                {walletInfo && (
                  <div className="bg-gradient-to-r from-primary-01/5 to-transparent dark:from-primary-01/10 dark:to-transparent rounded-lg p-4 border border-primary-01/20">
                    {eligibility?.eligible && eligibility.eligible_type === "free" ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-02/20 to-primary-02/10 rounded-xl flex items-center justify-center">
                            <Icon name="gift" className="w-5 h-5 text-primary-02" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-primary-02">Free Voice Clone Available!</h4>
                            <Badge className="bg-primary-02/10 text-primary-02 border-primary-02/20 text-xs px-2 py-0.5">
                              Free Tier
                            </Badge>
                          </div>
                          <p className="text-xs text-t-secondary">
                            Create your first voice clone at no cost. Perfect for getting started!
                          </p>
                        </div>
                      </div>
                    ) : eligibility?.eligible && eligibility.eligible_type === "paid" ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-02/20 to-primary-02/10 rounded-xl flex items-center justify-center">
                            <Icon name="check_circle" className="w-5 h-5 text-primary-02" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-primary-02">Ready to Create</h4>
                            <Badge className="bg-primary-02/10 text-primary-02 border-primary-02/20 text-xs px-2 py-0.5">
                              Paid Account
                            </Badge>
                          </div>
                          <p className="text-xs text-t-secondary">
                            Voice clones start from $0.25. Current balance: <span className="font-semibold text-t-primary">${(walletInfo.balance_cents / 100).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-05/20 to-primary-05/10 rounded-xl flex items-center justify-center">
                            <Icon name="help" className="w-5 h-5 text-primary-05" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-primary-05">Top Up Required</h4>
                            <Badge className="bg-primary-05/10 text-primary-05 border-primary-05/20 text-xs px-2 py-0.5">
                              Low Balance
                            </Badge>
                          </div>
                          <p className="text-xs text-t-secondary">
                            Add funds to start creating voice clones. Starting from $0.25. Current: <span className="font-semibold text-t-primary">${(walletInfo.balance_cents / 100).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-t-primary">Create Voice Clone</h3>
                    <p className="text-t-secondary">Record your voice to create a custom voice clone</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Field
                    label="Voice Clone Name"
                    placeholder="e.g., Professional Voice Enhancer"
                    value={newVoiceClone.name}
                    onChange={(e) => setNewVoiceClone((prev: any) => ({ ...prev, name: e.target.value }))}
                  />

                  <Field
                    label="Description (Optional)"
                    placeholder="Describe your voice clone..."
                    value={newVoiceClone.description}
                    onChange={(e) => setNewVoiceClone((prev: any) => ({ ...prev, description: e.target.value }))}
                    textarea
                    classInput="h-24"
                  />

                  <div>
                    <label className="block text-sm font-medium text-t-primary mb-2">Language</label>
                    <select
                      className="w-full p-3 border border-s-stroke2 rounded-lg bg-b-surface1 text-t-primary focus:outline-none focus:ring-2 focus:ring-primary-01 dark:bg-b-surface2 dark:border-s-stroke1 dark:text-t-primary"
                      value={newVoiceClone.language}
                      onChange={(e) => setNewVoiceClone((prev: any) => ({ ...prev, language: e.target.value as VoiceCloneLanguage }))}
                    >
                      <option value={VoiceCloneLanguage.EN}>English</option>
                      <option value={VoiceCloneLanguage.FR}>French</option>
                      <option value={VoiceCloneLanguage.DE}>German</option>
                      <option value={VoiceCloneLanguage.ES}>Spanish</option>
                      <option value={VoiceCloneLanguage.PT}>Portuguese</option>
                      <option value={VoiceCloneLanguage.ZH}>Chinese</option>
                      <option value={VoiceCloneLanguage.JA}>Japanese</option>
                      <option value={VoiceCloneLanguage.HI}>Hindi</option>
                      <option value={VoiceCloneLanguage.IT}>Italian</option>
                      <option value={VoiceCloneLanguage.KO}>Korean</option>
                      <option value={VoiceCloneLanguage.NL}>Dutch</option>
                      <option value={VoiceCloneLanguage.PL}>Polish</option>
                      <option value={VoiceCloneLanguage.RU}>Russian</option>
                      <option value={VoiceCloneLanguage.SV}>Swedish</option>
                      <option value={VoiceCloneLanguage.TR}>Turkish</option>
                    </select>
                  </div>

                  <VoiceRecorder
                    onRecordingComplete={(audioBlob) => {
                      const file = new File([audioBlob], "voice-sample.webm", { type: "audio/webm" });
                      setAudioFile(file);
                    }}
                    onError={(error) => {
                      toast.error(error);
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={handleVoiceCloneCreate}
                    disabled={isCreating || !audioFile || !newVoiceClone.name}
                  >
                    {isCreating ? "Creating..." : "Create Voice Clone"}
                  </Button>
                  <Button
                    isGray
                    onClick={handleCancelCreate}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </ElementWithOffset>

          {/* Existing Voice Clones */}
          <ElementWithOffset name="existing-clones">
            <Card title="Your Voice Clones" className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader text="Loading your voice clones..." />
                </div>
              ) : voiceClones.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="microphone" className="w-16 h-16 text-t-tertiary mx-auto mb-4" />
                  <h3 className="text-lg text-t-secondary mb-2">No voice clones found</h3>
                  <p className="text-t-tertiary mb-4">Create your first voice clone to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {voiceClones.map((voiceClone) => (
                    <VoiceCloneItem
                      key={voiceClone.id}
                      voice={voiceClone}
                      index={voiceClone.id}
                      onDelete={handleVoiceCloneDelete}
                      onUpdate={fetchVoiceClones}
                    />
                  ))}
                </div>
              )}
            </Card>
          </ElementWithOffset>

          {/* Premium Voices Section */}
          <ElementWithOffset name="premium-voices">
            <Card title="Premium Voices" className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-t-primary">Premium Voice Options</h3>
                  <p className="text-t-secondary">Access high-quality premium voices for your AI agents</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border border-s-stroke2 dark:border-s-stroke1">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-01/20 to-primary-01/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon name="volume_1" className="w-6 h-6 text-primary-01" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-t-primary">ElevenLabs Premium</h4>
                            <p className="text-sm text-t-secondary">High-quality neural voices</p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-primary-02/20 to-primary-02/10 text-primary-02 border-primary-02/30 px-2 py-1">
                          Premium
                        </Badge>
                      </div>
                      <p className="text-sm text-t-secondary mb-4 leading-relaxed">
                        Access to ElevenLabs' premium voice library with natural-sounding voices and advanced emotion control.
                      </p>
                      <Button className="w-full group-hover:bg-primary-01/90 transition-colors duration-300" isGray>
                        Coming Soon
                      </Button>
                    </div>
                  </Card>

                  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border border-s-stroke2 dark:border-s-stroke1">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-01/20 to-primary-01/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon name="robot" className="w-6 h-6 text-primary-01" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-t-primary">OpenAI TTS</h4>
                            <p className="text-sm text-t-secondary">Advanced text-to-speech</p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-primary-02/20 to-primary-02/10 text-primary-02 border-primary-02/30 px-2 py-1">
                          Premium
                        </Badge>
                      </div>
                      <p className="text-sm text-t-secondary mb-4 leading-relaxed">
                        OpenAI's latest text-to-speech models with multiple voice options and superior quality.
                      </p>
                      <Button className="w-full group-hover:bg-primary-01/90 transition-colors duration-300" isGray>
                        Coming Soon
                      </Button>
                    </div>
                  </Card>

                  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border border-s-stroke2 dark:border-s-stroke1">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-01/20 to-primary-01/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon name="microphone" className="w-6 h-6 text-primary-01" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-t-primary">VoiceCake Premium</h4>
                            <p className="text-sm text-t-secondary">Custom voice training</p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-primary-02/20 to-primary-02/10 text-primary-02 border-primary-02/30 px-2 py-1">
                          Premium
                        </Badge>
                      </div>
                      <p className="text-sm text-t-secondary mb-4 leading-relaxed">
                        Advanced voice cloning and training capabilities with professional-grade results.
                      </p>
                      <Button className="w-full group-hover:bg-primary-01/90 transition-colors duration-300" isGray>
                        Coming Soon
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </ElementWithOffset>

          {/* Wallet Section */}
          <ElementWithOffset name="wallet">
            <Card title="Wallet Management" className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-t-primary">Manage Your Wallet</h3>
                  <p className="text-t-secondary">Top up funds and manage your balance</p>
                </div>

                {walletInfo && (
                  <Card className="bg-gradient-to-br from-primary-01/10 to-primary-01/5 border border-primary-01/20 dark:from-primary-01/20 dark:to-primary-01/10">
                    <div className="p-6 text-center">
                      <div className="text-5xl font-bold text-primary-01 mb-3 bg-gradient-to-r from-primary-01 to-primary-02 bg-clip-text text-transparent">
                        ${(walletInfo.balance_cents / 100).toFixed(2)}
                      </div>
                      <p className="text-t-secondary font-medium">Current Balance</p>
                    </div>
                  </Card>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-t-primary mb-3">Top Up Amount</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[500, 1000, 2500, 5000, 10000, 25000].map((amount) => (
                        <Button
                          key={amount}
                          className={`${
                            topUpAmount === amount 
                              ? "bg-primary-01 text-t-light" 
                              : "bg-b-surface1 text-t-secondary"
                          }`}
                          onClick={() => setTopUpAmount(amount)}
                        >
                          ${(amount / 100).toFixed(0)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {walletInfo && (
                    <Card className="bg-b-surface1 dark:bg-b-surface2 border border-s-stroke2 dark:border-s-stroke1">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-t-secondary">Current Balance:</span>
                          <span className="text-xl font-bold text-t-primary">
                            ${(walletInfo.balance_cents / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-t-secondary">After Top Up:</span>
                          <span className="text-xl font-bold text-primary-02">
                            ${((walletInfo.balance_cents + topUpAmount) / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={handleTopUp}
                  disabled={isToppingUp}
                >
                  {isToppingUp ? "Processing..." : `Top Up $${(topUpAmount / 100).toFixed(2)}`}
                </Button>
              </div>
            </Card>
          </ElementWithOffset>
        </div>
      </div>
    </Layout>
  );
}
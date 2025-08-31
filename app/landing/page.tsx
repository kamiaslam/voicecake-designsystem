"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/Image";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Badge from "@/components/Badge";
import Field from "@/components/Field";
import Logo from "@/components/Logo";
import ThemeButton from "@/components/ThemeButton";

const LandingPage = () => {
    const [email, setEmail] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const whyVoicecakeFeatures = [
        {
            title: "Outcome first",
            description: "Teams report dramatic lifts in satisfaction, often 10x, with some feedback showing 10 to 100x, and clear gains in conversion and revenue"
        },
        {
            title: "All in one suite",
            description: "Create the agent, design the logic and publish, without leaving the platform or hiring a developer"
        },
        {
            title: "International by design",
            description: "English, Arabic and other major languages for web and telephony, with GCC dialect coverage where you need it"
        },
        {
            title: "Fast to live",
            description: "No development knowledge needed, you can be up and running in minutes"
        },
        {
            title: "Transparent pricing",
            description: "No hidden charges, our natural voice collection is included, what you see is what you pay"
        },
        {
            title: "Trusted already",
            description: "Hundreds of customers across global markets, including leaders in the GCC"
        }
    ];

    const agentSuite = [
        {
            name: "Conversa",
            subtitle: "precision scripted voice and rich chat",
            description: "Perfect for announcements, proactive outreach and guided flows. Conversa gives you crystal clear, on brand delivery, hands off to your team when needed, and stays compliant by design."
        },
        {
            name: "Empth",
            subtitle: "real time conversational intelligence",
            description: "Built for open ended conversations in voice and chat. Empth understands intent, keeps context, negotiates next steps and resolves, on your site or your phone lines."
        },
        {
            name: "Sahla",
            subtitle: "native Arabic for the GCC and beyond",
            description: "Our premier Arabic agent for business. Sahla speaks major GCC dialects naturally, plus English, respects local etiquette, and is aligned with GCC laws and regulations. Ideal for banking, public sector, healthcare, hospitality and retail across KSA, UAE, Qatar, Kuwait, Bahrain and Oman."
        }
    ];

    const howItWorks = [
        {
            step: "1",
            title: "Create your agent",
            description: "Pick Conversa, Empth or Sahla, choose a voice and tone, add knowledge and guardrails, preview immediately"
        },
        {
            step: "2",
            title: "Connect channels",
            description: "Point phone numbers to your agent, drop the voice and chat widget on your website, switch on WhatsApp, SMS and email"
        },
        {
            step: "3",
            title: "Automate the journey",
            description: "Use Sim AI to qualify, book, verify, update your CRM and escalate to your team with full transcripts and context"
        },
        {
            step: "4",
            title: "Measure and improve",
            description: "Track containment, resolution, conversion, cost and satisfaction signals, then iterate with safe to test variants"
        }
    ];

    const useCases = [
        {
            title: "Customer support",
            description: "24/7 answers, proactive updates, smooth escalation, lower costs"
        },
        {
            title: "Sales and growth",
            description: "Lead capture, qualification, instant callbacks and scheduling, faster response, higher conversion"
        },
        {
            title: "E-commerce and retail",
            description: "Order status, returns, back in stock alerts, personalised recommendations"
        },
        {
            title: "Financial services",
            description: "KYC checks, appointment booking, card issues, balance or application status with secure handoff"
        },
        {
            title: "Healthcare",
            description: "Intake, triage, appointment scheduling, reminders and lab result follow ups"
        },
        {
            title: "Hospitality and travel",
            description: "Reservations, itinerary changes, real time service requests, concierge"
        },
        {
            title: "Public sector and utilities",
            description: "Service information, bill queries, outage updates, multilingual access"
        },
        {
            title: "Logistics",
            description: "Delivery scheduling, proof of delivery capture, exception handling"
        },
        {
            title: "Education",
            description: "Admissions Q&A, course info, exam schedules and student support"
        },
        {
            title: "B2B SaaS",
            description: "Product support, onboarding, renewals and expansion motions"
        }
    ];

    const comparisonData = [
        {
            platform: "Voicecake.io",
            phoneVoice: "✓",
            webChat: "✓",
            visualAutomation: "✓",
            gptAssisted: "✓",
            arabicGcc: "✓",
            voiceLibrary: "✓",
            approach: "All-in-one platform"
        },
        {
            platform: "Bland.ai",
            phoneVoice: "✓",
            webChat: "Partial",
            visualAutomation: "✗",
            gptAssisted: "Partial",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Phone calls only"
        },
        {
            platform: "Vapi",
            phoneVoice: "✓",
            webChat: "✗",
            visualAutomation: "✗",
            gptAssisted: "✗",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Developer API"
        },
        {
            platform: "Retell AI",
            phoneVoice: "✓",
            webChat: "✓",
            visualAutomation: "✗",
            gptAssisted: "Partial",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Basic voice & chat"
        },
        {
            platform: "ElevenLabs",
            phoneVoice: "Partial",
            webChat: "Partial",
            visualAutomation: "✗",
            gptAssisted: "Partial",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Voice generation"
        },
        {
            platform: "n8n",
            phoneVoice: "✗",
            webChat: "✗",
            visualAutomation: "✓",
            gptAssisted: "✓",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Automation only"
        },
        {
            platform: "Make.com",
            phoneVoice: "✗",
            webChat: "✗",
            visualAutomation: "✓",
            gptAssisted: "✓",
            arabicGcc: "✗",
            voiceLibrary: "✗",
            approach: "Automation only"
        }
    ];

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: "Do we need engineers to deploy?",
            answer: "No. Most teams go live in minutes. Connect your numbers, paste the site widget, pick a voice and publish. Our team helps you fine tune flows without code."
        },
        {
            question: "How do Conversa, Empth and Sahla differ?",
            answer: "Use Conversa for precise scripted voice or rich chat, Empth for real time, open ended conversations that resolve, Sahla when you need native Arabic across GCC dialects with effortless switching to English."
        },
        {
            question: "Will this work with our current stack?",
            answer: "Yes. Voicecake integrates with CRM, email, WhatsApp and SMS, and supports secure webhooks and APIs for custom systems."
        },
        {
            question: "How do your voices compare?",
            answer: "We offer ultra realistic voices that are prompt controlled for tone and personality. Our natural voice collection is included in platform pricing. Some vendors use credit tiers or charge extra for advanced voices or LLM pass through. With us there are no hidden add ons."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Logo className="w-auto h-8 sm:h-12" />
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/products" className="text-t-primary hover:text-t-secondary transition-colors">
                                Product
                            </Link>
                            <Link href="/customers" className="text-t-primary hover:text-t-secondary transition-colors">
                                Solutions
                            </Link>
                            <Link href="/billing" className="text-t-primary hover:text-t-secondary transition-colors">
                                Pricing
                            </Link>
                            <Link href="/support" className="text-t-primary hover:text-t-secondary transition-colors">
                                Resources
                            </Link>
                            <Link href="/team" className="text-t-primary hover:text-t-secondary transition-colors">
                                Company
                            </Link>
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/login" className="text-t-primary hover:text-t-secondary transition-colors">
                                Sign in
                            </Link>
                            <Button>
                                Book a demo
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Icon name={mobileMenuOpen ? "close" : "menu"} className="w-6 h-6 fill-t-primary" />
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
                            <nav className="flex flex-col space-y-4 mt-4">
                                <Link 
                                    href="/products" 
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Product
                                </Link>
                                <Link 
                                    href="/customers" 
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Solutions
                                </Link>
                                <Link 
                                    href="/billing" 
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Pricing
                                </Link>
                                <Link 
                                    href="/support" 
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Resources
                                </Link>
                                <Link 
                                    href="/team" 
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Company
                                </Link>
                            </nav>
                            <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-gray-200">
                                <Link 
                                    href="/login" 
                                    className="text-t-primary hover:text-t-secondary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign in
                                </Link>
                                <Button className="w-full">
                                    Book a demo
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

                        {/* Hero Section */}
            <section className="hero-section pt-20 md:pt-32 lg:pt-40 pb-20" style={{ backgroundColor: '#000000' }}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                        Turn every call and click into revenue, with AI voice, chat and automations in one platform
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
                        Launch human sounding voice bots and website chat that solve, sell and support, across your phone lines and your site, anywhere in the world. Go live in minutes, integrate with your stack in a few clicks, and scale globally, including native Arabic across major GCC dialects plus English. Speak to the bot on this page any time for a live demo and quick answers.
                    </p>
                    
                    {/* Animation after text */}
                    <div className="flex justify-center mb-6 md:mb-8">
                        <div style={{ height: '150px', width: '150px' }}>
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover rounded-full"
                            >
                                <source src="/images/animations/01.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 md:mb-8 px-4">
                        <Button className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 h-10 sm:h-12 md:h-14 bg-white text-gray-900 hover:bg-gray-100">
                            Get Started
                        </Button>
                        <Button className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 h-10 sm:h-12 md:h-14 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900">
                            Book a Demo
                        </Button>
                    </div>

                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-2">VoiceCake.io</p>
                    </div>
                </div>
            </section>

            {/* Why Voicecake Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-t-primary mb-4">
                            Why Voicecake.io
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {whyVoicecakeFeatures.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                                <h3 className="text-base sm:text-lg font-semibold text-t-primary mb-2 sm:mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-t-secondary leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agent Suite Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-t-primary mb-4">
                            Meet the Voicecake Agent Suite
                        </h2>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {agentSuite.map((agent, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-02 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-lg sm:text-xl">{agent.name.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl sm:text-2xl font-semibold text-t-primary mb-2">
                                            {agent.name}
                                        </h3>
                                        <p className="text-base sm:text-lg text-t-secondary mb-3 sm:mb-4 font-medium">
                                            {agent.subtitle}
                                        </p>
                                        <p className="text-xs sm:text-sm text-t-secondary leading-relaxed">
                                            {agent.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sim AI Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Integrated automations, without the third party tools
                        </h2>
                        <p className="text-lg text-t-secondary max-w-3xl mx-auto">
                            Competitive stacks often ask you to stitch voice with separate automation tools like n8n or Make, then bring in developers to glue it all together. Voicecake includes Sim AI, a fully integrated automation studio inside the platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-t-primary mb-4">
                                Design powerful flows with clicks, conditions and actions, then publish instantly
                            </h3>
                            <p className="text-sm text-t-secondary mb-4">
                                GPT connectivity inside Sim AI lets you build automations conversationally, as if you were chatting in ChatGPT, so non technical teams can ship complex logic fast
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-t-primary mb-4">
                                Connect your systems with secure webhooks and native connectors
                                </h3>
                            <p className="text-sm text-t-secondary mb-4">
                                For CRM, WhatsApp, SMS and email. Stay in one place, no context switching, no brittle glue code, no extra vendors to manage.
                            </p>
                            <p className="text-sm text-t-secondary">
                                For teams familiar with n8n or Make, Sim AI brings that visual power directly into Voicecake, so you do not need separate tools.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            How it works
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {howItWorks.map((step, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                                <div className="w-12 h-12 bg-primary-02 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold text-lg">{step.step}</span>
                                </div>
                                <h3 className="text-base font-semibold text-t-primary mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-t-secondary leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Voice Demo Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Hear the difference, test our voices
                        </h2>
                        <p className="text-lg text-t-secondary max-w-3xl mx-auto">
                            Experience ultra realistic voices that customers love. Every voice can be prompt controlled, so you set tone, pace, formality and persona in plain language. Unlike many platforms, you do not pay extra to unlock premium voices. Our natural voice collection is included, there are no surprise fees or add ons.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                            <h3 className="text-base font-semibold text-t-primary mb-3">
                                Try male and female voices across accents and languages
                            </h3>
                                </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                            <h3 className="text-base font-semibold text-t-primary mb-3">
                                Switch styles from warm concierge to efficient agent with a single prompt
                            </h3>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                            <h3 className="text-base font-semibold text-t-primary mb-3">
                                Use the same voice across phone and web for a consistent brand feel
                            </h3>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Button>
                            Try Voices
                        </Button>
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Use cases
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {useCases.map((useCase, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                                    <Image
                                        src={`/images/use-cases/${useCase.title.toLowerCase().replace(/\s+/g, '-')}.png`}
                                        width={200}
                                        height={200}
                                        alt={`${useCase.title} illustration`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to a placeholder if image doesn't exist
                                            const target = e.currentTarget as HTMLImageElement;
                                            target.style.display = 'none';
                                            const nextElement = target.nextElementSibling as HTMLElement;
                                            if (nextElement) {
                                                nextElement.style.display = 'flex';
                                            }
                                        }}
                                    />
                                    <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                                        <div className="text-center">
                                            <Icon name="settings" className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                                            <span className="text-sm text-gray-600 font-medium">{useCase.title}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-base font-semibold text-t-primary mb-3">
                                        {useCase.title}
                                </h3>
                                    <p className="text-sm text-t-secondary leading-relaxed">
                                        {useCase.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agencies Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Agencies and partners
                        </h2>
                        <p className="text-lg text-t-secondary max-w-3xl mx-auto">
                            Agencies can deliver Voicecake to their clients without juggling multiple tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base font-semibold text-t-primary mb-3">
                                Multi client delivery
                            </h3>
                            <p className="text-sm text-t-secondary">
                                Set up separate workspaces and projects per client with clean separation
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base font-semibold text-t-primary mb-3">
                                Speed to value
                            </h3>
                            <p className="text-sm text-t-secondary">
                                Launch agents and automations in days, not months
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base font-semibold text-t-primary mb-3">
                                Templates and cloning
                            </h3>
                            <p className="text-sm text-t-secondary">
                                Reuse successful flows across accounts
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base font-semibold text-t-primary mb-3">
                                Billing that suits your model
                            </h3>
                            <p className="text-sm text-t-secondary">
                                Package Voicecake into your retainers or managed services
                            </p>
                        </div>
                    </div>
                                    </div>
            </section>

            {/* Comparison Table Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Voicecake vs point solutions
                        </h2>
                        <p className="text-lg text-t-secondary max-w-3xl mx-auto">
                            See how Voicecake compares to other solutions. We provide everything you need in one platform - no more juggling multiple tools.
                        </p>
                                </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-t-primary border-b border-gray-200">Platform</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-t-primary border-b border-gray-200">Phone Voice</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-t-primary border-b border-gray-200">Web Chat</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-t-primary border-b border-gray-200">Visual Automation</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-t-primary border-b border-gray-200">GPT Assisted</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-t-primary border-b border-gray-200">Arabic GCC</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-t-primary border-b border-gray-200">Voice Library</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-t-primary border-b border-gray-200">Approach</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 text-sm font-semibold text-t-primary border-b border-gray-200">
                                                {row.platform}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-t-secondary border-b border-gray-200">
                                                {row.phoneVoice}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-t-secondary border-b border-gray-200">
                                                {row.webChat}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-t-secondary border-b border-gray-200">
                                                {row.visualAutomation}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-t-secondary border-b border-gray-200">
                                                {row.gptAssisted}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-t-secondary border-b border-gray-200">
                                                {row.arabicGcc}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-t-secondary border-b border-gray-200">
                                                {row.voiceLibrary}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-t-secondary border-b border-gray-200">
                                                {row.approach}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-lg text-t-secondary max-w-4xl mx-auto">
                            Why Voicecake is better for most teams, you get the whole stack in one place, real time voice agents for calls, a website voice and chat widget, and Sim AI automations with GPT connectivity, so non technical teams can ship end to end journeys without extra tools.
                        </p>
                    </div>
                </div>
            </section>

            {/* Integrations Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium mb-4">
                            INTEGRATIONS
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">
                            Seamless Integrations That
                        </h2>
                        <h3 className="text-4xl font-bold text-white italic mb-4">
                            Power Your AI Agent
                        </h3>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            Easily connect your AI agent to your tools. CRM integrations deliver smarter support without disrupting your workflow.
                        </p>
                    </div>

                    <div className="flex justify-center items-center">
                            <Image
                            src="/images/integration-banner.png"
                            width={800}
                            height={600}
                            alt="Voicecake Integrations Hub"
                            className="w-full max-w-4xl"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Frequently asked questions
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="text-lg font-semibold text-t-primary">
                                    {faq.question}
                                </h3>
                                    <Icon 
                                        name={openFaq === index ? "chevron-up" : "chevron-down"} 
                                        className="w-5 h-5 text-t-secondary transition-transform"
                                    />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-4">
                                        <p className="text-sm text-t-secondary leading-relaxed">
                                    {faq.answer}
                                </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-t-primary mb-4">
                        Get started
                    </h2>
                    <p className="text-lg text-t-secondary mb-8 max-w-2xl mx-auto">
                        Give your customers the conversational experience they deserve, global by design, Arabic when you need it, and measurable value from day one.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="text-lg px-8 py-4 h-14">
                            Start your free pilot with Conversa, Empth or Sahla
                        </Button>
                        <Button isStroke className="text-lg px-8 py-4 h-14">
                            Book a 20 minute walkthrough now
                    </Button>
                    </div>
                    <p className="text-sm text-t-secondary mt-4">
                        Or speak to the bot on this page for a live demo.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Newsletter */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold mb-4">Join Our Newsletter</h3>
                            <div className="flex gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-02"
                                />
                                <Button>
                                    Subscribe
                                </Button>
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</Link></li>
                                <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors text-sm">Careers</Link></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">Blog</Link></li>
                                <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm">Pricing</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <Logo className="w-auto h-12" />
                                <span className="text-gray-300 text-sm">© 2024 Voicecake. All rights reserved.</span>
                            </div>
                            <div className="flex space-x-4">
                                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">Terms of Service</Link>
                                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">FAQ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

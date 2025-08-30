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

    const heroFeatures = [
        {
            icon: "phone",
            title: "Live agents",
            description: "Instantly available on every channel"
        },
        {
            icon: "message-circle",
            title: "Proactive outreach",
            description: "Follow-ups, reminders, status updates"
        },
        {
            icon: "heart",
            title: "Personalised care",
            description: "Using your CRM and order data"
        },
        {
            icon: "book-open",
            title: "Extensive knowledge",
            description: "Safely grounded in your docs and FAQs"
        }
    ];

    const designFeatures = [
        {
            icon: "mic",
            title: "Live, natural speech",
            description: "Handles greetings, intent, and handoff to humans when needed"
        },
        {
            icon: "users",
            title: "Customer support",
            description: "Automate order tracking, returns, account lookups and appointment scheduling"
        },
        {
            icon: "database",
            title: "Data connection",
            description: "Sync knowledge base, help desk, CRM and commerce data for real-time answers"
        },
        {
            icon: "shield",
            title: "Guardrails",
            description: "Set allowed actions, tone, escalation paths and compliance rules"
        }
    ];

    const platformFeatures = [
        {
            title: "Continuous syncing for real-time insights",
            description: "No manual updates"
        },
        {
            title: "Workflows you can activate inside your systems",
            description: "Create tickets, update orders, add notes"
        },
        {
            title: "Model choice",
            description: "Compare AI models and optimise for cost, speed or accuracy"
        },
        {
            title: "Analytics and reports",
            description: "Measure containment rate, CSAT, first-response time and more"
        }
    ];

    const testimonials = [
        {
            name: "Customer",
            title: "Support Team",
            company: "Various",
            quote: "The AI phone agent handles peaks without extra headcount.",
            avatar: "/images/avatar.png"
        },
        {
            name: "Customer",
            title: "Support Team",
            company: "Various",
            quote: "It resolved repetitive questions and freed our team to focus on VIP cases.",
            avatar: "/images/avatar.png"
        },
        {
            name: "Customer",
            title: "Support Team",
            company: "Various",
            quote: "Our customer satisfaction scores increased by 40% within the first month.",
            avatar: "/images/avatar.png"
        },
        {
            name: "Customer",
            title: "Support Team",
            company: "Various",
            quote: "The AI agent handles 80% of our routine inquiries, letting us focus on complex cases.",
            avatar: "/images/avatar.png"
        },
        {
            name: "Customer",
            title: "Support Team",
            company: "Various",
            quote: "We've reduced our average response time from 4 hours to under 2 minutes.",
            avatar: "/images/avatar.png"
        },
        {
            name: "Customer",
            title: "Support Team",
            company: "Various",
            quote: "The voice quality is so natural, customers often don't realize they're talking to AI.",
            avatar: "/images/avatar.png"
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "Free",
            features: [
                "1 AI agent",
                "Basic integrations",
                "Standard responses"
            ],
            popular: false
        },
        {
            name: "Professional",
            price: "£29 per month",
            features: [
                "3 AI agents",
                "Knowledge base management",
                "Advanced analytics",
                "Priority support"
            ],
            popular: false
        },
        {
            name: "Business",
            price: "£49 per month",
            features: [
                "10 AI agents",
                "Multichannel voice and chat",
                "Workflow automation",
                "Role-based access",
                "Advanced reports"
            ],
            popular: true
        },
        {
            name: "Enterprise",
            price: "£78 per month",
            features: [
                "Unlimited agents",
                "Dedicated account manager",
                "Custom security review",
                "Enterprise SSO and SLAs"
            ],
            popular: false
        }
    ];

    const integrations = [
        { name: "Help desks", icon: "help-circle", logo: null },
        { name: "CRMs", icon: "users", logo: null },
        { name: "Ecommerce platforms", icon: "shopping-cart", logo: null },
        { name: "Telephony", icon: "phone", logo: null },
        { name: "Messaging providers", icon: "message-circle", logo: null },
        { name: "Slack", icon: "message-square", logo: "/images/logos/slack.svg" },
        { name: "Salesforce", icon: "cloud", logo: "/images/logos/salesforce.svg" },
        { name: "Zendesk", icon: "headphones", logo: "/images/logos/zendesk.svg" },
        { name: "HubSpot", icon: "target", logo: "/images/logos/hubspot.svg" },
        { name: "Intercom", icon: "message-circle", logo: "/images/logos/intercom.svg" },
        { name: "Mailchimp", icon: "mail", logo: "/images/logos/mailchimp.svg" },
        { name: "Google Analytics", icon: "bar-chart", logo: "/images/logos/google-analytics.svg" },
        { name: "Stripe", icon: "credit-card", logo: "/images/logos/stripe.svg" },
        { name: "PayPal", icon: "credit-card", logo: "/images/logos/paypal.svg" },
        { name: "WordPress", icon: "globe", logo: "/images/logos/wordpress.svg" },
        { name: "Shopify", icon: "shopping-bag", logo: "/images/logos/shopify.svg" },
        { name: "WooCommerce", icon: "shopping-bag", logo: "/images/logos/woocommerce.svg" },
        { name: "Twilio", icon: "phone", logo: "/images/logos/twilio.svg" },
        { name: "SendGrid", icon: "mail", logo: "/images/logos/sendgrid.svg" },
        { name: "Zapier", icon: "zap", logo: "/images/logos/zapier.svg" },
        { name: "Airtable", icon: "database", logo: "/images/logos/airtable.svg" },
        { name: "Notion", icon: "file-text", logo: "/images/logos/notion.svg" }
    ];

    const blogPosts = [
        {
            title: "The future of AI-powered customer support",
            date: "March 15, 2024",
            readTime: "5 min read",
            category: "Technology",
            image: "/images/blog-1.png"
        },
        {
            title: "Unlock smarter workflows, it all starts with smarter ideas",
            date: "March 10, 2024",
            readTime: "3 min read",
            category: "Productivity"
        },
        {
            title: "How Voicecake drives revenue growth from support",
            date: "March 5, 2024",
            readTime: "4 min read",
            category: "Business"
        }
    ];

    const faqs = [
        {
            question: "What channels do Voicecake agents support?",
            answer: "Voicecake supports voice calls, web chat, email and WhatsApp."
        },
        {
            question: "How does Voicecake keep answers accurate?",
            answer: "It grounds responses in your knowledge base and data sources using retrieval-augmented generation, with guardrails and human escalation."
        },
        {
            question: "What can the AI agent do in my systems?",
            answer: "It can create or update tickets, check orders, schedule callbacks and write case notes depending on your connected tools."
        },
        {
            question: "How quickly can I go live?",
            answer: "Most teams connect data, choose a voice and publish an agent in a single afternoon."
        },
        {
            question: "How is pricing structured?",
            answer: "Start free, then choose a plan based on the number of agents and features you need."
        }
    ];

    const comparisons = [
        {
            title: "Voicecake vs Zendesk bots",
            description: "Safe voice and chat across channels, deep help desk integration"
        },
        {
            title: "Voicecake vs Intercom Fin",
            description: "Phone and WhatsApp built in, flexible guardrails"
        },
        {
            title: "Voicecake vs custom GPT",
            description: "Faster time to value, hosted guardrails, ready-made workflows"
        }
    ];

    return (
        <div className="min-h-screen bg-b-surface1">
            {/* Header/Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-b-surface1/80 backdrop-blur-md border-b border-s-stroke2">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Logo className="w-12 h-12" />
                        
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

                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="text-t-primary hover:text-t-secondary transition-colors">
                                Sign in
                            </Link>
                            <Button>
                                Book a demo
                            </Button>
                            <ThemeButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-40 md:pt-48 pb-20 bg-gradient-to-b from-b-surface1 to-b-surface2">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-t-primary mb-6 leading-tight">
                        Everything you need to power AI support agents
                    </h1>
                    <p className="text-lg md:text-xl text-t-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
                        Voicecake helps you launch reliable AI agents for phone, chat, email and WhatsApp. 
                        Train on your knowledge base, connect your tools, set guardrails, then go live. 
                        Customers get instant answers, your team gets fewer repetitive tickets, and you get 24/7 coverage.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Button className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-12 md:h-14">
                            Get Started
                        </Button>
                        <Button isStroke className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-12 md:h-14">
                            Book a Demo
                        </Button>
                    </div>

                    <div className="text-center mb-16">
                        <p className="text-sm md:text-base text-t-secondary mb-2">No credit card required on the free plan.</p>
                        <p className="text-sm md:text-base font-semibold text-t-primary">24/7 coverage, Human-safe handoff, Works with your tools, GDPR-ready.</p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {heroFeatures.map((feature, index) => (
                            <div key={index} className="card p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-01 to-primary-02 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Icon name={feature.icon} className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-t-primary mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-t-secondary">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Design Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Design the ultimate AI agent for customer support
                        </h2>
                        <p className="text-xl text-t-secondary max-w-2xl mx-auto">
                            Create intelligent voice agents that understand context, follow your policies, and deliver on-brand conversations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {designFeatures.map((feature, index) => (
                            <div key={index} className="card p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6A55] to-[#FF8A75] rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Icon name={feature.icon} className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-t-primary mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-t-secondary">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button isStroke>
                            See it in action
                        </Button>
                    </div>
                </div>
            </section>

            {/* Platform Section */}
            <section className="py-20 bg-b-surface2">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Your all-in-one platform for conversational AI
                        </h2>
                        <p className="text-xl text-t-secondary max-w-2xl mx-auto">
                            Everything you need to build, deploy and improve AI agents in one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {platformFeatures.map((feature, index) => (
                            <div key={index} className="card p-8">
                                <h3 className="text-xl font-semibold text-t-primary mb-4">
                                    {feature.title}
                                </h3>
                                <div className="h-48 bg-gradient-to-br from-b-surface1 to-b-surface2 rounded-2xl mb-4 flex items-center justify-center">
                                    <Icon name="monitor" className="w-12 h-12 text-t-secondary" />
                                </div>
                                <p className="text-t-secondary">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button isStroke>
                            Explore the platform
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Make workdays smoother with Voicecake AI
                        </h2>
                        <p className="text-xl text-t-secondary max-w-2xl mx-auto">
                            Teams use Voicecake to reduce queues, shorten handle times and keep customers happy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Main Testimonial */}
                        <div className="card p-8">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-primary-02 mb-4">83%</div>
                                <div className="text-lg text-t-secondary mb-6">Customer satisfaction up across adopters</div>
                                <Button className="mb-6">
                                    Get Started
                                </Button>
                                <div className="flex items-center justify-center mb-4">
                                    <Image
                                        src="/images/avatar.png"
                                        width={64}
                                        height={64}
                                        alt="Customer"
                                        className="rounded-full"
                                    />
                                </div>
                                <blockquote className="text-lg text-t-primary mb-2">
                                    "The AI phone agent handles peaks without extra headcount."
                                </blockquote>
                                <div className="text-t-secondary">
                                    Customer, Support Team
                                </div>
                            </div>
                        </div>

                        {/* Side Testimonials */}
                        <div className="space-y-6">
                            {testimonials.slice(1).map((testimonial, index) => (
                                <div key={index} className="card p-6">
                                    <div className="flex items-start space-x-4">
                                        <Image
                                            src={testimonial.avatar}
                                            width={48}
                                            height={48}
                                            alt={testimonial.name}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <blockquote className="text-t-primary mb-2">
                                                "{testimonial.quote}"
                                            </blockquote>
                                            <div className="text-sm text-t-secondary">
                                                <div className="font-medium">{testimonial.name}</div>
                                                <div>{testimonial.title}, {testimonial.company}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Button isStroke>
                            Read customer stories
                        </Button>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-b-surface2">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Choose the perfect plan for your business
                        </h2>
                        <p className="text-xl text-t-secondary max-w-2xl mx-auto">
                            Start free and scale as you grow. All plans include core features, analytics and guardrails.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className={`card p-6 ${plan.popular ? 'ring-2 ring-primary-02' : ''}`}>
                                {plan.popular && (
                                    <Badge className="bg-primary-02 text-white mb-4">
                                        Popular
                                    </Badge>
                                )}
                                <h3 className="text-xl font-semibold text-t-primary mb-2">
                                    {plan.name}
                                </h3>
                                <div className="text-3xl font-bold text-t-primary mb-6">
                                    {plan.price}
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            <Icon name="check" className="w-5 h-5 text-primary-02 mr-3" />
                                            <span className="text-t-secondary">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button 
                                    className={`w-full ${plan.popular ? 'bg-primary-02' : ''}`}
                                    isStroke={!plan.popular}
                                >
                                    Get Started
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integrations Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Seamless integrations that power your AI agent
                        </h2>
                        <p className="text-xl text-t-secondary max-w-2xl mx-auto">
                            Connect Voicecake to your help desk, CRM, commerce and telephony tools so every conversation has context.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary-01 to-primary-02 rounded-full opacity-20"></div>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 relative z-10">
                            {integrations.map((integration, index) => (
                                <div key={index} className="flex flex-col items-center group">
                                    <div className="w-16 h-16 bg-b-surface2 rounded-full flex items-center justify-center mb-3 border border-s-stroke2 hover:border-s-stroke hover:bg-b-surface1 transition-all duration-200 group-hover:scale-105">
                                        {integration.logo ? (
                                            <Image
                                                src={integration.logo}
                                                width={32}
                                                height={32}
                                                alt={integration.name}
                                                className="w-8 h-8 object-contain"
                                            />
                                        ) : (
                                            <Icon name={integration.icon} className="w-8 h-8 text-t-secondary group-hover:text-t-primary transition-colors" />
                                        )}
                                    </div>
                                    <span className="text-sm text-t-secondary text-center group-hover:text-t-primary transition-colors">
                                        {integration.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Button isStroke>
                            View all integrations
                        </Button>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="py-20 bg-b-surface2">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-4xl font-bold text-t-primary">
                            AI tips, productivity hacks and Voicecake updates
                        </h2>
                        <Link href="/blog" className="text-primary-02 hover:text-primary-01 transition-colors">
                            View the blog
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Blog Post */}
                        <div className="card lg:col-span-2 p-6">
                            <Image
                                src="/images/blog-1.png"
                                width={600}
                                height={300}
                                alt="Blog post"
                                className="rounded-2xl mb-6"
                            />
                            <div className="flex items-center space-x-4 text-sm text-t-secondary mb-3">
                                <span>{blogPosts[0].date}</span>
                                <span>•</span>
                                <span>{blogPosts[0].readTime}</span>
                                <span>•</span>
                                <Badge className="bg-primary-02/20 text-primary-02">
                                    {blogPosts[0].category}
                                </Badge>
                            </div>
                            <h3 className="text-xl font-semibold text-t-primary mb-3">
                                {blogPosts[0].title}
                            </h3>
                            <Link href="/blog" className="text-primary-02 hover:text-primary-01 transition-colors">
                                View Post →
                            </Link>
                        </div>

                        {/* Side Blog Posts */}
                        <div className="space-y-6">
                            {blogPosts.slice(1).map((post, index) => (
                                <div key={index} className="card p-6">
                                    <div className="flex items-center space-x-4 text-sm text-t-secondary mb-3">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                        <span>•</span>
                                        <Badge className="bg-primary-02/20 text-primary-02">
                                            {post.category}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold text-t-primary mb-3">
                                        {post.title}
                                    </h3>
                                    <Link href="/blog" className="text-primary-02 hover:text-primary-01 transition-colors">
                                        View Post →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Frequently asked questions
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {faqs.map((faq, index) => (
                            <div key={index} className="card p-8">
                                <h3 className="text-xl font-semibold text-t-primary mb-4">
                                    {faq.question}
                                </h3>
                                <p className="text-t-secondary">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-20 bg-b-surface2">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-t-primary mb-4">
                            Compare alternatives
                        </h2>
                        <p className="text-xl text-t-secondary max-w-2xl mx-auto">
                            Thinking about other options?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {comparisons.map((comparison, index) => (
                            <div key={index} className="card p-8">
                                <h3 className="text-xl font-semibold text-t-primary mb-4">
                                    {comparison.title}
                                </h3>
                                <p className="text-t-secondary">
                                    {comparison.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button isStroke>
                            See detailed comparisons
                        </Button>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-t-primary mb-4">
                        Start solving customer problems with Voicecake
                    </h2>
                    <p className="text-xl text-t-secondary mb-8 max-w-2xl mx-auto">
                        Join businesses using AI-powered agents to transform their customer support.
                    </p>
                    <Button className="text-lg px-8 py-4 h-14">
                        Get started today
                    </Button>
                    
                    <div className="mt-12">
                        <Image
                            src="/images/chat-interface.png"
                            width={600}
                            height={300}
                            alt="Chat interface"
                            className="rounded-2xl mx-auto"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-b-dark1 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Newsletter */}
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-semibold mb-4">Join Our Newsletter</h3>
                            <div className="flex gap-3">
                                <Field
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1"
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
                                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <Logo className="w-12 h-12" />
                                <span className="text-gray-300">© 2024 Voicecake. All rights reserved.</span>
                            </div>
                            <div className="flex space-x-4">
                                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link>
                                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
                                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

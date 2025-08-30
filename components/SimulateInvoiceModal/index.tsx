import React from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface SimulateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyName: string;
    usage: {
        conversaMinutes: number;
        empathMinutes: number;
        premiumVoiceMinutes: number;
        automationsCount: number;
    };
    onUsageChange: (usage: any) => void;
    pricing: {
        conversa: number;
        empath: number;
        automationsPack: number;
        premiumVoiceSurcharge: number;
    };
}

const SimulateInvoiceModal: React.FC<SimulateInvoiceModalProps> = ({ 
    isOpen, 
    onClose, 
    companyName, 
    usage, 
    onUsageChange,
    pricing
}) => {
    const handleInputChange = (field: string, value: string) => {
        onUsageChange({
            ...usage,
            [field]: parseInt(value) || 0
        });
    };

    // Calculate costs
    const calculateCosts = () => {
        const conversaCost = usage.conversaMinutes * pricing.conversa;
        const empathCost = usage.empathMinutes * pricing.empath;
        const premiumVoiceCost = usage.premiumVoiceMinutes * pricing.premiumVoiceSurcharge;
        const automationsCost = (usage.automationsCount / 10000) * pricing.automationsPack;
        
        return {
            conversa: conversaCost,
            empath: empathCost,
            premiumVoices: premiumVoiceCost,
            automations: automationsCost,
            total: conversaCost + empathCost + premiumVoiceCost + automationsCost
        };
    };

    const costs = calculateCosts();

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-t-primary">Simulate Invoice – {companyName}</h2>
                </div>
                
                <p className="text-sm text-t-secondary mb-6">
                    Adjust usage inputs to preview cost under current or overridden rates.
                </p>
                
                {/* Usage Input Fields */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-t-primary mb-2">Conversa minutes</label>
                        <input
                            type="number"
                            step="1"
                            value={usage.conversaMinutes}
                            onChange={(e) => handleInputChange('conversaMinutes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-t-primary mb-2">Empath minutes</label>
                        <input
                            type="number"
                            step="1"
                            value={usage.empathMinutes}
                            onChange={(e) => handleInputChange('empathMinutes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-t-primary mb-2">Premium voice minutes</label>
                        <input
                            type="number"
                            step="1"
                            value={usage.premiumVoiceMinutes}
                            onChange={(e) => handleInputChange('premiumVoiceMinutes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-t-primary mb-2">Automations count</label>
                        <input
                            type="number"
                            step="1000"
                            value={usage.automationsCount}
                            onChange={(e) => handleInputChange('automationsCount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                        />
                    </div>
                </div>
                
                {/* Calculated Costs */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-t-primary mb-3">Calculated Costs</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-t-secondary">Conversa</span>
                            <span className="text-sm font-medium text-t-primary">${costs.conversa.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-t-secondary">Empath</span>
                            <span className="text-sm font-medium text-t-primary">${costs.empath.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-t-secondary">Premium voices</span>
                            <span className="text-sm font-medium text-t-primary">${costs.premiumVoices.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-t-secondary">Automations</span>
                            <span className="text-sm font-medium text-t-primary">${costs.automations.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-t-primary">Total</span>
                                <span className="text-sm font-bold text-t-primary">${costs.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Action Button */}
                <div className="flex justify-center">
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SimulateInvoiceModal;

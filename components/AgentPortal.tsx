
import React, { useState, useCallback } from 'react';
import type { AgentFormData, GeneratedLinkData } from '../types';
import { generateLink } from '../services/apiService';

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.25-3-3m0 0l-3 3m3-3v12.75" />
    </svg>
);

const AgentPortal: React.FC = () => {
    const [formData, setFormData] = useState<AgentFormData>({
        insuredName: '', email: '', phone: '', policyNumber: '', policyType: 'Auto',
        cancellationDate: '', reinstatementDate: '', amountPaid: '', agentName: '', agentEmail: ''
    });
    const [generatedLinkData, setGeneratedLinkData] = useState<GeneratedLinkData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedLinkData(null);
        try {
            const data = await generateLink(formData);
            setGeneratedLinkData(data);
        } catch (error) {
            console.error("Failed to generate link:", error);
            alert("Failed to generate link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = useCallback((text: string, type: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(type);
            setTimeout(() => setCopySuccess(''), 2000);
        });
    }, []);

    const InputField: React.FC<{label: string, name: keyof AgentFormData, type?: string, required?: boolean}> = ({ label, name, type = 'text', required = true }) => (
        <div className="sm:col-span-1">
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2">
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue-600 sm:text-sm sm:leading-6"
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-brand-blue-800 mb-2">Agent Portal</h1>
                <p className="text-gray-600 mb-6">Generate a pre-filled Statement of No Loss for a customer.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        <div className="border-b border-gray-900/10 pb-8">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Customer & Policy Information</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">This information will be pre-filled on the customer's form.</p>
                            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                                <InputField label="Insured Full Name" name="insuredName" />
                                <InputField label="Policy Number" name="policyNumber" />
                                <InputField label="Customer Email" name="email" type="email" />
                                <InputField label="Customer Phone" name="phone" type="tel" />
                                <div className="sm:col-span-1">
                                    <label htmlFor="policyType" className="block text-sm font-medium leading-6 text-gray-900">Policy Type</label>
                                    <div className="mt-2">
                                        <select id="policyType" name="policyType" value={formData.policyType} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-blue-600 sm:text-sm sm:leading-6">
                                            <option>Auto</option>
                                            <option>Home</option>
                                            <option>Commercial</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <InputField label="Amount Paid for Reinstatement" name="amountPaid" type="text" />
                                <InputField label="Cancellation Effective Date" name="cancellationDate" type="date" />
                                <InputField label="Reinstatement Effective Date" name="reinstatementDate" type="date" />
                            </div>
                        </div>

                        <div className="border-b border-gray-900/10 pb-8">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Agent Information</h2>
                            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                                <InputField label="Agent Name" name="agentName" />
                                <InputField label="Agent Email for Notifications" name="agentEmail" type="email" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-md bg-brand-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Generating...' : 'Generate Pre-filled Link'}
                        </button>
                    </div>
                </form>
            </div>

            {generatedLinkData && (
                <div className="bg-white p-8 rounded-lg shadow-lg mt-8 animate-fade-in">
                    <h2 className="text-xl font-bold text-brand-blue-800 mb-4">Generated Link & Templates</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unique Customer Link</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <input type="text" readOnly value={generatedLinkData.url} className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-gray-300 focus:border-brand-blue-500 focus:ring-brand-blue-500 sm:text-sm" />
                                <button onClick={() => handleCopyToClipboard(generatedLinkData.url, 'url')} className="inline-flex items-center space-x-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-gray-100">
                                    <CopyIcon /> <span>{copySuccess === 'url' ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">SMS / Text Message Body</label>
                            <div className="mt-1 relative">
                                <textarea readOnly value={generatedLinkData.smsBody} rows={4} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500 sm:text-sm pr-24" />
                                <button onClick={() => handleCopyToClipboard(generatedLinkData.smsBody, 'sms')} className="absolute top-2 right-2 inline-flex items-center space-x-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-500 hover:bg-gray-100">
                                     <CopyIcon /> <span>{copySuccess === 'sms' ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Body</label>
                             <div className="mt-1 relative">
                                <textarea readOnly value={generatedLinkData.emailBody} rows={8} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500 sm:text-sm pr-24" />
                                <button onClick={() => handleCopyToClipboard(generatedLinkData.emailBody, 'email')} className="absolute top-2 right-2 inline-flex items-center space-x-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-500 hover:bg-gray-100">
                                     <CopyIcon /> <span>{copySuccess === 'email' ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentPortal;

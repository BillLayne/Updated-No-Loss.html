
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { CustomerFormData, AgentFormData } from '../types';
import { submitForm } from '../services/apiService';
import SignaturePad from './SignaturePad';

const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
};

const CustomerForm: React.FC = () => {
    const query = useQuery();
    const [formData, setFormData] = useState<Partial<CustomerFormData>>({});
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [confirmationNumber, setConfirmationNumber] = useState<string>('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const dataParam = query.get('data');
        if (dataParam) {
            try {
                const decodedData: AgentFormData = JSON.parse(atob(dataParam));
                setFormData({
                    ...decodedData,
                    noLossConfirmation: false,
                    dmvAcknowledgement: false,
                    mortgageAcknowledgement: false,
                    smsConsent: false,
                    esignConsent: false,
                });
            } catch (e) {
                console.error("Failed to parse form data from URL", e);
                setSubmissionStatus('error');
            }
        }
    }, [query]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.noLossConfirmation) errors.noLossConfirmation = 'You must confirm the statement of no loss.';
        if (!formData.esignConsent) errors.esignConsent = 'You must consent to electronic signatures.';
        if (!signatureData) errors.signature = 'A signature is required.';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            const completeFormData: CustomerFormData = { ...formData, signature: signatureData! } as CustomerFormData;
            const result = await submitForm(completeFormData);
            setConfirmationNumber(result.confirmationNumber);
            setSubmissionStatus('success');
        } catch (error) {
            console.error("Submission failed:", error);
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const InfoCard: React.FC<{title: string, data: Record<string, string>}> = ({title, data}) => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-brand-blue-700 border-b pb-2 mb-4">{title}</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                {Object.entries(data).map(([key, value]) => (
                    value && <div key={key}>
                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
    
    if (submissionStatus === 'success') {
        return (
            <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-lg shadow-lg">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="text-2xl font-bold text-gray-800 mt-4">Submission Successful!</h1>
                <p className="text-gray-600 mt-2">Thank you, {formData.insuredName}. Your Statement of No Loss has been received.</p>
                <p className="mt-4 font-semibold text-gray-700">Confirmation Number:</p>
                <p className="text-lg font-mono bg-gray-100 p-2 rounded-md inline-block mt-1">{confirmationNumber}</p>
                <p className="text-sm text-gray-500 mt-6">A confirmation has been sent to your email address.</p>
            </div>
        );
    }

    if (submissionStatus === 'error') {
        return <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600">An Error Occurred</h1>
            <p className="text-gray-600 mt-2">We couldn't load or submit your form. Please check the link or contact your agent.</p>
        </div>
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-brand-blue-800 mb-2">Statement of No Loss</h1>
            <p className="text-center text-gray-600 mb-8">Please review your information, read and accept the terms, and sign below.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InfoCard title="Insured Information" data={{ 'Full Name': formData.insuredName || '', 'Email': formData.email || '', 'Phone': formData.phone || ''}} />
                    <InfoCard title="Policy Information" data={{ 'Policy Number': formData.policyNumber || '', 'Policy Type': formData.policyType || '', 'Cancellation Date': formData.cancellationDate || '', 'Reinstatement Date': formData.reinstatementDate || '', 'Amount Paid': formData.amountPaid || ''}} />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-brand-blue-700 border-b pb-2 mb-4">Statement & Acknowledgements</h3>
                    <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p>I hereby certify that there have been no known or unknown losses, accidents, or occurrences from the date of policy cancellation on <strong>{formData.cancellationDate || '[Cancellation Date]'}</strong> through the requested reinstatement date of <strong>{formData.reinstatementDate || '[Reinstatement Date]'}</strong> which could give rise to a claim under the policy number <strong>{formData.policyNumber || '[Policy Number]'}</strong>.</p>
                        <p>I understand that any claims arising from events that occurred during this lapse period will not be covered. I acknowledge that misrepresentation in this statement can lead to policy cancellation or denial of claims.</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <Checkbox label="I have read, understood, and agree to the Statement of No Loss above." name="noLossConfirmation" checked={formData.noLossConfirmation || false} />
                        {formData.policyType === 'Auto' && <Checkbox label="I acknowledge that any DMV-related issues due to the lapse are my responsibility." name="dmvAcknowledgement" checked={formData.dmvAcknowledgement || false}/>}
                        {['Home', 'Commercial'].includes(formData.policyType || '') && <Checkbox label="I acknowledge that my mortgage company will be notified of this lapse and reinstatement." name="mortgageAcknowledgement" checked={formData.mortgageAcknowledgement || false} />}
                        <Checkbox label="I consent to receive text messages regarding this submission." name="smsConsent" checked={formData.smsConsent || false}/>
                        <Checkbox label="I consent to the use of an electronic signature and to receive documents electronically." name="esignConsent" checked={formData.esignConsent || false} />
                    </div>
                     {Object.values(formErrors).map((error, i) => <p key={i} className="text-red-500 text-sm mt-2">{error}</p>)}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-brand-blue-700">Electronic Signature</h3>
                    <p className="text-sm text-gray-500 mb-4">Please sign in the box below using your mouse or finger.</p>
                    <SignaturePad onSignatureEnd={setSignatureData} />
                    {formErrors.signature && <p className="text-red-500 text-sm mt-2">{formErrors.signature}</p>}
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto rounded-md bg-brand-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Submitting...' : 'Submit Statement of No Loss'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const Checkbox: React.FC<{label: string, name: keyof CustomerFormData, checked: boolean}> = ({label, name, checked}) => {
    const [isChecked, setIsChecked] = useState(checked);
    
    return (
        <div className="relative flex items-start">
            <div className="flex h-6 items-center">
                <input id={name} name={name} type="checkbox" checked={isChecked} onChange={e => setIsChecked(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-blue-600 focus:ring-brand-blue-600" />
            </div>
            <div className="ml-3 text-sm leading-6">
                <label htmlFor={name} className="font-medium text-gray-900">{label}</label>
            </div>
        </div>
    );
}

export default CustomerForm;

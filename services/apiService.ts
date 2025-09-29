
import type { AgentFormData, CustomerFormData, GeneratedLinkData } from '../types';

// Mock API service to simulate backend interactions (e.g., Google Apps Script)

/**
 * Generates a unique pre-filled link for the customer form.
 * In a real app, this might involve a backend call to create a session.
 * Here, we just encode the data into the URL.
 */
export const generateLink = (data: AgentFormData): Promise<GeneratedLinkData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const base64Data = btoa(JSON.stringify(data));
      const baseUrl = `${window.location.origin}${window.location.pathname}#/form`;
      const url = `${baseUrl}?data=${base64Data}`;
      
      const smsBody = `NC Insurance Expert: Please sign your Statement of No Loss for policy ${data.policyNumber}. Click here: ${url}`;
      const emailBody = `Dear ${data.insuredName},

Please complete and sign your Statement of No Loss to reinstate your policy (${data.policyNumber}).

Please click the link below to securely complete the form:
${url}

Thank you,
${data.agentName}
NC Insurance Expert`;

      resolve({ url, smsBody, emailBody });
    }, 500); // Simulate network delay
  });
};


/**
 * Submits the completed customer form.
 * In a real app, this would send the data to a backend server.
 */
export const submitForm = (data: CustomerFormData): Promise<{ status: string; confirmationNumber: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Submitting form data:', data);
      
      // Basic validation simulation
      if (!data.signature || !data.esignConsent) {
        reject(new Error("Missing required fields: signature and e-sign consent."));
        return;
      }
      
      // Generate a mock confirmation number
      const confirmationNumber = `NL-${Date.now()}-${data.policyNumber.slice(-4)}`;
      
      resolve({
        status: 'success',
        confirmationNumber,
      });
    }, 1000); // Simulate network delay
  });
};


export interface AgentFormData {
  insuredName: string;
  email: string;
  phone: string;
  policyNumber: string;
  policyType: string;
  cancellationDate: string;
  reinstatementDate: string;
  amountPaid: string;
  agentName: string;
  agentEmail: string;
}

export interface CustomerFormData extends AgentFormData {
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  noLossConfirmation: boolean;
  dmvAcknowledgement: boolean;
  mortgageAcknowledgement: boolean;
  smsConsent: boolean;
  esignConsent: boolean;
  signature: string;
}

export interface GeneratedLinkData {
  url: string;
  smsBody: string;
  emailBody: string;
}

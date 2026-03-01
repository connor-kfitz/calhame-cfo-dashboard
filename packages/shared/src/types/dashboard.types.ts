export type UpdateProfileForm = {
  company: string;
}

export type AccountingProvider = "quickbooks";

export type CompanyListItem = {
  companyMembershipId: string;
  companyId: string;
  companyName: string;
  providerName: string;
}

export type ErrorDialog = {
  title: string;
  message: string;
}

export type DashboardData = {
  year: number;
  infoCards: InfoCardData[];
  companies: string[];
}

export type InfoCardData = {
  title: string;
  value: string;
  info?: string;
}

export type Quarter = "year" | "q1" | "q2" | "q3" | "q4";

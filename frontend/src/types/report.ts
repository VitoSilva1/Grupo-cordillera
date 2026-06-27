export interface Report {
  id: number;
  title: string;
  description?: string | null;
  reportType: string;
  status: string;
  generatedAt: string;
}

export interface CreateReportPayload {
  title: string;
  description?: string;
  reportType: string;
  status: string;
}

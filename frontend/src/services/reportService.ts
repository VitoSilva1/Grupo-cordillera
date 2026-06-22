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

const REPORTS_API_URL = import.meta.env.VITE_REPORTS_API_URL || 'http://localhost:8000/api/reports';

export const reportService = {
  getReports: async (): Promise<Report[]> => {
    const response = await fetch(REPORTS_API_URL);

    if (!response.ok) {
      throw new Error(`Reports request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<Report[]>;
  },

  createReport: async (payload: CreateReportPayload): Promise<Report> => {
    const response = await fetch(REPORTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Reports request failed: ${response.status} ${response.statusText}`);
    }

    return data as Report;
  },
};

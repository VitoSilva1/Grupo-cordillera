import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { kpiService } from './kpiService';

const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8000/api/users';

export interface UserReport {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

async function fetchAllUsers(): Promise<UserReport[]> {
  const response = await fetch(USER_API_URL);
  if (!response.ok) throw new Error(`Error al obtener usuarios: ${response.status}`);
  return response.json() as Promise<UserReport[]>;
}

function createPdfHeader(doc: jsPDF, title: string): void {
  doc.setFontSize(18);
  doc.setTextColor(23, 37, 84); // brand-950
  doc.text('Grupo Cordillera', 14, 20);
  doc.setFontSize(13);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(title, 14, 29);
  doc.setFontSize(8);
  doc.text(`Generado: ${new Date().toLocaleString('es-CL')}`, 14, 36);
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(14, 39, 196, 39);
}

const TABLE_STYLES = {
  headStyles: { fillColor: [30, 64, 175] as [number, number, number] },
  theme: 'striped' as const,
  startY: 44,
};

export const reportService = {
  // ─── KPI Resumen ────────────────────────────────────────────────────────────
  downloadKpiSummaryPdf: async (): Promise<void> => {
    const summary = await kpiService.getSummary();
    const doc = new jsPDF();
    createPdfHeader(doc, 'Resumen de KPIs');
    autoTable(doc, {
      ...TABLE_STYLES,
      head: [['Indicador', 'Valor']],
      body: [
        ['Ventas Totales', `$${summary.ventasTotales.toLocaleString('es-CL')}`],
        ['Margen de Utilidad', `${summary.margenUtilidad}%`],
        ['Stock Crítico', String(summary.stockCritico)],
        ['Reclamos Activos', String(summary.reclamosActivos)],
        ['Ticket Promedio', `$${summary.ticketPromedio.toLocaleString('es-CL')}`],
        ['Satisfacción del Cliente', `${summary.satisfaccionCliente}%`],
      ],
    });
    doc.save('reporte-kpi-resumen.pdf');
  },

  downloadKpiSummaryXlsx: async (): Promise<void> => {
    const summary = await kpiService.getSummary();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Indicador', 'Valor'],
      ['Ventas Totales', summary.ventasTotales],
      ['Margen de Utilidad', summary.margenUtilidad],
      ['Stock Crítico', summary.stockCritico],
      ['Reclamos Activos', summary.reclamosActivos],
      ['Ticket Promedio', summary.ticketPromedio],
      ['Satisfacción del Cliente', summary.satisfaccionCliente],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KPI Resumen');
    XLSX.writeFile(wb, 'reporte-kpi-resumen.xlsx');
  },

  // ─── Ventas Mensuales ────────────────────────────────────────────────────────
  downloadMonthlySalesPdf: async (): Promise<void> => {
    const sales = await kpiService.getSales();
    const doc = new jsPDF();
    createPdfHeader(doc, 'Ventas Mensuales');
    autoTable(doc, {
      ...TABLE_STYLES,
      head: [['Mes', 'Ventas ($)']],
      body: sales.map(s => [s.month, `$${s.ventas.toLocaleString('es-CL')}`]),
    });
    doc.save('reporte-ventas-mensuales.pdf');
  },

  downloadMonthlySalesXlsx: async (): Promise<void> => {
    const sales = await kpiService.getSales();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Mes', 'Ventas'],
      ...sales.map(s => [s.month, s.ventas]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas Mensuales');
    XLSX.writeFile(wb, 'reporte-ventas-mensuales.xlsx');
  },

  // ─── Sucursales ──────────────────────────────────────────────────────────────
  downloadBranchPdf: async (): Promise<void> => {
    const branches = await kpiService.getBranchesPerformance();
    const doc = new jsPDF();
    createPdfHeader(doc, 'Desempeño por Sucursal');
    autoTable(doc, {
      ...TABLE_STYLES,
      head: [['Sucursal', 'Desempeño (%)']],
      body: branches.map(b => [b.branch, `${b.desempeño}%`]),
    });
    doc.save('reporte-sucursales.pdf');
  },

  downloadBranchXlsx: async (): Promise<void> => {
    const branches = await kpiService.getBranchesPerformance();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Sucursal', 'Desempeño (%)'],
      ...branches.map(b => [b.branch, b.desempeño]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sucursales');
    XLSX.writeFile(wb, 'reporte-sucursales.xlsx');
  },

  // ─── Canales de Venta ────────────────────────────────────────────────────────
  downloadChannelsPdf: async (): Promise<void> => {
    const channels = await kpiService.getSalesByChannel();
    const doc = new jsPDF();
    createPdfHeader(doc, 'Canales de Venta');
    autoTable(doc, {
      ...TABLE_STYLES,
      head: [['Canal', 'Participación (%)']],
      body: channels.map(c => [c.channel, `${c.value}%`]),
    });
    doc.save('reporte-canales-venta.pdf');
  },

  downloadChannelsXlsx: async (): Promise<void> => {
    const channels = await kpiService.getSalesByChannel();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Canal', 'Participación (%)'],
      ...channels.map(c => [c.channel, c.value]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Canales');
    XLSX.writeFile(wb, 'reporte-canales-venta.xlsx');
  },

  // ─── Alertas ─────────────────────────────────────────────────────────────────
  downloadAlertsPdf: async (): Promise<void> => {
    const alerts = await kpiService.getAlerts();
    const doc = new jsPDF();
    createPdfHeader(doc, 'Alertas del Sistema');
    autoTable(doc, {
      ...TABLE_STYLES,
      head: [['KPI', 'Estado', 'Fecha', 'Descripción']],
      body: alerts.map(a => [a.kpi, a.status, a.date, a.description]),
      styles: { fontSize: 9 },
      columnStyles: { 3: { cellWidth: 70 } },
    });
    doc.save('reporte-alertas.pdf');
  },

  downloadAlertsXlsx: async (): Promise<void> => {
    const alerts = await kpiService.getAlerts();
    const ws = XLSX.utils.aoa_to_sheet([
      ['ID', 'KPI', 'Estado', 'Fecha', 'Descripción'],
      ...alerts.map(a => [a.id, a.kpi, a.status, a.date, a.description]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alertas');
    XLSX.writeFile(wb, 'reporte-alertas.xlsx');
  },

  // ─── Usuarios ────────────────────────────────────────────────────────────────
  downloadUsersPdf: async (): Promise<void> => {
    const users = await fetchAllUsers();
    const doc = new jsPDF({ orientation: 'landscape' });
    createPdfHeader(doc, 'Usuarios del Sistema');
    autoTable(doc, {
      ...TABLE_STYLES,
      head: [['Usuario', 'Nombre', 'Apellido', 'Email', 'Rol', 'Fecha Registro']],
      body: users.map(u => [
        u.username,
        u.firstName,
        u.lastName,
        u.email,
        u.role,
        u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-CL') : '—',
      ]),
      styles: { fontSize: 9 },
    });
    doc.save('reporte-usuarios.pdf');
  },

  downloadUsersXlsx: async (): Promise<void> => {
    const users = await fetchAllUsers();
    const ws = XLSX.utils.aoa_to_sheet([
      ['ID', 'Usuario', 'Nombre', 'Apellido', 'Email', 'Rol', 'Fecha Registro'],
      ...users.map(u => [
        u.id,
        u.username,
        u.firstName,
        u.lastName,
        u.email,
        u.role,
        u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-CL') : '',
      ]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, 'reporte-usuarios.xlsx');
  },
};

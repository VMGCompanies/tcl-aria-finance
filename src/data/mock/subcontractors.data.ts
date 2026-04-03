import type { Subcontractor } from '../../types/ap.types';

export const SUBCONTRACTORS: Subcontractor[] = [
  {
    id: 'sub-metro', name: 'Metro Electric Sub', specialty: 'Commercial Electrical',
    activeProjects: 3, w9Status: 'on-file', coiStatus: 'expired', coiExpiry: '2026-03-15',
    lienWaiverStatus: 'pending', complianceStatus: 'Non-Compliant',
    contact: 'Tony Russo', phone: '(708) 555-0411', email: 't.russo@metroelectricsub.com',
    insurance: 'Progressive Commercial', ein: '36-2847190', is1099: true,
  },
  {
    id: 'sub-apex', name: 'Apex Lighting Solutions', specialty: 'Lighting Installation',
    activeProjects: 1, w9Status: 'on-file', coiStatus: 'valid', coiExpiry: '2026-08-31',
    lienWaiverStatus: 'received', complianceStatus: 'Compliant',
    contact: 'Sandra Cruz', phone: '(630) 555-0201', email: 's.cruz@apexlightingsolutions.com',
    insurance: 'Hartford Business', ein: '45-8821033', is1099: true,
  },
  {
    id: 'sub-midwest', name: 'Midwest Panel Service', specialty: 'Panel & Switchgear',
    activeProjects: 2, w9Status: 'on-file', coiStatus: 'valid', coiExpiry: '2026-11-30',
    lienWaiverStatus: 'pending', complianceStatus: 'Compliant',
    contact: 'Rick Schaefer', phone: '(847) 555-0318', email: 'r.schaefer@midwestpanel.com',
    insurance: 'Travelers Commercial', ein: '47-3318820', is1099: true,
  },
  {
    id: 'sub-premier', name: 'Premier Conduit LLC', specialty: 'Conduit & Rough-In',
    activeProjects: 2, w9Status: 'on-file', coiStatus: 'expiring-soon', coiExpiry: '2026-04-30',
    lienWaiverStatus: 'pending', complianceStatus: 'Expiring Soon',
    contact: 'Jim Vargas', phone: '(630) 555-0519', email: 'j.vargas@premierconduit.com',
    insurance: 'State Farm Commercial', ein: '88-1124477', is1099: true,
  },
  {
    id: 'sub-flm', name: 'FLM Electrical Contractors', specialty: 'General Electrical',
    activeProjects: 1, w9Status: 'on-file', coiStatus: 'valid', coiExpiry: '2026-12-31',
    lienWaiverStatus: 'received', complianceStatus: 'Compliant',
    contact: 'Frank Martinez', phone: '(815) 555-0612', email: 'f.martinez@flmelectrical.com',
    insurance: 'Liberty Mutual Commercial', ein: '92-4418830', is1099: true,
  },
];

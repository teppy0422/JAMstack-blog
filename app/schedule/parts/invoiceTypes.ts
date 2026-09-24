export type Invoice = {
  id: number;
  project_id: number;
  client_name: string;
  delivery_place: string | null;
  issue_date: string;
  subject_title: string | null;
  subject_detail: string | null;
  responder_name: string | null;
  notes: string | null;
  hourly_rate: number;
  subtotal: number;
  tax: number;
  total: number;
  payment_due_date: string | null;
  is_paid: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceLineItem = {
  id: number;
  invoice_id: number;
  work_date: string | null;
  section_label: string | null;
  description: string;
  hours: number | null;
  unit_price: number;
  amount: number;
  remarks: string | null;
  sort_order: number;
  source_entry_id: number | null;
};

import type { ScheduleProject } from "./GanttSummary";
import type { Invoice, InvoiceLineItem } from "./invoiceTypes";
import { generateInvoicePdf } from "./generateInvoicePdf";

const TAX_RATE = 0.1;

export function hasSavedEstimate(project: ScheduleProject): boolean {
  return project.estimate_amount != null || project.draft_issue_date != null;
}

export function estimateTotals(amount: number) {
  const tax = Math.round(amount * TAX_RATE);
  return { subtotal: amount, tax, total: amount + tax };
}

// 見積には工数ごとの明細が無いので、請求書と同じレイアウトで「一式」1行として出力する
export async function generateEstimatePdf(project: ScheduleProject): Promise<Blob> {
  const { subtotal, tax, total } = estimateTotals(project.estimate_amount ?? 0);
  const now = new Date().toISOString();
  const estimate: Invoice = {
    id: 0,
    project_id: project.id,
    client_name: project.client_name || project.name,
    delivery_place: project.delivery_place,
    issue_date: project.draft_issue_date ?? now.slice(0, 10),
    subject_title: project.draft_subject_title,
    subject_detail: project.draft_subject_detail,
    responder_name: project.draft_responder_name,
    notes: project.draft_notes,
    hourly_rate: project.hourly_rate,
    subtotal,
    tax,
    total,
    payment_due_date: null,
    is_paid: false,
    created_by: "",
    created_at: now,
    updated_at: now,
  };
  const lineItems: InvoiceLineItem[] = [
    {
      id: 0,
      invoice_id: 0,
      work_date: null,
      section_label: null,
      description: project.draft_subject_title?.trim() || project.name,
      hours: 1,
      unit_price: subtotal,
      amount: subtotal,
      remarks: null,
      sort_order: 0,
      source_entry_id: null,
    },
  ];
  return generateInvoicePdf(
    estimate,
    lineItems,
    project.invoice_number || "-",
    project.name,
    "estimate"
  );
}

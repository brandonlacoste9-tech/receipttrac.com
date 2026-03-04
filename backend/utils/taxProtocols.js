/**
 * RECEIPTTRAC JURISDICTIONAL PROTOCOLS
 * Precision tax calculation engines for diverse regions.
 */

const PROTOCOLS = {
  QUEBEC: {
    currency: 'CAD',
    locale: 'fr-CA',
    taxes: [
      { id: 'TPS', rate: 0.05, label: 'TPS (5%)' },
      { id: 'TVQ', rate: 0.09975, label: 'TVQ (9.975%)' }
    ],
    calculate: (total) => {
      // ReceiptTrac Sovereign Precision: 
      // Quebec Jurisdictional Multiplier: 1.14975
      // Total = Subtotal * (1 + GST + QST)
      // Recalculating subtotal from total with float guard.
      const subtotal = Math.round((total / 1.14975) * 100) / 100;
      
      // Precision Rounding (Revenu Québec Compliance)
      const tps = Math.round((subtotal * 0.05) * 100) / 100;
      const tvq = Math.round((subtotal * 0.09975) * 100) / 100;
      
      // Verification Hash: If sum doesn't match total, adjust subtotal as balancing entry.
      const diff = total - (subtotal + tps + tvq);
      const finalSubtotal = Number((subtotal + diff).toFixed(2));
      
      return {
        subtotal: finalSubtotal,
        tax_gst: Number(tps.toFixed(2)),
        tax_qst_pst: Number(tvq.toFixed(2)),
        tax_hst: 0,
        tax_usa: 0
      };
    }
  },
  CANADA: {
    currency: 'CAD',
    locale: 'en-CA',
    taxes: [
      { id: 'HST', rate: 0.13, label: 'HST (13%)' } 
    ],
    calculate: (total) => {
      const subtotal = Math.round((total / 1.13) * 100) / 100;
      const hst = Math.round((subtotal * 0.13) * 100) / 100;
      const diff = total - (subtotal + hst);
      return {
        subtotal: Number((subtotal + diff).toFixed(2)),
        tax_hst: Number(hst.toFixed(2)),
        tax_gst: 0,
        tax_qst_pst: 0,
        tax_usa: 0
      };
    }
  },
  USA: {
    currency: 'USD',
    locale: 'en-US',
    taxes: [
      { id: 'SALES_TAX', rate: 0.08, label: 'Sales Tax (Est.)' }
    ],
    calculate: (total) => {
      const subtotal = Math.round((total / 1.08) * 100) / 100;
      const salesTax = Math.round((subtotal * 0.08) * 100) / 100;
      const diff = total - (subtotal + salesTax);
      return {
        subtotal: Number((subtotal + diff).toFixed(2)),
        tax_usa: Number(salesTax.toFixed(2)),
        tax_gst: 0,
        tax_qst_pst: 0,
        tax_hst: 0
      };
    }
  }
};

export { PROTOCOLS };

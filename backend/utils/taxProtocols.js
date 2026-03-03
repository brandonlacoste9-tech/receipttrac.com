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
      // In Quebec, TVQ is calculated on (Subtotal + TPS) logic in some contexts, 
      // but standard consumer totals follow: Total = Subtotal * 1.14975
      const subtotal = total / 1.14975;
      const tps = subtotal * 0.05;
      const tvq = subtotal * 0.09975;
      return {
        subtotal: Number(subtotal.toFixed(2)),
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
      { id: 'HST', rate: 0.13, label: 'HST (13%)' } // Defaulting to ON/Atlantic average
    ],
    calculate: (total) => {
      const subtotal = total / 1.13;
      const hst = total - subtotal;
      return {
        subtotal: Number(subtotal.toFixed(2)),
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
      const subtotal = total / 1.08;
      const salesTax = total - subtotal;
      return {
        subtotal: Number(subtotal.toFixed(2)),
        tax_usa: Number(salesTax.toFixed(2)),
        tax_gst: 0,
        tax_qst_pst: 0,
        tax_hst: 0
      };
    }
  }
};

export { PROTOCOLS };

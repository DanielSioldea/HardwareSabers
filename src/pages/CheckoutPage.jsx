import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import useStore from '../store/useStore';

function groupComponents(sceneComponents) {
  const map = {};
  for (const comp of sceneComponents) {
    const key = comp.name;
    if (map[key]) {
      map[key].qty += 1;
    } else {
      map[key] = { name: comp.name, color: comp.color, qty: 1, unitPrice: comp.price ?? 1.00 };
    }
  }
  return Object.values(map);
}

function exportPDF(groups, total) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFillColor(13, 17, 23);
  doc.rect(0, 0, pageW, 36, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(230, 237, 243);
  doc.text('Hardware Sabers', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(139, 148, 158);
  doc.text('Parts List / Bill of Materials', 14, 25);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, pageW - 14, 25, { align: 'right' });

  // ── Column layout ────────────────────────────────────────────────────────────
  const COL = { component: 14, qty: 130, unit: 155, total: 180 };
  let y = 50;

  // Column headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 110, 120);
  doc.text('COMPONENT', COL.component, y);
  doc.text('QTY', COL.qty, y, { align: 'right' });
  doc.text('UNIT', COL.unit, y, { align: 'right' });
  doc.text('TOTAL', COL.total, y, { align: 'right' });

  y += 3;
  doc.setDrawColor(48, 54, 61);
  doc.setLineWidth(0.4);
  doc.line(14, y, pageW - 14, y);
  y += 8;

  // Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  for (const group of groups) {
    if (y > 268) {
      doc.addPage();
      y = 20;
    }
    doc.text(group.name, COL.component, y);
    doc.text(String(group.qty), COL.qty, y, { align: 'right' });
    doc.text(`$${group.unitPrice.toFixed(2)}`, COL.unit, y, { align: 'right' });
    doc.text(`$${(group.qty * group.unitPrice).toFixed(2)}`, COL.total, y, { align: 'right' });
    y += 9;

    doc.setDrawColor(30, 36, 41);
    doc.setLineWidth(0.2);
    doc.line(14, y - 3, pageW - 14, y - 3);
    y += 3;
  }

  // ── Total ────────────────────────────────────────────────────────────────────
  y += 4;
  doc.setDrawColor(48, 54, 61);
  doc.setLineWidth(0.5);
  doc.line(14, y - 4, pageW - 14, y - 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 195, 247);
  doc.text('Estimated Total', COL.component, y + 4);
  doc.text(`$${total.toFixed(2)}`, COL.total, y + 4, { align: 'right' });

  doc.save('hardware-sabers-parts-list.pdf');
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { sceneComponents } = useStore();

  const groups = groupComponents(sceneComponents);
  const total = groups.reduce((sum, g) => sum + g.qty * g.unitPrice, 0);
  const isEmpty = groups.length === 0;

  return (
    <div className="checkout-page">
      {/* ── Top bar ── */}
      <header className="checkout-header">
        <button className="btn-secondary checkout-back" onClick={() => navigate('/builder')}>
          ← Back to Builder
        </button>
        <h1 className="checkout-title">Build Summary</h1>
        <button
          className="btn-primary checkout-export"
          disabled={isEmpty}
          onClick={() => exportPDF(groups, total)}
        >
          Export PDF
        </button>
      </header>

      {/* ── Body ── */}
      <div className="checkout-body">
        {isEmpty ? (
          <div className="checkout-empty">
            <p>Your build is empty.</p>
            <p>Head back to the builder and add some components.</p>
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/builder')}>
              Go to Builder
            </button>
          </div>
        ) : (
          <div className="checkout-card">
            <table className="checkout-table">
              <thead>
                <tr>
                  <th className="checkout-th col-component">Component</th>
                  <th className="checkout-th col-num">Qty</th>
                  <th className="checkout-th col-num">Unit Price</th>
                  <th className="checkout-th col-num">Total</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.name} className="checkout-row">
                    <td className="checkout-td">
                      <span className="checkout-swatch" style={{ backgroundColor: group.color }} />
                      {group.name}
                    </td>
                    <td className="checkout-td col-num">{group.qty}</td>
                    <td className="checkout-td col-num">${group.unitPrice.toFixed(2)}</td>
                    <td className="checkout-td col-num">${(group.qty * group.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="checkout-total-row">
              <span className="checkout-total-label">
                {sceneComponents.length} part{sceneComponents.length !== 1 ? 's' : ''},{' '}
                {groups.length} unique component{groups.length !== 1 ? 's' : ''}
              </span>
              <div className="checkout-total-amount">
                <span className="checkout-total-sub">Estimated Total</span>
                <span className="checkout-total-price">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

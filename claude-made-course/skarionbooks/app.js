/* SkarionBooks — QuickBooks-style accounting simulator.
   Data model: db.accounts (id/name/type/normal/balance), db.journal ({date,memo,lines:[{account,debit,credit}]}) */

const INITIAL_ACCOUNTS = [
  { id: '1000', name: 'Operating Checking', type: 'Asset', normal: 'debit', balance: 340000 },
  { id: '1100', name: 'Accounts Receivable', type: 'Asset', normal: 'debit', balance: 1200000 },
  { id: '1200', name: 'Prepaid Software', type: 'Asset', normal: 'debit', balance: 36000 },
  { id: '1500', name: 'GIS Servers & Workstations', type: 'Asset', normal: 'debit', balance: 60000 },
  { id: '1590', name: 'Accumulated Depreciation', type: 'Asset', normal: 'credit', balance: 0 },
  { id: '2000', name: 'Accounts Payable', type: 'Liability', normal: 'credit', balance: 280000 },
  { id: '2200', name: 'Payroll Tax Liabilities', type: 'Liability', normal: 'credit', balance: 0 },
  { id: '2300', name: 'Accrued Interest', type: 'Liability', normal: 'credit', balance: 0 },
  { id: '2500', name: 'Loan Payable', type: 'Liability', normal: 'credit', balance: 500000 },
  { id: '3000', name: "Owner's Equity", type: 'Equity', normal: 'credit', balance: 211000 },
  { id: '3100', name: 'Retained Earnings', type: 'Equity', normal: 'credit', balance: 0 },
  { id: '4000', name: 'Engineering Design Revenue', type: 'Revenue', normal: 'credit', balance: 0 },
  { id: '5100', name: 'COGS - Subcontractors', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6000', name: 'Salaries - US Engineering PMs', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6100', name: 'Payroll Tax Expense', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6500', name: 'Software & Subscriptions', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6700', name: 'Depreciation Expense', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6800', name: 'Interest Expense', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6900', name: 'Bank Fees Expense', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6720', name: 'Bad Debt Expense', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '1200X', name: 'Allowance for Doubtful Accts', type: 'Asset', normal: 'credit', balance: 0 },
];

const VENDORS = [
  { id: 'GCS', name: 'Global CAD Solutions', acct: '5100' },
  { id: 'DOM', name: 'Dominion Aluminum & Fasteners', acct: '5100' },
  { id: 'ARC', name: 'ArcGIS Pro (ESRI)', acct: '6500' },
  { id: 'LEASE', name: 'Office Landlord', acct: '6500' },
];
const CUSTOMERS = [
  { id: 'AFC', name: 'Atlantic Fiber Co.' },
  { id: 'SEB', name: 'Southeast Broadband' },
  { id: 'TCB', name: 'TeleCom Builders' },
];
const SEED_OPEN_INVOICES = [
  { id: 'INV-001', cust: 'AFC', amount: 480000 },
  { id: 'INV-002', cust: 'SEB', amount: 215000 },
  { id: 'INV-003', cust: 'SEB', amount: 190000 },
  { id: 'INV-004', cust: 'TCB', amount: 78500 },
  { id: 'INV-005', cust: 'TCB', amount: 34200 },
];

let db = { accounts: [], journal: [], invoices: [] };

function initDB() {
  const saved = localStorage.getItem('skarionbooks_db');
  if (saved) { db = JSON.parse(saved); if (!db.invoices) db.invoices = JSON.parse(JSON.stringify(SEED_OPEN_INVOICES)); }
  else resetDB();
}
function resetDB() {
  db = { accounts: JSON.parse(JSON.stringify(INITIAL_ACCOUNTS)), journal: [], invoices: JSON.parse(JSON.stringify(SEED_OPEN_INVOICES)) };
  saveDB(); renderView('dashboard');
}
function saveDB() { localStorage.setItem('skarionbooks_db', JSON.stringify(db)); }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

function getBalances() {
  const bals = {}; db.accounts.forEach(a => bals[a.id] = a.balance);
  db.journal.forEach(je => je.lines.forEach(l => {
    const a = db.accounts.find(x => x.id === l.account); if (!a) return;
    bals[l.account] += a.normal === 'debit' ? (l.debit - l.credit) : (l.credit - l.debit);
  }));
  return bals;
}
function acctName(id) { return (db.accounts.find(a => a.id === id) || {}).name || id; }
function postJE(date, memo, lines) { db.journal.push({ date, memo, lines }); saveDB(); }
function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = '✓ ' + msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ---- VIEWS ----
function kpiCard(label, value) {
  return `<div class="metric-card"><div class="metric-label">${label}</div><div class="metric-value" data-counter="${Math.round(value)}">${fmt(0)}</div></div>`;
}
function animateCounters(root) {
  (root || document).querySelectorAll('.metric-value[data-counter]').forEach(el => {
    const target = parseFloat(el.dataset.counter);
    let start = 0; const dur = 1200; const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / dur); const v = Math.round(start + (target - start) * p);
      el.textContent = fmt(v); if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

function renderDashboard() {
  const b = getBalances(); let rev = 0, exp = 0;
  db.accounts.forEach(a => { if (a.type === 'Revenue') rev += b[a.id]; if (a.type === 'Expense') exp += b[a.id]; });
  const ni = rev - exp;
  const recent = db.journal.slice().reverse();
  return `
    <div class="kpi-actions"><button class="btn primary" onclick="openBillPanel()">Create Invoice</button>
    <button class="btn secondary" onclick="openBillPanel()">Record Expense</button>
    <button class="btn secondary" onclick="openPayPanel()">Pay Bills</button>
    <button class="btn secondary" onclick="renderView('reports')">View Reports</button></div>
    <div class="metric-grid">
      ${kpiCard('Cash Balance', b['1000'])}
      ${kpiCard('Outstanding AR', b['1100'])}
      ${kpiCard('Outstanding AP', b['2000'])}
      ${kpiCard('Net Income (MTD)', ni)}
    </div>
    <div class="card"><h2 class="card-title">Recent Transactions</h2>
      <table><thead><tr><th>Date</th><th>Memo</th><th class="text-right">Amount</th></tr></thead><tbody>
      ${recent.slice(0, 10).map(je => `<tr><td>${je.date}</td><td>${je.memo || 'Journal Entry'}</td><td class="text-right">${fmt(je.lines.reduce((s, l) => s + l.debit, 0))}</td></tr>`).join('') || '<tr><td colspan="3">No transactions yet. Enter a bill or post a journal entry to begin.</td></tr>'}
      </tbody></table></div>`;
}

function renderCOA() {
  const b = getBalances();
  return `<div class="card">
    <div class="card-actions"><button class="btn secondary" onclick="exportCOA()">⤓ Export CSV</button><button class="btn secondary" onclick="alert('New Account is visual-only in this simulation.')">+ New Account</button></div>
    <table><thead><tr><th>Number</th><th>Name</th><th>Type</th><th class="text-right">Balance</th><th></th></tr></thead><tbody>
    ${db.accounts.map(a => `<tr><td>${a.id}</td><td>${a.name}</td><td>${a.type}</td><td class="text-right">${fmt(b[a.id] || 0)}</td><td><button class="btn-text" onclick="drillCOA('${a.id}')">View activity →</button></td></tr>`).join('')}
    </tbody></table></div>`;
}
function drillCOA(id) {
  const rows = db.journal.filter(je => je.lines.some(l => l.account === id)).reverse();
  const total = rows.reduce((s, je) => s + je.lines.filter(l => l.account === id).reduce((t, l) => t + (db.accounts.find(a => a.id === id).normal === 'debit' ? (l.debit - l.credit) : (l.credit - l.debit)), 0), 0);
  const area = document.getElementById('content-area');
  area.insertAdjacentHTML('beforeend', `<div class="modal-overlay open" onclick="this.remove()"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h2>${id} — ${acctName(id)} activity</h2><button class="btn-close" onclick="this.closest('.modal-overlay').remove()">×</button></div><div class="modal-body">${rows.length ? `<table class="je-table"><thead><tr><th>Date</th><th>Memo</th><th class="text-right">Debit</th><th class="text-right">Credit</th></tr></thead><tbody>${rows.map(je => je.lines.filter(l => l.account === id).map(l => `<tr><td>${je.date}</td><td>${je.memo || ''}</td><td class="text-right">${l.debit ? fmt(l.debit) : ''}</td><td class="text-right">${l.credit ? fmt(l.credit) : ''}</td></tr>`).join('')).join('')}</tbody></table>` : '<p>No activity yet for this account.</p>'}<p class="hint" style="margin-top:10px;">Net activity: <strong>${fmt(total)}</strong></p></div></div></div>`);
}
function exportCOA() {
  const b = getBalances(); let csv = 'Number,Name,Type,Balance\n';
  db.accounts.forEach(a => csv += `${a.id},"${a.name}",${a.type},${(b[a.id] || 0).toFixed(2)}\n`);
  const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'Skarion_COA.csv'; a.click(); URL.revokeObjectURL(url);
}

function renderBills() {
  const apEntries = db.journal.filter(j => j.lines.some(l => l.account === '2000'));
  return `<div class="card"><div class="card-actions"><button class="btn primary" onclick="openBillPanel()">+ Enter Bill</button></div>
    <h2 class="card-title">Open Bills (Accounts Payable)</h2>
    <table><thead><tr><th>Date</th><th>Reference</th><th>Account (expense)</th><th class="text-right">Amount</th></tr></thead><tbody>
    ${apEntries.length ? apEntries.reverse().map(j => `<tr><td>${j.date}</td><td>${j.memo}</td><td>${j.lines.find(l => l.account !== '2000' && l.debit) ? acctName(j.lines.find(l => l.account !== '2000' && l.debit).account) : ''}</td><td class="text-right">${fmt(j.lines.find(l => l.account === '2000').credit)}</td></tr>`).join('') : '<tr><td colspan="4">No bills entered yet. Click "+ Enter Bill" to post one (Dr expense / Cr Accounts Payable).</td></tr>'}
    </tbody></table></div>`;
}

function renderPayments() {
  const arEntries = db.journal.filter(j => j.lines.some(l => l.account === '1100' && l.credit));
  return `<div class="card"><div class="card-actions"><button class="btn primary" onclick="openPayPanel()">+ Receive Payment</button></div>
    <h2 class="card-title">Open Invoices &amp; Recent Receipts (AR)</h2>
    <table><thead><tr><th>Invoice #</th><th>Customer</th><th class="text-right">Open Amount</th></tr></thead><tbody>
    ${db.invoices.map(inv => `<tr><td>${inv.id}</td><td>${(CUSTOMERS.find(c => c.id === inv.cust) || {}).name || inv.cust}</td><td class="text-right">${fmt(inv.amount)}</td></tr>`).join('')}
    </tbody></table>
    <h2 class="card-title" style="margin-top:22px;">Recent Receipts</h2>
    <table><thead><tr><th>Date</th><th>Memo</th><th class="text-right">Amount</th></tr></thead><tbody>
    ${arEntries.reverse().map(j => `<tr><td>${j.date}</td><td>${j.memo}</td><td class="text-right">${fmt(j.lines.find(l => l.account === '1100').credit)}</td></tr>`).join('') || '<tr><td colspan="3">No customer payments posted yet.</td></tr>'}
    </tbody></table></div>`;
}

function renderJournal() {
  return `<div class="card"><table><thead><tr><th>Date</th><th>Memo</th><th>Account</th><th class="text-right">Debit</th><th class="text-right">Credit</th></tr></thead><tbody>
  ${db.journal.slice().reverse().map(je => je.lines.map((l, i) => `<tr><td>${i === 0 ? je.date : ''}</td><td>${i === 0 ? je.memo : ''}</td><td>${acctName(l.account)}</td><td class="text-right">${l.debit ? fmt(l.debit) : ''}</td><td class="text-right">${l.credit ? fmt(l.credit) : ''}</td></tr>`).join('')).join('') || '<tr><td colspan="5">No journal entries.</td></tr>'}
  </tbody></table></div>`;
}

function renderReports() {
  const b = getBalances(); let rev = 0, cogs = 0, opex = 0;
  db.accounts.forEach(a => { if (a.type === 'Revenue') rev += b[a.id]; if (a.id === '5100') cogs += b[a.id]; if (a.type === 'Expense' && a.id !== '5100') opex += b[a.id]; });
  const grossProfit = rev - cogs; const ni = grossProfit - opex;
  // Cash flow (simplified indirect): NI + depreciation − ΔAR − ΔAP
  const dep = b['6700'] || 0;
  const dAR = (b['1100'] - 1200000), dAP = (b['2000'] - 280000);
  const cfOps = ni + dep - dAR + dAP;
  const reportBtns = `<div class="card-actions"><button class="btn secondary" onclick="window.print()">🖨 Print</button></div>`;
  return `${reportBtns}
    <div class="reports-grid">
      <div class="card print"><h2 class="card-title">Income Statement (P&L)</h2>
        <table><tbody>
        <tr><td>Engineering Design Revenue</td><td class="text-right">${fmt(rev)}</td></tr>
        <tr><td>COGS — Subcontractors</td><td class="text-right">(${fmt(cogs)})</td></tr>
        <tr class="total"><td>Gross Profit</td><td class="text-right">${fmt(grossProfit)}</td></tr>
        <tr><td>Operating Expenses</td><td class="text-right">(${fmt(opex)})</td></tr>
        <tr class="total"><td>Net Income</td><td class="text-right">${fmt(ni)}</td></tr>
        </tbody></table></div>
      <div class="card print"><h2 class="card-title">Balance Sheet</h2>
        <table><tbody>
        <tr><th colspan="2">Assets</th></tr>
        ${db.accounts.filter(a => a.type === 'Asset').map(a => b[a.id] ? `<tr><td>${a.id} ${a.name}</td><td class="text-right">${fmt(b[a.id])}</td></tr>` : '').join('')}
        <tr class="total"><td>Total Assets</td><td class="text-right">${fmt(db.accounts.filter(a => a.type === 'Asset').reduce((s, a) => s + Math.max(0, b[a.id]), 0))}</td></tr>
        <tr><th colspan="2">Liabilities</th></tr>
        ${db.accounts.filter(a => a.type === 'Liability').map(a => b[a.id] ? `<tr><td>${a.id} ${a.name}</td><td class="text-right">${fmt(b[a.id])}</td></tr>` : '').join('')}
        <tr><th colspan="2">Equity</th></tr>
        ${db.accounts.filter(a => a.type === 'Equity').map(a => `<tr><td>${a.id} ${a.name}</td><td class="text-right">${fmt(b[a.id] + ni)}</td></tr>`).join('')}
        </tbody></table></div>
      <div class="card print"><h2 class="card-title">Cash Flow (indirect, simplified)</h2>
        <table><tbody>
        <tr><td>Net Income</td><td class="text-right">${fmt(ni)}</td></tr>
        <tr><td>+ Depreciation (non-cash)</td><td class="text-right">${fmt(dep)}</td></tr>
        <tr><td>− Change in AR</td><td class="text-right">${fmt(-dAR)}</td></tr>
        <tr><td>+ Change in AP</td><td class="text-right">${fmt(dAP)}</td></tr>
        <tr class="total"><td>Cash from Operations</td><td class="text-right">${fmt(cfOps)}</td></tr>
        </tbody></table>
        <p class="hint">Reconciles ending Cash to bank-rec adjusted balance: ~${fmt((b['1000'] || 0))}</p></div>
      <div class="card print"><h2 class="card-title">AR Aging</h2>
        <table><thead><tr><th>Bucket</th><th class="text-right">Amount</th></tr></thead><tbody>
        <tr class="aging green"><td>0–30 days</td><td class="text-right">${fmt(695000)}</td></tr>
        <tr class="aging yellow"><td>31–60 days</td><td class="text-right">${fmt(190000)}</td></tr>
        <tr class="aging orange"><td>61–90 days</td><td class="text-right">${fmt(78500)}</td></tr>
        <tr class="aging red"><td>90+ days</td><td class="text-right">${fmt(34200)}</td></tr>
        <tr class="total"><td>Total</td><td class="text-right">${fmt(997700)}</td></tr>
        </tbody></table>
        <p class="hint">TeleCom Builders carry the 90+ bucket — dunning letter this week.</p></div>
    </div>`;
}

function renderBankRec() {
  const acct = '1000';
  const lines = [];
  db.journal.forEach((je, jeIdx) => {
    je.lines.forEach((l, lIdx) => {
      if (l.account === acct) {
        lines.push({ je, jeIdx, l, lIdx });
      }
    });
  });

  return `<div class="card">
    <div class="card-actions">
      <input type="number" id="stmt-bal" placeholder="Statement Ending Balance" step="0.01" class="form-input" style="width:200px; display:inline-block; margin-right: 10px;">
      <button class="btn primary" onclick="finishBankRec()">Finish Now</button>
    </div>
    <h2 class="card-title">Bank Reconciliation - ${acctName(acct)}</h2>
    <div class="rec-summary" style="margin: 20px 0; display:flex; gap: 20px; font-weight:bold; font-size: 1.1em;">
      <div>Statement Balance: <span id="rec-stmt-disp">$0.00</span></div>
      <div>Cleared Balance: <span id="rec-clr-disp">$0.00</span></div>
      <div>Difference: <span id="rec-diff-disp">$0.00</span></div>
    </div>
    <table class="je-table">
      <thead><tr><th style="width: 40px"><input type="checkbox" onchange="toggleAllRec(this)"></th><th>Date</th><th>Memo</th><th class="text-right">Deposit</th><th class="text-right">Payment</th></tr></thead>
      <tbody id="rec-lines">
      ${lines.reverse().map(item => `
        <tr>
          <td><input type="checkbox" class="rec-cb" data-je="${item.jeIdx}" data-l="${item.lIdx}" ${item.l.cleared ? 'checked' : ''} onchange="updateRecTotals()"></td>
          <td>${item.je.date}</td>
          <td>${item.je.memo}</td>
          <td class="text-right">${item.l.debit ? fmt(item.l.debit) : ''}</td>
          <td class="text-right">${item.l.credit ? fmt(item.l.credit) : ''}</td>
        </tr>
      `).join('') || '<tr><td colspan="5">No transactions found for this account.</td></tr>'}
      </tbody>
    </table>
  </div>`;
}

function toggleAllRec(cb) {
  document.querySelectorAll('.rec-cb').forEach(c => { c.checked = cb.checked; });
  updateRecTotals();
}

function updateRecTotals() {
  const acct = '1000';
  let clearedBal = 340000; // Starting/opening balance for Skarion 1000 Operating Checking
  let sum = 0;
  document.querySelectorAll('.rec-cb:checked').forEach(c => {
    const jeIdx = c.dataset.je, lIdx = c.dataset.l;
    const l = db.journal[jeIdx].lines[lIdx];
    sum += (l.debit || 0) - (l.credit || 0);
  });
  clearedBal += sum;
  document.getElementById('rec-clr-disp').innerText = fmt(clearedBal);
  
  const stmtBal = parseFloat(document.getElementById('stmt-bal').value) || 0;
  const diff = stmtBal - clearedBal;
  document.getElementById('rec-diff-disp').innerText = fmt(diff);
  if (Math.abs(diff) < 0.01 && stmtBal !== 0) {
    document.getElementById('rec-diff-disp').style.color = '#10b981'; // Green
  } else {
    document.getElementById('rec-diff-disp').style.color = '#ef4444'; // Red
  }
}

function finishBankRec() {
  const diffStr = document.getElementById('rec-diff-disp').innerText.replace(/[^0-9.-]+/g,"");
  const diff = parseFloat(diffStr) || 0;
  const stmtBal = parseFloat(document.getElementById('stmt-bal').value) || 0;
  
  if (stmtBal === 0) {
    alert("Please enter the Statement Ending Balance first.");
    return;
  }
  
  if (Math.abs(diff) > 0.01) {
    alert("Difference must be zero before you can finish reconciliation.");
    return;
  }
  
  // Save cleared status
  document.querySelectorAll('.rec-cb').forEach(c => {
    const jeIdx = c.dataset.je, lIdx = c.dataset.l;
    db.journal[jeIdx].lines[lIdx].cleared = c.checked;
  });
  saveDB();
  toast('Bank reconciliation completed successfully.');
}

function renderView(viewId) {
  const area = document.getElementById('content-area'); const title = document.getElementById('view-title');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.dataset.view === viewId));
  let html = ''; let t = 'Dashboard';
  if (viewId === 'dashboard') { t = 'Dashboard'; html = renderDashboard(); }
  else if (viewId === 'coa') { t = 'Chart of Accounts'; html = renderCOA(); }
  else if (viewId === 'bills') { t = 'Expenses (Bills)'; html = renderBills(); }
  else if (viewId === 'payments') { t = 'Sales (Payments)'; html = renderPayments(); }
  else if (viewId === 'journal') { t = 'Journal Entries'; html = renderJournal(); }
  else if (viewId === 'reports') { t = 'Reports'; html = renderReports(); }
  else if (viewId === 'bankrec') { t = 'Bank Reconciliation'; html = renderBankRec(); }
  title.innerText = t; area.innerHTML = html;
  
  if (viewId === 'bankrec') {
    const sb = document.getElementById('stmt-bal');
    if (sb) sb.addEventListener('input', () => {
      document.getElementById('rec-stmt-disp').innerText = fmt(parseFloat(sb.value) || 0);
      updateRecTotals();
    });
    updateRecTotals();
  }
  
  animateCounters(area);
}

// ---- JOURNAL ENTRY MODAL ----
function openModal() { document.getElementById('je-modal').classList.add('open'); document.getElementById('je-date').value = '2026-01-31'; document.getElementById('je-memo').value = ''; document.getElementById('je-error').innerText = ''; document.getElementById('je-lines').innerHTML = ''; addModalLine(); addModalLine(); updateModalTotals(); }
function closeModal() { document.getElementById('je-modal').classList.remove('open'); }
function addModalLine() { const tr = document.createElement('tr'); const opts = db.accounts.map(a => `<option value="${a.id}">${a.id} - ${a.name}</option>`).join(''); tr.innerHTML = `<td><select class="je-acct"><option value="">-- select --</option>${opts}</select></td><td><input type="number" class="je-dr" step="0.01" placeholder="0.00" oninput="updateModalTotals()"></td><td><input type="number" class="je-cr" step="0.01" placeholder="0.00" oninput="updateModalTotals()"></td><td><button class="btn-danger" onclick="this.closest('tr').remove(); updateModalTotals()">🗑</button></td>`; document.getElementById('je-lines').appendChild(tr); }
function updateModalTotals() { let dr = 0, cr = 0; document.querySelectorAll('#je-lines tr').forEach(tr => { dr += parseFloat(tr.querySelector('.je-dr').value) || 0; cr += parseFloat(tr.querySelector('.je-cr').value) || 0; }); document.getElementById('je-total-dr').innerText = fmt(dr); document.getElementById('je-total-cr').innerText = fmt(cr); return { dr, cr }; }
function saveJournalEntry() {
  const date = document.getElementById('je-date').value, memo = document.getElementById('je-memo').value, err = document.getElementById('je-error');
  if (!date) return err.innerText = 'Date is required.';
  const lines = []; document.querySelectorAll('#je-lines tr').forEach(tr => { const a = tr.querySelector('.je-acct').value, d = parseFloat(tr.querySelector('.je-dr').value) || 0, c = parseFloat(tr.querySelector('.je-cr').value) || 0; if (a && (d || c)) lines.push({ account: a, debit: d, credit: c }); });
  if (lines.length < 2) return err.innerText = 'Entry must have at least 2 lines.';
  const { dr, cr } = updateModalTotals(); if (Math.abs(dr - cr) > 0.01) return err.innerText = 'Debits must equal credits.'; if (dr === 0) return err.innerText = 'Entry must have a value greater than 0.';
  postJE(date, memo, lines); closeModal(); toast('Entry posted'); renderView(document.querySelector('.nav-links a.active').dataset.view);
}

// ---- BILL PANEL (Enter Bills / Record Expense) ----
function openBillPanel() {
  document.getElementById('bill-overlay').classList.add('open'); document.getElementById('bill-panel').classList.add('open');
  document.getElementById('bill-vendor').innerHTML = VENDORS.map(v => `<option value="${v.id}" data-acct="${v.acct}">${v.name}</option>`).join('');
  const v = VENDORS[0]; document.getElementById('bill-account').value = v.acct;
  populateBillAccounts(); document.getElementById('bill-amount').value = ''; document.getElementById('bill-ref').value = ''; document.getElementById('bill-error').innerText = '';
}
function populateBillAccounts() { const cur = document.getElementById('bill-vendor').value; const v = VENDORS.find(x => x.id === cur); const exp = db.accounts.filter(a => a.type === 'Expense' || a.type === 'Asset'); document.getElementById('bill-account').innerHTML = exp.map(a => `<option value="${a.id}" ${v && a.id === v.acct ? 'selected' : ''}>${a.id} - ${a.name}</option>`).join(''); }
function closeBillPanel() { document.getElementById('bill-overlay').classList.remove('open'); document.getElementById('bill-panel').classList.remove('open'); }
function saveBill() {
  const v = VENDORS.find(x => x.id === document.getElementById('bill-vendor').value); const date = document.getElementById('bill-date').value; const acct = document.getElementById('bill-account').value; const ref = document.getElementById('bill-ref').value || ('Bill ' + v.name); const amt = parseFloat(document.getElementById('bill-amount').value) || 0; const err = document.getElementById('bill-error');
  if (!date) return err.innerText = 'Bill date required.'; if (amt <= 0) return err.innerText = 'Enter a positive amount.';
  postJE(date, `${ref} — ${v.name}`, [{ account: acct, debit: amt, credit: 0 }, { account: '2000', debit: 0, credit: amt }]);
  closeBillPanel(); toast('Bill posted (Dr ' + acctName(acct) + ' / Cr AP)'); renderView('bills');
}

// ---- PAYMENT PANEL (Receive Payments) ----
function openPayPanel() {
  document.getElementById('pay-overlay').classList.add('open'); document.getElementById('pay-panel').classList.add('open');
  document.getElementById('pay-customer').innerHTML = CUSTOMERS.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('pay-method').value = 'Wire'; document.getElementById('pay-amount').value = ''; document.getElementById('pay-fee').value = '0'; document.getElementById('pay-error').innerText = ''; document.getElementById('pay-note').innerText = ''; refreshInvoiceList();
}
function refreshInvoiceList() {
  const cust = document.getElementById('pay-customer').value; const sel = document.getElementById('pay-invoice');
  const opens = db.invoices.filter(i => i.cust === cust);
  sel.innerHTML = opens.length ? opens.map(i => `<option value="${i.id}" data-amt="${i.amount}">${i.id} — ${fmt(i.amount)}</option>`).join('') : '<option>(no open invoices)</option>';
  const noteEl = document.getElementById('pay-note');
  if (opens.length) { noteEl.innerText = 'Open balance: ' + fmt(opens.reduce((s, i) => s + i.amount, 0)); }
}
function closePayPanel() { document.getElementById('pay-overlay').classList.remove('open'); document.getElementById('pay-panel').classList.remove('open'); }
function savePayment() {
  const cust = document.getElementById('pay-customer').value; const invId = document.getElementById('pay-invoice').value; const method = document.getElementById('pay-method').value;
  const amt = parseFloat(document.getElementById('pay-amount').value) || 0; const fee = parseFloat(document.getElementById('pay-fee').value) || 0; const err = document.getElementById('pay-error');
  const inv = db.invoices.find(i => i.id === invId && i.cust === cust);
  if (!inv) return err.innerText = 'Select an open invoice for this customer.';
  if (amt <= 0) return err.innerText = 'Enter a positive amount.';
  const lines = [{ account: '1000', debit: amt - fee, credit: 0 }];
  if (fee > 0) lines.push({ account: '6900', debit: fee, credit: 0 });
  lines.push({ account: '1100', debit: 0, credit: amt });
  const custName = (CUSTOMERS.find(c => c.id === cust) || {}).name || cust;
  postJE('2026-01-31', `${method} payment ${inv.id} — ${custName}`, lines);
  // Short payment → leave balance open; full payment → close invoice
  if (Math.abs(amt - inv.amount) < 0.01) { db.invoices = db.invoices.filter(i => i.id !== invId); db.accounts; }
  else if (amt < inv.amount) { inv.amount -= amt; }
  else { inv.amount = 0; db.invoices = db.invoices.filter(i => i.id !== invId); }
  saveDB(); closePayPanel(); toast('Payment received (Dr Cash / Cr AR)'); renderView('payments');
}

document.addEventListener('DOMContentLoaded', () => {
  initDB();
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); renderView(e.target.closest('a').dataset.view); }));
  document.getElementById('btn-new-je').addEventListener('click', openModal);
  document.getElementById('btn-close-je').addEventListener('click', closeModal);
  document.getElementById('btn-cancel-je').addEventListener('click', closeModal);
  document.getElementById('btn-add-line').addEventListener('click', addModalLine);
  document.getElementById('btn-save-je').addEventListener('click', saveJournalEntry);
  document.getElementById('reset-data').addEventListener('click', () => { if (confirm('Reset all SkarionBooks company data? Your journal entries will be lost.')) resetDB(); });
  document.querySelector('.btn-bill').addEventListener('click', openBillPanel);
  document.querySelector('.btn-pay').addEventListener('click', openPayPanel);
  document.getElementById('bill-close').addEventListener('click', closeBillPanel); document.getElementById('bill-cancel').addEventListener('click', closeBillPanel); document.getElementById('bill-save').addEventListener('click', saveBill); document.getElementById('bill-vendor').addEventListener('change', populateBillAccounts);
  document.getElementById('pay-close').addEventListener('click', closePayPanel); document.getElementById('pay-cancel').addEventListener('click', closePayPanel); document.getElementById('pay-save').addEventListener('click', savePayment); document.getElementById('pay-customer').addEventListener('change', refreshInvoiceList);
  document.getElementById('pay-invoice').addEventListener('change', () => { const o = document.getElementById('pay-invoice').selectedOptions[0]; if (o && o.dataset.amt) document.getElementById('pay-amount').value = o.dataset.amt; });
  document.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 's') { e.preventDefault(); const m = document.getElementById('je-modal'); if (m.classList.contains('open')) saveJournalEntry(); const bp = document.getElementById('bill-panel'); if (bp.classList.contains('open')) saveBill(); const pp = document.getElementById('pay-panel'); if (pp.classList.contains('open')) savePayment(); } });
  renderView('dashboard');
});
const INITIAL_ACCOUNTS = [
  { id: '1000', name: 'Operating Checking', type: 'Asset', normal: 'debit', balance: 132500 },
  { id: '1100', name: 'Accounts Receivable', type: 'Asset', normal: 'debit', balance: 118400 },
  { id: '1200', name: 'Inventory', type: 'Asset', normal: 'debit', balance: 0 },
  { id: '1500', name: 'Fixed Assets', type: 'Asset', normal: 'debit', balance: 0 },
  { id: '1590', name: 'Accumulated Depreciation', type: 'Asset', normal: 'credit', balance: 0 },
  { id: '2000', name: 'Accounts Payable', type: 'Liability', normal: 'credit', balance: 82300 },
  { id: '2100', name: 'Sales Tax Payable', type: 'Liability', normal: 'credit', balance: 0 },
  { id: '2200', name: 'Payroll Liabilities', type: 'Liability', normal: 'credit', balance: 0 },
  { id: '2300', name: 'Accrued Expenses', type: 'Liability', normal: 'credit', balance: 0 },
  { id: '2500', name: 'Loan Payable', type: 'Liability', normal: 'credit', balance: 250000 },
  { id: '3000', name: 'Owner Equity', type: 'Equity', normal: 'credit', balance: -81400 }, // Plug to balance Jan 1
  { id: '4000', name: 'Engineering Design Revenue', type: 'Revenue', normal: 'credit', balance: 0 },
  { id: '4050', name: 'Sales Discounts', type: 'Revenue', normal: 'debit', balance: 0 },
  { id: '5000', name: 'COGS - Subcontractors', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6100', name: 'Rent Expense', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6200', name: 'Utilities Expense', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6300', name: 'Wages Expense', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6310', name: 'Employer Payroll Taxes', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6700', name: 'Depreciation Expense', type: 'Expense', normal: 'debit', balance: 0 },
  { id: '6800', name: 'Interest Expense', type: 'Expense', normal: 'debit', balance: 0 },
];

let db = {
  accounts: [],
  journal: []
};

function initDB() {
  const saved = localStorage.getItem('skarionbooks_db');
  if (saved) {
    db = JSON.parse(saved);
  } else {
    resetDB();
  }
}

function resetDB() {
  db = {
    accounts: JSON.parse(JSON.stringify(INITIAL_ACCOUNTS)),
    journal: []
  };
  saveDB();
  renderView('dashboard');
}

function saveDB() {
  localStorage.setItem('skarionbooks_db', JSON.stringify(db));
}

function formatMoney(num) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

function getBalances() {
  const balances = {};
  db.accounts.forEach(a => balances[a.id] = a.balance);

  db.journal.forEach(je => {
    je.lines.forEach(line => {
      const acct = db.accounts.find(a => a.id === line.account);
      if (!acct) return;
      if (acct.normal === 'debit') {
        balances[line.account] += (line.debit - line.credit);
      } else {
        balances[line.account] += (line.credit - line.debit);
      }
    });
  });
  return balances;
}

// ---- VIEWS ----
function renderDashboard() {
  const bals = getBalances();
  const cash = bals['1000'] || 0;
  const ar = bals['1100'] || 0;
  const ap = bals['2000'] || 0;
  
  // Net Income = Revenue - Expenses
  let revenue = 0;
  let expenses = 0;
  db.accounts.forEach(a => {
    if (a.type === 'Revenue') revenue += bals[a.id];
    if (a.type === 'Expense') expenses += bals[a.id];
  });
  const netIncome = revenue - expenses;

  return `
    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">Operating Checking</div>
        <div class="metric-value">${formatMoney(cash)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Accounts Receivable</div>
        <div class="metric-value">${formatMoney(ar)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Accounts Payable</div>
        <div class="metric-value">${formatMoney(ap)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Net Income</div>
        <div class="metric-value">${formatMoney(netIncome)}</div>
      </div>
    </div>
    
    <div class="card">
      <h2 class="card-title">Recent Transactions</h2>
      <table>
        <thead><tr><th>Date</th><th>Memo</th><th>Amount</th></tr></thead>
        <tbody>
          ${db.journal.slice().reverse().slice(0, 5).map(je => `
            <tr>
              <td>${je.date}</td>
              <td>${je.memo || 'Journal Entry'}</td>
              <td>${formatMoney(je.lines.reduce((s, l) => s + l.debit, 0))}</td>
            </tr>
          `).join('') || '<tr><td colspan="3">No transactions yet.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function renderChartOfAccounts() {
  const bals = getBalances();
  return `
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Type</th>
            <th class="text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          ${db.accounts.map(a => `
            <tr>
              <td>${a.id}</td>
              <td>${a.name}</td>
              <td>${a.type}</td>
              <td class="text-right">${formatMoney(bals[a.id] || 0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderJournal() {
  return `
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Memo</th>
            <th>Account</th>
            <th class="text-right">Debit</th>
            <th class="text-right">Credit</th>
          </tr>
        </thead>
        <tbody>
          ${db.journal.slice().reverse().map(je => {
            return je.lines.map((line, i) => `
              <tr>
                <td>${i === 0 ? je.date : ''}</td>
                <td>${i === 0 ? je.memo : ''}</td>
                <td>${db.accounts.find(a => a.id === line.account)?.name || line.account}</td>
                <td class="text-right">${line.debit ? formatMoney(line.debit) : ''}</td>
                <td class="text-right">${line.credit ? formatMoney(line.credit) : ''}</td>
              </tr>
            `).join('');
          }).join('') || '<tr><td colspan="5">No journal entries.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function renderReports() {
  const bals = getBalances();
  
  const renderSection = (title, types) => {
    let total = 0;
    const rows = db.accounts.filter(a => types.includes(a.type)).map(a => {
      const b = bals[a.id];
      total += b;
      return b !== 0 ? `<tr><td>${a.id} ${a.name}</td><td class="text-right">${formatMoney(b)}</td></tr>` : '';
    }).join('');
    
    return `
      <tr><th colspan="2" style="background:var(--surface-color);color:var(--primary-color);">${title}</th></tr>
      ${rows}
      <tr><td style="font-weight:600">Total ${title}</td><td class="text-right" style="font-weight:600">${formatMoney(total)}</td></tr>
    `;
  };

  return `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 32px;">
      <div class="card">
        <h2 class="card-title">Balance Sheet</h2>
        <table>
          <tbody>
            ${renderSection('Assets', ['Asset'])}
            ${renderSection('Liabilities', ['Liability'])}
            ${renderSection('Equity', ['Equity'])}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h2 class="card-title">Profit & Loss</h2>
        <table>
          <tbody>
            ${renderSection('Revenue', ['Revenue'])}
            ${renderSection('Expenses', ['Expense'])}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderView(viewId) {
  const area = document.getElementById('content-area');
  const title = document.getElementById('view-title');
  
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.view === viewId);
  });

  if (viewId === 'dashboard') { title.innerText = 'Dashboard'; area.innerHTML = renderDashboard(); }
  else if (viewId === 'coa') { title.innerText = 'Chart of Accounts'; area.innerHTML = renderChartOfAccounts(); }
  else if (viewId === 'journal') { title.innerText = 'Journal Entries'; area.innerHTML = renderJournal(); }
  else if (viewId === 'reports') { title.innerText = 'Reports'; area.innerHTML = renderReports(); }
}

// ---- MODAL LOGIC ----
function openModal() {
  document.getElementById('je-modal').classList.add('open');
  document.getElementById('je-date').value = '2026-01-31';
  document.getElementById('je-memo').value = '';
  document.getElementById('je-error').innerText = '';
  document.getElementById('je-lines').innerHTML = '';
  addModalLine();
  addModalLine();
  updateModalTotals();
}

function closeModal() {
  document.getElementById('je-modal').classList.remove('open');
}

function addModalLine() {
  const tr = document.createElement('tr');
  const opts = db.accounts.map(a => `<option value="${a.id}">${a.id} - ${a.name}</option>`).join('');
  tr.innerHTML = `
    <td><select class="je-acct"><option value="">-- select account --</option>${opts}</select></td>
    <td><input type="number" class="je-dr" step="0.01" placeholder="0.00" onchange="updateModalTotals()"></td>
    <td><input type="number" class="je-cr" step="0.01" placeholder="0.00" onchange="updateModalTotals()"></td>
    <td><button class="btn-danger" onclick="this.closest('tr').remove(); updateModalTotals()">🗑</button></td>
  `;
  document.getElementById('je-lines').appendChild(tr);
}

function updateModalTotals() {
  let dr = 0, cr = 0;
  document.querySelectorAll('#je-lines tr').forEach(tr => {
    dr += parseFloat(tr.querySelector('.je-dr').value) || 0;
    cr += parseFloat(tr.querySelector('.je-cr').value) || 0;
  });
  document.getElementById('je-total-dr').innerText = formatMoney(dr);
  document.getElementById('je-total-cr').innerText = formatMoney(cr);
  return { dr, cr };
}

function saveJournalEntry() {
  const date = document.getElementById('je-date').value;
  const memo = document.getElementById('je-memo').value;
  const err = document.getElementById('je-error');
  
  if (!date) return err.innerText = 'Date is required.';
  
  const lines = [];
  document.querySelectorAll('#je-lines tr').forEach(tr => {
    const account = tr.querySelector('.je-acct').value;
    const debit = parseFloat(tr.querySelector('.je-dr').value) || 0;
    const credit = parseFloat(tr.querySelector('.je-cr').value) || 0;
    if (account && (debit || credit)) lines.push({ account, debit, credit });
  });

  if (lines.length < 2) return err.innerText = 'Entry must have at least 2 lines.';
  
  const { dr, cr } = updateModalTotals();
  if (Math.abs(dr - cr) > 0.01) return err.innerText = 'Debits must equal credits.';
  if (dr === 0) return err.innerText = 'Entry must have a value greater than 0.';

  db.journal.push({ date, memo, lines });
  saveDB();
  closeModal();
  renderView(document.querySelector('.nav-links a.active').dataset.view);
}

// ---- INIT EVENTS ----
document.addEventListener('DOMContentLoaded', () => {
  initDB();
  
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      renderView(e.target.dataset.view);
    });
  });

  document.getElementById('btn-new-je').addEventListener('click', openModal);
  document.getElementById('btn-close-je').addEventListener('click', closeModal);
  document.getElementById('btn-cancel-je').addEventListener('click', closeModal);
  document.getElementById('btn-add-line').addEventListener('click', addModalLine);
  document.getElementById('btn-save-je').addEventListener('click', saveJournalEntry);
  
  document.getElementById('reset-data').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all company data? All your journal entries will be lost.')) {
      resetDB();
    }
  });
});

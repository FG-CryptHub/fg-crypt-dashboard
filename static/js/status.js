import { apiGet } from "./api.js";
import { fmtUSD, fmtPct, fmtAmount, fmtDateTime, signedClass } from "./format.js";

const els = {
  total: document.getElementById("kpi-total"),
  ch24: document.getElementById("kpi-24h"),
  pnl: document.getElementById("kpi-pnl"),
  xirr: document.getElementById("kpi-xirr"),
  updated: document.getElementById("last-updated"),
  holdingsBody: document.querySelector("#holdings-table tbody"),
  wallets: document.getElementById("wallet-list"),
  status: document.getElementById("data-status"),
};

function setKPI(el, value, fmt) {
  if (!el) return;
  el.textContent = fmt(value);
  el.classList.remove("pos", "neg");
  const cls = signedClass(value);
  if (cls) el.classList.add(cls);
}

async function load() {
  try {
    els.status && (els.status.textContent = "Loading…");

    const s = await apiGet("/v1/status");

    setKPI(els.total, s.totalValue, fmtUSD);
    setKPI(els.ch24, s.change24h, fmtPct);
    setKPI(els.pnl, s.pnl, fmtUSD);
    setKPI(els.xirr, s.xirr, fmtPct);

    if (els.updated) els.updated.textContent = `Updated ${fmtDateTime(s.updatedAt)}`;

    if (els.holdingsBody) {
      els.holdingsBody.innerHTML = (s.holdings ?? [])
        .map(
          (h) => `
          <tr>
            <td>${h.asset}</td>
            <td class="num">${fmtAmount(h.amount)}</td>
            <td class="num">${fmtUSD(h.value)}</td>
            <td class="num">${fmtPct(h.weight)}</td>
          </tr>`,
        )
        .join("") || `<tr><td colspan="4" class="loading">No holdings.</td></tr>`;
    }

    if (els.wallets) {
      els.wallets.innerHTML = (s.wallets ?? [])
        .map((w) => `<li><strong>${w.name}</strong><span>${fmtUSD(w.value)}</span></li>`)
        .join("") || `<li class="loading">No wallets.</li>`;
    }

    els.status && (els.status.textContent = `OK`);
  } catch (e) {
    console.error(e);
    els.status && (els.status.textContent = `Error: ${e.message}`);
  }
}

window.addEventListener("auth:ready", load);
document.getElementById("refresh")?.addEventListener("click", load);

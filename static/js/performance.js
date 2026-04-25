import { apiGet } from "./api.js";
import { fmtUSD, fmtPct, fmtDate, signedClass } from "./format.js";

const els = {
  ytd: document.getElementById("xirr-ytd"),
  y1: document.getElementById("xirr-1y"),
  y3: document.getElementById("xirr-3y"),
  all: document.getElementById("xirr-all"),
  chart: document.getElementById("value-chart"),
  cashflowBody: document.querySelector("#cashflow-table tbody"),
  status: document.getElementById("data-status"),
};

function setKPI(el, value) {
  if (!el) return;
  el.textContent = fmtPct(value);
  el.classList.remove("pos", "neg");
  const cls = signedClass(value);
  if (cls) el.classList.add(cls);
}

async function load() {
  try {
    els.status && (els.status.textContent = "Loading…");

    const p = await apiGet("/v1/performance");

    setKPI(els.ytd, p.xirr?.ytd);
    setKPI(els.y1, p.xirr?.["1y"]);
    setKPI(els.y3, p.xirr?.["3y"]);
    setKPI(els.all, p.xirr?.all);

    if (els.chart) {
      const points = p.history ?? [];
      els.chart.textContent = points.length
        ? `${points.length} data points — chart rendering TBD`
        : "No historical data yet.";
    }

    if (els.cashflowBody) {
      els.cashflowBody.innerHTML = (p.cashflow ?? [])
        .map(
          (c) => `
          <tr>
            <td>${fmtDate(c.date)}</td>
            <td>${c.type}</td>
            <td class="num">${fmtUSD(c.amount)}</td>
          </tr>`,
        )
        .join("") || `<tr><td colspan="3" class="loading">No cash flow yet.</td></tr>`;
    }

    els.status && (els.status.textContent = "OK");
  } catch (e) {
    console.error(e);
    els.status && (els.status.textContent = `Error: ${e.message}`);
  }
}

window.addEventListener("auth:ready", load);

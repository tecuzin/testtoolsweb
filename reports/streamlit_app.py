import json
from pathlib import Path

import pandas as pd
import streamlit as st


ROOT = Path(__file__).resolve().parent
REPORT_FILE = ROOT / "test-report.json"


def load_report() -> dict:
  if not REPORT_FILE.exists():
    return {}
  return json.loads(REPORT_FILE.read_text(encoding="utf-8"))


def ratio(value: float) -> float:
  return max(0.0, min(value / 100.0, 1.0))


st.set_page_config(page_title="Agri Tests Report", layout="wide")
st.title("Rapport de tests consolide")

report = load_report()

if not report:
  st.warning(
    "Aucun rapport trouve. Lance d'abord `npm run test:all:report` puis recharge."
  )
  st.stop()

coverage = report.get("coverage", {})
backend = coverage.get("backend", {}).get("statements", {})
frontend = coverage.get("frontend", {}).get("statements", {})
frontend_components = coverage.get("frontendComponents", {})
frontend_components_statements = frontend_components.get("statements", {})
frontend_components_files = frontend_components.get("files", {})
consolidated = coverage.get("consolidated", {}).get("statements", {})
e2e = report.get("e2e", {})
perf = report.get("perf", {})

st.caption(f"Genere le: {report.get('generatedAt', 'N/A')}")

col1, col2, col3 = st.columns(3)
col1.metric("Couverture backend", f"{backend.get('pct', 0):.2f}%")
col2.metric("Couverture frontend", f"{frontend.get('pct', 0):.2f}%")
col3.metric("Couverture consolidee (code)", f"{consolidated.get('pct', 0):.2f}%")

st.subheader("Couverture code - vue visuelle")
coverage_df = pd.DataFrame(
  {
    "scope": ["Backend", "Frontend", "Consolidee"],
    "coverage_pct": [
      float(backend.get("pct", 0)),
      float(frontend.get("pct", 0)),
      float(consolidated.get("pct", 0)),
    ],
    "covered_lines": [
      int(backend.get("covered", 0)),
      int(frontend.get("covered", 0)),
      int(consolidated.get("covered", 0)),
    ],
    "total_lines": [
      int(backend.get("total", 0)),
      int(frontend.get("total", 0)),
      int(consolidated.get("total", 0)),
    ],
  }
).set_index("scope")

vis_left, vis_right = st.columns(2)
with vis_left:
  st.caption("Pourcentage de couverture par scope")
  st.bar_chart(coverage_df[["coverage_pct"]])
with vis_right:
  st.caption("Lignes couvertes vs lignes totales")
  st.bar_chart(coverage_df[["covered_lines", "total_lines"]])

progress_cols = st.columns(3)
progress_cols[0].progress(
  ratio(float(backend.get("pct", 0))), text="Backend"
)
progress_cols[1].progress(
  ratio(float(frontend.get("pct", 0))), text="Frontend"
)
progress_cols[2].progress(
  ratio(float(consolidated.get("pct", 0))), text="Consolidee"
)

st.subheader("Composants Angular")
components_col1, components_col2, components_col3 = st.columns(3)
components_col1.metric(
  "Couverture composants",
  f"{float(frontend_components_statements.get('pct', 0)):.2f}%"
)
components_col2.metric(
  "Fichiers composants couverts",
  f"{int(frontend_components_files.get('covered', 0))}/{int(frontend_components_files.get('total', 0))}"
)
components_col3.metric(
  "Statements composants",
  f"{int(frontend_components_statements.get('covered', 0))}/{int(frontend_components_statements.get('total', 0))}"
)

components_chart_df = pd.DataFrame(
  {
    "metric": ["Composants Angular"],
    "covered_statements": [int(frontend_components_statements.get("covered", 0))],
    "uncovered_statements": [
      max(
        int(frontend_components_statements.get("total", 0))
        - int(frontend_components_statements.get("covered", 0)),
        0
      )
    ],
  }
).set_index("metric")
st.bar_chart(components_chart_df)
st.progress(
  ratio(float(frontend_components_statements.get("pct", 0))),
  text="Progression couverture composants Angular"
)

st.divider()

left, right = st.columns(2)

with left:
  st.subheader("E2E")
  scenarios = e2e.get("scenarios", {})
  steps = e2e.get("steps", {})
  e2e_df = pd.DataFrame(
    {
      "type": ["Scenarios", "Steps"],
      "passed": [int(scenarios.get("passed", 0)), int(steps.get("passed", 0))],
      "failed": [int(scenarios.get("failed", 0)), int(steps.get("failed", 0))],
    }
  ).set_index("type")
  st.caption("Resultats passes / failed")
  st.bar_chart(e2e_df)

  scenarios_total = int(scenarios.get("total", 0))
  steps_total = int(steps.get("total", 0))
  scenarios_success = (
    int(scenarios.get("passed", 0)) / scenarios_total if scenarios_total else 0.0
  )
  steps_success = int(steps.get("passed", 0)) / steps_total if steps_total else 0.0
  st.progress(scenarios_success, text="Succes scenarios")
  st.progress(steps_success, text="Succes steps")

  st.write(
    {
      "scenarios_total": scenarios.get("total", 0),
      "scenarios_passed": scenarios.get("passed", 0),
      "scenarios_failed": scenarios.get("failed", 0),
      "steps_total": steps.get("total", 0),
      "steps_passed": steps.get("passed", 0),
      "steps_failed": steps.get("failed", 0),
    }
  )

with right:
  st.subheader("Performance (k6)")
  thresholds = perf.get("thresholds", {})
  checks = perf.get("checks", {})
  perf_df = pd.DataFrame(
    {
      "type": ["Thresholds", "Checks"],
      "passed": [int(thresholds.get("passed", 0)), int(checks.get("passes", 0))],
      "failed": [int(thresholds.get("failed", 0)), int(checks.get("fails", 0))],
    }
  ).set_index("type")
  st.caption("Resultats performance passes / failed")
  st.bar_chart(perf_df)
  st.progress(
    ratio(float(checks.get("passRate", 0))), text="Pass rate checks k6"
  )

  st.write(
    {
      "thresholds_total": thresholds.get("total", 0),
      "thresholds_passed": thresholds.get("passed", 0),
      "thresholds_failed": thresholds.get("failed", 0),
      "checks_passes": checks.get("passes", 0),
      "checks_fails": checks.get("fails", 0),
      "checks_pass_rate": f"{checks.get('passRate', 0):.2f}%",
    }
  )

st.divider()
with st.expander("JSON complet"):
  st.json(report)

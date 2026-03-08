import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional


ROOT = Path(__file__).resolve().parent.parent
REPORTS_DIR = ROOT / "reports"


def load_json(path: Path) -> Any:
  if not path.exists():
    return None
  with path.open("r", encoding="utf-8") as file:
    return json.load(file)


def coverage_payload(summary: Optional[dict[str, Any]]) -> dict[str, Any]:
  if not summary:
    return {
      "available": False,
      "statements": {"pct": 0.0, "covered": 0, "total": 0}
    }

  statements = summary.get("total", {}).get("statements", {})
  return {
    "available": True,
    "statements": {
      "pct": float(statements.get("pct", 0.0)),
      "covered": int(statements.get("covered", 0)),
      "total": int(statements.get("total", 0))
    }
  }


def component_coverage_payload(summary: Optional[dict[str, Any]]) -> dict[str, Any]:
  if not summary:
    return {
      "available": False,
      "files": {"total": 0, "covered": 0},
      "statements": {"pct": 0.0, "covered": 0, "total": 0}
    }

  component_entries = []
  for key, value in summary.items():
    if key == "total":
      continue
    if isinstance(key, str) and key.endswith(".component.ts"):
      component_entries.append(value)

  if not component_entries:
    return {
      "available": False,
      "files": {"total": 0, "covered": 0},
      "statements": {"pct": 0.0, "covered": 0, "total": 0}
    }

  total_statements = 0
  covered_statements = 0
  covered_files = 0
  for entry in component_entries:
    statements = entry.get("statements", {})
    total = int(statements.get("total", 0))
    covered = int(statements.get("covered", 0))
    total_statements += total
    covered_statements += covered
    if covered > 0:
      covered_files += 1

  pct = (
    (covered_statements / total_statements) * 100.0
    if total_statements
    else 0.0
  )
  return {
    "available": True,
    "files": {"total": len(component_entries), "covered": covered_files},
    "statements": {
      "pct": round(pct, 2),
      "covered": covered_statements,
      "total": total_statements
    }
  }


def parse_e2e(cucumber_report: Any) -> dict[str, Any]:
  if not cucumber_report:
    return {
      "available": False,
      "scenarios": {"total": 0, "passed": 0, "failed": 0},
      "steps": {"total": 0, "passed": 0, "failed": 0}
    }

  scenarios_total = 0
  scenarios_passed = 0
  scenarios_failed = 0
  steps_total = 0
  steps_passed = 0
  steps_failed = 0

  for feature in cucumber_report:
    for scenario in feature.get("elements", []):
      scenario_type = scenario.get("type")
      if scenario_type != "scenario":
        continue
      scenarios_total += 1

      scenario_failed = False
      for step in scenario.get("steps", []):
        result = step.get("result", {})
        status = result.get("status", "unknown")
        steps_total += 1
        if status == "passed":
          steps_passed += 1
        else:
          steps_failed += 1
          scenario_failed = True

      if scenario_failed:
        scenarios_failed += 1
      else:
        scenarios_passed += 1

  return {
    "available": True,
    "scenarios": {
      "total": scenarios_total,
      "passed": scenarios_passed,
      "failed": scenarios_failed
    },
    "steps": {
      "total": steps_total,
      "passed": steps_passed,
      "failed": steps_failed
    }
  }


def parse_perf(k6_summary: Optional[dict[str, Any]]) -> dict[str, Any]:
  if not k6_summary:
    return {
      "available": False,
      "thresholds": {"total": 0, "passed": 0, "failed": 0},
      "checks": {"passes": 0, "fails": 0, "passRate": 0.0}
    }

  metrics = k6_summary.get("metrics", {})
  threshold_results = {}

  failed_rate = float(metrics.get("http_req_failed", {}).get("value", 1.0))
  p95_duration = float(metrics.get("http_req_duration", {}).get("p(95)", 999999))

  threshold_results["http_req_failed<0.02"] = failed_rate < 0.02
  threshold_results["http_req_duration_p95<500"] = p95_duration < 500.0

  threshold_total = len(threshold_results)
  threshold_passed = sum(1 for is_ok in threshold_results.values() if is_ok)
  threshold_failed = threshold_total - threshold_passed

  checks_metric = metrics.get("checks", {})
  checks_passes = int(checks_metric.get("passes", 0))
  checks_fails = int(checks_metric.get("fails", 0))
  checks_total = checks_passes + checks_fails
  checks_rate = (checks_passes / checks_total * 100.0) if checks_total else 0.0

  return {
    "available": True,
    "thresholds": {
      "total": threshold_total,
      "passed": threshold_passed,
      "failed": threshold_failed,
      "details": threshold_results
    },
    "checks": {
      "passes": checks_passes,
      "fails": checks_fails,
      "passRate": round(checks_rate, 2)
    }
  }


def main() -> None:
  frontend_summary = load_json(REPORTS_DIR / "frontend" / "coverage-summary.json")
  backend_cov = coverage_payload(
    load_json(REPORTS_DIR / "backend" / "coverage-summary.json")
  )
  frontend_cov = coverage_payload(frontend_summary)
  frontend_component_cov = component_coverage_payload(frontend_summary)

  backend_total = backend_cov["statements"]["total"]
  frontend_total = frontend_cov["statements"]["total"]
  consolidated_total = backend_total + frontend_total
  consolidated_covered = (
    backend_cov["statements"]["covered"] + frontend_cov["statements"]["covered"]
  )
  consolidated_pct = (
    (consolidated_covered / consolidated_total) * 100.0
    if consolidated_total
    else 0.0
  )

  e2e = parse_e2e(load_json(REPORTS_DIR / "e2e" / "cucumber-report.json"))
  perf = parse_perf(load_json(REPORTS_DIR / "perf" / "k6-summary.json"))

  payload = {
    "generatedAt": datetime.now(timezone.utc).isoformat(),
    "coverage": {
      "backend": backend_cov,
      "frontend": frontend_cov,
      "frontendComponents": frontend_component_cov,
      "consolidated": {
        "available": consolidated_total > 0,
        "statements": {
          "pct": round(consolidated_pct, 2),
          "covered": consolidated_covered,
          "total": consolidated_total
        }
      }
    },
    "e2e": e2e,
    "perf": perf
  }

  REPORTS_DIR.mkdir(parents=True, exist_ok=True)
  out_file = REPORTS_DIR / "test-report.json"
  out_file.write_text(json.dumps(payload, indent=2), encoding="utf-8")
  print(f"Wrote {out_file}")


if __name__ == "__main__":
  main()

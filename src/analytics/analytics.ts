import type { HTMLReport } from "../types";

export type TestOutcome = "passed" | "failed" | "flaky" | "skipped";

// Matches the stat-card colours (Amsterdam feedback tokens) on the dashboard.
export const outcomeColors: Record<TestOutcome, string> = {
  passed: "#00893c",
  failed: "#ec0000",
  flaky: "#ff9100",
  skipped: "#009de6",
};

export type AnalyticsTest = {
  id: string;
  title: string;
  fileName: string;
  projectName: string;
  application: string;
  strategy: string;
  browser: string;
  outcome: TestOutcome;
  duration: number;
  attempts: number;
  retries: number;
  attemptDurations: number[];
  attemptStatuses: string[];
};

export type OutcomeCounts = {
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
};

export type SuiteSummary = OutcomeCounts & {
  name: string;
  total: number;
};

export type AnalyticsData = {
  total: number;
  passRate: number;
  counts: OutcomeCounts;
  tests: AnalyticsTest[];
  suites: SuiteSummary[];
};

type RawTest = {
  title?: string;
  testId?: string;
  id?: string;
  fileName?: string;
  projectName?: string;
  application?: string;
  strategy?: string;
  browser?: string;
  outcome?: string;
  duration?: number;
  results?: Array<{
    status?: string;
    duration?: number;
  }>;
};

function normalizeOutcome(outcome?: string): TestOutcome {
  switch (outcome?.toLowerCase()) {
    case "expected":
    case "passed":
      return "passed";
    case "unexpected":
    case "failed":
      return "failed";
    case "flaky":
      return "flaky";
    case "skipped":
      return "skipped";
    default:
      return "skipped";
  }
}

export function buildAnalytics(report: HTMLReport): AnalyticsData {
  const source = report as unknown as {
    files?: Array<{
      fileName?: string;
      tests?: RawTest[];
    }>;
  };

  const tests: AnalyticsTest[] = (source.files ?? []).flatMap((file) =>
    (file.tests ?? []).map((test, index) => {
      const results = test.results ?? [];
      const attemptDurations = results.map((result) => result.duration ?? 0);

      const duration =
        typeof test.duration === "number"
          ? test.duration
          : attemptDurations.reduce((sum, value) => sum + value, 0);

      return {
        id: test.testId ?? test.id ?? `${file.fileName ?? "test"}-${index}`,
        title: test.title ?? "Untitled test",
        fileName: file.fileName ?? "Unknown file",
        projectName: test.projectName ?? "Unknown project",
        application: test.application ?? "unknown",
        strategy: test.strategy ?? "unknown",
        browser: test.browser ?? "unknown",
        outcome: normalizeOutcome(test.outcome),
        duration,
        attempts: results.length || 1,
        retries: Math.max(0, results.length - 1),
        attemptDurations,
        attemptStatuses: results.map((result) => result.status ?? "unknown"),
      };
    }),
  );

  const counts: OutcomeCounts = {
    passed: 0,
    failed: 0,
    flaky: 0,
    skipped: 0,
  };

  const suiteMap = new Map<string, SuiteSummary>();

  for (const test of tests) {
    counts[test.outcome]++;

    let suite = suiteMap.get(test.fileName);

    if (!suite) {
      suite = {
        name: test.fileName,
        total: 0,
        passed: 0,
        failed: 0,
        flaky: 0,
        skipped: 0,
      };
      suiteMap.set(test.fileName, suite);
    }

    suite.total++;
    suite[test.outcome]++;
  }

  return {
    total: tests.length,
    passRate: tests.length ? (counts.passed / tests.length) * 100 : 0,
    counts,
    tests,
    suites: Array.from(suiteMap.values()).sort(
      (a, b) => b.failed - a.failed || a.name.localeCompare(b.name),
    ),
  };
}

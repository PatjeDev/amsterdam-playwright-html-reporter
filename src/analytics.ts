export type TestOutcome = "passed" | "failed" | "flaky" | "skipped" | "other";

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
};

export type SuiteSummary = {
  name: string;
  total: number;
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
  other: number;
};

export type AnalyticsData = {
  total: number;
  passRate: number;
  counts: {
    passed: number;
    failed: number;
    flaky: number;
    skipped: number;
    other: number;
  };
  tests: AnalyticsTest[];
  suites: SuiteSummary[];
};

type ProjectMetadata = {
  application?: string;
  strategy?: string;
  browser?: string;
};

type InputTest = {
  testId?: string;
  title?: string;
  projectName?: string;
  application?: string;
  strategy?: string;
  browser?: string;
  outcome?: string;
  duration?: number;
  results?: unknown[];
  project?: {
    metadata?: ProjectMetadata;
  };
  metadata?: ProjectMetadata;
};

type InputReport = {
  files?: {
    fileName?: string;
    tests?: InputTest[];
  }[];
  projects?: {
    name?: string;
    metadata?: ProjectMetadata;
  }[];
};

function normalizeOutcome(outcome?: string): TestOutcome {
  switch (outcome) {
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
      return "other";
  }
}

export function buildAnalytics(report: unknown): AnalyticsData {
  const source = report as InputReport;
  const files = Array.isArray(source?.files) ? source.files : [];
  const projects = Array.isArray(source?.projects) ? source.projects : [];

  const projectMetadataByName = new Map<string, ProjectMetadata>();

  for (const project of projects) {
    if (project.name) {
      projectMetadataByName.set(project.name, project.metadata ?? {});
    }
  }

  const tests: AnalyticsTest[] = files.flatMap((file) =>
    (Array.isArray(file.tests) ? file.tests : []).map((test, index) => {
      const projectName = test.projectName ?? "Unknown project";

      const metadata =
        test.project?.metadata ??
        test.metadata ??
        projectMetadataByName.get(projectName) ??
        {};

      const attempts = test.results?.length ?? 1;

      return {
        id: test.testId ?? `${file.fileName ?? "file"}-${index}`,
        title: test.title ?? "Untitled test",
        fileName: file.fileName ?? "Unknown file",
        projectName,
        application: test.application ?? metadata.application ?? "unknown",
        strategy: test.strategy ?? metadata.strategy ?? "unknown",
        browser: test.browser ?? metadata.browser ?? "unknown",
        outcome: normalizeOutcome(test.outcome),
        duration: test.duration ?? 0,
        attempts,
        retries: Math.max(0, attempts - 1),
      };
    }),
  );

  const counts = {
    passed: 0,
    failed: 0,
    flaky: 0,
    skipped: 0,
    other: 0,
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
        other: 0,
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
    suites: Array.from(suiteMap.values()),
  };
}

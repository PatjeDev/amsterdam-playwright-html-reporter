
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Card, Heading } from "@amsterdam/design-system-react";
import type { AnalyticsData } from "../analytics/analytics";
import { outcomeColors } from "../analytics/analytics";
import { useTranslation } from "../i18n";

type Props = {
  data: AnalyticsData;
};

export function SuiteComparison({ data }: Props) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.suites.map(suite => suite.name),
        datasets: [
          {
            label: t("outcome.passed"),
            data: data.suites.map(suite => suite.passed),
            backgroundColor: outcomeColors.passed,
          },
          {
            label: t("outcome.failed"),
            data: data.suites.map(suite => suite.failed),
            backgroundColor: outcomeColors.failed,
          },
          {
            label: t("outcome.flaky"),
            data: data.suites.map(suite => suite.flaky),
            backgroundColor: outcomeColors.flaky,
          },
          {
            label: t("outcome.skipped"),
            data: data.suites.map(suite => suite.skipped),
            backgroundColor: outcomeColors.skipped,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });

    return () => chart.destroy();
  }, [data, t]);

  return (
    <Card className="ams-gap-m analytics-card">
      <Heading level={3} size="level-4">
        {t("widget.suite.title")}
      </Heading>
      <div className="analytics-chart">
        <canvas ref={canvasRef} />
      </div>
    </Card>
  );
}

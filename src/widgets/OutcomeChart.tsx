
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Card, Heading } from "@amsterdam/design-system-react";
import type { AnalyticsData } from "../analytics/analytics";
import { outcomeColors } from "../analytics/analytics";
import { useTranslation } from "../i18n";

type Props = {
  data: AnalyticsData;
};

export function OutcomeChart({ data }: Props) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: [
          t("outcome.passed"),
          t("outcome.failed"),
          t("outcome.flaky"),
          t("outcome.skipped"),
        ],
        datasets: [{
          data: [
            data.counts.passed,
            data.counts.failed,
            data.counts.flaky,
            data.counts.skipped,
          ],
          backgroundColor: [
            outcomeColors.passed,
            outcomeColors.failed,
            outcomeColors.flaky,
            outcomeColors.skipped,
          ],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
        {t("widget.outcomes.title")}
      </Heading>
      <div className="analytics-chart">
        <canvas ref={canvasRef} />
      </div>
    </Card>
  );
}


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

    const outcomeKeys = ["passed", "failed", "flaky", "skipped"] as const;
    const visibleOutcomes = outcomeKeys.filter(
      key => data.counts[key] > 0,
    );

    const chart = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: visibleOutcomes.map(key => t(`outcome.${key}`)),
        datasets: [{
          data: visibleOutcomes.map(key => data.counts[key]),
          backgroundColor: visibleOutcomes.map(key => outcomeColors[key]),
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

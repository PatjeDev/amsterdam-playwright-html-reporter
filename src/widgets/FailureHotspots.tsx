
import { Card, Heading, Table } from "@amsterdam/design-system-react";
import type { AnalyticsData } from "../analytics/analytics";
import { useTranslation } from "../i18n";

type Props = {
  data: AnalyticsData;
};

export function FailureHotspots({ data }: Props) {
  const { t } = useTranslation();

  const hotspots = data.suites
    .filter(suite => suite.failed > 0 || suite.flaky > 0)
    .sort(
      (a, b) =>
        (b.failed + b.flaky) - (a.failed + a.flaky),
    );

  return (
    <Card className="ams-gap-m analytics-card">
      <Heading level={3} size="level-4">
        {t("widget.hotspots.title")}
      </Heading>

      {hotspots.length === 0 ? (
        <p>{t("widget.hotspots.empty")}</p>
      ) : (
        <div className="analytics-table-wrapper">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  {t("widget.hotspots.colFile")}
                </Table.HeaderCell>
                <Table.HeaderCell align="end">
                  {t("widget.hotspots.colFailed")}
                </Table.HeaderCell>
                <Table.HeaderCell align="end">
                  {t("widget.hotspots.colFlaky")}
                </Table.HeaderCell>
                <Table.HeaderCell align="end">
                  {t("widget.hotspots.colFailureRate")}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {hotspots.map(suite => (
                <Table.Row key={suite.name}>
                  <Table.Cell>{suite.name}</Table.Cell>
                  <Table.Cell align="end">{suite.failed}</Table.Cell>
                  <Table.Cell align="end">{suite.flaky}</Table.Cell>
                  <Table.Cell align="end">
                    {suite.total
                      ? `${(
                          (suite.failed / suite.total) * 100
                        ).toFixed(1)}%`
                      : "—"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Card>
  );
}

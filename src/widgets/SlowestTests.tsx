
import { Card, Heading, Table } from "@amsterdam/design-system-react";
import type { AnalyticsData } from "../analytics/analytics";
import { useTranslation } from "../i18n";

type Props = {
  data: AnalyticsData;
  limit?: number;
};

export function SlowestTests({
  data,
  limit = 10,
}: Props) {
  const { t } = useTranslation();

  const slowest = [...data.tests]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit);

  return (
    <Card className="ams-gap-m analytics-card">
      <Heading level={3} size="level-4">
        {t("widget.slowest.title")}
      </Heading>

      {slowest.length === 0 ? (
        <p>{t("widget.slowest.empty")}</p>
      ) : (
        <div className="analytics-table-wrapper">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{t("col.test")}</Table.HeaderCell>
                <Table.HeaderCell>{t("col.project")}</Table.HeaderCell>
                <Table.HeaderCell align="end">
                  {t("widget.slowest.colDuration")}
                </Table.HeaderCell>
                <Table.HeaderCell>{t("col.outcome")}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {slowest.map(test => (
                <Table.Row key={test.id}>
                  <Table.Cell>
                    <strong>{test.title}</strong>
                    <small>{test.fileName}</small>
                  </Table.Cell>
                  <Table.Cell>{test.projectName}</Table.Cell>
                  <Table.Cell align="end">
                    {(test.duration / 1000).toFixed(2)} s
                  </Table.Cell>
                  <Table.Cell>{t(`outcome.${test.outcome}`)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Card>
  );
}

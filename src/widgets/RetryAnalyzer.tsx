
import { Card, Heading, Table } from "@amsterdam/design-system-react";
import type { AnalyticsData } from "../analytics/analytics";
import { useTranslation } from "../i18n";

type Props = {
  data: AnalyticsData;
};

export function RetryAnalyzer({ data }: Props) {
  const { t } = useTranslation();

  const retriedTests = data.tests
    .filter(test => test.retries > 0)
    .sort((a, b) => b.retries - a.retries);

  const eventualPasses = retriedTests.filter(
    test => test.outcome === "passed" || test.outcome === "flaky",
  ).length;

  return (
    <Card className="ams-gap-m analytics-card">
      <Heading level={3} size="level-4">
        {t("widget.retry.title")}
      </Heading>

      <div className="analytics-summary">
        <span>{t("widget.retry.retried")}</span>
        <strong>{retriedTests.length}</strong>
        <span>{t("widget.retry.eventualPass")}</span>
        <strong>{eventualPasses}</strong>
      </div>

      {retriedTests.length === 0 ? (
        <p>{t("widget.retry.empty")}</p>
      ) : (
        <div className="analytics-table-wrapper">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{t("col.test")}</Table.HeaderCell>
                <Table.HeaderCell>{t("col.project")}</Table.HeaderCell>
                <Table.HeaderCell align="end">
                  {t("widget.retry.colRetries")}
                </Table.HeaderCell>
                <Table.HeaderCell>{t("col.outcome")}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {retriedTests.map(test => (
                <Table.Row key={test.id}>
                  <Table.Cell>
                    <strong>{test.title}</strong>
                    <small>{test.fileName}</small>
                  </Table.Cell>
                  <Table.Cell>{test.projectName}</Table.Cell>
                  <Table.Cell align="end">{test.retries}</Table.Cell>
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

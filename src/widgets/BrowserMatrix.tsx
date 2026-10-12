
import { Card, Heading, Table } from "@amsterdam/design-system-react";
import type { AnalyticsData, TestOutcome } from "../analytics/analytics";
import { useTranslation } from "../i18n";
import "./BrowserMatrix.css";

type Props = {
  data: AnalyticsData;
};

const browsers = ["chromium", "firefox", "webkit"] as const;

const outcomes: TestOutcome[] = [
  "passed",
  "failed",
  "flaky",
  "skipped",
];

export function BrowserMatrix({ data }: Props) {
  const { t } = useTranslation();

  const matrix = browsers.map((browser) => {
    const tests = data.tests.filter((test) => test.browser === browser);

    const counts = Object.fromEntries(
      outcomes.map((outcome) => [
        outcome,
        tests.filter((test) => test.outcome === outcome).length,
      ]),
    ) as Record<TestOutcome, number>;

    return {
      browser,
      total: tests.length,
      counts,
    };
  });

  if (data.tests.length === 0) {
    return (
      <Card className="ams-gap-m browser-matrix">
        <Heading level={3} size="level-4">
          {t("widget.browser.title")}
        </Heading>
        <p>{t("widget.browser.empty")}</p>
      </Card>
    );
  }

  return (
    <Card className="ams-gap-m browser-matrix">
      <div className="browser-matrix__header">
        <div>
          <Heading level={3} size="level-4">
            {t("widget.browser.title")}
          </Heading>
          <p>{t("widget.browser.subtitle")}</p>
        </div>
        <span className="browser-matrix__total">
          {t("widget.browser.testsCount", { count: data.total })}
        </span>
      </div>

      <div className="browser-matrix__table-wrap">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{t("filter.browser")}</Table.HeaderCell>
              <Table.HeaderCell align="center">
                {t("widget.browser.total")}
              </Table.HeaderCell>
              {outcomes.map((outcome) => (
                <Table.HeaderCell align="center" key={outcome}>
                  {t(`outcome.${outcome}`)}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {matrix.map(({ browser, total, counts }) => (
              <Table.Row key={browser}>
                <Table.HeaderCell scope="row">{browser}</Table.HeaderCell>
                <Table.Cell align="center">{total}</Table.Cell>
                {outcomes.map((outcome) => (
                  <Table.Cell
                    key={outcome}
                    align="center"
                    className={`browser-matrix__cell browser-matrix__cell--${outcome}`}
                  >
                    {counts[outcome]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="browser-matrix__legend">
        {outcomes.map((outcome) => (
          <span key={outcome}>
            <span
              className={`browser-matrix__dot browser-matrix__dot--${outcome}`}
            />
            {t(`outcome.${outcome}`)}
          </span>
        ))}
      </div>
    </Card>
  );
}

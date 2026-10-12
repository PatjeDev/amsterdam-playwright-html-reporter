import {
    Column,
    DescriptionList,
    Grid,
    Heading,
    Icon,
    Paragraph,
    Row,
} from '@amsterdam/design-system-react'
import { TestResultsChart } from '../widgets/testResultsChart'
import type { LoadedReport } from '../loadedReport'
import { DocumentsIcon, ErrorIcon, InfoIcon, SuccessIcon, ThumbsDownFillIcon, ThumbsDownIcon, ThumbsUpIcon, WarningIcon } from '@amsterdam/design-system-react-icons'

const reportTitle = 'Dashboard'

type DashboardProps = {
    report?: LoadedReport
}

const roundTo = function (num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
};

export function Dashboard({ report }: DashboardProps) {
    if (!report) {
        return (
            <Grid paddingVertical="large">
                <Grid.Cell appearance="transparent" span="all">
                    <Heading level={2} size="level-1">
                        {reportTitle}
                    </Heading>
                </Grid.Cell>

                <Grid.Cell span="all">
                    <Paragraph>
                        Rapport wordt geladen...
                    </Paragraph>
                </Grid.Cell>
            </Grid>
        )
    }

    console.log('PLAYWRIGHT REPORT:')
    console.dir(report.json(), { depth: null })

    const stats = report.json().stats


    const passed = stats.expected;
    const failed = stats.unexpected;

    const passRate =
        passed + failed === 0
            ? 0
            : (passed / (passed + failed)) * 100;

    return (
        <Grid paddingVertical="large">
            <Grid.Cell appearance="transparent" span="all">
                <Heading level={2} size="level-1">
                    {reportTitle}
                </Heading>
            </Grid.Cell>

            <Grid.Subgrid as="ul" span="all">
                <Grid.Cell
                    as="li"
                    className="_ams-item bgTotal"
                    span={{
                        medium: 3,
                        narrow: 3,
                        wide: 2,
                    }}
                >
                    <Row alignVertical="center">
                        <Icon size="heading-1" svg={DocumentsIcon} />
                        <DescriptionList>
                            <DescriptionList.Term>
                                Totaal
                            </DescriptionList.Term>
                            <DescriptionList.Description>
                                {stats.total}
                            </DescriptionList.Description>
                        </DescriptionList>
                    </Row>
                </Grid.Cell>
                <Grid.Cell
                    as="li"
                    className="_ams-item bgPassed"
                    span={{
                        medium: 3,
                        narrow: 3,
                        wide: 2,
                    }}
                >
                    <Row alignVertical="center">
                        <Icon size="heading-1" svg={SuccessIcon} />
                        <DescriptionList>
                            <DescriptionList.Term>
                                Geslaagd
                            </DescriptionList.Term>
                            <DescriptionList.Description>
                                {stats.expected}
                            </DescriptionList.Description>
                        </DescriptionList>
                    </Row>
                </Grid.Cell>
                <Grid.Cell
                    as="li"
                    className="_ams-item bgFailed"
                    span={{
                        medium: 3,
                        narrow: 3,
                        wide: 2,
                    }}
                >
                    <Row alignVertical="center">
                        <Icon size="heading-1" svg={ErrorIcon} />
                        <DescriptionList>
                            <DescriptionList.Term>
                                Mislukt
                            </DescriptionList.Term>
                            <DescriptionList.Description>
                                {stats.unexpected}
                            </DescriptionList.Description>
                        </DescriptionList>
                    </Row>
                </Grid.Cell>
                <Grid.Cell
                    as="li"
                    className="_ams-item bgFlaky"
                    span={{
                        medium: 3,
                        narrow: 3,
                        wide: 2,
                    }}
                >
                    <Row alignVertical="center">
                        <Icon size="heading-1" svg={WarningIcon} />
                        <DescriptionList>
                            <DescriptionList.Term>
                                Onbetrouwbaar
                            </DescriptionList.Term>
                            <DescriptionList.Description>
                                {stats.flaky}
                            </DescriptionList.Description>
                        </DescriptionList>
                    </Row>
                </Grid.Cell>
                <Grid.Cell
                    as="li"
                    className="_ams-item bgSkipped"
                    span={{
                        medium: 3,
                        narrow: 3,
                        wide: 2,
                    }}
                >
                    <Row alignVertical="center">
                        <Icon size="heading-1" svg={InfoIcon} />
                        <DescriptionList>
                            <DescriptionList.Term>
                                Overgeslagen
                            </DescriptionList.Term>
                            <DescriptionList.Description>
                                {stats.skipped}
                            </DescriptionList.Description>
                        </DescriptionList>
                    </Row>
                </Grid.Cell>
                <Grid.Cell
                    as="li"
                    className="_ams-item bgPercentage"
                    span={{
                        medium: 3,
                        narrow: 3,
                        wide: 2,
                    }}
                >
                    <Row alignVertical="center">
                        {roundTo(passRate, 2) > 98 ? (
                            <Icon size="heading-1" svg={ThumbsUpIcon} />
                        ) : (
                            <Icon size="heading-1" svg={ThumbsDownIcon} />
                        )}
                        <DescriptionList>
                            <DescriptionList.Term>
                                Percentage
                            </DescriptionList.Term>
                            <DescriptionList.Description>
                                {roundTo(passRate, 2)}%
                            </DescriptionList.Description>
                        </DescriptionList>
                    </Row>
                </Grid.Cell>
            </Grid.Subgrid>

            <Grid.Subgrid as="ul" span="all">
                <Grid.Cell
                    as="li"
                    className="_ams-item"
                    span={{
                        medium: 4,
                        narrow: 4,
                        wide: 3,
                    }}
                >
                    <TestResultsChart stats={stats} />
                </Grid.Cell>

                <Grid.Cell
                    as="li"
                    className="_ams-item"
                    span={{
                        medium: 4,
                        narrow: 4,
                        wide: 3,
                    }}
                />

                <Grid.Cell
                    as="li"
                    className="_ams-item"
                    span={{
                        medium: 4,
                        narrow: 4,
                        wide: 3,
                    }}
                />

                <Grid.Cell
                    as="li"
                    className="_ams-item"
                    span={{
                        medium: 4,
                        narrow: 4,
                        wide: 3,
                    }}
                />
            </Grid.Subgrid>
        </Grid>
    )
}

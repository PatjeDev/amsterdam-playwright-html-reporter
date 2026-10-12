import {
    Button,
    DescriptionList,
    Field,
    Grid,
    Heading,
    Icon,
    Label,
    Paragraph,
    Row,
    Select,
} from '@amsterdam/design-system-react'
import { useEffect, useMemo, useState } from 'react'
import type { LoadedReport } from '../loadedReport'
import { buildAnalytics } from '../analytics/analytics'
import type {
    AnalyticsData,
    AnalyticsTest,
    OutcomeCounts,
    SuiteSummary,
} from '../analytics/analytics'
import { OutcomeChart } from '../widgets/OutcomeChart'
import { SuiteComparison } from '../widgets/SuiteComparison'
import { BrowserMatrix } from '../widgets/BrowserMatrix'
import { RetryAnalyzer } from '../widgets/RetryAnalyzer'
import { SlowestTests } from '../widgets/SlowestTests'
import { FailureHotspots } from '../widgets/FailureHotspots'
import '../analytics.css'
import { useTranslation } from '../i18n'
import {
    DocumentsIcon,
    ErrorIcon,
    InfoIcon,
    SuccessIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
    WarningIcon,
} from '@amsterdam/design-system-react-icons'

type DashboardProps = {
    report?: LoadedReport
}

const roundTo = function (num: number, places: number) {
    const factor = 10 ** places
    return Math.round(num * factor) / factor
}

const emptyCounts: OutcomeCounts = {
    passed: 0,
    failed: 0,
    flaky: 0,
    skipped: 0,
}

const emptyAnalytics: AnalyticsData = {
    total: 0,
    passRate: 0,
    counts: emptyCounts,
    tests: [],
    suites: [],
}

const uniqueValues = (values: string[]) =>
    [...new Set(values.filter((value) => value && value !== 'unknown'))].sort()

export function Dashboard({ report }: DashboardProps) {
    const { t } = useTranslation()

    const allAnalytics = useMemo(
        () => (report ? buildAnalytics(report.json()) : emptyAnalytics),
        [report],
    )

    const [application, setApplication] = useState('all')
    const [strategy, setStrategy] = useState('all')
    const [browser, setBrowser] = useState('all')
    const [project, setProject] = useState('all')

    // Each dropdown's options depend on the other three selections.
    const filteredForApplications = allAnalytics.tests.filter(
        (test) =>
            (strategy === 'all' || test.strategy === strategy) &&
            (browser === 'all' || test.browser === browser) &&
            (project === 'all' || test.projectName === project),
    )
    const filteredForStrategies = allAnalytics.tests.filter(
        (test) =>
            (application === 'all' || test.application === application) &&
            (browser === 'all' || test.browser === browser) &&
            (project === 'all' || test.projectName === project),
    )
    const filteredForBrowsers = allAnalytics.tests.filter(
        (test) =>
            (application === 'all' || test.application === application) &&
            (strategy === 'all' || test.strategy === strategy) &&
            (project === 'all' || test.projectName === project),
    )
    const filteredForProjects = allAnalytics.tests.filter(
        (test) =>
            (application === 'all' || test.application === application) &&
            (strategy === 'all' || test.strategy === strategy) &&
            (browser === 'all' || test.browser === browser),
    )

    const applications = uniqueValues(
        filteredForApplications.map((test) => test.application),
    )
    const strategies = uniqueValues(
        filteredForStrategies.map((test) => test.strategy),
    )
    const browsers = uniqueValues(
        filteredForBrowsers.map((test) => test.browser),
    )
    const projects = uniqueValues(
        filteredForProjects.map((test) => test.projectName),
    )

    // Visibility is based on the complete report, not current selections.
    const showApplicationFilter =
        uniqueValues(allAnalytics.tests.map((test) => test.application)).length >
        1
    const showStrategyFilter =
        uniqueValues(allAnalytics.tests.map((test) => test.strategy)).length > 1
    const showBrowserFilter =
        uniqueValues(allAnalytics.tests.map((test) => test.browser)).length > 1
    const showProjectFilter =
        uniqueValues(allAnalytics.tests.map((test) => test.projectName)).length >
        1

    // Reset selections that are no longer compatible with the other filters.
    useEffect(() => {
        const hasMatchingTest = (
            predicate: (test: AnalyticsTest) => boolean,
        ) => allAnalytics.tests.some(predicate)

        const isValidApplication =
            application === 'all' ||
            hasMatchingTest(
                (test) =>
                    test.application === application &&
                    (strategy === 'all' || test.strategy === strategy) &&
                    (browser === 'all' || test.browser === browser) &&
                    (project === 'all' || test.projectName === project),
            )
        const isValidStrategy =
            strategy === 'all' ||
            hasMatchingTest(
                (test) =>
                    test.strategy === strategy &&
                    (application === 'all' ||
                        test.application === application) &&
                    (browser === 'all' || test.browser === browser) &&
                    (project === 'all' || test.projectName === project),
            )
        const isValidBrowser =
            browser === 'all' ||
            hasMatchingTest(
                (test) =>
                    test.browser === browser &&
                    (application === 'all' ||
                        test.application === application) &&
                    (strategy === 'all' || test.strategy === strategy) &&
                    (project === 'all' || test.projectName === project),
            )
        const isValidProject =
            project === 'all' ||
            hasMatchingTest(
                (test) =>
                    test.projectName === project &&
                    (application === 'all' ||
                        test.application === application) &&
                    (strategy === 'all' || test.strategy === strategy) &&
                    (browser === 'all' || test.browser === browser),
            )

        if (!isValidApplication) setApplication('all')
        if (!isValidStrategy) setStrategy('all')
        if (!isValidBrowser) setBrowser('all')
        if (!isValidProject) setProject('all')
    }, [allAnalytics, application, strategy, browser, project])

    const analytics = useMemo<AnalyticsData>(() => {
        const filteredTests = allAnalytics.tests.filter(
            (test) =>
                (application === 'all' || test.application === application) &&
                (strategy === 'all' || test.strategy === strategy) &&
                (browser === 'all' || test.browser === browser) &&
                (project === 'all' || test.projectName === project),
        )

        const counts: OutcomeCounts = {
            passed: 0,
            failed: 0,
            flaky: 0,
            skipped: 0,
        }

        const suiteMap = new Map<string, SuiteSummary>()

        for (const test of filteredTests) {
            counts[test.outcome]++

            let suite = suiteMap.get(test.fileName)

            if (!suite) {
                suite = {
                    name: test.fileName,
                    total: 0,
                    passed: 0,
                    failed: 0,
                    flaky: 0,
                    skipped: 0,
                }
                suiteMap.set(test.fileName, suite)
            }

            suite.total++
            suite[test.outcome]++
        }

        return {
            total: filteredTests.length,
            passRate: filteredTests.length
                ? (counts.passed / filteredTests.length) * 100
                : 0,
            counts,
            tests: filteredTests,
            suites: [...suiteMap.values()].sort(
                (a, b) => b.failed - a.failed || a.name.localeCompare(b.name),
            ),
        }
    }, [allAnalytics, application, strategy, browser, project])

    const resetFilters = () => {
        setApplication('all')
        setStrategy('all')
        setBrowser('all')
        setProject('all')
    }

    if (!report) {
        return (
            <Grid paddingVertical="large">
                <Grid.Cell appearance="transparent" span="all">
                    <Heading level={2} size="level-1">
                        {t('dashboard.title')}
                    </Heading>
                </Grid.Cell>

                <Grid.Cell span="all">
                    <Paragraph>{t('dashboard.loading')}</Paragraph>
                </Grid.Cell>
            </Grid>
        )
    }

    const passed = analytics.counts.passed
    const failed = analytics.counts.failed

    const passRate =
        passed + failed === 0 ? 0 : (passed / (passed + failed)) * 100

    const hasFilters =
        showApplicationFilter ||
        showStrategyFilter ||
        showBrowserFilter ||
        showProjectFilter

    return (
        <Grid paddingVertical="large">
            <Grid.Cell appearance="transparent" span="all">
                <Heading level={2} size="level-1">
                    {t('dashboard.title')}
                </Heading>
            </Grid.Cell>

            {hasFilters && (
                <Grid.Cell appearance="transparent" span="all">
                    <Row alignVertical="end" wrap>
                        {showApplicationFilter && (
                            <Field>
                                <Label htmlFor="dashboard-filter-application">
                                    {t('filter.application')}
                                </Label>
                                <Select
                                    id="dashboard-filter-application"
                                    value={application}
                                    onChange={(event) =>
                                        setApplication(event.target.value)
                                    }
                                >
                                    <Select.Option value="all">
                                        {t('filter.allApplications')}
                                    </Select.Option>
                                    {applications.map((value) => (
                                        <Select.Option
                                            key={value}
                                            value={value}
                                        >
                                            {value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Field>
                        )}

                        {showStrategyFilter && (
                            <Field>
                                <Label htmlFor="dashboard-filter-strategy">
                                    {t('filter.strategy')}
                                </Label>
                                <Select
                                    id="dashboard-filter-strategy"
                                    value={strategy}
                                    onChange={(event) =>
                                        setStrategy(event.target.value)
                                    }
                                >
                                    <Select.Option value="all">
                                        {t('filter.allStrategies')}
                                    </Select.Option>
                                    {strategies.map((value) => (
                                        <Select.Option
                                            key={value}
                                            value={value}
                                        >
                                            {value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Field>
                        )}

                        {showBrowserFilter && (
                            <Field>
                                <Label htmlFor="dashboard-filter-browser">
                                    {t('filter.browser')}
                                </Label>
                                <Select
                                    id="dashboard-filter-browser"
                                    value={browser}
                                    onChange={(event) =>
                                        setBrowser(event.target.value)
                                    }
                                >
                                    <Select.Option value="all">
                                        {t('filter.allBrowsers')}
                                    </Select.Option>
                                    {browsers.map((value) => (
                                        <Select.Option
                                            key={value}
                                            value={value}
                                        >
                                            {value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Field>
                        )}

                        {showProjectFilter && (
                            <Field>
                                <Label htmlFor="dashboard-filter-project">
                                    {t('filter.project')}
                                </Label>
                                <Select
                                    id="dashboard-filter-project"
                                    value={project}
                                    onChange={(event) =>
                                        setProject(event.target.value)
                                    }
                                >
                                    <Select.Option value="all">
                                        {t('filter.allProjects')}
                                    </Select.Option>
                                    {projects.map((value) => (
                                        <Select.Option
                                            key={value}
                                            value={value}
                                        >
                                            {value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Field>
                        )}

                        <Button
                            variant="secondary"
                            type="button"
                            onClick={resetFilters}
                        >
                            {t('filter.reset')}
                        </Button>
                    </Row>
                </Grid.Cell>
            )}

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
                            <DescriptionList.Term>{t('stats.total')}</DescriptionList.Term>
                            <DescriptionList.Description>
                                {analytics.total}
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
                            <DescriptionList.Term>{t('stats.passed')}</DescriptionList.Term>
                            <DescriptionList.Description>
                                {analytics.counts.passed}
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
                            <DescriptionList.Term>{t('stats.failed')}</DescriptionList.Term>
                            <DescriptionList.Description>
                                {analytics.counts.failed}
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
                                {t('stats.flaky')}
                            </DescriptionList.Term>
                            <DescriptionList.Description>
                                {analytics.counts.flaky}
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
                                {t('stats.skipped')}
                            </DescriptionList.Term>
                            <DescriptionList.Description>
                                {analytics.counts.skipped}
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
                                {t('stats.percentage')}
                            </DescriptionList.Term>
                            <DescriptionList.Description>
                                {roundTo(passRate, 2)}%
                            </DescriptionList.Description>
                        </DescriptionList>
                    </Row>
                </Grid.Cell>
            </Grid.Subgrid>

            <Grid.Cell appearance="transparent" span="all">
                <div className="analytics-charts">
                    <OutcomeChart data={analytics} />
                    <SuiteComparison data={analytics} />
                    <BrowserMatrix data={analytics} />
                </div>

                <div className="analytics-widgets">
                    <RetryAnalyzer data={analytics} />
                    <SlowestTests data={analytics} />
                    <FailureHotspots data={analytics} />
                </div>
            </Grid.Cell>
        </Grid>
    )
}

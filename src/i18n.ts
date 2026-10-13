import { useMemo } from 'react'
import { useSetting } from '@web/uiUtils'

export type Language = 'nl' | 'en'

export const kDefaultLanguage: Language = 'nl'

export const kLanguageSettingsKey = 'language'

export const kLanguageOptions: { label: string; value: Language }[] = [
    { label: 'Nederlands', value: 'nl' },
    { label: 'English', value: 'en' },
]

const nl = {
    'menu.dashboard': 'Dashboard',
    'menu.report': 'Rapport',
    'menu.settings': 'Instellingen',

    'dashboard.title': 'Dashboard',
    'dashboard.loading': 'Rapport wordt geladen...',
    'dashboard.resetLayout': 'Indeling herstellen',
    'dashboard.noWidgets':
        'Alle widgets zijn verborgen. Schakel ze in via Instellingen.',

    'stats.total': 'Totaal',
    'stats.passed': 'Geslaagd',
    'stats.failed': 'Mislukt',
    'stats.flaky': 'Onbetrouwbaar',
    'stats.skipped': 'Overgeslagen',
    'stats.percentage': 'Percentage',

    'filter.application': 'Applicatie',
    'filter.strategy': 'Strategie',
    'filter.browser': 'Browser',
    'filter.project': 'Project',
    'filter.allApplications': 'Alle applicaties',
    'filter.allStrategies': 'Alle strategieën',
    'filter.allBrowsers': 'Alle browsers',
    'filter.allProjects': 'Alle projecten',
    'filter.reset': 'Wissen',
    'filter.filters': 'Filters',

    'outcome.passed': 'Geslaagd',
    'outcome.failed': 'Mislukt',
    'outcome.flaky': 'Onbetrouwbaar',
    'outcome.skipped': 'Overgeslagen',

    'col.test': 'Test',
    'col.project': 'Project',
    'col.outcome': 'Resultaat',
    'col.duration': 'Duur',
    'col.labels': 'Labels',
    'col.actions': 'Acties',

    'action.viewTestCase': 'Testcase bekijken',
    'action.viewTrace': 'Trace bekijken',

    'report.search': 'Zoek testen',
    'report.all': 'Alle',
    'report.speedboard': 'Speedboard',
    'report.noTestsFound': 'Geen testen gevonden',
    'report.errors': 'Fouten',

    'layout.brandName': 'Testrapport',
    'layout.logoLinkTitle': 'Naar de testrapport',

    'widget.outcomes.title': 'Testuitkomsten',
    'widget.suite.title': 'Resultaten per suite',

    'widget.browser.title': 'Browsermatrix',
    'widget.browser.subtitle': 'Vergelijk testresultaten per browser.',
    'widget.browser.empty':
        'Geen testresultaten komen overeen met de geselecteerde filters.',
    'widget.browser.total': 'Totaal',
    'widget.browser.testsCount': '{count} testen',

    'widget.retry.title': 'Herhaalanalyse',
    'widget.retry.retried': 'Opnieuw uitgevoerde testen',
    'widget.retry.eventualPass': 'Geslaagd of onbetrouwbaar na herhaling',
    'widget.retry.empty': 'Geen testen met geregistreerde herhalingen.',
    'widget.retry.colRetries': 'Herhalingen',

    'widget.slowest.title': 'Langzaamste testen',
    'widget.slowest.empty': 'Geen duurgegevens beschikbaar.',
    'widget.slowest.colDuration': 'Duur',

    'widget.hotspots.title': 'Faalpunten',
    'widget.hotspots.empty':
        'Geen mislukte of onbetrouwbare suites in deze run.',
    'widget.hotspots.colFile': 'Bestand / suite',
    'widget.hotspots.colFailed': 'Mislukt',
    'widget.hotspots.colFlaky': 'Onbetrouwbaar',
    'widget.hotspots.colFailureRate': 'Faalpercentage',

    'widget.drag.label': 'Versleep om te herschikken',
    'widget.settings.open': 'Widget-instellingen openen',
    'widget.settings.titleFor': 'Widget-instellingen: {name}',
    'widget.settings.width': 'Breedte',
    'widget.settings.visible': 'Widget tonen',
    'widget.settings.close': 'Sluiten',

    'width.third': 'Een derde',
    'width.half': 'Helft',
    'width.twoThirds': 'Twee derde',
    'width.full': 'Volledig',

    'settings.title': 'Instellingen',
    'settings.tab.report': 'Rapport',
    'settings.tab.widgets': 'Widgets',
    'settings.tab.appearance': 'Uiterlijk',
    'settings.tab.language': 'Taal',
    'settings.report.label': 'Bestanden samenvoegen',
    'settings.report.description': 'Combineer de bestanden van het testrapport.',
    'settings.widgets.label': 'Zichtbare widgets',
    'settings.widgets.description':
        'Kies welke widgets op het dashboard worden getoond.',
    'settings.appearance.label': 'Thema',
    'settings.appearance.description': 'Kies het uiterlijk van het rapport.',
    'settings.language.label': 'Taal',
    'settings.language.description': 'Kies de taal van het rapport.',
} as const

export type TranslationKey = keyof typeof nl

const en: Record<TranslationKey, string> = {
    'menu.dashboard': 'Dashboard',
    'menu.report': 'Report',
    'menu.settings': 'Settings',

    'dashboard.title': 'Dashboard',
    'dashboard.loading': 'Report is loading...',
    'dashboard.resetLayout': 'Reset layout',
    'dashboard.noWidgets':
        'All widgets are hidden. Enable them in Settings.',

    'stats.total': 'Total',
    'stats.passed': 'Passed',
    'stats.failed': 'Failed',
    'stats.flaky': 'Flaky',
    'stats.skipped': 'Skipped',
    'stats.percentage': 'Percentage',

    'filter.application': 'Application',
    'filter.strategy': 'Strategy',
    'filter.browser': 'Browser',
    'filter.project': 'Project',
    'filter.allApplications': 'All applications',
    'filter.allStrategies': 'All strategies',
    'filter.allBrowsers': 'All browsers',
    'filter.allProjects': 'All projects',
    'filter.reset': 'Clear',
    'filter.filters': 'Filters',

    'outcome.passed': 'Passed',
    'outcome.failed': 'Failed',
    'outcome.flaky': 'Flaky',
    'outcome.skipped': 'Skipped',

    'col.test': 'Test',
    'col.project': 'Project',
    'col.outcome': 'Outcome',
    'col.duration': 'Duration',
    'col.labels': 'Labels',
    'col.actions': 'Actions',

    'action.viewTestCase': 'View test case',
    'action.viewTrace': 'View trace',

    'report.search': 'Search tests',
    'report.all': 'All',
    'report.speedboard': 'Speedboard',
    'report.noTestsFound': 'No tests found',
    'report.errors': 'Errors',

    'layout.brandName': 'Test report',
    'layout.logoLinkTitle': 'To the test report',

    'widget.outcomes.title': 'Test outcomes',
    'widget.suite.title': 'Results by suite',

    'widget.browser.title': 'Browser matrix',
    'widget.browser.subtitle': 'Compare test outcomes across browsers.',
    'widget.browser.empty': 'No test results match the selected filters.',
    'widget.browser.total': 'Total',
    'widget.browser.testsCount': '{count} tests',

    'widget.retry.title': 'Retry analysis',
    'widget.retry.retried': 'Tests retried',
    'widget.retry.eventualPass': 'Passed or flaky after retries',
    'widget.retry.empty': 'No tests with recorded retries.',
    'widget.retry.colRetries': 'Retries',

    'widget.slowest.title': 'Slowest tests',
    'widget.slowest.empty': 'No test duration data available.',
    'widget.slowest.colDuration': 'Duration',

    'widget.hotspots.title': 'Failure hotspots',
    'widget.hotspots.empty': 'No failed or flaky suites in this run.',
    'widget.hotspots.colFile': 'File / suite',
    'widget.hotspots.colFailed': 'Failed',
    'widget.hotspots.colFlaky': 'Flaky',
    'widget.hotspots.colFailureRate': 'Failure rate',

    'widget.drag.label': 'Drag to rearrange',
    'widget.settings.open': 'Open widget settings',
    'widget.settings.titleFor': 'Widget settings: {name}',
    'widget.settings.width': 'Width',
    'widget.settings.visible': 'Show widget',
    'widget.settings.close': 'Close',

    'width.third': 'One third',
    'width.half': 'Half',
    'width.twoThirds': 'Two thirds',
    'width.full': 'Full width',

    'settings.title': 'Settings',
    'settings.tab.report': 'Report',
    'settings.tab.widgets': 'Widgets',
    'settings.tab.appearance': 'Appearance',
    'settings.tab.language': 'Language',
    'settings.report.label': 'Merge files',
    'settings.report.description': 'Combine the files of the test report.',
    'settings.widgets.label': 'Visible widgets',
    'settings.widgets.description':
        'Choose which widgets are shown on the dashboard.',
    'settings.appearance.label': 'Theme',
    'settings.appearance.description': 'Choose the appearance of the report.',
    'settings.language.label': 'Language',
    'settings.language.description': 'Choose the language of the report.',
}

export const translations: Record<Language, Record<TranslationKey, string>> = {
    nl,
    en,
}

export type TranslationVars = Record<string, string | number>

export type TranslateFn = (key: TranslationKey, vars?: TranslationVars) => string

export function useLanguage(): [Language, (value: Language) => void] {
    return useSetting<Language>(kLanguageSettingsKey, kDefaultLanguage)
}

export function useTranslation(): { t: TranslateFn; language: Language } {
    const [language] = useLanguage()

    const t = useMemo<TranslateFn>(() => {
        const dictionary =
            translations[language] ?? translations[kDefaultLanguage]

        return (key, vars) => {
            let value =
                dictionary[key] ?? translations[kDefaultLanguage][key] ?? key

            if (vars) {
                for (const [name, replacement] of Object.entries(vars))
                    value = value.replace(`{${name}}`, String(replacement))
            }

            return value
        }
    }, [language])

    return { t, language }
}

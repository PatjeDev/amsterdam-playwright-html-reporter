import {
    Checkbox,
    Field,
    Grid,
    Heading,
    Label,
    Paragraph,
    Select,
    TabNavigation,
} from '@amsterdam/design-system-react'
import { useState } from 'react'

import { kThemeOptions, Theme, useThemeSetting } from '@web/theme'
import { useSetting } from '@web/uiUtils'
import {
    kLanguageOptions,
    Language,
    useLanguage,
    useTranslation,
} from '../i18n'

type SettingsTab = 'report' | 'appearance' | 'language'

export function Settings() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<SettingsTab>('report')

    return (
        <Grid paddingVertical="large">
            <Grid.Cell appearance="transparent" span="all">
                <Heading level={2} size="level-1">
                    {t('settings.title')}
                </Heading>
            </Grid.Cell>

            <Grid.Cell span="all">
                <TabNavigation>
                    <TabNavigation.List>
                        <TabNavigation.Link
                            href="#"
                            aria-current={
                                activeTab === 'report' ? 'page' : undefined
                            }
                            onClick={(event) => {
                                event.preventDefault()
                                setActiveTab('report')
                            }}
                        >
                            {t('settings.tab.report')}
                        </TabNavigation.Link>

                        <TabNavigation.Link
                            href="#"
                            aria-current={
                                activeTab === 'appearance' ? 'page' : undefined
                            }
                            onClick={(event) => {
                                event.preventDefault()
                                setActiveTab('appearance')
                            }}
                        >
                            {t('settings.tab.appearance')}
                        </TabNavigation.Link>

                        <TabNavigation.Link
                            href="#"
                            aria-current={
                                activeTab === 'language' ? 'page' : undefined
                            }
                            onClick={(event) => {
                                event.preventDefault()
                                setActiveTab('language')
                            }}
                        >
                            {t('settings.tab.language')}
                        </TabNavigation.Link>
                    </TabNavigation.List>
                </TabNavigation>

                {activeTab === 'report' && <ReportSettings />}

                {activeTab === 'appearance' && <AppearanceSettings />}

                {activeTab === 'language' && <LanguageSettings />}
            </Grid.Cell>
        </Grid>
    )
}

function ReportSettings() {
    const { t } = useTranslation()
    const [mergeFiles, setMergeFiles] = useSetting(
        'mergeFiles',
        false,
    )

    return (
        <section className="settings-container">
            <Field>
                <Label htmlFor="merge-file-setting-report">
                    {t('settings.report.label')}
                </Label>

                <Paragraph id="merge-file-setting-report-description">
                    {t('settings.report.description')}
                </Paragraph>

                <Checkbox
                    aria-describedby="merge-file-setting-report-description"
                    id="merge-file-setting-report"
                    checked={mergeFiles}
                    onChange={() => setMergeFiles(!mergeFiles)}
                >
                    {t('settings.report.label')}
                </Checkbox>
            </Field>
        </section>
    )
}

function AppearanceSettings() {
    const { t } = useTranslation()
    const [theme, setTheme] = useThemeSetting()

    return (
        <section className="settings-container">

            <Field>
                <Label htmlFor="header-setting-theme">
                    {t('settings.appearance.label')}
                </Label>

                <Paragraph id="header-setting-theme-description">
                    {t('settings.appearance.description')}
                </Paragraph>

                <Select
                    aria-describedby="header-setting-theme-description"
                    id="header-setting-theme"
                    value={theme}
                    onChange={(event) =>
                        setTheme(event.target.value as Theme)
                    }
                >
                    {kThemeOptions.map((option) => (
                        <Select.Option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </Field>
        </section>
    )
}

function LanguageSettings() {
    const { t } = useTranslation()
    const [language, setLanguage] = useLanguage()

    return (
        <section className="settings-container">
            <Field>
                <Label htmlFor="header-setting-language">
                    {t('settings.language.label')}
                </Label>

                <Paragraph id="header-setting-language-description">
                    {t('settings.language.description')}
                </Paragraph>

                <Select
                    aria-describedby="header-setting-language-description"
                    id="header-setting-language"
                    value={language}
                    onChange={(event) =>
                        setLanguage(event.target.value as Language)
                    }
                >
                    {kLanguageOptions.map((option) => (
                        <Select.Option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </Field>
        </section>
    )
}

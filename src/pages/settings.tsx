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

const reportTitle = 'Instellingen'

type SettingsTab = 'report' | 'appearance' | 'language'

export function Settings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('report')

    return (
        <Grid paddingVertical="large">
            <Grid.Cell appearance="transparent" span="all">
                <Heading level={2} size="level-1">
                    {reportTitle}
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
                            Rapport
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
                            Uiterlijk
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
                            Taal
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
    const [mergeFiles, setMergeFiles] = useSetting(
        'mergeFiles',
        false,
    )

    return (
        <section className="settings-container">
            <Field>
                <Label htmlFor="merge-file-setting-report">
                    Bestanden samenvoegen
                </Label>

                <Paragraph id="merge-file-setting-report-description">
                    Combineer de bestanden van het testrapport.
                </Paragraph>

                <Checkbox
                    aria-describedby="merge-file-setting-report-description"
                    id="merge-file-setting-report"
                    checked={mergeFiles}
                    onChange={() => setMergeFiles(!mergeFiles)}
                >
                    Bestanden samenvoegen
                </Checkbox>
            </Field>
        </section>
    )
}

function AppearanceSettings() {
    const [theme, setTheme] = useThemeSetting()

    return (
        <section className="settings-container">

            <Field>
                <Label htmlFor="header-setting-theme">
                    Theme
                </Label>

                <Paragraph id="header-setting-theme-description">
                    Kies het uiterlijk van het rapport.
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

    return (
        <section className="settings-container">
            <Field>
                <Label htmlFor="header-setting-theme">
                    Taal
                </Label>

                <Paragraph id="header-setting-theme-description">
                    Kies het uiterlijk van het rapport.
                </Paragraph>

                <Select
                    aria-describedby="header-setting-theme-description"
                    id="header-setting-language"
                >
                        <Select.Option
                            key='nl'
                            value='nl'
                        >
                            Nederlands
                        </Select.Option>
                        <Select.Option
                            key='en'
                            value='en'
                        >
                            Engels
                        </Select.Option>
                </Select>
            </Field>
        </section>
    )
}

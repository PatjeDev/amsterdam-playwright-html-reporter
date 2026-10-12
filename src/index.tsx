/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { HTMLReport } from './types'
import * as zipjs from '@zip.js/zip.js'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './colors.css'
import type { LoadedReport } from './loadedReport'
import { ReportView } from './reportView'

import { SearchParamsProvider } from './links'
import { applyTheme } from '@web/theme'

import '@amsterdam/design-system-assets/font/index.css'
import '@amsterdam/design-system-css/dist/index.css'
import '@amsterdam/design-system-tokens/dist/index.css'

import AmsterdamPlaywrightReporter from './layout'

import {
    HashRouter,
    Route,
    Routes,
} from 'react-router-dom'
import { Dashboard } from './pages/dashboard'
import { Settings } from './pages/settings'

const link = document.createElement('link')
link.rel = 'shortcut icon'
link.type = 'image/svg+xml'
link.href = 'assets/icon.svg'
document.head.appendChild(link)

const ReportLoader: React.FC = () => {
    const [report, setReport] = React.useState<LoadedReport | undefined>()

    React.useEffect(() => {
        const zipReport = new ZipReport()

        zipReport
            .load()
            .then(() => {
                document.getElementById('playwrightReportBase64')?.remove()
                setReport(zipReport)
            })
            .catch((error) => {
                console.error('Failed to load Playwright report:', error)
            })
    }, [])

    return (
        <HashRouter>
            <SearchParamsProvider>
                <AmsterdamPlaywrightReporter>
                    <Routes>
                        <Route
                            path="/dashboard"
                            element={<Dashboard report={report} />}
                        />
                        <Route
                            path="/"
                            element={<ReportView report={report} />}
                        />
                        <Route
                            path="/settings"
                            element={<Settings />}
                        />
                    </Routes>
                </AmsterdamPlaywrightReporter>
            </SearchParamsProvider>
        </HashRouter>
    )
}

window.onload = () => {
    applyTheme()

    ReactDOM
        .createRoot(document.querySelector('#root')!)
        .render(<ReportLoader />)
}

class ZipReport implements LoadedReport {
    private _entries = new Map<string, zipjs.Entry>()
    private _json!: HTMLReport

    async load() {
        const element = document.getElementById('playwrightReportBase64')

        if (!element?.textContent) {
            throw new Error('Playwright report data was not found')
        }

        const zipReader = new zipjs.ZipReader(
            new zipjs.Data64URIReader(element.textContent),
            { useWebWorkers: false },
        )

        for (const entry of await zipReader.getEntries()) {
            this._entries.set(entry.filename, entry)
        }

        this._json = await this.entry('report.json') as HTMLReport
    }

    json(): HTMLReport {
        return this._json
    }

    async entry(name: string): Promise<Object> {
        const reportEntry = this._entries.get(name)

        if (!reportEntry || !('getData' in reportEntry)) {
            throw new Error(
                `Report entry "${name}" was not found or is a directory`,
            )
        }

        const writer = new zipjs.TextWriter()

        await reportEntry.getData(writer)

        return JSON.parse(await writer.getData())
    }
}

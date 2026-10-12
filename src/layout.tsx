'use client'

import { Page, PageFooter, PageHeader } from '@amsterdam/design-system-react'
import { ReactNode } from 'react'

import '@amsterdam/design-system-tokens/dist/compact.theme.css'
import { AmsterdamPlaywrightReporterMenu } from './menu'

function AmsterdamPlaywrightReporter({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div className="ams-theme ams-theme--compact">
            <Page withMenu className="autoSizingPage">
                <PageHeader
                    brandName="Testrapport"
                    className="ams-page__area--header"
                    logoLink="/"
                    logoLinkTitle="Naar de testrapport"
                    noMenuButtonOnWideWindow
                >
                    <AmsterdamPlaywrightReporterMenu />
                </PageHeader>

                <AmsterdamPlaywrightReporterMenu
                    className="ams-page__area--menu"
                    inWideWindow
                />

                <div className="ams-page__area--body">{children}</div>

                <PageFooter className="ams-page__area--footer">
                    <PageFooter.Menu>
                        <PageFooter.MenuLink href="/">
                            GitHub
                        </PageFooter.MenuLink>
                        <PageFooter.MenuLink href="/">
                            English
                        </PageFooter.MenuLink>
                    </PageFooter.Menu>
                </PageFooter>
            </Page>
        </div>
    )
}

export default AmsterdamPlaywrightReporter
'use client'

import { Page, PageFooter, PageHeader } from '@amsterdam/design-system-react'
import { MouseEvent, ReactNode } from 'react'

import '@amsterdam/design-system-tokens/dist/compact.theme.css'
import { AmsterdamPlaywrightReporterMenu } from './menu'
import { kLanguageOptions, Language, useLanguage, useTranslation } from './i18n'

function AmsterdamPlaywrightReporter({
    children,
}: {
    children: ReactNode
}) {
    const { t } = useTranslation()
    const [language, setLanguage] = useLanguage()

    const otherLanguage: Language = language === 'nl' ? 'en' : 'nl'
    const otherLanguageLabel =
        kLanguageOptions.find((option) => option.value === otherLanguage)
            ?.label ?? otherLanguage

    const toggleLanguage = (
        event: MouseEvent<HTMLAnchorElement>,
    ) => {
        event.preventDefault()
        setLanguage(otherLanguage)
    }

    return (
        <div className="ams-theme ams-theme--compact">
            <Page withMenu className="autoSizingPage">
                <PageHeader
                    brandName={t('layout.brandName')}
                    className="ams-page__area--header"
                    logoLink="/"
                    logoLinkTitle={t('layout.logoLinkTitle')}
                    menuItems={
                        <PageHeader.MenuLink
                            fixed
                            href="#"
                            onClick={toggleLanguage}
                        >
                            {otherLanguageLabel}
                        </PageHeader.MenuLink>
                    }
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
                        <PageFooter.MenuLink
                            href="#"
                            onClick={toggleLanguage}
                        >
                            {otherLanguageLabel}
                        </PageFooter.MenuLink>
                    </PageFooter.Menu>
                </PageFooter>
            </Page>
        </div>
    )
}

export default AmsterdamPlaywrightReporter
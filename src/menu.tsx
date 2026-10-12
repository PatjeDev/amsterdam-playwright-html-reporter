import type { MenuProps } from '@amsterdam/design-system-react'
import { Menu } from '@amsterdam/design-system-react'
import type { HTMLAttributes } from 'react'
import { useLocation } from 'react-router-dom'

import { menuItems } from './menuItems'
import { useTranslation } from './i18n'

type AmsterdamPlaywrightReporterMenuProps = HTMLAttributes<HTMLElement> & {
    inWideWindow?: MenuProps['inWideWindow'],
    // defaultExpanded?: MenuProps['defaultExpanded'],
    // expandable?: MenuProps['expandable'],
}

export function AmsterdamPlaywrightReporterMenu(
    props: AmsterdamPlaywrightReporterMenuProps,
) {
    const { pathname } = useLocation()
    const { t } = useTranslation()

    return (
        <Menu {...props}>
            {menuItems.map(({ activePathPrefix, href, icon, textKey }) => {
                const isActive =
                    !!activePathPrefix &&
                    pathname.startsWith(activePathPrefix)

                return (
                    <Menu.Link
                        key={href}
                        href={`#${href}`}
                        icon={icon}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {t(textKey)}
                    </Menu.Link>
                )
            })}
        </Menu>
    )
}

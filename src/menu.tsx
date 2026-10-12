import type { MenuProps } from '@amsterdam/design-system-react'
import { Menu } from '@amsterdam/design-system-react'
import type { HTMLAttributes } from 'react'
import { useLocation } from 'react-router-dom'

import { menuItems } from './menuItems'

type AmsterdamPlaywrightReporterMenuProps = HTMLAttributes<HTMLElement> & {
    inWideWindow?: MenuProps['inWideWindow'],
    // defaultExpanded?: MenuProps['defaultExpanded'],
    // expandable?: MenuProps['expandable'],
}

export function AmsterdamPlaywrightReporterMenu(
    props: AmsterdamPlaywrightReporterMenuProps,
) {
    const { pathname } = useLocation()

    return (
        <Menu {...props}>
            {menuItems.map(({ activePathPrefix, href, icon, text }) => {
                const isActive =
                    !!activePathPrefix &&
                    pathname.startsWith(activePathPrefix)

                return (
                    <Menu.Link
                        key={text}
                        href={`#${href}`}
                        icon={icon}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {text}
                    </Menu.Link>
                )
            })}
        </Menu>
    )
}

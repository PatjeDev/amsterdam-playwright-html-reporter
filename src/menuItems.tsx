import type { IconProps } from '@amsterdam/design-system-react'

import {
  DocumentsIcon,
  PieChartIcon,
  SettingsIcon,
} from '@amsterdam/design-system-react-icons'

type MenuItem = {
  activePathPrefix?: string
  href: string
  icon: IconProps['svg']
  text: string
}

export const menuItems: Array<MenuItem> = [
  {
    activePathPrefix: '/dashboard',
    href: '/dashboard',
    icon: <PieChartIcon />,
    text: 'Dashboard',
  },
  {
    activePathPrefix: '/',
    href: '/',
    icon: <DocumentsIcon />,
    text: 'Rapport',
  },
  {
    activePathPrefix: '/settings',
    href: '/settings',
    icon: <SettingsIcon />,
    text: 'Instellingen',
  },
]
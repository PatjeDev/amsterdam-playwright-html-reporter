import type { IconProps } from '@amsterdam/design-system-react'

import {
  DocumentsIcon,
  PieChartIcon,
  SettingsIcon,
} from '@amsterdam/design-system-react-icons'

import type { TranslationKey } from './i18n'

type MenuItem = {
  activePathPrefix?: string
  href: string
  icon: IconProps['svg']
  textKey: TranslationKey
}

export const menuItems: Array<MenuItem> = [
  {
    activePathPrefix: '/dashboard',
    href: '/dashboard',
    icon: <PieChartIcon />,
    textKey: 'menu.dashboard',
  },
  {
    activePathPrefix: '/',
    href: '/',
    icon: <DocumentsIcon />,
    textKey: 'menu.report',
  },
  {
    activePathPrefix: '/settings',
    href: '/settings',
    icon: <SettingsIcon />,
    textKey: 'menu.settings',
  },
]
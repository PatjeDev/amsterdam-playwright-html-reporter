import type { ComponentType } from 'react'
import type { GridColumnNumbers } from '@amsterdam/design-system-react'

import { useSetting } from '@web/uiUtils'
import type { AnalyticsData } from '../analytics/analytics'
import type { TranslationKey } from '../i18n'

import { OutcomeChart } from './OutcomeChart'
import { SuiteComparison } from './SuiteComparison'
import { BrowserMatrix } from './BrowserMatrix'
import { RetryAnalyzer } from './RetryAnalyzer'
import { SlowestTests } from './SlowestTests'
import { FailureHotspots } from './FailureHotspots'

export type WidgetWidth = 'third' | 'half' | 'twoThirds' | 'full'

export type WidgetDefinition = {
    id: string
    titleKey: TranslationKey
    component: ComponentType<{ data: AnalyticsData }>
    defaultWidth: WidgetWidth
}

export const WIDGETS: WidgetDefinition[] = [
    {
        id: 'outcomes',
        titleKey: 'widget.outcomes.title',
        component: OutcomeChart,
        defaultWidth: 'half',
    },
    {
        id: 'suite',
        titleKey: 'widget.suite.title',
        component: SuiteComparison,
        defaultWidth: 'half',
    },
    {
        id: 'browser',
        titleKey: 'widget.browser.title',
        component: BrowserMatrix,
        defaultWidth: 'full',
    },
    {
        id: 'retry',
        titleKey: 'widget.retry.title',
        component: RetryAnalyzer,
        defaultWidth: 'half',
    },
    {
        id: 'slowest',
        titleKey: 'widget.slowest.title',
        component: SlowestTests,
        defaultWidth: 'half',
    },
    {
        id: 'hotspots',
        titleKey: 'widget.hotspots.title',
        component: FailureHotspots,
        defaultWidth: 'half',
    },
]

export const widgetWidthOptions: WidgetWidth[] = [
    'third',
    'half',
    'twoThirds',
    'full',
]

export const widgetWidthLabelKeys: Record<WidgetWidth, TranslationKey> = {
    third: 'width.third',
    half: 'width.half',
    twoThirds: 'width.twoThirds',
    full: 'width.full',
}

export const widgetWidthSpans: Record<WidgetWidth, GridColumnNumbers> = {
    third: { narrow: 4, medium: 4, wide: 4 },
    half: { narrow: 4, medium: 4, wide: 6 },
    twoThirds: { narrow: 4, medium: 8, wide: 8 },
    full: { narrow: 4, medium: 8, wide: 12 },
}

export type DashboardLayout = {
    order: string[]
    widths: Record<string, WidgetWidth>
    hidden: string[]
}

export function defaultDashboardLayout(): DashboardLayout {
    return {
        order: WIDGETS.map((widget) => widget.id),
        widths: Object.fromEntries(
            WIDGETS.map((widget) => [widget.id, widget.defaultWidth]),
        ) as Record<string, WidgetWidth>,
        hidden: [],
    }
}

const kLayoutSettingsKey = 'dashboard.layout'

export function useWidgetLayout() {
    const [stored, setStored] = useSetting<DashboardLayout>(
        kLayoutSettingsKey,
        defaultDashboardLayout(),
    )

    const knownIds = WIDGETS.map((widget) => widget.id)
    const storedOrder = stored.order ?? []

    const order = [
        ...storedOrder.filter((id) => knownIds.includes(id)),
        ...knownIds.filter((id) => !storedOrder.includes(id)),
    ]

    const widths: Record<string, WidgetWidth> = {}
    for (const widget of WIDGETS)
        widths[widget.id] = stored.widths?.[widget.id] ?? widget.defaultWidth

    const hidden = (stored.hidden ?? []).filter((id) => knownIds.includes(id))
    const hiddenSet = new Set(hidden)

    const orderedWidgets = order
        .map((id) => WIDGETS.find((widget) => widget.id === id))
        .filter((widget): widget is WidgetDefinition => !!widget)

    const visibleWidgets = orderedWidgets.filter(
        (widget) => !hiddenSet.has(widget.id),
    )

    const persist = (next: Partial<DashboardLayout>) =>
        setStored({ order, widths, hidden, ...next })

    const setWidth = (id: string, width: WidgetWidth) => {
        persist({ widths: { ...widths, [id]: width } })
    }

    const moveWidget = (draggedId: string, targetId: string) => {
        if (draggedId === targetId) return

        const fromIndex = order.indexOf(draggedId)
        const toIndex = order.indexOf(targetId)

        if (fromIndex === -1 || toIndex === -1) return

        const next = order.filter((id) => id !== draggedId)
        const targetIndex = next.indexOf(targetId)

        // Drop after the target when moving a widget forward (towards the end)
        // and before it when moving backward, so reordering works in both
        // directions instead of always landing before the target.
        const insertIndex = fromIndex < toIndex ? targetIndex + 1 : targetIndex

        next.splice(insertIndex, 0, draggedId)
        persist({ order: next })
    }

    const isWidgetVisible = (id: string) => !hiddenSet.has(id)

    const setWidgetVisible = (id: string, visible: boolean) => {
        const nextHidden = visible
            ? hidden.filter((hiddenId) => hiddenId !== id)
            : hidden.includes(id)
              ? hidden
              : [...hidden, id]
        persist({ hidden: nextHidden })
    }

    const resetLayout = () => setStored(defaultDashboardLayout())

    const defaults = defaultDashboardLayout()
    const isDefaultLayout =
        hidden.length === 0 &&
        order.length === defaults.order.length &&
        order.every((id, index) => id === defaults.order[index]) &&
        WIDGETS.every((widget) => widths[widget.id] === widget.defaultWidth)

    return {
        orderedWidgets,
        visibleWidgets,
        widths,
        setWidth,
        moveWidget,
        isWidgetVisible,
        setWidgetVisible,
        resetLayout,
        isDefaultLayout,
    }
}

import {
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react'

type ColumnSpans = {
    narrow: number
    medium: number
    wide: number
}

export function MasonryGrid({ children }: { children: ReactNode }) {
    return <div className="widget-masonry">{children}</div>
}

/**
 * A single masonry cell. It keeps the per-widget column width (via the
 * responsive span CSS variables) while measuring its natural height so it can
 * span the right number of implicit grid rows. Combined with
 * `grid-auto-flow: dense` on the container, this packs widgets of different
 * heights tightly instead of leaving vertical gaps.
 */
export function MasonryItem({
    columnSpans,
    children,
}: {
    columnSpans: ColumnSpans
    children: ReactNode
}) {
    const innerRef = useRef<HTMLDivElement>(null)
    const [rowSpan, setRowSpan] = useState(1)

    useLayoutEffect(() => {
        const inner = innerRef.current
        if (!inner) return

        const grid = inner.closest('.widget-masonry') as HTMLElement | null

        const measure = () => {
            const styles = grid ? getComputedStyle(grid) : null
            const rowUnit = styles ? parseFloat(styles.gridAutoRows) || 1 : 1
            // Match the vertical spacing to the horizontal column gap. The grid
            // uses row-gap: 0 and a small row unit, so the gap is folded into
            // the row span and the rounding overshoot stays below one row unit.
            const gap = styles ? parseFloat(styles.columnGap) || 0 : 0
            const height = inner.getBoundingClientRect().height

            setRowSpan(Math.max(1, Math.ceil((height + gap) / rowUnit)))
        }

        measure()

        const observer = new ResizeObserver(measure)
        observer.observe(inner)
        if (grid) observer.observe(grid)

        return () => observer.disconnect()
    }, [])

    const style = {
        '--span-narrow': columnSpans.narrow,
        '--span-medium': columnSpans.medium,
        '--span-wide': columnSpans.wide,
        '--row-span': rowSpan,
    } as CSSProperties

    return (
        <div className="widget-masonry__item" style={style}>
            <div ref={innerRef} className="widget-masonry__item-inner">
                {children}
            </div>
        </div>
    )
}

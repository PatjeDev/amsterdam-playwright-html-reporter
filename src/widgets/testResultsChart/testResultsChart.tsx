import {
    Card,
    Heading,
} from '@amsterdam/design-system-react'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

import { Stats } from '../../types'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
)

export type TestResultsChartProps = {
    stats: Stats
}

export function TestResultsChart({
    stats
}: TestResultsChartProps) {
    const data = {
        labels: [
            'Geslaagd',
            'Mislukt',
            'Onbetrouwbaar',
            'Overgeslagen',
        ],
        datasets: [
            {
                data: [
                    stats.expected,
                    stats.unexpected,
                    stats.flaky,
                    stats.skipped,
                ],
                backgroundColor: [
                    '#00893c',
                    '#ec0000',
                    '#ff9100',
                    '#009de6',
                ],
                borderWidth: 0,
            },
        ],
    }

    const total = stats.expected + stats.unexpected + stats.flaky + stats.skipped;

    return (
        <Card className="ams-gap-m">
            <Heading level={3} size="level-4">
                Testresultaten
            </Heading>

            <div style={{ maxWidth: 360 }}>
                <Doughnut
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                        },
                    }}
                />
            </div>

            <p>
                Een totaal van <strong>{total}</strong> testen
            </p>
        </Card>
    )
}

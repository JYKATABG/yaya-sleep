import { AreaChart } from "@mantine/charts";
import { useSleep } from "../../../contexts/SleepContext"

export const MonthlyEfficiencyChart = () => {
    const { logs } = useSleep();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = logs
        .filter(log => new Date(log.date) >= thirtyDaysAgo)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(log => ({
            date: new Intl.DateTimeFormat("en-US", { day: 'numeric', month: 'short' }).format(new Date(log.date + "T12:00:00")),
            hours: Number((log.duration_min / 60).toFixed(1))
        }))

    return (
        <div style={{ width: '100%', padding: '0 10px' }}>
            <AreaChart
                h={200}
                data={data}
                dataKey="date"
                series={[{ name: 'hours', color: '#39c9bb', label: 'Hours' }]}
                curveType="monotone"
                tickLine="y"
                gridAxis="xy"
                withDots={data.length < 15}
                valueFormatter={(value) => `${value}h`}
            />
        </div>
    )
}
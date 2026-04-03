import { AreaChart } from "@mantine/charts";
import { useSleep } from "../../../contexts/SleepContext"

export const MonthlyEfficiencyChart = () => {
    const { logs } = useSleep();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const groupedData = logs
        .filter(log => new Date(log.date) >= thirtyDaysAgo)
        .reduce((acc, log) => {
            const dateKey = log.date;
            acc[dateKey] = (acc[dateKey] || 0) + log.duration_min;
            return acc;
        }, {})


    const data = Object.keys(groupedData)
        .sort()
        .map(dateKey => ({
            date: new Intl.DateTimeFormat("en-US", { day: 'numeric', month: 'short' })
                .format(new Date(dateKey + "T12:00:00")),
            hours: Number((groupedData[dateKey] / 60).toFixed(1))
        }))

    return (
        <div style={{ width: '100%', height: '200px', minHeight: '200px' }}>
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
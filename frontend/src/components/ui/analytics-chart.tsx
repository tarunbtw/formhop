import { useState } from 'react'
import { cn } from '../../lib/utils'

export interface TimelineDataPoint {
  date: string
  label: string
  count: number
}

interface AnalyticsChartProps {
  data: TimelineDataPoint[]
  className?: string
  height?: number
  title?: string
  description?: string
}

export function AnalyticsChart({
  data,
  className,
  height = 240,
  title = 'Submissions Over Time',
  description = 'Daily inbound submission volume over the past 14 days',
}: AnalyticsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '14d'>('14d')

  const displayData = timeRange === '7d' ? data.slice(-7) : data
  const counts = displayData.map((d) => d.count)
  const maxCount = Math.max(...counts, 4) // minimum ceiling so chart has scale even with 0 or 1
  const totalInPeriod = counts.reduce((acc, c) => acc + c, 0)

  // Chart coordinate geometry
  const width = 800
  const paddingX = 40
  const paddingTop = 20
  const paddingBottom = 40
  const chartWidth = width - paddingX * 2
  const chartHeight = height - paddingTop - paddingBottom

  const points = displayData.map((d, i) => {
    const x = paddingX + (i / Math.max(displayData.length - 1, 1)) * chartWidth
    const y = paddingTop + chartHeight - (d.count / maxCount) * chartHeight
    return { x, y, ...d }
  })

  // Generate SVG path strings
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`
    const prev = arr[i - 1]
    const cpX1 = prev.x + (pt.x - prev.x) / 2
    const cpY1 = prev.y
    const cpX2 = prev.x + (pt.x - prev.x) / 2
    const cpY2 = pt.y
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`
  }, '')

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : ''

  // Y-axis ticks
  const yTicks = [0, Math.round(maxCount / 2), maxCount]

  return (
    <div className={cn('rounded-lg border border-border bg-card p-5', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <span className="text-xs text-muted-foreground">
              · {totalInPeriod} {totalInPeriod === 1 ? 'submission' : 'submissions'}
            </span>
          </div>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>

        <div className="flex items-center gap-1 self-start sm:self-auto bg-muted/60 p-0.5 rounded-md border border-border">
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded transition-colors',
              timeRange === '7d'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            7d
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('14d')}
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded transition-colors',
              timeRange === '14d'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            14d
          </button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" className="text-primary" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.00" className="text-primary" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((val) => {
            const y = paddingTop + chartHeight - (val / maxCount) * chartHeight
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-border"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px] font-mono"
                >
                  {val}
                </text>
              </g>
            )
          })}

          {/* Area fill */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#chartGradient)"
            />
          )}

          {/* Smooth line curve */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />
          )}

          {/* Interactive dots and hover hitboxes */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i
            return (
              <g key={pt.date}>
                {/* Hit area */}
                <rect
                  x={pt.x - chartWidth / (displayData.length * 2)}
                  y={paddingTop}
                  width={chartWidth / displayData.length}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Point dot: only show when hovered or has count */}
                {(isHovered || pt.count > 0) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 4.5 : 2.5}
                    className={cn(
                      'transition-all duration-150',
                      isHovered
                        ? 'fill-background stroke-primary stroke-[2.5]'
                        : 'fill-primary stroke-background stroke-1'
                    )}
                  />
                )}

                {/* X axis labels (stagger on smaller counts) */}
                {(displayData.length <= 7 || i % 2 === 0 || i === displayData.length - 1) && (
                  <text
                    x={pt.x}
                    y={height - 12}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[11px] font-medium"
                  >
                    {pt.label}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-1.5 shadow-md transition-all"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${Math.max(10, (points[hoveredIndex].y / height) * 100 - 35)}%`,
            }}
          >
            <p className="text-[11px] font-medium text-muted-foreground">
              {points[hoveredIndex].label}
            </p>
            <p className="text-sm font-bold text-popover-foreground">
              {points[hoveredIndex].count} {points[hoveredIndex].count === 1 ? 'submission' : 'submissions'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


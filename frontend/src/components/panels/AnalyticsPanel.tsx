'use client';

import { useAppStore } from '@/store/useAppStore';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function AnalyticsPanel() {
  const { clickedPoint } = useAppStore();
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clickedPoint?.timeSeries || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      title: {
        text: 'Sea Level Anomaly Time Series',
        left: 'center',
        textStyle: {
          color: '#374151',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: { axisValue: string; seriesName: string; value: number }[]) => {
          const data = params[0];
          return `${data.axisValue}<br/>${data.seriesName}: ${data.value} mm`;
        },
      },
      xAxis: {
        type: 'category',
        data: clickedPoint.timeSeries.data.map(d => d.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          },
        },
      },
      yAxis: {
        type: 'value',
        name: 'SLA (mm)',
        nameTextStyle: {
          color: '#374151',
        },
      },
      series: [
        {
          name: 'Sea Level Anomaly',
          type: 'line',
          data: clickedPoint.timeSeries.data.map(d => d.value),
          smooth: true,
          lineStyle: {
            color: '#3B82F6',
            width: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
              ],
            },
          },
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [clickedPoint]);

  if (!clickedPoint) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <p>Click on the map to view analytics</p>
      </div>
    );
  }

  const { elevation, seaLevel, stats } = clickedPoint;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Location Analytics
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Elevation</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {elevation?.toFixed(1)}m
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Sea Level</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {seaLevel?.toFixed(1)}mm
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Mean SLA</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.mean.toFixed(1)}mm
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Trend</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.trend.toFixed(1)}mm/yr
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Min</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.min.toFixed(1)}mm
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Max</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.max.toFixed(1)}mm
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
          Time Series Chart
        </h4>
        <div 
          ref={chartRef} 
          className="w-full h-64"
          style={{ minHeight: '256px' }}
        />
      </div>
    </div>
  );
}

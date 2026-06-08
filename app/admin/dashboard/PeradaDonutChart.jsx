'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function PeradaDonutChart({ selesai, sidang, penyelidikan, total }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;

    // Destroy existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    
    // If total is 0, we show a grey circle
    const isEmpty = total === 0;
    const dataValues = isEmpty ? [1] : [selesai, sidang, penyelidikan];
    const backgroundColors = isEmpty 
      ? ['#e2e8f0'] 
      : ['#10b981', '#8b5cf6', '#f59e0b'];
    const hoverColors = isEmpty 
      ? ['#cbd5e1'] 
      : ['#059669', '#7c3aed', '#d97706'];
    const labels = isEmpty
      ? ['Belum Ada Data']
      : ['Kasus Selesai', 'Sidang Tipiring', 'Penyelidikan'];

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverColors,
          borderWidth: 0,
          cutout: '75%',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Legend handled by custom UI
          },
          tooltip: {
            enabled: !isEmpty,
            backgroundColor: '#0f172a',
            titleFont: { size: 11, weight: 'bold' },
            bodyFont: { size: 11 },
            padding: 8,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const val = context.raw;
                const pct = total ? Math.round((val / total) * 100) : 0;
                return ` ${context.label}: ${val} (${pct}%)`;
              }
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: true,
        },
        animation: {
          duration: 750,
          easing: 'easeOutQuart',
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [selesai, sidang, penyelidikan, total]);

  return (
    <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
      <div className="w-full h-full">
        <canvas ref={canvasRef} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center flex-col leading-none select-none pointer-events-none">
        <span className="text-2xl font-black text-slate-800">{total}</span>
        <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Total Berkas</span>
      </div>
    </div>
  );
}

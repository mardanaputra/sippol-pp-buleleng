'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function UrgencyDonutChart({ darurat, sedang, rendah, total }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    
    const isEmpty = total === 0;
    const dataValues = isEmpty ? [1] : [darurat, sedang, rendah];
    const backgroundColors = isEmpty 
      ? ['#e2e8f0'] 
      : ['#ef4444', '#f59e0b', '#10b981'];
    const hoverColors = isEmpty 
      ? ['#cbd5e1'] 
      : ['#dc2626', '#d97706', '#059669'];
    const labels = isEmpty
      ? ['Belum Ada Data']
      : ['Darurat', 'Sedang', 'Rendah'];

    const pctDarurat = total ? Math.round((darurat / total) * 100) : 0;

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
            display: false,
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
  }, [darurat, sedang, rendah, total]);

  const pctDarurat = total ? Math.round((darurat / total) * 100) : 0;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
      <div className="w-full h-full">
        <canvas ref={canvasRef} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center flex-col leading-none select-none pointer-events-none">
        <span className="text-2xl font-black text-rose-600">{pctDarurat}%</span>
        <span className="text-[8px] text-slate-450 font-extrabold uppercase tracking-widest mt-1">Urgensi Darurat</span>
      </div>
    </div>
  );
}

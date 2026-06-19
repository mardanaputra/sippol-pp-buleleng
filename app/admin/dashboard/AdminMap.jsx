'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Layers, MapPin, Shield, Info, Maximize2 } from 'lucide-react';

export default function AdminMap({
  reports = [],
  trantibLogs = [],
  linmasMembers = [],
  peradaEnforcements = [],
  selectedKecamatan,
  setSelectedKecamatan,
  hoveredKecamatan,
  setHoveredKecamatan,
  bulelengMapData = []
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  const reportsLayerRef = useRef(null);
  const trantibLayerRef = useRef(null);

  // Local states for UI toggles
  const [boundaryType, setBoundaryType] = useState('kecamatan'); // 'kecamatan' or 'desa'
  const [showReports, setShowReports] = useState(true);
  const [showTrantib, setShowTrantib] = useState(true);
  const [kecamatanGeoJson, setKecamatanGeoJson] = useState(null);
  const [desaGeoJson, setDesaGeoJson] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [LInstance, setLInstance] = useState(null);

  // 1. Fetch GeoJSON files on mount
  useEffect(() => {
    fetch('/data-spatials/batas-kecamatan-buleleng.json')
      .then((res) => res.json())
      .then((data) => setKecamatanGeoJson(data))
      .catch((err) => console.error('Failed to load kecamatan geojson:', err));

    fetch('/data-spatials/batas-desa-buleleng.json')
      .then((res) => res.json())
      .then((data) => setDesaGeoJson(data))
      .catch((err) => console.error('Failed to load desa geojson:', err));
  }, []);

  // 2. Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let map;
    // Dynamically import Leaflet to avoid SSR window errors
    import('leaflet').then((L) => {
      setLInstance(L);

      // Clean up existing map if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize Map centered on Buleleng
      map = L.map(mapContainerRef.current, {
        zoomControl: false, // We'll add it in a custom position
        attributionControl: true
      }).setView([-8.22, 115.08], 10);

      mapInstanceRef.current = map;

      // Add Zoom Control in top left
      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Add CartoDB Positron Tile Layer (Premium, sleek light theme map)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Create Layer Groups
      reportsLayerRef.current = L.layerGroup().addTo(map);
      trantibLayerRef.current = L.layerGroup().addTo(map);

      setMapLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Helper: Find map data config for a given Kecamatan name
  const getKecConfig = (kecName) => {
    if (!kecName) return null;
    return bulelengMapData.find(
      (k) => k.name.toLowerCase() === kecName.toLowerCase()
    );
  };

  // Helper: Determine color based on rawan status
  const getRawanColor = (rawan) => {
    switch (rawan) {
      case 'Rawan Tinggi':
        return '#ef4444'; // Red
      case 'Rawan Sedang':
        return '#f97316'; // Orange
      case 'Aman':
        return '#3b82f6'; // Blue
      default:
        return '#94a3b8'; // Slate
    }
  };

  // 3. Render Polygons (GeoJSON Boundaries)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LInstance;
    if (!map || !L) return;

    // Remove old geojson layer if exists
    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
    }

    const geojsonData = boundaryType === 'kecamatan' ? kecamatanGeoJson : desaGeoJson;
    if (!geojsonData) return;

    // Style helper for polygons
    const getFeatureStyle = (feature) => {
      const isKec = boundaryType === 'kecamatan';
      const name = isKec ? feature.properties.NAMOBJ : feature.properties.WADMKC;
      const config = getKecConfig(name);
      const baseColor = config ? getRawanColor(config.rawan) : '#94a3b8';
      
      const featureId = isKec 
        ? feature.properties.NAMOBJ?.toLowerCase() 
        : feature.properties.NAMOBJ?.toLowerCase() + '-' + feature.properties.WADMKC?.toLowerCase();

      // Check if hovered or selected
      const isCurrentKecHovered = isKec && hoveredKecamatan === feature.properties.NAMOBJ?.toLowerCase();
      const isCurrentKecSelected = isKec && selectedKecamatan === feature.properties.NAMOBJ?.toLowerCase();

      // For Desa, check if parent Kecamatan is hovered/selected
      const isParentKecHovered = !isKec && hoveredKecamatan === feature.properties.WADMKC?.toLowerCase();
      const isParentKecSelected = !isKec && selectedKecamatan === feature.properties.WADMKC?.toLowerCase();

      const isActive = isCurrentKecHovered || isCurrentKecSelected || isParentKecHovered || isParentKecSelected;

      return {
        fillColor: baseColor,
        weight: isActive ? 3 : 1.5,
        opacity: 1,
        color: isActive ? '#0B1E43' : '#ffffff',
        fillOpacity: isActive ? 0.75 : 0.45,
        dashArray: isKec ? '' : '3'
      };
    };

    // Create GeoJSON Layer
    geojsonLayerRef.current = L.geoJSON(geojsonData, {
      style: getFeatureStyle,
      onEachFeature: (feature, layer) => {
        const isKec = boundaryType === 'kecamatan';
        const name = feature.properties.NAMOBJ;
        const parentKec = feature.properties.WADMKC;
        
        // Match config for tooltip & details
        const config = getKecConfig(isKec ? name : parentKec);

        // Calculate counts dynamically for tooltips
        const nameLower = (isKec ? name : parentKec)?.toLowerCase();
        
        const reklameCount = trantibLogs.filter(l => {
          const isKecMatch = `${l.lokasi} ${l.keterangan}`.toLowerCase().includes(nameLower);
          const isReklame = l.jenis_pelanggaran?.includes('Reklame') || l.jenis_pelanggaran?.includes('Iklan') || l.jenis_pelanggaran?.includes('Baliho');
          return isKecMatch && isReklame;
        }).length;

        const pklCount = trantibLogs.filter(l => {
          const isKecMatch = `${l.lokasi} ${l.keterangan}`.toLowerCase().includes(nameLower);
          const isPkl = l.jenis_pelanggaran?.includes('PKL') || l.jenis_pelanggaran?.includes('Zonasi') || l.jenis_pelanggaran?.includes('Kaki Lima') || l.jenis_pelanggaran?.includes('Pedagang');
          return isKecMatch && isPkl;
        }).length;

        const satlinmasCount = linmasMembers
          .filter(m => m.kecamatan?.toLowerCase() === nameLower)
          .reduce((acc, curr) => acc + (curr.anggota_pria || 0) + (curr.anggota_wanita || 0), 0);

        const peradaCount = peradaEnforcements.filter(p => {
          const text = `${p.lokasi_kejadian} ${p.alamat_pelanggar} ${p.kronologi_singkat}`.toLowerCase();
          return text.includes(nameLower);
        }).length;

        // Bind Tooltip
        const tooltipContent = isKec
          ? `<div class="p-2 font-bold text-xs max-w-[220px]">
              <span class="text-[#0B1E43] uppercase font-black block border-b border-slate-100 pb-1 mb-1.5">${name}</span>
              <div class="space-y-1 text-[10px] text-slate-500 font-semibold">
                <div>Status: <span class="font-extrabold" style="color: ${getRawanColor(config?.rawan)}">${config?.rawan || 'Unknown'}</span></div>
                <div class="flex justify-between gap-4"><span>Reklame/Baliho:</span> <span class="font-extrabold text-[#E28A1C]">${reklameCount}</span></div>
                <div class="flex justify-between gap-4"><span>Penertiban PKL:</span> <span class="font-extrabold text-[#E28A1C]">${pklCount}</span></div>
                <div class="flex justify-between gap-4"><span>Satlinmas:</span> <span class="font-extrabold text-blue-600">${satlinmasCount}</span></div>
                <div class="flex justify-between gap-4"><span>Penegakan Perda:</span> <span class="font-extrabold text-[#561C24]">${peradaCount}</span></div>
              </div>
             </div>`
          : `<div class="p-1 font-bold text-xs">
              <span class="text-[#0B1E43] uppercase font-black">Desa ${name}</span>
              <div class="text-[10px] text-slate-550 font-bold">Kec. ${parentKec}</div>
              <div class="mt-1 text-[9px] text-slate-400">Luas Wilayah: ${feature.properties.LUASWH?.toFixed(2) || 0} Ha</div>
             </div>`;

        layer.bindTooltip(tooltipContent, {
          sticky: true,
          className: 'custom-leaflet-tooltip bg-white rounded-xl shadow-lg border border-slate-100 p-1.5'
        });

        // Event handlers
        layer.on({
          mouseover: () => {
            if (isKec) {
              setHoveredKecamatan(name.toLowerCase());
            } else {
              setHoveredKecamatan(parentKec.toLowerCase());
            }
          },
          mouseout: () => {
            setHoveredKecamatan(null);
          },
          click: (e) => {
            const targetKec = isKec ? name.toLowerCase() : parentKec.toLowerCase();
            
            // Toggle selected Kecamatan
            if (selectedKecamatan === targetKec) {
              setSelectedKecamatan(null);
              map.setView([-8.22, 115.08], 10); // zoom out to center
            } else {
              setSelectedKecamatan(targetKec);
              // Zoom map to the bounds of the clicked boundary polygon
              map.fitBounds(e.target.getBounds(), {
                padding: [40, 40],
                maxZoom: 13,
                animate: true,
                duration: 0.8
              });
            }
          }
        });
      }
    }).addTo(map);

  }, [
    boundaryType,
    kecamatanGeoJson,
    desaGeoJson,
    selectedKecamatan,
    hoveredKecamatan,
    LInstance
  ]);

  // 4. Render Markers (Reports & Patrol Logs)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LInstance;
    if (!map || !L) return;

    // Clear old markers
    reportsLayerRef.current.clearLayers();
    trantibLayerRef.current.clearLayers();

    // 4a. Add Citizen Report Markers
    if (showReports) {
      reports.forEach((report) => {
        const lat = parseFloat(report.latitude);
        const lng = parseFloat(report.longitude);

        // Verify valid Buleleng coordinates
        if (
          isNaN(lat) ||
          isNaN(lng) ||
          lat === 0 ||
          lng === 0 ||
          lat > -8.0 ||
          lat < -8.5 ||
          lng < 114.4 ||
          lng > 115.6
        ) {
          return;
        }

        // Custom pulsing marker html
        const statusColor = report.status_laporan === 'Pending' ? '#ef4444' : report.status_laporan === 'Process' ? '#f59e0b' : '#10b981';
        const markerHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-7 h-7 rounded-full animate-ping" style="background-color: ${statusColor}33"></div>
            <div class="relative w-4.5 h-4.5 rounded-full border-2 border-white shadow flex items-center justify-center" style="background-color: ${statusColor}">
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-report-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const popupContent = `
          <div class="p-3 font-semibold text-xs text-slate-800 max-w-[220px]">
            <div class="flex justify-between items-center mb-1.5 pb-1 border-b border-slate-100">
              <span class="font-mono text-[10px] font-black text-slate-500">${report.id_tiket}</span>
              <span class="text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider text-white" style="background-color: ${statusColor}">
                ${report.status_laporan}
              </span>
            </div>
            <h4 class="font-black text-[11px] mb-1 text-slate-900">${report.kategori_masalah}</h4>
            <p class="text-[10px] text-slate-500 italic line-clamp-3 mb-2">"${report.kronologi}"</p>
            <div class="text-[9px] text-slate-400 font-bold flex items-center gap-1">
              <span class="bg-slate-100 px-1.5 py-0.5 rounded">WhatsApp: ${report.nomor_whatsapp}</span>
            </div>
          </div>
        `;

        L.marker([lat, lng], { icon: customIcon })
          .bindPopup(popupContent, {
            className: 'custom-leaflet-popup'
          })
          .addTo(reportsLayerRef.current);
      });
    }

    // 4b. Add Penertiban K3 (Trantibum) markers
    if (showTrantib) {
      trantibLogs.forEach((log) => {
        const lat = parseFloat(log.latitude);
        const lng = parseFloat(log.longitude);

        if (
          isNaN(lat) ||
          isNaN(lng) ||
          lat === 0 ||
          lng === 0 ||
          lat > -8.0 ||
          lat < -8.5 ||
          lng < 114.4 ||
          lng > 115.6
        ) {
          return;
        }

        // Custom marker for law enforcement (gold/purple shield look)
        const markerHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-7 h-7 bg-amber-500/20 rounded-full animate-pulse"></div>
            <div class="relative w-4.5 h-4.5 bg-amber-600 rounded-full border-2 border-white shadow flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-2.5 h-2.5">
                <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/>
              </svg>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-trantib-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const popupContent = `
          <div class="p-3 font-semibold text-xs text-slate-800 max-w-[220px]">
            <div class="flex justify-between items-center mb-1.5 pb-1 border-b border-slate-100">
              <span class="font-mono text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">${log.no_formulir}</span>
              <span class="text-[8px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                K3 Penertiban
              </span>
            </div>
            <h4 class="font-black text-[11px] mb-1 text-slate-900">${log.jenis_pelanggaran}</h4>
            <div class="text-[10px] text-slate-650 font-bold mb-1">Pelanggar: <span class="text-slate-850 font-extrabold">${log.nama_pelanggar}</span></div>
            <p class="text-[9.5px] text-slate-500 italic mb-2 line-clamp-2">"${log.keterangan}"</p>
            <div class="bg-amber-50 text-amber-800 p-1.5 rounded text-[9px] font-extrabold">
              Tindakan: ${log.tindakan_diambil}
            </div>
          </div>
        `;

        L.marker([lat, lng], { icon: customIcon })
          .bindPopup(popupContent, {
            className: 'custom-leaflet-popup'
          })
          .addTo(trantibLayerRef.current);
      });
    }

  }, [reports, trantibLogs, showReports, showTrantib, LInstance]);

  return (
    <div className="w-full h-[380px] sm:h-[480px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
      {/* Top Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 select-none">
        {/* Left: Boundary Type Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Batas Wilayah:
          </span>
          <div className="inline-flex rounded-lg bg-slate-200/60 p-0.5 border border-slate-200">
            <button
              onClick={() => setBoundaryType('kecamatan')}
              className={`px-3 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                boundaryType === 'kecamatan'
                  ? 'bg-[#0B1E43] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kecamatan
            </button>
            <button
              onClick={() => setBoundaryType('desa')}
              className={`px-3 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                boundaryType === 'desa'
                  ? 'bg-[#0B1E43] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Desa
            </button>
          </div>
        </div>

        {/* Right: Layer Checkboxes */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Filter Titik:
          </span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 select-none">
              <input
                type="checkbox"
                checked={showReports}
                onChange={(e) => setShowReports(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
                Aduan Warga ({reports.length})
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 select-none">
              <input
                type="checkbox"
                checked={showTrantib}
                onChange={(e) => setShowTrantib(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                Penertiban K3 ({trantibLogs.length})
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full flex-1 relative"
        style={{ outline: 'none' }}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 z-20 font-bold text-xs text-slate-500 space-x-2">
            <svg className="animate-spin h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Memuat Peta Spasial...</span>
          </div>
        )}
      </div>
      
      {/* Mini Leaflet Style Overrides */}
      <style jsx global>{`
        .leaflet-pane {
          z-index: 5 !important;
        }
        .leaflet-top,
        .leaflet-bottom {
          z-index: 10 !important;
        }
        .custom-leaflet-tooltip {
          font-family: inherit;
          color: #1e293b;
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04) !important;
          border-radius: 0.75rem !important;
          opacity: 1 !important;
        }
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 0.75rem !important;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .custom-leaflet-popup .leaflet-popup-tip-container {
          display: none; /* Hide standard ugly triangle tip */
        }
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}


import { useEffect, useRef } from 'react';
import { load } from '@2gis/mapgl';
import dtpData from './data/demo-data.json';

export default function MapGL() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        load().then((mapglAPI: any) => {
            const map = new mapglAPI.Map(containerRef.current, {
                center: [31.2740, 58.5213],
                zoom: 11,
                key: 'd55a8e03-2d27-4430-8676-15d7eb8190d8',
                style: '4cb18ed4-8753-4dad-97d7-89b551b67acb',
            });
            
            // Иммерсивные эффекты
            if (map.setGlobeEnabled) map.setGlobeEnabled(true);
            if (map.setImmersiveRoadsEnabled) map.setImmersiveRoadsEnabled(true);
            if (map.setTrafficEnabled) map.setTrafficEnabled(true);
            if (map.setFog) map.setFog({ color: '#a8d0e6', density: 0.08 });
            if (map.setLight) map.setLight({ position: [1.5, 0.5, 1.0], color: '#ffffff', intensity: 1.2 });

            mapRef.current = map;

            map.on('styleload', () => {
                // Источник данных (те же точки)
                const source = new mapglAPI.GeoJsonSource(map, {
                    data: dtpData,
                    attributes: { visible: true },
                });

                // 🔥 ТЕПЛОВАЯ КАРТА (heatmap) вместо точек
                const heatmapLayer = {
                    id: 'dtp-heatmap',
                    filter: ['match', ['sourceAttr', 'visible'], [true], true, false],
                    type: 'heatmap',
                    style: {
                        // Цвета тепловой карты (от холодного к горячему)
                        color: [
    'interpolate', ['linear'], ['heatmap-density'],
    0, 'rgba(200, 200, 255, 0)',
    0.2, 'rgba(150, 200, 255, 0.5)',
    0.4, 'rgba(100, 200, 100, 0.6)',
    0.6, 'rgba(255, 200, 0, 0.8)',
    0.8, 'rgba(255, 100, 0, 0.9)',
    1, 'rgba(255, 0, 0, 1)'
],
                        radius: 35,      // радиус влияния каждой точки
                        intensity: 0.9,  // интенсивность тепловой карты
                        opacity: 0.85,   // прозрачность
                    },
                };

                map.addLayer(heatmapLayer);
                console.log('✅ Тепловая карта добавлена, точек:', dtpData.features.length);
            });
        }).catch(console.error);

        return () => {
            if (mapRef.current) mapRef.current.destroy();
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}
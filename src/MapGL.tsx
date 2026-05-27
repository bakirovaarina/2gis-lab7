import { useEffect, useRef } from 'react';
import { load } from '@2gis/mapgl';
import dtpData from './data/dtp-data.json';

export default function MapGL() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        load().then((mapglAPI: any) => {
            const map = new mapglAPI.Map(containerRef.current, {
                center: [31.2740, 58.5213],
                zoom: 12,
                key: 'd55a8e03-2d27-4430-8676-15d7eb8190d8',
                style: '4cb18ed4-8753-4dad-97d7-89b551b67acb',
            });
            
            if (map.setGlobeEnabled) map.setGlobeEnabled(true);
            if (map.setImmersiveRoadsEnabled) map.setImmersiveRoadsEnabled(true);
            if (map.setTrafficEnabled) map.setTrafficEnabled(true);
            if (map.setFog) map.setFog({ color: '#a8d0e6', density: 0.08 });
            if (map.setLight) map.setLight({ position: [1.5, 0.5, 1.0], color: '#ffffff', intensity: 1.2 });

            mapRef.current = map;

            map.on('styleload', () => {
                const source = new mapglAPI.GeoJsonSource(map, {
                    data: dtpData,
                    attributes: { visible: true },
                });

                // Единый слой: и иконки, и подписи
                const layer = {
                    id: 'dtp-layer',
                    filter: ['match', ['sourceAttr', 'visible'], [true], true, false],
                    type: 'point',
                    style: {
                        // Иконка (убедитесь, что 'marker' есть в вашем стиле)
                        iconImage: 'marker',
                        iconWidth: 20,
                        // Подпись
                        textField: ['get', 'severity'],
                        textFont: ['Noto_Sans'],
                        textSize: 12,
                        textColor: '#000000',
                        textHaloColor: '#ffffff',
                        textHaloWidth: 2,
                        textOffset: [0, -1.5],
                        iconPriority: 100,
                        textPriority: 90,
                    },
                };

                map.addLayer(layer);
                console.log('✅ Слой добавлен');
                console.log('Количество точек:', dtpData?.features?.length);
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
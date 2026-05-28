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
                zoom: 17,
                key: 'd55a8e03-2d27-4430-8676-15d7eb8190d8',
                
                style: 'f90cd86a-5702-4a76-a287-19263381ae6b',
                
                pitch: 70,
                maxPitch: 85,
                lowZoomMaxPitch: 85,
                
                graphicsPreset: 'immersive',
                
                trafficEnabled: true,
                trafficControl: 'topRight',
                
                styleState: { 
                    globeEnabled: true,
                    immersiveRoadsOn: true
                },
                
                fog: {
                    color: '#a8d0e6',
                    density: 0.12,
                },
                
                light: {
                    position: [135, 65, 0],   
                    color: '#FFFFFF',
                    intensity: 1.5,
                },
            });
            
            mapRef.current = map;

            const source = new mapglAPI.GeoJsonSource(map, {
                data: dtpData,
                attributes: { visible: true },
            });

            const heatmapLayer = {
                id: 'dtp-heatmap',
                filter: ['match', ['sourceAttr', 'visible'], [true], true, false],
                type: 'heatmap',
                style: {
                    color: [
                        'interpolate', ['linear'], ['heatmap-density'],
                        0, 'rgba(0, 0, 255, 0)',
                        0.2, 'rgba(0, 100, 255, 0.4)',
                        0.4, 'rgba(100, 255, 100, 0.5)',
                        0.6, 'rgba(255, 200, 0, 0.7)',
                        0.8, 'rgba(255, 100, 0, 0.8)',
                        1, 'rgba(255, 0, 0, 0.9)'
                    ],
                    radius: 35,
                    intensity: 0.9,
                    opacity: 0.7,
                },
            };

            map.addLayer(heatmapLayer);
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
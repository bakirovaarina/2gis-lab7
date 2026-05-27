import { useEffect, useRef } from 'react';
import { load } from '@2gis/mapgl';

export default function MapGL() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        load().then((mapglAPI: any) => {
            const map = new mapglAPI.Map(containerRef.current, {
                center: [31.2740, 58.5213],
                zoom: 13,
                key: 'd55a8e03-2d27-4430-8676-15d7eb8190d8',
                style: '4cb18ed4-8753-4dad-97d7-89b551b67acb',
            });

            mapRef.current = map;
            console.log('Карта загружена! Город: Великий Новгород');
        }).catch((error) => {
            console.error('Ошибка загрузки карты:', error);
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.destroy();
            }
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}
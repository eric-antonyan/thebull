import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import axios from 'axios';

interface YandexMapByAddressProps {
    address: string;
}

const YandexMapByAddress: React.FC<YandexMapByAddressProps> = ({ address }) => {
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const apiKey = process.env.REACT_APP_YANDEX_API_KEY || '15dfbaec-3440-41db-831a-01c987e8ee61'; // Store your key in .env file

    useEffect(() => {
        const geocodeAddress = async () => {
            if (!address) return; // Early return if there's no address

            try {
                const response = await axios.get(
                    `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(address)}`
                );
                const data = response.data;

                const point = data.response.GeoObjectCollection.featureMember[0]?.GeoObject.Point.pos;
                if (point) {
                    const [lon, lat] = point.split(' ').map(Number);
                    setCoordinates([lat, lon]);
                    setError(null); // Reset any previous errors
                } else {
                    setError('Coordinates not found for the address.');
                }
            } catch (error) {
                setError('Error fetching coordinates.');
                console.error('Error fetching coordinates:', error);
            }
        };

        geocodeAddress();
    }, [address, apiKey]);

    return (
        <div className={"rounded-3xl mt-4 overflow-hidden"}>
            <YMaps query={{ apikey: apiKey }}>
                {coordinates ? (
                    <Map defaultState={{ center: coordinates, zoom: 15 }} width="100%" height="200px">
                        <Placemark geometry={coordinates} />
                    </Map>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <p>Loading map...</p>
                )}
            </YMaps>
        </div>
    );
};

export default YandexMapByAddress;

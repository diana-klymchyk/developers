import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_EXCHANGE_RATES } from '../../queries/get.exchange.rates';

export const UpdatedTime = () => {
    const [secondsAgo, setSecondsAgo] = useState(0);

    const { data, loading, error, refetch } = useQuery(GET_EXCHANGE_RATES, {
        fetchPolicy: 'network-only',
    });

    const formatFetchedAt = (timestamp: string) => {
        if (!timestamp) return 'Unknown date';

        const date = new Date(timestamp);

        return new Intl.DateTimeFormat(navigator.language, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }).format(date);
    };

    function formatTimeElapsed(seconds: number): string {
        if (seconds < 60) {
            return `${seconds} seconds ago`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return remainingSeconds > 0
            ? `${minutes} minutes ${remainingSeconds} seconds ago`
            : `${minutes} minutes ago`;
    }

    useEffect(() => {
        if (!loading && data?.exchangeRates?.fetchedAt) {
            const fetchedAt = new Date(data.exchangeRates.fetchedAt);

            const updateTime = () => {
                const diff = Math.floor((new Date().getTime() - fetchedAt.getTime()) / 1000);
                setSecondsAgo(diff);
            };

            updateTime();
            const interval = setInterval(updateTime, 1000);

            // const timeout = setTimeout(() => {
            //     refetch();
            // }, 5 * 60 * 1000);

            return () => {
                clearInterval(interval);
                // clearTimeout(timeout);
            };
        }
    }, [loading, data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <h3>Last update</h3>
            <p>{formatTimeElapsed(secondsAgo)}</p>
            <p>at {formatFetchedAt(data.exchangeRates.fetchedAt)}</p>
        </>
    );
};

import React, { FC } from 'react';
import { useQuery } from '@apollo/client';
import { StyledTable, StyledTh, StyledTd } from '../../styles/table.styles';
import { GET_EXCHANGE_RATES } from '../../queries/get.exchange.rates';

export const ExchangeRates: FC = () => {
    const { data, loading, error, refetch } = useQuery(GET_EXCHANGE_RATES, {
        fetchPolicy: 'network-only',
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <button onClick={() => refetch()}>Update data</button>
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh>Country</StyledTh>
                        <StyledTh>Currency</StyledTh>
                        <StyledTh>Amount</StyledTh>
                        <StyledTh>Code</StyledTh>
                        <StyledTh>Rate</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {data.exchangeRates.rates.map((rate, index) => (
                        <tr key={index}>
                            <StyledTd>{rate.country}</StyledTd>
                            <StyledTd>{rate.currency}</StyledTd>
                            <StyledTd>{rate.amount}</StyledTd>
                            <StyledTd>{rate.currencyCode}</StyledTd>
                            <StyledTd>{rate.rate}</StyledTd>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
        </>
    );
};

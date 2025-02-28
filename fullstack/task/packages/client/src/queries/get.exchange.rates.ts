import { gql } from '@apollo/client';

export const GET_EXCHANGE_RATES = gql`
    query {
        exchangeRates {
            rates {
                country
                currency
                amount
                currencyCode
                rate
                validFor
                fetchedAt
            }
            fetchedAt
        }
    }
`;

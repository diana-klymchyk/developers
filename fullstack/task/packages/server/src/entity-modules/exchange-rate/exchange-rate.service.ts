import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from './exchange-rate.entity';
import { ExchangeRateResponse } from './exchange-rate.resolver';
import { ExchangeRateType } from './dto/exchange-rate.type';

@Injectable()
export class ExchangeRateService {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>
    ) {}

    async getLastUpdateTime(): Promise<Date | null> {
        try {
            const latestEntry = await this.exchangeRateRepository.findOne({
                where: {},
                order: { fetchedAt: 'DESC' },
            });
            return latestEntry ? latestEntry.fetchedAt : null;
        } catch (error) {
            console.error('Error fetching last update time:', error);
            return null;
        }
    }

    private async shouldUpdateRates(): Promise<boolean> {
        try {
            const lastUpdate = await this.getLastUpdateTime();
            if (!lastUpdate) return true;

            const fiveMinutesAgo = new Date();
            fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

            return lastUpdate < fiveMinutesAgo;
        } catch (error) {
            console.error('Error checking if update is needed:', error);
            return true;
        }
    }

    public async fetchAndSaveExchangeRates(): Promise<ExchangeRate[]> {
        try {
            const URL = 'https://api.cnb.cz/cnbapi/exrates/daily';
            const response = await axios.get(URL);

            if (!response.data || !Array.isArray(response.data.rates)) {
                throw new Error('Unexpected response format from CNB');
            }

            return response.data.rates.map((rate: any) => ({
                country: rate.country,
                currency: rate.currency,
                validFor: rate.validFor,
                amount: Number(rate.amount),
                currencyCode: rate.currencyCode,
                rate: Number(rate.rate),
                fetchedAt: new Date(),
            }));
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            return [];
        }
    }

    private async updateRatesIfNeeded() {
        try {
            if (await this.shouldUpdateRates()) {
                console.log('Fetching new exchange rates.');
                await this.exchangeRateRepository.clear();

                const rates = await this.fetchAndSaveExchangeRates();

                if (rates.length > 0) {
                    for (const rate of rates) {
                        try {
                            await this.exchangeRateRepository.save(rate);
                        } catch (dbError) {
                            console.error('Error saving rate to DB:', dbError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error updating exchange rates:', error);
        }
    }

    async getExchangeRates(): Promise<ExchangeRateResponse> {
        try {
            await this.updateRatesIfNeeded();

            const rates: ExchangeRateType[] = (await this.exchangeRateRepository.find()).map(
                (rate: any) => ({
                    country: rate.country,
                    currency: rate.currency,
                    amount: rate.amount,
                    currencyCode: rate.currencyCode,
                    rate: rate.rate,
                    validFor: rate.validFor,
                    fetchedAt: rate.fetchedAt ? new Date(rate.fetchedAt) : new Date(),
                })
            );

            const lastFetchedAt = (await this.getLastUpdateTime()) || new Date();

            return {
                rates,
                fetchedAt: lastFetchedAt.toISOString(),
            };
        } catch (error) {
            console.error('Error getting exchange rates:', error);
            return { rates: [], fetchedAt: new Date().toISOString() }; 
        }
    }
}

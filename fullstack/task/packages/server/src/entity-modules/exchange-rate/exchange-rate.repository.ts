import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from './exchange-rate.entity';
import { ExchangeRateService } from './exchange-rate.service';

@Injectable()
export class ExchangeRateRepository extends Repository<ExchangeRate> {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly repository: Repository<ExchangeRate>,
        private readonly exchangeRateService: ExchangeRateService
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getLatestRates(): Promise<ExchangeRate[]> {
        const latestFetchedAt = await this.getLastFetchTime();
        if (!latestFetchedAt) {
            console.log('No cache found. Fetching new data.');
            return this.exchangeRateService.fetchAndSaveExchangeRates();
        }

        const now = new Date();
        const cacheLifetime = 5 * 60 * 1000;

        if (now.getTime() - latestFetchedAt.getTime() > cacheLifetime) {
            console.log('Cache expired. Fetching new data from API.');
            return this.exchangeRateService.fetchAndSaveExchangeRates();
        }

        return this.repository.find({ where: { fetchedAt: latestFetchedAt } });
    }

    async saveRates(rates: ExchangeRate[]): Promise<void> {
        await this.repository.clear();
        await this.repository.save(rates);
    }

    async getLastFetchTime(): Promise<Date | null> {
        const latestRate = await this.repository.findOne({
            select: ['fetchedAt'],
            order: { fetchedAt: 'DESC' },
        });

        return latestRate ? latestRate.fetchedAt : null;
    }
}

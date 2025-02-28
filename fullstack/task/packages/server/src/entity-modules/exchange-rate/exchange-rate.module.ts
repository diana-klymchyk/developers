import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from './exchange-rate.entity';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateResolver } from './exchange-rate.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([ExchangeRate])],
    providers: [ExchangeRateService, ExchangeRateResolver],
    exports: [ExchangeRateService],
})
export class ExchangeRateModule implements OnModuleInit {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    async onModuleInit() {
        console.log('ExchangeRateModule have been initialized');
        await this.exchangeRateService.fetchAndSaveExchangeRates();
    }
}

import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateType } from './dto/exchange-rate.type';

@ObjectType()
export class ExchangeRateResponse {
    @Field(() => [ExchangeRateType])
    rates: ExchangeRateType[] = [];

    @Field(() => String)
    fetchedAt: string = new Date().toISOString();
}

@Resolver(() => ExchangeRateType)
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => ExchangeRateResponse)
    async exchangeRates(): Promise<ExchangeRateResponse> {
        return this.exchangeRateService.getExchangeRates();
    }
}

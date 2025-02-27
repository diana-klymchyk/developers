import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { graphqlConfig, typeormConfig } from './config';
import { modules } from './entity-modules';
// import { ExchangeRateModule } from './services/exchange-rate/exchange-rate.module';
import { ExchangeRateModule } from './entity-modules/exchange-rate/exchange-rate.module';
import { ExchangeRate } from './entity-modules/exchange-rate/exchange-rate.entity'; // ✅ Імпортуємо ентіті

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        TypeOrmModule.forRoot({
            ...typeormConfig,
            autoLoadEntities: true,
        }),
        GraphQLModule.forRoot(graphqlConfig),

        ExchangeRateModule,
        ...modules,
    ],

    controllers: [],
})
export class AppModule {}

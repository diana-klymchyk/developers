import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExchangeRateType {
    @Field()
    country!: string;

    @Field()
    currency!: string;

    @Field()
    amount!: number;

    @Field()
    currencyCode!: string;

    @Field()
    rate!: number;

    @Field()
    validFor!: string;

    @Field(() => Date)
    fetchedAt!: Date;
}

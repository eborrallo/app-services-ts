import { UserMother } from '../domain/models/UserMother';
import { FilterField } from '../../../../../src/Contexts/Shared/domain/criteria/FilterField';
import { Filters } from '../../../../../src/Contexts/Shared/domain/criteria/Filters';
import { Order } from '../../../../../src/Contexts/Shared/domain/criteria/Order';
import { OrderType, OrderTypes } from '../../../../../src/Contexts/Shared/domain/criteria/OrderType';
import { FilterOperator, Operator } from '../../../../../src/Contexts/Shared/domain/criteria/FilterOperator';
import { FilterValue } from '../../../../../src/Contexts/Shared/domain/criteria/FilterValue';
import { Filter } from '../../../../../src/Contexts/Shared/domain/criteria/Filter';
import { OrderBy } from '../../../../../src/Contexts/Shared/domain/criteria/OrderBy';
import { Criteria } from '../../../../../src/Contexts/Shared/domain/criteria/Criteria';
import { MongoEnvironmentArranger } from '../../../Shared/infrastructure/mongo/MongoEnvironmentArranger';
import {
  MongoUserRepository
} from '../../../../../src/Contexts/Auth/User/infrastructure/persistence/MongoUserRepository';
import {
  TypeOrmClientFactory
} from '../../../../../src/Contexts/Shared/infrastructure/persistence/typeorm/TypeOrmClientFactory';
import {
  TypeOrmUserRepository
} from '../../../../../src/Contexts/Auth/User/infrastructure/persistence/TypeOrmUserRepository';
import { TypeOrmEnvironmentArranger } from '../../../Shared/infrastructure/typeorm/TypeOrmEnvironmentArranger';
import { UserRepository } from '../../../../../src/Contexts/Auth/User/domain/repositories/UserRepository';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { MongoDBContainer } from '@testcontainers/mongodb';
import { MongoClientMother } from '../../../Shared/infrastructure/EventBus/__mother__/MongoClientMother';
import { TypeOrmClientMother } from '../../../Shared/infrastructure/EventBus/__mother__/TypeOrmClientMother';

const mongoContainer = new MongoDBContainer().start();
const connectionMongo = MongoClientMother.createFromContainer(mongoContainer, 'auth');

const sutMongo = new MongoUserRepository(connectionMongo);
const environmentArrangerMongo = new MongoEnvironmentArranger(connectionMongo);

const postgresContainer = new PostgreSqlContainer().start();
const connectionTypeOrm = TypeOrmClientMother.createFromContainer(postgresContainer, 'auth');
const sutTypeOrm = new TypeOrmUserRepository(connectionTypeOrm);
const environmentArrangerTypeOrm = new TypeOrmEnvironmentArranger(connectionTypeOrm);

const cases = [
  ['TypeOrm', sutTypeOrm],
  ['Mongo', sutMongo]
];
beforeEach(async () => {
  await environmentArrangerMongo.arrange();
  await environmentArrangerTypeOrm.arrange();
});

afterAll(async () => {
  await environmentArrangerMongo.close();
  await environmentArrangerTypeOrm.close();
  await (await postgresContainer).stop();
  await (await mongoContainer).stop();
});

// @ts-ignore
describe.each(cases)('%s', (name: string, sut: UserRepository) => {
  it('Search', async () => {
    const entity = UserMother.random();
    await sut.save(entity);
    const criteria = new Criteria(
      new Filters([
        new Filter(new FilterField('address'), new FilterOperator(Operator.EQUAL), new FilterValue(entity.address))
      ]),
      new Order(new OrderBy('address'), new OrderType(OrderTypes.DESC))
    );

    const result = await sut.search(criteria);

    expect(result!.toPrimitives()).toMatchObject(entity.toPrimitives());
  });
  it('Search null', async () => {
    const entity = UserMother.random();
    await sut.save(entity);
    const criteria = new Criteria(
      new Filters([new Filter(new FilterField('address'), new FilterOperator(Operator.EQUAL), new FilterValue('aa'))]),
      new Order(new OrderBy('address'), new OrderType(OrderTypes.DESC))
    );

    const result = await sut.search(criteria);

    expect(result).toBeNull();
  });
  it('Find', async () => {
    const entity = UserMother.random();
    await sut.save(entity);
    const criteria = new Criteria(
      new Filters([
        new Filter(new FilterField('address'), new FilterOperator(Operator.EQUAL), new FilterValue(entity.address))
      ]),
      new Order(new OrderBy('address'), new OrderType(OrderTypes.DESC))
    );

    const result = await sut.find(criteria);

    expect(result!.toPrimitives()).toMatchObject(entity.toPrimitives());
  });
  it('Find exception', async () => {
    const entity = UserMother.random();
    await sut.save(entity);
    const criteria = new Criteria(
      new Filters([new Filter(new FilterField('address'), new FilterOperator(Operator.EQUAL), new FilterValue('aa'))]),
      new Order(new OrderBy('address'), new OrderType(OrderTypes.DESC))
    );
    const filters = {
      filters: [{ field: 'address', operator: '=', value: 'aa' }],
      order: { orderBy: 'address', orderType: 'desc' }
    };

    await expect(sut.find(criteria)).rejects.toThrowError(`User not found for criteria ${JSON.stringify(filters)}`);
  });
  it('Matching', async () => {
    const entity_one = UserMother.random('0x121', 'aaa');
    await sut.save(entity_one);
    const entity_two = UserMother.random('0x122', 'aaa');
    await sut.save(entity_two);
    const entity_three = UserMother.random('0x000', 'bbb');
    await sut.save(entity_three);

    const criteria = new Criteria(
      new Filters([new Filter(new FilterField('message'), new FilterOperator(Operator.EQUAL), new FilterValue('aaa'))]),
      new Order(new OrderBy('address'), new OrderType(OrderTypes.DESC))
    );

    const results = await sut.matching(criteria);

    expect(results.length).toBe(2);
    expect(results[1]).toMatchObject(entity_one.toPrimitives());
    expect(results[0]).toMatchObject(entity_two.toPrimitives());
  });
});

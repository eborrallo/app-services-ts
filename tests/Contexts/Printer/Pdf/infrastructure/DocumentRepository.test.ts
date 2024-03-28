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
import { MongoClientFactory } from '../../../../../src/Contexts/Shared/infrastructure/persistence/mongo/MongoClientFactory';
import { TypeOrmClientFactory } from '../../../../../src/Contexts/Shared/infrastructure/persistence/typeorm/TypeOrmClientFactory';
import { TypeOrmEnvironmentArranger } from '../../../Shared/infrastructure/typeorm/TypeOrmEnvironmentArranger';
import {
  TypeOrmDocumentRepository
} from '../../../../../src/Contexts/Printer/Pdf/infrastructure/persistence/TypeOrmDocumentRepository';
import { DocumentMother } from '../domain/models/DocumentMother';
import {
  MongoDocumentRepository
} from '../../../../../src/Contexts/Printer/Pdf/infrastructure/persistence/MongoDocumentRepository';
import { DocumentRepository } from '../../../../../src/Contexts/Printer/Pdf/domain/repositories/DocumentRepository';
import container from '../../../../../src/apps/printer/api/dependency-injection';

const connectionMongo = MongoClientFactory.createClient('printer', container.get('Printer.Shared.MongoConfig'));
const sutMongo = new MongoDocumentRepository(connectionMongo);
const environmentArrangerMongo = new MongoEnvironmentArranger(connectionMongo);

const connectionTypeOrm = TypeOrmClientFactory.createClient('printer', container.get('Printer.Shared.TypeOrmConfig'));
const sutTypeOrm = new TypeOrmDocumentRepository(connectionTypeOrm);
const environmentArrangerTypeOrm = new TypeOrmEnvironmentArranger(connectionTypeOrm);

const cases = [
  ['Mongo', sutMongo],
  ['TypeOrm', sutTypeOrm]
];
beforeEach(async () => {
  await (await environmentArrangerMongo).arrange();
  await (await environmentArrangerTypeOrm).arrange();
});

afterAll(async () => {
  await (await environmentArrangerMongo).close();
  await (await environmentArrangerTypeOrm).close();
});

//@ts-ignore
describe.each(cases)('%s', (name: string, sut: DocumentRepository) => {
  it('Search', async () => {
    const entity = DocumentMother.random();
    await sut.save(entity);
    const criteria = new Criteria(
      new Filters([
        new Filter(new FilterField('content'), new FilterOperator(Operator.EQUAL), new FilterValue(entity.content))
      ]),
      new Order(new OrderBy('id'), new OrderType(OrderTypes.DESC))
    );

    const result = await sut.search(criteria);

    expect(result!.toPrimitives()).toMatchObject(entity.toPrimitives());
  });
  it('Search null', async () => {
    const entity = DocumentMother.random();
    await sut.save(entity);
    const criteria = new Criteria(
      new Filters([new Filter(new FilterField('id'), new FilterOperator(Operator.EQUAL), new FilterValue('aa'))]),
      new Order(new OrderBy('id'), new OrderType(OrderTypes.DESC))
    );

    const result = await sut.search(criteria);

    expect(result).toBeNull();
  });
  it('Find', async () => {
    const entity = DocumentMother.random();
    await sut.save(entity);
    const criteria = new Criteria(
      new Filters([
        new Filter(new FilterField('name'), new FilterOperator(Operator.EQUAL), new FilterValue(entity.name))
      ]),
      new Order(new OrderBy('name'), new OrderType(OrderTypes.DESC))
    );

    const result = await sut.find(criteria);

    expect(result!.toPrimitives()).toMatchObject(entity.toPrimitives());
  });
  it('Find exception', async () => {
    const entity = DocumentMother.random();
    await sut.save(entity);
    const criteria = new Criteria(
      new Filters([new Filter(new FilterField('id'), new FilterOperator(Operator.EQUAL), new FilterValue('aa'))]),
      new Order(new OrderBy('id'), new OrderType(OrderTypes.DESC))
    );
    const filters = {
      filters: [{ field: 'id', operator: '=', value: 'aa' }],
      order: { orderBy: 'id', orderType: 'desc' }
    };

    await expect(sut.find(criteria)).rejects.toThrowError(`Document not found for criteria ${JSON.stringify(filters)}`);
  });
  it('Matching', async () => {
    const entity_one = DocumentMother.random('0x121', 'aaa');
    await sut.save(entity_one);
    const entity_two = DocumentMother.random('0x122', 'aaa');
    await sut.save(entity_two);
    const entity_three = DocumentMother.random('0x000', 'bbb');
    await sut.save(entity_three);

    const criteria = new Criteria(
      new Filters([new Filter(new FilterField('name'), new FilterOperator(Operator.EQUAL), new FilterValue('aaa'))]),
      new Order(new OrderBy('id'), new OrderType(OrderTypes.DESC))
    );

    const results = await sut.matching(criteria);

    expect(results.length).toBe(2);
    expect(results[1]).toMatchObject(entity_one.toPrimitives());
    expect(results[0]).toMatchObject(entity_two.toPrimitives());
  });
});
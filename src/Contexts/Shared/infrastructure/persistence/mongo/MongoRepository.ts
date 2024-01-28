import { Collection, MongoClient } from 'mongodb';
import { AggregateRoot } from '../../../domain/AggregateRoot';
import { Criteria } from '../../../domain/criteria/Criteria';
import { MongoCriteriaConverter } from './MongoCriteriaConverter';

export abstract class MongoRepository<T extends AggregateRoot> {
  private criteriaConverter: MongoCriteriaConverter;

  constructor(private _client: Promise<MongoClient>) {
    this.criteriaConverter = new MongoCriteriaConverter();
  }

  protected abstract collectionName(): string;

  protected client(): Promise<MongoClient> {
    return this._client;
  }

  protected async collection(): Promise<Collection> {
    return (await this._client).db().collection(this.collectionName());
  }

  protected async persist(id: string, aggregateRoot: T): Promise<void> {
    const collection = await this.collection();

    const document = { ...aggregateRoot.toPrimitives(), _id: id, id: undefined };

    // @ts-expect-error
    await collection.updateOne({ _id: id }, { $set: document }, { upsert: true });
  }

  protected async searchByCriteria<D>(criteria: Criteria): Promise<D[]> {
    const query = this.criteriaConverter.convert(criteria);

    const collection = await this.collection();

    // @ts-expect-error
    return await collection.find<D>(query.filter, {}).sort(query.sort).skip(query.skip).limit(query.limit).toArray();
  }

  protected async searchOneByCriteria<D>(criteria: Criteria): Promise<D | null> {
    const query = this.criteriaConverter.convert(criteria);

    const collection = await this.collection();

    return await collection.findOne<D>(query.filter, {});
  }
}

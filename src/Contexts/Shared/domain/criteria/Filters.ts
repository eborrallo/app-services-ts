import { Filter } from './Filter';

export class Filters {
  readonly filters: Filter[];

  constructor(filters: Filter[]) {
    this.filters = filters;
  }

  static fromValues(filters: Array<Map<string, string>>): Filters {
    return new Filters(filters.map(Filter.fromValues));
  }

  static none(): Filters {
    return new Filters([]);
  }

  public serialize(): string {
    return JSON.stringify(this.filters.map(filter => JSON.parse(filter.serialize())));
  }
}

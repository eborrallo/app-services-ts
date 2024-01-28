import { Filters } from './Filters';
import { Order } from './Order';

export class Criteria {
  readonly filters: Filters;
  readonly order: Order;
  readonly limit?: number;
  readonly offset?: number;

  constructor(filters: Filters, order: Order, limit?: number, offset?: number) {
    this.filters = filters;
    this.order = order;
    this.limit = limit;
    this.offset = offset;
  }

  public hasFilters(): boolean {
    return this.filters.filters.length > 0;
  }

  public serialize(): string {
    return JSON.stringify({
      filters: JSON.parse(this.filters.serialize()),
      order: JSON.parse(this.order.serialize()),
      limit: this.limit,
      offset: this.offset
    });
  }
}

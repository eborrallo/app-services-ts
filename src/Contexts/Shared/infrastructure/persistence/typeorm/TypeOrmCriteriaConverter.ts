import { SelectQueryBuilder } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { Criteria } from '../../../domain/criteria/Criteria';
import { Order } from '../../../domain/criteria/Order';
import { OrderTypes } from '../../../domain/criteria/OrderType';
import { Filters } from '../../../domain/criteria/Filters';

export class TypeOrmCriteriaConverter {
  static PREFIX = 'entity';

  public convert(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<ObjectLiteral>
  ): SelectQueryBuilder<ObjectLiteral> {
    if (criteria.hasFilters()) {
      this.generateFilters(criteria.filters, queryBuilder);
    }

    if (criteria.order.hasOrder()) {
      this.generateOrder(criteria.order, queryBuilder);
    }
    if (criteria.offset) {
      queryBuilder.offset(criteria.offset);
    }

    if (criteria.limit) {
      queryBuilder.limit(criteria.limit);
    }
    return queryBuilder;
  }

  private generateOrder(order: Order, queryBuilder: SelectQueryBuilder<ObjectLiteral>): void {
    let orderType = order.orderType.value.toUpperCase();
    if (order.orderType.isNone()) {
      orderType = OrderTypes.ASC;
    }
    // @ts-expect-error
    queryBuilder.orderBy(`${TypeOrmCriteriaConverter.PREFIX}.${order.orderBy.value}`, orderType);
  }

  private generateFilters(filters: Filters, queryBuilder: SelectQueryBuilder<ObjectLiteral>): void {
    filters.filters.forEach(filter => {
      const r = (Math.random() + 1).toString(36).substring(10);

      if (filter.value?.value) {
        queryBuilder.andWhere(
          `${TypeOrmCriteriaConverter.PREFIX}.${filter.field.value} ${filter.operator.value} :${r}${filter.field?.value} `,
          { [r + filter.field.value]: filter.value?.value }
        );
      } else {
        queryBuilder.andWhere(`${TypeOrmCriteriaConverter.PREFIX}.${filter.field.value} ${filter.operator.value}`);
      }
    });
  }
}

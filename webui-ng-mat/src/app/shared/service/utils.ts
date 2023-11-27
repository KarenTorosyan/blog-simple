import {HttpParams} from "@angular/common/http";

export interface Pageable {
  page: number
  size: number
}

export interface Sortable {
  expression: string
}

export interface Searchable {
  term: string
}

export function from(pageable: Pageable = {page: 0, size: 10},
                     sortable?: Sortable,
                     searchable?: Searchable): HttpParams {
  let httpParams = new HttpParams()
    .set("page", pageable.page)
    .set("size", pageable.size);
  if (searchable && searchable.term) {
    httpParams = httpParams.set("term", searchable.term);
  }
  if (sortable) {
    const sort = sortable.expression
    httpParams = httpParams.set("sort", sort);
  }
  return httpParams;
}

export interface Page<T> {
  readonly content: T[]
  readonly number: number
  readonly size: number
  readonly totalPages: number
  readonly totalElements: number
  readonly hasNext: boolean
  readonly hasPrevious: boolean
  readonly isFirst: boolean
  readonly isLast: boolean
}

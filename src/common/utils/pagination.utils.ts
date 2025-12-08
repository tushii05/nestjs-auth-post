import { FindOptionsWhere, ILike } from 'typeorm';

export interface QueryOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
    searchableFields?: string[];
}

export function buildPagination(page = 1, limit = 10) {
    return {
        skip: (page - 1) * limit,
        take: limit,
        page,
        limit,
    };
}

export function buildSorting(sortBy: string = 'id', order: 'ASC' | 'DESC' = 'DESC') {
    return { [sortBy]: order };
}

export function buildSearch(search: string = '', fields: string[] = []): FindOptionsWhere<any>[] | {} {
    if (!search || !fields.length) return {};

    return fields.map((field) => ({
        [field]: ILike(`%${search}%`)
    }));
}

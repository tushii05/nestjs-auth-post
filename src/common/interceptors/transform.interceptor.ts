import { CallHandler, ExecutionContext, Injectable, NestInterceptor, } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        return next.handle().pipe(
            map((data) => {
                const isPaginated =
                    data &&
                    typeof data === 'object' &&
                    'page' in data &&
                    'limit' in data &&
                    'total' in data;

                return {
                    success: true,
                    data: isPaginated ? data.data : data,
                    meta: {
                        ...(isPaginated ? {
                            page: data.page,
                            limit: data.limit,
                            total: data.total,
                            lastPage: data.lastPage,
                        } : {}),
                        path: request.url,
                        timestamp: new Date().toISOString(),
                        statusCode: ctx.getResponse().statusCode,
                    },
                };
            }),
        );
    }
}

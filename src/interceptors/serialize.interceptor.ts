import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// Helps to expect a class as argument
interface ClassConstructor {
    new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    // this option ensures exclude all properties that we don't mention in dto
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}

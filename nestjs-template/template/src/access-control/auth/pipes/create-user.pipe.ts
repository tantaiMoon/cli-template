import { /*ArgumentMetadata,*/ Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class CreateUserPipe implements PipeTransform {
  // transform(value: any, metadata: ArgumentMetadata) {
  transform(value: any) {
    if (!value) return
    const { roles } = value
    if (roles && Array.isArray(roles)) {
      value.roles = roles.map(Number)
    }
    return value
  }
}

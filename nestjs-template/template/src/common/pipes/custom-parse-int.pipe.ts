import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

interface CustonParseIntPipeOptions {
  optional?: boolean
  defaultValue?: number
}

@Injectable()
export class CustomParseIntPipe implements PipeTransform {
  constructor(private options?: CustonParseIntPipeOptions) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value && this.options?.defaultValue) {
      value = this.options?.defaultValue
    }
    if (this.options?.optional && !value) {
      return undefined
    }
    const val = parseInt(value, 10)
    if ((val !== -1 && val < 0) || isNaN(val)) {
      throw new BadRequestException('参数不合法')
    }
    return value
  }
}

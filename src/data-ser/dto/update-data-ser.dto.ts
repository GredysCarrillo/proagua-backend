import { PartialType } from '@nestjs/mapped-types';
import { createServiceDto } from './create-service.dto';

export class UpdateDataSerDto extends PartialType(createServiceDto) {}

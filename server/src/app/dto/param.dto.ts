import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ParamIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

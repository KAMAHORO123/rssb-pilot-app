import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateShipmentDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MinLength(3)
  pickupAddress!: string;

  @IsString()
  @MinLength(3)
  deliveryAddress!: string;
}

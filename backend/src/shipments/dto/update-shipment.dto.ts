import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateShipmentDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  pickupAddress?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  deliveryAddress?: string;
}

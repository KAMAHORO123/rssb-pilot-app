import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  Min,
  Max
} from "class-validator";
import { ShipmentStatus } from "@prisma/client";

export class CreateTrackingDto {
  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  locationLat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  locationLng?: number;

  @IsOptional()
  @IsString()
  note?: string;
}

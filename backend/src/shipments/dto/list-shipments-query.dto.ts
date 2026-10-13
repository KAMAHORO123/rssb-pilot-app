import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";
import { Type } from "class-transformer";
import { ShipmentStatus } from "@prisma/client";

export class ListShipmentsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus;

  @IsOptional()
  @IsString()
  assignedCourierId?: string;

  @IsOptional()
  @IsIn(["createdAt", "title", "status"])
  sortBy?: "createdAt" | "title" | "status";

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc";

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

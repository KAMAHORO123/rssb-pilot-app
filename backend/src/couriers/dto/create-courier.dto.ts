import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCourierDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsString()
  vehicleType?: string;
}

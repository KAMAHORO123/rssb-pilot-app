import { IsOptional, IsString } from "class-validator";

export class UpdateCourierProfileDto {
  @IsOptional()
  @IsString()
  vehicleType?: string;
}

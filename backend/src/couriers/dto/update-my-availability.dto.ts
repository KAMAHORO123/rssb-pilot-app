import { IsBoolean } from "class-validator";

export class UpdateMyAvailabilityDto {
  @IsBoolean()
  availability!: boolean;
}

import { IsIn, IsOptional, IsString } from "class-validator";

export class ListAuditLogsQueryDto {
  @IsOptional()
  @IsString()
  actionType?: string;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsString()
  actorUserId?: string;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc";
}

import { IsArray, IsObject, IsOptional } from "class-validator";

export class RaceDetailsDto {
  @IsObject()
  @IsOptional()
  teamsAndPilots?: Record<string, any>;

  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;

  @IsObject()
  @IsOptional()
  penalties?: Record<string, any>;

  @IsArray()
  @IsOptional()
  results?: Record<string, unknown>[];

  @IsObject()
  @IsOptional()
  lapsNotDelimiters?: Record<string, any>;

  @IsObject()
  @IsOptional()
  stintByPilots?: Record<string, any>;

  @IsObject()
  @IsOptional()
  rawData?: Record<string, any>;

  @IsObject()
  @IsOptional()
  calculatedData?: Record<string, any>;
}

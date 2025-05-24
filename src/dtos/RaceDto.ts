import { IsString, IsBoolean, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { RaceDetailsDto } from './RaceDetailsDto'

export class CreateRaceDto {
    @IsString()
    name!: string

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean

    @ValidateNested()
    @IsOptional()
    @Type(() => RaceDetailsDto)
    details?: RaceDetailsDto
}

export class UpdateRaceDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean

    @ValidateNested()
    @IsOptional()
    @Type(() => RaceDetailsDto)
    details?: RaceDetailsDto
} 
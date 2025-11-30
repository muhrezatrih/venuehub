export class LocationResponseDto {
  id: string;
  name: string;
}

export class LocationListResponseDto {
  data: LocationResponseDto[];
  total: number;
}
import { Expose, Transform } from 'class-transformer';

interface CourierCompanyWithCountry {
  country?: {
    id?: string;
    name?: string;
    code?: string;
    phone_code?: string;
  };
}

export class CourierCompanyResponsesDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: string;

  // Flatten country fields directly
  @Expose()
  @Transform(
    ({ obj }: { obj: CourierCompanyWithCountry }) => obj.country?.id || null,
  )
  country_id: string | null;

  @Expose()
  @Transform(
    ({ obj }: { obj: CourierCompanyWithCountry }) => obj.country?.name || null,
  )
  country_name: string | null;

  @Expose()
  @Transform(
    ({ obj }: { obj: CourierCompanyWithCountry }) => obj.country?.code || null,
  )
  country_code: string | null;

  @Expose()
  @Transform(
    ({ obj }: { obj: CourierCompanyWithCountry }) =>
      obj.country?.phone_code || null,
  )
  country_phone_code: string | null;
}

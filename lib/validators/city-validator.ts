import { InvalidCityError } from "./errors/invalid-city-error"

const MIN_CITY_NAME_LENGTH = 3

export const cityValidator = (entityName: string) => (
  entityName.length >= MIN_CITY_NAME_LENGTH? null: new InvalidCityError()
)
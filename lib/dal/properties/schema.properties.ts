import * as z from "zod";

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);
export const AddEditPropertySchema = z.object({
  ownerId: z.preprocess(
    emptyToUndefined,
    z.string("Please select the property owner"),
  ),
  streetId: z.preprocess(emptyToUndefined, z.string("Please select a street")),
  wardId: z.preprocess(emptyToUndefined, z.string("Please select a ward")),
  address: z.preprocess(
    emptyToUndefined,
    z.string("Building number is required"),
  ),
  propertyCode: z.preprocess(
    emptyToUndefined,
    z.string("Property code is required"),
  ),
  propertyUnits: z.array(
    z.object({
      unitId: z.preprocess(
        emptyToUndefined,
        z.string("Please select the property unit type"),
      ),
      quantity: z
        .number("Please input the unit quantity")
        .min(1, "Quantity cannot be less than 1"),
    }),
  ),
});

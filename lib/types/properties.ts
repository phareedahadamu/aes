
export const AddPropertySteps = {
  OWNER: "Owner",
  LOCATION: "Location",
  UNITS: "Units",
  PREVIEW: "Preview",
} as const;

export type AddPropertyStepType =
  (typeof AddPropertySteps)[keyof typeof AddPropertySteps];

export interface IAddPropertyStep {
  name: AddPropertyStepType;
  index: number;
}

export const ADDPROPERTYSTEPS = [
  {
    name: AddPropertySteps.OWNER,
    index: 0,
  },
  {
    name: AddPropertySteps.LOCATION,
    index: 1,
  },
  {
    name: AddPropertySteps.UNITS,
    index: 2,
  },
  {
    name: AddPropertySteps.PREVIEW,
    index: 3,
  },
];

export const PromiseStatus = {
  Fulfilled: 'fulfilled',
  Rejected: 'rejected',
} as const;

export const statusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

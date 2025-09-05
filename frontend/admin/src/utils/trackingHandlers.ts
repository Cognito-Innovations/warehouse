export const STATUS_HANDLERS: Record<
  string,
  (details: any, step: { label: string; defaultDescription: string }) => {
    description: string;
    date?: string;
  }
> = {
  Requested: (details, step) => ({
    description: `Requested by ${details.user.name}`,
    date: details.created_at,
  }),

  'Quotation Ready': (details, step) =>
    details.quoted_at
      ? { description: `Quotation was prepared`, date: details.updated_at }
      : { description: step.defaultDescription },

  Confirmed: (details, step) =>
    details.confirmed_at
      ? {
          description: `Confirmed on ${new Date(details.updated_at).toLocaleString()}`,
          date: details.updated_at,
        }
      : { description: step.defaultDescription },

  Picked: (details, step) =>
    details.picked_at
      ? {
          description: `Picked on ${new Date(details.updated_at).toLocaleString()}`,
          date: details.updated_at,
        }
      : { description: step.defaultDescription },
};
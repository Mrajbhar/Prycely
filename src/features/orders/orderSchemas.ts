import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(1, 'Enter the recipient name').max(200),
  line1: z.string().min(1, 'Enter the street address').max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1, 'Enter the city').max(100),
  state: z.string().min(1, 'Enter the state').max(100),
  postalCode: z.string().min(1, 'Enter the postal code').max(20),
  country: z.string().min(1, 'Enter the country').max(100),
  phone: z.string().min(1, 'Enter a phone number').max(20),
});

export type AddressInput = z.infer<typeof addressSchema>;
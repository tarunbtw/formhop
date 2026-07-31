export const PLAN_LIMITS = {
  free: { projects: 2, submissions: 100 },
  starter: { projects: 5, submissions: 10_000 },
  pro: { projects: 15, submissions: 35_000 },
  max: { projects: Infinity, submissions: 100_000 },
} as const

export const PLAN_PRICES = {
  free: 0,
  starter: 7,
  pro: 10,
  max: 30,
} as const

export const FIELD_TYPES = [
  { value: 'text', label: 'Short text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Checkbox' },
  { value: 'textarea', label: 'Long text' },
] as const

export type FieldType = (typeof FIELD_TYPES)[number]['value']

export const PLANS_CONFIG = [
  {
    name: 'Free',
    planKey: 'free',
    price: 0,
    features: ['2 forms', '100 submissions/mo', 'Email notifications', 'CDN snippet'],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Starter',
    planKey: 'starter',
    price: 7,
    features: ['5 forms', '10,000 submissions/mo', 'Email notifications', 'CDN snippet', 'Priority support'],
    cta: 'Start for $7/mo',
    highlighted: true,
  },
  {
    name: 'Pro',
    planKey: 'pro',
    price: 10,
    features: ['15 forms', '35,000 submissions/mo', 'Email notifications', 'CDN snippet', 'Priority support'],
    cta: 'Start for $10/mo',
    highlighted: false,
  },
  {
    name: 'Max',
    planKey: 'max',
    price: 30,
    features: ['Unlimited forms', '100,000 submissions/mo', 'Email notifications', 'CDN snippet', 'Dedicated support'],
    cta: 'Start for $30/mo',
    highlighted: false,
  },
] as const

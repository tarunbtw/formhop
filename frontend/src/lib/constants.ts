export const FIELD_TYPES = [
  { value: 'text', label: 'Short text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Checkbox' },
  { value: 'textarea', label: 'Long text' },
] as const

export type FieldType = (typeof FIELD_TYPES)[number]['value']

export const APP_LIMITS = {
  MAX_FORMS_PER_USER: 10,
  MAX_MONTHLY_SUBMISSIONS_PER_USER: 100,
} as const

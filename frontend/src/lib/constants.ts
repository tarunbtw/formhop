export const FIELD_TYPES = [
  { value: 'text', label: 'Short text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Checkbox' },
  { value: 'textarea', label: 'Long text' },
] as const

export type FieldType = (typeof FIELD_TYPES)[number]['value']

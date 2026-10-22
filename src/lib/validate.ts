export interface ContactFields { name: string; email: string; company: string; message: string }

/** Returns an error message per invalid field; an empty object means the form is valid */
export function validateContact(f: ContactFields): Partial<Record<keyof ContactFields, string>> {
  const errors: Partial<Record<keyof ContactFields, string>> = {}
  if (!f.name.trim()) errors.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errors.email = 'Enter an email address like name@company.com.'
  if (f.message.trim().length < 10) errors.message = 'Write a message of at least 10 characters.'
  return errors
}

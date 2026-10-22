import { describe, expect, it } from 'vitest'
import { validateContact } from '../../src/lib/validate'

const ok = { name: 'Recruiter', email: 'hr@example.com', company: '', message: 'We have a QA Lead opening.' }

describe('validateContact', () => {
  it('accepts a valid message', () => expect(validateContact(ok)).toEqual({}))
  it('requires a name', () => expect(validateContact({ ...ok, name: '  ' }).name).toBeTruthy())
  it('rejects a bad email', () => expect(validateContact({ ...ok, email: 'hr@example' }).email).toBeTruthy())
  it('requires a real message', () => expect(validateContact({ ...ok, message: 'hi' }).message).toBeTruthy())
  it('treats company as optional', () => expect(validateContact({ ...ok, company: '' }).company).toBeUndefined())
})

import {describe, expect, it} from 'vitest'
import {editionDateIsValid} from '@/composables/useCommissionDate'

describe('editionDateIsValid', () => {
  it('accepts a date after submission and up to the commission date', () => {
    expect(editionDateIsValid('2026-01-01', '2026-01-02', '2026-01-03')).toBe(true)
    expect(editionDateIsValid('2026-01-01', '2026-01-03', '2026-01-03')).toBe(true)
  })

  it('rejects a date equal to submission, after commission or missing', () => {
    expect(editionDateIsValid('2026-01-01', '2026-01-01', '2026-01-03')).toBe(false)
    expect(editionDateIsValid('2026-01-01', '2026-01-04', '2026-01-03')).toBe(false)
    expect(editionDateIsValid('', '2026-01-02', '2026-01-03')).toBe(false)
    expect(editionDateIsValid('2026-01-01', '', '2026-01-03')).toBe(false)
    expect(editionDateIsValid('2026-01-01', '2026-01-02', '')).toBe(false)
  })
})

import {describe, expect, it} from 'vitest'
import useUtil from '@/composables/useUtil'

const {normalizeTime} = useUtil()

describe('normalizeTime', () => {
  it('removes seconds returned by the API', () => {
    expect(normalizeTime('13:00:00')).toBe('13:00')
    expect(normalizeTime('08:45:30')).toBe('08:45')
  })

  it('keeps times without seconds and handles empty values', () => {
    expect(normalizeTime('13:00')).toBe('13:00')
    expect(normalizeTime('')).toBe('')
  })
})

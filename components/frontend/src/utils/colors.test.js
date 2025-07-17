import { describe, it, expect } from 'vitest'
import { brandGradient, brandGradientHover, primaryButton, linkHover, focusRing } from './colors'

describe('Color Utilities', () => {
  describe('Basic Exports', () => {
    it('exports brand gradient classes', () => {
      expect(brandGradient).toBeDefined()
      expect(typeof brandGradient).toBe('string')
    })

    it('exports brand gradient hover classes', () => {
      expect(brandGradientHover).toBeDefined()
      expect(typeof brandGradientHover).toBe('string')
    })

    it('exports primary button classes', () => {
      expect(primaryButton).toBeDefined()
      expect(typeof primaryButton).toBe('string')
    })

    it('exports link hover classes', () => {
      expect(linkHover).toBeDefined()
      expect(typeof linkHover).toBe('string')
    })

    it('exports focus ring classes', () => {
      expect(focusRing).toBeDefined()
      expect(typeof focusRing).toBe('string')
    })
  })

  describe('Class Content', () => {
    it('brand gradient contains gradient classes', () => {
      expect(brandGradient).toContain('bg-gradient-to-r')
      expect(brandGradient).toContain('from-brand')
      expect(brandGradient).toContain('to-brand')
    })

    it('primary button contains proper classes', () => {
      expect(primaryButton).toContain('bg-gradient-to-r')
      expect(primaryButton).toContain('text-white')
      expect(primaryButton).toContain('transition')
    })
  })
})

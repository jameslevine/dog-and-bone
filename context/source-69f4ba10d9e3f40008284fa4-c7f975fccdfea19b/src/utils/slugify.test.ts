import { describe, it, expect } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('converts uppercase to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('replaces spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz')
  })

  it('removes special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    expect(slugify('foo  bar')).toBe('foo-bar')
  })

  it('strips leading and trailing hyphens', () => {
    expect(slugify('-foo-')).toBe('foo')
  })

  it('handles already-slugified text', () => {
    expect(slugify('hello-world')).toBe('hello-world')
  })

  it('handles an empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles a string with only special characters', () => {
    expect(slugify('!@#$%')).toBe('')
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getMotivationalQuote } from './quoteService'

let fetchMock

beforeEach(() => {
  // Replace the browser's fetch with a fake we control
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals() // put the real fetch back
})

describe('getMotivationalQuote', () => {
  it('returns { text, author } renamed from the API fields', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 3, quote: 'Time is money.', author: 'Benjamin Franklin' }),
    })

    const result = await getMotivationalQuote()

    expect(result).toEqual({ text: 'Time is money.', author: 'Benjamin Franklin' })
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][0]).toContain('dummyjson.com')
  })

  it('throws when the server answers with an error status such as 429', async () => {
    // fetch does NOT reject for 429, so the service must check response.ok itself
    fetchMock.mockResolvedValue({ ok: false, status: 429 })
    await expect(getMotivationalQuote()).rejects.toThrow('Quote request failed (429)')
  })

  it('throws when the answer has no quote field', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) })
    await expect(getMotivationalQuote()).rejects.toThrow('Unexpected quote response')
  })

  it('passes on a network failure (offline, blocked)', async () => {
    fetchMock.mockRejectedValue(new Error('Failed to fetch'))
    await expect(getMotivationalQuote()).rejects.toThrow('Failed to fetch')
  })
})

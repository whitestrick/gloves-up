// A free public API: no key needed, and it allows requests from a browser.
// "random" returns ONE quote as { id, quote, author }.
const QUOTE_URL = 'https://dummyjson.com/quotes/random'

// Gets one quote from an external API.
// Returns { text, author }. Throws an Error if anything goes wrong.
export async function getMotivationalQuote() {
  // fetch() only rejects when the NETWORK fails (offline, blocked...).
  // A server answer like 404 or 429 (too many requests) still "succeeds",
  // so we must check response.ok ourselves.
  const response = await fetch(QUOTE_URL)
  if (!response.ok) {
    throw new Error(`Quote request failed (${response.status})`)
  }

  // The body arrives as text; .json() turns it into a JavaScript object
  const data = await response.json()

  // Never trust outside data: make sure the field we need is really there
  if (!data.quote) {
    throw new Error('Unexpected quote response')
  }

  // Rename the fields to the names our app uses, so the rest of the app
  // does not depend on how this particular API names things
  return { text: data.quote, author: data.author }
}

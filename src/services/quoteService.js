// A free public API: no key needed. "tags=motivation" picks motivational quotes,
// "maxLength=140" keeps them short enough for a card.
const QUOTE_URL = 'https://quoteslate.vercel.app/api/quotes/random?tags=motivation&maxLength=140'

// Gets one motivational quote from an external API.
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

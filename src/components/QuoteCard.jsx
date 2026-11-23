import ErrorMessage from './ErrorMessage'
import Loader from './Loader'
import useQuote from '../hooks/useQuote'

// A motivational quote from an external API, with its own loading and error states.
// It is separate from the sessions list, so a failed quote never breaks the History page.
export default function QuoteCard() {
  const { quote, loading, error } = useQuote()

  let content
  if (loading) {
    content = <Loader label="Loading a quote..." />
  } else if (error) {
    content = <ErrorMessage message={error} />
  } else {
    // React escapes text it renders, so quote text from outside cannot inject HTML
    content = (
      <figure>
        <blockquote className="text-xl font-semibold">&ldquo;{quote.text}&rdquo;</blockquote>
        <figcaption className="mt-1 text-neutral-600">{quote.author}</figcaption>
      </figure>
    )
  }

  return (
    <section aria-label="Motivational quote" className="rounded-lg border-[1.5px] border-neutral-300 bg-white p-5">
      {content}
      {/* The API's author asks users to credit it */}
      <p className="mt-3 text-xs text-neutral-600">
        Quotes powered by the{' '}
        <a
          href="https://dummyjson.com/docs/quotes"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand underline"
        >
          DummyJSON
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>
  )
}

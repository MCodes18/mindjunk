import quote from '../../content/desktop/quote.txt?raw';

import './QuoteNote.css';

export default function QuoteNote() {
  return <aside className="quote-note" aria-label="Quote">
    
    <div className="quote-body"><p className="quote-heading">write-ups</p>
      <span className="quote-mark" aria-hidden="true">“</span>
      {quote.trim() && <blockquote>{quote.trim()}</blockquote>}
    </div>
  </aside>;
}

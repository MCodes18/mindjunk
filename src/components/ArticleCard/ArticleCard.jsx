import { Link } from 'react-router-dom';
export default function ArticleCard({ article, to }) {
  return <Link className="postcard" to={to} aria-label={`Read ${article.title}`}>
    <div className="postcard-top"><span className="postcard-date">{article.date ? new Date(article.date + 'T12:00:00').toLocaleDateString('en', {day:'numeric',month:'short',year:'numeric'}) : 'Undated'}</span><span className="postcard-stamp" aria-hidden="true">▤</span></div>
    <h2>{article.title}</h2>
    {article.excerpt && <p>{article.excerpt}{article.excerpt.length >= 180 ? '…' : ''}</p>}
    <div className="postcard-bottom"><span>Read →</span></div>
  </Link>;
}

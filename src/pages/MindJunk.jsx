import { useEffect, useRef } from 'react';
import { Link, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import articles, { articleImages } from '../data/articles';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import { sortYears, articleImageUrl } from '../lib/content';
import { searchArticles } from '../lib/articleSearch';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import Folder from '../components/Folder/Folder';
import './MindJunk.css';
import Doodle from '../components/Doodle/Doodle';

function Archive() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const year = params.get('year') || '';
  const showCards = Boolean(query.trim() || year);
  const scoped = year && year !== 'all' ? articles.filter(article => article.year === year) : articles;
  const filtered = searchArticles(scoped, query);
  const years = sortYears([...new Set(articles.map(article=>article.year))]);
  function setQuery(value) {
    const next = new URLSearchParams(params);
    if (value) next.set('q',value); else next.delete('q');
    setParams(next, {replace:true});
  }
  return <section>
    <header className="page-heading"><div><h1>Mind Junk</h1><p>Writings on random topics I delve into.</p></div>{articles.length > 0 && <Doodle kind="notebook" />}</header>
    <div className="notebook-toolbar">
      {year && <Link className="ui-button" to="/mindjunk">← Back</Link>}
      <label className="article-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search articles</span><input type="search" placeholder="Search articles" value={query} onChange={event=>setQuery(event.target.value)} /></label>
      {!year && articles.length > 0 && <Link className="ui-button" to="/mindjunk?year=all">All articles</Link>}
    </div>
    {!articles.length && <div className="notebook-empty-art"><Doodle kind="notebook" /></div>}
    <div className="section-label"><span>{year && year !== 'all' ? year : 'Articles'}</span><span role="status">{showCards ? filtered.length : articles.length} {(showCards ? filtered.length : articles.length) === 1 ? 'article' : 'articles'}</span></div>
    {showCards ? <><div className="postcard-grid">{filtered.map(article=><ArticleCard key={article.id} article={article} to={`/mindjunk/read/${article.id}?${params.toString()}`} />)}</div>{!filtered.length && <p className="empty-state" role="status">No articles found.</p>}</> : <div className="year-folders">{years.map((item,index)=><Folder key={item} label={item} count={articles.filter(article=>article.year===item).length} noun="articles" to={`/mindjunk?year=${item}`} previewText={articles.find(article=>article.year===item).title} color={index} />)}</div>}
  </section>;
}

function Reader() {
  const { articleId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const heading = useRef(null);
  const index = articles.findIndex(article=>article.id === articleId);
  const article = articles[index];
  const newer = articles[index-1];
  const older = index >= 0 ? articles[index+1] : null;
  const suffix = params.size ? `?${params.toString()}` : '';
  const articleLink = entry => `/mindjunk/read/${entry.id}${suffix}`;
  useEffect(() => {
    document.querySelector('.app-content')?.scrollTo({top:0});
    heading.current?.focus({preventScroll:true});
  }, [articleId]);
  if (!article) return <section className="empty-state"><h1>Article not found</h1><Link className="ui-button" to="/mindjunk">← Back</Link></section>;
  return <section className="article-reader" onKeyDown={event=>{
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input,textarea,select')) return;
    if (event.key === 'ArrowLeft' && newer) { event.preventDefault(); navigate(articleLink(newer)); }
    if (event.key === 'ArrowRight' && older) { event.preventDefault(); navigate(articleLink(older)); }
  }}>
    <div className="reader-toolbar"><Link className="ui-button" to={`/mindjunk${suffix}`}>← Back</Link><span className="tiny">{index+1} / {articles.length}</span></div>
    <div className="reader-layout">
      <div className="reader-arrow newer">{newer ? <Link to={articleLink(newer)} aria-label={`Newer article: ${newer.title}`}><span aria-hidden="true">←</span><span>Newer</span></Link> : <button disabled aria-label="No newer article"><span aria-hidden="true">←</span><span>Newer</span></button>}</div>
      <article className="reader-paper">
        <div className="reader-meta"><time dateTime={article.date || undefined}>{article.date ? new Date(article.date+'T12:00:00').toLocaleDateString('en',{day:'numeric',month:'long',year:'numeric'}) : 'Undated'}</time></div>
        <h1 ref={heading} tabIndex={-1}>{article.title}</h1>
        <div className="article-body"><ReactMarkdown skipHtml urlTransform={(url, key) => key === 'src' ? articleImageUrl(url, article.sourcePath, articleImages) : defaultUrlTransform(url)}>{article.body}</ReactMarkdown></div>
      </article>
      <div className="reader-arrow older">{older ? <Link to={articleLink(older)} aria-label={`Older article: ${older.title}`}><span aria-hidden="true">→</span><span>Older</span></Link> : <button disabled aria-label="No older article"><span aria-hidden="true">→</span><span>Older</span></button>}</div>
    </div>
  </section>;
}

export default function MindJunk() {
  return <Routes><Route index element={<Archive />} /><Route path="read/:articleId" element={<Reader />} /><Route path="*" element={<div className="empty-state"><h1>404</h1><Link className="ui-button" to="/mindjunk">← Back</Link></div>} /></Routes>;
}

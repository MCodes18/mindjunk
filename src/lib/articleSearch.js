// Offline relevance search: related concepts, word forms, and one-character typos.
// No remote service, API key, tracking, or embedding-model download.
const conceptGroups = [
  ['photo','photograph','photography','picture','camera','image','capture'],
  ['book','books','reading','read','novel','literature','author'],
  ['music','song','singing','sing','melody','carnatic','concert'],
  ['travel','trip','journey','holiday','vacation','tour'],
  ['flower','flowers','bloom','blossom','bougainvillea','garden','gardening'],
  ['technology','computer','computing','software','programming','code','coding'],
  ['memory','memories','remember','recollection','nostalgia','past'],
  ['philosophy','meaning','ethics','existence','belief'],
  ['psychology','mind','emotion','feeling','behaviour','behavior'],
  ['economics','economy','money','finance','market'],
  ['food','cooking','meal','recipe','cuisine'],
  ['rain','rainy','rainfall','monsoon','weather'],
  ['happy','happiness','joy','joyful','delight'],
  ['sad','sadness','grief','sorrow'],
  ['history','historical','ancient','heritage'],
];
const stopWords = new Set(['a','an','and','are','as','at','be','by','for','from','i','in','is','it','me','my','of','on','or','some','that','the','to','was','what','with','about','find','show','article','articles','something','related','looking','where','when','how','why','does','do','can','you','tell','please','posts','thoughts']);
const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const tokens = value => normalize(value).match(/[\p{L}\p{N}]+/gu) || [];
function stem(word) {
  if (word.length > 5 && word.endsWith('ies')) return word.slice(0,-3) + 'y';
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0,-3);
  if (word.length > 4 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0,-1);
  return word;
}
const related = new Map();
for (const group of conceptGroups) {
  const forms = new Set(group.map(stem));
  for (const term of forms) related.set(term, forms);
}
function nearMatch(a,b) {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4 || Math.abs(a.length-b.length)>1) return false;
  if (a.length === b.length) {
    const differences = [...a].map((letter,i)=>letter === b[i] ? -1 : i).filter(i=>i>=0);
    return differences.length === 1 || (differences.length === 2 && differences[1] === differences[0]+1 && a[differences[0]] === b[differences[1]] && a[differences[1]] === b[differences[0]]);
  }
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  let i = 0, j = 0, skipped = false;
  while (i < shorter.length && j < longer.length) {
    if (shorter[i] === longer[j]) { i++; j++; }
    else if (skipped) return false;
    else { skipped = true; j++; }
  }
  return true;
}
export function searchArticles(articles, query) {
  const terms = [...new Set(tokens(query).filter(token=>!stopWords.has(token)).map(stem))];
  if (!terms.length) return articles;
  return articles.map((article, index) => {
    const fields = [[article.title,6],[article.excerpt,3],[article.body,1]].map(([text,weight])=>({words:new Set(tokens(text).map(stem)),weight}));
    let score = 0;
    for (const term of terms) {
      let best = 0;
      for (const {words,weight} of fields) {
        if (words.has(term)) best = Math.max(best,weight*4);
        else if ([...(related.get(term) || [])].some(word=>words.has(word))) best = Math.max(best,weight*2);
        else if ([...words].some(word=>(term.length>=3 && word.startsWith(term)) || nearMatch(term,word))) best = Math.max(best,weight);
      }
      if (!best) return {article,index,score:0};
      score += best;
    }
    return {article,index,score};
  }).filter(result=>result.score>0).sort((a,b)=>b.score-a.score || a.index-b.index).map(result=>result.article);
}

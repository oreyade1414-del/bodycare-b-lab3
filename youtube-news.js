/* 新着動画の共有データ。ここへ登録するとトップInformationと動画ページへ同時反映。
各項目: {title: "実際の動画タイトル", url: "https://www.youtube.com/watch?v=実際のID", date: "YYYY-MM-DD", channel: "社長のYouTube"}
架空の動画や未公開動画は登録しない。YouTubeからの自動取得ではない。 */
const blabVideos = [];
(function () {
  const valid = blabVideos.filter(v => {
    try {
      const u = new URL(v.url);
      return u.protocol === 'https:' && ['www.youtube.com','youtube.com','youtu.be'].includes(u.hostname) && typeof v.title === 'string' && v.title.trim() && /^\d{4}-\d{2}-\d{2}$/.test(v.date) && !isNaN(Date.parse(v.date));
    } catch { return false; }
  }).sort((a,b) => b.date.localeCompare(a.date));
  function node(tag, text, cls) { const el = document.createElement(tag); if(text) el.textContent = text; if(cls) el.className = cls; return el; }
  function link(v, cls) { const a = node('a', '', cls); a.href=v.url; a.target='_blank'; a.rel='noopener noreferrer'; return a; }
  function date(v) { const t=node('time',v.date.replaceAll('-','.')); t.dateTime=v.date; return t; }
  const list=document.getElementById('video-list');
  if(list && valid.length) {
    document.getElementById('latest-videos').hidden=false;
    valid.forEach(v => { const a=link(v,'video-card'); a.append(date(v),node('span',v.channel || 'YouTube','channel-label'),node('h3',v.title),node('span','YouTubeで見る ↗','watch')); list.append(a); });
  }
  const news=document.getElementById('youtube-information');
  if(news && valid.length) {
    const fragment=document.createDocumentFragment();
    valid.slice(0,3).forEach(v=>{const a=link(v,'information-item');a.append(date(v),node('span','YouTube','info-category'),node('strong',(v.channel ? v.channel+'：' : '')+v.title),node('span','↗','info-arrow'));fragment.append(a);});
    news.before(fragment);
  }
})();
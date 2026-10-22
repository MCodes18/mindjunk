// This isolated document gives YouTube its required site identification while
// the rest of the website keeps its no-referrer policy and local-only scripts.
const video = new URLSearchParams(location.search).get('video');
const error = document.getElementById('error');
function showError(message) {
  error.textContent = message;
  error.hidden = false;
}
if (!/^[a-zA-Z0-9_-]{11}$/.test(video || '')) {
  showError('Invalid video link.');
} else {
  window.onYouTubeIframeAPIReady = () => {
    new window.YT.Player('player', {
      host: 'https://www.youtube-nocookie.com',
      width: '100%', height: '100%', videoId: video,
      playerVars: { autoplay: 0, playsinline: 1, origin: location.origin, rel: 0 },
      events: {
        onError(event) {
          showError(`YouTube error ${event.data}. Use Open track below.`);
        },
        onStateChange(event) {
          if (event.data === 1) error.hidden = true;
        }
      }
    });
  };
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  script.referrerPolicy = 'strict-origin-when-cross-origin';
  script.onerror = () => showError('YouTube could not load. Use Open track below.');
  document.head.appendChild(script);
}

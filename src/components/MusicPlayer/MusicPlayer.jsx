import { useRef, useState } from 'react';
import { favoriteTrack } from '../../data/music';
import { musicLink, spotifyEmbed, youtubeEmbed, formatTime } from '../../lib/music';
import PixelIcon from '../PixelIcon/PixelIcon';
import './MusicPlayer.css';
import SpotifyEmbed from './SpotifyEmbed';

export default function MusicPlayer({ visible }) {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(.6);
  const [error, setError] = useState('');
  const link = musicLink(favoriteTrack.url);
  const local = Boolean(favoriteTrack.audioSrc);
  const youtube = youtubeEmbed(favoriteTrack.url, window.location.origin);
  const embed = spotifyEmbed(favoriteTrack.url) || youtube;
  async function togglePlay() {
    if (!audio.current || !local) return;
    if (playing) audio.current.pause();
    else {
      try { audio.current.volume=volume; await audio.current.play(); setError(''); }
      catch { setError('Unable to play audio.'); }
    }
  }
  return <aside className={`music-player${embed ? ` music-player-spotify${youtube ? ' music-player-youtube' : ''}` : ''}`} hidden={!visible} aria-label="Music player">
    <div className="music-titlebar"><PixelIcon type="note" /><span>current vibe</span><PixelIcon type="heart" /></div>
    {embed ? <div className="spotify-player">{youtube ? <iframe className="youtube-embed" title={`YouTube player: ${favoriteTrack.title || 'Current vibe'}`} src={`${import.meta.env.BASE_URL}youtube-player.html?video=${new URL(link.url).searchParams.get('v')}`} width="100%" height="200" scrolling="no" referrerPolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen /> : <SpotifyEmbed title={`Spotify player: ${favoriteTrack.title || 'Current vibe'}`} src={embed} />}<a className="spotify-fallback" href={link.url} target="_blank" rel="noopener noreferrer">Open track ↗</a></div> : <div className="music-content">
      <div className="music-track"><div className="record-art" aria-hidden="true"><div className="record-disc"><span /></div><PixelIcon type="heart" /></div><div><p className="track-title">{favoriteTrack.title || (local || link ? 'Current favorite' : 'No track selected')}</p>{favoriteTrack.artist && <p className="track-artist">{favoriteTrack.artist}</p>}<div className={`equalizer ${playing ? 'playing' : ''}`} aria-hidden="true">{[1,2,3,4,5,6,7,8].map(i=><i key={i} style={{'--bar':i}} />)}</div></div></div>
      {link ? <div className="stream-controls"><a className="ui-button" href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${favoriteTrack.title || 'track'} on ${link.type} in a new tab`}><PixelIcon type="play" />Open track ↗</a></div> : <>
        {local && <audio ref={audio} src={favoriteTrack.audioSrc} preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>{setPlaying(false);setError('Unable to load audio.');}} onTimeUpdate={event=>setTime(event.currentTarget.currentTime)} onLoadedMetadata={event=>setDuration(Number.isFinite(event.currentTarget.duration)?event.currentTarget.duration:0)} />}
        <div className="music-seek"><span>{formatTime(time)}</span><input aria-label="Seek song" type="range" min="0" max={duration || 1} step=".1" value={Math.min(time,duration || 1)} disabled={!local || !duration} onChange={event=>{const next=Number(event.target.value);audio.current.currentTime=next;setTime(next);}} /><span>{formatTime(duration)}</span></div>
        <div className="music-controls"><button className="pixel-control play-control" disabled={!local} onClick={togglePlay} aria-label={playing ? 'Pause music' : 'Play music'}><PixelIcon type={playing ? 'pause' : 'play'} /></button><PixelIcon type="sound" /><input aria-label="Volume" type="range" min="0" max="1" step=".05" value={volume} disabled={!local} onChange={event=>{const next=Number(event.target.value);setVolume(next);if(audio.current)audio.current.volume=next;}} /></div>
      </>}
      {error && <p className="music-error" role="status">{error}</p>}
    </div>}
  </aside>;
}

import store from '../store';

// const songs = ['assets/audio/compete1.s111.mp3', 'assets/audio/compete2.s111.mp3', 'assets/audio/compete3.s111.mp3'];
const cache = new Map<string, HTMLAudioElement[]>();
let currentlyPlaying: HTMLAudioElement;
let songIndex = Math.max(Number(localStorage.getItem('music-scene') ?? '0'), 0);
let previousScene = localStorage.getItem('music-scene') ?? '-1';
let scene = previousScene;
let playing = false;
let muted = store.getState().settings.mute;

const onended = (e: Event) => {
  songIndex += 1;

  if (songIndex >= (cache.get(scene)?.length ?? 0)) {
    songIndex = 0;
  }

  const songs = cache.get(scene);

  if (!!songs && !!songs[songIndex]) {
    switchSong(songs[songIndex]);
  }
};

const applyFunctions = (_audio: HTMLAudioElement) => {
  _audio.onended = onended;
  _audio.volume = muted ? 0 : store.getState().settings.volume / 100;

  return _audio;
};

fetch(`${process.env.REACT_APP_CDN_PATH}audio/playlist.json`)
  .then((r) => r.json())
  .then((d) => {
    Object.keys(d.scenes).forEach((key) => {
      cache.set(
        key,
        d.scenes[key].map((song: string) => applyFunctions(new Audio(`${process.env.REACT_APP_CDN_PATH}audio/` + song)))
      );
    });
  });

export function play(_scene: number) {
  if (cache.has('' + _scene)) {
    scene = '' + _scene;
  } else {
    scene = '-1';
  }

  if (scene === previousScene && playing) {
    return;
  }

  const songs = cache.get(scene);

  if (songs !== undefined) {
    if (playing) {
      cache.get(previousScene)?.[songIndex]?.pause();
      songIndex = Math.floor(Math.random() * (cache.get(scene)?.length ?? 0));
    }

    if (songIndex >= (cache.get(scene)?.length ?? 0)) {
      songIndex = 0;
    }

    if (songs[songIndex] !== undefined) {
      switchSong(songs[songIndex]);

      playing = true;
      previousScene = scene;
      localStorage.setItem('music-scene', scene);
      localStorage.setItem('music-index', '' + songIndex);
    }
  }
}

export function mute(state: boolean) {
  muted = state;

  if (!!currentlyPlaying) {
    currentlyPlaying.volume = muted ? 0 : store.getState().settings.volume / 100;
  }
}

export function pause() {
  cache.get(scene)?.[songIndex]?.pause();
}

export function setVolume(volume: number) {
  if (!!currentlyPlaying) {
    currentlyPlaying.volume = muted ? 0 : volume / 100;
  }
}

function switchSong(song: HTMLAudioElement) {
  currentlyPlaying = song;
  currentlyPlaying.play();
  currentlyPlaying.volume = muted ? 0 : store.getState().settings.volume / 100;
}

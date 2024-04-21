/* const MIN_WIDTH : 320,
const MIN_HEIGHT : 180,

const IDEAL_WIDTH : 640,
const IDEAL_HEIGHT : 360,

const MAX_WIDTH : 1920,
const MAX_HEIGHT : 1080, */

/* export const VIDEO = {
  width: {
    min: 640,
    ideal: 1280,
    max: 1920,
  },
  height: {
    min: 360,
    ideal: 720,
    max: 1080,
  },
  framerate: 15,
}; */

export const VIDEO = {
  width: {
    min: 320,
    ideal: 640,
    max: 1920,
  },
  height: {
    min: 180,
    ideal: 360,
    max: 1080,
  },
  framerate: 15,
};

export const AUDIO = {
  bitrate: 44100,
};

export const ORIENTATION = {
  portrait: 'portrait',
  landscape: 'landscape',
};

export const SIDE = {
  front: 'front',
  back: 'back',
};

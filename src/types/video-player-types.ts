import Video from 'react-native-video';

export interface ControlsState {
  isPlaying: boolean;
  progress: number;
  duration: number;
  showControls: boolean;
  isAdPlaying: boolean; 
  currentAd: AdType | null; 
  isBuffering:boolean
}

export interface VideoPlayerControlsProps {
  title: string;
  controls: ControlsState;
  setControls: (value: React.SetStateAction<ControlsState>) => void;
  videoRef: React.RefObject<React.ElementRef<typeof Video>>;
}

export interface VideoPlayerProps {
  source: string;
  title: string;
}

export const AD_TYPES = {
  PRE_ROLL: 'preRoll',
  MID_ROLL: 'midRoll',
  POST_ROLL: 'postRoll',
} as const;

export type AdType = (typeof AD_TYPES)[keyof typeof AD_TYPES];

export interface AdState {
  isAdPlaying: boolean;
  currentAd: AdType | null;
}

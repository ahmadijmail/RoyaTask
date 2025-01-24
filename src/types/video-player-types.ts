import Video from 'react-native-video';

export interface ControlsState {
  isPlaying: boolean;
  progress: number;
  duration: number;
  showControls: boolean;
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
  seasonNumber?: number;
  episodeNumber?: number;
  nextEpisode?: () => void;
}

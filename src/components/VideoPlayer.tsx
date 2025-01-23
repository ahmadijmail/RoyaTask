import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
  AppState,
  AppStateStatus,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';

const icons = {
  forward: require('../assets/btnForward.png'),
  pause: require('../assets/btnPause.png'),
  play: require('../assets/btnPlay.png'),
  rewind: require('../assets/btnRewind.png'),
  back: require('../assets/iconBack.png'),
  backEn: require('../assets/iconBackEn.png'),
  channelPrograms: require('../assets/iconChannelPrograms.png'),
  download: require('../assets/iconDownload.png'),
  episodes: require('../assets/iconEpisodes.png'),
  expand: require('../assets/iconExpand.png'),
  free: require('../assets/iconFree.png'),
  minimize: require('../assets/iconMinimize.png'),
  pip: require('../assets/iconPip.png'),
  settings: require('../assets/iconSettings.png'),
  share: require('../assets/iconShare.png'),
};

interface VideoPlayerProps {
  source: string;
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  nextEpisode?: () => void;
  hasAds?: boolean;
}

interface ControlsState {
  isPlaying: boolean;
  progress: number;
  duration: number;
  showControls: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  title,
  hasAds = false,
}) => {
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);
  const [controls, setControls] = useState<ControlsState>({
    isPlaying: true,
    progress: 0,
    duration: 0,
    showControls: true,
  });

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  const onProgress = (data: {currentTime: number}) => {
    setControls(prev => ({
      ...prev,
      progress: data.currentTime,
    }));
  };

  const onLoad = (data: {duration: number}) => {
    setControls(prev => ({
      ...prev,
      duration: data.duration,
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Video
        ref={videoRef}
        source={{uri: source}}
        style={styles.video}
        onProgress={onProgress}
        onLoad={onLoad}
        onError={error => console.log('Video Error:', error)}
        paused={!controls.isPlaying}
        resizeMode="contain"
      />

      {controls.showControls && (
        <View style={styles.controlsContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton}>
              <Image source={icons.share} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image source={icons.pip} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.titleArabic}>{title}</Text>
            {hasAds && (
              <View style={styles.freeContainer}>
                <Text style={styles.freeText}>FREE</Text>
              </View>
            )}
            <TouchableOpacity style={styles.iconButton}>
              <Image source={icons.back} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.centerControls}>
            <TouchableOpacity>
              <View style={styles.circleButton}>
                <Image source={icons.rewind} style={styles.controlIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setControls(prev => ({...prev, isPlaying: !prev.isPlaying}))
              }>
              <View style={styles.playPauseButton}>
                <Image
                  source={controls.isPlaying ? icons.pause : icons.play}
                  style={styles.playPauseIcon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.circleButton}>
                <Image source={icons.forward} style={styles.controlIcon} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime(controls.progress)}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(controls.duration)}
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={controls.duration}
                value={controls.progress}
                minimumTrackTintColor="rgb(255, 255, 255)"
                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                thumbTintColor="rgb(255, 255, 255)"
                onValueChange={() => {
                  if (controls.isPlaying) {
                    setControls(prev => ({...prev, isPlaying: false}));
                  }
                }}
                onSlidingComplete={value => {
                  videoRef.current?.seek(value);
                  setControls(prev => ({...prev, isPlaying: true}));
                }}
              />
            </View>
            <View style={styles.bottomControls}>
              <View style={styles.leftControls}>
                <TouchableOpacity style={styles.controlButton}>
                  <Image source={icons.episodes} style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.speedButton}>
                  <Text style={styles.speedText}>X 1.0</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.controlButton}>
                <Image source={icons.settings} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: Platform.OS === 'ios' ? 44 : 0,
  },
  video: {
    flex: 1,
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  titleArabic: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  freeContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  freeText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  circleButton: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonNumber: {
    color: 'white',
    fontSize: 12,
    position: 'absolute',
    top: 8,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    width: '100%',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  sliderContainer: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  speedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  speedText: {
    color: 'white',
    fontSize: 14,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  iconButton: {
    marginHorizontal: 8,
  },

  controlIcon: {
    width: 60,
    height: 60,
  },

  playPauseIcon: {
    width: 70,
    height: 70,
  },
  controlButton: {
    marginHorizontal: 8,
  },
});

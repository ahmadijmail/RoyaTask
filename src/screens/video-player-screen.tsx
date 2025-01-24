import { VideoPlayer } from "../components/video-player";

export default function VideoScreen() {
  const data = {
    source:
      'https://roya-vod.ercdn.net/hls/i/r0/ixev5jcihldq43huwlykbswxmt0qv1qcaojfyx8h/ixev5jcihldq43huwlykbswxmt0qv1qcaojfyx8h_600.mp4',
    title: 'Family Matter',
  };

  return <VideoPlayer source={data.source} title={data.title} />;
}
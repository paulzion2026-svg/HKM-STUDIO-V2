
export type SourceType = 
  | 'video' | 'dvd' | 'list' | 'camera' | 'ndi' | 'stream' 
  | 'replay' | 'stinger' | 'delay' | 'image' | 'photos' 
  | 'powerpoint' | 'color' | 'audio' | 'audio-input' | 'title' 
  | 'virtual-set' | 'web' | 'video-call' | 'zoom' | 'telestrator' | 'bible' | 'screen' | 'blank';

export type MotionEffect = 'none' | 'particles' | 'bubbles' | 'flares' | 'clouds' | 'energy' | 'snow';

export interface BibleTheme {
  id: string;
  name: string;
  category: 'full' | 'lowerthird';
  background: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  motionEffect: MotionEffect;
  motionIntensity: number;
  overlayOpacity: number;
  isAnimated: boolean;
}

export interface AppSettings {
  theme: string;
  previewColor: string;
  outputColor: string;
  masterFrameRate: string;
  outputSize: string;
  aspectRatio: string;
  performanceMode: boolean;
  gpuAcceleration: boolean;
  language: string;
  inputSize: string;
  fullscreen1Display: string;
  fullscreen2Display: string;
  hideCursor: boolean;
  onTop: boolean;
  minimize: boolean;
  startAdvancedMode: boolean;
  startFullscreen: boolean;
  startMaximized: boolean;
  displayConfirmationRecord: boolean;
  displayConfirmationInputClose: boolean;
  autoPlayOutputTransition: boolean;
  autoPausePreviewTransition: boolean;
  quickPlayTransition: string;
  quickPlayDuration: number;
  ftbDuration: number;
  graphicsAdapter: string;
  lowLatencyCapture: boolean;
  highInputPerformance: boolean;
  showPreviewThumbnails: boolean;
  disableWindowsUpdate: boolean;
  showGpuCpuAlerts: boolean;
  displayMethod: string;
  preferredDeinterlacingCamera: string;
  preferredDeinterlacingPlayback: string;
  ffmpegFileTypes: string;
  mpeg2VideoDecoder: string;
  mpegAudioDecoder: string;
  x264VideoDecoder: string;
  useVmixDeinterlacing: boolean;
  // Scripture Settings
  maxWordsPerSlide?: number;
  activeBibleThemeId?: string;
}

export interface StreamDestination {
  id: string;
  name: string;
  platform: 'youtube' | 'facebook' | 'twitch' | 'rtmp' | 'webrtc';
  url: string;
  key: string;
  enabled: boolean;
  status: 'idle' | 'connecting' | 'live' | 'error';
  bitrate?: number;
  quality: string;
  encoder: 'FFMPEG' | 'FMLE' | 'FFMPEG2' | 'FFMPEG6';
  useHardwareEncoder: boolean;
  uptime?: number;
}

export interface SourceInputSettings {
  category?: string;
  aspectRatio: string;
  sourceAspectRatio: string;
  mouseClickAction: string;
  deinterlaceBlend: boolean;
  sharpen: boolean;
  mirror: boolean;
  flattenLayers: boolean;
  autoMixAudio: boolean;
  autoPlayWithTransition: boolean;
  autoRestartWithTransition: boolean;
  autoPauseAfterTransition: boolean;
  zoom: number;
  zoomX: number;
  zoomY: number;
  panX: number;
  panY: number;
  rotate: number;
  rotateX: number;
  rotateY: number;
  perspective: number;
  mirrorX: boolean;
  mirrorY: boolean;
  cropX1: number;
  cropY1: number;
  cropX2: 1280;
  cropY2: 720;
  red: number;
  green: number;
  blue: number;
  saturation: number;
  brightness: number;
  contrast: number;
  hue: number;
  blur: number;
  sepia: number;
  blackStretch: number;
  whiteStretch: number;
  alpha: number;
  chromaKeyEnabled: boolean;
  chromaKeyColor: string;
  chromaKeyTolerance: number;
  lumaKeyEnabled: boolean;
  lumaKeyThreshold: number;
  alphaChannelMode: 'Auto' | 'Straight' | 'Premultiplied' | 'None';
  borderEnabled: boolean;
  borderThickness: number;
  borderColor: string;
  borderRadius: number;
  multiLayers: { index: number; sourceId: string; enabled: boolean }[];
  markIn?: number;
  markOut?: number;
}

export interface StudioSource {
  id: string;
  name: string;
  type: SourceType;
  stream?: MediaStream;
  mediaUrl?: string; 
  originalUrl?: string; 
  color?: string;
  bibleText?: string;
  bibleRef?: string;
  biblePart?: string; // e.g., "PART A"
  isActive: boolean;
  isLooping?: boolean;
  isPaused?: boolean;
  isMonitored?: boolean;
  isMuted?: boolean;
  hasAudio?: boolean;
  volume?: number; 
  ndiChannel?: string; 
  isBridge?: boolean;
  settings?: SourceInputSettings;
}

export interface OverlayLayer {
  id: string;
  type: 'lower-third' | 'title' | 'bible' | 'overlay';
  visible: boolean;
  content: {
    line1: string;
    line2?: string;
  };
}

export type TransitionType = 
  | 'fade' | 'zoom' | 'wipe' | 'slide' | 'fly' | 'crossZoom' 
  | 'flyRotate' | 'cube' | 'cubeZoom' | 'verticalWipe' | 'verticalSlide' 
  | 'merge' | 'wipeReverse' | 'slideReverse' | 'verticalWipeReverse' 
  | 'verticalSlideReverse' | 'barnDoor' | 'rollerDoor' | 'stinger1' 
  | 'stinger2' | 'stinger3' | 'stinger4' | 'glitch'
  | 'wipe-left' | 'wipe-right' | 'wipe-top' | 'wipe-bottom'
  | 'slide-left' | 'slide-right' | 'slide-top' | 'slide-bottom'
  | 'cube-left' | 'cube-right' | 'cube-up' | 'cube-down'
  | 'zoom-in' | 'zoom-out';

export interface TransitionPreset {
  id: string;
  name: string;
  type: TransitionType;
  duration: number;
}

export type RecordingFormat = 'AVI' | 'WMV' | 'WMV Streaming' | 'MP4' | 'FFMPEG' | 'HKM RAW' | 'vMix AVI' | 'MKV';

export interface MultiCorderInput {
  id: string;
  name: string;
  enabled: boolean;
  duration: number;
  droppedFrames: number;
  folder: string;
  status: 'idle' | 'recording' | 'error';
}

export interface MultiCorderSettings {
  format: RecordingFormat;
  codec: string;
  videoQuality: string;
  audioQuality: string;
  audioSource: string;
  newFileEvery: string;
  recordNdiOriginal: boolean;
  compressionQuality: number;
  wavFileRecord: boolean;
  showUnsupported: boolean;
  baseFolder: string;
  isRecording: boolean;
}

export interface RecordingSettings {
  output: string;
  enabled: boolean;
  format: RecordingFormat;
  filename: string;
  size: string;
  frameRate: string;
  bitrate: number | string;
  useHardwareEncoder: boolean;
  faultTolerant: boolean;
  audioSource: string;
  audioDelay: number;
  audioBitrate: number | string;
  newFileEvery: string;
  mp4Profile: string;
  ffmpegCodec: string;
  ffmpegFormat: string;
  ffmpegVideoQuality: string;
  ffmpegAudioQuality: string;
  aviQuality: string;
  aviCodec: string;
  wmvFps: number;
  wmvQuality: number;
  wmvCodec: string;
  wmvAudioCodec: string;
  wmvPort: number;
  wavFileRecord: boolean;
}

/**
 * Z-eye (com.zeye.app) - Stage 1 Core Foundation Type Definitions
 */

export interface User {
  id: string; // UUIDv7 format
  username: string;
  displayName: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  bio: string;
  pronouns?: string;
  links: string[];
  isPrivate: boolean;
  isVerified?: boolean;
  age: number;
  isAgeGated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceInfo {
  deviceId: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
  ipAddress: string;
  locationCity: string;
  lastActive: string;
  isCurrentDevice?: boolean;
}

export interface Session {
  id: string;
  userId: string;
  device: DeviceInfo;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface PostMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9';
  altText?: string;
  duration?: number;
  width?: number;
  height?: number;
}

export interface PostCollaborator {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified?: boolean;
}

export interface TaggedUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  xPercent?: number; // Pin position 0-100
  yPercent?: number;
}

export interface VideoExportQualityConfig {
  resolution: '4K' | '2K' | '1080p' | '720p' | 'zero_mb';
  fps: 24 | 30 | 60 | 120;
  codec: 'AV1' | 'HEVC' | 'H264';
  bitrateKbps?: number;
  fileSizeMB?: number;
  colorDepth?: '10-bit HDR' | '8-bit SDR';
}

export interface PostAudioTrack {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  bpm?: number;
  duration?: number;
  isAiGenerated?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  postType?: 'photo' | 'video';
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified?: boolean;
  };
  collaborators?: PostCollaborator[];
  taggedUsers?: TaggedUser[];
  videoQuality?: VideoExportQualityConfig;
  audioTrack?: PostAudioTrack;
  media: PostMediaItem[];
  caption: string;
  gamingTag?: string;
  likesCount: number;
  commentsCount: number;
  hasLiked: boolean;
  hasSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  text: string;
  parentId?: string | null;
  likesCount: number;
  hasLiked: boolean;
  replies?: Comment[];
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterUserId: string;
  targetType: 'post' | 'user' | 'comment';
  targetId: string;
  category: 'spam' | 'nudity' | 'violence' | 'copyright' | 'hate_speech' | 'csam' | 'other';
  notes?: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  createdAt: string;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  isKillSwitch: boolean;
}

export interface SyncEvent {
  id: string;
  type: 'LIKE_UPDATED' | 'COMMENT_ADDED' | 'POST_CREATED' | 'SESSION_TERMINATED' | 'FOLLOW_UPDATED' | 'ALERT';
  payload: any;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  userId?: string;
  deviceId?: string;
  ipAddress: string;
  details: string;
}

export type PlatformMode = 'android' | 'ios' | 'desktop' | 'mac';

export interface DeviceHardwareProfile {
  os: 'android' | 'ios' | 'windows' | 'mac' | 'other';
  deviceModel: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  colorDepth: number;
  isAmoledCapable: boolean;
  refreshRateHz: number;
  cpuCores: number;
  memoryGB: number;
  connectionType: string;
  isTouchScreen: boolean;
}

export interface DeviceOptimizationResult {
  detectedProfile: string;
  hardwareSummary: string;
  recommendedSettings: {
    frameRate: string;
    compressionLevel: string;
    renderScale: string;
    streamChunkMB: number;
    hdrToneMapping: boolean;
    amoledTrueBlack: boolean;
    dataSaverActive: boolean;
  };
  installerPackage: {
    packageName: string;
    targetPlatform: string;
    fileFormat: string;
    fileSizeMB: number;
    sha256: string;
    optimizations: string[];
    installGuide: string;
  };
  aiBotVerdictHindi: string;
  aiBotVerdictEnglish: string;
}

export interface MediaCompressionBlueprint {
  originalSizeMB: number;
  compressedSizeMB: number;
  savedPercent: string;
  compressionMode: 'zero_mb' | 'ultra_saver' | 'balanced' | 'master';
  codec: string;
  bitrateKbps: number;
  perceptualQualityScore: number;
  viewerStreamCostMB: number;
  aiAdviceHindi: string;
}

export interface MediaFilterSettings {
  filterName: string; // 'none', 'cyber_amoled', 'noir', 'vintage', 'sunset', 'emerald', 'vivid', 'midnight'
  brightness: number; // 50 to 150
  contrast: number; // 50 to 180
  saturation: number; // 0 to 200
  warmth: number; // -60 to 60
  blur: number; // 0 to 8
  vignette: boolean;
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9';
  // Text Overlay
  overlayText?: string;
  overlayPosition?: 'top' | 'center' | 'bottom';
  overlayColor?: string;
  overlayStyle?: 'glow' | 'minimal' | 'cyber';
  watermark: boolean;
  // Video trimming & speed
  trimStartSec?: number;
  trimEndSec?: number;
  playbackSpeed?: number;
  // Music
  selectedMusicId?: string;
  musicTitle?: string;
  musicVolume?: number;
  muteOriginalAudio?: boolean;
}

// ------------------------------------
// CAPCUT PRO EDITING SUITE INTERFACES
// ------------------------------------
export interface TimelineClip {
  id: string;
  type: 'video' | 'image';
  url: string;
  startSec: number;
  durationSec: number;
  speed: number;
  filterName: string;
  volume: number;
  transitionIn?: 'none' | 'glitch' | 'flash' | 'zoom' | 'whip' | 'fade_black';
}

export interface TimelineAudioTrack {
  id: string;
  title: string;
  artist: string;
  url?: string;
  startSec: number;
  durationSec: number;
  volume: number;
  isMuted: boolean;
  isAiGenerated?: boolean;
}

export interface TimelineTextOverlay {
  id: string;
  text: string;
  startSec: number;
  durationSec: number;
  position: 'top' | 'center' | 'bottom';
  style: 'neon' | 'cyber' | 'typewriter' | 'karaoke' | 'minimal';
  color: string;
  fontSize: number;
}

export interface CapCutProProject {
  id: string;
  title: string;
  aspectRatio: '9:16' | '1:1' | '16:9' | '4:5';
  durationSec: number;
  clips: TimelineClip[];
  audioTracks: TimelineAudioTrack[];
  textOverlays: TimelineTextOverlay[];
  exportConfig: VideoExportQualityConfig;
}

// ------------------------------------
// Z-EYE MUSIC LIBRARY & AI MAESTRO
// ------------------------------------
export interface ZeyeTrackItem {
  id: string;
  title: string;
  artist: string;
  genre: 'Trending Reels' | 'Phonk & Bass' | 'Desi Lofi' | 'Cyberpunk' | 'Cinematic' | 'Hip Hop';
  bpm: number;
  duration: number; // in seconds
  tags: string[];
  isAiGenerated?: boolean;
  coverArt?: string;
  audioRecipe?: any;
}

// ------------------------------------
// BUILT-IN AI VOICE & CHAT GUIDE
// ------------------------------------
export interface GuideMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  speechText?: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

// ------------------------------------
// DEDICATED AI PHOTO & VIDEO STUDIO
// ------------------------------------
export interface AiMediaGenerationRequest {
  type: 'photo' | 'video';
  prompt: string;
  style: string;
  aspectRatio: '9:16' | '1:1' | '16:9' | '4:5';
  quality: 'amoled_hd' | 'photorealistic_4k' | 'hyper_motion';
}

export interface AiMediaGenerationResult {
  id: string;
  type: 'photo' | 'video';
  url: string;
  prompt: string;
  enhancedPrompt?: string;
  aspectRatio: '9:16' | '1:1' | '16:9' | '4:5';
  duration?: number;
  captionDraft?: string;
  suggestedTags?: string[];
}




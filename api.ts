import { Post, Comment, User, Session, FeatureFlag, AuditLogEntry } from '../types';

// Device identity in localStorage (simulating Android Keystore install-scoped ID)
export function getOrCreateDeviceId(): string {
  let devId = localStorage.getItem('zeye_device_id');
  if (!devId) {
    devId = `dev-droid-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('zeye_device_id', devId);
  }
  return devId;
}

export function getDeviceModel(): string {
  let model = localStorage.getItem('zeye_device_model');
  if (!model) {
    model = 'Samsung Galaxy S25 Ultra (AMOLED)';
    localStorage.setItem('zeye_device_model', model);
  }
  return model;
}

export function setDeviceModel(model: string) {
  localStorage.setItem('zeye_device_model', model);
}

const getHeaders = (userId?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-device-id': getOrCreateDeviceId(),
  };
  if (userId) {
    headers['x-user-id'] = userId;
  }
  return headers;
};

export const api = {
  // Feed
  getFeed: async (currentUserId: string, tag?: string): Promise<{ posts: Post[] }> => {
    const params = new URLSearchParams({ currentUserId });
    if (tag && tag !== 'All') params.append('tag', tag);
    const res = await fetch(`/api/feed?${params.toString()}`);
    return res.json();
  },

  // Likes (optimistic background sync)
  toggleLike: async (postId: string, userId: string): Promise<{ success: boolean; likesCount: number; hasLiked: boolean }> => {
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  // Comments
  getComments: async (postId: string, currentUserId: string): Promise<{ comments: Comment[] }> => {
    const res = await fetch(`/api/posts/${postId}/comments?currentUserId=${currentUserId}`);
    return res.json();
  },

  addComment: async (postId: string, userId: string, text: string, parentId?: string | null): Promise<{ success: boolean; comment: Comment }> => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId, text, parentId }),
    });
    return res.json();
  },

  // Create post
  createPost: async (postData: {
    userId: string;
    media: Array<{ url: string; type: 'image' | 'video'; aspectRatio: string; altText?: string; duration?: number }>;
    caption: string;
    postType?: 'photo' | 'video';
    gamingTag?: string;
    collaborators?: import('../types').PostCollaborator[];
    taggedUsers?: import('../types').TaggedUser[];
    videoQuality?: import('../types').VideoExportQualityConfig;
    audioTrack?: import('../types').PostAudioTrack;
  }): Promise<{ success: boolean; post: Post }> => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: getHeaders(postData.userId),
      body: JSON.stringify(postData),
    });
    return res.json();
  },

  // User Profile
  getUserProfile: async (userId: string, currentUserId: string) => {
    const res = await fetch(`/api/users/${userId}?currentUserId=${currentUserId}`);
    return res.json();
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    const res = await fetch('/api/me', {
      method: 'PATCH',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId, ...updates }),
    });
    return res.json();
  },

  toggleFollow: async (targetUserId: string, currentUserId: string): Promise<{ success: boolean; isFollowing: boolean }> => {
    const res = await fetch(`/api/users/${targetUserId}/follow`, {
      method: 'POST',
      headers: getHeaders(currentUserId),
      body: JSON.stringify({ currentUserId }),
    });
    return res.json();
  },

  // Auth & OTP
  requestOtp: async (identifier: string) => {
    const res = await fetch('/api/auth/otp/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    return res.json();
  },

  verifyOtp: async (data: { identifier: string; code: string; deviceId: string; deviceModel: string; locationCity?: string }) => {
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  confirmDeviceTakeover: async (data: { userId: string; deviceId: string; deviceModel: string; locationCity?: string }) => {
    const res = await fetch('/api/auth/device/takeover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  demoLogin: async (userId: string, deviceId: string, deviceModel: string) => {
    const res = await fetch('/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, deviceId, deviceModel }),
    });
    return res.json();
  },

  // Sessions
  getSessions: async (userId: string) => {
    const res = await fetch(`/api/sessions?userId=${userId}`, {
      headers: getHeaders(userId),
    });
    return res.json();
  },

  terminateSession: async (sessionId: string) => {
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Safety & Moderation
  submitReport: async (reportData: { reporterUserId: string; targetType: string; targetId: string; category: string; notes?: string }) => {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: getHeaders(reportData.reporterUserId),
      body: JSON.stringify(reportData),
    });
    return res.json();
  },

  exportData: async (userId: string) => {
    const res = await fetch('/api/account/export', {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  deleteAccount: async (userId: string) => {
    const res = await fetch('/api/account/delete', {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  // Feature Flags & Audit
  getFlags: async (): Promise<{ flags: FeatureFlag[] }> => {
    const res = await fetch('/api/flags');
    return res.json();
  },

  toggleFlag: async (key: string, enabled: boolean) => {
    const res = await fetch('/api/flags/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, enabled }),
    });
    return res.json();
  },

  getAuditLogs: async (): Promise<{ logs: AuditLogEntry[] }> => {
    const res = await fetch('/api/audit-logs');
    return res.json();
  },

  // AI Intelligence
  aiFixCaption: async (
    draftCaption: string,
    postType?: 'photo' | 'video',
    options?: { style?: string; musicTitle?: string; filterName?: string }
  ) => {
    const res = await fetch('/api/ai/fix-caption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        draftCaption,
        postType,
        style: options?.style,
        musicTitle: options?.musicTitle,
        filterName: options?.filterName,
      }),
    });
    return res.json();
  },

  aiClassify: async (caption: string, imageUrl?: string) => {
    const res = await fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption, imageUrl }),
    });
    return res.json();
  },

  aiFixBio: async (currentBio: string, gamingInterests?: string) => {
    const res = await fetch('/api/ai/fix-bio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentBio, gamingInterests }),
    });
    return res.json();
  },

  // AI Device Hardware Optimizer & Sentinel Bot
  aiOptimizeDevice: async (profile: Partial<import('../types').DeviceHardwareProfile>): Promise<import('../types').DeviceOptimizationResult> => {
    const res = await fetch('/api/ai/device-optimizer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  // AI Zero-MB / Ultra-Low Data Media Compressor
  aiCompressMedia: async (params: {
    mediaType: 'photo' | 'video';
    originalSizeMB?: number;
    compressionMode?: 'zero_mb' | 'ultra_saver' | 'balanced' | 'master';
    durationSec?: number;
  }): Promise<import('../types').MediaCompressionBlueprint> => {
    const res = await fetch('/api/ai/media-compressor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // 19. Built-in App Voice & Chat AI Assistant
  askAppGuide: async (question: string, language?: string): Promise<{ answer: string; speechText: string; suggestedTopics: string[] }> => {
    const res = await fetch('/api/ai/app-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, language }),
    });
    return res.json();
  },

  // 20. Dedicated AI Photo & Video Studio Generation
  generateAiMedia: async (params: {
    type: 'photo' | 'video';
    prompt: string;
    style?: string;
    aspectRatio?: '9:16' | '1:1' | '16:9' | '4:5';
  }): Promise<import('../types').AiMediaGenerationResult> => {
    const res = await fetch('/api/ai/generate-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // 21. AI Music Generator
  generateAiMusic: async (params: {
    prompt?: string;
    genre?: string;
    mood?: string;
    bpm?: number;
  }): Promise<import('../types').ZeyeTrackItem> => {
    const res = await fetch('/api/ai/music-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },
};


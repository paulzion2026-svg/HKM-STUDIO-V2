const { contextBridge, ipcRenderer } = require('electron');

// NEW CODE START
/**
 * HKM Studio Desktop Wrapper - Preload Script
 * Provides secure bridge between renderer and main process
 * Exposes only necessary APIs to the frontend
 */

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('hkmDesktop', {
  // System information
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // File operations
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Hardware capabilities for professional features
  getHardwareCapabilities: () => ipcRenderer.invoke('get-hardware-capabilities'),
  
  // Native encoding bridge
  startNativeEncoder: (config) => ipcRenderer.invoke('start-native-encoder', config),
  stopNativeEncoder: () => ipcRenderer.invoke('stop-native-encoder'),
  getEncoderStats: () => ipcRenderer.invoke('get-encoder-stats'),
  
  // NDI system integration
  startNDI: (config) => ipcRenderer.invoke('start-ndi', config),
  stopNDI: () => ipcRenderer.invoke('stop-ndi'),
  getNDISources: () => ipcRenderer.invoke('get-ndi-sources'),
  
  // Audio system integration
  getAudioDevices: () => ipcRenderer.invoke('get-audio-devices'),
  setAudioDevice: (deviceId) => ipcRenderer.invoke('set-audio-device', deviceId),
  
  // Video capture devices
  getVideoDevices: () => ipcRenderer.invoke('get-video-devices'),
  
  // Virtual camera
  startVirtualCamera: () => ipcRenderer.invoke('start-virtual-camera'),
  stopVirtualCamera: () => ipcRenderer.invoke('stop-virtual-camera'),
  
  // Menu events from main process
  onMenuAction: (callback) => {
    const menuEvents = [
      'menu-new-project',
      'menu-open-project',
      'menu-save-project',
      'menu-export-video'
    ];
    
    menuEvents.forEach(event => {
      ipcRenderer.on(event, callback);
    });
  },
  
  // Remove all listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform information
  platform: process.platform,
  versions: process.versions,
  
  // Check if running in desktop mode
  isDesktop: true,
  
  // Professional broadcasting features
  startBroadcast: (destinations, settings) => ipcRenderer.invoke('start-broadcast', destinations, settings),
  stopBroadcast: () => ipcRenderer.invoke('stop-broadcast'),
  getBroadcastStats: () => ipcRenderer.invoke('get-broadcast-stats'),
  
  // Multi-corder integration
  startMultiCorder: (settings) => ipcRenderer.invoke('start-multicorder', settings),
  stopMultiCorder: () => ipcRenderer.invoke('stop-multicorder'),
  getMultiCorderStats: () => ipcRenderer.invoke('get-multicorder-stats'),
  
  // System performance monitoring
  getPerformanceStats: () => ipcRenderer.invoke('get-performance-stats'),
  
  // License and activation
  checkLicense: () => ipcRenderer.invoke('check-license'),
  activateLicense: (key) => ipcRenderer.invoke('activate-license', key)
});

// NEW CODE END

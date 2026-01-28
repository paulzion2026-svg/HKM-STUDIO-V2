# HKM Studio V2 - Desktop Application

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development Modes

#### Web Development (Browser)
```bash
npm run dev
```

#### Desktop Development (Electron)
```bash
npm run electron:dev
```

### Building

#### Web Build
```bash
npm run build
```

#### Desktop Application
```bash
# Build for current platform
npm run electron:build

# Pack without installer (for testing)
npm run electron:pack

# Full distribution build
npm run dist
```

## Desktop Features

### Professional Broadcasting Capabilities
- Native hardware encoding (NVENC, QuickSync)
- Multi-destination streaming
- Real-time performance monitoring
- System-level audio/video device access

### Enhanced Integration
- NDI system integration
- Virtual camera output
- Multi-corder with native recording
- Hardware acceleration

### Desktop-Specific Features
- File system access
- Native menus and shortcuts
- System notifications
- Professional window management

## Environment Variables

Create `.env.local` for development:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Platform Support

- **Windows**: Native installer with hardware acceleration
- **macOS**: Universal binary (Intel + Apple Silicon)
- **Linux**: AppImage with system integration

## Security Features

- Context isolation enabled
- Node integration disabled in renderer
- Secure IPC communication
- Code signing (production builds)

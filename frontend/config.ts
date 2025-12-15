// Aurora OSI System Configuration for Render
// Automatically consumes VITE_API_URL set by Render Blueprint

const CLOUD_URL = (import.meta as any).env?.VITE_API_URL || '';

export const APP_CONFIG = {
    DEFAULT_MODE: 'Cloud' as 'Sovereign' | 'Cloud',
    
    API: {
        LOCAL: 'http://localhost:8000',
        CLOUD: CLOUD_URL,
        TIMEOUT_MS: 60000,
        POLLING_INTERVAL_MS: 5000
    },

    FEATURES: {
        ENABLE_QUANTUM_BRIDGE: true, 
        ENABLE_LIVE_SATELLITE_FEED: true,
        STRICT_DATA_MODE: true 
    }
};
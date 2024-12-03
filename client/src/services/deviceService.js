import { v4 as uuidv4 } from 'uuid';

class DeviceService {
    getDeviceInfo() {
        return {
            deviceId: this.getOrCreateDeviceId(),
            deviceName: this.getDeviceName(),
            browser: this.getBrowserInfo(),
            os: this.getOSInfo(),
            lastLogin: new Date().toISOString()
        };
    }

    getOrCreateDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    getDeviceName() {
        const browser = this.getBrowserInfo();
        const os = this.getOSInfo();
        return `${os} - ${browser}`;
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = "Unknown";

        if (ua.includes("Firefox")) {
            browser = "Firefox";
        } else if (ua.includes("Chrome")) {
            browser = "Chrome";
        } else if (ua.includes("Safari")) {
            browser = "Safari";
        } else if (ua.includes("Edge")) {
            browser = "Edge";
        }

        return browser;
    }

    getOSInfo() {
        const ua = navigator.userAgent;
        let os = "Unknown";

        if (ua.includes("Windows")) {
            os = "Windows";
        } else if (ua.includes("Mac")) {
            os = "MacOS";
        } else if (ua.includes("Linux")) {
            os = "Linux";
        } else if (ua.includes("Android")) {
            os = "Android";
        } else if (ua.includes("iOS")) {
            os = "iOS";
        }

        return os;
    }

    saveDeviceToStorage(deviceInfo, rememberDevice) {
        if (rememberDevice) {
            localStorage.setItem('rememberedDevice', JSON.stringify(deviceInfo));
        }
    }

    getRememberedDevice() {
        const device = localStorage.getItem('rememberedDevice');
        return device ? JSON.parse(device) : null;
    }

    forgetDevice() {
        localStorage.removeItem('rememberedDevice');
    }
}

const deviceServiceInstance = new DeviceService();
export default deviceServiceInstance; 
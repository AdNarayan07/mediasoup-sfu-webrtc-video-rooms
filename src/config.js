const os = require('os');
const ifaces = os.networkInterfaces();

const getLocalIp = () => {
  let localIp = '127.0.0.1';
  Object.keys(ifaces).forEach((ifname) => {
    for (const iface of ifaces[ifname]) {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        continue;
      }
      localIp = iface.address;
      console.log("AnnouncedIP", localIp);
      return;
    }
  });
  return localIp;
};

const fetchIp = async () => {
  const res = await fetch("https://api.ipify.org/");
  return await res.text();
};

// Export an async function to provide configuration after IP fetch
const getConfig = async () => {
  const publicIp = await fetchIp();

  return {
    listenIp: '0.0.0.0',
    listenPort: 3016,
    sslCrt: '../ssl/cert.pem',
    sslKey: '../ssl/key.pem',

    mediasoup: {
      numWorkers: Object.keys(os.cpus()).length,
      worker: {
        rtcMinPort: 10000,
        rtcMaxPort: 10100,
        logLevel: 'debug',
        logTags: [
          'info',
          'ice',
          'dtls',
          'rtp',
          'srtp',
          'rtcp'
        ]
      },
      router: {
        mediaCodecs: [
          {
            kind: 'audio',
            mimeType: 'audio/opus',
            clockRate: 48000,
            channels: 2
          },
          {
            kind: 'video',
            mimeType: 'video/VP8',
            clockRate: 90000,
            parameters: {
              'x-google-start-bitrate': 1000
            }
          }
        ]
      },
      webRtcTransport: {
        listenInfos: [
          {
            protocol: "udp",
            ip: '0.0.0.0',
            announcedAddress: 'https://mediasoup-sfu-webrtc-video-rooms-kuv2.onrender.com'
          },
          {
            protocol: "udp",
            ip: '0.0.0.0',
            announcedAddress: "172.25.144.144"
          },
          {
            protocol: "udp",
            ip: '0.0.0.0',
            announcedAddress: publicIp
          },
          {
            protocol: "udp",
            ip: '0.0.0.0',
            announcedAddress: '216.24.57.4'
          },
          {
            protocol: "udp",
            ip: '0.0.0.0',
            announcedAddress: '216.24.57.252'
          },
          {
            protocol: "udp",
            ip: '0.0.0.0',
            announcedAddress: '13.228.225.19'
          },
          {
            protocol: "udp",
            ip: '0.0.0.0',
            announcedAddress: '18.142.128.26'
          },
          {
            protocol: "udp",
            ip: '0.0.0.0',
            announcedAddress: '54.254.162.138'
          }
        ],
        maxIncomingBitrate: 1500000,
        initialAvailableOutgoingBitrate: 1000000
      }
    }
  };
};

module.exports = getConfig;
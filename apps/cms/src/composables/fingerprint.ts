
import Fingerprint2 from 'fingerprintjs2';

let fingerprint: string | undefined;
let platform: string | undefined;

setTimeout(() => {
  Fingerprint2.get(function (components: any) {
    const values = components.map(function (component: any, index: any) {
      if (component.key === 'platform') {
        platform = component.value
      }

      if (index === 0) {
        //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
        return {
          key: component.key,
          value: component.value.replace(/\bNetType\/\w+\b/, '')
        };
      }

      return component
    });
    const murmur = Fingerprint2.x64hash128(values.join(''), 31);

    fingerprint = murmur;
  });
});

export function getFingerPrint() {
  if (!fingerprint) {
    throw new Error('fingerprint is not ready');
  }
  return fingerprint;
}

export function getPlatform() {
  if (!platform) {
    throw new Error('platform is not ready');
  }
  return platform;
}

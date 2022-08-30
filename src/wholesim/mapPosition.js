export function getRandomPosition(name) {
    const getRnd = (centerLat, centerLng, radiusLat, radiusLng) => {
      let cnt = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const diffLat = (Math.random() * 2 - 1) * radiusLat;
        const diffLng = (Math.random() * 2 - 1) * radiusLng;
        const _diffLng = (diffLng * radiusLat) / radiusLng;
        const dSq = diffLat * diffLat + _diffLng * _diffLng;
        if (dSq < radiusLat * radiusLat) {
          return {
            latitude: centerLat + diffLat,
            longitude: centerLng + diffLng
          };
        }
        cnt++;
        if (cnt > 10000) {
          // console.warn("alert!");
          break;
        }
      }
    };
    switch (name) {
      case "NORTH_AMERICA": {
        return getRnd(54, -100, 16, 35);
      }
      case "EUROPE": {
        return getRnd(52, 17, 14, 32);
      }
      case "SOUTH_AMERICA": {
        return getRnd(-11, -58, 12, 17);
      }
      case "ASIA": {
        return getRnd(34, 98, 20, 22);
      }
      case "AFRICA": {
        return getRnd(18, 10, 18, 30);
      }
      case "OCEANIA": {
        return getRnd(-25, 134, 9, 15);
      }
      default: {
        console.warn("Unexpected region: ", name);
      }
    }
  }
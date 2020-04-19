interface BluetoothReadingTranslator {
  translateValue(data: DataView): string | undefined;
}

const UINT16_MAX = 65536; // 2^16
const UINT32_MAX = 4294967296; // 2^32

export class HeartRateReadingTranslator implements BluetoothReadingTranslator {
  translateValue(data: DataView): string | undefined {
    return data.getUint16(0).toString();
  }
}

export class PowerReadingTranslator implements BluetoothReadingTranslator {
  translateValue(data: DataView): string | undefined {
    return data.getUint16(0).toString();
  }
}

type SpeedOrCadenceType = "SPEED" | "CADENCE";

type SpeedOrCadenceSample = {
  time: number;
  revolutions: number;
};
const calculateDiff = (
  current: number,
  previous: number,
  max: number
): number => {
  if (current >= previous) {
    return current - previous;
  } else {
    return max - previous + current;
  }
};

const cadenceCalculation = (
  currentSample: SpeedOrCadenceSample,
  previousSample: SpeedOrCadenceSample
): number => {
  const timeDiff =
    calculateDiff(currentSample.time, previousSample.time, UINT16_MAX) / 1024;
  const revolutionsDiff = calculateDiff(
    currentSample.revolutions,
    previousSample.revolutions,
    UINT16_MAX
  );
  return timeDiff === 0 ? 0 : (60 * revolutionsDiff) / timeDiff;
};

const speedCalculation = (wheelSize: number) => {
  return (
    currentSample: SpeedOrCadenceSample,
    previousSample: SpeedOrCadenceSample
  ): number => {
    const wheelTimeDiff =
      calculateDiff(currentSample.time, previousSample.time, UINT16_MAX) / 1024;
    const wheelDiff = calculateDiff(
      currentSample.revolutions,
      previousSample.revolutions,
      UINT32_MAX
    );

    const sampleDistance = (wheelDiff * wheelSize) / 1000;
    return wheelTimeDiff == 0
      ? 0
      : (sampleDistance / wheelTimeDiff) * 3.6 * 0.621371;
  };
};

export class SpeedOrCadenceReadingTranslator
  implements BluetoothReadingTranslator {
  private calculation: (
    currentSample: SpeedOrCadenceSample,
    previousSample: SpeedOrCadenceSample
  ) => number;
  private type: SpeedOrCadenceType;

  private previousSample: SpeedOrCadenceSample | undefined;

  constructor(type: SpeedOrCadenceType, wheelSize: number | undefined) {
    switch (type) {
      case "CADENCE":
        this.calculation = cadenceCalculation;
        break;
      case "SPEED":
        if (wheelSize === undefined) {
          throw new Error("Speed cannot be calculated without wheel size");
        }
        this.calculation = speedCalculation(wheelSize);
        break;
      default:
        throw new Error(`Unknown reading type ${type}`);
    }
    this.type = type;
  }

  translateValue(data: DataView): string | undefined {
    let value;

    if (this.previousSample !== undefined) {
      const currentSampleForType = this.read(data).get(this.type);
      if (currentSampleForType !== undefined) {
        value = this.calculation(
          currentSampleForType,
          this.previousSample
        ).toFixed(0);
      }
    }

    return value;
  }

  private read(data: DataView): Map<SpeedOrCadenceType, SpeedOrCadenceSample> {
    const flags = data.getUint8(0);
    const hasCadence = flags === 1 || flags === 3;
    const hasSpeed = flags === 2 || flags === 3;

    const sample = new Map<SpeedOrCadenceType, SpeedOrCadenceSample>();

    if (hasCadence) {
      sample.set("CADENCE", {
        time: data.getUint16(9, true),
        revolutions: data.getUint16(7, true)
      });
    }

    if (hasSpeed) {
      sample.set("SPEED", {
        time: data.getUint16(5, true),
        revolutions: data.getUint16(1, true)
      });
    }

    return sample;
  }
}

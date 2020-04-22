import TypedFlyweightBluetoothDevice from "@/model/TypedFlyweightBluetoothDevice";
import { SettingsState } from "@/store/settings";

const SELECTED_DEVICES_LOCAL_STORAGE_KEY = "devices:selected";
const GENERAL_SETTINGS_LOCAL_STORAGE_KEY = "settings:general";

export default class SettingsPersistenceService {
  persistGeneralSettings(settings: SettingsState) {
    localStorage.setItem(
      GENERAL_SETTINGS_LOCAL_STORAGE_KEY,
      JSON.stringify(settings)
    );
  }

  getGeneralSettings(): SettingsState {
    const storedSettings = localStorage.getItem(
      GENERAL_SETTINGS_LOCAL_STORAGE_KEY
    );
    return storedSettings != null
      ? JSON.parse(storedSettings)
      : {
          wheelSize: undefined,
          ftp: undefined
        };
  }

  persistDevices(devices: TypedFlyweightBluetoothDevice[]): void {
    localStorage.setItem(
      SELECTED_DEVICES_LOCAL_STORAGE_KEY,
      JSON.stringify(devices)
    );
  }

  loadDevices(): TypedFlyweightBluetoothDevice[] {
    let devices: TypedFlyweightBluetoothDevice[] = [];
    const persistedDevices = localStorage.getItem(
      SELECTED_DEVICES_LOCAL_STORAGE_KEY
    );
    if (persistedDevices) {
      devices = JSON.parse(persistedDevices);
    }

    return devices;
  }
}

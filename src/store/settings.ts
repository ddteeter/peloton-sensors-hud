import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import SettingsPersistenceService from "@/service/renderer/SettingsPersistenceService";

export interface SettingsState {
  wheelSize: number | undefined;
  ftp: number | undefined;
}

@Module({ name: "settings" })
export class Settings extends VuexModule {
  wheelSize: SettingsState["wheelSize"] = undefined;
  ftp: SettingsState["ftp"] = undefined;

  private readonly settingsPersistenceService: SettingsPersistenceService;

  constructor(settings: Settings) {
    super(settings);
    this.settingsPersistenceService = new SettingsPersistenceService();
    const {
      wheelSize,
      ftp
    } = this.settingsPersistenceService.getGeneralSettings();
    this.wheelSize = wheelSize;
    this.ftp = ftp;
  }

  private persistSettings() {
    this.settingsPersistenceService.persistGeneralSettings({
      wheelSize: this.wheelSize,
      ftp: this.ftp
    });
  }

  @Mutation
  setWheelSize(wheelSize: number | undefined) {
    this.wheelSize = wheelSize;
    this.persistSettings();
  }

  @Mutation
  setFTP(ftp: number | undefined) {
    this.ftp = ftp;
    this.persistSettings();
  }
}

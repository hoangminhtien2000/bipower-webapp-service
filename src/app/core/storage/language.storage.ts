import {Injectable} from '@angular/core';
import {LANGUAGE} from "../common/constant";
import {LanguageItemModel} from "../models/language.item.model";

@Injectable({
  providedIn: 'root',
})
export class LanguageStorage {

  public changeLanguage(language: string): void {
    localStorage.setItem(LANGUAGE.KEY, language.toUpperCase());
  }

  public getKeyLanguageDefault(defaultValue: string): string {
    let valueLanguage = localStorage.getItem(LANGUAGE.KEY);
    if (valueLanguage && valueLanguage.length > 0) {
      return valueLanguage;
    }
    return defaultValue;
  }

  public getKeyLanguage(): string {
    return this.getKeyLanguageDefault(LANGUAGE.VI);
  }

  public changeLanguageValue(languageValue: string): void {
    localStorage.setItem(LANGUAGE.VALUE, languageValue);
  }

  public getKeyLanguageValueDefault(defaultValue: string): string {
    let valueLanguage = localStorage.getItem(LANGUAGE.VALUE);
    if (valueLanguage && valueLanguage.length > 0) {
      return valueLanguage;
    }
    return defaultValue;
  }

  public getKeyLanguageValue(): string {
    return this.getKeyLanguageValueDefault(LANGUAGE.VI_VALUE);
  }

  public changeLanguageList(languageKey: string, valueLanguageItems: LanguageItemModel[]) {
    let keyLanguageList = LANGUAGE.LIST + '_' + languageKey;
    localStorage.setItem(keyLanguageList, JSON.stringify(valueLanguageItems));
  }

  public getLanguageListByKey(languageKey: string): LanguageItemModel[] {
    let keyLanguageList = LANGUAGE.LIST + '_' + languageKey;
    let valueLanguageItem: string = localStorage.getItem(keyLanguageList);
    return JSON.parse(valueLanguageItem);
  }

  public getLanguageList(): LanguageItemModel[] {
    let languageKey: string = this.getKeyLanguage();
    return this.getLanguageListByKey(languageKey);
  }

  public checkExistsConfig(): boolean {
    let valueLanguageKey = localStorage.getItem(LANGUAGE.KEY);
    if (valueLanguageKey && valueLanguageKey.length > 0) {
      return true;
    }
    return false;
  }
}

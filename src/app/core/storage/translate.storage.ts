import {Injectable} from '@angular/core';
import {LANGUAGE, TRANSLATE} from "../common/constant";
import {LanguageStorage} from "./language.storage";
import {VerifyService} from "../services/verify.service";

@Injectable({
    providedIn: 'root',
})
export class TranslateStorage {
    constructor(private languageStorage: LanguageStorage) {}

    public translateLanguageKeyDefault(language: string, key: string, defaultValue: string): string {
        let keyLanuage: string = this.getKeyLanguage(language, key);
        let valueTranslate = localStorage.getItem(keyLanuage);
        if (valueTranslate && valueTranslate.length > 0) {
            return valueTranslate;
        }
        return defaultValue;
    }

    public translateKeyDefault(key: string, defaultValue: string): string {
        let language: string = this.languageStorage.getKeyLanguage();
        return this.translateLanguageKeyDefault(language, key, defaultValue);
    }

    public translateKey(key: string): string {
        return this.translateKeyDefault(key, key);
    }


    public changeValueKey(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    private getKeyLanguage(language: string, key: string): string {
        let keyLanuage: string = '';
        keyLanuage = TRANSLATE.KEY;
        keyLanuage = keyLanuage + "." + language.toUpperCase();
        keyLanuage = keyLanuage + "." + key;
        return keyLanuage;
    }

    public applyConfigtoKeyTranslate(valueLanguage: string, options: any): string {
        let keys = Object.keys(options);
        for(var key of keys){
            let keyLanguage = '${'+key+'}';
            valueLanguage = valueLanguage.replace(keyLanguage, options[key]);
        }
        return valueLanguage;
    }

    public checkExistsTranslate(): boolean {
        let valueTransalteExists = localStorage.getItem(TRANSLATE.EXISTS);
        if (valueTransalteExists && valueTransalteExists.length > 0) {
            return true;
        }
        return false;
    }

    public updateExistsTransalte(): void {
        localStorage.setItem(TRANSLATE.EXISTS, 'OK');
    }
}
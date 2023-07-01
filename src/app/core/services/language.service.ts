import {Injectable} from "@angular/core";
import {CONFIG} from "../config/application.config";
import {HttpClient} from "@angular/common/http";
import {LanguageStorage} from "../storage/language.storage";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {LANGUAGE} from "../common/constant";

@Injectable({
    providedIn: "root",
})
export class LanguageService {
    private url = CONFIG.API.LANGUAGE_LIST;


    constructor(private http: HttpClient,
                private languageStorage: LanguageStorage,
                private router: Router) { }

    public getAllLanguage(): Observable<any> {
        return this.http.get<any>(this.url).pipe(map(data => {
            let languageItems: any[] = data.data.items;
            for (var language of languageItems) {
                this.languageStorage.changeLanguageList(language.key, language.value.items);
                if (language.key === LANGUAGE.VI) {
                    this.languageStorage.changeLanguage(language.key);
                    for (var item of this.languageStorage.getLanguageList()) {
                        if (item.key == language.key) {
                            this.languageStorage.changeLanguageValue(item.value);
                        }
                    }
                }
            }
        }));
    }


}

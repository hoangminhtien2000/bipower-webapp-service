import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PropertiesStorage {
  constructor() {}


  public getProperties(key: string): string {
    return localStorage.getItem(key);
  }


  public changeValueKey(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

}

import { Injectable } from "@angular/core";
import { LocalStorage } from '@ngx-pwa/local-storage';


@Injectable({ providedIn: "root" })
export class LocalStorageServices {
    constructor(private localStorage: LocalStorage) { }

    public async get<T>(key: string): Promise<T> {
        return await new Promise<T>(r => this.localStorage.getItem(key).subscribe(x => r(x as T)));
    }

    public async set<T>(key: string, value: T): Promise<void> {
        await new Promise<void>(r => this.localStorage.setItem(key, value).subscribe(_ => r()));
    }
}
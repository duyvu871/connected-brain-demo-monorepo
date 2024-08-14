type CacheRecord = {
    value: any;
    expire: number;
    timeout?: NodeJS.Timeout;
};

class Cache {
    private _cache: Record<string, CacheRecord> = Object.create(null);
    private _size: number = 0;

    public _instance: typeof Cache = Cache;
    set(key: string, value: any, time?: number): any {
        if (typeof time !== "undefined" && (typeof time !== "number" || isNaN(time) || time <= 0)) {
            throw new Error("Cache timeout must be a positive number");
        }

        const oldRecord = this._cache[key];
        if (oldRecord) {
            clearTimeout(oldRecord.timeout);
        } else {
            this._size++;
        }

        const record: CacheRecord = {
            value: value,
            expire: time ? time + Date.now() : NaN,
        };

        if (!isNaN(record.expire)) {
            record.timeout = setTimeout(() => this._del(key), time);
        }

        this._cache[key] = record;

        return value;
    }

    del(key: string): boolean {
        let canDelete = true;

        const oldRecord = this._cache[key];
        if (oldRecord) {
            clearTimeout(oldRecord.timeout);
            if (!isNaN(oldRecord.expire) && oldRecord.expire < Date.now()) {
                canDelete = false;
            }
        } else {
            canDelete = false;
        }

        if (canDelete) {
            this._del(key);
        }

        return canDelete;
    }

    private _del(key: string): void {
        this._size--;
        delete this._cache[key];
    }

    clear(): void {
        for (const key in this._cache) {
            clearTimeout(this._cache[key].timeout);
        }
        this._size = 0;
        this._cache = Object.create(null);
    }

    get(key: string): any | null {
        const data = this._cache[key];
        if (typeof data !== "undefined") {
            if (isNaN(data.expire) || data.expire >= Date.now()) {
                return data.value;
            } else {
                // free some space
                this._size--;
                delete this._cache[key];
            }
        }
        return null;
    }
}

const exp = new Cache();

export default exp;

export type CacheType = typeof Cache;
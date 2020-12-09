import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber, forkJoin } from "rxjs";
import { shareReplay, switchMap, startWith, map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';

interface Ring {
  name: string;
  prop: string;
  image: any;
}

@Injectable({
  providedIn: 'root'
})
export class DBserviceService {

  constructor(private readonly http: HttpClient) { }

  public db$: Observable<IDBDatabase>;
  public readonly update$ = new Subject<void>();
  public rings$: Observable<Ring[]>;

  public init(): void {
    this.db$ = new Observable<IDBDatabase>(subscriber => {
      const openRequest = indexedDB.open("ringsDB");
      openRequest.onupgradeneeded = () =>
        this.createDB(openRequest.result);
      openRequest.onsuccess = () => {
        subscriber.next(openRequest.result);
        subscriber.complete();
      };
    }).pipe(shareReplay({ refCount: false, bufferSize: 1 }));
  }

  public createDB(db: IDBDatabase): void {
    db.createObjectStore("rings", { keyPath: "name" });
  }

  public updatingRings(): void {
    this.rings$ = this.update$.pipe(
      startWith(undefined as any),
      switchMap(() =>
        this.db$.pipe(
          switchMap(
            (db) =>
              new Observable<Ring[]>((subscriber) => {
                let transaction = db.transaction("rings", "readonly");
                const request = transaction
                  .objectStore("rings")
                  .getAll();

                transaction.oncomplete = () => {
                  transaction = null;
                  subscriber.next(request.result as Ring[]);
                  subscriber.complete();
                };

                return () => transaction?.abort();
              })))));
  }

  public async addRing(name: string, prop: string, temp: File): Promise<void> {
    
    function testfun(tempFile: File) {
      return new Promise(resolve => {
        var reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        }
        reader.readAsDataURL(tempFile);
      });
    }

    let image = await testfun(temp);

    this.db$.pipe(
      switchMap(
        (db) =>
          new Observable(subscriber => {
            let transaction = db.transaction("rings", "readwrite");
            transaction.objectStore("rings").add({ name: name, prop: prop, image: image });

            transaction.oncomplete = () => {
              transaction = null;
              this.update$.next();
              subscriber.complete();
              alert("Successful upload!");
            };

            transaction.onerror = (error) => {
              transaction = null;
              subscriber.error(error);
              alert("An error has occured, check the console for more detail!");
            };

            return () => transaction?.abort();
          })
      )
    ).subscribe({
        error: (error) =>
          console.log("An error has occured during uploading a ring: ", error),
    });
  }

  public deleteRing(name: string): void {
    this.db$.pipe(
      switchMap((db) => new Observable(subscriber => {
        let transaction = db.transaction("rings", "readwrite");
        transaction.objectStore("rings").delete(name);

        transaction.oncomplete = () => {
          transaction = null;
          this.update$.next();
          subscriber.complete();
        };

        return () => transaction?.abort();
      }))
    ).subscribe();
  }

}

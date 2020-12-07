import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from "rxjs";
import { shareReplay, switchMap, startWith } from "rxjs/operators";

interface Ring {
  name: string;
  prop: string;
}

@Injectable({
  providedIn: 'root'
})
export class DBserviceService {
  httpClient: any;

  constructor() { }

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

  public addRing(name: string, prop: string): void {

    this.db$.pipe(
      switchMap(
        (db) =>
          new Observable(subscriber => {
            let transaction = db.transaction("rings", "readwrite");
            transaction.objectStore("rings").add({ name: name, prop: prop });

            transaction.oncomplete = () => {
              transaction = null;
              this.update$.next();
              subscriber.complete();
            };

            return () => transaction?.abort();
          })
      )
    ).subscribe();

    alert("Successful upload!");
  }

  public deleteRing(name: string): void{
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

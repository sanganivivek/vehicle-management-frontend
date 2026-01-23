import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() { }

  /**
   * Show the global loading spinner
   * Increments the request counter to handle multiple simultaneous requests
   */
  show(): void {
    this.requestCount++;
    if (this.requestCount > 0) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Hide the global loading spinner
   * Decrements the request counter and only hides when all requests are complete
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }

  /**
   * Force hide the loading spinner regardless of request count
   * Use with caution - mainly for error recovery
   */
  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }

  /**
   * Get current loading state (synchronous)
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}

// Angular modules
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

// Third party modules
import { of, Observable } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

// Dashboard hub model and services
import { TokenService } from '@core/services/index.service';
import { TokenModel } from '@shared/models/index.model';

@Injectable({
  providedIn: 'root',
})
export class TokensResolver implements Resolve<TokenModel[]> {

  /**
   * Life cycle method
   * @param tokenService TokenService
   */
  constructor(
    private tokenService: TokenService
  ) { }

  /**
   * Find all token data before displaying tokens page
   * @param route ActivatedRouteSnapshot
   */
  resolve(route: ActivatedRouteSnapshot): Observable<TokenModel[]> {
    return this.tokenService.findAll(route.params.projectUid)
      .pipe(
        take(1),
        catchError(() =>  of([]))
      );
  }
}

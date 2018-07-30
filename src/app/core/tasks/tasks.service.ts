import { Observable } from 'rxjs/Observable';
import { DataService } from '../data/data.service';
import { RestRequest, TaskDeleteRequest, TaskPostRequest } from '../data/request.models';
import { isNotEmpty } from '../../shared/empty.util';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { ErrorResponse, RestResponse, TaskResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ProcessTaskResponse } from './models/process-task-response';
import { RemoteDataError } from '../data/remote-data-error';
import { HttpHeaders } from '@angular/common/http';
import { NormalizedObject } from '../cache/models/normalized-object.model';

export abstract class TasksService<TNormalized extends NormalizedObject, TDomain> extends DataService<TNormalized, TDomain> {

  public getScopedEndpoint(scopeID: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  protected fetchRequest(request: RestRequest): Observable<any> {
    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .do(() => this.responseCache.remove(request.href))
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) => {
        return Observable.of(new ProcessTaskResponse(response.isSuccessful, new RemoteDataError(response.statusCode, response.errorMessage)))
      }),
      successResponse
        .map((response: TaskResponse) => new ProcessTaskResponse(response.isSuccessful))
        .distinctUntilChanged());
  }

  protected getEndpointByIDHref(endpoint, resourceID): string {
    return isNotEmpty(resourceID) ? `${endpoint}/${resourceID}` : `${endpoint}`;
  }

  protected getEndpointByMethod(endpoint: string, method: string): string {
    return isNotEmpty(method) ? `${endpoint}/${method}` : `${endpoint}`;
  }

  protected postToEndpoint(linkName: string, body: any, scopeId?: string, options?: HttpOptions): Observable<any> {
    return this.halService.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId))
      .distinctUntilChanged()
      .map((endpointURL: string) => new TaskPostRequest(this.requestService.generateRequestId(), endpointURL, body, options))
      .do((request: TaskPostRequest) => this.requestService.configure(request, this.forceBypassCache))
      .flatMap((request: TaskPostRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  protected deleteToEndpoint(linkName: string, body: any, scopeId?: string, options?: HttpOptions): Observable<any> {
    return this.halService.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId))
      .distinctUntilChanged()
      .map((endpointURL: string) => new TaskDeleteRequest(this.requestService.generateRequestId(), endpointURL, body, options))
      .do((request: TaskDeleteRequest) => this.requestService.configure(request, this.forceBypassCache))
      .flatMap((request: TaskDeleteRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  protected makeHttpOptions() {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;
    return options;
  }
}

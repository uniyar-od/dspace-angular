import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Item } from '../../../core/shared/item.model';
import { SubmissionService } from '../../../submission/submission.service';
import { SubmissionObject } from '../../../core/submission/models/submission-object.model';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { ErrorResponse } from '../../../core/cache/response.models';
import { Subscription } from 'rxjs/internal/Subscription';

/**
 * This component renders a context menu option that provides the request a correction functionality.
 */
@Component({
  selector: 'ds-item-page-context-menu-request-correction',
  templateUrl: './request-correction.component.html'
})
export class RequestCorrectionComponent implements OnDestroy {

  /**
   * The related item
   */
  @Input() item: Item;

  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  /**
   * Variable to track subscription and unsubscribe it onDestroy
   */
  private sub: Subscription;
  /**
   * Initialize instance variables
   *
   * @param {NgbModal} modalService
   * @param {NotificationsService} notificationService
   * @param {Router} router
   * @param {SubmissionService} submissionService
   * @param {TranslateService} translate
   */
  constructor(
    private modalService: NgbModal,
    private notificationService: NotificationsService,
    private router: Router,
    private submissionService: SubmissionService,
    private translate: TranslateService
  ) {
  }

  /**
   * Open modal
   *
   * @param content
   */
  public openRequestModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Request a correction for the item
   */
  public requestCorrection() {
    this.processing$.next(true);
    this.sub = this.submissionService.createSubmissionByItem(this.item.id, 'isCorrectionOfItem').pipe(
      take(1),
      catchError((error: ErrorResponse) => {
        this.handleErrorResponse(error.statusCode);
        return observableOf({});
      })
    ).subscribe((response: SubmissionObject) => {
      this.processing$.next(false);
      this.modalRef.close();

      if (isNotEmpty(response)) {
        this.notificationService.success(
          null,
          this.translate.instant('submission.workflow.tasks.generic.success')
        );
        // redirect to workspaceItem edit page
        this.router.navigate(['workspaceitems', response.id, 'edit']);
      }
    });
  }

  /**
   * Handle notification messages for an error response
   *
   * @param errorCode
   *    The http status code of the error response
   */
  private handleErrorResponse(errorCode: number) {
    switch (errorCode) {
      case 403:
        this.notificationService.error(
          null,
          this.translate.instant('item.page.context-menu.options.request-correction.error.403')
        );
        break;
      default :
        this.notificationService.error(
          null,
          this.translate.instant('item.page.context-menu.options.request-correction.error.generic')
        );
    }
  }

  /**
   * Make sure the subscription is unsubscribed from when this component is destroyed
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}

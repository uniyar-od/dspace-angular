import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { SubmissionRestService } from '../../../core/submission/submission-rest.service';
import { SubmissionService } from '../../submission.service';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { isNotEmpty } from '../../../shared/empty.util';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { NotificationOptions } from '../../../shared/notifications/models/notification-options.model';

/**
 * This component represents submission form footer bar.
 */
@Component({
  selector: 'ds-submission-form-footer',
  styleUrls: ['./submission-form-footer.component.scss'],
  templateUrl: './submission-form-footer.component.html'
})
export class SubmissionFormFooterComponent implements OnChanges {

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId: string;

  /**
   * The task id
   * @type {string}
   */
  @Input() taskId;

  public processingApprove: Observable<boolean>;
  public processingReject: Observable<boolean>;

  /**
   * A boolean representing if a submission deposit operation is pending
   * @type {Observable<boolean>}
   */
  public processingDepositStatus: Observable<boolean>;

  /**
   * A boolean representing if a submission save operation is pending
   * @type {Observable<boolean>}
   */
  public processingSaveStatus: Observable<boolean>;

  /**
   * A boolean representing if showing deposit and discard buttons
   * @type {Observable<boolean>}
   */
  public showDepositAndDiscard: Observable<boolean>;

  public showApproveAndReject: Observable<boolean>;

  /**
   * A boolean representing if submission form is valid or not
   * @type {Observable<boolean>}
   */
  public submissionIsInvalid: Observable<boolean> = observableOf(true);

  /**
   * Initialize instance variables
   *
   * @param {ClaimedTaskDataService} claimedTaskService
   * @param {NgbModal} modalService
   * @param {NotificationsService} notificationsService
   * @param {SubmissionRestService} restService
   * @param {Router} router
   * @param {SubmissionService} submissionService
   * @param {TranslateService} translate
   */
  constructor(private claimedTaskService: ClaimedTaskDataService,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private restService: SubmissionRestService,
              private router: Router,
              private submissionService: SubmissionService,
              private translate: TranslateService) {
  }

  /**
   * Initialize all instance variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (isNotEmpty(this.submissionId)) {
      this.submissionIsInvalid = this.submissionService.getSubmissionStatus(this.submissionId).pipe(
        map((isValid: boolean) => isValid === false)
      );

      this.processingSaveStatus = this.submissionService.getSubmissionSaveProcessingStatus(this.submissionId);
      this.processingDepositStatus = this.submissionService.getSubmissionDepositProcessingStatus(this.submissionId);
      this.processingApprove = this.submissionService.getSubmissionApproveProcessingStatus(this.submissionId);
      this.showDepositAndDiscard = observableOf(this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkspaceItem);
      this.showApproveAndReject = observableOf(this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkflowItem);
    }
  }

  approve() {
    this.submissionService.dispatchApprove(this.submissionId, this.taskId);
  }

  /**
   * Dispatch a submission save action
   */
  save() {
    this.submissionService.dispatchSave(this.submissionId);
  }

  /**
   * Dispatch a submission save for later action
   */
  saveLater() {
    this.submissionService.dispatchSaveForLater(this.submissionId);
  }

  /**
   * Dispatch a submission deposit action
   */
  public deposit() {
    this.submissionService.dispatchDeposit(this.submissionId);
  }

  /**
   * Dispatch a submission discard action
   */
  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.submissionService.dispatchDiscard(this.submissionId)
        }
      }
    );
  }

  reject(reason) {
    this.processingReject = observableOf(true);
    this.claimedTaskService.rejectTask(reason, this.taskId)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  private responseHandle(res: ProcessTaskResponse) {
    this.processingApprove = observableOf(false);
    if (res.hasSucceeded) {
      this.submissionService.redirectToMyDSpace(true);
      this.notificationsService.success(null,
        this.translate.get('submission.workflow.tasks.generic.success'),
        new NotificationOptions(5000, false));
    } else {
      this.notificationsService.error(null,
        this.translate.get('submission.workflow.tasks.generic.error'),
        new NotificationOptions(20000, true));
    }
  }
}

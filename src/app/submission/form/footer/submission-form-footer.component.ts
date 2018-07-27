import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubmissionRestService } from '../../submission-rest.service';
import { SubmissionService } from '../../submission.service';
import { SubmissionState } from '../../submission.reducers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DiscardSubmissionAction,
  SaveAndDepositSubmissionAction,
  SaveForLaterSubmissionFormAction,
  SaveSubmissionFormAction
} from '../../objects/submission-objects.actions';
import { Observable } from 'rxjs/Observable';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { NavigationExtras, Router } from '@angular/router';
import { MYDSPACE_ROUTE } from '../../../+my-dspace-page/my-dspace-page.component';
import { NotificationOptions } from '../../../shared/notifications/models/notification-options.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-submission-form-footer',
  styleUrls: ['./submission-form-footer.component.scss'],
  templateUrl: './submission-form-footer.component.html'
})
export class SubmissionFormFooterComponent implements OnChanges {

  @Input() submissionId;
  @Input() taskId;

  public processingApprove: Observable<boolean> = Observable.of(false);
  public processingReject: Observable<boolean> = Observable.of(false);
  public processingDepositStatus: Observable<boolean>;
  public processingSaveStatus: Observable<boolean>;
  public showDepositAndDiscard: Observable<boolean>;
  public showApproveAndReject: Observable<boolean>;
  private submissionIsInvalid = true;

  constructor(private claimedTaskService: ClaimedTaskDataService,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private restService: SubmissionRestService,
              private router: Router,
              private submissionService: SubmissionService,
              private store: Store<SubmissionState>,
              private translate: TranslateService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!this.submissionId) {
      this.submissionService.getSectionsState(this.submissionId)
        .subscribe((isValid) => {
          this.submissionIsInvalid = isValid === false;
        });

      this.processingSaveStatus = this.submissionService.getSubmissionSaveProcessingStatus(this.submissionId);
      this.processingDepositStatus = this.submissionService.getSubmissionDepositProcessingStatus(this.submissionId);
      this.showDepositAndDiscard = Observable.of(this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkspaceItem);
      this.showApproveAndReject = Observable.of(this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkflowItem);
    }
  }

  save(event) {
    this.store.dispatch(new SaveSubmissionFormAction(this.submissionId));
  }

  saveLater(event) {
    this.store.dispatch(new SaveForLaterSubmissionFormAction(this.submissionId));
  }

  approve() {
    this.processingApprove = Observable.of(true);
    this.claimedTaskService.approveTask(this.taskId)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  reload() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        configuration: 'workflow'
      }
    };
    this.router.navigate([MYDSPACE_ROUTE], navigationExtras);
  }

  deposit(event) {
    this.store.dispatch(new SaveAndDepositSubmissionAction(this.submissionId));
  }

  reject(reason) {
    this.processingReject = Observable.of(true);;
    this.claimedTaskService.rejectTask(reason, this.taskId)
      .subscribe((res: ProcessTaskResponse) => {
        this.responseHandle(res);
      });
  }

  confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.store.dispatch(new DiscardSubmissionAction(this.submissionId));
        }
      }
    );
  }

  private responseHandle(res: ProcessTaskResponse) {
    this.processingApprove = Observable.of(false);
    if (res.hasSucceeded) {
      this.reload();
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

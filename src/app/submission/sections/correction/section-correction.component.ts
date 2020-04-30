import { Component, Inject } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';

import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { RoleType } from '../../../core/roles/role-types';

import {
  WorkspaceitemCorrectionBitstreamObject,
  WorkspaceitemCorrectionMetadataObject,
  WorkspaceitemCorrectionObject
} from '../../../core/submission/models/workspaceitem-correction.model';

@Component({
  selector: 'ds-submission-correction',
  templateUrl: './section-correction.component.html'
})
@renderSectionFor(SectionsType.Correction)
export class SubmissionSectionCorrectionComponent extends SectionModelComponent {

  public roleTypeEnum = RoleType;

  constructor(protected sectionService: SectionsService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  protected getSectionStatus(): Observable<boolean> {
    return observableOf(true);
  }

  getItemData(): WorkspaceitemCorrectionMetadataObject[] {
    const correctionObject: WorkspaceitemCorrectionObject =  this.sectionData.data as WorkspaceitemCorrectionObject
    return correctionObject.metadata
  }

  getFileData(): WorkspaceitemCorrectionBitstreamObject[] {
    const correctionObject: WorkspaceitemCorrectionObject =  this.sectionData.data as WorkspaceitemCorrectionObject
    return correctionObject.bitstream
      .sort((obj1: WorkspaceitemCorrectionBitstreamObject, obj2: WorkspaceitemCorrectionBitstreamObject) => {
        return obj1.filename > obj2.filename ? 1 : -1;
      }
    );
  }

  sortMetadataByLabel(metadata: WorkspaceitemCorrectionMetadataObject[]): WorkspaceitemCorrectionMetadataObject[] {
    return metadata.sort((obj1: WorkspaceitemCorrectionMetadataObject, obj2: WorkspaceitemCorrectionMetadataObject) => {
      return obj1.label > obj2.label ? 1 : -1;
    })
  }

  showTable(): boolean {
    return Object.values(this.sectionData.data).length > 0;
  }

  /* tslint:disable:no-empty */
  protected onSectionDestroy() {
  }

  /* tslint:disable:no-empty */
  protected onSectionInit(): void {
  }

}

import {Component, Inject} from '@angular/core';
import {renderSectionFor} from "../sections-decorator";
import {SectionsType} from "../sections-type";
import {SectionModelComponent} from "../models/section.model";
import {SectionDataObject} from "../models/section-data.model";
import {SectionsService} from "../sections.service";
import {Observable, of as observableOf} from "rxjs";
import {RoleType} from "../../../core/roles/role-types";

import {WorkspaceitemCorrectionObject} from "../../../core/submission/models/workspaceitem-correction.model";

@Component({
  selector: 'ds-submission-correction',
  templateUrl: './section-correction.component.html',
  styleUrls: ['./section-correction.component.css']
})
@renderSectionFor(SectionsType.Correction)
export class SectionCorrectionComponent extends SectionModelComponent {

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

  protected onSectionDestroy(): void {
  }

  protected onSectionInit(): void {
  }



  getData(): WorkspaceitemCorrectionObject[] {
    return Object.values(this.sectionData.data)
  }

  showTable(): boolean {
    return Object.values(this.sectionData.data).length > 0;
  }

}

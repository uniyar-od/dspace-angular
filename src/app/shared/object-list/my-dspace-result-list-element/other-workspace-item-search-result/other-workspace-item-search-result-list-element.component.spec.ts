import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';

import { Item } from '../../../../core/shared/item.model';
import { OtherWorkspaceItemSearchResultListElementComponent } from './other-workspace-item-search-result-list-element.component';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { WorkspaceItemSearchResult } from '../../../object-collection/shared/workspace-item-search-result.model';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { getMockLinkService } from '../../../mocks/link-service.mock';
import { take } from 'rxjs/operators';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';

let component: OtherWorkspaceItemSearchResultListElementComponent;
let fixture: ComponentFixture<OtherWorkspaceItemSearchResultListElementComponent>;

const compIndex = 1;

const mockResultObject: WorkspaceItemSearchResult = new WorkspaceItemSearchResult();
mockResultObject.hitHighlights = {};

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => observableOf(true),
};

const item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ]
  }
});
const rd = createSuccessfulRemoteDataObject(item);
mockResultObject.indexableObject = Object.assign(new WorkspaceItem(), { item: observableOf(rd) });
let linkService;

describe('OtherWorkspaceItemSearchResultListElementComponent', () => {
  beforeEach(async(() => {
    linkService = getMockLinkService();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [OtherWorkspaceItemSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: ItemDataService, useValue: {} },
        { provide: LinkService, useValue: linkService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(OtherWorkspaceItemSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OtherWorkspaceItemSearchResultListElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should init item properly', (done) => {
    component.item$.pipe(take(1)).subscribe((i) => {
      expect(linkService.resolveLinks).toHaveBeenCalled();
      expect(i).toBe(item);
      done();
    });
  });

  it('should have properly status', () => {
    expect(component.status).toEqual(MyDspaceItemStatusType.WORKSPACE);
  });
});

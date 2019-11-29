import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';

import { Item } from '../../../../core/shared/item.model';
import { AllWorkspaceItemSearchResultListElementComponent } from './all-workspace-item-search-result-list-element.component';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { createSuccessfulRemoteDataObject } from '../../../testing/utils';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { WorkspaceItemSearchResult } from '../../../object-collection/shared/workspace-item-search-result.model';

let component: AllWorkspaceItemSearchResultListElementComponent;
let fixture: ComponentFixture<AllWorkspaceItemSearchResultListElementComponent>;

const compIndex = 1;

const mockResultObject: WorkspaceItemSearchResult = new WorkspaceItemSearchResult();
mockResultObject.hitHighlights = {};

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

describe('AllWorkspaceItemSearchResultListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [AllWorkspaceItemSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(AllWorkspaceItemSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllWorkspaceItemSearchResultListElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should init item properly', () => {
    expect(component.item).toEqual(item);
  });

  it('should have properly status', () => {
    expect(component.status).toEqual(MyDspaceItemStatusType.WORKSPACE);
  });
});

import { combineLatest as observableCombineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacetValue } from '../../../../facet-value.model';
import { SearchFilterConfig } from '../../../../search-filter-config.model';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { SearchFilterService } from '../../../../../../core/shared/search/search-filter.service';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { hasValue } from '../../../../../empty.util';
import { FilterType } from '../../../../filter-type.model';
import { currentPath } from '../../../../../utils/route.utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-search-facet-option',
  styleUrls: ['./search-facet-option.component.scss'],
  templateUrl: './search-facet-option.component.html',
})

/**
 * Represents a single option in a filter facet
 */
export class SearchFacetOptionComponent implements OnInit, OnDestroy {
  /**
   * A single value for this component
   */
  @Input() filterValue: FacetValue;

  /**
   * The filter configuration for this facet option
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * Emits the active values for this filter
   */
  @Input() selectedValues$: Observable<FacetValue[]>;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits true when this option should be visible and false when it should be invisible
   */
  isVisible: Observable<boolean>;

  /**
   * UI parameters when this filter is added
   */
  addQueryParams;

  /**
   * Link to the search page
   */
  searchLink: string;
  /**
   * Subscription to unsubscribe from on destroy
   */
  sub: Subscription;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected searchConfigService: SearchConfigurationService,
              protected router: Router,
              protected translate: TranslateService
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.isVisible = this.isChecked().pipe(map((checked: boolean) => !checked));
    this.sub = observableCombineLatest(this.selectedValues$, this.searchConfigService.searchOptions)
      .subscribe(([selectedValues, searchOptions]) => {
        this.updateAddParams(selectedValues)
      });
  }

  /**
   * Checks if a value for this filter is currently active
   */
  private isChecked(): Observable<boolean> {
    return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, this.getFacetValue());
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  private getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * Calculates the parameters that should change if a given value for this filter would be added to the active filters
   * @param {string[]} selectedValues The values that are currently selected for this filter
   */
  private updateAddParams(selectedValues: FacetValue[]): void {
    this.addQueryParams = {
      [this.filterConfig.paramName]: [...selectedValues.map((facetValue: FacetValue) => facetValue.label), this.getFacetValue()],
      page: 1
    };
  }

  getFacetLabel(facet: FacetValue): Observable<string> {
    if (this.filterConfig.name === 'namedresourcetype') {
      return this.searchConfigService.getCurrentConfiguration('').pipe(
        flatMap((configuration) => {
          const labelKey = `search.filters.filter.namedresourcetype.labels.${configuration}.${this.filterValue.filterValue}`;
          return this.translate.get(labelKey)
        }))
    } else {
      return observableOf(this.filterValue.value);
    }
  }

  /**
   * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
   * Retrieve facet value related to facet type
   */
  private getFacetValue(): string {
    if (this.filterValue.filterType === FilterType.authority) {
      return this.filterValue.filterValue + ',' + this.filterValue.filterType;
    } else {
      return this.filterValue.value;
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

import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';

import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
import { SearchResult } from '../../../+search-page/search-result.model';
import { MyDSpaceConfigurationValueType } from '../../../+my-dspace-page/my-dspace-configuration-value-type';

@searchResultFor(WorkspaceItem, MyDSpaceConfigurationValueType.Workflow)
export class WorkspaceitemRejectedMyDSpaceResult extends SearchResult<WorkspaceItem> {
}

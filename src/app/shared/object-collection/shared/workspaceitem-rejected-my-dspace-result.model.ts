import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { MyDSpaceConfigurationType } from '../../../+my-dspace-page/mydspace-configuration-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';
import { SearchResult } from '../../../+search-page/search-result.model';

@searchResultFor(Workspaceitem, MyDSpaceConfigurationType.Workflow)
export class WorkspaceitemRejectedMyDSpaceResult extends SearchResult<Workspaceitem> {
}

import { WorkspaceItem } from './workspaceitem.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a EditItem.
 */
export class EditItem extends WorkspaceItem {
  static type = new ResourceType('edititem');
}

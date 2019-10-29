import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedWorkspaceItem } from './normalized-workspaceitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { EditItem } from './edititem.model';
import { WorkflowItem } from './workflowitem.model';
import { EPerson } from '../../eperson/models/eperson.model';
import { Item } from '../../shared/item.model';
import { Collection } from '../../shared/collection.model';
import { SubmissionDefinitionsModel } from '../../config/models/config-submission-definitions.model';

@mapsTo(EditItem)
@inheritSerialization(NormalizedWorkspaceItem)
export class NormalizedEditItem extends NormalizedSubmissionObject<WorkflowItem> {

  /**
   * The collection this workspaceitem belonging to
   */
  @autoserialize
  @relationship(Collection, false)
  collection: string;

  /**
   * The item created with this workspaceitem
   */
  @autoserialize
  @relationship(Item, false)
  item: string;

  /**
   * The configuration object that define this workspaceitem
   */
  @autoserialize
  @relationship(SubmissionDefinitionsModel, false)
  submissionDefinition: string;

  /**
   * The EPerson who submit this workspaceitem
   */
  @autoserialize
  @relationship(EPerson, false)
  submitter: string;
}

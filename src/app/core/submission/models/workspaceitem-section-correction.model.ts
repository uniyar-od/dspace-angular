/**
 * An interface to represent submission's reserve-doi section data.
 */

export interface WorkspaceitemSectionCorrectionObject {
  metadata: WorkspaceitemSectionCorrectionMetadataObject[];
  bitstream: WorkspaceitemSectionCorrectionBitstreamObject[];
}

export interface WorkspaceitemSectionCorrectionMetadataObject {
  metadata: string;
  oldValues: string[];
  newValues: string[];
  label: string;
}

export enum OperationType {
  ADD,
  REMOVE,
  MODIFY
}

export interface WorkspaceitemSectionCorrectionBitstreamObject {
  filename: string;
  operationType: OperationType;
  metadata: WorkspaceitemSectionCorrectionMetadataObject[];
  policies: WorkspaceitemSectionCorrectionBitstreamPolicyObject[];
}

export interface WorkspaceitemSectionCorrectionBitstreamPolicyObject {
  oldValue: string;
  newValue: string;
  label: string;
}

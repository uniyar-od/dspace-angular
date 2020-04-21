/**
 * An interface to represent submission's reserve-doi section data.
 */

export interface WorkspaceitemCorrectionObject {
  metadata: WorkspaceitemCorrectionMetadataObject[];
  bitstream: WorkspaceitemCorrectionBitstreamObject[];
}

export interface WorkspaceitemCorrectionMetadataObject {
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

export interface WorkspaceitemCorrectionBitstreamObject {
  filename: string;
  operationType: OperationType;
  metadata: WorkspaceitemCorrectionMetadataObject[];
  policies: WorkspaceitemCorrectionBitstreamPolicyObject[];
}

export interface WorkspaceitemCorrectionBitstreamPolicyObject {
  oldValue: string;
  newValue: string;
  label: string;
}

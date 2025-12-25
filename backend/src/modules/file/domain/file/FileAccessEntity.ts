// domain/file/FileAccessEntity.ts
export type FileAccessEntity = {
  id: string;
  ownerId: string;
  permissions: string[]; // ['READ', 'WRITE']
};

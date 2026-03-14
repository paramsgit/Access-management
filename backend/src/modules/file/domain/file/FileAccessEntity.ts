// domain/file/FileAccessEntity.ts
export type FileAccessEntity = {
  id: string;
  ownerId: string;
  permissions: string[]; // ['READ', 'WRITE']
  content?: any;
};

export type FileData = {
  content: { data: any } | null;
  id: string;
};

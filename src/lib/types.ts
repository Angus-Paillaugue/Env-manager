export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  profilePicture: string;
  totpEnabled: boolean;
  totpSecret: string | null;
};

export type Project = {
  id: string;
  name: string;
  createdAt: Date;
  environments: Environment[];
  members: ProjectMember[];
};

export type ProjectMember = {
  userId: string;
  projectId: string;
  role: 'owner' | 'guest';
  user: User;
};

export type Environment = {
  id: string;
  projectId: string;
  name: string;
  createdAt: Date;
  variables: Variable[];
};

export type Variable = {
  id: string;
  environmentId: string;
  name: string;
  value: string;
  createdAt: Date;
};

export interface Docs {
  Metadata: Metadata;
  Page: Page;
  Tree: Tree;
}
interface Metadata {
  title?: string;
  description?: string;
}

interface Page {
  component: any;
  url: string;
  metadata: Metadata;
}

interface Tree {
  type: 'file' | 'dir';
  name: string;
  url: string;
  children: Tree[];
}

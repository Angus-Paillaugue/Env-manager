export type User = {
	id: string;
	username: string;
	email: string;
	passwordHash: string;
	createdAt: Date;
};

export type Project = {
	id: string;
	name: string;
	createdAt: Date;
	environments?: Environment[];
};

export type ProjectMember = {
	userId: string;
	projectId: string;
	role: 'owner' | 'guest';
};

export type Environment = {
	id: string;
	projectId: string;
	name: string;
	createdAt: Date;
	variables?: Variable[];
};

export type Variable = {
	id: string;
	environmentId: string;
	name: string;
	value: string;
	createdAt: Date;
};

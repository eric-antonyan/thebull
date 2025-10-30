export type Taskable = {
    _id: string;
    title: string;
    description: string;
    images: string[];
    priority: string;
    owner?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

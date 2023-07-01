export class ObjectsModel {
    create_time: Date;
    last_update_time: Date;
    objectId: number;
    type: string;
    code: string;
    name: string;
    iconUrl: string;
    parent_id: number;
    url: string;
    order: number;
    note: string;
    deleted: boolean;
    childObjects: ObjectsModel[];

    public constructor() {
    }
}

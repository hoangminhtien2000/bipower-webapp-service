export class CatalogItemModel {
    create_time: Date;
    last_update_time: Date;
    item_id: number;
    catalog_id: number;
    parent_id: number;
    code: string;
    name: string;
    note: string;
    deleted: boolean;
    is_default: boolean;

    public constructor() {
    }
}

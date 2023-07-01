import { CatalogItemModel } from "../catalog.item.model";

export class EvaluationCriteriaModel {
    criteriaId: number;
    type: string;
    criteriaName: string;
    evaluation: string;
    disable: boolean;
    criteria: CatalogItemModel;
}

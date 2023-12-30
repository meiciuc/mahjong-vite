import { GameModel } from "./GameModel";
import { Ref } from "vue";
import { dataService } from "../core/services/DataService";
import { PropertyPath } from "../core/mvc/model";
import { GetPropertyType } from "../core/utils/types";
import { useModel as useModelCore } from "../core/mvc/modelVueHook";

export function useModel<Path extends string[]>(
    path: PropertyPath<GameModel, Path>
): Ref<GetPropertyType<GameModel, Path>> {
    return useModelCore(dataService.getRootModel(), path);
}
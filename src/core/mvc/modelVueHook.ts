import { Ref, watch, ref, toRaw, onUnmounted } from 'vue';
import { Model, PropertyPath } from './model';
import { DeepReadonly, GetPropertyType } from '../utils/types';
import { compare } from '../utils/utils';


export function useModel<Data, const Path extends readonly string[]>(
    model: Model<Data>,
    path: PropertyPath<Data, Path>
): Ref<GetPropertyType<Data, Path>> {
    const submodel = model.getSubModel(path);
    const vueRef = ref(submodel.raw) as Ref<GetPropertyType<Data, Path>>;

    watch(vueRef, newValue => {
        const raw = toRaw(newValue);
        if (!compare(raw, submodel.data)) {
            submodel.set([] as PropertyPath<GetPropertyType<Data, Path>, []>, raw);
        }
    }, { deep: true, flush: 'sync' });

    const modelWatcher = (newValue: DeepReadonly<GetPropertyType<Data, Path>>) => {
        if (!compare(newValue, vueRef.value)) {
            vueRef.value = newValue as GetPropertyType<Data, Path>;
        }
    };

    submodel.subscribe(modelWatcher);
    onUnmounted(() => {
        submodel.unsubscribe(modelWatcher);
    });

    return vueRef;
}
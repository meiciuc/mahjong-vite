import { Model } from "../mvc/model";

export class DataService {
    private model: Model<unknown>;

    public config<Data extends object>(data: Data) {
        this.model = new Model(data) as Model<unknown>;
    }

    public getRootModel<Data>(): Model<Data> {
        return this.model as Model<Data>;
    }
}

export const dataService = new DataService();
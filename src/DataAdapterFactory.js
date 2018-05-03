export class DataAdapterFactory {
    static create(meta) {
        if (arguments.length === 2) {
            var ds = new turing.EMAPDataAdapter(meta);
            ds.refresh(ds.getMeta(), arguments[1]);
    
            return ds;
        } else {
            return new turing.EMAPDataAdapter();
        }
    }
}

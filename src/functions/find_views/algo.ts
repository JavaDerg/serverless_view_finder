export type Node = {
    id: number;
    x: number;
    y: number;
    els: Element[]|undefined;
};

export type Element = {
    id: number;
    nodes: number[];
    seen: boolean|undefined;
};

export type Value = {
    element_id: number;
    value: number;
};


class Data {
    nodes: Map<number, Node>;
    elements: Map<number, Element>;
    values: Value[];
    el_to_value: Map<number, Value>;

    constructor(nodes: Node[], elements: Element[], values: Value[]) {
        this.nodes = new Map<number, Node>();
        this.elements = new Map<number, Element>();
        this.values = values;
        this.el_to_value = new Map<number, Value>();

        nodes.forEach((node) => this.nodes.set(node.id, node));
        elements.forEach((el) => {
            this.elements.set(el.id, el);

            el.nodes.forEach((nid) => {
                let node = this.nodes.get(nid);
                if (node.els === undefined) node.els = [];
                node.els.push(el);
            });
        });
        this.values.forEach((val) => this.el_to_value.set(val.element_id, val));

        
        this.values.sort((a, b) => b.value - a.value);
    }

    get_element(id: number): Element {
        return this.elements.get(id);
    }

    get_elements_by_node(id: number): Element[] {
        return this.nodes.get(id).els;
    }

    get_value(id: number): Value {
        return this.el_to_value.get(id);
    }
}


export type InputData = {nodes: Node[], elements: Element[], values: Value[] };

export function find_views(idata: InputData, limit: number | null): Value[] {
    limit ??= idata.values.length;

    const data = new Data(idata.nodes, idata.elements, idata.values);

    return [...value_iter(data, limit)];
}

function* value_iter(data: Data, limit: number): Generator<Value> {
    for (let i = 0; i < limit; i++) {
        let el = data.get_element(
            data.values[i].element_id,
        );

        if (el.seen) {
            limit = Math.min(data.values.length, limit + 1);
            continue;
        };

        el.seen = true;
        for (let nel of get_neighbors(data, el)) {
            nel.seen = true;
        }

        yield data.values[i];
    }
}

// this includes elements on the same plane
function* get_neighbors(data: Data, el: Element): Generator<Element> {
    let seen = new Set<number>();

    function* explore_node(node: number): Generator<Element> {
        for (let el of data.get_elements_by_node(node)) {
            if (seen.has(el.id)) continue;

            seen.add(el.id);
            yield el;
        }
    }

    let explore = [el];

    let next: Element|undefined;
    while ((next = explore.pop()) !== undefined) {
        let el_on_flat = eq_float(
            data.get_value(next.id).value,
            data.get_value(el.id).value,
        );

        for (let node of next.nodes) {
            for (let oel of explore_node(node)) {
                if(el_on_flat) explore.push(oel);
                yield oel;
            }
        }
    }
}

// float comparison is tricky
// we will use a tolerance for comparison
function eq_float(a: number, b: number): boolean {
    return Math.abs(a - b) <= Number.EPSILON;
}

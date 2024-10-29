import NodeCache from "node-cache";
const nodeCache = new NodeCache();
export let addToCache = (id: string, body: any) => {
    nodeCache.set(id, body);
};
export let deleteFromCache = (items: string[]) => {
    nodeCache.del([...items]);
};
export let getFromCache = (id: string) => nodeCache.get(id);

import {
    updateComponentSlots,
} from "../component.js";

function update(oldvnode: VNode, vnode: VM) {
    if (!vnode.cache) {
        return;
    }
    const { data: { slotset: oldSlotset } } = oldvnode;
    const { data: { slotset } } = vnode;
    if (!oldSlotset && !slotset) {
        return;
    }
    if (oldSlotset === slotset) {
        return;
    }
    updateComponentSlots(vnode, slotset);
}

export default {
    create: update,
    update,
};
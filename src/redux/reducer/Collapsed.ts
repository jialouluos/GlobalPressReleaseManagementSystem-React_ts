import { COLLAPSED } from "../const/Collapsed";
interface ICollapsed {
    type: string
    value: boolean
}
export default function updateCollapsedReducer(pre: { isCollapsed: boolean } = { isCollapsed: false }, action: ICollapsed) {
    const { type, value } = action;
    if (type === COLLAPSED) {
        let newState = { ...pre };
        newState.isCollapsed = value;
        return newState;
    } else {
        return pre;
    }

}


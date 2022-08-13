import { LOAD } from "../const/Loading";
interface ILoad {
    type: string
    value: boolean
}
export default function updateLoadReducer(pre: { isLoad: boolean } = { isLoad: false }, action: ILoad) {
    const { type, value } = action;
    if (type === LOAD) {
        let newState = { ...pre };
        newState.isLoad = value;
        return newState;
    } else {
        return pre;
    }

}


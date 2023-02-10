import { combineReducers } from "redux";
import config from "./config";
import { STATISTICS, CHANGE_WALLET, SELECT_CHAIN, TOKEN_LIST, ADD_TOKEN, REMOVE_TOKEN } from "../constants";
import { customList, defaultTokenList, userSettings } from "../../config/constants";

export function statistics(state = {}, action) {
    switch (action.type) {
        case STATISTICS:
            return action.payload
        default:
            return state
    }
}

export function walletAddress(state = '', action) {
    switch (action.type) {
        case CHANGE_WALLET:
            return {
                address: action.payload
            }
        default:
            return state
    }

    // return state;
}

export function selectedChain(state = 'kava', action) {
    switch (action.type) {
        case SELECT_CHAIN:
            return action.payload
        default:
            return state
    }    
}

function mergeTokenList(list1, list2) {
    const keys1 = Object.keys(list1);
    const keys2 = Object.keys(list2);
    keys1.map(each1 => {
        list1[each1].map(each11 => {
            const index = list2[each1].findIndex(each12 => each12.address.toLowerCase() === each11.address.toLowerCase());
            if (index !== -1) list2[each1].splice(index, 1);
            return true;
        })
        return true;
    })
    keys2.map(each2 => {
        if (!list1[each2]) list1[each2] = [];
        list1[each2] = list1[each2].concat(list2[each2]);
        return true;
    })
    const _userSettings = JSON.parse(localStorage.getItem(userSettings));
    if (_userSettings && _userSettings[customList]) {
        const keys3 = Object.keys(_userSettings[customList]);
        keys3.map(each3 => {
            _userSettings[customList][each3].map(each33 => {
                const index = list1[each3].findIndex(each31 => each33.address.toLowerCase() === each31.address.toLowerCase());
                if (index === -1) list1[each3].push(each33);
                return true;
            })
            return true;
        })
    }
    return {...list1};
}

function addToken(list, data, chain) {
    const index = list[chain].findIndex(each => each.address.toLowerCase() === data.address.toLowerCase());
    if (index === -1) {
        list[chain].push(data);
        return list;
    }
    return {...list};
}

function removeToken(list, data, chain) {
    const index = list[chain].findIndex(each => each.address.toLowerCase() === data.address.toLowerCase());
    if (index !== -1) {
        list[chain].splice(index, 1);
        return list;
    }
    return {...list};
}

export function tokenList(state = defaultTokenList, action) {
    switch (action.type) {
        case TOKEN_LIST:
            return mergeTokenList(state, action.payload)
        case ADD_TOKEN:
            return addToken(state, action.payload, action.chain);
        case REMOVE_TOKEN:
            return removeToken(state, action.payload, action.chain);
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    config,
    statistics,
    walletAddress,
    selectedChain,
    tokenList
});
export default rootReducer;

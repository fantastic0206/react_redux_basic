
const initialState = [];
export default function fetchDataReducer (state = initialState, action) {
    switch (action.type) {
        case 'FETCH_DATA':
            return { ...state, fetch_data: action.Payload ? action.Payload : [], selectedMenuId: action.selectedMenuId ? action.selectedMenuId : null, page_num: action.page_num };
        case "SET_PAGENUM":
            return { ...state, page_num: action.Payload ? action.Payload : [] };
        default:
            return state
    }
}

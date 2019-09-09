const initialState = {
    // 使用者調整後的星球資訊
    usrOpenID: '',               //使用者微信ID
    fromServerUsrName: '',       //使用者真實姓名
    fromServerUsrPlanetRadius: null,               //星球半徑
    fromServerUsrPlanetTone: null,                 //星球色調
    fromServerUsrPlanetMountainHeight: null,       //山高
    fromServerUsrPlanetMountainDensity: null,      //山密度
    // fromServerUsrPlanetRadius: 400,               //星球半徑
    // fromServerUsrPlanetTone: 4,                 //星球色調
    // fromServerUsrPlanetMountainHeight: 70,       //山高
    // fromServerUsrPlanetMountainDensity: 30,      //山密度
    fromServerUsrWorkDays: '0',           //使用者在職天數
    lotteryNumber: '0',                 //使用者抽獎號碼

    loadingPageMounted: true,        //載入頁面是否掛載
    introPageMounted: false,     //intro頁面是否掛載
    finalPageMounted: false,     //最終頁面是否掛載

    bgAlignToRight: false,          //页面背景是否往左移到最左

    thisPersonIdIsInDataBase: true,      //此人是不是在資料庫中
}

// 這個Reducer是空的，之所以創建是為了避免在最初創建store時沒有reducer而出錯
export default function myFirstReducers(state = initialState, action) {
    switch (action.type) {
        case 'UPDATEUSROPENID':
            return {
                ...state,
                usrOpenID: action.value,
            }
        case 'UPDATEFROMSERVERUSRNAME':
            return {
                ...state,
                fromServerUsrName: action.value,
            }
        case 'UPDATEFROMSERVERUSRPLANETRADIUS':
            return {
                ...state,
                fromServerUsrPlanetRadius: action.value,
            }
        case 'UPDATEFROMSERVERUSRPLANETTONE':
            return {
                ...state,
                fromServerUsrPlanetTone: action.value,
            }
        case 'UPDATEFROMSERVERUSRPLANETMOUNTAINHEIGHT':
            return {
                ...state,
                fromServerUsrPlanetMountainHeight: action.value,
            }
        case 'UPDATEFROMSERVERUSRPLANETMOUNTAINDENSITY':
            return {
                ...state,
                fromServerUsrPlanetMountainDensity: action.value,
            }
            
        case 'UPDATELOADINGPAGEMOUNTED':
            return {
                ...state,
                loadingPageMounted: action.value,
            }
        case 'UPDATEINTROPAGEMOUNTED':
            return {
                ...state,
                introPageMounted: action.value,
            }
        case 'UPDATEFINALPAGEMOUNTED':
            return {
                ...state,
                finalPageMounted: action.value,
            }
        case 'UPDATEFROMSERVERUSRWORKDAYS':
            return {
                ...state,
                fromServerUsrWorkDays: action.value,
            }
        case 'UPDATELOTTERYNUMBER':
            return {
                ...state,
                lotteryNumber: action.value,
            }
        case 'CHANGEBGALIGNTORIGHT':
            return {
                ...state,
                bgAlignToRight: action.value,
            }

        // 以下是其他專案的紀錄，供我做這個專案參考
        // case 'CLOSEMOREMENU':
        //     return {
        //         ...state,
        //         moreMenuIsOpen: false,
        //     };
        case "UPDATETHISPERSONISINDATABASE":
            return {
                ...state,
                thisPersonIdIsInDataBase: action.value,
            }
        default:
            return state
    }
}
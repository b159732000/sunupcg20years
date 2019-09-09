export const UPDATEUSROPENID = 'UPDATEUSROPENID';
export const UPDATEFROMSERVERUSRNAME = 'UPDATEFROMSERVERUSRNAME';
export const UPDATEFROMSERVERUSRPLANETRADIUS = 'UPDATEFROMSERVERUSRPLANETRADIUS';
export const UPDATEFROMSERVERUSRPLANETTONE = 'UPDATEFROMSERVERUSRPLANETTONE';
export const UPDATEFROMSERVERUSRPLANETMOUNTAINHEIGHT = 'UPDATEFROMSERVERUSRPLANETMOUNTAINHEIGHT';
export const UPDATEFROMSERVERUSRPLANETMOUNTAINDENSITY = 'UPDATEFROMSERVERUSRPLANETMOUNTAINDENSITY';
export const UPDATELOADINGPAGEMOUNTED = 'UPDATELOADINGPAGEMOUNTED';
export const UPDATEINTROPAGEMOUNTED = 'UPDATEINTROPAGEMOUNTED';
export const UPDATEFINALPAGEMOUNTED = 'UPDATEFINALPAGEMOUNTED';
export const UPDATEFROMSERVERUSRWORKDAYS = 'UPDATEFROMSERVERUSRWORKDAYS';
export const UPDATELOTTERYNUMBER = 'UPDATELOTTERYNUMBER';
export const CHANGEBGALIGNTORIGHT = 'CHANGEBGALIGNTORIGHT';
export const UPDATETHISPERSONISINDATABASE = 'UPDATETHISPERSONISINDATABASE';

export function updateUsrOpenID(usrOpenID) {
    return { type: UPDATEUSROPENID, value: usrOpenID };
}
// export function updateUsrOpenID(usrOpenID) {
//     Promise.resolve({
//         type: UPDATEUSROPENID,
//         value: usrOpenID
//     })
// }
export function updateFromServerUsrName(fromServerUsrName) {
    return { type: UPDATEFROMSERVERUSRNAME, value: fromServerUsrName };
}
export function updateFromServerUsrPlanetRadius(fromServerUsrPlanetRadius) {
    return { type: UPDATEFROMSERVERUSRPLANETRADIUS, value: fromServerUsrPlanetRadius };
}
export function updateFromServerPlanetTone(fromServerPlanetTone) {
    return { type: UPDATEFROMSERVERUSRPLANETTONE, value: fromServerPlanetTone };
}
export function updateFromServerUsrPlanetMountainHeight(fromServerUsrPlanetMountainHeight) {
    return { type: UPDATEFROMSERVERUSRPLANETMOUNTAINHEIGHT, value: fromServerUsrPlanetMountainHeight };
}
export function updateFromServerUsrPlanetMountainDensity(fromServerUsrPlanetMountainDensity) {
    return { type: UPDATEFROMSERVERUSRPLANETMOUNTAINDENSITY, value: fromServerUsrPlanetMountainDensity };
}
export function updateLoadingPageMounted(loadingPageMounted) {
    return { type: UPDATELOADINGPAGEMOUNTED, value: loadingPageMounted };
}
export function updateIntroPageMounted(introPageMounted) {
    return { type: UPDATEINTROPAGEMOUNTED, value: introPageMounted };
}
export function updateFinalPageMounted(finalPageMounted) {
    return { type: UPDATEFINALPAGEMOUNTED, value: finalPageMounted };
}
export function updateFromServerUsrWorkDays(fromServerUsrWorkDays) {
    return { type: UPDATEFROMSERVERUSRWORKDAYS, value: fromServerUsrWorkDays}
}
export function updateLotteryNumber(lotteryNumber) {
    return { type: UPDATELOTTERYNUMBER, value: lotteryNumber}
}
export function changeBGAlignToRight(trueOrFalse) {
    return { type: CHANGEBGALIGNTORIGHT, value: trueOrFalse}
}
export function updateThisPersonIsInDataBase(trueOrFalse) {
    return { type: UPDATETHISPERSONISINDATABASE, value: trueOrFalse}
}
/**
 * @requestUrl 接口地址
 * @historyTracker histroy 上报
 * @hashTracker hash上报
 * @domTracker 写到tracker-key点击事件上报
 * @sdkVersion  sdk版本
 * @extra 其他字段
 * @jsError js和promise 报错上传
 */
export interface DefaultOption {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker:boolean,
    hashTracker:boolean
    domTracker:boolean,
    sdkVersion:string|number,
    extra:Record<string,any> |undefined,
    jsError:boolean,
    
}
export interface Options extends Partial <DefaultOption>{
    requestUrl:string // 必传,其他非必传
}
export enum TrackerConfig{
    version="1.0.0"
}
export type reportTrackerData = {
    [key:string]:any,
    event:string,
    targetKey:string
}
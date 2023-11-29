/**
 * @requestUrl 接口地址
 * @historyTracker histroy 上报
 * @hashTracker hash上报
 * @domTracker 写到tracker-key点击事件上报
 * @sdkVersion  sdk版本
 * @extra 其他字段
 * @jsError js和promise 报错上传
 */
interface DefaultOption {
    uuid: string | undefined;
    requestUrl: string | undefined;
    historyTracker: boolean;
    hashTracker: boolean;
    domTracker: boolean;
    sdkVersion: string | number;
    extra: Record<string, any> | undefined;
    jsError: boolean;
}
interface Options extends Partial<DefaultOption> {
    requestUrl: string;
}
type reportTrackerData = {
    [key: string]: any;
    event: string;
    targetKey: string;
};

declare class Tracker {
    data: Options;
    private version;
    constructor(options: Options);
    initDef(): DefaultOption;
    private captureEvents;
    private installTracker;
    setUserId<T extends DefaultOption["uuid"]>(uuid: T): void;
    setExtra<T extends DefaultOption["extra"]>(extra: T): void;
    sendTracker<T extends reportTrackerData>(data: T): void;
    private targetKeyReport;
    private jsError;
    private errorEvent;
    private promiseReject;
    private reportTracker;
}

export { Tracker as default };

import { DefaultOption, Options, TrackerConfig, reportTrackerData } from "../type/index";
import { createHistoryEvent } from "../utils/pv";
const MouseEventList: string[] = ["click", "dblclick", "contextmenu", "mousedown", "mouseup", "mouseout", "mouseover"]
export default class Tracker {
    public data: Options;
    private version: string | undefined
    constructor(options: Options) {
        this.data = Object.assign(this.initDef(), options)
        this.installTracker()
    }
    //如果用户不传,默认参数
    public initDef(): DefaultOption {
        this.version = TrackerConfig.version;
        window.history["pushState"] = createHistoryEvent("pushState")
        window.history["replaceState"] = createHistoryEvent("replaceState")
        return <DefaultOption>{
            historyTracker: false,
            domTracker: false,
            jsError: false,
            hashTracker: false,
            sdkVersion: this.version,
        }
    }
    private captureEvents<T>(mouseEventList: string[], targetKey: string, data?: T) {
        mouseEventList.forEach(event => {
            window.addEventListener(event, () => {
                console.log("监听到了");
                this.reportTracker({
                    event,
                    targetKey,
                    data
                })
            })
        })
    }
    private installTracker() {
        if (this.data.historyTracker) {
            this.captureEvents(["pushState", "replaceState", "popstate"], "history-pv")
        }
        if (this.data.hashTracker) {
            this.captureEvents(["hashchange"], "hash-pv")
        }
        if (this.data.domTracker) {
            this.targetKeyReport()
        }
        if (this.data.jsError) {
            this.jsError()
        }
    }
    public setUserId<T extends DefaultOption["uuid"]>(uuid: T) {
        this.data.uuid = uuid
    }
    public setExtra<T extends DefaultOption["extra"]>(extra: T) {
        this.data.extra = extra
    }
    public sendTracker<T extends reportTrackerData>(data: T) {
        this.reportTracker(data)
    }
    private targetKeyReport() {
        MouseEventList.forEach(e => {
            window.addEventListener(e, (event) => {
                const target = event.target as HTMLElement
                const targetKey = target.getAttribute("target-key")
                if (targetKey) {
                    this.reportTracker({
                        event: e,
                        targetKey,
                    })
                }



            })
        })
    }
    private jsError(){
        this.errorEvent();
        this.promiseReject()
    }
    private errorEvent() {
        window.addEventListener("error", (e) => {
            this.reportTracker({
                event: "error",
                targetKey: "message",
                message: e.message
            })
        })
    }
    private promiseReject() {
        window.addEventListener("unhandledrejection", (e) => {
            e.promise.catch(error => {
                this.reportTracker({
                    event: "promise",
                    targetKey: "message",
                    message:error
        })
            })

        })
    }
    private reportTracker<T>(data: T) {
        const params = Object.assign(this.data, data, { time: new Date().getTime() })
        let headers = {
            type: "application/x-www-form-urlencoded"
        }
        let blob = new Blob([JSON.stringify(params)], headers)
        navigator.sendBeacon(this.data.requestUrl, blob)
    }

}
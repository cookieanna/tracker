'use strict';

var TrackerConfig;
(function (TrackerConfig) {
    TrackerConfig["version"] = "1.0.0";
})(TrackerConfig || (TrackerConfig = {}));

// pageview 对网站地址进行记录,主要监听histroy和hash
const createHistoryEvent = (type) => {
    const origin = history[type];
    return function () {
        const res = origin.apply(this, arguments);
        const e = new Event(type);
        window.dispatchEvent(e);
        console.log("res", res);
        return res;
    };
};
// createHistoryEvent("replaceState")
// createHistoryEvent("pushState")

const MouseEventList = ["click", "dblclick", "contextmenu", "mousedown", "mouseup", "mouseout", "mouseover"];
class Tracker {
    constructor(options) {
        this.data = Object.assign(this.initDef(), options);
        this.installTracker();
    }
    //如果用户不传,默认参数
    initDef() {
        this.version = TrackerConfig.version;
        window.history["pushState"] = createHistoryEvent("pushState");
        window.history["replaceState"] = createHistoryEvent("replaceState");
        return {
            historyTracker: false,
            domTracker: false,
            jsError: false,
            hashTracker: false,
            sdkVersion: this.version,
        };
    }
    captureEvents(mouseEventList, targetKey, data) {
        mouseEventList.forEach(event => {
            window.addEventListener(event, () => {
                console.log("监听到了");
                this.reportTracker({
                    event,
                    targetKey,
                    data
                });
            });
        });
    }
    installTracker() {
        if (this.data.historyTracker) {
            this.captureEvents(["pushState", "replaceState", "popstate"], "history-pv");
        }
        if (this.data.hashTracker) {
            this.captureEvents(["hashchange"], "hash-pv");
        }
        if (this.data.domTracker) {
            this.targetKeyReport();
        }
        if (this.data.jsError) {
            this.jsError();
        }
    }
    setUserId(uuid) {
        this.data.uuid = uuid;
    }
    setExtra(extra) {
        this.data.extra = extra;
    }
    sendTracker(data) {
        this.reportTracker(data);
    }
    targetKeyReport() {
        MouseEventList.forEach(e => {
            window.addEventListener(e, (event) => {
                const target = event.target;
                const targetKey = target.getAttribute("target-key");
                if (targetKey) {
                    this.reportTracker({
                        event: e,
                        targetKey,
                    });
                }
            });
        });
    }
    jsError() {
        this.errorEvent();
        this.promiseReject();
    }
    errorEvent() {
        window.addEventListener("error", (e) => {
            this.reportTracker({
                event: "error",
                targetKey: "message",
                message: e.message
            });
        });
    }
    promiseReject() {
        window.addEventListener("unhandledrejection", (e) => {
            e.promise.catch(error => {
                this.reportTracker({
                    event: "promise",
                    targetKey: "message",
                    message: error
                });
            });
        });
    }
    reportTracker(data) {
        const params = Object.assign(this.data, data, { time: new Date().getTime() });
        let headers = {
            type: "application/x-www-form-urlencoded"
        };
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }
}

module.exports = Tracker;

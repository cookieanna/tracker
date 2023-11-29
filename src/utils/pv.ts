// pageview 对网站地址进行记录,主要监听histroy和hash

export const createHistoryEvent = <T extends keyof History>(type: T): () => any => {
    const origin = history[type];
    return function (this: any) {
        const res = origin.apply(this, arguments)
        const e = new Event(type)
        window.dispatchEvent(e)
        console.log("res",res);
        
        return res
    }
}
// createHistoryEvent("replaceState")
// createHistoryEvent("pushState")
function alwaysThread(res) {
    if (!res.message.thread_ts) {
        res.message.thread_ts = res.message.rawMessage.ts;
    }
}

module.exports = {
    alwaysThread
};

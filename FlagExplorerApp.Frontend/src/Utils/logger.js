import log from 'loglevel';

//log levels (can be 'trace', 'debug', 'info', 'warn', 'error')
log.setLevel('debug');


const originalFactory = log.methodFactory;
log.methodFactory = function (methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);
    return function (message) {
        rawMethod(`[${new Date().toISOString()}] ${message}`);
    };
};
log.rebuild();

export default log;
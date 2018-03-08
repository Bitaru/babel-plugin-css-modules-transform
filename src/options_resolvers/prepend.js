import { isFunction, isString, isModulePath, requireLocalFileOrNodeModule } from '../utils';

/**
 * Resolves prepend option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Function}
 */
export default function prepend(value/* , currentConfig */) {
    let plugins = [];
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
            const option = value[index];
            if (isFunction(option)) return plugins.push(option());

            const requiredOption = requireLocalFileOrNodeModule(option);
            if (!isFunction(requiredOption)) {
                throw new Error(`Configuration 'prepend[${index}]' module is not exporting a function`);
            }
            const returnedOptions = requiredOption();
            plugins = [...plugins, ...(returnedOptions.plugins || returnedOptions)];
        }
        return plugins;
    }

    if (isString(value)) {
        const requiredOption = requireLocalFileOrNodeModule(value);
        if (!isFunction(requiredOption)) {
            throw new Error(`Configuration 'prepend' module is not exporting a function`);
        }
        const returnedOptions = requiredOption();
        return returnedOptions.plugins || returnedOptions;
    }

    throw new Error(`Configuration 'prepend' is not an array`);
}

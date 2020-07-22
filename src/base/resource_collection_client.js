const ow = require('ow');
const ApiClient = require('./api_client');
const {
    pluckData,
    parseDateFields,
} = require('../utils');

/**
 * Resource collection client.
 */
class ResourceCollectionClient extends ApiClient {
    /**
     * @param {ApiClientOptions} options
     */
    constructor(options = {}) {
        if (options.id) {
            throw new Error('"id" is not an allowed option for ResourceCollectionClient.');
        }
        super(options);
    }

    async list(options = {}) {
        const response = await this.httpClient.call({
            url: this._url(),
            method: 'GET',
            params: this._params(options),
        });
        return parseDateFields(pluckData(response.data));
    }

    async create(resource) {
        ow(resource, ow.optional.object);
        this._throwIfDisabled('create');
        const response = await this.httpClient.call({
            url: this._url(),
            method: 'POST',
            params: this._params(),
            data: resource,
        });
        return parseDateFields(pluckData(response.data));
    }

    async getOrCreate(name = '') {
        // The default value of '' allows creating unnamed
        // resources by passing the name= parameter with
        // no value. It's useful and later will be supported
        // in API properly by omitting the name= param entirely.
        ow(name, ow.string);
        this._throwIfDisabled('getOrCreate');
        const response = await this.httpClient.call({
            url: this._url(),
            method: 'POST',
            params: this._params({ name }),
        });
        return parseDateFields(pluckData(response.data));
    }
}

module.exports = ResourceCollectionClient;

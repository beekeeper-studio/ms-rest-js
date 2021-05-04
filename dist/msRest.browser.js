/** @license ms-rest-js
  * Copyright (c) Microsoft Corporation. All rights reserved.
  * Licensed under the MIT License. See License.txt and ThirdPartyNotices.txt in the project root for license information.
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.msRest = {}));
}(this, (function (exports) { 'use strict';

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    /**
     * A collection of HttpHeaders that can be sent with a HTTP request.
     */
    function getHeaderKey(headerName) {
        return headerName.toLowerCase();
    }
    function isHttpHeadersLike(object) {
        if (!object || typeof object !== "object") {
            return false;
        }
        if (typeof object.rawHeaders === "function" &&
            typeof object.clone === "function" &&
            typeof object.get === "function" &&
            typeof object.set === "function" &&
            typeof object.contains === "function" &&
            typeof object.remove === "function" &&
            typeof object.headersArray === "function" &&
            typeof object.headerValues === "function" &&
            typeof object.headerNames === "function" &&
            typeof object.toJson === "function") {
            return true;
        }
        return false;
    }
    /**
     * A collection of HTTP header key/value pairs.
     */
    var HttpHeaders = /** @class */ (function () {
        function HttpHeaders(rawHeaders) {
            this._headersMap = {};
            if (rawHeaders) {
                for (var headerName in rawHeaders) {
                    this.set(headerName, rawHeaders[headerName]);
                }
            }
        }
        /**
         * Set a header in this collection with the provided name and value. The name is
         * case-insensitive.
         * @param headerName The name of the header to set. This value is case-insensitive.
         * @param headerValue The value of the header to set.
         */
        HttpHeaders.prototype.set = function (headerName, headerValue) {
            this._headersMap[getHeaderKey(headerName)] = {
                name: headerName,
                value: headerValue.toString(),
            };
        };
        /**
         * Get the header value for the provided header name, or undefined if no header exists in this
         * collection with the provided name.
         * @param headerName The name of the header.
         */
        HttpHeaders.prototype.get = function (headerName) {
            var header = this._headersMap[getHeaderKey(headerName)];
            return !header ? undefined : header.value;
        };
        /**
         * Get whether or not this header collection contains a header entry for the provided header name.
         */
        HttpHeaders.prototype.contains = function (headerName) {
            return !!this._headersMap[getHeaderKey(headerName)];
        };
        /**
         * Remove the header with the provided headerName. Return whether or not the header existed and
         * was removed.
         * @param headerName The name of the header to remove.
         */
        HttpHeaders.prototype.remove = function (headerName) {
            var result = this.contains(headerName);
            delete this._headersMap[getHeaderKey(headerName)];
            return result;
        };
        /**
         * Get the headers that are contained this collection as an object.
         */
        HttpHeaders.prototype.rawHeaders = function () {
            var result = {};
            for (var headerKey in this._headersMap) {
                var header = this._headersMap[headerKey];
                result[header.name.toLowerCase()] = header.value;
            }
            return result;
        };
        /**
         * Get the headers that are contained in this collection as an array.
         */
        HttpHeaders.prototype.headersArray = function () {
            var headers = [];
            for (var headerKey in this._headersMap) {
                headers.push(this._headersMap[headerKey]);
            }
            return headers;
        };
        /**
         * Get the header names that are contained in this collection.
         */
        HttpHeaders.prototype.headerNames = function () {
            var headerNames = [];
            var headers = this.headersArray();
            for (var i = 0; i < headers.length; ++i) {
                headerNames.push(headers[i].name);
            }
            return headerNames;
        };
        /**
         * Get the header names that are contained in this collection.
         */
        HttpHeaders.prototype.headerValues = function () {
            var headerValues = [];
            var headers = this.headersArray();
            for (var i = 0; i < headers.length; ++i) {
                headerValues.push(headers[i].value);
            }
            return headerValues;
        };
        /**
         * Get the JSON object representation of this HTTP header collection.
         */
        HttpHeaders.prototype.toJson = function () {
            return this.rawHeaders();
        };
        /**
         * Get the string representation of this HTTP header collection.
         */
        HttpHeaders.prototype.toString = function () {
            return JSON.stringify(this.toJson());
        };
        /**
         * Create a deep clone/copy of this HttpHeaders collection.
         */
        HttpHeaders.prototype.clone = function () {
            return new HttpHeaders(this.rawHeaders());
        };
        return HttpHeaders;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    /**
     * Encodes a string in base64 format.
     * @param value the string to encode
     */
    function encodeString(value) {
        return btoa(value);
    }
    /**
     * Encodes a byte array in base64 format.
     * @param value the Uint8Aray to encode
     */
    function encodeByteArray(value) {
        var str = "";
        for (var i = 0; i < value.length; i++) {
            str += String.fromCharCode(value[i]);
        }
        return btoa(str);
    }
    /**
     * Decodes a base64 string into a byte array.
     * @param value the base64 string to decode
     */
    function decodeString(value) {
        var byteString = atob(value);
        var arr = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            arr[i] = byteString.charCodeAt(i);
        }
        return arr;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var rngBrowser = createCommonjsModule(function (module) {
    // Unique ID creation requires a high quality random # generator.  In the
    // browser this is a little complicated due to unknown quality of Math.random()
    // and inconsistent support for the `crypto` API.  We do the best we can via
    // feature-detection

    // getRandomValues needs to be invoked in a context where "this" is a Crypto
    // implementation. Also, find the complete implementation of crypto on IE11.
    var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                          (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

    if (getRandomValues) {
      // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
      var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

      module.exports = function whatwgRNG() {
        getRandomValues(rnds8);
        return rnds8;
      };
    } else {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var rnds = new Array(16);

      module.exports = function mathRNG() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return rnds;
      };
    }
    });

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */
    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }

    function bytesToUuid(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex;
      // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
      return ([
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]]
      ]).join('');
    }

    var bytesToUuid_1 = bytesToUuid;

    function v4(options, buf, offset) {
      var i = buf && offset || 0;

      if (typeof(options) == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};

      var rnds = options.random || (options.rng || rngBrowser)();

      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = (rnds[6] & 0x0f) | 0x40;
      rnds[8] = (rnds[8] & 0x3f) | 0x80;

      // Copy bytes to buffer, if provided
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }

      return buf || bytesToUuid_1(rnds);
    }

    var v4_1 = v4;

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    var Constants = {
        /**
         * The ms-rest version
         * @const
         * @type {string}
         */
        msRestVersion: "2.4.0",
        /**
         * Specifies HTTP.
         *
         * @const
         * @type {string}
         */
        HTTP: "http:",
        /**
         * Specifies HTTPS.
         *
         * @const
         * @type {string}
         */
        HTTPS: "https:",
        /**
         * Specifies HTTP Proxy.
         *
         * @const
         * @type {string}
         */
        HTTP_PROXY: "HTTP_PROXY",
        /**
         * Specifies HTTPS Proxy.
         *
         * @const
         * @type {string}
         */
        HTTPS_PROXY: "HTTPS_PROXY",
        /**
         * Specifies NO Proxy.
         */
        NO_PROXY: "NO_PROXY",
        /**
         * Specifies ALL Proxy.
         */
        ALL_PROXY: "ALL_PROXY",
        HttpConstants: {
            /**
             * Http Verbs
             *
             * @const
             * @enum {string}
             */
            HttpVerbs: {
                PUT: "PUT",
                GET: "GET",
                DELETE: "DELETE",
                POST: "POST",
                MERGE: "MERGE",
                HEAD: "HEAD",
                PATCH: "PATCH",
            },
            StatusCodes: {
                TooManyRequests: 429,
            },
        },
        /**
         * Defines constants for use with HTTP headers.
         */
        HeaderConstants: {
            /**
             * The Authorization header.
             *
             * @const
             * @type {string}
             */
            AUTHORIZATION: "authorization",
            AUTHORIZATION_SCHEME: "Bearer",
            /**
             * The Retry-After response-header field can be used with a 503 (Service
             * Unavailable) or 349 (Too Many Requests) responses to indicate how long
             * the service is expected to be unavailable to the requesting client.
             *
             * @const
             * @type {string}
             */
            RETRY_AFTER: "Retry-After",
            /**
             * The UserAgent header.
             *
             * @const
             * @type {string}
             */
            USER_AGENT: "User-Agent",
        },
    };

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * A constant that indicates whether the environment is node.js or browser based.
     */
    var isNode = typeof process !== "undefined" &&
        !!process.version &&
        !!process.versions &&
        !!process.versions.node;
    /**
     * Encodes an URI.
     *
     * @param {string} uri The URI to be encoded.
     * @return {string} The encoded URI.
     */
    function encodeUri(uri) {
        return encodeURIComponent(uri)
            .replace(/!/g, "%21")
            .replace(/"/g, "%27")
            .replace(/\(/g, "%28")
            .replace(/\)/g, "%29")
            .replace(/\*/g, "%2A");
    }
    /**
     * Returns a stripped version of the Http Response which only contains body,
     * headers and the status.
     *
     * @param {HttpOperationResponse} response The Http Response
     *
     * @return {object} The stripped version of Http Response.
     */
    function stripResponse(response) {
        var strippedResponse = {};
        strippedResponse.body = response.bodyAsText;
        strippedResponse.headers = response.headers;
        strippedResponse.status = response.status;
        return strippedResponse;
    }
    /**
     * Returns a stripped version of the Http Request that does not contain the
     * Authorization header.
     *
     * @param {WebResource} request The Http Request object
     *
     * @return {WebResource} The stripped version of Http Request.
     */
    function stripRequest(request) {
        var strippedRequest = request.clone();
        if (strippedRequest.headers) {
            strippedRequest.headers.remove("authorization");
        }
        return strippedRequest;
    }
    /**
     * Validates the given uuid as a string
     *
     * @param {string} uuid The uuid as a string that needs to be validated
     *
     * @return {boolean} True if the uuid is valid; false otherwise.
     */
    function isValidUuid(uuid) {
        var validUuidRegex = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$", "ig");
        return validUuidRegex.test(uuid);
    }
    /**
     * Generated UUID
     *
     * @return {string} RFC4122 v4 UUID.
     */
    function generateUuid() {
        return v4_1();
    }
    /**
     * Executes an array of promises sequentially. Inspiration of this method is here:
     * https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html. An awesome blog on promises!
     *
     * @param {Array} promiseFactories An array of promise factories(A function that return a promise)
     *
     * @param {any} [kickstart] Input to the first promise that is used to kickstart the promise chain.
     * If not provided then the promise chain starts with undefined.
     *
     * @return A chain of resolved or rejected promises
     */
    function executePromisesSequentially(promiseFactories, kickstart) {
        var result = Promise.resolve(kickstart);
        promiseFactories.forEach(function (promiseFactory) {
            result = result.then(promiseFactory);
        });
        return result;
    }
    /**
     * A wrapper for setTimeout that resolves a promise after t milliseconds.
     * @param {number} t The number of milliseconds to be delayed.
     * @param {T} value The value to be resolved with after a timeout of t milliseconds.
     * @returns {Promise<T>} Resolved promise
     */
    function delay(t, value) {
        return new Promise(function (resolve) { return setTimeout(function () { return resolve(value); }, t); });
    }
    /**
     * Converts a Promise to a callback.
     * @param {Promise<any>} promise The Promise to be converted to a callback
     * @returns {Function} A function that takes the callback (cb: Function): void
     * @deprecated generated code should instead depend on responseToBody
     */
    function promiseToCallback(promise) {
        if (typeof promise.then !== "function") {
            throw new Error("The provided input is not a Promise.");
        }
        return function (cb) {
            promise.then(function (data) {
                cb(undefined, data);
            }, function (err) {
                cb(err);
            });
        };
    }
    /**
     * Converts a Promise to a service callback.
     * @param {Promise<HttpOperationResponse>} promise - The Promise of HttpOperationResponse to be converted to a service callback
     * @returns {Function} A function that takes the service callback (cb: ServiceCallback<T>): void
     */
    function promiseToServiceCallback(promise) {
        if (typeof promise.then !== "function") {
            throw new Error("The provided input is not a Promise.");
        }
        return function (cb) {
            promise.then(function (data) {
                process.nextTick(cb, undefined, data.parsedBody, data.request, data);
            }, function (err) {
                process.nextTick(cb, err);
            });
        };
    }
    function prepareXMLRootList(obj, elementName) {
        var _a;
        if (!Array.isArray(obj)) {
            obj = [obj];
        }
        return _a = {}, _a[elementName] = obj, _a;
    }
    /**
     * Applies the properties on the prototype of sourceCtors to the prototype of targetCtor
     * @param {object} targetCtor The target object on which the properties need to be applied.
     * @param {Array<object>} sourceCtors An array of source objects from which the properties need to be taken.
     */
    function applyMixins(targetCtor, sourceCtors) {
        sourceCtors.forEach(function (sourceCtors) {
            Object.getOwnPropertyNames(sourceCtors.prototype).forEach(function (name) {
                targetCtor.prototype[name] = sourceCtors.prototype[name];
            });
        });
    }
    var validateISODuration = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    /**
     * Indicates whether the given string is in ISO 8601 format.
     * @param {string} value The value to be validated for ISO 8601 duration format.
     * @return {boolean} `true` if valid, `false` otherwise.
     */
    function isDuration(value) {
        return validateISODuration.test(value);
    }
    /**
     * Replace all of the instances of searchValue in value with the provided replaceValue.
     * @param {string | undefined} value The value to search and replace in.
     * @param {string} searchValue The value to search for in the value argument.
     * @param {string} replaceValue The value to replace searchValue with in the value argument.
     * @returns {string | undefined} The value where each instance of searchValue was replaced with replacedValue.
     */
    function replaceAll(value, searchValue, replaceValue) {
        return !value || !searchValue ? value : value.split(searchValue).join(replaceValue || "");
    }
    /**
     * Determines whether the given enity is a basic/primitive type
     * (string, number, boolean, null, undefined).
     * @param value Any entity
     * @return boolean - true is it is primitive type, false otherwise.
     */
    function isPrimitiveType(value) {
        return (typeof value !== "object" && typeof value !== "function") || value === null;
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var Serializer = /** @class */ (function () {
        function Serializer(modelMappers, isXML) {
            if (modelMappers === void 0) { modelMappers = {}; }
            this.modelMappers = modelMappers;
            this.isXML = isXML;
        }
        Serializer.prototype.validateConstraints = function (mapper, value, objectName) {
            var failValidation = function (constraintName, constraintValue) {
                throw new Error("\"" + objectName + "\" with value \"" + value + "\" should satisfy the constraint \"" + constraintName + "\": " + constraintValue + ".");
            };
            if (mapper.constraints && value != undefined) {
                var _a = mapper.constraints, ExclusiveMaximum = _a.ExclusiveMaximum, ExclusiveMinimum = _a.ExclusiveMinimum, InclusiveMaximum = _a.InclusiveMaximum, InclusiveMinimum = _a.InclusiveMinimum, MaxItems = _a.MaxItems, MaxLength = _a.MaxLength, MinItems = _a.MinItems, MinLength = _a.MinLength, MultipleOf = _a.MultipleOf, Pattern = _a.Pattern, UniqueItems = _a.UniqueItems;
                if (ExclusiveMaximum != undefined && value >= ExclusiveMaximum) {
                    failValidation("ExclusiveMaximum", ExclusiveMaximum);
                }
                if (ExclusiveMinimum != undefined && value <= ExclusiveMinimum) {
                    failValidation("ExclusiveMinimum", ExclusiveMinimum);
                }
                if (InclusiveMaximum != undefined && value > InclusiveMaximum) {
                    failValidation("InclusiveMaximum", InclusiveMaximum);
                }
                if (InclusiveMinimum != undefined && value < InclusiveMinimum) {
                    failValidation("InclusiveMinimum", InclusiveMinimum);
                }
                if (MaxItems != undefined && value.length > MaxItems) {
                    failValidation("MaxItems", MaxItems);
                }
                if (MaxLength != undefined && value.length > MaxLength) {
                    failValidation("MaxLength", MaxLength);
                }
                if (MinItems != undefined && value.length < MinItems) {
                    failValidation("MinItems", MinItems);
                }
                if (MinLength != undefined && value.length < MinLength) {
                    failValidation("MinLength", MinLength);
                }
                if (MultipleOf != undefined && value % MultipleOf !== 0) {
                    failValidation("MultipleOf", MultipleOf);
                }
                if (Pattern) {
                    var pattern = typeof Pattern === "string" ? new RegExp(Pattern) : Pattern;
                    if (typeof value !== "string" || value.match(pattern) === null) {
                        failValidation("Pattern", Pattern);
                    }
                }
                if (UniqueItems &&
                    value.some(function (item, i, ar) { return ar.indexOf(item) !== i; })) {
                    failValidation("UniqueItems", UniqueItems);
                }
            }
        };
        /**
         * Serialize the given object based on its metadata defined in the mapper
         *
         * @param {Mapper} mapper The mapper which defines the metadata of the serializable object
         *
         * @param {object|string|Array|number|boolean|Date|stream} object A valid Javascript object to be serialized
         *
         * @param {string} objectName Name of the serialized object
         *
         * @returns {object|string|Array|number|boolean|Date|stream} A valid serialized Javascript object
         */
        Serializer.prototype.serialize = function (mapper, object, objectName) {
            var payload = {};
            var mapperType = mapper.type.name;
            if (!objectName) {
                objectName = mapper.serializedName;
            }
            if (mapperType.match(/^Sequence$/gi) !== null) {
                payload = [];
            }
            if (mapper.isConstant) {
                object = mapper.defaultValue;
            }
            // This table of allowed values should help explain
            // the mapper.required and mapper.nullable properties.
            // X means "neither undefined or null are allowed".
            //           || required
            //           || true      | false
            //  nullable || ==========================
            //      true || null      | undefined/null
            //     false || X         | undefined
            // undefined || X         | undefined/null
            var required = mapper.required, nullable = mapper.nullable;
            if (required && nullable && object === undefined) {
                throw new Error(objectName + " cannot be undefined.");
            }
            if (required && !nullable && object == undefined) {
                throw new Error(objectName + " cannot be null or undefined.");
            }
            if (!required && nullable === false && object === null) {
                throw new Error(objectName + " cannot be null.");
            }
            if (object == undefined) {
                payload = object;
            }
            else {
                // Validate Constraints if any
                this.validateConstraints(mapper, object, objectName);
                if (mapperType.match(/^any$/gi) !== null) {
                    payload = object;
                }
                else if (mapperType.match(/^(Number|String|Boolean|Object|Stream|Uuid)$/gi) !== null) {
                    payload = serializeBasicTypes(mapperType, objectName, object);
                }
                else if (mapperType.match(/^Enum$/gi) !== null) {
                    var enumMapper = mapper;
                    payload = serializeEnumType(objectName, enumMapper.type.allowedValues, object);
                }
                else if (mapperType.match(/^(Date|DateTime|TimeSpan|DateTimeRfc1123|UnixTime)$/gi) !== null) {
                    payload = serializeDateTypes(mapperType, object, objectName);
                }
                else if (mapperType.match(/^ByteArray$/gi) !== null) {
                    payload = serializeByteArrayType(objectName, object);
                }
                else if (mapperType.match(/^Base64Url$/gi) !== null) {
                    payload = serializeBase64UrlType(objectName, object);
                }
                else if (mapperType.match(/^Sequence$/gi) !== null) {
                    payload = serializeSequenceType(this, mapper, object, objectName);
                }
                else if (mapperType.match(/^Dictionary$/gi) !== null) {
                    payload = serializeDictionaryType(this, mapper, object, objectName);
                }
                else if (mapperType.match(/^Composite$/gi) !== null) {
                    payload = serializeCompositeType(this, mapper, object, objectName);
                }
            }
            return payload;
        };
        /**
         * Deserialize the given object based on its metadata defined in the mapper
         *
         * @param {object} mapper The mapper which defines the metadata of the serializable object
         *
         * @param {object|string|Array|number|boolean|Date|stream} responseBody A valid Javascript entity to be deserialized
         *
         * @param {string} objectName Name of the deserialized object
         *
         * @returns {object|string|Array|number|boolean|Date|stream} A valid deserialized Javascript object
         */
        Serializer.prototype.deserialize = function (mapper, responseBody, objectName) {
            if (responseBody == undefined) {
                if (this.isXML && mapper.type.name === "Sequence" && !mapper.xmlIsWrapped) {
                    // Edge case for empty XML non-wrapped lists. xml2js can't distinguish
                    // between the list being empty versus being missing,
                    // so let's do the more user-friendly thing and return an empty list.
                    responseBody = [];
                }
                // specifically check for undefined as default value can be a falsey value `0, "", false, null`
                if (mapper.defaultValue !== undefined) {
                    responseBody = mapper.defaultValue;
                }
                return responseBody;
            }
            var payload;
            var mapperType = mapper.type.name;
            if (!objectName) {
                objectName = mapper.serializedName;
            }
            if (mapperType.match(/^Composite$/gi) !== null) {
                payload = deserializeCompositeType(this, mapper, responseBody, objectName);
            }
            else {
                if (this.isXML) {
                    /**
                     * If the mapper specifies this as a non-composite type value but the responseBody contains
                     * both header ("$") and body ("_") properties, then just reduce the responseBody value to
                     * the body ("_") property.
                     */
                    if (responseBody["$"] != undefined && responseBody["_"] != undefined) {
                        responseBody = responseBody["_"];
                    }
                }
                if (mapperType.match(/^Number$/gi) !== null) {
                    payload = parseFloat(responseBody);
                    if (isNaN(payload)) {
                        payload = responseBody;
                    }
                }
                else if (mapperType.match(/^Boolean$/gi) !== null) {
                    if (responseBody === "true") {
                        payload = true;
                    }
                    else if (responseBody === "false") {
                        payload = false;
                    }
                    else {
                        payload = responseBody;
                    }
                }
                else if (mapperType.match(/^(String|Enum|Object|Stream|Uuid|TimeSpan|any)$/gi) !== null) {
                    payload = responseBody;
                }
                else if (mapperType.match(/^(Date|DateTime|DateTimeRfc1123)$/gi) !== null) {
                    payload = new Date(responseBody);
                }
                else if (mapperType.match(/^UnixTime$/gi) !== null) {
                    payload = unixTimeToDate(responseBody);
                }
                else if (mapperType.match(/^ByteArray$/gi) !== null) {
                    payload = decodeString(responseBody);
                }
                else if (mapperType.match(/^Base64Url$/gi) !== null) {
                    payload = base64UrlToByteArray(responseBody);
                }
                else if (mapperType.match(/^Sequence$/gi) !== null) {
                    payload = deserializeSequenceType(this, mapper, responseBody, objectName);
                }
                else if (mapperType.match(/^Dictionary$/gi) !== null) {
                    payload = deserializeDictionaryType(this, mapper, responseBody, objectName);
                }
            }
            if (mapper.isConstant) {
                payload = mapper.defaultValue;
            }
            return payload;
        };
        return Serializer;
    }());
    function trimEnd(str, ch) {
        var len = str.length;
        while (len - 1 >= 0 && str[len - 1] === ch) {
            --len;
        }
        return str.substr(0, len);
    }
    function bufferToBase64Url(buffer) {
        if (!buffer) {
            return undefined;
        }
        if (!(buffer instanceof Uint8Array)) {
            throw new Error("Please provide an input of type Uint8Array for converting to Base64Url.");
        }
        // Uint8Array to Base64.
        var str = encodeByteArray(buffer);
        // Base64 to Base64Url.
        return trimEnd(str, "=").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function base64UrlToByteArray(str) {
        if (!str) {
            return undefined;
        }
        if (str && typeof str.valueOf() !== "string") {
            throw new Error("Please provide an input of type string for converting to Uint8Array");
        }
        // Base64Url to Base64.
        str = str.replace(/\-/g, "+").replace(/\_/g, "/");
        // Base64 to Uint8Array.
        return decodeString(str);
    }
    function splitSerializeName(prop) {
        var classes = [];
        var partialclass = "";
        if (prop) {
            var subwords = prop.split(".");
            for (var _i = 0, subwords_1 = subwords; _i < subwords_1.length; _i++) {
                var item = subwords_1[_i];
                if (item.charAt(item.length - 1) === "\\") {
                    partialclass += item.substr(0, item.length - 1) + ".";
                }
                else {
                    partialclass += item;
                    classes.push(partialclass);
                    partialclass = "";
                }
            }
        }
        return classes;
    }
    function dateToUnixTime(d) {
        if (!d) {
            return undefined;
        }
        if (typeof d.valueOf() === "string") {
            d = new Date(d);
        }
        return Math.floor(d.getTime() / 1000);
    }
    function unixTimeToDate(n) {
        if (!n) {
            return undefined;
        }
        return new Date(n * 1000);
    }
    function serializeBasicTypes(typeName, objectName, value) {
        if (value !== null && value !== undefined) {
            if (typeName.match(/^Number$/gi) !== null) {
                if (typeof value !== "number") {
                    throw new Error(objectName + " with value " + value + " must be of type number.");
                }
            }
            else if (typeName.match(/^String$/gi) !== null) {
                if (typeof value.valueOf() !== "string") {
                    throw new Error(objectName + " with value \"" + value + "\" must be of type string.");
                }
            }
            else if (typeName.match(/^Uuid$/gi) !== null) {
                if (!(typeof value.valueOf() === "string" && isValidUuid(value))) {
                    throw new Error(objectName + " with value \"" + value + "\" must be of type string and a valid uuid.");
                }
            }
            else if (typeName.match(/^Boolean$/gi) !== null) {
                if (typeof value !== "boolean") {
                    throw new Error(objectName + " with value " + value + " must be of type boolean.");
                }
            }
            else if (typeName.match(/^Stream$/gi) !== null) {
                var objectType = typeof value;
                if (objectType !== "string" &&
                    objectType !== "function" &&
                    !(value instanceof ArrayBuffer) &&
                    !ArrayBuffer.isView(value) &&
                    !(typeof Blob === "function" && value instanceof Blob)) {
                    throw new Error(objectName + " must be a string, Blob, ArrayBuffer, ArrayBufferView, or a function returning NodeJS.ReadableStream.");
                }
            }
        }
        return value;
    }
    function serializeEnumType(objectName, allowedValues, value) {
        if (!allowedValues) {
            throw new Error("Please provide a set of allowedValues to validate " + objectName + " as an Enum Type.");
        }
        var isPresent = allowedValues.some(function (item) {
            if (typeof item.valueOf() === "string") {
                return item.toLowerCase() === value.toLowerCase();
            }
            return item === value;
        });
        if (!isPresent) {
            throw new Error(value + " is not a valid value for " + objectName + ". The valid values are: " + JSON.stringify(allowedValues) + ".");
        }
        return value;
    }
    function serializeByteArrayType(objectName, value) {
        if (value != undefined) {
            if (!(value instanceof Uint8Array)) {
                throw new Error(objectName + " must be of type Uint8Array.");
            }
            value = encodeByteArray(value);
        }
        return value;
    }
    function serializeBase64UrlType(objectName, value) {
        if (value != undefined) {
            if (!(value instanceof Uint8Array)) {
                throw new Error(objectName + " must be of type Uint8Array.");
            }
            value = bufferToBase64Url(value);
        }
        return value;
    }
    function serializeDateTypes(typeName, value, objectName) {
        if (value != undefined) {
            if (typeName.match(/^Date$/gi) !== null) {
                if (!(value instanceof Date ||
                    (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                    throw new Error(objectName + " must be an instanceof Date or a string in ISO8601 format.");
                }
                value =
                    value instanceof Date
                        ? value.toISOString().substring(0, 10)
                        : new Date(value).toISOString().substring(0, 10);
            }
            else if (typeName.match(/^DateTime$/gi) !== null) {
                if (!(value instanceof Date ||
                    (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                    throw new Error(objectName + " must be an instanceof Date or a string in ISO8601 format.");
                }
                value = value instanceof Date ? value.toISOString() : new Date(value).toISOString();
            }
            else if (typeName.match(/^DateTimeRfc1123$/gi) !== null) {
                if (!(value instanceof Date ||
                    (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                    throw new Error(objectName + " must be an instanceof Date or a string in RFC-1123 format.");
                }
                value = value instanceof Date ? value.toUTCString() : new Date(value).toUTCString();
            }
            else if (typeName.match(/^UnixTime$/gi) !== null) {
                if (!(value instanceof Date ||
                    (typeof value.valueOf() === "string" && !isNaN(Date.parse(value))))) {
                    throw new Error(objectName + " must be an instanceof Date or a string in RFC-1123/ISO8601 format " +
                        "for it to be serialized in UnixTime/Epoch format.");
                }
                value = dateToUnixTime(value);
            }
            else if (typeName.match(/^TimeSpan$/gi) !== null) {
                if (!isDuration(value)) {
                    throw new Error(objectName + " must be a string in ISO 8601 format. Instead was \"" + value + "\".");
                }
                value = value;
            }
        }
        return value;
    }
    function serializeSequenceType(serializer, mapper, object, objectName) {
        if (!Array.isArray(object)) {
            throw new Error(objectName + " must be of type Array.");
        }
        var elementType = mapper.type.element;
        if (!elementType || typeof elementType !== "object") {
            throw new Error("element\" metadata for an Array must be defined in the " +
                ("mapper and it must of type \"object\" in " + objectName + "."));
        }
        var tempArray = [];
        for (var i = 0; i < object.length; i++) {
            tempArray[i] = serializer.serialize(elementType, object[i], objectName);
        }
        return tempArray;
    }
    function serializeDictionaryType(serializer, mapper, object, objectName) {
        if (typeof object !== "object") {
            throw new Error(objectName + " must be of type object.");
        }
        var valueType = mapper.type.value;
        if (!valueType || typeof valueType !== "object") {
            throw new Error("\"value\" metadata for a Dictionary must be defined in the " +
                ("mapper and it must of type \"object\" in " + objectName + "."));
        }
        var tempDictionary = {};
        for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
            var key = _a[_i];
            tempDictionary[key] = serializer.serialize(valueType, object[key], objectName + "." + key);
        }
        return tempDictionary;
    }
    /**
     * Resolves a composite mapper's modelProperties.
     * @param serializer the serializer containing the entire set of mappers
     * @param mapper the composite mapper to resolve
     */
    function resolveModelProperties(serializer, mapper, objectName) {
        var modelProps = mapper.type.modelProperties;
        if (!modelProps) {
            var className = mapper.type.className;
            if (!className) {
                throw new Error("Class name for model \"" + objectName + "\" is not provided in the mapper \"" + JSON.stringify(mapper, undefined, 2) + "\".");
            }
            var modelMapper = serializer.modelMappers[className];
            if (!modelMapper) {
                throw new Error("mapper() cannot be null or undefined for model \"" + className + "\".");
            }
            modelProps = modelMapper.type.modelProperties;
            if (!modelProps) {
                throw new Error("modelProperties cannot be null or undefined in the " +
                    ("mapper \"" + JSON.stringify(modelMapper) + "\" of type \"" + className + "\" for object \"" + objectName + "\"."));
            }
        }
        return modelProps;
    }
    function serializeCompositeType(serializer, mapper, object, objectName) {
        var _a;
        if (getPolymorphicDiscriminatorRecursively(serializer, mapper)) {
            mapper = getPolymorphicMapper(serializer, mapper, object, "clientName");
        }
        if (object != undefined) {
            var payload = {};
            var modelProps = resolveModelProperties(serializer, mapper, objectName);
            for (var _i = 0, _b = Object.keys(modelProps); _i < _b.length; _i++) {
                var key = _b[_i];
                var propertyMapper = modelProps[key];
                if (propertyMapper.readOnly) {
                    continue;
                }
                var propName = void 0;
                var parentObject = payload;
                if (serializer.isXML) {
                    if (propertyMapper.xmlIsWrapped) {
                        propName = propertyMapper.xmlName;
                    }
                    else {
                        propName = propertyMapper.xmlElementName || propertyMapper.xmlName;
                    }
                }
                else {
                    var paths = splitSerializeName(propertyMapper.serializedName);
                    propName = paths.pop();
                    for (var _c = 0, paths_1 = paths; _c < paths_1.length; _c++) {
                        var pathName = paths_1[_c];
                        var childObject = parentObject[pathName];
                        if (childObject == undefined && object[key] != undefined) {
                            parentObject[pathName] = {};
                        }
                        parentObject = parentObject[pathName];
                    }
                }
                if (parentObject != undefined) {
                    var propertyObjectName = propertyMapper.serializedName !== ""
                        ? objectName + "." + propertyMapper.serializedName
                        : objectName;
                    var toSerialize = object[key];
                    var polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer, mapper);
                    if (polymorphicDiscriminator &&
                        polymorphicDiscriminator.clientName === key &&
                        toSerialize == undefined) {
                        toSerialize = mapper.serializedName;
                    }
                    var serializedValue = serializer.serialize(propertyMapper, toSerialize, propertyObjectName);
                    if (serializedValue !== undefined && propName != undefined) {
                        if (propertyMapper.xmlIsAttribute) {
                            // $ is the key attributes are kept under in xml2js.
                            // This keeps things simple while preventing name collision
                            // with names in user documents.
                            parentObject.$ = parentObject.$ || {};
                            parentObject.$[propName] = serializedValue;
                        }
                        else if (propertyMapper.xmlIsWrapped) {
                            parentObject[propName] = (_a = {}, _a[propertyMapper.xmlElementName] = serializedValue, _a);
                        }
                        else {
                            parentObject[propName] = serializedValue;
                        }
                    }
                }
            }
            var additionalPropertiesMapper = mapper.type.additionalProperties;
            if (additionalPropertiesMapper) {
                var propNames = Object.keys(modelProps);
                var _loop_1 = function (clientPropName) {
                    var isAdditionalProperty = propNames.every(function (pn) { return pn !== clientPropName; });
                    if (isAdditionalProperty) {
                        payload[clientPropName] = serializer.serialize(additionalPropertiesMapper, object[clientPropName], objectName + '["' + clientPropName + '"]');
                    }
                };
                for (var clientPropName in object) {
                    _loop_1(clientPropName);
                }
            }
            return payload;
        }
        return object;
    }
    function isSpecialXmlProperty(propertyName) {
        return ["$", "_"].includes(propertyName);
    }
    function deserializeCompositeType(serializer, mapper, responseBody, objectName) {
        if (getPolymorphicDiscriminatorRecursively(serializer, mapper)) {
            mapper = getPolymorphicMapper(serializer, mapper, responseBody, "serializedName");
        }
        var modelProps = resolveModelProperties(serializer, mapper, objectName);
        var instance = {};
        var handledPropertyNames = [];
        for (var _i = 0, _a = Object.keys(modelProps); _i < _a.length; _i++) {
            var key = _a[_i];
            var propertyMapper = modelProps[key];
            var paths = splitSerializeName(modelProps[key].serializedName);
            handledPropertyNames.push(paths[0]);
            var serializedName = propertyMapper.serializedName, xmlName = propertyMapper.xmlName, xmlElementName = propertyMapper.xmlElementName;
            var propertyObjectName = objectName;
            if (serializedName !== "" && serializedName !== undefined) {
                propertyObjectName = objectName + "." + serializedName;
            }
            var headerCollectionPrefix = propertyMapper.headerCollectionPrefix;
            if (headerCollectionPrefix) {
                var dictionary = {};
                for (var _b = 0, _c = Object.keys(responseBody); _b < _c.length; _b++) {
                    var headerKey = _c[_b];
                    if (headerKey.startsWith(headerCollectionPrefix)) {
                        dictionary[headerKey.substring(headerCollectionPrefix.length)] = serializer.deserialize(propertyMapper.type.value, responseBody[headerKey], propertyObjectName);
                    }
                    handledPropertyNames.push(headerKey);
                }
                instance[key] = dictionary;
            }
            else if (serializer.isXML) {
                if (propertyMapper.xmlIsAttribute && responseBody.$) {
                    instance[key] = serializer.deserialize(propertyMapper, responseBody.$[xmlName], propertyObjectName);
                }
                else {
                    var propertyName = xmlElementName || xmlName || serializedName;
                    var unwrappedProperty = responseBody[propertyName];
                    if (propertyMapper.xmlIsWrapped) {
                        unwrappedProperty = responseBody[xmlName];
                        unwrappedProperty = unwrappedProperty && unwrappedProperty[xmlElementName];
                        var isEmptyWrappedList = unwrappedProperty === undefined;
                        if (isEmptyWrappedList) {
                            unwrappedProperty = [];
                        }
                    }
                    instance[key] = serializer.deserialize(propertyMapper, unwrappedProperty, propertyObjectName);
                }
            }
            else {
                // deserialize the property if it is present in the provided responseBody instance
                var propertyInstance = void 0;
                var res = responseBody;
                // traversing the object step by step.
                for (var _d = 0, paths_2 = paths; _d < paths_2.length; _d++) {
                    var item = paths_2[_d];
                    if (!res)
                        break;
                    res = res[item];
                }
                propertyInstance = res;
                var polymorphicDiscriminator = mapper.type.polymorphicDiscriminator;
                // checking that the model property name (key)(ex: "fishtype") and the
                // clientName of the polymorphicDiscriminator {metadata} (ex: "fishtype")
                // instead of the serializedName of the polymorphicDiscriminator (ex: "fish.type")
                // is a better approach. The generator is not consistent with escaping '\.' in the
                // serializedName of the property (ex: "fish\.type") that is marked as polymorphic discriminator
                // and the serializedName of the metadata polymorphicDiscriminator (ex: "fish.type"). However,
                // the clientName transformation of the polymorphicDiscriminator (ex: "fishtype") and
                // the transformation of model property name (ex: "fishtype") is done consistently.
                // Hence, it is a safer bet to rely on the clientName of the polymorphicDiscriminator.
                if (polymorphicDiscriminator &&
                    key === polymorphicDiscriminator.clientName &&
                    propertyInstance == undefined) {
                    propertyInstance = mapper.serializedName;
                }
                var serializedValue = void 0;
                // paging
                if (Array.isArray(responseBody[key]) && modelProps[key].serializedName === "") {
                    propertyInstance = responseBody[key];
                    instance = serializer.deserialize(propertyMapper, propertyInstance, propertyObjectName);
                }
                else if (propertyInstance !== undefined || propertyMapper.defaultValue !== undefined) {
                    serializedValue = serializer.deserialize(propertyMapper, propertyInstance, propertyObjectName);
                    instance[key] = serializedValue;
                }
            }
        }
        var additionalPropertiesMapper = mapper.type.additionalProperties;
        if (additionalPropertiesMapper) {
            var isAdditionalProperty = function (responsePropName) {
                for (var clientPropName in modelProps) {
                    var paths = splitSerializeName(modelProps[clientPropName].serializedName);
                    if (paths[0] === responsePropName) {
                        return false;
                    }
                }
                return true;
            };
            for (var responsePropName in responseBody) {
                if (isAdditionalProperty(responsePropName)) {
                    instance[responsePropName] = serializer.deserialize(additionalPropertiesMapper, responseBody[responsePropName], objectName + '["' + responsePropName + '"]');
                }
            }
        }
        else if (responseBody) {
            for (var _e = 0, _f = Object.keys(responseBody); _e < _f.length; _e++) {
                var key = _f[_e];
                if (instance[key] === undefined &&
                    !handledPropertyNames.includes(key) &&
                    !isSpecialXmlProperty(key)) {
                    instance[key] = responseBody[key];
                }
            }
        }
        return instance;
    }
    function deserializeDictionaryType(serializer, mapper, responseBody, objectName) {
        /*jshint validthis: true */
        var value = mapper.type.value;
        if (!value || typeof value !== "object") {
            throw new Error("\"value\" metadata for a Dictionary must be defined in the " +
                ("mapper and it must of type \"object\" in " + objectName));
        }
        if (responseBody) {
            var tempDictionary = {};
            for (var _i = 0, _a = Object.keys(responseBody); _i < _a.length; _i++) {
                var key = _a[_i];
                tempDictionary[key] = serializer.deserialize(value, responseBody[key], objectName);
            }
            return tempDictionary;
        }
        return responseBody;
    }
    function deserializeSequenceType(serializer, mapper, responseBody, objectName) {
        /*jshint validthis: true */
        var element = mapper.type.element;
        if (!element || typeof element !== "object") {
            throw new Error("element\" metadata for an Array must be defined in the " +
                ("mapper and it must of type \"object\" in " + objectName));
        }
        if (responseBody) {
            if (!Array.isArray(responseBody)) {
                // xml2js will interpret a single element array as just the element, so force it to be an array
                responseBody = [responseBody];
            }
            var tempArray = [];
            for (var i = 0; i < responseBody.length; i++) {
                tempArray[i] = serializer.deserialize(element, responseBody[i], objectName + "[" + i + "]");
            }
            return tempArray;
        }
        return responseBody;
    }
    function getPolymorphicMapper(serializer, mapper, object, polymorphicPropertyName) {
        var polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer, mapper);
        if (polymorphicDiscriminator) {
            var discriminatorName = polymorphicDiscriminator[polymorphicPropertyName];
            if (discriminatorName != undefined) {
                var discriminatorValue = object[discriminatorName];
                if (discriminatorValue != undefined) {
                    var typeName = mapper.type.uberParent || mapper.type.className;
                    var indexDiscriminator = discriminatorValue === typeName
                        ? discriminatorValue
                        : typeName + "." + discriminatorValue;
                    var polymorphicMapper = serializer.modelMappers.discriminators[indexDiscriminator];
                    if (polymorphicMapper) {
                        mapper = polymorphicMapper;
                    }
                }
            }
        }
        return mapper;
    }
    function getPolymorphicDiscriminatorRecursively(serializer, mapper) {
        return (mapper.type.polymorphicDiscriminator ||
            getPolymorphicDiscriminatorSafely(serializer, mapper.type.uberParent) ||
            getPolymorphicDiscriminatorSafely(serializer, mapper.type.className));
    }
    function getPolymorphicDiscriminatorSafely(serializer, typeName) {
        return (typeName &&
            serializer.modelMappers[typeName] &&
            serializer.modelMappers[typeName].type.polymorphicDiscriminator);
    }
    // TODO: why is this here?
    function serializeObject(toSerialize) {
        if (toSerialize == undefined)
            return undefined;
        if (toSerialize instanceof Uint8Array) {
            toSerialize = encodeByteArray(toSerialize);
            return toSerialize;
        }
        else if (toSerialize instanceof Date) {
            return toSerialize.toISOString();
        }
        else if (Array.isArray(toSerialize)) {
            var array = [];
            for (var i = 0; i < toSerialize.length; i++) {
                array.push(serializeObject(toSerialize[i]));
            }
            return array;
        }
        else if (typeof toSerialize === "object") {
            var dictionary = {};
            for (var property in toSerialize) {
                dictionary[property] = serializeObject(toSerialize[property]);
            }
            return dictionary;
        }
        return toSerialize;
    }
    /**
     * Utility function to create a K:V from a list of strings
     */
    function strEnum(o) {
        var result = {};
        for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
            var key = o_1[_i];
            result[key] = key;
        }
        return result;
    }
    var MapperType = strEnum([
        "Base64Url",
        "Boolean",
        "ByteArray",
        "Composite",
        "Date",
        "DateTime",
        "DateTimeRfc1123",
        "Dictionary",
        "Enum",
        "Number",
        "Object",
        "Sequence",
        "String",
        "Stream",
        "TimeSpan",
        "UnixTime",
    ]);

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function isWebResourceLike(object) {
        if (typeof object !== "object") {
            return false;
        }
        if (typeof object.url === "string" &&
            typeof object.method === "string" &&
            typeof object.headers === "object" &&
            isHttpHeadersLike(object.headers) &&
            typeof object.validateRequestProperties === "function" &&
            typeof object.prepare === "function" &&
            typeof object.clone === "function") {
            return true;
        }
        return false;
    }
    /**
     * Creates a new WebResource object.
     *
     * This class provides an abstraction over a REST call by being library / implementation agnostic and wrapping the necessary
     * properties to initiate a request.
     *
     * @constructor
     */
    var WebResource = /** @class */ (function () {
        function WebResource(url, method, body, query, headers, streamResponseBody, withCredentials, abortSignal, timeout, onUploadProgress, onDownloadProgress, proxySettings, keepAlive, agentSettings) {
            this.streamResponseBody = streamResponseBody;
            this.url = url || "";
            this.method = method || "GET";
            this.headers = isHttpHeadersLike(headers) ? headers : new HttpHeaders(headers);
            this.body = body;
            this.query = query;
            this.formData = undefined;
            this.withCredentials = withCredentials || false;
            this.abortSignal = abortSignal;
            this.timeout = timeout || 0;
            this.onUploadProgress = onUploadProgress;
            this.onDownloadProgress = onDownloadProgress;
            this.proxySettings = proxySettings;
            this.keepAlive = keepAlive;
            this.agentSettings = agentSettings;
        }
        /**
         * Validates that the required properties such as method, url, headers["Content-Type"],
         * headers["accept-language"] are defined. It will throw an error if one of the above
         * mentioned properties are not defined.
         */
        WebResource.prototype.validateRequestProperties = function () {
            if (!this.method) {
                throw new Error("WebResource.method is required.");
            }
            if (!this.url) {
                throw new Error("WebResource.url is required.");
            }
        };
        /**
         * Prepares the request.
         * @param {RequestPrepareOptions} options Options to provide for preparing the request.
         * @returns {WebResource} Returns the prepared WebResource (HTTP Request) object that needs to be given to the request pipeline.
         */
        WebResource.prototype.prepare = function (options) {
            if (!options) {
                throw new Error("options object is required");
            }
            if (options.method == undefined || typeof options.method.valueOf() !== "string") {
                throw new Error("options.method must be a string.");
            }
            if (options.url && options.pathTemplate) {
                throw new Error("options.url and options.pathTemplate are mutually exclusive. Please provide exactly one of them.");
            }
            if ((options.pathTemplate == undefined || typeof options.pathTemplate.valueOf() !== "string") &&
                (options.url == undefined || typeof options.url.valueOf() !== "string")) {
                throw new Error("Please provide exactly one of options.pathTemplate or options.url.");
            }
            // set the url if it is provided.
            if (options.url) {
                if (typeof options.url !== "string") {
                    throw new Error('options.url must be of type "string".');
                }
                this.url = options.url;
            }
            // set the method
            if (options.method) {
                var validMethods = ["GET", "PUT", "HEAD", "DELETE", "OPTIONS", "POST", "PATCH", "TRACE"];
                if (validMethods.indexOf(options.method.toUpperCase()) === -1) {
                    throw new Error('The provided method "' +
                        options.method +
                        '" is invalid. Supported HTTP methods are: ' +
                        JSON.stringify(validMethods));
                }
            }
            this.method = options.method.toUpperCase();
            // construct the url if path template is provided
            if (options.pathTemplate) {
                var pathTemplate_1 = options.pathTemplate, pathParameters_1 = options.pathParameters;
                if (typeof pathTemplate_1 !== "string") {
                    throw new Error('options.pathTemplate must be of type "string".');
                }
                if (!options.baseUrl) {
                    options.baseUrl = "https://management.azure.com";
                }
                var baseUrl = options.baseUrl;
                var url_1 = baseUrl +
                    (baseUrl.endsWith("/") ? "" : "/") +
                    (pathTemplate_1.startsWith("/") ? pathTemplate_1.slice(1) : pathTemplate_1);
                var segments = url_1.match(/({\w*\s*\w*})/gi);
                if (segments && segments.length) {
                    if (!pathParameters_1) {
                        throw new Error("pathTemplate: " + pathTemplate_1 + " has been provided. Hence, options.pathParameters must also be provided.");
                    }
                    segments.forEach(function (item) {
                        var pathParamName = item.slice(1, -1);
                        var pathParam = pathParameters_1[pathParamName];
                        if (pathParam === null ||
                            pathParam === undefined ||
                            !(typeof pathParam === "string" || typeof pathParam === "object")) {
                            throw new Error("pathTemplate: " + pathTemplate_1 + " contains the path parameter " + pathParamName +
                                (" however, it is not present in " + pathParameters_1 + " - " + JSON.stringify(pathParameters_1, undefined, 2) + ".") +
                                ("The value of the path parameter can either be a \"string\" of the form { " + pathParamName + ": \"some sample value\" } or ") +
                                ("it can be an \"object\" of the form { \"" + pathParamName + "\": { value: \"some sample value\", skipUrlEncoding: true } }."));
                        }
                        if (typeof pathParam.valueOf() === "string") {
                            url_1 = url_1.replace(item, encodeURIComponent(pathParam));
                        }
                        if (typeof pathParam.valueOf() === "object") {
                            if (!pathParam.value) {
                                throw new Error("options.pathParameters[" + pathParamName + "] is of type \"object\" but it does not contain a \"value\" property.");
                            }
                            if (pathParam.skipUrlEncoding) {
                                url_1 = url_1.replace(item, pathParam.value);
                            }
                            else {
                                url_1 = url_1.replace(item, encodeURIComponent(pathParam.value));
                            }
                        }
                    });
                }
                this.url = url_1;
            }
            // append query parameters to the url if they are provided. They can be provided with pathTemplate or url option.
            if (options.queryParameters) {
                var queryParameters = options.queryParameters;
                if (typeof queryParameters !== "object") {
                    throw new Error("options.queryParameters must be of type object. It should be a JSON object " +
                        "of \"query-parameter-name\" as the key and the \"query-parameter-value\" as the value. " +
                        "The \"query-parameter-value\" may be fo type \"string\" or an \"object\" of the form { value: \"query-parameter-value\", skipUrlEncoding: true }.");
                }
                // append question mark if it is not present in the url
                if (this.url && this.url.indexOf("?") === -1) {
                    this.url += "?";
                }
                // construct queryString
                var queryParams = [];
                // We need to populate this.query as a dictionary if the request is being used for Sway's validateRequest().
                this.query = {};
                for (var queryParamName in queryParameters) {
                    var queryParam = queryParameters[queryParamName];
                    if (queryParam) {
                        if (typeof queryParam === "string") {
                            queryParams.push(queryParamName + "=" + encodeURIComponent(queryParam));
                            this.query[queryParamName] = encodeURIComponent(queryParam);
                        }
                        else if (typeof queryParam === "object") {
                            if (!queryParam.value) {
                                throw new Error("options.queryParameters[" + queryParamName + "] is of type \"object\" but it does not contain a \"value\" property.");
                            }
                            if (queryParam.skipUrlEncoding) {
                                queryParams.push(queryParamName + "=" + queryParam.value);
                                this.query[queryParamName] = queryParam.value;
                            }
                            else {
                                queryParams.push(queryParamName + "=" + encodeURIComponent(queryParam.value));
                                this.query[queryParamName] = encodeURIComponent(queryParam.value);
                            }
                        }
                    }
                } // end-of-for
                // append the queryString
                this.url += queryParams.join("&");
            }
            // add headers to the request if they are provided
            if (options.headers) {
                var headers = options.headers;
                for (var _i = 0, _a = Object.keys(options.headers); _i < _a.length; _i++) {
                    var headerName = _a[_i];
                    this.headers.set(headerName, headers[headerName]);
                }
            }
            // ensure accept-language is set correctly
            if (!this.headers.get("accept-language")) {
                this.headers.set("accept-language", "en-US");
            }
            // ensure the request-id is set correctly
            if (!this.headers.get("x-ms-client-request-id") && !options.disableClientRequestId) {
                this.headers.set("x-ms-client-request-id", generateUuid());
            }
            // default
            if (!this.headers.get("Content-Type")) {
                this.headers.set("Content-Type", "application/json; charset=utf-8");
            }
            // set the request body. request.js automatically sets the Content-Length request header, so we need not set it explicilty
            this.body = options.body;
            if (options.body != undefined) {
                // body as a stream special case. set the body as-is and check for some special request headers specific to sending a stream.
                if (options.bodyIsStream) {
                    if (!this.headers.get("Transfer-Encoding")) {
                        this.headers.set("Transfer-Encoding", "chunked");
                    }
                    if (this.headers.get("Content-Type") !== "application/octet-stream") {
                        this.headers.set("Content-Type", "application/octet-stream");
                    }
                }
                else {
                    if (options.serializationMapper) {
                        this.body = new Serializer(options.mappers).serialize(options.serializationMapper, options.body, "requestBody");
                    }
                    if (!options.disableJsonStringifyOnBody) {
                        this.body = JSON.stringify(options.body);
                    }
                }
            }
            this.abortSignal = options.abortSignal;
            this.onDownloadProgress = options.onDownloadProgress;
            this.onUploadProgress = options.onUploadProgress;
            this.streamResponseBody = options.streamResponseBody;
            return this;
        };
        /**
         * Clone this WebResource HTTP request object.
         * @returns {WebResource} The clone of this WebResource HTTP request object.
         */
        WebResource.prototype.clone = function () {
            var result = new WebResource(this.url, this.method, this.body, this.query, this.headers && this.headers.clone(), this.streamResponseBody, this.withCredentials, this.abortSignal, this.timeout, this.onUploadProgress, this.onDownloadProgress, this.proxySettings, this.keepAlive, this.agentSettings);
            if (this.formData) {
                result.formData = this.formData;
            }
            if (this.operationSpec) {
                result.operationSpec = this.operationSpec;
            }
            if (this.shouldDeserialize) {
                result.shouldDeserialize = this.shouldDeserialize;
            }
            if (this.operationResponseGetter) {
                result.operationResponseGetter = this.operationResponseGetter;
            }
            return result;
        };
        return WebResource;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var RestError = /** @class */ (function (_super) {
        __extends(RestError, _super);
        function RestError(message, code, statusCode, request, response, body) {
            var _this = _super.call(this, message) || this;
            _this.code = code;
            _this.statusCode = statusCode;
            _this.request = request;
            _this.response = response;
            _this.body = body;
            Object.setPrototypeOf(_this, RestError.prototype);
            return _this;
        }
        RestError.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
        RestError.REQUEST_ABORTED_ERROR = "REQUEST_ABORTED_ERROR";
        RestError.PARSE_ERROR = "PARSE_ERROR";
        return RestError;
    }(Error));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * A HttpClient implementation that uses XMLHttpRequest to send HTTP requests.
     */
    var XhrHttpClient = /** @class */ (function () {
        function XhrHttpClient() {
        }
        XhrHttpClient.prototype.sendRequest = function (request) {
            var xhr = new XMLHttpRequest();
            if (request.agentSettings) {
                throw new Error("HTTP agent settings not supported in browser environment");
            }
            if (request.proxySettings) {
                throw new Error("HTTP proxy is not supported in browser environment");
            }
            var abortSignal = request.abortSignal;
            if (abortSignal) {
                var listener_1 = function () {
                    xhr.abort();
                };
                abortSignal.addEventListener("abort", listener_1);
                xhr.addEventListener("readystatechange", function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        abortSignal.removeEventListener("abort", listener_1);
                    }
                });
            }
            addProgressListener(xhr.upload, request.onUploadProgress);
            addProgressListener(xhr, request.onDownloadProgress);
            if (request.formData) {
                var formData = request.formData;
                var requestForm_1 = new FormData();
                var appendFormValue = function (key, value) {
                    if (value && value.hasOwnProperty("value") && value.hasOwnProperty("options")) {
                        requestForm_1.append(key, value.value, value.options);
                    }
                    else {
                        requestForm_1.append(key, value);
                    }
                };
                for (var _i = 0, _a = Object.keys(formData); _i < _a.length; _i++) {
                    var formKey = _a[_i];
                    var formValue = formData[formKey];
                    if (Array.isArray(formValue)) {
                        for (var j = 0; j < formValue.length; j++) {
                            appendFormValue(formKey, formValue[j]);
                        }
                    }
                    else {
                        appendFormValue(formKey, formValue);
                    }
                }
                request.body = requestForm_1;
                request.formData = undefined;
                var contentType = request.headers.get("Content-Type");
                if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
                    // browser will automatically apply a suitable content-type header
                    request.headers.remove("Content-Type");
                }
            }
            xhr.open(request.method, request.url);
            xhr.timeout = request.timeout;
            xhr.withCredentials = request.withCredentials;
            for (var _b = 0, _c = request.headers.headersArray(); _b < _c.length; _b++) {
                var header = _c[_b];
                xhr.setRequestHeader(header.name, header.value);
            }
            xhr.responseType = request.streamResponseBody ? "blob" : "text";
            // tslint:disable-next-line:no-null-keyword
            xhr.send(request.body === undefined ? null : request.body);
            if (request.streamResponseBody) {
                return new Promise(function (resolve, reject) {
                    xhr.addEventListener("readystatechange", function () {
                        // Resolve as soon as headers are loaded
                        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                            var blobBody = new Promise(function (resolve, reject) {
                                xhr.addEventListener("load", function () {
                                    resolve(xhr.response);
                                });
                                rejectOnTerminalEvent(request, xhr, reject);
                            });
                            resolve({
                                request: request,
                                status: xhr.status,
                                headers: parseHeaders(xhr),
                                blobBody: blobBody,
                            });
                        }
                    });
                    rejectOnTerminalEvent(request, xhr, reject);
                });
            }
            else {
                return new Promise(function (resolve, reject) {
                    xhr.addEventListener("load", function () {
                        return resolve({
                            request: request,
                            status: xhr.status,
                            headers: parseHeaders(xhr),
                            bodyAsText: xhr.responseText,
                        });
                    });
                    rejectOnTerminalEvent(request, xhr, reject);
                });
            }
        };
        return XhrHttpClient;
    }());
    function addProgressListener(xhr, listener) {
        if (listener) {
            xhr.addEventListener("progress", function (rawEvent) {
                return listener({
                    loadedBytes: rawEvent.loaded,
                });
            });
        }
    }
    // exported locally for testing
    function parseHeaders(xhr) {
        var responseHeaders = new HttpHeaders();
        var headerLines = xhr
            .getAllResponseHeaders()
            .trim()
            .split(/[\r\n]+/);
        for (var _i = 0, headerLines_1 = headerLines; _i < headerLines_1.length; _i++) {
            var line = headerLines_1[_i];
            var index = line.indexOf(":");
            var headerName = line.slice(0, index);
            var headerValue = line.slice(index + 2);
            responseHeaders.set(headerName, headerValue);
        }
        return responseHeaders;
    }
    function rejectOnTerminalEvent(request, xhr, reject) {
        xhr.addEventListener("error", function () {
            return reject(new RestError("Failed to send request to " + request.url, RestError.REQUEST_SEND_ERROR, undefined, request));
        });
        xhr.addEventListener("abort", function () {
            return reject(new RestError("The request was aborted", RestError.REQUEST_ABORTED_ERROR, undefined, request));
        });
        xhr.addEventListener("timeout", function () {
            return reject(new RestError("timeout of " + xhr.timeout + "ms exceeded", RestError.REQUEST_SEND_ERROR, undefined, request));
        });
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    (function (HttpPipelineLogLevel) {
        /**
         * A log level that indicates that no logs will be logged.
         */
        HttpPipelineLogLevel[HttpPipelineLogLevel["OFF"] = 0] = "OFF";
        /**
         * An error log.
         */
        HttpPipelineLogLevel[HttpPipelineLogLevel["ERROR"] = 1] = "ERROR";
        /**
         * A warning log.
         */
        HttpPipelineLogLevel[HttpPipelineLogLevel["WARNING"] = 2] = "WARNING";
        /**
         * An information log.
         */
        HttpPipelineLogLevel[HttpPipelineLogLevel["INFO"] = 3] = "INFO";
    })(exports.HttpPipelineLogLevel || (exports.HttpPipelineLogLevel = {}));

    // Copyright (c) Microsoft Corporation.
    // Licensed under the MIT license.
    /**
     * Tests an object to determine whether it implements TokenCredential.
     *
     * @param credential - The assumed TokenCredential to be tested.
     */
    function isTokenCredential(credential) {
        // Check for an object with a 'getToken' function and possibly with
        // a 'signRequest' function.  We do this check to make sure that
        // a ServiceClientCredentials implementor (like TokenClientCredentials
        // in ms-rest-nodeauth) doesn't get mistaken for a TokenCredential if
        // it doesn't actually implement TokenCredential also.
        var castCredential = credential;
        return (castCredential &&
            typeof castCredential.getToken === "function" &&
            (castCredential.signRequest === undefined || castCredential.getToken.length > 0));
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    /**
     * Get the path to this parameter's value as a dotted string (a.b.c).
     * @param parameter The parameter to get the path string for.
     * @returns The path to this parameter's value as a dotted string.
     */
    function getPathStringFromParameter(parameter) {
        return getPathStringFromParameterPath(parameter.parameterPath, parameter.mapper);
    }
    function getPathStringFromParameterPath(parameterPath, mapper) {
        var result;
        if (typeof parameterPath === "string") {
            result = parameterPath;
        }
        else if (Array.isArray(parameterPath)) {
            result = parameterPath.join(".");
        }
        else {
            result = mapper.serializedName;
        }
        return result;
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function isStreamOperation(operationSpec) {
        var result = false;
        for (var statusCode in operationSpec.responses) {
            var operationResponse = operationSpec.responses[statusCode];
            if (operationResponse.bodyMapper &&
                operationResponse.bodyMapper.type.name === MapperType.Stream) {
                result = true;
                break;
            }
        }
        return result;
    }

    var entityMap = {
           lt: '<',
           gt: '>',
           amp: '&',
           quot: '"',
           apos: "'",
           Agrave: "À",
           Aacute: "Á",
           Acirc: "Â",
           Atilde: "Ã",
           Auml: "Ä",
           Aring: "Å",
           AElig: "Æ",
           Ccedil: "Ç",
           Egrave: "È",
           Eacute: "É",
           Ecirc: "Ê",
           Euml: "Ë",
           Igrave: "Ì",
           Iacute: "Í",
           Icirc: "Î",
           Iuml: "Ï",
           ETH: "Ð",
           Ntilde: "Ñ",
           Ograve: "Ò",
           Oacute: "Ó",
           Ocirc: "Ô",
           Otilde: "Õ",
           Ouml: "Ö",
           Oslash: "Ø",
           Ugrave: "Ù",
           Uacute: "Ú",
           Ucirc: "Û",
           Uuml: "Ü",
           Yacute: "Ý",
           THORN: "Þ",
           szlig: "ß",
           agrave: "à",
           aacute: "á",
           acirc: "â",
           atilde: "ã",
           auml: "ä",
           aring: "å",
           aelig: "æ",
           ccedil: "ç",
           egrave: "è",
           eacute: "é",
           ecirc: "ê",
           euml: "ë",
           igrave: "ì",
           iacute: "í",
           icirc: "î",
           iuml: "ï",
           eth: "ð",
           ntilde: "ñ",
           ograve: "ò",
           oacute: "ó",
           ocirc: "ô",
           otilde: "õ",
           ouml: "ö",
           oslash: "ø",
           ugrave: "ù",
           uacute: "ú",
           ucirc: "û",
           uuml: "ü",
           yacute: "ý",
           thorn: "þ",
           yuml: "ÿ",
           nbsp: "\u00a0",
           iexcl: "¡",
           cent: "¢",
           pound: "£",
           curren: "¤",
           yen: "¥",
           brvbar: "¦",
           sect: "§",
           uml: "¨",
           copy: "©",
           ordf: "ª",
           laquo: "«",
           not: "¬",
           shy: "­­",
           reg: "®",
           macr: "¯",
           deg: "°",
           plusmn: "±",
           sup2: "²",
           sup3: "³",
           acute: "´",
           micro: "µ",
           para: "¶",
           middot: "·",
           cedil: "¸",
           sup1: "¹",
           ordm: "º",
           raquo: "»",
           frac14: "¼",
           frac12: "½",
           frac34: "¾",
           iquest: "¿",
           times: "×",
           divide: "÷",
           forall: "∀",
           part: "∂",
           exist: "∃",
           empty: "∅",
           nabla: "∇",
           isin: "∈",
           notin: "∉",
           ni: "∋",
           prod: "∏",
           sum: "∑",
           minus: "−",
           lowast: "∗",
           radic: "√",
           prop: "∝",
           infin: "∞",
           ang: "∠",
           and: "∧",
           or: "∨",
           cap: "∩",
           cup: "∪",
           'int': "∫",
           there4: "∴",
           sim: "∼",
           cong: "≅",
           asymp: "≈",
           ne: "≠",
           equiv: "≡",
           le: "≤",
           ge: "≥",
           sub: "⊂",
           sup: "⊃",
           nsub: "⊄",
           sube: "⊆",
           supe: "⊇",
           oplus: "⊕",
           otimes: "⊗",
           perp: "⊥",
           sdot: "⋅",
           Alpha: "Α",
           Beta: "Β",
           Gamma: "Γ",
           Delta: "Δ",
           Epsilon: "Ε",
           Zeta: "Ζ",
           Eta: "Η",
           Theta: "Θ",
           Iota: "Ι",
           Kappa: "Κ",
           Lambda: "Λ",
           Mu: "Μ",
           Nu: "Ν",
           Xi: "Ξ",
           Omicron: "Ο",
           Pi: "Π",
           Rho: "Ρ",
           Sigma: "Σ",
           Tau: "Τ",
           Upsilon: "Υ",
           Phi: "Φ",
           Chi: "Χ",
           Psi: "Ψ",
           Omega: "Ω",
           alpha: "α",
           beta: "β",
           gamma: "γ",
           delta: "δ",
           epsilon: "ε",
           zeta: "ζ",
           eta: "η",
           theta: "θ",
           iota: "ι",
           kappa: "κ",
           lambda: "λ",
           mu: "μ",
           nu: "ν",
           xi: "ξ",
           omicron: "ο",
           pi: "π",
           rho: "ρ",
           sigmaf: "ς",
           sigma: "σ",
           tau: "τ",
           upsilon: "υ",
           phi: "φ",
           chi: "χ",
           psi: "ψ",
           omega: "ω",
           thetasym: "ϑ",
           upsih: "ϒ",
           piv: "ϖ",
           OElig: "Œ",
           oelig: "œ",
           Scaron: "Š",
           scaron: "š",
           Yuml: "Ÿ",
           fnof: "ƒ",
           circ: "ˆ",
           tilde: "˜",
           ensp: " ",
           emsp: " ",
           thinsp: " ",
           zwnj: "‌",
           zwj: "‍",
           lrm: "‎",
           rlm: "‏",
           ndash: "–",
           mdash: "—",
           lsquo: "‘",
           rsquo: "’",
           sbquo: "‚",
           ldquo: "“",
           rdquo: "”",
           bdquo: "„",
           dagger: "†",
           Dagger: "‡",
           bull: "•",
           hellip: "…",
           permil: "‰",
           prime: "′",
           Prime: "″",
           lsaquo: "‹",
           rsaquo: "›",
           oline: "‾",
           euro: "€",
           trade: "™",
           larr: "←",
           uarr: "↑",
           rarr: "→",
           darr: "↓",
           harr: "↔",
           crarr: "↵",
           lceil: "⌈",
           rceil: "⌉",
           lfloor: "⌊",
           rfloor: "⌋",
           loz: "◊",
           spades: "♠",
           clubs: "♣",
           hearts: "♥",
           diams: "♦"
    };

    var entities = {
    	entityMap: entityMap
    };

    //[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
    //[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
    //[5]   	Name	   ::=   	NameStartChar (NameChar)*
    var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;//\u10000-\uEFFFF
    var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
    var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
    //var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
    //var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

    //S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
    //S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
    var S_TAG = 0;//tag name offerring
    var S_ATTR = 1;//attr name offerring 
    var S_ATTR_SPACE=2;//attr name end and space offer
    var S_EQ = 3;//=space?
    var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
    var S_ATTR_END = 5;//attr value end and no space(quot end)
    var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
    var S_TAG_CLOSE = 7;//closed el<el />

    /**
     * Creates an error that will not be caught by XMLReader aka the SAX parser.
     *
     * @param {string} message
     * @param {any?} locator Optional, can provide details about the location in the source
     * @constructor
     */
    function ParseError(message, locator) {
    	this.message = message;
    	this.locator = locator;
    	if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
    }
    ParseError.prototype = new Error();
    ParseError.prototype.name = ParseError.name;

    function XMLReader(){
    	
    }

    XMLReader.prototype = {
    	parse:function(source,defaultNSMap,entityMap){
    		var domBuilder = this.domBuilder;
    		domBuilder.startDocument();
    		_copy(defaultNSMap ,defaultNSMap = {});
    		parse(source,defaultNSMap,entityMap,
    				domBuilder,this.errorHandler);
    		domBuilder.endDocument();
    	}
    };
    function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
    	function fixedFromCharCode(code) {
    		// String.prototype.fromCharCode does not supports
    		// > 2 bytes unicode chars directly
    		if (code > 0xffff) {
    			code -= 0x10000;
    			var surrogate1 = 0xd800 + (code >> 10)
    				, surrogate2 = 0xdc00 + (code & 0x3ff);

    			return String.fromCharCode(surrogate1, surrogate2);
    		} else {
    			return String.fromCharCode(code);
    		}
    	}
    	function entityReplacer(a){
    		var k = a.slice(1,-1);
    		if(k in entityMap){
    			return entityMap[k]; 
    		}else if(k.charAt(0) === '#'){
    			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
    		}else {
    			errorHandler.error('entity not found:'+a);
    			return a;
    		}
    	}
    	function appendText(end){//has some bugs
    		if(end>start){
    			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
    			locator&&position(start);
    			domBuilder.characters(xt,0,end-start);
    			start = end;
    		}
    	}
    	function position(p,m){
    		while(p>=lineEnd && (m = linePattern.exec(source))){
    			lineStart = m.index;
    			lineEnd = lineStart + m[0].length;
    			locator.lineNumber++;
    			//console.log('line++:',locator,startPos,endPos)
    		}
    		locator.columnNumber = p-lineStart+1;
    	}
    	var lineStart = 0;
    	var lineEnd = 0;
    	var linePattern = /.*(?:\r\n?|\n)|.*$/g;
    	var locator = domBuilder.locator;
    	
    	var parseStack = [{currentNSMap:defaultNSMapCopy}];
    	var closeMap = {};
    	var start = 0;
    	while(true){
    		try{
    			var tagStart = source.indexOf('<',start);
    			if(tagStart<0){
    				if(!source.substr(start).match(/^\s*$/)){
    					var doc = domBuilder.doc;
    	    			var text = doc.createTextNode(source.substr(start));
    	    			doc.appendChild(text);
    	    			domBuilder.currentElement = text;
    				}
    				return;
    			}
    			if(tagStart>start){
    				appendText(tagStart);
    			}
    			switch(source.charAt(tagStart+1)){
    			case '/':
    				var end = source.indexOf('>',tagStart+3);
    				var tagName = source.substring(tagStart+2,end);
    				var config = parseStack.pop();
    				if(end<0){
    					
    	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
    	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
    	        		end = tagStart+1+tagName.length;
    	        	}else if(tagName.match(/\s</)){
    	        		tagName = tagName.replace(/[\s<].*/,'');
    	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
    	        		end = tagStart+1+tagName.length;
    				}
    				var localNSMap = config.localNSMap;
    				var endMatch = config.tagName == tagName;
    				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase();
    		        if(endIgnoreCaseMach){
    		        	domBuilder.endElement(config.uri,config.localName,tagName);
    					if(localNSMap){
    						for(var prefix in localNSMap){
    							domBuilder.endPrefixMapping(prefix) ;
    						}
    					}
    					if(!endMatch){
    		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
    					}
    		        }else {
    		        	parseStack.push(config);
    		        }
    				
    				end++;
    				break;
    				// end elment
    			case '?':// <?...?>
    				locator&&position(tagStart);
    				end = parseInstruction(source,tagStart,domBuilder);
    				break;
    			case '!':// <!doctype,<![CDATA,<!--
    				locator&&position(tagStart);
    				end = parseDCC(source,tagStart,domBuilder,errorHandler);
    				break;
    			default:
    				locator&&position(tagStart);
    				var el = new ElementAttributes();
    				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
    				//elStartEnd
    				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
    				var len = el.length;
    				
    				
    				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
    					el.closed = true;
    					if(!entityMap.nbsp){
    						errorHandler.warning('unclosed xml attribute');
    					}
    				}
    				if(locator && len){
    					var locator2 = copyLocator(locator,{});
    					//try{//attribute position fixed
    					for(var i = 0;i<len;i++){
    						var a = el[i];
    						position(a.offset);
    						a.locator = copyLocator(locator,{});
    					}
    					domBuilder.locator = locator2;
    					if(appendElement(el,domBuilder,currentNSMap)){
    						parseStack.push(el);
    					}
    					domBuilder.locator = locator;
    				}else {
    					if(appendElement(el,domBuilder,currentNSMap)){
    						parseStack.push(el);
    					}
    				}
    				
    				
    				
    				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
    					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder);
    				}else {
    					end++;
    				}
    			}
    		}catch(e){
    			if (e instanceof ParseError) {
    				throw e;
    			}
    			errorHandler.error('element parse error: '+e);
    			end = -1;
    		}
    		if(end>start){
    			start = end;
    		}else {
    			//TODO: 这里有可能sax回退，有位置错误风险
    			appendText(Math.max(tagStart,start)+1);
    		}
    	}
    }
    function copyLocator(f,t){
    	t.lineNumber = f.lineNumber;
    	t.columnNumber = f.columnNumber;
    	return t;
    }

    /**
     * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
     * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
     */
    function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){

    	/**
    	 * @param {string} qname
    	 * @param {string} value
    	 * @param {number} startIndex
    	 */
    	function addAttribute(qname, value, startIndex) {
    		if (qname in el.attributeNames) errorHandler.fatalError('Attribute ' + qname + ' redefined');
    		el.addValue(qname, value, startIndex);
    	}
    	var attrName;
    	var value;
    	var p = ++start;
    	var s = S_TAG;//status
    	while(true){
    		var c = source.charAt(p);
    		switch(c){
    		case '=':
    			if(s === S_ATTR){//attrName
    				attrName = source.slice(start,p);
    				s = S_EQ;
    			}else if(s === S_ATTR_SPACE){
    				s = S_EQ;
    			}else {
    				//fatalError: equal must after attrName or space after attrName
    				throw new Error('attribute equal must after attrName'); // No known test case
    			}
    			break;
    		case '\'':
    		case '"':
    			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
    				){//equal
    				if(s === S_ATTR){
    					errorHandler.warning('attribute value must after "="');
    					attrName = source.slice(start,p);
    				}
    				start = p+1;
    				p = source.indexOf(c,start);
    				if(p>0){
    					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
    					addAttribute(attrName, value, start-1);
    					s = S_ATTR_END;
    				}else {
    					//fatalError: no end quot match
    					throw new Error('attribute value no end \''+c+'\' match');
    				}
    			}else if(s == S_ATTR_NOQUOT_VALUE){
    				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
    				//console.log(attrName,value,start,p)
    				addAttribute(attrName, value, start);
    				//console.dir(el)
    				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
    				start = p+1;
    				s = S_ATTR_END;
    			}else {
    				//fatalError: no equal before
    				throw new Error('attribute value must after "="'); // No known test case
    			}
    			break;
    		case '/':
    			switch(s){
    			case S_TAG:
    				el.setTagName(source.slice(start,p));
    			case S_ATTR_END:
    			case S_TAG_SPACE:
    			case S_TAG_CLOSE:
    				s =S_TAG_CLOSE;
    				el.closed = true;
    			case S_ATTR_NOQUOT_VALUE:
    			case S_ATTR:
    			case S_ATTR_SPACE:
    				break;
    			//case S_EQ:
    			default:
    				throw new Error("attribute invalid close char('/')") // No known test case
    			}
    			break;
    		case ''://end document
    			errorHandler.error('unexpected end of input');
    			if(s == S_TAG){
    				el.setTagName(source.slice(start,p));
    			}
    			return p;
    		case '>':
    			switch(s){
    			case S_TAG:
    				el.setTagName(source.slice(start,p));
    			case S_ATTR_END:
    			case S_TAG_SPACE:
    			case S_TAG_CLOSE:
    				break;//normal
    			case S_ATTR_NOQUOT_VALUE://Compatible state
    			case S_ATTR:
    				value = source.slice(start,p);
    				if(value.slice(-1) === '/'){
    					el.closed  = true;
    					value = value.slice(0,-1);
    				}
    			case S_ATTR_SPACE:
    				if(s === S_ATTR_SPACE){
    					value = attrName;
    				}
    				if(s == S_ATTR_NOQUOT_VALUE){
    					errorHandler.warning('attribute "'+value+'" missed quot(")!');
    					addAttribute(attrName, value.replace(/&#?\w+;/g,entityReplacer), start);
    				}else {
    					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
    						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!');
    					}
    					addAttribute(value, value, start);
    				}
    				break;
    			case S_EQ:
    				throw new Error('attribute value missed!!');
    			}
    //			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
    			return p;
    		/*xml space '\x20' | #x9 | #xD | #xA; */
    		case '\u0080':
    			c = ' ';
    		default:
    			if(c<= ' '){//space
    				switch(s){
    				case S_TAG:
    					el.setTagName(source.slice(start,p));//tagName
    					s = S_TAG_SPACE;
    					break;
    				case S_ATTR:
    					attrName = source.slice(start,p);
    					s = S_ATTR_SPACE;
    					break;
    				case S_ATTR_NOQUOT_VALUE:
    					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
    					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
    					addAttribute(attrName, value, start);
    				case S_ATTR_END:
    					s = S_TAG_SPACE;
    					break;
    				//case S_TAG_SPACE:
    				//case S_EQ:
    				//case S_ATTR_SPACE:
    				//	void();break;
    				//case S_TAG_CLOSE:
    					//ignore warning
    				}
    			}else {//not space
    //S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
    //S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
    				switch(s){
    				//case S_TAG:void();break;
    				//case S_ATTR:void();break;
    				//case S_ATTR_NOQUOT_VALUE:void();break;
    				case S_ATTR_SPACE:
    					var tagName =  el.tagName;
    					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
    						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!');
    					}
    					addAttribute(attrName, attrName, start);
    					start = p;
    					s = S_ATTR;
    					break;
    				case S_ATTR_END:
    					errorHandler.warning('attribute space is required"'+attrName+'"!!');
    				case S_TAG_SPACE:
    					s = S_ATTR;
    					start = p;
    					break;
    				case S_EQ:
    					s = S_ATTR_NOQUOT_VALUE;
    					start = p;
    					break;
    				case S_TAG_CLOSE:
    					throw new Error("elements closed character '/' and '>' must be connected to");
    				}
    			}
    		}//end outer switch
    		//console.log('p++',p)
    		p++;
    	}
    }
    /**
     * @return true if has new namespace define
     */
    function appendElement(el,domBuilder,currentNSMap){
    	var tagName = el.tagName;
    	var localNSMap = null;
    	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
    	var i = el.length;
    	while(i--){
    		var a = el[i];
    		var qName = a.qName;
    		var value = a.value;
    		var nsp = qName.indexOf(':');
    		if(nsp>0){
    			var prefix = a.prefix = qName.slice(0,nsp);
    			var localName = qName.slice(nsp+1);
    			var nsPrefix = prefix === 'xmlns' && localName;
    		}else {
    			localName = qName;
    			prefix = null;
    			nsPrefix = qName === 'xmlns' && '';
    		}
    		//can not set prefix,because prefix !== ''
    		a.localName = localName ;
    		//prefix == null for no ns prefix attribute 
    		if(nsPrefix !== false){//hack!!
    			if(localNSMap == null){
    				localNSMap = {};
    				//console.log(currentNSMap,0)
    				_copy(currentNSMap,currentNSMap={});
    				//console.log(currentNSMap,1)
    			}
    			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
    			a.uri = 'http://www.w3.org/2000/xmlns/';
    			domBuilder.startPrefixMapping(nsPrefix, value); 
    		}
    	}
    	var i = el.length;
    	while(i--){
    		a = el[i];
    		var prefix = a.prefix;
    		if(prefix){//no prefix attribute has no namespace
    			if(prefix === 'xml'){
    				a.uri = 'http://www.w3.org/XML/1998/namespace';
    			}if(prefix !== 'xmlns'){
    				a.uri = currentNSMap[prefix || ''];
    				
    				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
    			}
    		}
    	}
    	var nsp = tagName.indexOf(':');
    	if(nsp>0){
    		prefix = el.prefix = tagName.slice(0,nsp);
    		localName = el.localName = tagName.slice(nsp+1);
    	}else {
    		prefix = null;//important!!
    		localName = el.localName = tagName;
    	}
    	//no prefix element has default namespace
    	var ns = el.uri = currentNSMap[prefix || ''];
    	domBuilder.startElement(ns,localName,tagName,el);
    	//endPrefixMapping and startPrefixMapping have not any help for dom builder
    	//localNSMap = null
    	if(el.closed){
    		domBuilder.endElement(ns,localName,tagName);
    		if(localNSMap){
    			for(prefix in localNSMap){
    				domBuilder.endPrefixMapping(prefix); 
    			}
    		}
    	}else {
    		el.currentNSMap = currentNSMap;
    		el.localNSMap = localNSMap;
    		//parseStack.push(el);
    		return true;
    	}
    }
    function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
    	if(/^(?:script|textarea)$/i.test(tagName)){
    		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
    		var text = source.substring(elStartEnd+1,elEndStart);
    		if(/[&<]/.test(text)){
    			if(/^script$/i.test(tagName)){
    				//if(!/\]\]>/.test(text)){
    					//lexHandler.startCDATA();
    					domBuilder.characters(text,0,text.length);
    					//lexHandler.endCDATA();
    					return elEndStart;
    				//}
    			}//}else{//text area
    				text = text.replace(/&#?\w+;/g,entityReplacer);
    				domBuilder.characters(text,0,text.length);
    				return elEndStart;
    			//}
    			
    		}
    	}
    	return elStartEnd+1;
    }
    function fixSelfClosed(source,elStartEnd,tagName,closeMap){
    	//if(tagName in closeMap){
    	var pos = closeMap[tagName];
    	if(pos == null){
    		//console.log(tagName)
    		pos =  source.lastIndexOf('</'+tagName+'>');
    		if(pos<elStartEnd){//忘记闭合
    			pos = source.lastIndexOf('</'+tagName);
    		}
    		closeMap[tagName] =pos;
    	}
    	return pos<elStartEnd;
    	//} 
    }
    function _copy(source,target){
    	for(var n in source){target[n] = source[n];}
    }
    function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
    	var next= source.charAt(start+2);
    	switch(next){
    	case '-':
    		if(source.charAt(start + 3) === '-'){
    			var end = source.indexOf('-->',start+4);
    			//append comment source.substring(4,end)//<!--
    			if(end>start){
    				domBuilder.comment(source,start+4,end-start-4);
    				return end+3;
    			}else {
    				errorHandler.error("Unclosed comment");
    				return -1;
    			}
    		}else {
    			//error
    			return -1;
    		}
    	default:
    		if(source.substr(start+3,6) == 'CDATA['){
    			var end = source.indexOf(']]>',start+9);
    			domBuilder.startCDATA();
    			domBuilder.characters(source,start+9,end-start-9);
    			domBuilder.endCDATA(); 
    			return end+3;
    		}
    		//<!DOCTYPE
    		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
    		var matchs = split(source,start);
    		var len = matchs.length;
    		if(len>1 && /!doctype/i.test(matchs[0][0])){
    			var name = matchs[1][0];
    			var pubid = false;
    			var sysid = false;
    			if(len>3){
    				if(/^public$/i.test(matchs[2][0])){
    					pubid = matchs[3][0];
    					sysid = len>4 && matchs[4][0];
    				}else if(/^system$/i.test(matchs[2][0])){
    					sysid = matchs[3][0];
    				}
    			}
    			var lastMatch = matchs[len-1];
    			domBuilder.startDTD(name, pubid, sysid);
    			domBuilder.endDTD();
    			
    			return lastMatch.index+lastMatch[0].length
    		}
    	}
    	return -1;
    }



    function parseInstruction(source,start,domBuilder){
    	var end = source.indexOf('?>',start);
    	if(end){
    		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
    		if(match){
    			var len = match[0].length;
    			domBuilder.processingInstruction(match[1], match[2]) ;
    			return end+2;
    		}else {//error
    			return -1;
    		}
    	}
    	return -1;
    }

    function ElementAttributes(){
    	this.attributeNames = {};
    }
    ElementAttributes.prototype = {
    	setTagName:function(tagName){
    		if(!tagNamePattern.test(tagName)){
    			throw new Error('invalid tagName:'+tagName)
    		}
    		this.tagName = tagName;
    	},
    	addValue:function(qName, value, offset) {
    		if(!tagNamePattern.test(qName)){
    			throw new Error('invalid attribute:'+qName)
    		}
    		this.attributeNames[qName] = this.length;
    		this[this.length++] = {qName:qName,value:value,offset:offset};
    	},
    	length:0,
    	getLocalName:function(i){return this[i].localName},
    	getLocator:function(i){return this[i].locator},
    	getQName:function(i){return this[i].qName},
    	getURI:function(i){return this[i].uri},
    	getValue:function(i){return this[i].value}
    //	,getIndex:function(uri, localName)){
    //		if(localName){
    //			
    //		}else{
    //			var qName = uri
    //		}
    //	},
    //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
    //	getType:function(uri,localName){}
    //	getType:function(i){},
    };



    function split(source,start){
    	var match;
    	var buf = [];
    	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
    	reg.lastIndex = start;
    	reg.exec(source);//skip <
    	while(match = reg.exec(source)){
    		buf.push(match);
    		if(match[1])return buf;
    	}
    }

    var XMLReader_1 = XMLReader;
    var ParseError_1 = ParseError;

    var sax = {
    	XMLReader: XMLReader_1,
    	ParseError: ParseError_1
    };

    function copy(src,dest){
    	for(var p in src){
    		dest[p] = src[p];
    	}
    }
    /**
    ^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
    ^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
     */
    function _extends(Class,Super){
    	var pt = Class.prototype;
    	if(!(pt instanceof Super)){
    		function t(){}		t.prototype = Super.prototype;
    		t = new t();
    		copy(pt,t);
    		Class.prototype = pt = t;
    	}
    	if(pt.constructor != Class){
    		if(typeof Class != 'function'){
    			console.error("unknow Class:"+Class);
    		}
    		pt.constructor = Class;
    	}
    }
    var htmlns = 'http://www.w3.org/1999/xhtml' ;
    // Node Types
    var NodeType = {};
    var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
    var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
    var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
    var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
    var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
    var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
    var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
    var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
    var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
    var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
    var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
    var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

    // ExceptionCode
    var ExceptionCode = {};
    var ExceptionMessage = {};
    var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
    var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
    var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
    var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
    var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
    var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
    var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
    var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
    var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
    var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
    //level2
    var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
    var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
    var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
    var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
    var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);

    /**
     * DOM Level 2
     * Object DOMException
     * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
     * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
     */
    function DOMException(code, message) {
    	if(message instanceof Error){
    		var error = message;
    	}else {
    		error = this;
    		Error.call(this, ExceptionMessage[code]);
    		this.message = ExceptionMessage[code];
    		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
    	}
    	error.code = code;
    	if(message) this.message = this.message + ": " + message;
    	return error;
    }DOMException.prototype = Error.prototype;
    copy(ExceptionCode,DOMException);
    /**
     * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
     * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
     * The items in the NodeList are accessible via an integral index, starting from 0.
     */
    function NodeList() {
    }NodeList.prototype = {
    	/**
    	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
    	 * @standard level1
    	 */
    	length:0, 
    	/**
    	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
    	 * @standard level1
    	 * @param index  unsigned long 
    	 *   Index into the collection.
    	 * @return Node
    	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
    	 */
    	item: function(index) {
    		return this[index] || null;
    	},
    	toString:function(isHTML,nodeFilter){
    		for(var buf = [], i = 0;i<this.length;i++){
    			serializeToString(this[i],buf,isHTML,nodeFilter);
    		}
    		return buf.join('');
    	}
    };
    function LiveNodeList(node,refresh){
    	this._node = node;
    	this._refresh = refresh;
    	_updateLiveList(this);
    }
    function _updateLiveList(list){
    	var inc = list._node._inc || list._node.ownerDocument._inc;
    	if(list._inc != inc){
    		var ls = list._refresh(list._node);
    		//console.log(ls.length)
    		__set__(list,'length',ls.length);
    		copy(ls,list);
    		list._inc = inc;
    	}
    }
    LiveNodeList.prototype.item = function(i){
    	_updateLiveList(this);
    	return this[i];
    };

    _extends(LiveNodeList,NodeList);
    /**
     * 
     * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
     * NamedNodeMap objects in the DOM are live.
     * used for attributes or DocumentType entities 
     */
    function NamedNodeMap() {
    }
    function _findNodeIndex(list,node){
    	var i = list.length;
    	while(i--){
    		if(list[i] === node){return i}
    	}
    }

    function _addNamedNode(el,list,newAttr,oldAttr){
    	if(oldAttr){
    		list[_findNodeIndex(list,oldAttr)] = newAttr;
    	}else {
    		list[list.length++] = newAttr;
    	}
    	if(el){
    		newAttr.ownerElement = el;
    		var doc = el.ownerDocument;
    		if(doc){
    			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
    			_onAddAttribute(doc,el,newAttr);
    		}
    	}
    }
    function _removeNamedNode(el,list,attr){
    	//console.log('remove attr:'+attr)
    	var i = _findNodeIndex(list,attr);
    	if(i>=0){
    		var lastIndex = list.length-1;
    		while(i<lastIndex){
    			list[i] = list[++i];
    		}
    		list.length = lastIndex;
    		if(el){
    			var doc = el.ownerDocument;
    			if(doc){
    				_onRemoveAttribute(doc,el,attr);
    				attr.ownerElement = null;
    			}
    		}
    	}else {
    		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
    	}
    }
    NamedNodeMap.prototype = {
    	length:0,
    	item:NodeList.prototype.item,
    	getNamedItem: function(key) {
    //		if(key.indexOf(':')>0 || key == 'xmlns'){
    //			return null;
    //		}
    		//console.log()
    		var i = this.length;
    		while(i--){
    			var attr = this[i];
    			//console.log(attr.nodeName,key)
    			if(attr.nodeName == key){
    				return attr;
    			}
    		}
    	},
    	setNamedItem: function(attr) {
    		var el = attr.ownerElement;
    		if(el && el!=this._ownerElement){
    			throw new DOMException(INUSE_ATTRIBUTE_ERR);
    		}
    		var oldAttr = this.getNamedItem(attr.nodeName);
    		_addNamedNode(this._ownerElement,this,attr,oldAttr);
    		return oldAttr;
    	},
    	/* returns Node */
    	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
    		var el = attr.ownerElement, oldAttr;
    		if(el && el!=this._ownerElement){
    			throw new DOMException(INUSE_ATTRIBUTE_ERR);
    		}
    		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
    		_addNamedNode(this._ownerElement,this,attr,oldAttr);
    		return oldAttr;
    	},

    	/* returns Node */
    	removeNamedItem: function(key) {
    		var attr = this.getNamedItem(key);
    		_removeNamedNode(this._ownerElement,this,attr);
    		return attr;
    		
    		
    	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
    	
    	//for level2
    	removeNamedItemNS:function(namespaceURI,localName){
    		var attr = this.getNamedItemNS(namespaceURI,localName);
    		_removeNamedNode(this._ownerElement,this,attr);
    		return attr;
    	},
    	getNamedItemNS: function(namespaceURI, localName) {
    		var i = this.length;
    		while(i--){
    			var node = this[i];
    			if(node.localName == localName && node.namespaceURI == namespaceURI){
    				return node;
    			}
    		}
    		return null;
    	}
    };
    /**
     * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
     */
    function DOMImplementation(/* Object */ features) {
    	this._features = {};
    	if (features) {
    		for (var feature in features) {
    			 this._features = features[feature];
    		}
    	}
    }
    DOMImplementation.prototype = {
    	hasFeature: function(/* string */ feature, /* string */ version) {
    		var versions = this._features[feature.toLowerCase()];
    		if (versions && (!version || version in versions)) {
    			return true;
    		} else {
    			return false;
    		}
    	},
    	// Introduced in DOM Level 2:
    	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
    		var doc = new Document();
    		doc.implementation = this;
    		doc.childNodes = new NodeList();
    		doc.doctype = doctype;
    		if(doctype){
    			doc.appendChild(doctype);
    		}
    		if(qualifiedName){
    			var root = doc.createElementNS(namespaceURI,qualifiedName);
    			doc.appendChild(root);
    		}
    		return doc;
    	},
    	// Introduced in DOM Level 2:
    	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
    		var node = new DocumentType();
    		node.name = qualifiedName;
    		node.nodeName = qualifiedName;
    		node.publicId = publicId;
    		node.systemId = systemId;
    		// Introduced in DOM Level 2:
    		//readonly attribute DOMString        internalSubset;
    		
    		//TODO:..
    		//  readonly attribute NamedNodeMap     entities;
    		//  readonly attribute NamedNodeMap     notations;
    		return node;
    	}
    };


    /**
     * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
     */

    function Node$1() {
    }
    Node$1.prototype = {
    	firstChild : null,
    	lastChild : null,
    	previousSibling : null,
    	nextSibling : null,
    	attributes : null,
    	parentNode : null,
    	childNodes : null,
    	ownerDocument : null,
    	nodeValue : null,
    	namespaceURI : null,
    	prefix : null,
    	localName : null,
    	// Modified in DOM Level 2:
    	insertBefore:function(newChild, refChild){//raises 
    		return _insertBefore(this,newChild,refChild);
    	},
    	replaceChild:function(newChild, oldChild){//raises 
    		this.insertBefore(newChild,oldChild);
    		if(oldChild){
    			this.removeChild(oldChild);
    		}
    	},
    	removeChild:function(oldChild){
    		return _removeChild(this,oldChild);
    	},
    	appendChild:function(newChild){
    		return this.insertBefore(newChild,null);
    	},
    	hasChildNodes:function(){
    		return this.firstChild != null;
    	},
    	cloneNode:function(deep){
    		return cloneNode(this.ownerDocument||this,this,deep);
    	},
    	// Modified in DOM Level 2:
    	normalize:function(){
    		var child = this.firstChild;
    		while(child){
    			var next = child.nextSibling;
    			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
    				this.removeChild(next);
    				child.appendData(next.data);
    			}else {
    				child.normalize();
    				child = next;
    			}
    		}
    	},
      	// Introduced in DOM Level 2:
    	isSupported:function(feature, version){
    		return this.ownerDocument.implementation.hasFeature(feature,version);
    	},
        // Introduced in DOM Level 2:
        hasAttributes:function(){
        	return this.attributes.length>0;
        },
        lookupPrefix:function(namespaceURI){
        	var el = this;
        	while(el){
        		var map = el._nsMap;
        		//console.dir(map)
        		if(map){
        			for(var n in map){
        				if(map[n] == namespaceURI){
        					return n;
        				}
        			}
        		}
        		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
        	}
        	return null;
        },
        // Introduced in DOM Level 3:
        lookupNamespaceURI:function(prefix){
        	var el = this;
        	while(el){
        		var map = el._nsMap;
        		//console.dir(map)
        		if(map){
        			if(prefix in map){
        				return map[prefix] ;
        			}
        		}
        		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
        	}
        	return null;
        },
        // Introduced in DOM Level 3:
        isDefaultNamespace:function(namespaceURI){
        	var prefix = this.lookupPrefix(namespaceURI);
        	return prefix == null;
        }
    };


    function _xmlEncoder(c){
    	return c == '<' && '&lt;' ||
             c == '>' && '&gt;' ||
             c == '&' && '&amp;' ||
             c == '"' && '&quot;' ||
             '&#'+c.charCodeAt()+';'
    }


    copy(NodeType,Node$1);
    copy(NodeType,Node$1.prototype);

    /**
     * @param callback return true for continue,false for break
     * @return boolean true: break visit;
     */
    function _visitNode(node,callback){
    	if(callback(node)){
    		return true;
    	}
    	if(node = node.firstChild){
    		do{
    			if(_visitNode(node,callback)){return true}
            }while(node=node.nextSibling)
        }
    }



    function Document(){
    }
    function _onAddAttribute(doc,el,newAttr){
    	doc && doc._inc++;
    	var ns = newAttr.namespaceURI ;
    	if(ns == 'http://www.w3.org/2000/xmlns/'){
    		//update namespace
    		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value;
    	}
    }
    function _onRemoveAttribute(doc,el,newAttr,remove){
    	doc && doc._inc++;
    	var ns = newAttr.namespaceURI ;
    	if(ns == 'http://www.w3.org/2000/xmlns/'){
    		//update namespace
    		delete el._nsMap[newAttr.prefix?newAttr.localName:''];
    	}
    }
    function _onUpdateChild(doc,el,newChild){
    	if(doc && doc._inc){
    		doc._inc++;
    		//update childNodes
    		var cs = el.childNodes;
    		if(newChild){
    			cs[cs.length++] = newChild;
    		}else {
    			//console.log(1)
    			var child = el.firstChild;
    			var i = 0;
    			while(child){
    				cs[i++] = child;
    				child =child.nextSibling;
    			}
    			cs.length = i;
    		}
    	}
    }

    /**
     * attributes;
     * children;
     * 
     * writeable properties:
     * nodeValue,Attr:value,CharacterData:data
     * prefix
     */
    function _removeChild(parentNode,child){
    	var previous = child.previousSibling;
    	var next = child.nextSibling;
    	if(previous){
    		previous.nextSibling = next;
    	}else {
    		parentNode.firstChild = next;
    	}
    	if(next){
    		next.previousSibling = previous;
    	}else {
    		parentNode.lastChild = previous;
    	}
    	_onUpdateChild(parentNode.ownerDocument,parentNode);
    	return child;
    }
    /**
     * preformance key(refChild == null)
     */
    function _insertBefore(parentNode,newChild,nextChild){
    	var cp = newChild.parentNode;
    	if(cp){
    		cp.removeChild(newChild);//remove and update
    	}
    	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
    		var newFirst = newChild.firstChild;
    		if (newFirst == null) {
    			return newChild;
    		}
    		var newLast = newChild.lastChild;
    	}else {
    		newFirst = newLast = newChild;
    	}
    	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

    	newFirst.previousSibling = pre;
    	newLast.nextSibling = nextChild;
    	
    	
    	if(pre){
    		pre.nextSibling = newFirst;
    	}else {
    		parentNode.firstChild = newFirst;
    	}
    	if(nextChild == null){
    		parentNode.lastChild = newLast;
    	}else {
    		nextChild.previousSibling = newLast;
    	}
    	do{
    		newFirst.parentNode = parentNode;
    	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
    	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
    	//console.log(parentNode.lastChild.nextSibling == null)
    	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
    		newChild.firstChild = newChild.lastChild = null;
    	}
    	return newChild;
    }
    function _appendSingleChild(parentNode,newChild){
    	var cp = newChild.parentNode;
    	if(cp){
    		var pre = parentNode.lastChild;
    		cp.removeChild(newChild);//remove and update
    		var pre = parentNode.lastChild;
    	}
    	var pre = parentNode.lastChild;
    	newChild.parentNode = parentNode;
    	newChild.previousSibling = pre;
    	newChild.nextSibling = null;
    	if(pre){
    		pre.nextSibling = newChild;
    	}else {
    		parentNode.firstChild = newChild;
    	}
    	parentNode.lastChild = newChild;
    	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
    	return newChild;
    	//console.log("__aa",parentNode.lastChild.nextSibling == null)
    }
    Document.prototype = {
    	//implementation : null,
    	nodeName :  '#document',
    	nodeType :  DOCUMENT_NODE,
    	doctype :  null,
    	documentElement :  null,
    	_inc : 1,
    	
    	insertBefore :  function(newChild, refChild){//raises 
    		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
    			var child = newChild.firstChild;
    			while(child){
    				var next = child.nextSibling;
    				this.insertBefore(child,refChild);
    				child = next;
    			}
    			return newChild;
    		}
    		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
    			this.documentElement = newChild;
    		}
    		
    		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
    	},
    	removeChild :  function(oldChild){
    		if(this.documentElement == oldChild){
    			this.documentElement = null;
    		}
    		return _removeChild(this,oldChild);
    	},
    	// Introduced in DOM Level 2:
    	importNode : function(importedNode,deep){
    		return importNode(this,importedNode,deep);
    	},
    	// Introduced in DOM Level 2:
    	getElementById :	function(id){
    		var rtv = null;
    		_visitNode(this.documentElement,function(node){
    			if(node.nodeType == ELEMENT_NODE){
    				if(node.getAttribute('id') == id){
    					rtv = node;
    					return true;
    				}
    			}
    		});
    		return rtv;
    	},
    	
    	getElementsByClassName: function(className) {
    		var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
    		return new LiveNodeList(this, function(base) {
    			var ls = [];
    			_visitNode(base.documentElement, function(node) {
    				if(node !== base && node.nodeType == ELEMENT_NODE) {
    					if(pattern.test(node.getAttribute('class'))) {
    						ls.push(node);
    					}
    				}
    			});
    			return ls;
    		});
    	},
    	
    	//document factory method:
    	createElement :	function(tagName){
    		var node = new Element();
    		node.ownerDocument = this;
    		node.nodeName = tagName;
    		node.tagName = tagName;
    		node.childNodes = new NodeList();
    		var attrs	= node.attributes = new NamedNodeMap();
    		attrs._ownerElement = node;
    		return node;
    	},
    	createDocumentFragment :	function(){
    		var node = new DocumentFragment();
    		node.ownerDocument = this;
    		node.childNodes = new NodeList();
    		return node;
    	},
    	createTextNode :	function(data){
    		var node = new Text();
    		node.ownerDocument = this;
    		node.appendData(data);
    		return node;
    	},
    	createComment :	function(data){
    		var node = new Comment();
    		node.ownerDocument = this;
    		node.appendData(data);
    		return node;
    	},
    	createCDATASection :	function(data){
    		var node = new CDATASection();
    		node.ownerDocument = this;
    		node.appendData(data);
    		return node;
    	},
    	createProcessingInstruction :	function(target,data){
    		var node = new ProcessingInstruction();
    		node.ownerDocument = this;
    		node.tagName = node.target = target;
    		node.nodeValue= node.data = data;
    		return node;
    	},
    	createAttribute :	function(name){
    		var node = new Attr();
    		node.ownerDocument	= this;
    		node.name = name;
    		node.nodeName	= name;
    		node.localName = name;
    		node.specified = true;
    		return node;
    	},
    	createEntityReference :	function(name){
    		var node = new EntityReference();
    		node.ownerDocument	= this;
    		node.nodeName	= name;
    		return node;
    	},
    	// Introduced in DOM Level 2:
    	createElementNS :	function(namespaceURI,qualifiedName){
    		var node = new Element();
    		var pl = qualifiedName.split(':');
    		var attrs	= node.attributes = new NamedNodeMap();
    		node.childNodes = new NodeList();
    		node.ownerDocument = this;
    		node.nodeName = qualifiedName;
    		node.tagName = qualifiedName;
    		node.namespaceURI = namespaceURI;
    		if(pl.length == 2){
    			node.prefix = pl[0];
    			node.localName = pl[1];
    		}else {
    			//el.prefix = null;
    			node.localName = qualifiedName;
    		}
    		attrs._ownerElement = node;
    		return node;
    	},
    	// Introduced in DOM Level 2:
    	createAttributeNS :	function(namespaceURI,qualifiedName){
    		var node = new Attr();
    		var pl = qualifiedName.split(':');
    		node.ownerDocument = this;
    		node.nodeName = qualifiedName;
    		node.name = qualifiedName;
    		node.namespaceURI = namespaceURI;
    		node.specified = true;
    		if(pl.length == 2){
    			node.prefix = pl[0];
    			node.localName = pl[1];
    		}else {
    			//el.prefix = null;
    			node.localName = qualifiedName;
    		}
    		return node;
    	}
    };
    _extends(Document,Node$1);


    function Element() {
    	this._nsMap = {};
    }Element.prototype = {
    	nodeType : ELEMENT_NODE,
    	hasAttribute : function(name){
    		return this.getAttributeNode(name)!=null;
    	},
    	getAttribute : function(name){
    		var attr = this.getAttributeNode(name);
    		return attr && attr.value || '';
    	},
    	getAttributeNode : function(name){
    		return this.attributes.getNamedItem(name);
    	},
    	setAttribute : function(name, value){
    		var attr = this.ownerDocument.createAttribute(name);
    		attr.value = attr.nodeValue = "" + value;
    		this.setAttributeNode(attr);
    	},
    	removeAttribute : function(name){
    		var attr = this.getAttributeNode(name);
    		attr && this.removeAttributeNode(attr);
    	},
    	
    	//four real opeartion method
    	appendChild:function(newChild){
    		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
    			return this.insertBefore(newChild,null);
    		}else {
    			return _appendSingleChild(this,newChild);
    		}
    	},
    	setAttributeNode : function(newAttr){
    		return this.attributes.setNamedItem(newAttr);
    	},
    	setAttributeNodeNS : function(newAttr){
    		return this.attributes.setNamedItemNS(newAttr);
    	},
    	removeAttributeNode : function(oldAttr){
    		//console.log(this == oldAttr.ownerElement)
    		return this.attributes.removeNamedItem(oldAttr.nodeName);
    	},
    	//get real attribute name,and remove it by removeAttributeNode
    	removeAttributeNS : function(namespaceURI, localName){
    		var old = this.getAttributeNodeNS(namespaceURI, localName);
    		old && this.removeAttributeNode(old);
    	},
    	
    	hasAttributeNS : function(namespaceURI, localName){
    		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
    	},
    	getAttributeNS : function(namespaceURI, localName){
    		var attr = this.getAttributeNodeNS(namespaceURI, localName);
    		return attr && attr.value || '';
    	},
    	setAttributeNS : function(namespaceURI, qualifiedName, value){
    		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
    		attr.value = attr.nodeValue = "" + value;
    		this.setAttributeNode(attr);
    	},
    	getAttributeNodeNS : function(namespaceURI, localName){
    		return this.attributes.getNamedItemNS(namespaceURI, localName);
    	},
    	
    	getElementsByTagName : function(tagName){
    		return new LiveNodeList(this,function(base){
    			var ls = [];
    			_visitNode(base,function(node){
    				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
    					ls.push(node);
    				}
    			});
    			return ls;
    		});
    	},
    	getElementsByTagNameNS : function(namespaceURI, localName){
    		return new LiveNodeList(this,function(base){
    			var ls = [];
    			_visitNode(base,function(node){
    				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
    					ls.push(node);
    				}
    			});
    			return ls;
    			
    		});
    	}
    };
    Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
    Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


    _extends(Element,Node$1);
    function Attr() {
    }Attr.prototype.nodeType = ATTRIBUTE_NODE;
    _extends(Attr,Node$1);


    function CharacterData() {
    }CharacterData.prototype = {
    	data : '',
    	substringData : function(offset, count) {
    		return this.data.substring(offset, offset+count);
    	},
    	appendData: function(text) {
    		text = this.data+text;
    		this.nodeValue = this.data = text;
    		this.length = text.length;
    	},
    	insertData: function(offset,text) {
    		this.replaceData(offset,0,text);
    	
    	},
    	appendChild:function(newChild){
    		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
    	},
    	deleteData: function(offset, count) {
    		this.replaceData(offset,count,"");
    	},
    	replaceData: function(offset, count, text) {
    		var start = this.data.substring(0,offset);
    		var end = this.data.substring(offset+count);
    		text = start + text + end;
    		this.nodeValue = this.data = text;
    		this.length = text.length;
    	}
    };
    _extends(CharacterData,Node$1);
    function Text() {
    }Text.prototype = {
    	nodeName : "#text",
    	nodeType : TEXT_NODE,
    	splitText : function(offset) {
    		var text = this.data;
    		var newText = text.substring(offset);
    		text = text.substring(0, offset);
    		this.data = this.nodeValue = text;
    		this.length = text.length;
    		var newNode = this.ownerDocument.createTextNode(newText);
    		if(this.parentNode){
    			this.parentNode.insertBefore(newNode, this.nextSibling);
    		}
    		return newNode;
    	}
    };
    _extends(Text,CharacterData);
    function Comment() {
    }Comment.prototype = {
    	nodeName : "#comment",
    	nodeType : COMMENT_NODE
    };
    _extends(Comment,CharacterData);

    function CDATASection() {
    }CDATASection.prototype = {
    	nodeName : "#cdata-section",
    	nodeType : CDATA_SECTION_NODE
    };
    _extends(CDATASection,CharacterData);


    function DocumentType() {
    }DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
    _extends(DocumentType,Node$1);

    function Notation() {
    }Notation.prototype.nodeType = NOTATION_NODE;
    _extends(Notation,Node$1);

    function Entity() {
    }Entity.prototype.nodeType = ENTITY_NODE;
    _extends(Entity,Node$1);

    function EntityReference() {
    }EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
    _extends(EntityReference,Node$1);

    function DocumentFragment() {
    }DocumentFragment.prototype.nodeName =	"#document-fragment";
    DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
    _extends(DocumentFragment,Node$1);


    function ProcessingInstruction() {
    }
    ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
    _extends(ProcessingInstruction,Node$1);
    function XMLSerializer(){}
    XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
    	return nodeSerializeToString.call(node,isHtml,nodeFilter);
    };
    Node$1.prototype.toString = nodeSerializeToString;
    function nodeSerializeToString(isHtml,nodeFilter){
    	var buf = [];
    	var refNode = this.nodeType == 9 && this.documentElement || this;
    	var prefix = refNode.prefix;
    	var uri = refNode.namespaceURI;
    	
    	if(uri && prefix == null){
    		//console.log(prefix)
    		var prefix = refNode.lookupPrefix(uri);
    		if(prefix == null){
    			//isHTML = true;
    			var visibleNamespaces=[
    			{namespace:uri,prefix:null}
    			//{namespace:uri,prefix:''}
    			];
    		}
    	}
    	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
    	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
    	return buf.join('');
    }
    function needNamespaceDefine(node,isHTML, visibleNamespaces) {
    	var prefix = node.prefix||'';
    	var uri = node.namespaceURI;
    	if (!prefix && !uri){
    		return false;
    	}
    	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
    		|| uri == 'http://www.w3.org/2000/xmlns/'){
    		return false;
    	}
    	
    	var i = visibleNamespaces.length; 
    	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
    	while (i--) {
    		var ns = visibleNamespaces[i];
    		// get namespace prefix
    		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
    		if (ns.prefix == prefix){
    			return ns.namespace != uri;
    		}
    	}
    	//console.log(isHTML,uri,prefix=='')
    	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
    	//	return false;
    	//}
    	//node.flag = '11111'
    	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
    	return true;
    }
    function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
    	if(nodeFilter){
    		node = nodeFilter(node);
    		if(node){
    			if(typeof node == 'string'){
    				buf.push(node);
    				return;
    			}
    		}else {
    			return;
    		}
    		//buf.sort.apply(attrs, attributeSorter);
    	}
    	switch(node.nodeType){
    	case ELEMENT_NODE:
    		if (!visibleNamespaces) visibleNamespaces = [];
    		var startVisibleNamespaces = visibleNamespaces.length;
    		var attrs = node.attributes;
    		var len = attrs.length;
    		var child = node.firstChild;
    		var nodeName = node.tagName;
    		
    		isHTML =  (htmlns === node.namespaceURI) ||isHTML; 
    		buf.push('<',nodeName);
    		
    		
    		
    		for(var i=0;i<len;i++){
    			// add namespaces for attributes
    			var attr = attrs.item(i);
    			if (attr.prefix == 'xmlns') {
    				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
    			}else if(attr.nodeName == 'xmlns'){
    				visibleNamespaces.push({ prefix: '', namespace: attr.value });
    			}
    		}
    		for(var i=0;i<len;i++){
    			var attr = attrs.item(i);
    			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
    				var prefix = attr.prefix||'';
    				var uri = attr.namespaceURI;
    				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
    				buf.push(ns, '="' , uri , '"');
    				visibleNamespaces.push({ prefix: prefix, namespace:uri });
    			}
    			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
    		}
    		// add namespace for current node		
    		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
    			var prefix = node.prefix||'';
    			var uri = node.namespaceURI;
    			if (uri) {
    				// Avoid empty namespace value like xmlns:ds=""
    				// Empty namespace URL will we produce an invalid XML document
    				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
    				buf.push(ns, '="' , uri , '"');
    				visibleNamespaces.push({ prefix: prefix, namespace:uri });
    			}
    		}
    		
    		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
    			buf.push('>');
    			//if is cdata child node
    			if(isHTML && /^script$/i.test(nodeName)){
    				while(child){
    					if(child.data){
    						buf.push(child.data);
    					}else {
    						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
    					}
    					child = child.nextSibling;
    				}
    			}else
    			{
    				while(child){
    					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
    					child = child.nextSibling;
    				}
    			}
    			buf.push('</',nodeName,'>');
    		}else {
    			buf.push('/>');
    		}
    		// remove added visible namespaces
    		//visibleNamespaces.length = startVisibleNamespaces;
    		return;
    	case DOCUMENT_NODE:
    	case DOCUMENT_FRAGMENT_NODE:
    		var child = node.firstChild;
    		while(child){
    			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
    			child = child.nextSibling;
    		}
    		return;
    	case ATTRIBUTE_NODE:
    		/**
    		 * Well-formedness constraint: No < in Attribute Values
    		 * The replacement text of any entity referred to directly or indirectly in an attribute value must not contain a <.
    		 * @see https://www.w3.org/TR/xml/#CleanAttrVals
    		 * @see https://www.w3.org/TR/xml/#NT-AttValue
    		 */
    		return buf.push(' ', node.name, '="', node.value.replace(/[<&"]/g,_xmlEncoder), '"');
    	case TEXT_NODE:
    		/**
    		 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
    		 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
    		 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
    		 * `&amp;` and `&lt;` respectively.
    		 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
    		 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
    		 * when that string is not marking the end of a CDATA section.
    		 *
    		 * In the content of elements, character data is any string of characters
    		 * which does not contain the start-delimiter of any markup
    		 * and does not include the CDATA-section-close delimiter, `]]>`.
    		 *
    		 * @see https://www.w3.org/TR/xml/#NT-CharData
    		 */
    		return buf.push(node.data
    			.replace(/[<&]/g,_xmlEncoder)
    			.replace(/]]>/g, ']]&gt;')
    		);
    	case CDATA_SECTION_NODE:
    		return buf.push( '<![CDATA[',node.data,']]>');
    	case COMMENT_NODE:
    		return buf.push( "<!--",node.data,"-->");
    	case DOCUMENT_TYPE_NODE:
    		var pubid = node.publicId;
    		var sysid = node.systemId;
    		buf.push('<!DOCTYPE ',node.name);
    		if(pubid){
    			buf.push(' PUBLIC ', pubid);
    			if (sysid && sysid!='.') {
    				buf.push(' ', sysid);
    			}
    			buf.push('>');
    		}else if(sysid && sysid!='.'){
    			buf.push(' SYSTEM ', sysid, '>');
    		}else {
    			var sub = node.internalSubset;
    			if(sub){
    				buf.push(" [",sub,"]");
    			}
    			buf.push(">");
    		}
    		return;
    	case PROCESSING_INSTRUCTION_NODE:
    		return buf.push( "<?",node.target," ",node.data,"?>");
    	case ENTITY_REFERENCE_NODE:
    		return buf.push( '&',node.nodeName,';');
    	//case ENTITY_NODE:
    	//case NOTATION_NODE:
    	default:
    		buf.push('??',node.nodeName);
    	}
    }
    function importNode(doc,node,deep){
    	var node2;
    	switch (node.nodeType) {
    	case ELEMENT_NODE:
    		node2 = node.cloneNode(false);
    		node2.ownerDocument = doc;
    		//var attrs = node2.attributes;
    		//var len = attrs.length;
    		//for(var i=0;i<len;i++){
    			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
    		//}
    	case DOCUMENT_FRAGMENT_NODE:
    		break;
    	case ATTRIBUTE_NODE:
    		deep = true;
    		break;
    	//case ENTITY_REFERENCE_NODE:
    	//case PROCESSING_INSTRUCTION_NODE:
    	////case TEXT_NODE:
    	//case CDATA_SECTION_NODE:
    	//case COMMENT_NODE:
    	//	deep = false;
    	//	break;
    	//case DOCUMENT_NODE:
    	//case DOCUMENT_TYPE_NODE:
    	//cannot be imported.
    	//case ENTITY_NODE:
    	//case NOTATION_NODE：
    	//can not hit in level3
    	//default:throw e;
    	}
    	if(!node2){
    		node2 = node.cloneNode(false);//false
    	}
    	node2.ownerDocument = doc;
    	node2.parentNode = null;
    	if(deep){
    		var child = node.firstChild;
    		while(child){
    			node2.appendChild(importNode(doc,child,deep));
    			child = child.nextSibling;
    		}
    	}
    	return node2;
    }
    //
    //var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
    //					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
    function cloneNode(doc,node,deep){
    	var node2 = new node.constructor();
    	for(var n in node){
    		var v = node[n];
    		if(typeof v != 'object' ){
    			if(v != node2[n]){
    				node2[n] = v;
    			}
    		}
    	}
    	if(node.childNodes){
    		node2.childNodes = new NodeList();
    	}
    	node2.ownerDocument = doc;
    	switch (node2.nodeType) {
    	case ELEMENT_NODE:
    		var attrs	= node.attributes;
    		var attrs2	= node2.attributes = new NamedNodeMap();
    		var len = attrs.length;
    		attrs2._ownerElement = node2;
    		for(var i=0;i<len;i++){
    			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
    		}
    		break;	case ATTRIBUTE_NODE:
    		deep = true;
    	}
    	if(deep){
    		var child = node.firstChild;
    		while(child){
    			node2.appendChild(cloneNode(doc,child,deep));
    			child = child.nextSibling;
    		}
    	}
    	return node2;
    }

    function __set__(object,key,value){
    	object[key] = value;
    }
    //do dynamic
    try{
    	if(Object.defineProperty){
    		Object.defineProperty(LiveNodeList.prototype,'length',{
    			get:function(){
    				_updateLiveList(this);
    				return this.$$length;
    			}
    		});
    		Object.defineProperty(Node$1.prototype,'textContent',{
    			get:function(){
    				return getTextContent(this);
    			},
    			set:function(data){
    				switch(this.nodeType){
    				case ELEMENT_NODE:
    				case DOCUMENT_FRAGMENT_NODE:
    					while(this.firstChild){
    						this.removeChild(this.firstChild);
    					}
    					if(data || String(data)){
    						this.appendChild(this.ownerDocument.createTextNode(data));
    					}
    					break;
    				default:
    					//TODO:
    					this.data = data;
    					this.value = data;
    					this.nodeValue = data;
    				}
    			}
    		});
    		
    		function getTextContent(node){
    			switch(node.nodeType){
    			case ELEMENT_NODE:
    			case DOCUMENT_FRAGMENT_NODE:
    				var buf = [];
    				node = node.firstChild;
    				while(node){
    					if(node.nodeType!==7 && node.nodeType !==8){
    						buf.push(getTextContent(node));
    					}
    					node = node.nextSibling;
    				}
    				return buf.join('');
    			default:
    				return node.nodeValue;
    			}
    		}
    		__set__ = function(object,key,value){
    			//console.log(value)
    			object['$$'+key] = value;
    		};
    	}
    }catch(e){//ie8
    }

    //if(typeof require == 'function'){
    	var Node_1 = Node$1;
    	var DOMException_1 = DOMException;
    	var DOMImplementation_1 = DOMImplementation;
    	var XMLSerializer_1 = XMLSerializer;
    //}

    var dom = {
    	Node: Node_1,
    	DOMException: DOMException_1,
    	DOMImplementation: DOMImplementation_1,
    	XMLSerializer: XMLSerializer_1
    };

    var domParser = createCommonjsModule(function (module, exports) {
    function DOMParser(options){
    	this.options = options ||{locator:{}};
    }

    DOMParser.prototype.parseFromString = function(source,mimeType){
    	var options = this.options;
    	var sax =  new XMLReader();
    	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
    	var errorHandler = options.errorHandler;
    	var locator = options.locator;
    	var defaultNSMap = options.xmlns||{};
    	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
      	var entityMap = isHTML?entities.entityMap:{'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"};
    	if(locator){
    		domBuilder.setDocumentLocator(locator);
    	}

    	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
    	sax.domBuilder = options.domBuilder || domBuilder;
    	if(isHTML){
    		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
    	}
    	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
    	if(source && typeof source === 'string'){
    		sax.parse(source,defaultNSMap,entityMap);
    	}else {
    		sax.errorHandler.error("invalid doc source");
    	}
    	return domBuilder.doc;
    };
    function buildErrorHandler(errorImpl,domBuilder,locator){
    	if(!errorImpl){
    		if(domBuilder instanceof DOMHandler){
    			return domBuilder;
    		}
    		errorImpl = domBuilder ;
    	}
    	var errorHandler = {};
    	var isCallback = errorImpl instanceof Function;
    	locator = locator||{};
    	function build(key){
    		var fn = errorImpl[key];
    		if(!fn && isCallback){
    			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg);}:errorImpl;
    		}
    		errorHandler[key] = fn && function(msg){
    			fn('[xmldom '+key+']\t'+msg+_locator(locator));
    		}||function(){};
    	}
    	build('warning');
    	build('error');
    	build('fatalError');
    	return errorHandler;
    }

    //console.log('#\n\n\n\n\n\n\n####')
    /**
     * +ContentHandler+ErrorHandler
     * +LexicalHandler+EntityResolver2
     * -DeclHandler-DTDHandler
     *
     * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
     * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
     * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
     */
    function DOMHandler() {
        this.cdata = false;
    }
    function position(locator,node){
    	node.lineNumber = locator.lineNumber;
    	node.columnNumber = locator.columnNumber;
    }
    /**
     * @see org.xml.sax.ContentHandler#startDocument
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
     */
    DOMHandler.prototype = {
    	startDocument : function() {
        	this.doc = new DOMImplementation().createDocument(null, null, null);
        	if (this.locator) {
            	this.doc.documentURI = this.locator.systemId;
        	}
    	},
    	startElement:function(namespaceURI, localName, qName, attrs) {
    		var doc = this.doc;
    	    var el = doc.createElementNS(namespaceURI, qName||localName);
    	    var len = attrs.length;
    	    appendElement(this, el);
    	    this.currentElement = el;

    		this.locator && position(this.locator,el);
    	    for (var i = 0 ; i < len; i++) {
    	        var namespaceURI = attrs.getURI(i);
    	        var value = attrs.getValue(i);
    	        var qName = attrs.getQName(i);
    			var attr = doc.createAttributeNS(namespaceURI, qName);
    			this.locator &&position(attrs.getLocator(i),attr);
    			attr.value = attr.nodeValue = value;
    			el.setAttributeNode(attr);
    	    }
    	},
    	endElement:function(namespaceURI, localName, qName) {
    		var current = this.currentElement;
    		var tagName = current.tagName;
    		this.currentElement = current.parentNode;
    	},
    	startPrefixMapping:function(prefix, uri) {
    	},
    	endPrefixMapping:function(prefix) {
    	},
    	processingInstruction:function(target, data) {
    	    var ins = this.doc.createProcessingInstruction(target, data);
    	    this.locator && position(this.locator,ins);
    	    appendElement(this, ins);
    	},
    	ignorableWhitespace:function(ch, start, length) {
    	},
    	characters:function(chars, start, length) {
    		chars = _toString.apply(this,arguments);
    		//console.log(chars)
    		if(chars){
    			if (this.cdata) {
    				var charNode = this.doc.createCDATASection(chars);
    			} else {
    				var charNode = this.doc.createTextNode(chars);
    			}
    			if(this.currentElement){
    				this.currentElement.appendChild(charNode);
    			}else if(/^\s*$/.test(chars)){
    				this.doc.appendChild(charNode);
    				//process xml
    			}
    			this.locator && position(this.locator,charNode);
    		}
    	},
    	skippedEntity:function(name) {
    	},
    	endDocument:function() {
    		this.doc.normalize();
    	},
    	setDocumentLocator:function (locator) {
    	    if(this.locator = locator){// && !('lineNumber' in locator)){
    	    	locator.lineNumber = 0;
    	    }
    	},
    	//LexicalHandler
    	comment:function(chars, start, length) {
    		chars = _toString.apply(this,arguments);
    	    var comm = this.doc.createComment(chars);
    	    this.locator && position(this.locator,comm);
    	    appendElement(this, comm);
    	},

    	startCDATA:function() {
    	    //used in characters() methods
    	    this.cdata = true;
    	},
    	endCDATA:function() {
    	    this.cdata = false;
    	},

    	startDTD:function(name, publicId, systemId) {
    		var impl = this.doc.implementation;
    	    if (impl && impl.createDocumentType) {
    	        var dt = impl.createDocumentType(name, publicId, systemId);
    	        this.locator && position(this.locator,dt);
    	        appendElement(this, dt);
    	    }
    	},
    	/**
    	 * @see org.xml.sax.ErrorHandler
    	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
    	 */
    	warning:function(error) {
    		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
    	},
    	error:function(error) {
    		console.error('[xmldom error]\t'+error,_locator(this.locator));
    	},
    	fatalError:function(error) {
    		throw new ParseError(error, this.locator);
    	}
    };
    function _locator(l){
    	if(l){
    		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
    	}
    }
    function _toString(chars,start,length){
    	if(typeof chars == 'string'){
    		return chars.substr(start,length)
    	}else {//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
    		if(chars.length >= start+length || start){
    			return new java.lang.String(chars,start,length)+'';
    		}
    		return chars;
    	}
    }

    /*
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
     * used method of org.xml.sax.ext.LexicalHandler:
     *  #comment(chars, start, length)
     *  #startCDATA()
     *  #endCDATA()
     *  #startDTD(name, publicId, systemId)
     *
     *
     * IGNORED method of org.xml.sax.ext.LexicalHandler:
     *  #endDTD()
     *  #startEntity(name)
     *  #endEntity(name)
     *
     *
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
     * IGNORED method of org.xml.sax.ext.DeclHandler
     * 	#attributeDecl(eName, aName, type, mode, value)
     *  #elementDecl(name, model)
     *  #externalEntityDecl(name, publicId, systemId)
     *  #internalEntityDecl(name, value)
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
     * IGNORED method of org.xml.sax.EntityResolver2
     *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
     *  #resolveEntity(publicId, systemId)
     *  #getExternalSubset(name, baseURI)
     * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
     * IGNORED method of org.xml.sax.DTDHandler
     *  #notationDecl(name, publicId, systemId) {};
     *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
     */
    "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
    	DOMHandler.prototype[key] = function(){return null};
    });

    /* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
    function appendElement (hander,node) {
        if (!hander.currentElement) {
            hander.doc.appendChild(node);
        } else {
            hander.currentElement.appendChild(node);
        }
    }//appendChild and setAttributeNS are preformance key

    //if(typeof require == 'function'){


    var XMLReader = sax.XMLReader;
    var ParseError = sax.ParseError;
    var DOMImplementation = exports.DOMImplementation = dom.DOMImplementation;
    exports.XMLSerializer = dom.XMLSerializer ;
    exports.DOMParser = DOMParser;
    exports.__DOMHandler = DOMHandler;
    //}
    });
    var domParser_1 = domParser.DOMImplementation;
    var domParser_2 = domParser.XMLSerializer;
    var domParser_3 = domParser.DOMParser;
    var domParser_4 = domParser.__DOMHandler;

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var parser = new domParser_3();
    function parseXML(str) {
        try {
            var dom = parser.parseFromString(str, "application/xml");
            throwIfError(dom);
            var obj = domToObject(dom.childNodes[0]);
            return Promise.resolve(obj);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    var errorNS = "";
    try {
        errorNS = parser.parseFromString("INVALID", "text/xml").getElementsByTagName("parsererror")[0]
            .namespaceURI;
    }
    catch (ignored) {
        // Most browsers will return a document containing <parsererror>, but IE will throw.
    }
    function throwIfError(dom) {
        if (errorNS) {
            var parserErrors = dom.getElementsByTagNameNS(errorNS, "parsererror");
            if (parserErrors.length) {
                throw new Error(parserErrors.item(0).innerHTML);
            }
        }
    }
    function isElement(node) {
        return !!node.attributes;
    }
    /**
     * Get the Element-typed version of the provided Node if the provided node is an element with
     * attributes. If it isn't, then undefined is returned.
     */
    function asElementWithAttributes(node) {
        return isElement(node) && node.hasAttributes() ? node : undefined;
    }
    function domToObject(node) {
        var result = {};
        var childNodeCount = node.childNodes.length;
        var firstChildNode = node.childNodes[0];
        var onlyChildTextValue = (firstChildNode &&
            childNodeCount === 1 &&
            firstChildNode.nodeType === Node.TEXT_NODE &&
            firstChildNode.nodeValue) ||
            undefined;
        var elementWithAttributes = asElementWithAttributes(node);
        if (elementWithAttributes) {
            result["$"] = {};
            for (var i = 0; i < elementWithAttributes.attributes.length; i++) {
                var attr = elementWithAttributes.attributes[i];
                result["$"][attr.nodeName] = attr.nodeValue;
            }
            if (onlyChildTextValue) {
                result["_"] = onlyChildTextValue;
            }
        }
        else if (childNodeCount === 0) {
            result = "";
        }
        else if (onlyChildTextValue) {
            result = onlyChildTextValue;
        }
        if (!onlyChildTextValue) {
            for (var i = 0; i < childNodeCount; i++) {
                var child = node.childNodes[i];
                // Ignore leading/trailing whitespace nodes
                if (child.nodeType !== Node.TEXT_NODE) {
                    var childObject = domToObject(child);
                    if (!result[child.nodeName]) {
                        result[child.nodeName] = childObject;
                    }
                    else if (Array.isArray(result[child.nodeName])) {
                        result[child.nodeName].push(childObject);
                    }
                    else {
                        result[child.nodeName] = [result[child.nodeName], childObject];
                    }
                }
            }
        }
        return result;
    }
    // tslint:disable-next-line:no-null-keyword
    var doc = document.implementation.createDocument(null, null, null);
    var serializer = new domParser_2();
    function stringifyXML(obj, opts) {
        var rootName = (opts && opts.rootName) || "root";
        var dom = buildNode(obj, rootName)[0];
        return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + serializer.serializeToString(dom));
    }
    function buildAttributes(attrs) {
        var result = [];
        for (var _i = 0, _a = Object.keys(attrs); _i < _a.length; _i++) {
            var key = _a[_i];
            var attr = doc.createAttribute(key);
            attr.value = attrs[key].toString();
            result.push(attr);
        }
        return result;
    }
    function buildNode(obj, elementName) {
        if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
            var elem = doc.createElement(elementName);
            elem.textContent = obj.toString();
            return [elem];
        }
        else if (Array.isArray(obj)) {
            var result = [];
            for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                var arrayElem = obj_1[_i];
                for (var _a = 0, _b = buildNode(arrayElem, elementName); _a < _b.length; _a++) {
                    var child = _b[_a];
                    result.push(child);
                }
            }
            return result;
        }
        else if (typeof obj === "object") {
            var elem = doc.createElement(elementName);
            for (var _c = 0, _d = Object.keys(obj); _c < _d.length; _c++) {
                var key = _d[_c];
                if (key === "$") {
                    for (var _e = 0, _f = buildAttributes(obj[key]); _e < _f.length; _e++) {
                        var attr = _f[_e];
                        elem.attributes.setNamedItem(attr);
                    }
                }
                else {
                    for (var _g = 0, _h = buildNode(obj[key], key); _g < _h.length; _g++) {
                        var child = _h[_g];
                        elem.appendChild(child);
                    }
                }
            }
            return [elem];
        }
        else {
            throw new Error("Illegal value passed to buildObject: " + obj);
        }
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var BaseRequestPolicy = /** @class */ (function () {
        function BaseRequestPolicy(_nextPolicy, _options) {
            this._nextPolicy = _nextPolicy;
            this._options = _options;
        }
        /**
         * Get whether or not a log with the provided log level should be logged.
         * @param logLevel The log level of the log that will be logged.
         * @returns Whether or not a log with the provided log level should be logged.
         */
        BaseRequestPolicy.prototype.shouldLog = function (logLevel) {
            return this._options.shouldLog(logLevel);
        };
        /**
         * Attempt to log the provided message to the provided logger. If no logger was provided or if
         * the log level does not meat the logger's threshold, then nothing will be logged.
         * @param logLevel The log level of this log.
         * @param message The message of this log.
         */
        BaseRequestPolicy.prototype.log = function (logLevel, message) {
            this._options.log(logLevel, message);
        };
        return BaseRequestPolicy;
    }());
    /**
     * Optional properties that can be used when creating a RequestPolicy.
     */
    var RequestPolicyOptions = /** @class */ (function () {
        function RequestPolicyOptions(_logger) {
            this._logger = _logger;
        }
        /**
         * Get whether or not a log with the provided log level should be logged.
         * @param logLevel The log level of the log that will be logged.
         * @returns Whether or not a log with the provided log level should be logged.
         */
        RequestPolicyOptions.prototype.shouldLog = function (logLevel) {
            return (!!this._logger &&
                logLevel !== exports.HttpPipelineLogLevel.OFF &&
                logLevel <= this._logger.minimumLogLevel);
        };
        /**
         * Attempt to log the provided message to the provided logger. If no logger was provided or if
         * the log level does not meat the logger's threshold, then nothing will be logged.
         * @param logLevel The log level of this log.
         * @param message The message of this log.
         */
        RequestPolicyOptions.prototype.log = function (logLevel, message) {
            if (this._logger && this.shouldLog(logLevel)) {
                this._logger.log(logLevel, message);
            }
        };
        return RequestPolicyOptions;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * Create a new serialization RequestPolicyCreator that will serialized HTTP request bodies as they
     * pass through the HTTP pipeline.
     */
    function deserializationPolicy(deserializationContentTypes) {
        return {
            create: function (nextPolicy, options) {
                return new DeserializationPolicy(nextPolicy, deserializationContentTypes, options);
            },
        };
    }
    var defaultJsonContentTypes = ["application/json", "text/json"];
    var defaultXmlContentTypes = ["application/xml", "application/atom+xml"];
    /**
     * A RequestPolicy that will deserialize HTTP response bodies and headers as they pass through the
     * HTTP pipeline.
     */
    var DeserializationPolicy = /** @class */ (function (_super) {
        __extends(DeserializationPolicy, _super);
        function DeserializationPolicy(nextPolicy, deserializationContentTypes, options) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.jsonContentTypes =
                (deserializationContentTypes && deserializationContentTypes.json) || defaultJsonContentTypes;
            _this.xmlContentTypes =
                (deserializationContentTypes && deserializationContentTypes.xml) || defaultXmlContentTypes;
            return _this;
        }
        DeserializationPolicy.prototype.sendRequest = function (request) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._nextPolicy
                            .sendRequest(request)
                            .then(function (response) {
                            return deserializeResponseBody(_this.jsonContentTypes, _this.xmlContentTypes, response);
                        })];
                });
            });
        };
        return DeserializationPolicy;
    }(BaseRequestPolicy));
    function getOperationResponse(parsedResponse) {
        var result;
        var request = parsedResponse.request;
        var operationSpec = request.operationSpec;
        if (operationSpec) {
            var operationResponseGetter = request.operationResponseGetter;
            if (!operationResponseGetter) {
                result = operationSpec.responses[parsedResponse.status];
            }
            else {
                result = operationResponseGetter(operationSpec, parsedResponse);
            }
        }
        return result;
    }
    function shouldDeserializeResponse(parsedResponse) {
        var shouldDeserialize = parsedResponse.request.shouldDeserialize;
        var result;
        if (shouldDeserialize === undefined) {
            result = true;
        }
        else if (typeof shouldDeserialize === "boolean") {
            result = shouldDeserialize;
        }
        else {
            result = shouldDeserialize(parsedResponse);
        }
        return result;
    }
    function deserializeResponseBody(jsonContentTypes, xmlContentTypes, response) {
        return parse$1(jsonContentTypes, xmlContentTypes, response).then(function (parsedResponse) {
            var shouldDeserialize = shouldDeserializeResponse(parsedResponse);
            if (shouldDeserialize) {
                var operationSpec = parsedResponse.request.operationSpec;
                if (operationSpec && operationSpec.responses) {
                    var statusCode = parsedResponse.status;
                    var expectedStatusCodes = Object.keys(operationSpec.responses);
                    var hasNoExpectedStatusCodes = expectedStatusCodes.length === 0 ||
                        (expectedStatusCodes.length === 1 && expectedStatusCodes[0] === "default");
                    var responseSpec = getOperationResponse(parsedResponse);
                    var isExpectedStatusCode = hasNoExpectedStatusCodes
                        ? 200 <= statusCode && statusCode < 300
                        : !!responseSpec;
                    if (!isExpectedStatusCode) {
                        var defaultResponseSpec = operationSpec.responses.default;
                        if (defaultResponseSpec) {
                            var initialErrorMessage = isStreamOperation(operationSpec)
                                ? "Unexpected status code: " + statusCode
                                : parsedResponse.bodyAsText;
                            var error = new RestError(initialErrorMessage);
                            error.statusCode = statusCode;
                            error.request = stripRequest(parsedResponse.request);
                            error.response = stripResponse(parsedResponse);
                            var parsedErrorResponse = parsedResponse.parsedBody;
                            try {
                                if (parsedErrorResponse) {
                                    var defaultResponseBodyMapper = defaultResponseSpec.bodyMapper;
                                    if (defaultResponseBodyMapper &&
                                        defaultResponseBodyMapper.serializedName === "CloudError") {
                                        if (parsedErrorResponse.error) {
                                            parsedErrorResponse = parsedErrorResponse.error;
                                        }
                                        if (parsedErrorResponse.code) {
                                            error.code = parsedErrorResponse.code;
                                        }
                                        if (parsedErrorResponse.message) {
                                            error.message = parsedErrorResponse.message;
                                        }
                                    }
                                    else {
                                        var internalError = parsedErrorResponse;
                                        if (parsedErrorResponse.error) {
                                            internalError = parsedErrorResponse.error;
                                        }
                                        error.code = internalError.code;
                                        if (internalError.message) {
                                            error.message = internalError.message;
                                        }
                                    }
                                    if (defaultResponseBodyMapper) {
                                        var valueToDeserialize = parsedErrorResponse;
                                        if (operationSpec.isXML &&
                                            defaultResponseBodyMapper.type.name === MapperType.Sequence) {
                                            valueToDeserialize =
                                                typeof parsedErrorResponse === "object"
                                                    ? parsedErrorResponse[defaultResponseBodyMapper.xmlElementName]
                                                    : [];
                                        }
                                        error.body = operationSpec.serializer.deserialize(defaultResponseBodyMapper, valueToDeserialize, "error.body");
                                    }
                                }
                            }
                            catch (defaultError) {
                                error.message = "Error \"" + defaultError.message + "\" occurred in deserializing the responseBody - \"" + parsedResponse.bodyAsText + "\" for the default response.";
                            }
                            return Promise.reject(error);
                        }
                    }
                    else if (responseSpec) {
                        if (responseSpec.bodyMapper) {
                            var valueToDeserialize = parsedResponse.parsedBody;
                            if (operationSpec.isXML && responseSpec.bodyMapper.type.name === MapperType.Sequence) {
                                valueToDeserialize =
                                    typeof valueToDeserialize === "object"
                                        ? valueToDeserialize[responseSpec.bodyMapper.xmlElementName]
                                        : [];
                            }
                            try {
                                parsedResponse.parsedBody = operationSpec.serializer.deserialize(responseSpec.bodyMapper, valueToDeserialize, "operationRes.parsedBody");
                            }
                            catch (error) {
                                var restError = new RestError("Error " + error + " occurred in deserializing the responseBody - " + parsedResponse.bodyAsText);
                                restError.request = stripRequest(parsedResponse.request);
                                restError.response = stripResponse(parsedResponse);
                                return Promise.reject(restError);
                            }
                        }
                        else if (operationSpec.httpMethod === "HEAD") {
                            // head methods never have a body, but we return a boolean to indicate presence/absence of the resource
                            parsedResponse.parsedBody = response.status >= 200 && response.status < 300;
                        }
                        if (responseSpec.headersMapper) {
                            parsedResponse.parsedHeaders = operationSpec.serializer.deserialize(responseSpec.headersMapper, parsedResponse.headers.rawHeaders(), "operationRes.parsedHeaders");
                        }
                    }
                }
            }
            return Promise.resolve(parsedResponse);
        });
    }
    function parse$1(jsonContentTypes, xmlContentTypes, operationResponse) {
        var errorHandler = function (err) {
            var msg = "Error \"" + err + "\" occurred while parsing the response body - " + operationResponse.bodyAsText + ".";
            var errCode = err.code || RestError.PARSE_ERROR;
            var e = new RestError(msg, errCode, operationResponse.status, operationResponse.request, operationResponse, operationResponse.bodyAsText);
            return Promise.reject(e);
        };
        if (!operationResponse.request.streamResponseBody && operationResponse.bodyAsText) {
            var text_1 = operationResponse.bodyAsText;
            var contentType = operationResponse.headers.get("Content-Type") || "";
            var contentComponents = !contentType
                ? []
                : contentType.split(";").map(function (component) { return component.toLowerCase(); });
            if (contentComponents.length === 0 ||
                contentComponents.some(function (component) { return jsonContentTypes.indexOf(component) !== -1; })) {
                return new Promise(function (resolve) {
                    operationResponse.parsedBody = JSON.parse(text_1);
                    resolve(operationResponse);
                }).catch(errorHandler);
            }
            else if (contentComponents.some(function (component) { return xmlContentTypes.indexOf(component) !== -1; })) {
                return parseXML(text_1)
                    .then(function (body) {
                    operationResponse.parsedBody = body;
                    return operationResponse;
                })
                    .catch(errorHandler);
            }
        }
        return Promise.resolve(operationResponse);
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function exponentialRetryPolicy(retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
        return {
            create: function (nextPolicy, options) {
                return new ExponentialRetryPolicy(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval);
            },
        };
    }
    var DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;
    var DEFAULT_CLIENT_RETRY_COUNT = 3;
    var DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;
    var DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;
    /**
     * @class
     * Instantiates a new "ExponentialRetryPolicyFilter" instance.
     */
    var ExponentialRetryPolicy = /** @class */ (function (_super) {
        __extends(ExponentialRetryPolicy, _super);
        /**
         * @constructor
         * @param {RequestPolicy} nextPolicy The next RequestPolicy in the pipeline chain.
         * @param {RequestPolicyOptionsLike} options The options for this RequestPolicy.
         * @param {number} [retryCount]        The client retry count.
         * @param {number} [retryInterval]     The client retry interval, in milliseconds.
         * @param {number} [minRetryInterval]  The minimum retry interval, in milliseconds.
         * @param {number} [maxRetryInterval]  The maximum retry interval, in milliseconds.
         */
        function ExponentialRetryPolicy(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
            var _this = _super.call(this, nextPolicy, options) || this;
            function isNumber(n) {
                return typeof n === "number";
            }
            _this.retryCount = isNumber(retryCount) ? retryCount : DEFAULT_CLIENT_RETRY_COUNT;
            _this.retryInterval = isNumber(retryInterval) ? retryInterval : DEFAULT_CLIENT_RETRY_INTERVAL;
            _this.minRetryInterval = isNumber(minRetryInterval)
                ? minRetryInterval
                : DEFAULT_CLIENT_MIN_RETRY_INTERVAL;
            _this.maxRetryInterval = isNumber(maxRetryInterval)
                ? maxRetryInterval
                : DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
            return _this;
        }
        ExponentialRetryPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy
                .sendRequest(request.clone())
                .then(function (response) { return retry(_this, request, response); })
                .catch(function (error) { return retry(_this, request, error.response, undefined, error); });
        };
        return ExponentialRetryPolicy;
    }(BaseRequestPolicy));
    /**
     * Determines if the operation should be retried and how long to wait until the next retry.
     *
     * @param {ExponentialRetryPolicy} policy The ExponentialRetryPolicy that this function is being called against.
     * @param {number} statusCode The HTTP status code.
     * @param {RetryData} retryData  The retry data.
     * @return {boolean} True if the operation qualifies for a retry; false otherwise.
     */
    function shouldRetry(policy, statusCode, retryData) {
        if (statusCode == undefined ||
            (statusCode < 500 && statusCode !== 408) ||
            statusCode === 501 ||
            statusCode === 505) {
            return false;
        }
        var currentCount;
        if (!retryData) {
            throw new Error("retryData for the ExponentialRetryPolicyFilter cannot be null.");
        }
        else {
            currentCount = retryData && retryData.retryCount;
        }
        return currentCount < policy.retryCount;
    }
    /**
     * Updates the retry data for the next attempt.
     *
     * @param {ExponentialRetryPolicy} policy The ExponentialRetryPolicy that this function is being called against.
     * @param {RetryData} retryData  The retry data.
     * @param {RetryError} [err] The operation"s error, if any.
     */
    function updateRetryData(policy, retryData, err) {
        if (!retryData) {
            retryData = {
                retryCount: 0,
                retryInterval: 0,
            };
        }
        if (err) {
            if (retryData.error) {
                err.innerError = retryData.error;
            }
            retryData.error = err;
        }
        // Adjust retry count
        retryData.retryCount++;
        // Adjust retry interval
        var incrementDelta = Math.pow(2, retryData.retryCount) - 1;
        var boundedRandDelta = policy.retryInterval * 0.8 +
            Math.floor(Math.random() * (policy.retryInterval * 1.2 - policy.retryInterval * 0.8));
        incrementDelta *= boundedRandDelta;
        retryData.retryInterval = Math.min(policy.minRetryInterval + incrementDelta, policy.maxRetryInterval);
        return retryData;
    }
    function retry(policy, request, response, retryData, requestError) {
        retryData = updateRetryData(policy, retryData, requestError);
        var isAborted = request.abortSignal && request.abortSignal.aborted;
        if (!isAborted && shouldRetry(policy, response && response.status, retryData)) {
            return delay(retryData.retryInterval)
                .then(function () { return policy._nextPolicy.sendRequest(request.clone()); })
                .then(function (res) { return retry(policy, request, res, retryData, undefined); })
                .catch(function (err) { return retry(policy, request, response, retryData, err); });
        }
        else if (isAborted || requestError || !response) {
            // If the operation failed in the end, return all errors instead of just the last one
            var err = retryData.error ||
                new RestError("Failed to send the request.", RestError.REQUEST_SEND_ERROR, response && response.status, response && response.request, response);
            return Promise.reject(err);
        }
        else {
            return Promise.resolve(response);
        }
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function generateClientRequestIdPolicy(requestIdHeaderName) {
        if (requestIdHeaderName === void 0) { requestIdHeaderName = "x-ms-client-request-id"; }
        return {
            create: function (nextPolicy, options) {
                return new GenerateClientRequestIdPolicy(nextPolicy, options, requestIdHeaderName);
            },
        };
    }
    var GenerateClientRequestIdPolicy = /** @class */ (function (_super) {
        __extends(GenerateClientRequestIdPolicy, _super);
        function GenerateClientRequestIdPolicy(nextPolicy, options, _requestIdHeaderName) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this._requestIdHeaderName = _requestIdHeaderName;
            return _this;
        }
        GenerateClientRequestIdPolicy.prototype.sendRequest = function (request) {
            if (!request.headers.contains(this._requestIdHeaderName)) {
                request.headers.set(this._requestIdHeaderName, generateUuid());
            }
            return this._nextPolicy.sendRequest(request);
        };
        return GenerateClientRequestIdPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See License.txt in the project root for license information.
    function getDefaultUserAgentKey() {
        return "x-ms-command-name";
    }
    function getPlatformSpecificData() {
        var navigator = window.navigator;
        var osInfo = {
            key: "OS",
            value: (navigator.oscpu || navigator.platform).replace(" ", ""),
        };
        return [osInfo];
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function getRuntimeInfo() {
        var msRestRuntime = {
            key: "ms-rest-js",
            value: Constants.msRestVersion,
        };
        return [msRestRuntime];
    }
    function getUserAgentString(telemetryInfo, keySeparator, valueSeparator) {
        if (keySeparator === void 0) { keySeparator = " "; }
        if (valueSeparator === void 0) { valueSeparator = "/"; }
        return telemetryInfo
            .map(function (info) {
            var value = info.value ? "" + valueSeparator + info.value : "";
            return "" + info.key + value;
        })
            .join(keySeparator);
    }
    var getDefaultUserAgentHeaderName = getDefaultUserAgentKey;
    function getDefaultUserAgentValue() {
        var runtimeInfo = getRuntimeInfo();
        var platformSpecificData = getPlatformSpecificData();
        var userAgent = getUserAgentString(runtimeInfo.concat(platformSpecificData));
        return userAgent;
    }
    function userAgentPolicy(userAgentData) {
        var key = !userAgentData || userAgentData.key == undefined ? getDefaultUserAgentKey() : userAgentData.key;
        var value = !userAgentData || userAgentData.value == undefined
            ? getDefaultUserAgentValue()
            : userAgentData.value;
        return {
            create: function (nextPolicy, options) {
                return new UserAgentPolicy(nextPolicy, options, key, value);
            },
        };
    }
    var UserAgentPolicy = /** @class */ (function (_super) {
        __extends(UserAgentPolicy, _super);
        function UserAgentPolicy(_nextPolicy, _options, headerKey, headerValue) {
            var _this = _super.call(this, _nextPolicy, _options) || this;
            _this._nextPolicy = _nextPolicy;
            _this._options = _options;
            _this.headerKey = headerKey;
            _this.headerValue = headerValue;
            return _this;
        }
        UserAgentPolicy.prototype.sendRequest = function (request) {
            this.addUserAgentHeader(request);
            return this._nextPolicy.sendRequest(request);
        };
        UserAgentPolicy.prototype.addUserAgentHeader = function (request) {
            if (!request.headers) {
                request.headers = new HttpHeaders();
            }
            if (!request.headers.get(this.headerKey) && this.headerValue) {
                request.headers.set(this.headerKey, this.headerValue);
            }
        };
        return UserAgentPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * A class that handles the query portion of a URLBuilder.
     */
    var URLQuery = /** @class */ (function () {
        function URLQuery() {
            this._rawQuery = {};
        }
        /**
         * Get whether or not there any query parameters in this URLQuery.
         */
        URLQuery.prototype.any = function () {
            return Object.keys(this._rawQuery).length > 0;
        };
        /**
         * Set a query parameter with the provided name and value. If the parameterValue is undefined or
         * empty, then this will attempt to remove an existing query parameter with the provided
         * parameterName.
         */
        URLQuery.prototype.set = function (parameterName, parameterValue) {
            if (parameterName) {
                if (parameterValue != undefined) {
                    var newValue = Array.isArray(parameterValue) ? parameterValue : parameterValue.toString();
                    this._rawQuery[parameterName] = newValue;
                }
                else {
                    delete this._rawQuery[parameterName];
                }
            }
        };
        /**
         * Get the value of the query parameter with the provided name. If no parameter exists with the
         * provided parameter name, then undefined will be returned.
         */
        URLQuery.prototype.get = function (parameterName) {
            return parameterName ? this._rawQuery[parameterName] : undefined;
        };
        /**
         * Get the string representation of this query. The return value will not start with a "?".
         */
        URLQuery.prototype.toString = function () {
            var result = "";
            for (var parameterName in this._rawQuery) {
                if (result) {
                    result += "&";
                }
                var parameterValue = this._rawQuery[parameterName];
                if (Array.isArray(parameterValue)) {
                    var parameterStrings = [];
                    for (var _i = 0, parameterValue_1 = parameterValue; _i < parameterValue_1.length; _i++) {
                        var parameterValueElement = parameterValue_1[_i];
                        parameterStrings.push(parameterName + "=" + parameterValueElement);
                    }
                    result += parameterStrings.join("&");
                }
                else {
                    result += parameterName + "=" + parameterValue;
                }
            }
            return result;
        };
        /**
         * Parse a URLQuery from the provided text.
         */
        URLQuery.parse = function (text) {
            var result = new URLQuery();
            if (text) {
                if (text.startsWith("?")) {
                    text = text.substring(1);
                }
                var currentState = "ParameterName";
                var parameterName = "";
                var parameterValue = "";
                for (var i = 0; i < text.length; ++i) {
                    var currentCharacter = text[i];
                    switch (currentState) {
                        case "ParameterName":
                            switch (currentCharacter) {
                                case "=":
                                    currentState = "ParameterValue";
                                    break;
                                case "&":
                                    parameterName = "";
                                    parameterValue = "";
                                    break;
                                default:
                                    parameterName += currentCharacter;
                                    break;
                            }
                            break;
                        case "ParameterValue":
                            switch (currentCharacter) {
                                case "&":
                                    result.set(parameterName, parameterValue);
                                    parameterName = "";
                                    parameterValue = "";
                                    currentState = "ParameterName";
                                    break;
                                default:
                                    parameterValue += currentCharacter;
                                    break;
                            }
                            break;
                        default:
                            throw new Error("Unrecognized URLQuery parse state: " + currentState);
                    }
                }
                if (currentState === "ParameterValue") {
                    result.set(parameterName, parameterValue);
                }
            }
            return result;
        };
        return URLQuery;
    }());
    /**
     * A class that handles creating, modifying, and parsing URLs.
     */
    var URLBuilder = /** @class */ (function () {
        function URLBuilder() {
        }
        /**
         * Set the scheme/protocol for this URL. If the provided scheme contains other parts of a URL
         * (such as a host, port, path, or query), those parts will be added to this URL as well.
         */
        URLBuilder.prototype.setScheme = function (scheme) {
            if (!scheme) {
                this._scheme = undefined;
            }
            else {
                this.set(scheme, "SCHEME");
            }
        };
        /**
         * Get the scheme that has been set in this URL.
         */
        URLBuilder.prototype.getScheme = function () {
            return this._scheme;
        };
        /**
         * Set the host for this URL. If the provided host contains other parts of a URL (such as a
         * port, path, or query), those parts will be added to this URL as well.
         */
        URLBuilder.prototype.setHost = function (host) {
            if (!host) {
                this._host = undefined;
            }
            else {
                this.set(host, "SCHEME_OR_HOST");
            }
        };
        /**
         * Get the host that has been set in this URL.
         */
        URLBuilder.prototype.getHost = function () {
            return this._host;
        };
        /**
         * Set the port for this URL. If the provided port contains other parts of a URL (such as a
         * path or query), those parts will be added to this URL as well.
         */
        URLBuilder.prototype.setPort = function (port) {
            if (port == undefined || port === "") {
                this._port = undefined;
            }
            else {
                this.set(port.toString(), "PORT");
            }
        };
        /**
         * Get the port that has been set in this URL.
         */
        URLBuilder.prototype.getPort = function () {
            return this._port;
        };
        /**
         * Set the path for this URL. If the provided path contains a query, then it will be added to
         * this URL as well.
         */
        URLBuilder.prototype.setPath = function (path) {
            if (!path) {
                this._path = undefined;
            }
            else {
                var schemeIndex = path.indexOf("://");
                if (schemeIndex !== -1) {
                    var schemeStart = path.lastIndexOf("/", schemeIndex);
                    // Make sure to only grab the URL part of the path before setting the state back to SCHEME
                    // this will handle cases such as "/a/b/c/https://microsoft.com" => "https://microsoft.com"
                    this.set(schemeStart === -1 ? path : path.substr(schemeStart + 1), "SCHEME");
                }
                else {
                    this.set(path, "PATH");
                }
            }
        };
        /**
         * Append the provided path to this URL's existing path. If the provided path contains a query,
         * then it will be added to this URL as well.
         */
        URLBuilder.prototype.appendPath = function (path) {
            if (path) {
                var currentPath = this.getPath();
                if (currentPath) {
                    if (!currentPath.endsWith("/")) {
                        currentPath += "/";
                    }
                    if (path.startsWith("/")) {
                        path = path.substring(1);
                    }
                    path = currentPath + path;
                }
                this.set(path, "PATH");
            }
        };
        /**
         * Get the path that has been set in this URL.
         */
        URLBuilder.prototype.getPath = function () {
            return this._path;
        };
        /**
         * Set the query in this URL.
         */
        URLBuilder.prototype.setQuery = function (query) {
            if (!query) {
                this._query = undefined;
            }
            else {
                this._query = URLQuery.parse(query);
            }
        };
        /**
         * Set a query parameter with the provided name and value in this URL's query. If the provided
         * query parameter value is undefined or empty, then the query parameter will be removed if it
         * existed.
         */
        URLBuilder.prototype.setQueryParameter = function (queryParameterName, queryParameterValue) {
            if (queryParameterName) {
                if (!this._query) {
                    this._query = new URLQuery();
                }
                this._query.set(queryParameterName, queryParameterValue);
            }
        };
        /**
         * Get the value of the query parameter with the provided query parameter name. If no query
         * parameter exists with the provided name, then undefined will be returned.
         */
        URLBuilder.prototype.getQueryParameterValue = function (queryParameterName) {
            return this._query ? this._query.get(queryParameterName) : undefined;
        };
        /**
         * Get the query in this URL.
         */
        URLBuilder.prototype.getQuery = function () {
            return this._query ? this._query.toString() : undefined;
        };
        /**
         * Set the parts of this URL by parsing the provided text using the provided startState.
         */
        URLBuilder.prototype.set = function (text, startState) {
            var tokenizer = new URLTokenizer(text, startState);
            while (tokenizer.next()) {
                var token = tokenizer.current();
                if (token) {
                    switch (token.type) {
                        case "SCHEME":
                            this._scheme = token.text || undefined;
                            break;
                        case "HOST":
                            this._host = token.text || undefined;
                            break;
                        case "PORT":
                            this._port = token.text || undefined;
                            break;
                        case "PATH":
                            var tokenPath = token.text || undefined;
                            if (!this._path || this._path === "/" || tokenPath !== "/") {
                                this._path = tokenPath;
                            }
                            break;
                        case "QUERY":
                            this._query = URLQuery.parse(token.text);
                            break;
                        default:
                            throw new Error("Unrecognized URLTokenType: " + token.type);
                    }
                }
            }
        };
        URLBuilder.prototype.toString = function () {
            var result = "";
            if (this._scheme) {
                result += this._scheme + "://";
            }
            if (this._host) {
                result += this._host;
            }
            if (this._port) {
                result += ":" + this._port;
            }
            if (this._path) {
                if (!this._path.startsWith("/")) {
                    result += "/";
                }
                result += this._path;
            }
            if (this._query && this._query.any()) {
                result += "?" + this._query.toString();
            }
            return result;
        };
        /**
         * If the provided searchValue is found in this URLBuilder, then replace it with the provided
         * replaceValue.
         */
        URLBuilder.prototype.replaceAll = function (searchValue, replaceValue) {
            if (searchValue) {
                this.setScheme(replaceAll(this.getScheme(), searchValue, replaceValue));
                this.setHost(replaceAll(this.getHost(), searchValue, replaceValue));
                this.setPort(replaceAll(this.getPort(), searchValue, replaceValue));
                this.setPath(replaceAll(this.getPath(), searchValue, replaceValue));
                this.setQuery(replaceAll(this.getQuery(), searchValue, replaceValue));
            }
        };
        URLBuilder.parse = function (text) {
            var result = new URLBuilder();
            result.set(text, "SCHEME_OR_HOST");
            return result;
        };
        return URLBuilder;
    }());
    var URLToken = /** @class */ (function () {
        function URLToken(text, type) {
            this.text = text;
            this.type = type;
        }
        URLToken.scheme = function (text) {
            return new URLToken(text, "SCHEME");
        };
        URLToken.host = function (text) {
            return new URLToken(text, "HOST");
        };
        URLToken.port = function (text) {
            return new URLToken(text, "PORT");
        };
        URLToken.path = function (text) {
            return new URLToken(text, "PATH");
        };
        URLToken.query = function (text) {
            return new URLToken(text, "QUERY");
        };
        return URLToken;
    }());
    /**
     * Get whether or not the provided character (single character string) is an alphanumeric (letter or
     * digit) character.
     */
    function isAlphaNumericCharacter(character) {
        var characterCode = character.charCodeAt(0);
        return ((48 /* '0' */ <= characterCode && characterCode <= 57) /* '9' */ ||
            (65 /* 'A' */ <= characterCode && characterCode <= 90) /* 'Z' */ ||
            (97 /* 'a' */ <= characterCode && characterCode <= 122) /* 'z' */);
    }
    /**
     * A class that tokenizes URL strings.
     */
    var URLTokenizer = /** @class */ (function () {
        function URLTokenizer(_text, state) {
            this._text = _text;
            this._textLength = _text ? _text.length : 0;
            this._currentState = state != undefined ? state : "SCHEME_OR_HOST";
            this._currentIndex = 0;
        }
        /**
         * Get the current URLToken this URLTokenizer is pointing at, or undefined if the URLTokenizer
         * hasn't started or has finished tokenizing.
         */
        URLTokenizer.prototype.current = function () {
            return this._currentToken;
        };
        /**
         * Advance to the next URLToken and return whether or not a URLToken was found.
         */
        URLTokenizer.prototype.next = function () {
            if (!hasCurrentCharacter(this)) {
                this._currentToken = undefined;
            }
            else {
                switch (this._currentState) {
                    case "SCHEME":
                        nextScheme(this);
                        break;
                    case "SCHEME_OR_HOST":
                        nextSchemeOrHost(this);
                        break;
                    case "HOST":
                        nextHost(this);
                        break;
                    case "PORT":
                        nextPort(this);
                        break;
                    case "PATH":
                        nextPath(this);
                        break;
                    case "QUERY":
                        nextQuery(this);
                        break;
                    default:
                        throw new Error("Unrecognized URLTokenizerState: " + this._currentState);
                }
            }
            return !!this._currentToken;
        };
        return URLTokenizer;
    }());
    /**
     * Read the remaining characters from this Tokenizer's character stream.
     */
    function readRemaining(tokenizer) {
        var result = "";
        if (tokenizer._currentIndex < tokenizer._textLength) {
            result = tokenizer._text.substring(tokenizer._currentIndex);
            tokenizer._currentIndex = tokenizer._textLength;
        }
        return result;
    }
    /**
     * Whether or not this URLTokenizer has a current character.
     */
    function hasCurrentCharacter(tokenizer) {
        return tokenizer._currentIndex < tokenizer._textLength;
    }
    /**
     * Get the character in the text string at the current index.
     */
    function getCurrentCharacter(tokenizer) {
        return tokenizer._text[tokenizer._currentIndex];
    }
    /**
     * Advance to the character in text that is "step" characters ahead. If no step value is provided,
     * then step will default to 1.
     */
    function nextCharacter(tokenizer, step) {
        if (hasCurrentCharacter(tokenizer)) {
            if (!step) {
                step = 1;
            }
            tokenizer._currentIndex += step;
        }
    }
    /**
     * Starting with the current character, peek "charactersToPeek" number of characters ahead in this
     * Tokenizer's stream of characters.
     */
    function peekCharacters(tokenizer, charactersToPeek) {
        var endIndex = tokenizer._currentIndex + charactersToPeek;
        if (tokenizer._textLength < endIndex) {
            endIndex = tokenizer._textLength;
        }
        return tokenizer._text.substring(tokenizer._currentIndex, endIndex);
    }
    /**
     * Read characters from this Tokenizer until the end of the stream or until the provided condition
     * is false when provided the current character.
     */
    function readWhile(tokenizer, condition) {
        var result = "";
        while (hasCurrentCharacter(tokenizer)) {
            var currentCharacter = getCurrentCharacter(tokenizer);
            if (!condition(currentCharacter)) {
                break;
            }
            else {
                result += currentCharacter;
                nextCharacter(tokenizer);
            }
        }
        return result;
    }
    /**
     * Read characters from this Tokenizer until a non-alphanumeric character or the end of the
     * character stream is reached.
     */
    function readWhileLetterOrDigit(tokenizer) {
        return readWhile(tokenizer, function (character) { return isAlphaNumericCharacter(character); });
    }
    /**
     * Read characters from this Tokenizer until one of the provided terminating characters is read or
     * the end of the character stream is reached.
     */
    function readUntilCharacter(tokenizer) {
        var terminatingCharacters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            terminatingCharacters[_i - 1] = arguments[_i];
        }
        return readWhile(tokenizer, function (character) { return terminatingCharacters.indexOf(character) === -1; });
    }
    function nextScheme(tokenizer) {
        var scheme = readWhileLetterOrDigit(tokenizer);
        tokenizer._currentToken = URLToken.scheme(scheme);
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentState = "DONE";
        }
        else {
            tokenizer._currentState = "HOST";
        }
    }
    function nextSchemeOrHost(tokenizer) {
        var schemeOrHost = readUntilCharacter(tokenizer, ":", "/", "?");
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentToken = URLToken.host(schemeOrHost);
            tokenizer._currentState = "DONE";
        }
        else if (getCurrentCharacter(tokenizer) === ":") {
            if (peekCharacters(tokenizer, 3) === "://") {
                tokenizer._currentToken = URLToken.scheme(schemeOrHost);
                tokenizer._currentState = "HOST";
            }
            else {
                tokenizer._currentToken = URLToken.host(schemeOrHost);
                tokenizer._currentState = "PORT";
            }
        }
        else {
            tokenizer._currentToken = URLToken.host(schemeOrHost);
            if (getCurrentCharacter(tokenizer) === "/") {
                tokenizer._currentState = "PATH";
            }
            else {
                tokenizer._currentState = "QUERY";
            }
        }
    }
    function nextHost(tokenizer) {
        if (peekCharacters(tokenizer, 3) === "://") {
            nextCharacter(tokenizer, 3);
        }
        var host = readUntilCharacter(tokenizer, ":", "/", "?");
        tokenizer._currentToken = URLToken.host(host);
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentState = "DONE";
        }
        else if (getCurrentCharacter(tokenizer) === ":") {
            tokenizer._currentState = "PORT";
        }
        else if (getCurrentCharacter(tokenizer) === "/") {
            tokenizer._currentState = "PATH";
        }
        else {
            tokenizer._currentState = "QUERY";
        }
    }
    function nextPort(tokenizer) {
        if (getCurrentCharacter(tokenizer) === ":") {
            nextCharacter(tokenizer);
        }
        var port = readUntilCharacter(tokenizer, "/", "?");
        tokenizer._currentToken = URLToken.port(port);
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentState = "DONE";
        }
        else if (getCurrentCharacter(tokenizer) === "/") {
            tokenizer._currentState = "PATH";
        }
        else {
            tokenizer._currentState = "QUERY";
        }
    }
    function nextPath(tokenizer) {
        var path = readUntilCharacter(tokenizer, "?");
        tokenizer._currentToken = URLToken.path(path);
        if (!hasCurrentCharacter(tokenizer)) {
            tokenizer._currentState = "DONE";
        }
        else {
            tokenizer._currentState = "QUERY";
        }
    }
    function nextQuery(tokenizer) {
        if (getCurrentCharacter(tokenizer) === "?") {
            nextCharacter(tokenizer);
        }
        var query = readRemaining(tokenizer);
        tokenizer._currentToken = URLToken.query(query);
        tokenizer._currentState = "DONE";
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function redirectPolicy(maximumRetries) {
        if (maximumRetries === void 0) { maximumRetries = 20; }
        return {
            create: function (nextPolicy, options) {
                return new RedirectPolicy(nextPolicy, options, maximumRetries);
            },
        };
    }
    var RedirectPolicy = /** @class */ (function (_super) {
        __extends(RedirectPolicy, _super);
        function RedirectPolicy(nextPolicy, options, maxRetries) {
            if (maxRetries === void 0) { maxRetries = 20; }
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.maxRetries = maxRetries;
            return _this;
        }
        RedirectPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy
                .sendRequest(request)
                .then(function (response) { return handleRedirect(_this, response, 0); });
        };
        return RedirectPolicy;
    }(BaseRequestPolicy));
    function handleRedirect(policy, response, currentRetries) {
        var request = response.request, status = response.status;
        var locationHeader = response.headers.get("location");
        if (locationHeader &&
            (status === 300 || status === 307 || (status === 303 && request.method === "POST")) &&
            (!policy.maxRetries || currentRetries < policy.maxRetries)) {
            var builder = URLBuilder.parse(request.url);
            builder.setPath(locationHeader);
            request.url = builder.toString();
            // POST request with Status code 303 should be converted into a
            // redirected GET request if the redirect url is present in the location header
            if (status === 303) {
                request.method = "GET";
            }
            return policy._nextPolicy
                .sendRequest(request)
                .then(function (res) { return handleRedirect(policy, res, currentRetries + 1); });
        }
        return Promise.resolve(response);
    }

    function rpRegistrationPolicy(retryTimeout) {
        if (retryTimeout === void 0) { retryTimeout = 30; }
        return {
            create: function (nextPolicy, options) {
                return new RPRegistrationPolicy(nextPolicy, options, retryTimeout);
            },
        };
    }
    var RPRegistrationPolicy = /** @class */ (function (_super) {
        __extends(RPRegistrationPolicy, _super);
        function RPRegistrationPolicy(nextPolicy, options, _retryTimeout) {
            if (_retryTimeout === void 0) { _retryTimeout = 30; }
            var _this = _super.call(this, nextPolicy, options) || this;
            _this._retryTimeout = _retryTimeout;
            return _this;
        }
        RPRegistrationPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy
                .sendRequest(request.clone())
                .then(function (response) { return registerIfNeeded(_this, request, response); });
        };
        return RPRegistrationPolicy;
    }(BaseRequestPolicy));
    function registerIfNeeded(policy, request, response) {
        if (response.status === 409) {
            var rpName = checkRPNotRegisteredError(response.bodyAsText);
            if (rpName) {
                var urlPrefix = extractSubscriptionUrl(request.url);
                return (registerRP(policy, urlPrefix, rpName, request)
                    // Autoregistration of ${provider} failed for some reason. We will not return this error
                    // instead will return the initial response with 409 status code back to the user.
                    // do nothing here as we are returning the original response at the end of this method.
                    .catch(function () { return false; })
                    .then(function (registrationStatus) {
                    if (registrationStatus) {
                        // Retry the original request. We have to change the x-ms-client-request-id
                        // otherwise Azure endpoint will return the initial 409 (cached) response.
                        request.headers.set("x-ms-client-request-id", generateUuid());
                        return policy._nextPolicy.sendRequest(request.clone());
                    }
                    return response;
                }));
            }
        }
        return Promise.resolve(response);
    }
    /**
     * Reuses the headers of the original request and url (if specified).
     * @param {WebResourceLike} originalRequest The original request
     * @param {boolean} reuseUrlToo Should the url from the original request be reused as well. Default false.
     * @returns {object} A new request object with desired headers.
     */
    function getRequestEssentials(originalRequest, reuseUrlToo) {
        if (reuseUrlToo === void 0) { reuseUrlToo = false; }
        var reqOptions = originalRequest.clone();
        if (reuseUrlToo) {
            reqOptions.url = originalRequest.url;
        }
        // We have to change the x-ms-client-request-id otherwise Azure endpoint
        // will return the initial 409 (cached) response.
        reqOptions.headers.set("x-ms-client-request-id", generateUuid());
        // Set content-type to application/json
        reqOptions.headers.set("Content-Type", "application/json; charset=utf-8");
        return reqOptions;
    }
    /**
     * Validates the error code and message associated with 409 response status code. If it matches to that of
     * RP not registered then it returns the name of the RP else returns undefined.
     * @param {string} body The response body received after making the original request.
     * @returns {string} The name of the RP if condition is satisfied else undefined.
     */
    function checkRPNotRegisteredError(body) {
        var result, responseBody;
        if (body) {
            try {
                responseBody = JSON.parse(body);
            }
            catch (err) {
                // do nothing;
            }
            if (responseBody &&
                responseBody.error &&
                responseBody.error.message &&
                responseBody.error.code &&
                responseBody.error.code === "MissingSubscriptionRegistration") {
                var matchRes = responseBody.error.message.match(/.*'(.*)'/i);
                if (matchRes) {
                    result = matchRes.pop();
                }
            }
        }
        return result;
    }
    /**
     * Extracts the first part of the URL, just after subscription:
     * https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
     * @param {string} url The original request url
     * @returns {string} The url prefix as explained above.
     */
    function extractSubscriptionUrl(url) {
        var result;
        var matchRes = url.match(/.*\/subscriptions\/[a-f0-9-]+\//gi);
        if (matchRes && matchRes[0]) {
            result = matchRes[0];
        }
        else {
            throw new Error("Unable to extract subscriptionId from the given url - " + url + ".");
        }
        return result;
    }
    /**
     * Registers the given provider.
     * @param {RPRegistrationPolicy} policy The RPRegistrationPolicy this function is being called against.
     * @param {string} urlPrefix https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
     * @param {string} provider The provider name to be registered.
     * @param {WebResourceLike} originalRequest The original request sent by the user that returned a 409 response
     * with a message that the provider is not registered.
     * @param {registrationCallback} callback The callback that handles the RP registration
     */
    function registerRP(policy, urlPrefix, provider, originalRequest) {
        var postUrl = urlPrefix + "providers/" + provider + "/register?api-version=2016-02-01";
        var getUrl = urlPrefix + "providers/" + provider + "?api-version=2016-02-01";
        var reqOptions = getRequestEssentials(originalRequest);
        reqOptions.method = "POST";
        reqOptions.url = postUrl;
        return policy._nextPolicy.sendRequest(reqOptions).then(function (response) {
            if (response.status !== 200) {
                throw new Error("Autoregistration of " + provider + " failed. Please try registering manually.");
            }
            return getRegistrationStatus(policy, getUrl, originalRequest);
        });
    }
    /**
     * Polls the registration status of the provider that was registered. Polling happens at an interval of 30 seconds.
     * Polling will happen till the registrationState property of the response body is "Registered".
     * @param {RPRegistrationPolicy} policy The RPRegistrationPolicy this function is being called against.
     * @param {string} url The request url for polling
     * @param {WebResourceLike} originalRequest The original request sent by the user that returned a 409 response
     * with a message that the provider is not registered.
     * @returns {Promise<boolean>} True if RP Registration is successful.
     */
    function getRegistrationStatus(policy, url, originalRequest) {
        var reqOptions = getRequestEssentials(originalRequest);
        reqOptions.url = url;
        reqOptions.method = "GET";
        return policy._nextPolicy.sendRequest(reqOptions).then(function (res) {
            var obj = res.parsedBody;
            if (res.parsedBody && obj.registrationState && obj.registrationState === "Registered") {
                return true;
            }
            else {
                return delay(policy._retryTimeout * 1000)
                    .then(function () { return getRegistrationStatus(policy, url, originalRequest); });
            }
        });
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function signingPolicy(authenticationProvider) {
        return {
            create: function (nextPolicy, options) {
                return new SigningPolicy(nextPolicy, options, authenticationProvider);
            },
        };
    }
    var SigningPolicy = /** @class */ (function (_super) {
        __extends(SigningPolicy, _super);
        function SigningPolicy(nextPolicy, options, authenticationProvider) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.authenticationProvider = authenticationProvider;
            return _this;
        }
        SigningPolicy.prototype.signRequest = function (request) {
            return this.authenticationProvider.signRequest(request);
        };
        SigningPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this.signRequest(request).then(function (nextRequest) {
                return _this._nextPolicy.sendRequest(nextRequest);
            });
        };
        return SigningPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function systemErrorRetryPolicy(retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
        return {
            create: function (nextPolicy, options) {
                return new SystemErrorRetryPolicy(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval);
            },
        };
    }
    /**
     * @class
     * Instantiates a new "ExponentialRetryPolicyFilter" instance.
     *
     * @constructor
     * @param {number} retryCount        The client retry count.
     * @param {number} retryInterval     The client retry interval, in milliseconds.
     * @param {number} minRetryInterval  The minimum retry interval, in milliseconds.
     * @param {number} maxRetryInterval  The maximum retry interval, in milliseconds.
     */
    var SystemErrorRetryPolicy = /** @class */ (function (_super) {
        __extends(SystemErrorRetryPolicy, _super);
        function SystemErrorRetryPolicy(nextPolicy, options, retryCount, retryInterval, minRetryInterval, maxRetryInterval) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;
            _this.DEFAULT_CLIENT_RETRY_COUNT = 3;
            _this.DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;
            _this.DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;
            _this.retryCount = typeof retryCount === "number" ? retryCount : _this.DEFAULT_CLIENT_RETRY_COUNT;
            _this.retryInterval =
                typeof retryInterval === "number" ? retryInterval : _this.DEFAULT_CLIENT_RETRY_INTERVAL;
            _this.minRetryInterval =
                typeof minRetryInterval === "number"
                    ? minRetryInterval
                    : _this.DEFAULT_CLIENT_MIN_RETRY_INTERVAL;
            _this.maxRetryInterval =
                typeof maxRetryInterval === "number"
                    ? maxRetryInterval
                    : _this.DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
            return _this;
        }
        SystemErrorRetryPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy
                .sendRequest(request.clone())
                .catch(function (error) { return retry$1(_this, request, error.response, error); });
        };
        return SystemErrorRetryPolicy;
    }(BaseRequestPolicy));
    /**
     * Determines if the operation should be retried and how long to wait until the next retry.
     *
     * @param {number} statusCode The HTTP status code.
     * @param {RetryData} retryData  The retry data.
     * @return {boolean} True if the operation qualifies for a retry; false otherwise.
     */
    function shouldRetry$1(policy, retryData) {
        var currentCount;
        if (!retryData) {
            throw new Error("retryData for the SystemErrorRetryPolicyFilter cannot be null.");
        }
        else {
            currentCount = retryData && retryData.retryCount;
        }
        return currentCount < policy.retryCount;
    }
    /**
     * Updates the retry data for the next attempt.
     *
     * @param {RetryData} retryData  The retry data.
     * @param {object} err        The operation"s error, if any.
     */
    function updateRetryData$1(policy, retryData, err) {
        if (!retryData) {
            retryData = {
                retryCount: 0,
                retryInterval: 0,
            };
        }
        if (err) {
            if (retryData.error) {
                err.innerError = retryData.error;
            }
            retryData.error = err;
        }
        // Adjust retry count
        retryData.retryCount++;
        // Adjust retry interval
        var incrementDelta = Math.pow(2, retryData.retryCount) - 1;
        var boundedRandDelta = policy.retryInterval * 0.8 + Math.floor(Math.random() * (policy.retryInterval * 0.4));
        incrementDelta *= boundedRandDelta;
        retryData.retryInterval = Math.min(policy.minRetryInterval + incrementDelta, policy.maxRetryInterval);
        return retryData;
    }
    function retry$1(policy, request, operationResponse, err, retryData) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retryData = updateRetryData$1(policy, retryData, err);
                        if (!(err &&
                            err.code &&
                            shouldRetry$1(policy, retryData) &&
                            (err.code === "ETIMEDOUT" ||
                                err.code === "ESOCKETTIMEDOUT" ||
                                err.code === "ECONNREFUSED" ||
                                err.code === "ECONNRESET" ||
                                err.code === "ENOENT"))) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, delay(retryData.retryInterval)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, policy._nextPolicy.sendRequest(request.clone())];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, retry$1(policy, request, operationResponse, error_1, retryData)];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (err) {
                            // If the operation failed in the end, return all errors instead of just the last one
                            return [2 /*return*/, Promise.reject(retryData.error)];
                        }
                        return [2 /*return*/, operationResponse];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    (function (QueryCollectionFormat) {
        QueryCollectionFormat["Csv"] = ",";
        QueryCollectionFormat["Ssv"] = " ";
        QueryCollectionFormat["Tsv"] = "\t";
        QueryCollectionFormat["Pipes"] = "|";
        QueryCollectionFormat["Multi"] = "Multi";
    })(exports.QueryCollectionFormat || (exports.QueryCollectionFormat = {}));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var agentNotSupportedInBrowser = new Error("AgentPolicy is not supported in browser environment");
    function agentPolicy(_agentSettings) {
        return {
            create: function (_nextPolicy, _options) {
                throw agentNotSupportedInBrowser;
            },
        };
    }
    var AgentPolicy = /** @class */ (function (_super) {
        __extends(AgentPolicy, _super);
        function AgentPolicy(nextPolicy, options) {
            var _this = _super.call(this, nextPolicy, options) || this;
            throw agentNotSupportedInBrowser;
        }
        AgentPolicy.prototype.sendRequest = function (_request) {
            throw agentNotSupportedInBrowser;
        };
        return AgentPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var proxyNotSupportedInBrowser = new Error("ProxyPolicy is not supported in browser environment");
    function getDefaultProxySettings(_proxyUrl) {
        return undefined;
    }
    function proxyPolicy(_proxySettings) {
        return {
            create: function (_nextPolicy, _options) {
                throw proxyNotSupportedInBrowser;
            },
        };
    }
    var ProxyPolicy = /** @class */ (function (_super) {
        __extends(ProxyPolicy, _super);
        function ProxyPolicy(nextPolicy, options) {
            var _this = _super.call(this, nextPolicy, options) || this;
            throw proxyNotSupportedInBrowser;
        }
        ProxyPolicy.prototype.sendRequest = function (_request) {
            throw proxyNotSupportedInBrowser;
        };
        return ProxyPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var StatusCodes = Constants.HttpConstants.StatusCodes;
    var DEFAULT_RETRY_COUNT = 3;
    function throttlingRetryPolicy(maxRetries) {
        if (maxRetries === void 0) { maxRetries = DEFAULT_RETRY_COUNT; }
        return {
            create: function (nextPolicy, options) {
                return new ThrottlingRetryPolicy(nextPolicy, options, maxRetries);
            },
        };
    }
    /**
     * To learn more, please refer to
     * https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-request-limits,
     * https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits and
     * https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/troubleshooting-throttling-errors
     */
    var ThrottlingRetryPolicy = /** @class */ (function (_super) {
        __extends(ThrottlingRetryPolicy, _super);
        function ThrottlingRetryPolicy(nextPolicy, options, retryLimit) {
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.retryLimit = retryLimit;
            return _this;
        }
        ThrottlingRetryPolicy.prototype.sendRequest = function (httpRequest) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._nextPolicy.sendRequest(httpRequest.clone()).then(function (response) {
                            return _this.retry(httpRequest, response, 0);
                        })];
                });
            });
        };
        ThrottlingRetryPolicy.prototype.retry = function (httpRequest, httpResponse, retryCount) {
            return __awaiter(this, void 0, void 0, function () {
                var retryAfterHeader, delayInMs, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (httpResponse.status !== StatusCodes.TooManyRequests) {
                                return [2 /*return*/, httpResponse];
                            }
                            retryAfterHeader = httpResponse.headers.get(Constants.HeaderConstants.RETRY_AFTER);
                            if (!(retryAfterHeader && retryCount < this.retryLimit)) return [3 /*break*/, 3];
                            delayInMs = ThrottlingRetryPolicy.parseRetryAfterHeader(retryAfterHeader);
                            if (!delayInMs) return [3 /*break*/, 3];
                            return [4 /*yield*/, delay(delayInMs)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._nextPolicy.sendRequest(httpRequest)];
                        case 2:
                            res = _a.sent();
                            return [2 /*return*/, this.retry(httpRequest, res, retryCount + 1)];
                        case 3: return [2 /*return*/, httpResponse];
                    }
                });
            });
        };
        ThrottlingRetryPolicy.parseRetryAfterHeader = function (headerValue) {
            var retryAfterInSeconds = Number(headerValue);
            if (Number.isNaN(retryAfterInSeconds)) {
                return ThrottlingRetryPolicy.parseDateRetryAfterHeader(headerValue);
            }
            else {
                return retryAfterInSeconds * 1000;
            }
        };
        ThrottlingRetryPolicy.parseDateRetryAfterHeader = function (headerValue) {
            try {
                var now = Date.now();
                var date = Date.parse(headerValue);
                var diff = date - now;
                return Number.isNaN(diff) ? undefined : diff;
            }
            catch (error) {
                return undefined;
            }
        };
        return ThrottlingRetryPolicy;
    }(BaseRequestPolicy));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var DEFAULT_AUTHORIZATION_SCHEME = "Bearer";
    /**
     * This class provides a simple extension to use {@link TokenCredential} from `@azure/identity` library to
     * use with legacy Azure SDKs that accept {@link ServiceClientCredentials} family of credentials for authentication.
     */
    var AzureIdentityCredentialAdapter = /** @class */ (function () {
        function AzureIdentityCredentialAdapter(azureTokenCredential, scopes) {
            if (scopes === void 0) { scopes = "https://management.azure.com/.default"; }
            this.azureTokenCredential = azureTokenCredential;
            this.scopes = scopes;
        }
        AzureIdentityCredentialAdapter.prototype.getToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                var accessToken, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.azureTokenCredential.getToken(this.scopes)];
                        case 1:
                            accessToken = _a.sent();
                            if (accessToken !== null) {
                                result = {
                                    accessToken: accessToken.token,
                                    tokenType: DEFAULT_AUTHORIZATION_SCHEME,
                                    expiresOn: accessToken.expiresOnTimestamp,
                                };
                                return [2 /*return*/, result];
                            }
                            else {
                                throw new Error("Could find token for scope");
                            }
                    }
                });
            });
        };
        AzureIdentityCredentialAdapter.prototype.signRequest = function (webResource) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getToken()];
                        case 1:
                            tokenResponse = _a.sent();
                            webResource.headers.set(Constants.HeaderConstants.AUTHORIZATION, tokenResponse.tokenType + " " + tokenResponse.accessToken);
                            return [2 /*return*/, Promise.resolve(webResource)];
                    }
                });
            });
        };
        return AzureIdentityCredentialAdapter;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * @class
     * Initializes a new instance of the ServiceClient.
     */
    var ServiceClient = /** @class */ (function () {
        /**
         * The ServiceClient constructor
         * @constructor
         * @param {ServiceClientCredentials} [credentials] The credentials object used for authentication.
         * @param {ServiceClientOptions} [options] The service client options that govern the behavior of the client.
         */
        function ServiceClient(credentials, options) {
            if (!options) {
                options = {};
            }
            var serviceClientCredentials;
            if (isTokenCredential(credentials)) {
                serviceClientCredentials = new AzureIdentityCredentialAdapter(credentials);
            }
            else {
                serviceClientCredentials = credentials;
            }
            if (serviceClientCredentials && !serviceClientCredentials.signRequest) {
                throw new Error("credentials argument needs to implement signRequest method");
            }
            this._withCredentials = options.withCredentials || false;
            this._httpClient = options.httpClient || new XhrHttpClient();
            this._requestPolicyOptions = new RequestPolicyOptions(options.httpPipelineLogger);
            var requestPolicyFactories;
            if (Array.isArray(options.requestPolicyFactories)) {
                requestPolicyFactories = options.requestPolicyFactories;
            }
            else {
                requestPolicyFactories = createDefaultRequestPolicyFactories(serviceClientCredentials, options);
                if (options.requestPolicyFactories) {
                    var newRequestPolicyFactories = options.requestPolicyFactories(requestPolicyFactories);
                    if (newRequestPolicyFactories) {
                        requestPolicyFactories = newRequestPolicyFactories;
                    }
                }
            }
            this._requestPolicyFactories = requestPolicyFactories;
        }
        /**
         * Send the provided httpRequest.
         */
        ServiceClient.prototype.sendRequest = function (options) {
            if (options === null || options === undefined || typeof options !== "object") {
                throw new Error("options cannot be null or undefined and it must be of type object.");
            }
            var httpRequest;
            try {
                if (isWebResourceLike(options)) {
                    options.validateRequestProperties();
                    httpRequest = options;
                }
                else {
                    httpRequest = new WebResource();
                    httpRequest = httpRequest.prepare(options);
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
            var httpPipeline = this._httpClient;
            if (this._requestPolicyFactories && this._requestPolicyFactories.length > 0) {
                for (var i = this._requestPolicyFactories.length - 1; i >= 0; --i) {
                    httpPipeline = this._requestPolicyFactories[i].create(httpPipeline, this._requestPolicyOptions);
                }
            }
            return httpPipeline.sendRequest(httpRequest);
        };
        /**
         * Send an HTTP request that is populated using the provided OperationSpec.
         * @param {OperationArguments} operationArguments The arguments that the HTTP request's templated values will be populated from.
         * @param {OperationSpec} operationSpec The OperationSpec to use to populate the httpRequest.
         * @param {ServiceCallback} callback The callback to call when the response is received.
         */
        ServiceClient.prototype.sendOperationRequest = function (operationArguments, operationSpec, callback) {
            if (typeof operationArguments.options === "function") {
                callback = operationArguments.options;
                operationArguments.options = undefined;
            }
            var httpRequest = new WebResource();
            var result;
            try {
                var baseUri = operationSpec.baseUrl || this.baseUri;
                if (!baseUri) {
                    throw new Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a baseUri string property that contains the base URL to use.");
                }
                httpRequest.method = operationSpec.httpMethod;
                httpRequest.operationSpec = operationSpec;
                var requestUrl = URLBuilder.parse(baseUri);
                if (operationSpec.path) {
                    requestUrl.appendPath(operationSpec.path);
                }
                if (operationSpec.urlParameters && operationSpec.urlParameters.length > 0) {
                    for (var _i = 0, _a = operationSpec.urlParameters; _i < _a.length; _i++) {
                        var urlParameter = _a[_i];
                        var urlParameterValue = getOperationArgumentValueFromParameter(this, operationArguments, urlParameter, operationSpec.serializer);
                        urlParameterValue = operationSpec.serializer.serialize(urlParameter.mapper, urlParameterValue, getPathStringFromParameter(urlParameter));
                        if (!urlParameter.skipEncoding) {
                            urlParameterValue = encodeURIComponent(urlParameterValue);
                        }
                        requestUrl.replaceAll("{" + (urlParameter.mapper.serializedName || getPathStringFromParameter(urlParameter)) + "}", urlParameterValue);
                    }
                }
                if (operationSpec.queryParameters && operationSpec.queryParameters.length > 0) {
                    for (var _b = 0, _c = operationSpec.queryParameters; _b < _c.length; _b++) {
                        var queryParameter = _c[_b];
                        var queryParameterValue = getOperationArgumentValueFromParameter(this, operationArguments, queryParameter, operationSpec.serializer);
                        if (queryParameterValue != undefined) {
                            queryParameterValue = operationSpec.serializer.serialize(queryParameter.mapper, queryParameterValue, getPathStringFromParameter(queryParameter));
                            if (queryParameter.collectionFormat != undefined) {
                                if (queryParameter.collectionFormat === exports.QueryCollectionFormat.Multi) {
                                    if (queryParameterValue.length === 0) {
                                        queryParameterValue = "";
                                    }
                                    else {
                                        for (var index in queryParameterValue) {
                                            var item = queryParameterValue[index];
                                            queryParameterValue[index] = item == undefined ? "" : item.toString();
                                        }
                                    }
                                }
                                else if (queryParameter.collectionFormat === exports.QueryCollectionFormat.Ssv ||
                                    queryParameter.collectionFormat === exports.QueryCollectionFormat.Tsv) {
                                    queryParameterValue = queryParameterValue.join(queryParameter.collectionFormat);
                                }
                            }
                            if (!queryParameter.skipEncoding) {
                                if (Array.isArray(queryParameterValue)) {
                                    for (var index in queryParameterValue) {
                                        if (queryParameterValue[index] !== undefined &&
                                            queryParameterValue[index] !== null) {
                                            queryParameterValue[index] = encodeURIComponent(queryParameterValue[index]);
                                        }
                                    }
                                }
                                else {
                                    queryParameterValue = encodeURIComponent(queryParameterValue);
                                }
                            }
                            if (queryParameter.collectionFormat != undefined &&
                                queryParameter.collectionFormat !== exports.QueryCollectionFormat.Multi &&
                                queryParameter.collectionFormat !== exports.QueryCollectionFormat.Ssv &&
                                queryParameter.collectionFormat !== exports.QueryCollectionFormat.Tsv) {
                                queryParameterValue = queryParameterValue.join(queryParameter.collectionFormat);
                            }
                            requestUrl.setQueryParameter(queryParameter.mapper.serializedName || getPathStringFromParameter(queryParameter), queryParameterValue);
                        }
                    }
                }
                httpRequest.url = requestUrl.toString();
                var contentType = operationSpec.contentType || this.requestContentType;
                if (contentType) {
                    httpRequest.headers.set("Content-Type", contentType);
                }
                if (operationSpec.headerParameters) {
                    for (var _d = 0, _e = operationSpec.headerParameters; _d < _e.length; _d++) {
                        var headerParameter = _e[_d];
                        var headerValue = getOperationArgumentValueFromParameter(this, operationArguments, headerParameter, operationSpec.serializer);
                        if (headerValue != undefined) {
                            headerValue = operationSpec.serializer.serialize(headerParameter.mapper, headerValue, getPathStringFromParameter(headerParameter));
                            var headerCollectionPrefix = headerParameter.mapper
                                .headerCollectionPrefix;
                            if (headerCollectionPrefix) {
                                for (var _f = 0, _g = Object.keys(headerValue); _f < _g.length; _f++) {
                                    var key = _g[_f];
                                    httpRequest.headers.set(headerCollectionPrefix + key, headerValue[key]);
                                }
                            }
                            else {
                                httpRequest.headers.set(headerParameter.mapper.serializedName ||
                                    getPathStringFromParameter(headerParameter), headerValue);
                            }
                        }
                    }
                }
                var options = operationArguments.options;
                if (options) {
                    if (options.customHeaders) {
                        for (var customHeaderName in options.customHeaders) {
                            httpRequest.headers.set(customHeaderName, options.customHeaders[customHeaderName]);
                        }
                    }
                    if (options.abortSignal) {
                        httpRequest.abortSignal = options.abortSignal;
                    }
                    if (options.timeout) {
                        httpRequest.timeout = options.timeout;
                    }
                    if (options.onUploadProgress) {
                        httpRequest.onUploadProgress = options.onUploadProgress;
                    }
                    if (options.onDownloadProgress) {
                        httpRequest.onDownloadProgress = options.onDownloadProgress;
                    }
                }
                httpRequest.withCredentials = this._withCredentials;
                serializeRequestBody(this, httpRequest, operationArguments, operationSpec);
                if (httpRequest.streamResponseBody == undefined) {
                    httpRequest.streamResponseBody = isStreamOperation(operationSpec);
                }
                result = this.sendRequest(httpRequest).then(function (res) {
                    return flattenResponse(res, operationSpec.responses[res.status]);
                });
            }
            catch (error) {
                result = Promise.reject(error);
            }
            var cb = callback;
            if (cb) {
                result
                    // tslint:disable-next-line:no-null-keyword
                    .then(function (res) { return cb(null, res._response.parsedBody, res._response.request, res._response); })
                    .catch(function (err) { return cb(err); });
            }
            return result;
        };
        return ServiceClient;
    }());
    function serializeRequestBody(serviceClient, httpRequest, operationArguments, operationSpec) {
        if (operationSpec.requestBody && operationSpec.requestBody.mapper) {
            httpRequest.body = getOperationArgumentValueFromParameter(serviceClient, operationArguments, operationSpec.requestBody, operationSpec.serializer);
            var bodyMapper = operationSpec.requestBody.mapper;
            var required = bodyMapper.required, xmlName = bodyMapper.xmlName, xmlElementName = bodyMapper.xmlElementName, serializedName = bodyMapper.serializedName;
            var typeName = bodyMapper.type.name;
            try {
                if (httpRequest.body != undefined || required) {
                    var requestBodyParameterPathString = getPathStringFromParameter(operationSpec.requestBody);
                    httpRequest.body = operationSpec.serializer.serialize(bodyMapper, httpRequest.body, requestBodyParameterPathString);
                    var isStream = typeName === MapperType.Stream;
                    if (operationSpec.isXML) {
                        if (typeName === MapperType.Sequence) {
                            httpRequest.body = stringifyXML(prepareXMLRootList(httpRequest.body, xmlElementName || xmlName || serializedName), { rootName: xmlName || serializedName });
                        }
                        else if (!isStream) {
                            httpRequest.body = stringifyXML(httpRequest.body, {
                                rootName: xmlName || serializedName,
                            });
                        }
                    }
                    else if (!isStream) {
                        httpRequest.body = JSON.stringify(httpRequest.body);
                    }
                }
            }
            catch (error) {
                throw new Error("Error \"" + error.message + "\" occurred in serializing the payload - " + JSON.stringify(serializedName, undefined, "  ") + ".");
            }
        }
        else if (operationSpec.formDataParameters && operationSpec.formDataParameters.length > 0) {
            httpRequest.formData = {};
            for (var _i = 0, _a = operationSpec.formDataParameters; _i < _a.length; _i++) {
                var formDataParameter = _a[_i];
                var formDataParameterValue = getOperationArgumentValueFromParameter(serviceClient, operationArguments, formDataParameter, operationSpec.serializer);
                if (formDataParameterValue != undefined) {
                    var formDataParameterPropertyName = formDataParameter.mapper.serializedName || getPathStringFromParameter(formDataParameter);
                    httpRequest.formData[formDataParameterPropertyName] = operationSpec.serializer.serialize(formDataParameter.mapper, formDataParameterValue, getPathStringFromParameter(formDataParameter));
                }
            }
        }
    }
    function isRequestPolicyFactory(instance) {
        return typeof instance.create === "function";
    }
    function getValueOrFunctionResult(value, defaultValueCreator) {
        var result;
        if (typeof value === "string") {
            result = value;
        }
        else {
            result = defaultValueCreator();
            if (typeof value === "function") {
                result = value(result);
            }
        }
        return result;
    }
    function createDefaultRequestPolicyFactories(credentials, options) {
        var factories = [];
        if (options.generateClientRequestIdHeader) {
            factories.push(generateClientRequestIdPolicy(options.clientRequestIdHeaderName));
        }
        if (credentials) {
            if (isRequestPolicyFactory(credentials)) {
                factories.push(credentials);
            }
            else {
                factories.push(signingPolicy(credentials));
            }
        }
        var userAgentHeaderName = getValueOrFunctionResult(options.userAgentHeaderName, getDefaultUserAgentHeaderName);
        var userAgentHeaderValue = getValueOrFunctionResult(options.userAgent, getDefaultUserAgentValue);
        if (userAgentHeaderName && userAgentHeaderValue) {
            factories.push(userAgentPolicy({ key: userAgentHeaderName, value: userAgentHeaderValue }));
        }
        factories.push(redirectPolicy());
        factories.push(rpRegistrationPolicy(options.rpRegistrationRetryTimeout));
        if (!options.noRetryPolicy) {
            factories.push(exponentialRetryPolicy());
            factories.push(systemErrorRetryPolicy());
            factories.push(throttlingRetryPolicy());
        }
        factories.push(deserializationPolicy(options.deserializationContentTypes));
        var proxySettings = options.proxySettings || getDefaultProxySettings();
        if (proxySettings) {
            factories.push(proxyPolicy());
        }
        if (options.agentSettings) {
            factories.push(agentPolicy(options.agentSettings));
        }
        return factories;
    }
    function getOperationArgumentValueFromParameter(serviceClient, operationArguments, parameter, serializer) {
        return getOperationArgumentValueFromParameterPath(serviceClient, operationArguments, parameter.parameterPath, parameter.mapper, serializer);
    }
    function getOperationArgumentValueFromParameterPath(serviceClient, operationArguments, parameterPath, parameterMapper, serializer) {
        var value;
        if (typeof parameterPath === "string") {
            parameterPath = [parameterPath];
        }
        if (Array.isArray(parameterPath)) {
            if (parameterPath.length > 0) {
                if (parameterMapper.isConstant) {
                    value = parameterMapper.defaultValue;
                }
                else {
                    var propertySearchResult = getPropertyFromParameterPath(operationArguments, parameterPath);
                    if (!propertySearchResult.propertyFound) {
                        propertySearchResult = getPropertyFromParameterPath(serviceClient, parameterPath);
                    }
                    var useDefaultValue = false;
                    if (!propertySearchResult.propertyFound) {
                        useDefaultValue =
                            parameterMapper.required ||
                                (parameterPath[0] === "options" && parameterPath.length === 2);
                    }
                    value = useDefaultValue ? parameterMapper.defaultValue : propertySearchResult.propertyValue;
                }
                // Serialize just for validation purposes.
                var parameterPathString = getPathStringFromParameterPath(parameterPath, parameterMapper);
                serializer.serialize(parameterMapper, value, parameterPathString);
            }
        }
        else {
            if (parameterMapper.required) {
                value = {};
            }
            for (var propertyName in parameterPath) {
                var propertyMapper = parameterMapper.type.modelProperties[propertyName];
                var propertyPath = parameterPath[propertyName];
                var propertyValue = getOperationArgumentValueFromParameterPath(serviceClient, operationArguments, propertyPath, propertyMapper, serializer);
                // Serialize just for validation purposes.
                var propertyPathString = getPathStringFromParameterPath(propertyPath, propertyMapper);
                serializer.serialize(propertyMapper, propertyValue, propertyPathString);
                if (propertyValue !== undefined) {
                    if (!value) {
                        value = {};
                    }
                    value[propertyName] = propertyValue;
                }
            }
        }
        return value;
    }
    function getPropertyFromParameterPath(parent, parameterPath) {
        var result = { propertyFound: false };
        var i = 0;
        for (; i < parameterPath.length; ++i) {
            var parameterPathPart = parameterPath[i];
            // Make sure to check inherited properties too, so don't use hasOwnProperty().
            if (parent != undefined && parameterPathPart in parent) {
                parent = parent[parameterPathPart];
            }
            else {
                break;
            }
        }
        if (i === parameterPath.length) {
            result.propertyValue = parent;
            result.propertyFound = true;
        }
        return result;
    }
    function flattenResponse(_response, responseSpec) {
        var parsedHeaders = _response.parsedHeaders;
        var bodyMapper = responseSpec && responseSpec.bodyMapper;
        var addOperationResponse = function (obj) {
            return Object.defineProperty(obj, "_response", {
                value: _response,
            });
        };
        if (bodyMapper) {
            var typeName = bodyMapper.type.name;
            if (typeName === "Stream") {
                return addOperationResponse(__assign(__assign({}, parsedHeaders), { blobBody: _response.blobBody, readableStreamBody: _response.readableStreamBody }));
            }
            var modelProperties_1 = (typeName === "Composite" && bodyMapper.type.modelProperties) || {};
            var isPageableResponse = Object.keys(modelProperties_1).some(function (k) { return modelProperties_1[k].serializedName === ""; });
            if (typeName === "Sequence" || isPageableResponse) {
                // We're expecting a sequece(array) make sure that the response body is in the
                // correct format, if not make it an empty array []
                var parsedBody = Array.isArray(_response.parsedBody) ? _response.parsedBody : [];
                var arrayResponse = __spreadArrays(parsedBody);
                for (var _i = 0, _a = Object.keys(modelProperties_1); _i < _a.length; _i++) {
                    var key = _a[_i];
                    if (modelProperties_1[key].serializedName) {
                        arrayResponse[key] = _response.parsedBody[key];
                    }
                }
                if (parsedHeaders) {
                    for (var _b = 0, _c = Object.keys(parsedHeaders); _b < _c.length; _b++) {
                        var key = _c[_b];
                        arrayResponse[key] = parsedHeaders[key];
                    }
                }
                addOperationResponse(arrayResponse);
                return arrayResponse;
            }
            if (typeName === "Composite" || typeName === "Dictionary") {
                return addOperationResponse(__assign(__assign({}, parsedHeaders), _response.parsedBody));
            }
        }
        if (bodyMapper ||
            _response.request.method === "HEAD" ||
            isPrimitiveType(_response.parsedBody)) {
            // primitive body types and HEAD booleans
            return addOperationResponse(__assign(__assign({}, parsedHeaders), { body: _response.parsedBody }));
        }
        return addOperationResponse(__assign(__assign({}, parsedHeaders), _response.parsedBody));
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    function logPolicy(logger) {
        if (logger === void 0) { logger = console.log; }
        return {
            create: function (nextPolicy, options) {
                return new LogPolicy(nextPolicy, options, logger);
            },
        };
    }
    var LogPolicy = /** @class */ (function (_super) {
        __extends(LogPolicy, _super);
        function LogPolicy(nextPolicy, options, logger) {
            if (logger === void 0) { logger = console.log; }
            var _this = _super.call(this, nextPolicy, options) || this;
            _this.logger = logger;
            return _this;
        }
        LogPolicy.prototype.sendRequest = function (request) {
            var _this = this;
            return this._nextPolicy.sendRequest(request).then(function (response) { return logResponse(_this, response); });
        };
        return LogPolicy;
    }(BaseRequestPolicy));
    function logResponse(policy, response) {
        policy.logger(">> Request: " + JSON.stringify(response.request, undefined, 2));
        policy.logger(">> Response status code: " + response.status);
        var responseBody = response.bodyAsText;
        policy.logger(">> Body: " + responseBody);
        return Promise.resolve(response);
    }

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var HeaderConstants = Constants.HeaderConstants;
    var DEFAULT_AUTHORIZATION_SCHEME$1 = "Bearer";
    /**
     * A credentials object that uses a token string and a authorzation scheme to authenticate.
     */
    var TokenCredentials = /** @class */ (function () {
        /**
         * Creates a new TokenCredentials object.
         *
         * @constructor
         * @param {string} token The token.
         * @param {string} [authorizationScheme] The authorization scheme.
         */
        function TokenCredentials(token, authorizationScheme) {
            if (authorizationScheme === void 0) { authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME$1; }
            this.authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME$1;
            if (!token) {
                throw new Error("token cannot be null or undefined.");
            }
            this.token = token;
            this.authorizationScheme = authorizationScheme;
        }
        /**
         * Signs a request with the Authentication header.
         *
         * @param {WebResourceLike} webResource The WebResourceLike to be signed.
         * @return {Promise<WebResourceLike>} The signed request object.
         */
        TokenCredentials.prototype.signRequest = function (webResource) {
            if (!webResource.headers)
                webResource.headers = new HttpHeaders();
            webResource.headers.set(HeaderConstants.AUTHORIZATION, this.authorizationScheme + " " + this.token);
            return Promise.resolve(webResource);
        };
        return TokenCredentials;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var HeaderConstants$1 = Constants.HeaderConstants;
    var DEFAULT_AUTHORIZATION_SCHEME$2 = "Basic";
    var BasicAuthenticationCredentials = /** @class */ (function () {
        /**
         * Creates a new BasicAuthenticationCredentials object.
         *
         * @constructor
         * @param {string} userName User name.
         * @param {string} password Password.
         * @param {string} [authorizationScheme] The authorization scheme.
         */
        function BasicAuthenticationCredentials(userName, password, authorizationScheme) {
            if (authorizationScheme === void 0) { authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME$2; }
            this.authorizationScheme = DEFAULT_AUTHORIZATION_SCHEME$2;
            if (userName === null || userName === undefined || typeof userName.valueOf() !== "string") {
                throw new Error("userName cannot be null or undefined and must be of type string.");
            }
            if (password === null || password === undefined || typeof password.valueOf() !== "string") {
                throw new Error("password cannot be null or undefined and must be of type string.");
            }
            this.userName = userName;
            this.password = password;
            this.authorizationScheme = authorizationScheme;
        }
        /**
         * Signs a request with the Authentication header.
         *
         * @param {WebResourceLike} webResource The WebResourceLike to be signed.
         * @returns {Promise<WebResourceLike>} The signed request object.
         */
        BasicAuthenticationCredentials.prototype.signRequest = function (webResource) {
            var credentials = this.userName + ":" + this.password;
            var encodedCredentials = this.authorizationScheme + " " + encodeString(credentials);
            if (!webResource.headers)
                webResource.headers = new HttpHeaders();
            webResource.headers.set(HeaderConstants$1.AUTHORIZATION, encodedCredentials);
            return Promise.resolve(webResource);
        };
        return BasicAuthenticationCredentials;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    /**
     * Authenticates to a service using an API key.
     */
    var ApiKeyCredentials = /** @class */ (function () {
        /**
         * @constructor
         * @param {object} options   Specifies the options to be provided for auth. Either header or query needs to be provided.
         */
        function ApiKeyCredentials(options) {
            if (!options || (options && !options.inHeader && !options.inQuery)) {
                throw new Error("options cannot be null or undefined. Either \"inHeader\" or \"inQuery\" property of the options object needs to be provided.");
            }
            this.inHeader = options.inHeader;
            this.inQuery = options.inQuery;
        }
        /**
         * Signs a request with the values provided in the inHeader and inQuery parameter.
         *
         * @param {WebResource} webResource The WebResource to be signed.
         * @returns {Promise<WebResource>} The signed request object.
         */
        ApiKeyCredentials.prototype.signRequest = function (webResource) {
            if (!webResource) {
                return Promise.reject(new Error("webResource cannot be null or undefined and must be of type \"object\"."));
            }
            if (this.inHeader) {
                if (!webResource.headers) {
                    webResource.headers = new HttpHeaders();
                }
                for (var headerName in this.inHeader) {
                    webResource.headers.set(headerName, this.inHeader[headerName]);
                }
            }
            if (this.inQuery) {
                if (!webResource.url) {
                    return Promise.reject(new Error("url cannot be null in the request object."));
                }
                if (webResource.url.indexOf("?") < 0) {
                    webResource.url += "?";
                }
                for (var key in this.inQuery) {
                    if (!webResource.url.endsWith("?")) {
                        webResource.url += "&";
                    }
                    webResource.url += key + "=" + this.inQuery[key];
                }
            }
            return Promise.resolve(webResource);
        };
        return ApiKeyCredentials;
    }());

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var TopicCredentials = /** @class */ (function (_super) {
        __extends(TopicCredentials, _super);
        /**
         * Creates a new EventGrid TopicCredentials object.
         *
         * @constructor
         * @param {string} topicKey   The EventGrid topic key
         */
        function TopicCredentials(topicKey) {
            var _this = this;
            if (!topicKey || (topicKey && typeof topicKey !== "string")) {
                throw new Error("topicKey cannot be null or undefined and must be of type string.");
            }
            var options = {
                inHeader: {
                    "aeg-sas-key": topicKey,
                },
            };
            _this = _super.call(this, options) || this;
            return _this;
        }
        return TopicCredentials;
    }(ApiKeyCredentials));

    // Copyright (c) Microsoft Corporation. All rights reserved.
    var DomainCredentials = /** @class */ (function (_super) {
        __extends(DomainCredentials, _super);
        /**
         * Creates a new EventGrid DomainCredentials object.
         *
         * @constructor
         * @param {string} domainKey   The EventGrid domain key
         */
        function DomainCredentials(domainKey) {
            var _this = this;
            if (!domainKey || (domainKey && typeof domainKey !== "string")) {
                throw new Error("domainKey cannot be null or undefined and must be of type string.");
            }
            var options = {
                inHeader: {
                    "aeg-sas-key": domainKey,
                },
            };
            _this = _super.call(this, options) || this;
            return _this;
        }
        return DomainCredentials;
    }(ApiKeyCredentials));

    exports.ApiKeyCredentials = ApiKeyCredentials;
    exports.AzureIdentityCredentialAdapter = AzureIdentityCredentialAdapter;
    exports.BaseRequestPolicy = BaseRequestPolicy;
    exports.BasicAuthenticationCredentials = BasicAuthenticationCredentials;
    exports.Constants = Constants;
    exports.DefaultHttpClient = XhrHttpClient;
    exports.DomainCredentials = DomainCredentials;
    exports.HttpHeaders = HttpHeaders;
    exports.MapperType = MapperType;
    exports.RequestPolicyOptions = RequestPolicyOptions;
    exports.RestError = RestError;
    exports.Serializer = Serializer;
    exports.ServiceClient = ServiceClient;
    exports.TokenCredentials = TokenCredentials;
    exports.TopicCredentials = TopicCredentials;
    exports.URLBuilder = URLBuilder;
    exports.URLQuery = URLQuery;
    exports.WebResource = WebResource;
    exports.agentPolicy = agentPolicy;
    exports.applyMixins = applyMixins;
    exports.delay = delay;
    exports.deserializationPolicy = deserializationPolicy;
    exports.deserializeResponseBody = deserializeResponseBody;
    exports.encodeUri = encodeUri;
    exports.executePromisesSequentially = executePromisesSequentially;
    exports.exponentialRetryPolicy = exponentialRetryPolicy;
    exports.flattenResponse = flattenResponse;
    exports.generateClientRequestIdPolicy = generateClientRequestIdPolicy;
    exports.generateUuid = generateUuid;
    exports.getDefaultProxySettings = getDefaultProxySettings;
    exports.getDefaultUserAgentValue = getDefaultUserAgentValue;
    exports.isDuration = isDuration;
    exports.isNode = isNode;
    exports.isValidUuid = isValidUuid;
    exports.logPolicy = logPolicy;
    exports.promiseToCallback = promiseToCallback;
    exports.promiseToServiceCallback = promiseToServiceCallback;
    exports.proxyPolicy = proxyPolicy;
    exports.redirectPolicy = redirectPolicy;
    exports.serializeObject = serializeObject;
    exports.signingPolicy = signingPolicy;
    exports.stripRequest = stripRequest;
    exports.stripResponse = stripResponse;
    exports.systemErrorRetryPolicy = systemErrorRetryPolicy;
    exports.throttlingRetryPolicy = throttlingRetryPolicy;
    exports.userAgentPolicy = userAgentPolicy;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=msRest.browser.js.map

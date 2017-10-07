/**
 * Created by dagan on 07/04/2014.
 */

import XdUtils from './services/xd-utils.js';

'use strict';
/* global console, XdUtils */
window.xdLocalStorage = window.xdLocalStorage || (function () {
  var MESSAGE_NAMESPACE_CALLER = 'cross-domain-local-message-caller';
  var MESSAGE_NAMESPACE_IFRAME = 'cross-domain-local-message-iframe';
  var options = {
    iframeId: 'cross-domain-iframe',
    iframeUrl: undefined,
    nameSpace: undefined,
    initCallback: function (frameid) {}
  };
  var requestId = -1;
  var requests = {};
  var exporter = {
    domains: {},
    state: "init"
  };

  function applyCallback(data) {
    if (requests[data.id]) {
      requests[data.id](data);
      delete requests[data.id];
    }
  }

  function receiveMessage(event) {
    var data;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      //not our message, can ignore
    }
    if (data && data.namespace === MESSAGE_NAMESPACE_IFRAME) {
      if (data.id === 'iframe-ready') {
        var ns = data.ns;
        var obj = exporter.domains[ns];
        obj.state = "ready";
        obj.initCallback(data);
      } else {
        applyCallback(data);
      }
    }
  }


  function buildMessage(iframe, action, key, value, callback) {
    requestId++;
    requests[requestId] = callback;
    var data = {
      namespace: MESSAGE_NAMESPACE_CALLER,
      id: requestId,
      action: action,
      key: key,
      value: value,
    };
    iframe.contentWindow.postMessage(JSON.stringify(data), '*');
  }

  function HookMessage() {
    if (window.addEventListener) {
      window.addEventListener('message', receiveMessage, false);
    } else {
      window.attachEvent('onmessage', receiveMessage);
    }
  }

  function attach_iframe(exporter, iframe) {
    exporter.domains[iframe.ns] = iframe;
  }

  function createiframe(exporter, customOptions) {
    options = XdUtils.extend(customOptions, options);
    var temp = document.createElement('div');
    options.iframeId = "cross-domain-local-storage-" + options.nameSpace;
    temp.innerHTML = '<iframe id="' + options.iframeId + '" src=' + options.iframeUrl + ' style="display: none;"></iframe>';
    document.body.appendChild(temp);
    var iframe = document.getElementById(options.iframeId);
    iframe.state = "init";
    iframe.ns = options.nameSpace;
    iframe.id = options.iframeId;
    iframe.initCallback = options.initCallback;

    attach_iframe( exporter, iframe );
  }


  function isDomReady() {
    return (document.readyState === 'complete');
  }
    //callback is optional for cases you use the api before window load.
  exporter.init = function (customOptions) {
    return new Promise( (resolve, reject) => {
        if ( this.state === "init" ) {
          HookMessage();
          this.state = "hooked";
        }
        if (!customOptions.iframeUrl) {
          throw 'You must specify iframeUrl';
        }

        if( !customOptions.nameSpace ) {
          throw 'You must speicify namespace';
        }

        if (isDomReady()) {
          createiframe(this, customOptions);
          resolve({});
        } else {
          var that = this;
          if (document.addEventListener) {
            // All browsers expect IE < 9
            document.addEventListener('readystatechange', function () {
              if (isDomReady()) {
                createiframe(that, customOptions);
                resolve({});
              } else {
                reject({});
              }
            });
          } else {
            // IE < 9
            document.attachEvent('readystatechange', function () {
              if (isDomReady()) {
                createiframe(that, customOptions);
                resolve({});
              } else {
                reject({});
              }
            });
          }
        }
      });
    };

  exporter.setItem = function (ns, key, value, callback) {
      buildMessage(this.domains[ns], 'set', key, value, callback);
    };
  exporter.getItem = function (ns, key, callback) {
      buildMessage(this.domains[ns], 'get', key,  null, callback);
    };
  exporter.removeItem = function (ns, key, callback) {
      buildMessage(this.domains[ns], 'remove', key,  null, callback);
    };
  exporter.key = function (ns, index, callback) {
      buildMessage(this.domains[ns], 'key', index,  null, callback);
    };
  exporter.getSize = function(ns, callback) {
      buildMessage(this.domains[ns], 'size', null, null, callback);
    };
  exporter.getLength = function(ns, callback) {
      buildMessage(this.domains[ns], 'length', null, null, callback);
    };
  exporter.clear = function (ns, callback) {
      buildMessage(this.domains[ns], 'clear', null,  null, callback);
    };

  return exporter;
})();

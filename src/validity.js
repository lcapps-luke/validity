/**
 * Validity @version@
 * @copyright@
 * http://github.com/renyard/validity
 */
(function() {
	"use strict";
	var alt = false,
		shift = false,
		opts = {};

	/**
	 * @private
	 * @function
	 * @name _requestValidation
	 */
	function _requestValidation() {
		browser.runtime.sendMessage({'action': 'validate'});
	}

	/**
	 * @private
	 * @function
	 * @name _getOptions
	 */
	function _getOptions(callback) {
		browser.runtime.sendMessage({'action': 'options'}).then(function(options){
            //	Copy to closure scope.
			opts = options;

			//	If a callback was passed in, call it, passing in object returned from controller.
			if (typeof callback === 'function') {
				callback(opts);
			}
        });
	}

	/**
	 * @private
	 * @function
	 * @name _logMessages
	 */
	function _logMessages(response) {
		var messages,
			message,
			line,
			errorCount = response.errorCount,
			warningCount = response.warningCount,
			//toEval = '';

		messages = response.messages;

		if (messages === undefined) {
			/*!debug*/
			console.error('No messages returned from validator.');
			/*gubed!*/
			return;
		}

		if (errorCount > 0 || warningCount > 0) {
			//	Collapse results based on option
			if (errorCount > 0) {
                _createConsoleGroup('' + errorCount + ' validation error' + (errorCount > 1?'s':''));
			}
			else {
                _createConsoleGroup('Document is valid with ' + warningCount + ' warning' + (warningCount > 1?'s':''))
			}

			for(var i in messages) {
				message = messages[i];
				line = message.lastLine;
                
                console[message.type]((line > 0?'line ' + line + ': ':'') + message.message.replace(/\r\n|\n|\r/g, ''));
			}

            console.groupEnd();
		}
		else {
            console.info('Document is valid ');
		}
	}
    
    function _createConsoleGroup(message){
        if(console.groupCollapsed && opts.collapseResults){
            console.groupCollapsed(message);
        }else{
            console.group(message);
        }
    }

	/**
	 * @private
	 * @function
	 * @name _init
	 */
	function _init() {
		_getOptions(function() {
			browser.runtime.sendMessage({'action': 'init'}).then(function(response){
                if (response.attatchActions === true) {
                    browser.runtime.onMessage.addListener(function(results){
                        browser.runtime.sendMessage({'action': 'options'}).then(function(options){
                            opts = options;
							_logMessages(results);
                        });
                    });
				}
            });
		});
	}

	_init();

})();

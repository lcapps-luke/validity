(function(validity) {
	browser.runtime.onInstalled.addListener(function(details) {
		if (details.reason === 'update') {
			var validator = validity.opts.option('validator');

			if (validator !== undefined && validator !== '') {
				validity.opts.option('legacy', true);
			}
		}
	});
})(validity || {});

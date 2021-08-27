/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"sap/treinamento/prjcat/projectcategories/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});
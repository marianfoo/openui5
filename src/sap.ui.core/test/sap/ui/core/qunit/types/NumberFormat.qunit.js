/*global QUnit, sinon */
sap.ui.define(["sap/ui/core/format/NumberFormat", "sap/ui/core/Locale", "sap/ui/core/LocaleData", "sap/base/Log"], function (NumberFormat, Locale, LocaleData, Log) {
	"use strict";

	/*eslint no-floating-decimal:0 */

	var oDefaultInteger = NumberFormat.getIntegerInstance(),
		oDefaultFloat = NumberFormat.getFloatInstance(),
		oCustomInteger = NumberFormat.getIntegerInstance({
			maxIntegerDigits: 4,
			minIntegerDigits: 2,
			groupingEnabled: true,
			groupingSeparator: ".",
			decimalSeparator: "."
		}),
		oCustomFloat = NumberFormat.getFloatInstance({
			maxIntegerDigits: 4,
			minIntegerDigits: 2,
			maxFractionDigits: 4,
			minFractionDigits: 2,
			groupingEnabled: false,
			groupingSeparator: ".",
			decimalSeparator: ","
		});

	QUnit.module("NumberFormat");

	QUnit.test("invalid groupingSize", function(assert) {
		[-1, 0].forEach(function (groupingSize) {
			var oIntegerInstance = NumberFormat.getIntegerInstance({
				groupingEnabled: true,
				groupingSize: groupingSize
			});
			assert.strictEqual(oIntegerInstance.format(12345), "", "integer with groupingSize: '" + groupingSize + "'");

			// float instance has groupingEnabled: true by default
			var oFloatInstance = NumberFormat.getFloatInstance({
				groupingSize: groupingSize
			});
			assert.strictEqual(oFloatInstance.format(12345), "", "float with groupingSize: '" + groupingSize + "'");
		});
	});

	QUnit.test("Constructor call leads to error", function(assert) {
		assert.throws(function() {
			new NumberFormat();
		},
		new Error(),
		"NumberFormat constructor is forbidden");
	});

	QUnit.test("integer default format", function (assert) {
		assert.equal(oDefaultInteger.format(1), "1", "1");
		assert.equal(oDefaultInteger.format(123), "123", "123");
		// Integer instance has TOWARDS_ZERO set as default rounding mode
		assert.equal(oDefaultInteger.format(123.23), "123", "123.23");
		assert.equal(oDefaultInteger.format(123.78), "123", "123.78");
		assert.equal(oDefaultInteger.format(-123.23), "-123", "-123.23");
		assert.equal(oDefaultInteger.format(-123.78), "-123", "-123.78");
		assert.equal(oDefaultInteger.format(1234), "1234", "1234");
		assert.equal(oDefaultInteger.format(12345), "12345", "12345");
		assert.equal(oDefaultInteger.format(-123), "-123", "-123");
	});

	QUnit.test("integer format for a specific locale", function (assert) {
		var oLocale = new Locale("de-DE");
		var oIntegerFormat = NumberFormat.getIntegerInstance(oLocale);
		assert.equal(oIntegerFormat.format(1), "1", "1");
		assert.equal(oIntegerFormat.format(123), "123", "123");
		assert.equal(oIntegerFormat.format(123.23), "123", "123.23");
		assert.equal(oIntegerFormat.format(1234), "1234", "1234");
		assert.equal(oIntegerFormat.format(12345), "12345", "12345");
		assert.equal(oIntegerFormat.format(-123), "-123", "-123");
	});

	QUnit.test("integer custom format", function (assert) {
		assert.equal(oCustomInteger.format(1), "01", "1");
		assert.equal(oCustomInteger.format(123), "123", "123");
		assert.equal(oCustomInteger.format(123.23), "123", "123.23");
		assert.equal(oCustomInteger.format(1234), "1.234", "1234");
		assert.equal(oCustomInteger.format(12345), "?.???", "12345");
		assert.equal(oCustomInteger.format(-123), "-123", "-123");
	});

	QUnit.test("integer short style", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFormat = NumberFormat.getIntegerInstance({ style: "short" }, oLocale);

		assert.equal(oFormat.format(1), "1", "1 formatted");
		assert.equal(oFormat.format(12), "12", "12 formatted");
		assert.equal(oFormat.format(123), "123", "123 formatted");
		assert.equal(oFormat.format(999), "999", "999 formatted");
		assert.equal(oFormat.format(1234), "1234", "1234 formatted");
		assert.equal(oFormat.format(9999), "9999", "9999 formatted");
		assert.equal(oFormat.format(12345), "12345", "12345 formatted");
		assert.equal(oFormat.format(99999), "99999", "99999 formatted");
		assert.equal(oFormat.format(123456), "123456", "123456 formatted");
		assert.equal(oFormat.format(999999), "1\xa0Mio.", "999999 formatted");
		assert.equal(oFormat.format(1234567), "1,2\xa0Mio.", "1234567 formatted");
		assert.equal(oFormat.format(9999999), "10\xa0Mio.", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "12\xa0Mio.", "12345678 formatted");
		assert.equal(oFormat.format(99999999), "100\xa0Mio.", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "123\xa0Mio.", "123456789 formatted");
		assert.equal(oFormat.format(999999999), "1\xa0Mrd.", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "1,2\xa0Mrd.", "1234567890 formatted");
		assert.equal(oFormat.format(9999999999), "10\xa0Mrd.", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "12\xa0Mrd.", "12345678901 formatted");
		assert.equal(oFormat.format(99999999999), "100\xa0Mrd.", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "123\xa0Mrd.", "123456789012 formatted");
		assert.equal(oFormat.format(999999999999), "1\xa0Bio.", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "1,2\xa0Bio.", "1234567890123 formatted");
		assert.equal(oFormat.format(-1), "-1", "-1 formatted");
		assert.equal(oFormat.format(-12), "-12", "-12 formatted");
		assert.equal(oFormat.format(-123), "-123", "-123 formatted");
		assert.equal(oFormat.format(-999), "-999", "-999 formatted");
		assert.equal(oFormat.format(-1234), "-1234", "-1234 formatted");
		assert.equal(oFormat.format(-9999), "-9999", "-9999 formatted");
		assert.equal(oFormat.format(-12345), "-12345", "-12345 formatted");
		assert.equal(oFormat.format(-99999), "-99999", "-99999 formatted");
		assert.equal(oFormat.format(-123456), "-123456", "-123456 formatted");
		assert.equal(oFormat.format(-999999), "-1\xa0Mio.", "-999999 formatted");
		assert.equal(oFormat.format(-1234567), "-1,2\xa0Mio.", "-1234567 formatted");
		assert.equal(oFormat.format(-9999999), "-10\xa0Mio.", "-9999999 formatted");
		assert.equal(oFormat.format(-12345678), "-12\xa0Mio.", "-12345678 formatted");
		assert.equal(oFormat.format(-99999999), "-100\xa0Mio.", "-99999999 formatted");
		assert.equal(oFormat.format(-123456789), "-123\xa0Mio.", "-123456789 formatted");
		assert.equal(oFormat.format(-999999999), "-1\xa0Mrd.", "-999999999 formatted");
		assert.equal(oFormat.format(-1234567890), "-1,2\xa0Mrd.", "-1234567890 formatted");
		assert.equal(oFormat.format(-9999999999), "-10\xa0Mrd.", "-9999999999 formatted");
		assert.equal(oFormat.format(-12345678901), "-12\xa0Mrd.", "-12345678901 formatted");
		assert.equal(oFormat.format(-99999999999), "-100\xa0Mrd.", "-99999999999 formatted");
		assert.equal(oFormat.format(-123456789012), "-123\xa0Mrd.", "-123456789012 formatted");
		assert.equal(oFormat.format(-999999999999), "-1\xa0Bio.", "-999999999999 formatted");
		assert.equal(oFormat.format(-1234567890123), "-1,2\xa0Bio.", "-1234567890123 formatted");

		assert.equal(oFormat.parse("1"), 1, "\"1\" parsed");
		assert.equal(oFormat.parse("12"), 12, "\"12\" parsed");
		assert.equal(oFormat.parse("123"), 123, "\"123\" parsed");
		assert.equal(oFormat.parse("1230"), 1230, "\"1230\" parsed");
		assert.equal(oFormat.parse("1 Mio."), 1000000, "\"1 Mio.\" parsed");
		assert.equal(oFormat.parse("10 Mio."), 10000000, "\"10 Mio.\" parsed");
		assert.equal(oFormat.parse("100 Mio."), 100000000, "\"100 Mio.\" parsed");
		assert.equal(oFormat.parse("1 Mrd."), 1000000000, "\"1 Mrd.\" parsed");
		assert.equal(oFormat.parse("10 Mrd."), 10000000000, "\"10 Mrd.\" parsed");
		assert.equal(oFormat.parse("100 Mrd."), 100000000000, "\"100 Mrd.\" parsed");
		assert.equal(oFormat.parse("1 Bio."), 1000000000000, "\"1 Bio.\" parsed");
		assert.equal(oFormat.parse("-1"), -1, "\"-1\" parsed");
		assert.equal(oFormat.parse("-12"), -12, "\"-12\" parsed");
		assert.equal(oFormat.parse("-123"), -123, "\"-123\" parsed");
		assert.equal(oFormat.parse("-1230"), -1230, "\"-1230\" parsed");
		assert.equal(oFormat.parse("-1 Mio."), -1000000, "\"-1 Mio.\" parsed");
		assert.equal(oFormat.parse("-10 Mio."), -10000000, "\"-10 Mio.\" parsed");
		assert.equal(oFormat.parse("-100 Mio."), -100000000, "\"-100 Mio.\" parsed");
		assert.equal(oFormat.parse("-1 Mrd."), -1000000000, "\"-1 Mrd.\" parsed");
		assert.equal(oFormat.parse("-10 Mrd."), -10000000000, "\"-10 Mrd.\" parsed");
		assert.equal(oFormat.parse("-100 Mrd."), -100000000000, "\"-100 Mrd.\" parsed");
		assert.equal(oFormat.parse("-1 Bio."), -1000000000000, "\"-1 Bio.\" parsed");

		oFormat = NumberFormat.getIntegerInstance({ style: "short", shortLimit: 10000, precision: 3 }, oLocale);

		assert.equal(oFormat.format(1), "1", "1 formatted");
		assert.equal(oFormat.format(12), "12", "12 formatted");
		assert.equal(oFormat.format(123), "123", "123 formatted");
		assert.equal(oFormat.format(999), "999", "999 formatted");
		assert.equal(oFormat.format(1234), "1234", "1234 formatted");
		assert.equal(oFormat.format(9999), "9999", "9999 formatted");
		assert.equal(oFormat.format(12345), "12345", "12345 formatted");
		assert.equal(oFormat.format(99900), "99900", "99900 formatted");
		assert.equal(oFormat.format(99990), "99990", "99990 formatted");
		assert.equal(oFormat.format(99999), "99999", "99999 formatted");
		assert.equal(oFormat.format(123456), "123456", "123456 formatted");
		assert.equal(oFormat.format(999000), "999000", "999000 formatted");
		assert.equal(oFormat.format(999900), "1\xa0Mio.", "999900 formatted");
		assert.equal(oFormat.format(999999), "1\xa0Mio.", "999999 formatted");
		assert.equal(oFormat.format(1234567), "1,23\xa0Mio.", "1234567 formatted");
		assert.equal(oFormat.format(9990000), "9,99\xa0Mio.", "9990000 formatted");
		assert.equal(oFormat.format(9999000), "10\xa0Mio.", "9999000 formatted");
		assert.equal(oFormat.format(9999999), "10\xa0Mio.", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "12,3\xa0Mio.", "12345678 formatted");
		assert.equal(oFormat.format(99900000), "99,9\xa0Mio.", "99900000 formatted");
		assert.equal(oFormat.format(99990000), "100\xa0Mio.", "99990000 formatted");
		assert.equal(oFormat.format(99999999), "100\xa0Mio.", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "123\xa0Mio.", "123456789 formatted");
		assert.equal(oFormat.format(999000000), "999\xa0Mio.", "999000000 formatted");
		assert.equal(oFormat.format(999900000), "1\xa0Mrd.", "999900000 formatted");
		assert.equal(oFormat.format(999999999), "1\xa0Mrd.", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "1,23\xa0Mrd.", "1234567890 formatted");
		assert.equal(oFormat.format(9990000000), "9,99\xa0Mrd.", "9990000000 formatted");
		assert.equal(oFormat.format(9999999999), "10\xa0Mrd.", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "12,3\xa0Mrd.", "12345678901 formatted");
		assert.equal(oFormat.format(99900000000), "99,9\xa0Mrd.", "99900000000 formatted");
		assert.equal(oFormat.format(99999999999), "100\xa0Mrd.", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "123\xa0Mrd.", "123456789012 formatted");
		assert.equal(oFormat.format(999000000000), "999\xa0Mrd.", "999000000000 formatted");
		assert.equal(oFormat.format(999999999999), "1\xa0Bio.", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "1,23\xa0Bio.", "1234567890123 formatted");
		assert.equal(oFormat.format(-1), "-1", "-1 formatted");
		assert.equal(oFormat.format(-12), "-12", "-12 formatted");
		assert.equal(oFormat.format(-123), "-123", "-123 formatted");
		assert.equal(oFormat.format(-999), "-999", "-999 formatted");
		assert.equal(oFormat.format(-1234), "-1234", "-1234 formatted");
		assert.equal(oFormat.format(-9999), "-9999", "-9999 formatted");
		assert.equal(oFormat.format(-12345), "-12345", "-12345 formatted");
		assert.equal(oFormat.format(-99900), "-99900", "-99900 formatted");
		assert.equal(oFormat.format(-99990), "-99990", "-99990 formatted");
		assert.equal(oFormat.format(-99999), "-99999", "-99999 formatted");
		assert.equal(oFormat.format(-123456), "-123456", "-123456 formatted");
		assert.equal(oFormat.format(-999000), "-999000", "-999000 formatted");
		assert.equal(oFormat.format(-999900), "-1\xa0Mio.", "-999900 formatted");
		assert.equal(oFormat.format(-999999), "-1\xa0Mio.", "-999999 formatted");
	});

	["nb-NO", "en_GB", "xx-XX", "zh_CN", "de_DE"].forEach(function(sLocale) {
		QUnit.test("lenient parsing for " + sLocale, function(assert) {
			var oLocale = new Locale(sLocale);
			var oLocaleData = new LocaleData(oLocale);
			var oFormat = NumberFormat.getIntegerInstance({}, oLocale);

			// parse minusSign
			var sMinusSymbols = oLocaleData.getLenientNumberSymbols("minusSign");
			var aMinusSymbols = sMinusSymbols.split("");
			assert.ok(aMinusSymbols.length > 0, "There should be minus symbols present");
			aMinusSymbols.forEach(function(sSymbol) {
				assert.equal(oFormat.parse(sSymbol + "100"), -100, "-100 is parsed correctly for '" + sSymbol + "' from '" + sMinusSymbols + "' (" + aMinusSymbols.join(",") + ")");
			});

			// Parse plusSign
			var sPlusSymbols = oLocaleData.getLenientNumberSymbols("plusSign");
			var aPlusSymbols = sPlusSymbols.split("");
			assert.ok(aPlusSymbols.length > 0, "There should be plus symbols present");
			aPlusSymbols.forEach(function(sSymbol) {
				assert.equal(oFormat.parse(sSymbol + "100"), 100, "100 is parsed correctly for '" + sSymbol + "' from '" + sPlusSymbols + "' (" + aPlusSymbols.join(",") + ")");
			});
		});
	});

	QUnit.test("integer short style under locale zh_CN", function (assert) {
		// The pattern for 1000-other in locale zh_CN is defined as "0" without any scale which means a number with 4 digits
		// shouldn't be formatted using the short style.
		// But when a formatted string without any scale is parsed under locale zh_CN, this pattern is always selected which
		// always results with a number multiplied by 1000. This is fixed by ignoring the pattern which doesn't have a scale
		// when parsing a formatted number.
		var oLocale = new Locale("zh_CN"),
			oFormat = NumberFormat.getIntegerInstance({
				style: "short"
			}, oLocale);

		assert.equal(oFormat.parse("1"), 1, "'1' is parsed as 1");
		assert.equal(oFormat.parse("9999"), 9999, "'9999' is parsed as 9999");
		assert.equal(oFormat.parse("1万"), 10000, "'1万' is parsed as 10000");
	});

	QUnit.test("short style with 'shortRefNumber' set", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFormat = NumberFormat.getIntegerInstance({
			style: "short",
			shortRefNumber: 999999
		}, oLocale);

		assert.equal(oFormat.format(1), "0,000001\xa0Mio.", "1 formatted");
		assert.equal(oFormat.format(12), "0,000012\xa0Mio.", "12 formatted");
		assert.equal(oFormat.format(123), "0,00012\xa0Mio.", "123 formatted");
		assert.equal(oFormat.format(999), "0,001\xa0Mio.", "999 formatted");
		assert.equal(oFormat.format(1234), "0,0012\xa0Mio.", "1234 formatted");
		assert.equal(oFormat.format(9999), "0,01\xa0Mio.", "9999 formatted");
		assert.equal(oFormat.format(12345), "0,012\xa0Mio.", "12345 formatted");
		assert.equal(oFormat.format(99900), "0,1\xa0Mio.", "99900 formatted");
		assert.equal(oFormat.format(99990), "0,1\xa0Mio.", "99990 formatted");
		assert.equal(oFormat.format(99999), "0,1\xa0Mio.", "99999 formatted");
		assert.equal(oFormat.format(123456), "0,12\xa0Mio.", "123456 formatted");
		assert.equal(oFormat.format(999000), "1\xa0Mio.", "999000 formatted");
		assert.equal(oFormat.format(999900), "1\xa0Mio.", "999900 formatted");
		assert.equal(oFormat.format(999999), "1\xa0Mio.", "999999 formatted");
		assert.equal(oFormat.format(1234567), "1,2\xa0Mio.", "1234567 formatted");
		assert.equal(oFormat.format(9990000), "10\xa0Mio.", "9990000 formatted");
		assert.equal(oFormat.format(9999000), "10\xa0Mio.", "9999000 formatted");
		assert.equal(oFormat.format(9999999), "10\xa0Mio.", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "12\xa0Mio.", "12345678 formatted");
		assert.equal(oFormat.format(99900000), "100\xa0Mio.", "99900000 formatted");
		assert.equal(oFormat.format(99990000), "100\xa0Mio.", "99990000 formatted");
		assert.equal(oFormat.format(99999999), "100\xa0Mio.", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "123\xa0Mio.", "123456789 formatted");
		assert.equal(oFormat.format(999000000), "999\xa0Mio.", "999000000 formatted");
		assert.equal(oFormat.format(999900000), "1000\xa0Mio.", "999900000 formatted");
		assert.equal(oFormat.format(999999999), "1000\xa0Mio.", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "1235\xa0Mio.", "1234567890 formatted");
		assert.equal(oFormat.format(9990000000), "9990\xa0Mio.", "9990000000 formatted");
		assert.equal(oFormat.format(9999999999), "10000\xa0Mio.", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "12346\xa0Mio.", "12345678901 formatted");
		assert.equal(oFormat.format(99900000000), "99900\xa0Mio.", "99900000000 formatted");
		assert.equal(oFormat.format(99999999999), "100000\xa0Mio.", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "123457\xa0Mio.", "123456789012 formatted");
		assert.equal(oFormat.format(999000000000), "999000\xa0Mio.", "999000000000 formatted");
		assert.equal(oFormat.format(999999999999), "1000000\xa0Mio.", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "1234568\xa0Mio.", "1234567890123 formatted");
		assert.equal(oFormat.format(-1), "-0,000001\xa0Mio.", "-1 formatted");
		assert.equal(oFormat.format(-12), "-0,000012\xa0Mio.", "-12 formatted");
		assert.equal(oFormat.format(-123), "-0,00012\xa0Mio.", "-123 formatted");
		assert.equal(oFormat.format(-999), "-0,001\xa0Mio.", "-999 formatted");
		assert.equal(oFormat.format(-1234), "-0,0012\xa0Mio.", "-1234 formatted");
		assert.equal(oFormat.format(-9999), "-0,01\xa0Mio.", "-9999 formatted");
		assert.equal(oFormat.format(-12345), "-0,012\xa0Mio.", "-12345 formatted");
		assert.equal(oFormat.format(-99900), "-0,1\xa0Mio.", "-99900 formatted");
		assert.equal(oFormat.format(-99990), "-0,1\xa0Mio.", "-99990 formatted");
		assert.equal(oFormat.format(-99999), "-0,1\xa0Mio.", "-99999 formatted");
		assert.equal(oFormat.format(-123456), "-0,12\xa0Mio.", "-123456 formatted");
		assert.equal(oFormat.format(-999000), "-1\xa0Mio.", "-999000 formatted");
		assert.equal(oFormat.format(-999900), "-1\xa0Mio.", "-999900 formatted");
		assert.equal(oFormat.format(-999999), "-1\xa0Mio.", "-999999 formatted");

		oFormat = NumberFormat.getFloatInstance({
			style: "short",
			shortRefNumber: 1000000,
			maxFractionDigits: 2
		}, oLocale);

		assert.equal(oFormat.format(1), "0\xa0Mio.", "1 formatted");
		assert.equal(oFormat.format(12), "0\xa0Mio.", "12 formatted");
		assert.equal(oFormat.format(123), "0\xa0Mio.", "123 formatted");
		assert.equal(oFormat.format(999), "0\xa0Mio.", "999 formatted");
		assert.equal(oFormat.format(1234), "0\xa0Mio.", "1234 formatted");
		assert.equal(oFormat.format(9999), "0,01\xa0Mio.", "9999 formatted");
		assert.equal(oFormat.format(12345), "0,01\xa0Mio.", "12345 formatted");
		assert.equal(oFormat.format(99900), "0,1\xa0Mio.", "99900 formatted");
		assert.equal(oFormat.format(99990), "0,1\xa0Mio.", "99990 formatted");
		assert.equal(oFormat.format(99999), "0,1\xa0Mio.", "99999 formatted");
		assert.equal(oFormat.format(123456), "0,12\xa0Mio.", "123456 formatted");
		assert.equal(oFormat.format(999000), "1\xa0Mio.", "999000 formatted");
		assert.equal(oFormat.format(999900), "1\xa0Mio.", "999900 formatted");
		assert.equal(oFormat.format(999999), "1\xa0Mio.", "999999 formatted");
		assert.equal(oFormat.format(1234567), "1,23\xa0Mio.", "1234567 formatted");
		assert.equal(oFormat.format(9990000), "9,99\xa0Mio.", "9990000 formatted");
		assert.equal(oFormat.format(9999000), "10\xa0Mio.", "9999000 formatted");
		assert.equal(oFormat.format(9999999), "10\xa0Mio.", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "12,35\xa0Mio.", "12345678 formatted");
		assert.equal(oFormat.format(99900000), "99,9\xa0Mio.", "99900000 formatted");
		assert.equal(oFormat.format(99990000), "99,99\xa0Mio.", "99990000 formatted");
		assert.equal(oFormat.format(99999999), "100\xa0Mio.", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "123,46\xa0Mio.", "123456789 formatted");
		assert.equal(oFormat.format(999000000), "999\xa0Mio.", "999000000 formatted");
		assert.equal(oFormat.format(999900000), "999,9\xa0Mio.", "999900000 formatted");
		assert.equal(oFormat.format(999999999), "1.000\xa0Mio.", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "1.234,57\xa0Mio.", "1234567890 formatted");
		assert.equal(oFormat.format(9990000000), "9.990\xa0Mio.", "9990000000 formatted");
		assert.equal(oFormat.format(9999999999), "10.000\xa0Mio.", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "12.345,68\xa0Mio.", "12345678901 formatted");
		assert.equal(oFormat.format(99900000000), "99.900\xa0Mio.", "99900000000 formatted");
		assert.equal(oFormat.format(99999999999), "100.000\xa0Mio.", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "123.456,79\xa0Mio.", "123456789012 formatted");
		assert.equal(oFormat.format(999000000000), "999.000\xa0Mio.", "999000000000 formatted");
		assert.equal(oFormat.format(999999999999), "1.000.000\xa0Mio.", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "1.234.567,89\xa0Mio.", "1234567890123 formatted");
		assert.equal(oFormat.format(-1), "0\xa0Mio.", "-1 formatted");
		assert.equal(oFormat.format(-12), "0\xa0Mio.", "-12 formatted");
		assert.equal(oFormat.format(-123), "0\xa0Mio.", "-123 formatted");
		assert.equal(oFormat.format(-999), "0\xa0Mio.", "-999 formatted");
		assert.equal(oFormat.format(-1234), "0\xa0Mio.", "-1234 formatted");
		assert.equal(oFormat.format(-9999), "-0,01\xa0Mio.", "-9999 formatted");
		assert.equal(oFormat.format(-12345), "-0,01\xa0Mio.", "-12345 formatted");
		assert.equal(oFormat.format(-99900), "-0,1\xa0Mio.", "-99900 formatted");
		assert.equal(oFormat.format(-99990), "-0,1\xa0Mio.", "-99990 formatted");
		assert.equal(oFormat.format(-99999), "-0,1\xa0Mio.", "-99999 formatted");
		assert.equal(oFormat.format(-123456), "-0,12\xa0Mio.", "-123456 formatted");
		assert.equal(oFormat.format(-990000), "-0,99\xa0Mio.", "-999000 formatted");
		assert.equal(oFormat.format(-999900), "-1\xa0Mio.", "-999900 formatted");
		assert.equal(oFormat.format(-999999), "-1\xa0Mio.", "-999999 formatted");

		oFormat = NumberFormat.getFloatInstance({
			style: "short",
			shortRefNumber: 10000000,
			maxFractionDigits: 2
		}, new Locale("zh_CN"));

		assert.equal(oFormat.format(1), "0万", "1 formatted");
		assert.equal(oFormat.format(12), "0万", "12 formatted");
		assert.equal(oFormat.format(123), "0.01万", "123 formatted");
		assert.equal(oFormat.format(999), "0.1万", "999 formatted");
		assert.equal(oFormat.format(1234), "0.12万", "1234 formatted");
		assert.equal(oFormat.format(9999), "1万", "9999 formatted");
		assert.equal(oFormat.format(12345), "1.23万", "12345 formatted");
		assert.equal(oFormat.format(99900), "9.99万", "99900 formatted");
		assert.equal(oFormat.format(99990), "10万", "99990 formatted");
		assert.equal(oFormat.format(99999), "10万", "99999 formatted");
		assert.equal(oFormat.format(123456), "12.35万", "123456 formatted");
		assert.equal(oFormat.format(999000), "99.9万", "999000 formatted");
		assert.equal(oFormat.format(999900), "99.99万", "999900 formatted");
		assert.equal(oFormat.format(999999), "100万", "999999 formatted");
		assert.equal(oFormat.format(1234567), "123.46万", "1234567 formatted");
		assert.equal(oFormat.format(9990000), "999万", "9990000 formatted");
		assert.equal(oFormat.format(9999000), "999.9万", "9999000 formatted");
		assert.equal(oFormat.format(9999999), "1,000万", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "1,234.57万", "12345678 formatted");
		assert.equal(oFormat.format(99900000), "9,990万", "99900000 formatted");
		assert.equal(oFormat.format(99990000), "9,999万", "99990000 formatted");
		assert.equal(oFormat.format(99999999), "10,000万", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "12,345.68万", "123456789 formatted");
		assert.equal(oFormat.format(999000000), "99,900万", "999000000 formatted");
		assert.equal(oFormat.format(999900000), "99,990万", "999900000 formatted");
		assert.equal(oFormat.format(999999999), "100,000万", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "123,456.79万", "1234567890 formatted");
		assert.equal(oFormat.format(9990000000), "999,000万", "9990000000 formatted");
		assert.equal(oFormat.format(9999999999), "1,000,000万", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "1,234,567.89万", "12345678901 formatted");
		assert.equal(oFormat.format(99900000000), "9,990,000万", "99900000000 formatted");
		assert.equal(oFormat.format(99999999999), "10,000,000万", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "12,345,678.9万", "123456789012 formatted");
		assert.equal(oFormat.format(999000000000), "99,900,000万", "999000000000 formatted");
		assert.equal(oFormat.format(999999999999), "100,000,000万", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "123,456,789.01万", "1234567890123 formatted");
		assert.equal(oFormat.format(-1), "0万", "-1 formatted");
		assert.equal(oFormat.format(-12), "0万", "-12 formatted");
		assert.equal(oFormat.format(-123), "-0.01万", "-123 formatted");
		assert.equal(oFormat.format(-999), "-0.1万", "-999 formatted");
		assert.equal(oFormat.format(-1234), "-0.12万", "-1234 formatted");
		assert.equal(oFormat.format(-9999), "-1万", "-9999 formatted");
		assert.equal(oFormat.format(-12345), "-1.23万", "-12345 formatted");
		assert.equal(oFormat.format(-99900), "-9.99万", "-99900 formatted");
		assert.equal(oFormat.format(-99990), "-10万", "-99990 formatted");
		assert.equal(oFormat.format(-99999), "-10万", "-99999 formatted");
		assert.equal(oFormat.format(-123456), "-12.35万", "-123456 formatted");
		assert.equal(oFormat.format(-990000), "-99万", "-999000 formatted");
		assert.equal(oFormat.format(-999900), "-99.99万", "-999900 formatted");
		assert.equal(oFormat.format(-999999), "-100万", "-999999 formatted");
	});

	QUnit.test("integer long style", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFormat = NumberFormat.getIntegerInstance({ style: "long" }, oLocale);

		assert.equal(oFormat.format(1), "1", "1 formatted");
		assert.equal(oFormat.format(12), "12", "12 formatted");
		assert.equal(oFormat.format(123), "123", "123 formatted");
		assert.equal(oFormat.format(999), "1 Tausend", "999 formatted");
		assert.equal(oFormat.format(1234), "1,2 Tausend", "1234 formatted");
		assert.equal(oFormat.format(9999), "10 Tausend", "9999 formatted");
		assert.equal(oFormat.format(12345), "12 Tausend", "12345 formatted");
		assert.equal(oFormat.format(99999), "100 Tausend", "99999 formatted");
		assert.equal(oFormat.format(123456), "123 Tausend", "123456 formatted");
		assert.equal(oFormat.format(999999), "1 Million", "999999 formatted");
		assert.equal(oFormat.format(1234567), "1,2 Millionen", "1234567 formatted");
		assert.equal(oFormat.format(9999999), "10 Millionen", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "12 Millionen", "12345678 formatted");
		assert.equal(oFormat.format(99999999), "100 Millionen", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "123 Millionen", "123456789 formatted");
		assert.equal(oFormat.format(999999999), "1 Milliarde", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "1,2 Milliarden", "1234567890 formatted");
		assert.equal(oFormat.format(9999999999), "10 Milliarden", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "12 Milliarden", "12345678901 formatted");
		assert.equal(oFormat.format(99999999999), "100 Milliarden", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "123 Milliarden", "123456789012 formatted");
		assert.equal(oFormat.format(999999999999), "1 Billion", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "1,2 Billionen", "1234567890123 formatted");

		oFormat = NumberFormat.getIntegerInstance({ style: "long", precision: 3, shortLimit: 100000 }, oLocale);

		assert.equal(oFormat.format(1), "1", "1 formatted");
		assert.equal(oFormat.format(12), "12", "12 formatted");
		assert.equal(oFormat.format(123), "123", "123 formatted");
		assert.equal(oFormat.format(999), "999", "999 formatted");
		assert.equal(oFormat.format(1234), "1234", "1234 formatted");
		assert.equal(oFormat.format(9999), "9999", "9999 formatted");
		assert.equal(oFormat.format(12345), "12345", "12345 formatted");
		assert.equal(oFormat.format(99999), "99999", "99999 formatted");
		assert.equal(oFormat.format(123456), "123 Tausend", "123456 formatted");
		assert.equal(oFormat.format(999999), "1 Million", "999999 formatted");
		assert.equal(oFormat.format(1234567), "1,23 Millionen", "1234567 formatted");
		assert.equal(oFormat.format(9999999), "10 Millionen", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "12,3 Millionen", "12345678 formatted");
		assert.equal(oFormat.format(99999999), "100 Millionen", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "123 Millionen", "123456789 formatted");
		assert.equal(oFormat.format(999999999), "1 Milliarde", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "1,23 Milliarden", "1234567890 formatted");
		assert.equal(oFormat.format(9999999999), "10 Milliarden", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "12,3 Milliarden", "12345678901 formatted");
		assert.equal(oFormat.format(99999999999), "100 Milliarden", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "123 Milliarden", "123456789012 formatted");
		assert.equal(oFormat.format(999999999999), "1 Billion", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "1,23 Billionen", "1234567890123 formatted");
		assert.equal(oFormat.format(-1), "-1", "-1 formatted");
		assert.equal(oFormat.format(-12), "-12", "-12 formatted");
		assert.equal(oFormat.format(-123), "-123", "-123 formatted");
		assert.equal(oFormat.format(-999), "-999", "-999 formatted");
		assert.equal(oFormat.format(-1234), "-1234", "-1234 formatted");
		assert.equal(oFormat.format(-9999), "-9999", "-9999 formatted");
		assert.equal(oFormat.format(-12345), "-12345", "-12345 formatted");
		assert.equal(oFormat.format(-99999), "-99999", "-99999 formatted");
		assert.equal(oFormat.format(-123456), "-123 Tausend", "-123456 formatted");
		assert.equal(oFormat.format(-999999), "-1 Million", "-999999 formatted");
		assert.equal(oFormat.format(-1234567), "-1,23 Millionen", "-1234567 formatted");

		oLocale = new Locale("ar-SA");
		oFormat = NumberFormat.getIntegerInstance({ style: "long", shortRefNumber: 1000000 }, oLocale);
		assert.equal(oFormat.format(0), "0 مليون", "0 formatted");
		assert.equal(oFormat.format(1000000), "1 مليون", "1000000 formatted");
		assert.equal(oFormat.format(2000000), "2 مليون", "2000000 formatted");
		assert.equal(oFormat.format(3000000), "3 ملايين", "3000000 formatted");
		assert.equal(oFormat.format(11000000), "11 مليون", "11000000 formatted");
		assert.equal(oFormat.format(50000000), "50 مليون", "50000000 formatted");

	});

	QUnit.test("getScale", function (assert) {
		var aLocales = ["de-DE", "zh_CN"];

		var aScales = [
			[undefined, undefined, undefined, undefined, undefined, undefined, "Mio.", "Mio.", "Mio.", "Mrd.", "Mrd.", "Mrd.", "Bio.", "Bio.", "Bio."],
			[undefined, undefined, undefined, undefined, "万", "万", "万", "万", "亿", "亿", "亿", "亿", "兆", "兆", "兆"]
		];

		aLocales.forEach(function (sLocale, index) {
			var aScaleInLocale = aScales[index];
			aScaleInLocale.forEach(function (sScale, index1) {
				var iNumber = Math.pow(10, index1),
					oFormat = NumberFormat.getFloatInstance({
						style: "short",
						shortRefNumber: iNumber
					}, new Locale(sLocale));

				assert.equal(oFormat.getScale(), sScale, "The scaling factor in Locale " + sLocale + " for " + iNumber + ": " + sScale);
			});
		});
	});

	QUnit.test("short style with 'showScale' set to false", function (assert) {
		var oLocale = new Locale("de-DE");

		var oFormat = NumberFormat.getFloatInstance({
			style: "short",
			shortRefNumber: 100000000,
			maxFractionDigits: 2,
			showScale: false
		}, oLocale);

		assert.equal(oFormat.getScale(), "Mio.", "Scale is 'Mio.'");

		assert.equal(oFormat.format(1), "0", "1 formatted");
		assert.equal(oFormat.format(12), "0", "12 formatted");
		assert.equal(oFormat.format(123), "0", "123 formatted");
		assert.equal(oFormat.format(999), "0", "999 formatted");
		assert.equal(oFormat.format(1234), "0", "1234 formatted");
		assert.equal(oFormat.format(9999), "0,01", "9999 formatted");
		assert.equal(oFormat.format(12345), "0,01", "12345 formatted");
		assert.equal(oFormat.format(99900), "0,1", "99900 formatted");
		assert.equal(oFormat.format(99990), "0,1", "99990 formatted");
		assert.equal(oFormat.format(99999), "0,1", "99999 formatted");
		assert.equal(oFormat.format(123456), "0,12", "123456 formatted");
		assert.equal(oFormat.format(999000), "1", "999000 formatted");
		assert.equal(oFormat.format(999900), "1", "999900 formatted");
		assert.equal(oFormat.format(999999), "1", "999999 formatted");
		assert.equal(oFormat.format(1234567), "1,23", "1234567 formatted");
		assert.equal(oFormat.format(9990000), "9,99", "9990000 formatted");
		assert.equal(oFormat.format(9999000), "10", "9999000 formatted");
		assert.equal(oFormat.format(9999999), "10", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "12,35", "12345678 formatted");
		assert.equal(oFormat.format(99900000), "99,9", "99900000 formatted");
		assert.equal(oFormat.format(99990000), "99,99", "99990000 formatted");
		assert.equal(oFormat.format(99999999), "100", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "123,46", "123456789 formatted");
		assert.equal(oFormat.format(999000000), "999", "999000000 formatted");
		assert.equal(oFormat.format(999900000), "999,9", "999900000 formatted");
		assert.equal(oFormat.format(999999999), "1.000", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "1.234,57", "1234567890 formatted");
		assert.equal(oFormat.format(9990000000), "9.990", "9990000000 formatted");
		assert.equal(oFormat.format(9999999999), "10.000", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "12.345,68", "12345678901 formatted");
		assert.equal(oFormat.format(99900000000), "99.900", "99900000000 formatted");
		assert.equal(oFormat.format(99999999999), "100.000", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "123.456,79", "123456789012 formatted");
		assert.equal(oFormat.format(999000000000), "999.000", "999000000000 formatted");
		assert.equal(oFormat.format(999999999999), "1.000.000", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "1.234.567,89", "1234567890123 formatted");
		assert.equal(oFormat.format(-1), "0", "-1 formatted");
		assert.equal(oFormat.format(-12), "0", "-12 formatted");
		assert.equal(oFormat.format(-123), "0", "-123 formatted");
		assert.equal(oFormat.format(-999), "0", "-999 formatted");
		assert.equal(oFormat.format(-1234), "0", "-1234 formatted");
		assert.equal(oFormat.format(-9999), "-0,01", "-9999 formatted");
		assert.equal(oFormat.format(-12345), "-0,01", "-12345 formatted");
		assert.equal(oFormat.format(-99900), "-0,1", "-99900 formatted");
		assert.equal(oFormat.format(-99990), "-0,1", "-99990 formatted");
		assert.equal(oFormat.format(-99999), "-0,1", "-99999 formatted");
		assert.equal(oFormat.format(-123456), "-0,12", "-123456 formatted");
		assert.equal(oFormat.format(-990000), "-0,99", "-999000 formatted");
		assert.equal(oFormat.format(-999900), "-1", "-999900 formatted");
		assert.equal(oFormat.format(-999999), "-1", "-999999 formatted");
	});

	QUnit.test("integer long style under locale zh_CN", function (assert) {
		// The pattern for 1000-other in locale zh_CN is defined as "0" without any scale which means a number with 4 digits
		// shouldn't be formatted using the short style.
		// But when a formatted string without any scale is parsed under locale zh_CN, this pattern is always selected which
		// always results with a number multiplied by 1000. This is fixed by ignoring the pattern which doesn't have a scale
		// when parsing a formatted number.
		var oLocale = new Locale("zh_CN"),
			oFormat = NumberFormat.getIntegerInstance({
				style: "long"
			}, oLocale);

		assert.equal(oFormat.parse("1"), 1, "'1' is parsed as 1");
		assert.equal(oFormat.parse("9999"), 9999, "'9999' is parsed as 9999");
		assert.equal(oFormat.parse("1万"), 10000, "'1万' is parsed as 10000");
	});

	QUnit.test("Priority of properties (normal style): maxFractionDigits, decimals, shortDecimals, precision", function (assert) {
		var fNum = 12345.678901;

		var oFormat = NumberFormat.getFloatInstance({
			minFractionDigits: 5,
			maxFractionDigits: 6
		});
		assert.equal(oFormat.format(fNum), "12,345.678901", fNum + " with minFractionDigits and maxFractionDigits");

		oFormat = NumberFormat.getFloatInstance({
			minFractionDigits: 5,
			maxFractionDigits: 6,
			decimals: 4
		});
		assert.equal(oFormat.format(fNum), "12,345.6789", fNum + " with minFractionDigits, maxFractionDigits and decimals");

		oFormat = NumberFormat.getFloatInstance({
			minFractionDigits: 5,
			maxFractionDigits: 6,
			decimals: 4,
			// shortDecimals shouldn't have effect on normal style formatter
			shortDecimals: 3
		});
		assert.equal(oFormat.format(fNum), "12,345.6789", fNum + " with minFractionDigits, maxFractionDigits, decimals and shortDecimals");

		oFormat = NumberFormat.getFloatInstance({
			minFractionDigits: 5,
			maxFractionDigits: 6,
			decimals: 4,
			// shortDecimals shouldn't have effect on normal style formatter
			shortDecimals: 3,
			precision: 7
		});
		assert.equal(oFormat.format(fNum), "12,345.68", fNum + " with minFractionDigits, maxFractionDigits, decimals, shortDecimals and precision");

		oFormat = NumberFormat.getFloatInstance({
			minFractionDigits: 5,
			maxFractionDigits: 6,
			decimals: 4,
			// shortDecimals shouldn't have effect on normal style formatter
			shortDecimals: 3,
			precision: 2
		});
		assert.equal(oFormat.format(fNum), "12,346", fNum + " with minFractionDigits, maxFractionDigits, decimals, shortDecimals and precision (precision set with a number less than the number of integer digits)");

		oFormat = NumberFormat.getFloatInstance({
			precision: 5,
			decimals: 3
		});

		assert.equal(oFormat.format(100), "100.00", "100 formatted with precision 5 and decimals 3");
	});

	QUnit.test("Priority of properties (short style): maxFractionDigits, decimals, shortDecimals, precision", function (assert) {
		var fNum = 3456.678901;

		var oFormat = NumberFormat.getFloatInstance({
			style: "short"
		});
		assert.equal(oFormat.format(fNum), "3.5K", fNum + " with no setting");


		oFormat = NumberFormat.getFloatInstance({
			style: "short",
			minFractionDigits: 5,
			maxFractionDigits: 6
		});
		assert.equal(oFormat.format(fNum), "3.456679K", fNum + " with minFractionDigits and maxFractionDigits");

		oFormat = NumberFormat.getFloatInstance({
			style: "short",
			minFractionDigits: 5,
			maxFractionDigits: 6,
			decimals: 4
		});
		assert.equal(oFormat.format(fNum), "3.4567K", fNum + " with minFractionDigits, maxFractionDigits and decimals");

		oFormat = NumberFormat.getFloatInstance({
			style: "short",
			minFractionDigits: 5,
			maxFractionDigits: 6,
			decimals: 4,
			shortDecimals: 3
		});
		assert.equal(oFormat.format(fNum), "3.457K", fNum + " with minFractionDigits, maxFractionDigits, decimals and shortDecimals");

		oFormat = NumberFormat.getFloatInstance({
			style: "short",
			minFractionDigits: 5,
			maxFractionDigits: 6,
			decimals: 4,
			shortDecimals: 3,
			precision: 1
		});
		assert.equal(oFormat.format(fNum), "3K", fNum + " with minFractionDigits, maxFractionDigits, decimals, shortDecimals and precision");

		oFormat = NumberFormat.getFloatInstance({
			style: "short",
			decimals: 0
		});
		assert.equal(oFormat.format(fNum), "3K", fNum + " with decimals: 0");

		oFormat = NumberFormat.getFloatInstance({
			style: "short",
			minFractionDigits: 5,
			maxFractionDigits: 6,
			decimals: 4,
			shortDecimals: 3,
			precision: 1
		});
		assert.equal(oFormat.format(123456.678901), "123K", fNum + " with minFractionDigits, maxFractionDigits, decimals, shortDecimals and precision (precision set with a number less than the number of integer digits)");
	});

	QUnit.test("float default format", function (assert) {
		assert.equal(oDefaultFloat.format(.1), "0.1", ".1");
		assert.equal(oDefaultFloat.format(0.123), "0.123", "0.123");
		assert.equal(oDefaultFloat.format(123), "123", "123");
		assert.equal(oDefaultFloat.format(123.23), "123.23", "123.23");
		assert.equal(oDefaultFloat.format(1234), "1,234", "1234");
		assert.equal(oDefaultFloat.format(12345), "12,345", "12345");
		assert.equal(oDefaultFloat.format(12345.123), "12,345.123", "12345.123");
		assert.equal(oDefaultFloat.format(12345.12345), "12,345.12345", "12345.12345");
		assert.equal(oDefaultFloat.format(1234567890), "1,234,567,890", "1234567890");
		assert.equal(oDefaultFloat.format(-123.23), "-123.23", "-123.23");
		assert.equal(oDefaultFloat.format("1.23e+9"), "1,230,000,000", "1.23e+9");
		assert.equal(oDefaultFloat.format("1.23e-9"), "0.00000000123", "1.23e-9");
		assert.equal(oDefaultFloat.format("-1.23e+9"), "-1,230,000,000", "-1.23e+9");
		assert.equal(oDefaultFloat.format("-1.23e-9"), "-0.00000000123", "-1.23e-9");
		assert.equal(oDefaultFloat.format("1.2345e+2"), "123.45", "1.2345e+2");
		assert.equal(oDefaultFloat.format("12345e-2"), "123.45", "12345e-2");
		assert.equal(oDefaultFloat.format("-1.2345e+2"), "-123.45", "-1.2345e+2");
		assert.equal(oDefaultFloat.format("-12345e-2"), "-123.45", "-12345e-2");
		assert.equal(oDefaultFloat.format("123.45e+2"), "12,345", "123.45e+2");
		assert.equal(oDefaultFloat.format("12.345e-2"), "0.12345", "12.345e-2");
		assert.equal(oDefaultFloat.format("-123.45e+2"), "-12,345", "-123.45e+2");
		assert.equal(oDefaultFloat.format("-12.345e-2"), "-0.12345", "-12.345e-2");
		assert.equal(oDefaultFloat.format("123456.789e+2"), "12,345,678.9", "123456.789e+2");
		assert.equal(oDefaultFloat.format("123.456789e-2"), "1.23456789", "123.456789e-2");
		assert.equal(oDefaultFloat.format("-123456.789e+2"), "-12,345,678.9", "-123456.789e+2");
		assert.equal(oDefaultFloat.format("-123.456789e-2"), "-1.23456789", "-123.456789e-2");
		assert.equal(oDefaultFloat.format("1000.00"), "1,000.00", "1000.00");
		assert.equal(oDefaultFloat.format("1000.0000"), "1,000.0000", "1000.0000");
		assert.equal(oDefaultFloat.format("123456789.123456789"), "123,456,789.123456789", "123456789.123456789 (string)");
		// Due to IEEE_754 (Binary Floating-Point Arithmetic)
		// JavaScript can only represent the number 123456789.123456789 as 123456789.12345679
		// eslint-disable-next-line no-loss-of-precision
		assert.equal(oDefaultFloat.format(123456789.123456789), "123,456,789.12345679", "123456789.123456789 (number)");
	});

	QUnit.test("float default format preserveDecimals=true", function (assert) {
		var oFloatInstanceWithPreserveDecimals = NumberFormat.getFloatInstance({preserveDecimals: true});
		assert.equal(oFloatInstanceWithPreserveDecimals.format(.1), "0.1", ".1");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(0.123), "0.123", "0.123");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(123), "123", "123");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(123.23), "123.23", "123.23");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(1234), "1,234", "1234");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(12345), "12,345", "12345");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(12345.123), "12,345.123", "12345.123");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(12345.12345), "12,345.12345", "12345.12345");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(1234567890), "1,234,567,890", "1234567890");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(-123.23), "-123.23", "-123.23");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("1.23e+9"), "1,230,000,000", "1.23e+9");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("1.23e-9"), "0.00000000123", "1.23e-9");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("-1.23e+9"), "-1,230,000,000", "-1.23e+9");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("-1.23e-9"), "-0.00000000123", "-1.23e-9");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("1.2345e+2"), "123.45", "1.2345e+2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("12345e-2"), "123.45", "12345e-2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("-1.2345e+2"), "-123.45", "-1.2345e+2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("-12345e-2"), "-123.45", "-12345e-2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("123.45e+2"), "12,345", "123.45e+2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("12.345e-2"), "0.12345", "12.345e-2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("-123.45e+2"), "-12,345", "-123.45e+2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("-12.345e-2"), "-0.12345", "-12.345e-2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("123456.789e+2"), "12,345,678.9", "123456.789e+2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("123.456789e-2"), "1.23456789", "123.456789e-2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("-123456.789e+2"), "-12,345,678.9", "-123456.789e+2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("-123.456789e-2"), "-1.23456789", "-123.456789e-2");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("1.20300"), "1.20300", "1.20300");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("1000.00"), "1,000.00", "1000.00");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("1000.0000"), "1,000.0000", "1000.0000");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("1000.00000000"), "1,000.00000000", "1000.00000000");
		assert.equal(oFloatInstanceWithPreserveDecimals.format("123456789.123456789"), "123,456,789.123456789", "123456789.123456789 (string)");
		// Due to IEEE_754 (Binary Floating-Point Arithmetic)
		// JavaScript can only represent the number 123456789.123456789 as 123456789.12345679
		// eslint-disable-next-line no-loss-of-precision
		assert.equal(oFloatInstanceWithPreserveDecimals.format(123456789.123456789), "123,456,789.12345679", "123456789.12345679 (number)");
	});

	QUnit.test("float with rounding", function (assert) {
		var oFloatInstanceWithPreserveDecimals = NumberFormat.getFloatInstance({preserveDecimals: true});

		// 123456789.12345679
		assert.equal(oDefaultFloat.format(123456789.12345679), "123,456,789.12345679", "123456789.12345679 (number)");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(123456789.12345679), "123,456,789.12345679", "123456789.12345679 (number)");

		// 0.9999999999999999
		assert.equal(oDefaultFloat.format(0.9999999999999999), "0.9999999999999999", "0.9999999999999999");
		assert.equal(oFloatInstanceWithPreserveDecimals.format(0.9999999999999999), "0.9999999999999999", "0.9999999999999999");
	});

	QUnit.test("float with big numbers and maxIntegerDigits", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFloatFormat = NumberFormat.getFloatInstance({
			maxIntegerDigits: 148
		}, oLocale);
		var sExpectedInRange = "1.234.567.890" + ".000".repeat(46);
		assert.equal(oFloatFormat.format(1.23456789e+147).toString(), sExpectedInRange, "big number in range");

		var sExpectedOutOfRange = "?.???.???.???" + ".???".repeat(46);
		assert.equal(oFloatFormat.format(1.23456789e+150).toString(), sExpectedOutOfRange, "big number out of range");
	});

	QUnit.test("float format for a specific locale", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFloatFormat = NumberFormat.getFloatInstance(oLocale);
		assert.equal(oFloatFormat.format(.1), "0,1", ".1");
		assert.equal(oFloatFormat.format(0.123), "0,123", "0.123");
		assert.equal(oFloatFormat.format(123), "123", "123");
		assert.equal(oFloatFormat.format(123.23), "123,23", "123.23");
		assert.equal(oFloatFormat.format(1234), "1.234", "1234");
		assert.equal(oFloatFormat.format(12345), "12.345", "12345");
		assert.equal(oFloatFormat.format(12345.123), "12.345,123", "12345.123");
		assert.equal(oFloatFormat.format(12345.12345), "12.345,12345", "12345.12345");
		assert.equal(oFloatFormat.format(1234567890), "1.234.567.890", "1234567890");
		assert.equal(oFloatFormat.format(-123.23), "-123,23", "-123.23");
		assert.equal(oFloatFormat.format("1000.00"), "1.000,00", "1000.00");
		assert.equal(oFloatFormat.format("1000.0000"), "1.000,0000", "1000.0000");
	});

	QUnit.test("float format with decimals and indian grouping", function (assert) {
		var oLocale = new Locale("en-IN");
		var oFloatFormat = NumberFormat.getFloatInstance({
			decimals: 2
		}, oLocale);
		assert.equal(oFloatFormat.format(1), "1.00", "1");
		assert.equal(oFloatFormat.parse("1.00"), 1, "parse to parse to 1");
		assert.equal(oFloatFormat.format(10), "10.00", "10");
		assert.equal(oFloatFormat.parse("10.00"), 10, "parse to 10");
		assert.equal(oFloatFormat.format(1000), "1,000.00", "1000");
		assert.equal(oFloatFormat.parse("1,000.00"), 1000, "parse to 1000");
		assert.equal(oFloatFormat.format(100000), "1,00,000.00", "100000");
		assert.equal(oFloatFormat.parse("1,00,000.00"), 100000, "parse to 100000");
		assert.equal(oFloatFormat.format(1000000), "10,00,000.00", "1000000");
		assert.equal(oFloatFormat.parse("10,00,000.00"), 1000000, "parse to 1000000");
		assert.equal(oFloatFormat.format(10000000), "1,00,00,000.00", "10000000");
		assert.equal(oFloatFormat.parse("1,00,00,000.00"), 10000000, "parse to 10000000");
		assert.equal(oFloatFormat.format(1000000000), "1,00,00,00,000.00", "1000000000");
		assert.equal(oFloatFormat.parse("1,00,00,00,000.00"), 1000000000, "parse to 1000000000");
		assert.equal(oFloatFormat.format(100000000000), "1,00,00,00,00,000.00", "100000000000");
		assert.equal(oFloatFormat.parse("1,00,00,00,00,000.00"), 100000000000, "parse to 100000000000");

		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.equal(oFloatFormat.parse("1,000,00,000"), 1e+8, "parse to 1,000,00,000");
		assert.equal(oFloatFormat.parse("1,00,000,000"), 1e+8, "parse 1,00,000,000");
		assert.equal(oFloatFormat.parse("1,00,00,00"), 1e+6, "parse 1,00,00,00");
		assert.equal(oFloatFormat.parse("1,000,00"), 1e+5, "parse to 1,000,00");
		assert.equal(oFloatFormat.parse("1,00,00"), 1e+4, "parse to 1,00,00");

		// tolerated, despite wrong grouping, because decimal separator is present
		assert.equal(oFloatFormat.parse("1,00,000,000.00"), 1e+8, "parse 1,00,000,000.00");
		assert.equal(oFloatFormat.parse("1,000,00,000.00"), 1e+8, "parse to 1,000,00,000.00");
		assert.equal(oFloatFormat.parse("1,00,00,00.00"), 1e+6, "parse 1,00,00,00.00");
		assert.equal(oFloatFormat.parse("1,0000.00"), 1e+4, "parse to 1,0000.00");
		assert.equal(oFloatFormat.parse("1,000,00.00"), 1e+5, "parse to 1,000,00.00");
		assert.equal(oFloatFormat.parse("1,00,00.00"), 1e+4, "parse to 1,00,00.00");
		assert.equal(oFloatFormat.parse("1,00.00"), 1e+2, "parse to 1,00.00");
		assert.equal(oFloatFormat.parse("1,0.00"), 1e+1, "parse to 1,0.00");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oFloatFormat.parse("1,0000"), NaN, "parse to 1,0000");
		assert.deepEqual(oFloatFormat.parse("1,00"), NaN, "parse to 1,00");
		assert.deepEqual(oFloatFormat.parse("1,0"), NaN, "parse to 1,0");

		// correctly grouped (output from #format), as single separator with grouping base size (assumingly a grouping separator)
		assert.equal(oFloatFormat.parse("1,000"), 1e+3, "parse to 1,000");
	});

	QUnit.test("float format with decimals and myriad grouping", function (assert) {
		var oLocale = new Locale("ja_JP");
		var oFloatFormat = NumberFormat.getFloatInstance({
			decimals: 2,
			groupingSize: 4
		}, oLocale);
		assert.equal(oFloatFormat.format(1), "1.00", "1");
		assert.equal(oFloatFormat.format(10), "10.00", "10");
		assert.equal(oFloatFormat.format(1000), "1000.00", "1000");
		assert.equal(oFloatFormat.format(10000), "1,0000.00", "100000");
		assert.equal(oFloatFormat.format(10000000), "1000,0000.00", "1000000");
		assert.equal(oFloatFormat.format(100000000), "1,0000,0000.00", "10000000");
	});

	QUnit.test("float format with custom grouping", function (assert) {
		var oFloatFormat = NumberFormat.getFloatInstance({
			decimals: 2,
			groupingSize: 2
		});
		assert.equal(oFloatFormat.format(1), "1.00", "1");
		assert.equal(oFloatFormat.format(10), "10.00", "10");
		assert.equal(oFloatFormat.format(1000), "10,00.00", "1000");
		assert.equal(oFloatFormat.format(10000), "1,00,00.00", "10000");
		assert.equal(oFloatFormat.format(10000000), "10,00,00,00.00", "10000000");
		assert.equal(oFloatFormat.format(100000000), "1,00,00,00,00.00", "100000000");

		oFloatFormat = NumberFormat.getFloatInstance({
			decimals: 1,
			groupingSize: 3,
			groupingBaseSize: 2
		});
		assert.equal(oFloatFormat.format(1), "1.0", "1");
		assert.equal(oFloatFormat.format(10), "10.0", "10");
		assert.equal(oFloatFormat.format(1000), "10,00.0", "1000");
		assert.equal(oFloatFormat.format(10000), "100,00.0", "10000");
		assert.equal(oFloatFormat.format(10000000), "100,000,00.0", "10000000");
		assert.equal(oFloatFormat.format(100000000), "1,000,000,00.0", "100000000");

		oFloatFormat = NumberFormat.getFloatInstance({
			decimals: 1,
			groupingSize: 2,
			groupingBaseSize: 4
		});
		assert.equal(oFloatFormat.format(1), "1.0", "1");
		assert.equal(oFloatFormat.format(10), "10.0", "10");
		assert.equal(oFloatFormat.format(1000), "1000.0", "1000");
		assert.equal(oFloatFormat.format(10000), "1,0000.0", "10000");
		assert.equal(oFloatFormat.format(10000000), "10,00,0000.0", "10000000");
		assert.equal(oFloatFormat.format(100000000), "1,00,00,0000.0", "100000000");

		oFloatFormat = NumberFormat.getFloatInstance({
			decimals: 1,
			groupingSize: 5,
			groupingBaseSize: 3
		});
		assert.equal(oFloatFormat.format(1), "1.0", "1");
		assert.equal(oFloatFormat.format(10), "10.0", "10");
		assert.equal(oFloatFormat.format(1000), "1,000.0", "1000");
		assert.equal(oFloatFormat.format(10000), "10,000.0", "10000");
		assert.equal(oFloatFormat.format(10000000), "10000,000.0", "10000000");
		assert.equal(oFloatFormat.format(100000000), "1,00000,000.0", "100000000");

		oFloatFormat = NumberFormat.getFloatInstance({
			decimals: 1,
			groupingSize: 1,
			groupingBaseSize: 3
		});
		assert.equal(oFloatFormat.format(1), "1.0", "1");
		assert.equal(oFloatFormat.format(10), "10.0", "10");
		assert.equal(oFloatFormat.format(1000), "1,000.0", "1000");
		assert.equal(oFloatFormat.format(10000), "1,0,000.0", "10000");
		assert.equal(oFloatFormat.format(10000000), "1,0,0,0,0,000.0", "10000000");
		assert.equal(oFloatFormat.format(100000000), "1,0,0,0,0,0,000.0", "100000000");

		oFloatFormat = NumberFormat.getFloatInstance({
			decimals: 1,
			groupingSize: 4,
			groupingBaseSize: 1
		});
		assert.equal(oFloatFormat.format(1), "1.0", "1");
		assert.equal(oFloatFormat.format(10), "1,0.0", "10");
		assert.equal(oFloatFormat.format(1000), "100,0.0", "1000");
		assert.equal(oFloatFormat.format(10000), "1000,0.0", "10000");
		assert.equal(oFloatFormat.format(10000000), "100,0000,0.0", "10000000");
		assert.equal(oFloatFormat.format(100000000), "1000,0000,0.0", "100000000");
	});

	QUnit.test("float format with pattern defined grouping", function (assert) {
		var oFloatFormat = NumberFormat.getFloatInstance({
			pattern: "#,##0.00"
		});
		assert.equal(oFloatFormat.format(1), "1.00", "1");
		assert.equal(oFloatFormat.format(10), "10.00", "10");
		assert.equal(oFloatFormat.format(1000), "1,000.00", "1000");
		assert.equal(oFloatFormat.format(10000), "10,000.00", "10000");
		assert.equal(oFloatFormat.format(10000000), "10,000,000.00", "10000000");
		assert.equal(oFloatFormat.format(100000000), "100,000,000.00", "100000000");

		oFloatFormat = NumberFormat.getFloatInstance({
			pattern: "#,##,##0.00"
		});
		assert.equal(oFloatFormat.format(1), "1.00", "1");
		assert.equal(oFloatFormat.format(10), "10.00", "10");
		assert.equal(oFloatFormat.format(1000), "1,000.00", "1000");
		assert.equal(oFloatFormat.format(10000), "10,000.00", "10000");
		assert.equal(oFloatFormat.format(10000000), "1,00,00,000.00", "10000000");
		assert.equal(oFloatFormat.format(100000000), "10,00,00,000.00", "100000000");

		oFloatFormat = NumberFormat.getFloatInstance({
			pattern: "#,###0.00"
		});
		assert.equal(oFloatFormat.format(1), "1.00", "1");
		assert.equal(oFloatFormat.format(10), "10.00", "10");
		assert.equal(oFloatFormat.format(1000), "1000.00", "1000");
		assert.equal(oFloatFormat.format(10000), "1,0000.00", "10000");
		assert.equal(oFloatFormat.format(10000000), "1000,0000.00", "10000000");
		assert.equal(oFloatFormat.format(100000000), "1,0000,0000.00", "100000000");
	});

	QUnit.test("float custom format", function (assert) {
		assert.equal(oCustomFloat.format(.1), "00,10", ".1");
		assert.equal(oCustomFloat.format(0.123), "00,123", "0.123");
		assert.equal(oCustomFloat.format(123), "123,00", "123");
		assert.equal(oCustomFloat.format(123.23), "123,23", "123.23");
		assert.equal(oCustomFloat.format(1234), "1234,00", "1234");
		assert.equal(oCustomFloat.format(12345), "????,00", "12345");
		assert.equal(oCustomFloat.format(12345.123), "????,123", "12345.123");
		assert.equal(oCustomFloat.format(12345.12345), "????,1235", "12345.12345");
		assert.equal(oCustomFloat.format(-123.23), "-123,23", "-123.23");
		assert.equal(oCustomFloat.format("1000.00"), "1000,00", "1000.00");
		assert.equal(oCustomFloat.format("1000.0000"), "1000,0000", "1000.0000");

	});

	QUnit.test("float format with default rounding mode: HALF_AWAY_FROM_ZERO", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3
		});

		assert.equal(oFormat.format(.127), "0.127", ".127");
		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.123", ".1234");
		assert.equal(oFormat.format(.1235), "0.124", ".1235");
		assert.equal(oFormat.format(.1239), "0.124", ".1239");
		assert.equal(oFormat.format(2.1999), "2.2", "2.1999");
		assert.equal(oFormat.format(2.11), "2.11", "2.11");
		assert.equal(oFormat.format(-.1234), "-0.123", "-.1234");
		assert.equal(oFormat.format(-.1236), "-0.124", "-.1236");
		assert.equal(oFormat.format(.0005), "0.001", ".0005");
		assert.equal(oFormat.format(.0004), "0", ".0004");
		assert.equal(oFormat.format(-.0005), "-0.001", "-.0005");
		assert.equal(oFormat.format(-.0004), "0", "-.0004");

		oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 2
		});

		// These two are the famous test cases for problematic rounding in Javascript
		assert.equal(oFormat.format(35.855), "35.86", "35.855");
		assert.equal(oFormat.format(1.005), "1.01", "1.005");

		assert.equal(oFormat.format(-35.855), "-35.86", "-35.855");
		assert.equal(oFormat.format(-1.005), "-1.01", "-1.005");

		oFormat = NumberFormat.getFloatInstance({
			decimals: 2
		});
		assert.equal(oFormat.format(.005), "0.01", ".005");
		assert.equal(oFormat.format(.004), "0.00", ".004");
		assert.equal(oFormat.format(-.005), "-0.01", "-.005");
		assert.equal(oFormat.format(-.004), "0.00", "-.004");

	});

	QUnit.test("float format with rounding mode: CEILING", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3,
			roundingMode: NumberFormat.RoundingMode.CEILING
		});

		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.124", ".1234");
		assert.equal(oFormat.format(.1235), "0.124", ".1235");
		assert.equal(oFormat.format(.1239), "0.124", ".1239");
		assert.equal(oFormat.format(2.1999), "2.2", "2.1999");
		assert.equal(oFormat.format(2.11), "2.11", "2.11");
		assert.equal(oFormat.format(-.1234), "-0.123", "-.1234");
		assert.equal(oFormat.format(-.1236), "-0.123", "-.1236");
	});

	QUnit.test("float format with rounding mode: CEILING (via legacy all lower case letters: ceiling)", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3,
			roundingMode: "ceiling"
		});

		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.124", ".1234");
		assert.equal(oFormat.format(.1235), "0.124", ".1235");
		assert.equal(oFormat.format(.1239), "0.124", ".1239");
		assert.equal(oFormat.format(2.1999), "2.2", "2.1999");
		assert.equal(oFormat.format(2.11), "2.11", "2.11");
		assert.equal(oFormat.format(-.1234), "-0.123", "-.1234");
		assert.equal(oFormat.format(-.1236), "-0.123", "-.1236");
	});

	QUnit.test("float format with rounding mode: CEILING with decimals set to a string which contains a number", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			decimals: "3",
			roundingMode: NumberFormat.RoundingMode.CEILING
		});

		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.124", ".1234");
		assert.equal(oFormat.format(.1235), "0.124", ".1235");
		assert.equal(oFormat.format(.1239), "0.124", ".1239");
		assert.equal(oFormat.format(2.1999), "2.200", "2.1999");
		assert.equal(oFormat.format(2.11), "2.110", "2.11");
		assert.equal(oFormat.format(-.1234), "-0.123", "-.1234");
		assert.equal(oFormat.format(-.1236), "-0.123", "-.1236");
	});

	QUnit.test("float format with rounding mode: FLOOR", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3,
			roundingMode: NumberFormat.RoundingMode.FLOOR
		});

		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.123", ".1234");
		assert.equal(oFormat.format(.1235), "0.123", ".1235");
		assert.equal(oFormat.format(.1239), "0.123", ".1239");
		assert.equal(oFormat.format(2.0001), "2", "2.0001");
		assert.equal(oFormat.format(2.11), "2.11", "2.11");
		assert.equal(oFormat.format(-.1234), "-0.124", "-.1234");
		assert.equal(oFormat.format(-.1236), "-0.124", "-.1236");
	});

	QUnit.test("float format with rounding mode: TOWARDS_ZERO", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3,
			roundingMode: NumberFormat.RoundingMode.TOWARDS_ZERO
		});

		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.123", ".1234");
		assert.equal(oFormat.format(.1235), "0.123", ".1235");
		assert.equal(oFormat.format(.1239), "0.123", ".1239");
		assert.equal(oFormat.format(2.0001), "2", "2.0001");
		assert.equal(oFormat.format(2.11), "2.11", "2.11");
		assert.equal(oFormat.format(-.1234), "-0.123", "-.1234");
		assert.equal(oFormat.format(-.1235), "-0.123", "-.1235");
		assert.equal(oFormat.format(-.1236), "-0.123", "-.1236");
	});

	QUnit.test("float format with rounding mode: AWAY_FROM_ZERO", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3,
			roundingMode: NumberFormat.RoundingMode.AWAY_FROM_ZERO
		});

		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.124", ".1234");
		assert.equal(oFormat.format(.1235), "0.124", ".1235");
		assert.equal(oFormat.format(.1239), "0.124", ".1239");
		assert.equal(oFormat.format(2.1999), "2.2", "2.0001");
		assert.equal(oFormat.format(2.11), "2.11", "2.11");
		assert.equal(oFormat.format(-.1234), "-0.124", "-.1234");
		assert.equal(oFormat.format(-.1235), "-0.124", "-.1235");
		assert.equal(oFormat.format(-.1236), "-0.124", "-.1236");
	});

	QUnit.test("float format with rounding mode: HALF_TOWARDS_ZERO", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3,
			roundingMode: NumberFormat.RoundingMode.HALF_TOWARDS_ZERO
		});

		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.123", ".1234");
		assert.equal(oFormat.format(.1235), "0.123", ".1235");
		assert.equal(oFormat.format(.1239), "0.124", ".1239");
		assert.equal(oFormat.format(2.1999), "2.2", "2.1999");
		assert.equal(oFormat.format(2.11), "2.11", "2.11");
		assert.equal(oFormat.format(-.1230), "-0.123", "-.1230");
		assert.equal(oFormat.format(-.1234), "-0.123", "-.1234");
		assert.equal(oFormat.format(-.1235), "-0.123", "-.1235");
		assert.equal(oFormat.format(-.1239), "-0.124", "-.1239");

		oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 2,
			roundingMode: NumberFormat.RoundingMode.HALF_TOWARDS_ZERO
		});

		// These two are the famous test cases for problematic rounding in Javascript
		assert.equal(oFormat.format(35.855), "35.85", "35.855");
		assert.equal(oFormat.format(1.005), "1", "1.005");

		assert.equal(oFormat.format(-35.855), "-35.85", "-35.855");
		assert.equal(oFormat.format(-1.005), "-1", "-1.005");
	});

	QUnit.test("float format with rounding mode: HALF_CEILING", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3,
			roundingMode: NumberFormat.RoundingMode.HALF_CEILING
		});

		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.123", ".1234");
		assert.equal(oFormat.format(.1235), "0.124", ".1235");
		assert.equal(oFormat.format(.1239), "0.124", ".1239");
		assert.equal(oFormat.format(2.1999), "2.2", "2.1999");
		assert.equal(oFormat.format(2.11), "2.11", "2.11");
		assert.equal(oFormat.format(-.1230), "-0.123", "-.1230");
		assert.equal(oFormat.format(-.1234), "-0.123", "-.1234");
		assert.equal(oFormat.format(-.1235), "-0.123", "-.1235");
		assert.equal(oFormat.format(-.1239), "-0.124", "-.1239");

		oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 2,
			roundingMode: NumberFormat.RoundingMode.HALF_CEILING
		});

		// These two are the famous test cases for problematic rounding in Javascript
		assert.equal(oFormat.format(35.855), "35.86", "35.855");
		assert.equal(oFormat.format(1.005), "1.01", "1.005");

		assert.equal(oFormat.format(-35.855), "-35.85", "-35.855");
		assert.equal(oFormat.format(-1.005), "-1", "-1.005");
	});

	QUnit.test("float format with rounding mode: HALF_FLOOR", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3,
			roundingMode: NumberFormat.RoundingMode.HALF_FLOOR
		});

		assert.equal(oFormat.format(.1230), "0.123", ".123");
		assert.equal(oFormat.format(.1234), "0.123", ".1234");
		assert.equal(oFormat.format(.1235), "0.123", ".1235");
		assert.equal(oFormat.format(.1239), "0.124", ".1239");
		assert.equal(oFormat.format(2.1999), "2.2", "2.1999");
		assert.equal(oFormat.format(2.11), "2.11", "2.11");
		assert.equal(oFormat.format(-.1230), "-0.123", "-.1230");
		assert.equal(oFormat.format(-.1234), "-0.123", "-.1234");
		assert.equal(oFormat.format(-.1235), "-0.124", "-.1235");
		assert.equal(oFormat.format(-.1239), "-0.124", "-.1239");

		oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 2,
			roundingMode: NumberFormat.RoundingMode.HALF_FLOOR
		});

		// These two are the famous test cases for problematic rounding in Javascript
		assert.equal(oFormat.format(35.855), "35.85", "35.855");
		assert.equal(oFormat.format(1.005), "1", "1.005");

		assert.equal(oFormat.format(-35.855), "-35.86", "-35.855");
		assert.equal(oFormat.format(-1.005), "-1.01", "-1.005");
	});

	QUnit.test("float format with custom rounding function", function (assert) {
		var oSpy = this.spy(function (a, b) {
			return a;
		}), oFormat = NumberFormat.getFloatInstance({
			maxFractionDigits: 3,
			roundingMode: oSpy
		});

		oFormat.format(1.23456);
		assert.equal(oSpy.callCount, 1, "Custom rounding function is called");
		assert.ok(oSpy.calledWith(1.23456, 3), "Custom rounding function is called with correct parameters");
	});


	QUnit.module("Unit Format");


	var aCombinations = generateUniqueChars(300);


	function generateUniqueChars(iNrOfCharacters) {
		var aRes = [];
		var sChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var maxChars = getNumberOfCharsRequired(iNrOfCharacters, sChars.length);
		for (var i = 0; i < iNrOfCharacters; i++) {
			aRes.push(getFullUniqueKey(i, sChars, maxChars));
		}
		return aRes;
	}

	function getNumberOfCharsRequired(iNrOfPermutations, iNrOfCharacters) {
		var maxChars = 1;
		var iCharsLength = iNrOfCharacters;
		var iIndexCurrent = iNrOfPermutations;
		while (iIndexCurrent / iCharsLength > 1) {
			maxChars++;
			iIndexCurrent = Math.ceil(iIndexCurrent / iCharsLength);
		}
		return maxChars;
	}

	function getFullUniqueKey(iNrOfPermutations, sChars, iMaxNumberChars) {

		var sResult = getUniqueKey(iNrOfPermutations, sChars);


		if (sResult.length < iMaxNumberChars) {
			return sResult.padStart(iMaxNumberChars, sChars[0]);
		}
		return sResult;

	}

	function getUniqueKey(iNrOfPermutations, sChars) {
		var iCharsLength = sChars.length;

		var numberOfPlaces = Math.ceil(iNrOfPermutations / (iCharsLength - 1));
		var cChar = sChars[iNrOfPermutations % (iCharsLength)];
		if (numberOfPlaces <= 1) {
			return cChar;
		}
		return getUniqueKey(numberOfPlaces, sChars) + cChar;
	}

	QUnit.test("Unit format default formatting", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({}, oLocale);

		assert.equal(oFormat.format(.1, "mass-kilogram"), "0.1 kg", ".1");
		assert.equal(oFormat.format(0.123, "mass-kilogram"), "0.123 kg", "0.123");
		assert.equal(oFormat.format(123, "mass-kilogram"), "123 kg", "123");
		assert.equal(oFormat.format(123.23, "mass-kilogram"), "123.23 kg", "123.23");
		assert.equal(oFormat.format(1234, "mass-kilogram"), "1,234 kg", "1234");
		assert.equal(oFormat.format(12345, "mass-kilogram"), "12,345 kg", "12345");
		assert.equal(oFormat.format(12345.123, "mass-kilogram"), "12,345.123 kg", "12345.123");
		assert.equal(oFormat.format(12345.12345, "mass-kilogram"), "12,345.12345 kg", "12345.12345");
		assert.equal(oFormat.format(1234567890, "mass-kilogram"), "1,234,567,890 kg", "1234567890");
		assert.equal(oFormat.format(-123.23, "mass-kilogram"), "-123.23 kg", "-123.23");
		assert.equal(oFormat.format("1.23e+9", "mass-kilogram"), "1,230,000,000 kg", "1.23e+9");
		assert.equal(oFormat.format("1.23e-9", "mass-kilogram"), "0.00000000123 kg", "1.23e-9");
		assert.equal(oFormat.format("-1.23e+9", "mass-kilogram"), "-1,230,000,000 kg", "-1.23e+9");
		assert.equal(oFormat.format("-1.23e-9", "mass-kilogram"), "-0.00000000123 kg", "-1.23e-9");
		assert.equal(oFormat.format("1.2345e+2", "mass-kilogram"), "123.45 kg", "1.2345e+2");
		assert.equal(oFormat.format("12345e-2", "mass-kilogram"), "123.45 kg", "12345e-2");
		assert.equal(oFormat.format("-1.2345e+2", "mass-kilogram"), "-123.45 kg", "-1.2345e+2");
		assert.equal(oFormat.format("-12345e-2", "mass-kilogram"), "-123.45 kg", "-12345e-2");
		assert.equal(oFormat.format("123.45e+2", "mass-kilogram"), "12,345 kg", "123.45e+2");
		assert.equal(oFormat.format("12.345e-2", "mass-kilogram"), "0.12345 kg", "12.345e-2");
		assert.equal(oFormat.format("-123.45e+2", "mass-kilogram"), "-12,345 kg", "-123.45e+2");
		assert.equal(oFormat.format("-12.345e-2", "mass-kilogram"), "-0.12345 kg", "-12.345e-2");
		assert.equal(oFormat.format("123456.789e+2", "mass-kilogram"), "12,345,678.9 kg", "123456.789e+2");
		assert.equal(oFormat.format("123.456789e-2", "mass-kilogram"), "1.23456789 kg", "123.456789e-2");
		assert.equal(oFormat.format("-123456.789e+2", "mass-kilogram"), "-12,345,678.9 kg", "-123456.789e+2");
		assert.equal(oFormat.format("-123.456789e-2", "mass-kilogram"), "-1.23456789 kg", "-123.456789e-2");
		assert.equal(oFormat.format("1000.00", "mass-kilogram"), "1,000.00 kg", "1000.00");
		assert.equal(oFormat.format("1000.0000", "mass-kilogram"), "1,000.0000 kg", "1000.0000");
		// Due to IEEE_754 (Binary Floating-Point Arithmetic)
		// JavaScript can only represent the number 123456789.123456789 as 123456789.12345679
		// eslint-disable-next-line no-loss-of-precision
		assert.equal(oFormat.format(123456789.123456789, "mass-kilogram"), "123,456,789.12345679 kg", "123456789.123456789 (number)");
		assert.equal(oFormat.format("123456789.123456789", "mass-kilogram"), "123,456,789.123456789 kg", "123456789.123456789 (string)");
	});

	QUnit.test("Unit format default formatting preserveDecimals=true", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({preserveDecimals: true}, oLocale);

		assert.equal(oFormat.format(.1, "mass-kilogram"), "0.1 kg", ".1");
		assert.equal(oFormat.format(0.123, "mass-kilogram"), "0.123 kg", "0.123");
		assert.equal(oFormat.format(123, "mass-kilogram"), "123 kg", "123");
		assert.equal(oFormat.format(123.23, "mass-kilogram"), "123.23 kg", "123.23");
		assert.equal(oFormat.format(1234, "mass-kilogram"), "1,234 kg", "1234");
		assert.equal(oFormat.format(12345, "mass-kilogram"), "12,345 kg", "12345");
		assert.equal(oFormat.format(12345.123, "mass-kilogram"), "12,345.123 kg", "12345.123");
		assert.equal(oFormat.format(12345.12345, "mass-kilogram"), "12,345.12345 kg", "12345.12345");
		assert.equal(oFormat.format(1234567890, "mass-kilogram"), "1,234,567,890 kg", "1234567890");
		assert.equal(oFormat.format(-123.23, "mass-kilogram"), "-123.23 kg", "-123.23");
		assert.equal(oFormat.format("1.23e+9", "mass-kilogram"), "1,230,000,000 kg", "1.23e+9");
		assert.equal(oFormat.format("1.23e-9", "mass-kilogram"), "0.00000000123 kg", "1.23e-9");
		assert.equal(oFormat.format("-1.23e+9", "mass-kilogram"), "-1,230,000,000 kg", "-1.23e+9");
		assert.equal(oFormat.format("-1.23e-9", "mass-kilogram"), "-0.00000000123 kg", "-1.23e-9");
		assert.equal(oFormat.format("1.2345e+2", "mass-kilogram"), "123.45 kg", "1.2345e+2");
		assert.equal(oFormat.format("12345e-2", "mass-kilogram"), "123.45 kg", "12345e-2");
		assert.equal(oFormat.format("-1.2345e+2", "mass-kilogram"), "-123.45 kg", "-1.2345e+2");
		assert.equal(oFormat.format("-12345e-2", "mass-kilogram"), "-123.45 kg", "-12345e-2");
		assert.equal(oFormat.format("123.45e+2", "mass-kilogram"), "12,345 kg", "123.45e+2");
		assert.equal(oFormat.format("12.345e-2", "mass-kilogram"), "0.12345 kg", "12.345e-2");
		assert.equal(oFormat.format("-123.45e+2", "mass-kilogram"), "-12,345 kg", "-123.45e+2");
		assert.equal(oFormat.format("-12.345e-2", "mass-kilogram"), "-0.12345 kg", "-12.345e-2");
		assert.equal(oFormat.format("123456.789e+2", "mass-kilogram"), "12,345,678.9 kg", "123456.789e+2");
		assert.equal(oFormat.format("123.456789e-2", "mass-kilogram"), "1.23456789 kg", "123.456789e-2");
		assert.equal(oFormat.format("-123456.789e+2", "mass-kilogram"), "-12,345,678.9 kg", "-123456.789e+2");
		assert.equal(oFormat.format("-123.456789e-2", "mass-kilogram"), "-1.23456789 kg", "-123.456789e-2");
		assert.equal(oFormat.format("1.20300", "mass-kilogram"), "1.20300 kg", "1.20300");
		assert.equal(oFormat.format("1000.00", "mass-kilogram"), "1,000.00 kg", "1000.00");
		assert.equal(oFormat.format("1000.0000", "mass-kilogram"), "1,000.0000 kg", "1000.0000");
		assert.equal(oFormat.format("1000.00000000", "mass-kilogram"), "1,000.00000000 kg", "1000.00000000");
		// Due to IEEE_754 (Binary Floating-Point Arithmetic)
		// JavaScript can only represent the number 123456789.123456789 as 123456789.12345679
		// eslint-disable-next-line no-loss-of-precision
		assert.equal(oFormat.format(123456789.123456789, "mass-kilogram"), "123,456,789.12345679 kg", "123456789.123456789 (number)");
		assert.equal(oFormat.format("123456789.123456789", "mass-kilogram"), "123,456,789.123456789 kg", "123456789.123456789 (string)");
	});

	QUnit.test("NumberFormat.getDefaultUnitPattern() - Default unitPattern-count-other pattern", function(assert) {
		var sDefaultPattern = NumberFormat.getDefaultUnitPattern("MyOwnUnit");

		assert.equal(sDefaultPattern, "{0} MyOwnUnit", "Correct default pattern was created");

		// check usage
		var oFormat = NumberFormat.getUnitInstance({
			customUnits: {
				"MY": {
					"decimals": 2,
					"unitPattern-count-other": sDefaultPattern
				}
			}
		});

		var sFormatted = oFormat.format(1234, "MY");

		assert.equal(sFormatted.toString(), "1,234.00 MyOwnUnit", "Pattern can be used for formatting");
		assert.deepEqual(oFormat.parse(sFormatted.toString()), [1234, "MY"], "Pattern can be used for parsing");
	});

	QUnit.test("Unit format custom units performance", function (assert) {
		var oLocale = new Locale("en");
		var oCustomUnits = {

		};
		for (var i = 0; i < aCombinations.length; i++) {
			var sChar = aCombinations[i];
			oCustomUnits["unit" + i] = {
				"displayName": "unit " + i,
				"unitPattern-count-one": "{0} " + sChar,
				"unitPattern-count-other": "{0} " + sChar
			};
		}
		var oFormat = NumberFormat.getUnitInstance({
			customUnits: oCustomUnits
		}, oLocale);

		var oRegexInstantiationSpy = this.spy(window, "RegExp");
		assert.equal(oFormat.format(1123, "unit299").toString(), "1,123 MN", "invalid unit pattern");
		assert.equal(oFormat.format(1123, "unit150").toString(), "1,123 GU", "invalid unit pattern");
		assert.equal(oFormat.format(1123, "unit1").toString(), "1,123 AB", "invalid unit pattern");
		assert.equal(oFormat.format(1123, "unit7").toString(), "1,123 AH", "invalid unit pattern");

		assert.equal(oRegexInstantiationSpy.callCount, 0, "no regexp creation during formatting");
	});

	QUnit.test("Unit parse custom units regex creation cached after first execution", function (assert) {
		var oLocale = new Locale("en");
		var oCustomUnits = {
			"ASD": {
				"displayName": "unit ASD",
				"unitPattern-count-one": "{0} ASD",
				"unitPattern-count-other": "{0} ASD"
			}
		};
		var oFormat = NumberFormat.getUnitInstance({
			customUnits: oCustomUnits
		}, oLocale);

		var oRegexInstantiationSpy = this.spy(window, "RegExp");

		oFormat.parse("1,123 ASD");
		assert.equal(oRegexInstantiationSpy.callCount, 3, "create regexp instance for pattern");

		oRegexInstantiationSpy.resetHistory();
		oFormat.parse("1,123 ASD");
		assert.equal(oRegexInstantiationSpy.callCount, 3, "skip regexp instantiation for cached pattern");

		oRegexInstantiationSpy.resetHistory();
		oFormat.parse("1,123 ASD");
		assert.equal(oRegexInstantiationSpy.callCount, 3, "skip regexp instantiation for cached pattern");
	});

	QUnit.test("Unit parse all cldr units regex creation cached after first execution", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance(oLocale);

		var oRegexInstantiationSpy = this.spy(window, "RegExp");

		oFormat.parse("1,123 km");

		oRegexInstantiationSpy.resetHistory();
		oFormat.parse("1,123 m");
		assert.equal(oRegexInstantiationSpy.callCount, 3, "skip regexp instantiation for cached pattern");

		oRegexInstantiationSpy.resetHistory();
		oFormat.parse("1,123 ms");
		assert.equal(oRegexInstantiationSpy.callCount, 3, "skip regexp instantiation for cached pattern");

		oRegexInstantiationSpy.resetHistory();
		oFormat.parse("1,123 cm");
		assert.equal(oRegexInstantiationSpy.callCount, 3, "skip regexp instantiation for cached pattern");
	});

	QUnit.test("Unit parse custom units performance", function (assert) {
		var oLocale = new Locale("en");
		var oCustomUnits = {

		};
		for (var i = 0; i < 300; i++) {
			var sChar = aCombinations[i];
			oCustomUnits["unit" + i] = {
				"displayName": "unit " + i,
				"unitPattern-count-one": "{0} " + sChar,
				"unitPattern-count-other": "{0} " + sChar
			};
		}
		var oFormat = NumberFormat.getUnitInstance({
			customUnits: oCustomUnits
		}, oLocale);

		var t0 = performance.now();
		var oRegexInstantiationSpy = this.spy(window, "RegExp");
		assert.deepEqual(oFormat.parse("1,123 MN"), [1123, "unit299"], "invalid unit pattern");
		assert.deepEqual(oFormat.parse("1,123 GU"), [1123, "unit150"], "invalid unit pattern");
		assert.deepEqual(oFormat.parse("1,123 AB"), [1123, "unit1"], "invalid unit pattern");
		assert.deepEqual(oFormat.parse("1,123 AH"), [1123, "unit7"], "invalid unit pattern");

		assert.equal(oRegexInstantiationSpy.callCount, 12, "regexp creation during formatting");

		assert.deepEqual(oFormat.parse("1,123 MM"), [1123, "unit298"], "invalid unit pattern");
		assert.deepEqual(oFormat.parse("1,123 CI"), [1123, "unit34"], "invalid unit pattern");
		assert.deepEqual(oFormat.parse("1,123 CC"), [1123, "unit28"], "invalid unit pattern");
		assert.deepEqual(oFormat.parse("1,123 EE"), [1123, "unit82"], "invalid unit pattern");
		assert.equal(oRegexInstantiationSpy.callCount, 24, "regexp creation during formatting");
		var t1 = performance.now();

		assert.ok(true, "Took " + (t1 - t0) + "ms for parsing");
	});

	QUnit.test("Unit format with invalid unit definition coordinate", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({}, oLocale);

		assert.equal(oFormat.format(1123, "coordinateUnit"), "1,123 coordinateUnit", "invalid unit pattern");
		assert.equal(oFormat.format(1123, "per"), "1,123 per", "invalid unit pattern");
	});

	QUnit.test("Unit format with unknown locale", function (assert) {
		["unknown", "en"].forEach(function (sLocale) {
			var oLocale = new Locale(sLocale);
			var oFormat = NumberFormat.getUnitInstance(oLocale);

			// unknown locale defaults to en.json
			assert.equal(oFormat.format(12, "duration-hour").toString(), "12 hr", "Locale " + sLocale + ": 12 hours");
			assert.equal(oFormat.format(13, "volume-liter").toString(), "13 L", "Locale " + sLocale + ": 13 liter");
			assert.equal(oFormat.format(0, "duration-day").toString(), "0 days", "Locale " + sLocale + ": 0 days");
			assert.equal(oFormat.format(1, "duration-day").toString(), "1 day", "Locale " + sLocale + ": 1 day");
			assert.equal(oFormat.format(2, "duration-day").toString(), "2 days", "Locale " + sLocale + ": 2 days");
			assert.equal(oFormat.format(1.2, "duration-day").toString(), "1.2 days", "Locale " + sLocale + ": 1.2 days");
			assert.equal(oFormat.format(1.2, "area-dunam").toString(), "1.2 dunam", "Locale " + sLocale + ": 1.2 dunam");
		});
	});

	QUnit.test("Unit format custom pattern", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({
			customUnits: {
				"olf": {
					"displayName": "olf",
					"unitPattern-count-one": "{0} olf",
					"unitPattern-count-other": "{0} olfers"
				},
				"IND": {
					"displayName": "olf",
					"unitPattern-count-one": "{0} olf",
					"unitPattern-count-other": "{0} olfs"
				},
				"electric-inductance": {
					"displayName": "H",
					"unitPattern-count-one": "{0} H",
					"unitPattern-count-other": "{0} H"
				}
			}
		}, oLocale);

		// test exclusiveness
		assert.equal(oFormat.format(20, "area-hectare").toString(), "20 area-hectare", "20 ha");

		// test "other" units
		assert.equal(oFormat.format(20, "olf").toString(), "20 olfers", "20 olfers");
		assert.equal(oFormat.format(20, "IND").toString(), "20 olfs", "20 olfs");
		assert.equal(oFormat.format(20, "electric-inductance").toString(), "20 H", "20 H");

		// test "one" unit
		assert.equal(oFormat.format(1, "olf").toString(), "1 olf", "1 olf");
		assert.equal(oFormat.format(1, "IND").toString(), "1 olf", "1 olf");
		assert.equal(oFormat.format(1, "electric-inductance").toString(), "1 H", "1 H");

	});

	QUnit.test("'decimals' set on FormatOptions and custom units", function (assert) {
		var oFormatOptions = {
			customUnits: {
				"cats": {
					"displayName": "Cats",
					"unitPattern-count-one": "{0} Cat",
					"unitPattern-count-other": "{0} Cats",
					"decimals": 5
				}
			},
			decimals: 1
		};

		// en
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance(oFormatOptions, oLocale);

		assert.equal(oFormat.format(1120.3, "cats"), "1,120.30000 Cats", "formatted with 5 decimals - en");

		// de
		oLocale = new Locale("de");
		oFormat = NumberFormat.getUnitInstance(oFormatOptions, oLocale);

		assert.equal(oFormat.format(1120.3, "cats"), "1.120,30000 Cats", "formatted with 5 decimals - de");
	});

	QUnit.test("Unit parse custom pattern", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({
			customUnits: {
				"olf": {
					"displayName": "olf",
					"unitPattern-count-one": "{0} olf",
					"unitPattern-count-other": "{0} olfers"
				},
				"IND": {
					"displayName": "olf",
					"unitPattern-count-one": "{0} olf",
					"unitPattern-count-other": "{0} olfs"
				},
				"electric-inductance": {
					"displayName": "H",
					"unitPattern-count-one": "{0} H",
					"unitPattern-count-other": "{0} H"
				}
			}
		}, oLocale);

		// test exclusiveness
		assert.equal(oFormat.parse("20 ha"), null, "20 ha");

		// test "other" units
		assert.deepEqual(oFormat.parse("20 olfers"), [20, "olf"], "20 olfers");
		assert.deepEqual(oFormat.parse("20 olfs"), [20, "IND"], "20 olfs");
		assert.deepEqual(oFormat.parse("20 H"), [20, "electric-inductance"], "20 H");

		// test "one" unit - ambiguous for olf and IND
		assert.deepEqual(oFormat.parse("1 olf"), [1, undefined], "1 olf");
		assert.deepEqual(oFormat.parse("1 olf"), [1, undefined], "1 olf");
		assert.deepEqual(oFormat.parse("1 H"), [1, "electric-inductance"], "1 H");

	});

	QUnit.module("Unit Format using configuration", {
		beforeEach: function (assert) {
			this.oLogWarningSpy = sinon.spy(Log, "warning");

			//ensure custom unit mappings and custom units are reset
			this.oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();
			this.oFormatSettings.setUnitMappings();
			this.oFormatSettings.setCustomUnits();

			assert.equal(this.oFormatSettings.getCustomUnits(), undefined, "units must be undefined");
			assert.equal(this.oFormatSettings.getUnitMappings(), undefined, "unit mappings must be undefined");
		}, afterEach: function (assert) {
			//ensure custom unit mappings and custom units are reset
			this.oFormatSettings.setUnitMappings();
			this.oFormatSettings.setCustomUnits();

			assert.equal(this.oFormatSettings.getCustomUnits(), undefined, "units must be undefined");
			assert.equal(this.oFormatSettings.getUnitMappings(), undefined, "unit mappings must be undefined");

			this.oLogWarningSpy.restore();
		}
	});


	QUnit.test("Unit format custom pattern in config", function (assert) {
		var oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();
		var oConfigObject = {
			"electric-inductance": {
				"unitPattern-count-one": "{0} H",
				"unitPattern-count-other": "{0} H"
			},
			"length-millimeter": {
				"unitPattern-count-other": "{0} mymm"
			}
		};
		oFormatSettings.setCustomUnits(oConfigObject);

		var oFormat = NumberFormat.getUnitInstance({});

		// test custom unit in config
		assert.equal(oFormat.format(20, "area-hectare").toString(), "20 ha", "20 ha");
		assert.equal(oFormat.format(20, "electric-inductance").toString(), "20 H", "20 H");
		assert.equal(oFormat.format(1, "electric-inductance").toString(), "1 H", "1 H");


		//custom mappings should not affect parsing
		oFormatSettings.setUnitMappings({
			"henry": "electric-inductance",
			"IND": "electric-inductance",
			"MTR": "length-meter",
			"MET": "length-meter",
			"length-kilometer": "electric-inductance",
			"DET": "MET",
			"one": "two",
			"two": "one"
		});

		// test existing units
		assert.equal(oFormat.format(20, "area-hectare").toString(), "20 ha", "20 ha");

		//test overwritten units from custom units
		assert.equal(oFormat.format(20, "length-millimeter").toString(), "20 mymm", "20 mymm");

		// test defined custom units
		assert.equal(oFormat.format(20, "electric-inductance").toString(), "20 H", "20 H");
		assert.equal(oFormat.format(1, "electric-inductance").toString(), "1 H", "1 H");


		//test mappings
		assert.equal(oFormat.format(20, "length-kilometer").toString(), "20 H", "20 H");
		assert.equal(oFormat.format(20, "henry").toString(), "20 H", "20 H");
		assert.equal(oFormat.format(20, "IND").toString(), "20 H", "20 H");
		assert.equal(oFormat.format(20, "MTR").toString(), "20 m", "20 m");
		assert.equal(oFormat.format(20, "MET").toString(), "20 m", "20 m");
		assert.equal(oFormat.format(20, "DET").toString(), "20 DET", "mapping of mapping");
		assert.equal(oFormat.format(20, "one").toString(), "20 one", "recursive mapping");
		assert.equal(oFormat.format(20, "two").toString(), "20 two", "recursive mapping");

		oFormatSettings.setCustomUnits(undefined);
		oFormatSettings.setUnitMappings(undefined);
	});

	QUnit.test("Unit format with private FormatOptions parameter unitOptional active", function (assert) {
		var oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();
		var oConfigObject = {
			"electric-inductance": {
				"displayName": "H",
				"unitPattern-count-one": "{0} H",
				"unitPattern-count-other": "{0} H"
			}
		};
		oFormatSettings.setCustomUnits(oConfigObject);
		var oFormat = NumberFormat.getUnitInstance({unitOptional:true});

		assert.deepEqual(oFormat.format(20), "20", "can format 20");
		assert.deepEqual(oFormat.format(20.000), "20", "can format 20.000");
		assert.deepEqual(oFormat.format(200000), "200,000", "can format 200000");

		oFormatSettings.setCustomUnits(undefined);
	});


	QUnit.test("Unit parse with private FormatOptions parameter unitOptional active", function (assert) {
		var oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();
		var oConfigObject = {
			"electric-inductance": {
				"displayName": "H",
				"unitPattern-count-one": "{0} H",
				"unitPattern-count-other": "{0} H"
			}
		};
		oFormatSettings.setCustomUnits(oConfigObject);
		var oFormat = NumberFormat.getUnitInstance({unitOptional:true});

		assert.deepEqual(oFormat.parse("20"), [20, undefined], "can parse 20");
		assert.deepEqual(oFormat.parse("20.000"), [20, undefined], "can parse 20");
		assert.deepEqual(oFormat.parse("20,000"), [20000, undefined], "can parse 20");

		oFormatSettings.setCustomUnits(undefined);
	});

	QUnit.test("Unit parse custom pattern in config", function (assert) {
		var oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();
		var oConfigObject = {
			"electric-inductance": {
				"displayName": "H",
				"unitPattern-count-one": "{0} H",
				"unitPattern-count-other": "{0} H"
			}
		};
		oFormatSettings.setCustomUnits(oConfigObject);
		var oFormat = NumberFormat.getUnitInstance({});

		assert.deepEqual(oFormat.parse("20 ha"), [20, "area-hectare"], "20 ha");
		assert.deepEqual(oFormat.parse("20 H"), [20, "electric-inductance"], "20 H");
		assert.deepEqual(oFormat.parse("1 H"), [1, "electric-inductance"], "1 H");

		oFormatSettings.setCustomUnits(undefined);
	});

	QUnit.test("Unit format showNumber false", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({showNumber: false}, oLocale);

		assert.equal(oFormat.format(1).toString(), "", "number 1 is rendered as empty string");
		assert.equal(oFormat.format(20, "duration-day").toString(), "days", "20 days");
		assert.equal(oFormat.format(1, "duration-day").toString(), "day", "1 day");
		assert.equal(oFormat.format(20, "duration-hour").toString(), "hr", "20 hr");
		assert.equal(oFormat.format(1, "duration-hour").toString(), "hr", "1 hr");
		assert.equal(oFormat.format(20, "duration-day-non-existing").toString(), "duration-day-non-existing", "not existing");

		// null/undefined input values
		assert.equal(oFormat.format(null, "PC").toString(), "PC", "null and unknown measure will result in 'PC'");
		assert.equal(oFormat.format(null, "duration-day").toString(), "days", "null and known measure will result in 'days'");
		assert.equal(oFormat.format(undefined, "duration-day").toString(), "days", "undefined and known measure will result in 'days'");
		assert.equal(oFormat.format(undefined, "PC").toString(), "PC", "undefined and unknown measure will result in 'PC'");
		assert.equal(oFormat.format(null, null).toString(), "", "null values result in empty string");
		assert.equal(oFormat.format(undefined, undefined).toString(), "", "undefined values result in empty string");
	});

	QUnit.test("Unit parse showNumber false", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({showNumber: false}, oLocale);

		assert.deepEqual(oFormat.parse("days"), [undefined, "duration-day"], "days");
		assert.deepEqual(oFormat.parse("day"), [undefined, "duration-day"], "day");
		assert.deepEqual(oFormat.parse("hr"), [undefined, "duration-hour"], "hr");
		assert.deepEqual(oFormat.parse("kg"), [undefined, "mass-kilogram"], "kg");

		// ambiguous unit (duration-century, volume-cup)
		assert.deepEqual(oFormat.parse("c"), null, "century or cup");

		// invalid values result in null
		assert.deepEqual(oFormat.parse(""), null, "empty string results in null");
		assert.deepEqual(oFormat.parse("x"), null, "'x' results in null");
		assert.deepEqual(oFormat.parse("XXX"), null, "'XXX' results in null");
		assert.deepEqual(oFormat.parse("1"), null, "'1' results in null");
		assert.deepEqual(oFormat.parse("1.23\x0aXXX"), null, "'1.23 XXX' results in null");
		assert.deepEqual(oFormat.parse("1.23 kg"), null, "'1.23 kg' results in null");
	});

	QUnit.test("Unit format showNumber false custom Units from global configuration with only other pattern", function (assert) {
		var oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();
		var oConfigObject = {
			"electric-inductance": {
				"displayName": "H",
				"unitPattern-count-other": "{0} Hs"
			}
		};
		oFormatSettings.setCustomUnits(oConfigObject);

		var oFormat = NumberFormat.getUnitInstance({showNumber: false});

		// test custom unit in config
		assert.equal(oFormat.format(1, "electric-inductance").toString(), "Hs", "1 H");

		oFormatSettings.setCustomUnits(undefined);
	});

	QUnit.test("Unit format showNumber false custom Units from global configuration", function (assert) {
		var oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();
		var oConfigObject = {
			"electric-inductance": {
				"displayName": "H",
				"unitPattern-count-one": "{0} H",
				"unitPattern-count-other": "{0} Hs"
			}
		};
		oFormatSettings.setCustomUnits(oConfigObject);

		var oFormat = NumberFormat.getUnitInstance({showNumber: false});

		// test custom unit in config
		assert.equal(oFormat.format(20, "area-hectare").toString(), "ha", "20 ha");
		assert.equal(oFormat.format(20, "electric-inductance").toString(), "Hs", "20 H");
		assert.equal(oFormat.format(1, "electric-inductance").toString(), "H", "1 H");

		oFormatSettings.setCustomUnits(undefined);
	});

	QUnit.test("Unit format showNumber false custom Units from customUnits parameter", function (assert) {
		var oFormat = NumberFormat.getUnitInstance({showNumber: false, customUnits: {
				"electric-inductance": {
					"displayName": "H",
					"unitPattern-count-one": "{0} H",
					"unitPattern-count-other": "{0} Hs"
				}
			}});

		assert.equal(oFormat.format(20, "area-hectare").toString(), "area-hectare", "20 ha");
		assert.equal(oFormat.format(20, "electric-inductance").toString(), "Hs", "20 H");
		assert.equal(oFormat.format(1, "electric-inductance").toString(), "H", "1 H");
	});

	QUnit.test("Unit format showNumber false custom Units from customUnits parameter without unit", function (assert) {
		var oFormat = NumberFormat.getUnitInstance({showNumber: false, customUnits: {
				// only other pattern contains number placeholder {0}
				"beer-volume": {
					"displayName": "Seidel",
					"unitPattern-count-one": "Ein Glas Bier",
					"unitPattern-count-two": "Ein Maß",
					"unitPattern-count-other": "{0} Seidel"
				},
				// No pattern contains number placeholder {0}
				"house-size": {
					"displayName": "House size",
					"unitPattern-count-one": "Einfamilienhaus",
					"unitPattern-count-two": "Zweifamilienhaus",
					"unitPattern-count-other": "Mehrfamilienhaus"
				},
				// No pattern contains number placeholder {0} and other pattern does not exist
				"bike-size": {
					"displayName": "Bike size",
					"unitPattern-count-one": "Fahrrad",
					"unitPattern-count-two": "Tandem"
				}
			}});


		// uses other pattern because the "one" pattern does not contain the number placeholder {0}
		assert.equal(oFormat.format(1, "beer-volume").toString(), "Seidel", "1 Glas Bier");
		// uses other pattern because the "two" pattern does not contain the number placeholder {0}
		assert.equal(oFormat.format(2, "beer-volume").toString(), "Seidel", "1 Maß");

		assert.equal(oFormat.format(20, "beer-volume").toString(), "Seidel", "20 Seidel");

		// House size (no pattern includes number placeholder)
		// there is no pattern with the number placeholder therefore it cannot be split into number and unit
		// Note: this does not exist in CLDR data but just in case
		assert.equal(this.oLogWarningSpy.callCount, 0, "No warning logs should be called");
		assert.equal(oFormat.format(1, "house-size").toString(), "Einfamilienhaus", "Einfamilienhaus");
		assert.equal(oFormat.format(2, "house-size").toString(), "Mehrfamilienhaus", "Zweifamilienhaus (no two plural for en_US)");
		assert.equal(oFormat.format(20, "house-size").toString(), "Mehrfamilienhaus", "Mehrfamilienhaus");
		assert.equal(this.oLogWarningSpy.callCount, 3, "Warning logs should be called");
		assert.equal(this.oLogWarningSpy.getCall(0).args[0], "Cannot separate the number from the unit because unitPattern-count-other 'Mehrfamilienhaus' does not include the number placeholder '{0}' for unit 'house-size'", "Warning message");
		assert.equal(this.oLogWarningSpy.getCall(1).args[0], "Cannot separate the number from the unit because unitPattern-count-other 'Mehrfamilienhaus' does not include the number placeholder '{0}' for unit 'house-size'", "Warning message");
		assert.equal(this.oLogWarningSpy.getCall(2).args[0], "Cannot separate the number from the unit because unitPattern-count-other 'Mehrfamilienhaus' does not include the number placeholder '{0}' for unit 'house-size'", "Warning message");

		// Bike Size (no pattern includes number placeholder, other pattern not present)
		assert.equal(oFormat.format(1, "bike-size").toString(), "bike-size", "Fahrrad");
		assert.equal(oFormat.format(2, "bike-size").toString(), "bike-size", "Tandem");
		assert.equal(oFormat.format(3, "bike-size").toString(), "bike-size", "(does not exist))");

	});


	QUnit.test("Unit format edge cases CLDR", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({}, oLocale);

		//valid numbers
		assert.equal(oFormat.format(20, "area-hectare").toString(), "20 ha", "20 ha");
		assert.equal(oFormat.format(0.2e2, "area-hectare").toString(), "20 ha", "20 ha");
		assert.equal(oFormat.format(0x14, "area-hectare").toString(), "20 ha", "20 ha");
		assert.equal(oFormat.format("20", "area-hectare").toString(), "20 ha", "string number '20'");
		assert.equal(oFormat.format(0, "area-hectare").toString(), "0 ha", "0 ha");
		assert.equal(oFormat.format(0x0, "area-hectare").toString(), "0 ha", "0 ha");
		assert.equal(oFormat.format(0e2, "area-hectare").toString(), "0 ha", "0 ha");
		assert.equal(oFormat.format("0", "area-hectare").toString(), "0 ha", "string number '0'");

		//exponential numbers as string
		assert.equal(oFormat.format("0.2e2", "area-hectare").toString(), "020 ha", "string number '0.2e2'");
		assert.equal(oFormat.format("0.02e2", "area-hectare").toString(), "002 ha", "string number '0.2e2'");
		assert.equal(oFormat.format("0.00e2", "area-hectare").toString(), "000 ha", "string number '0.2e2'");
		assert.equal(oFormat.format("0.000e2", "area-hectare").toString(), "000.0 ha", "string number '0.2e2'");

		//invalid number
		assert.equal(oFormat.format("2e2", "area-hectare").toString(), "200 ha", "string number '2e2'");
		assert.equal(oFormat.format("2e1", "area-hectare").toString(), "20 ha", "string number '2e1'");
		assert.equal(oFormat.format("0e2", "area-hectare").toString(), "000 ha", "string number '0e2'");
		assert.equal(oFormat.format("a", "area-hectare").toString(), "", "character a");
		assert.equal(oFormat.format("null", "area-hectare").toString(), "", "string 'null'");
		assert.equal(oFormat.format(undefined, "area-hectare").toString(), "", "undefined");
		assert.equal(oFormat.format(NaN, "area-hectare").toString(), "", "NaN");
		assert.equal(oFormat.format({}, "area-hectare").toString(), "", "empty object");
		assert.equal(oFormat.format(null, "area-hectare").toString(), "", "null area-hectare");
		assert.equal(oFormat.format(function () { }, "area-hectare").toString(), "", "function");
		assert.equal(oFormat.format().toString(), "", "no params");

		//invalid unit
		assert.equal(oFormat.format(12, 33).toString(), "", "");
		assert.equal(oFormat.format(12, "").toString(), "12", "");
		assert.equal(oFormat.format(12, "a").toString(), "12 a", "a");
		assert.equal(oFormat.format(12, true).toString(), "", "boolean true");
		assert.equal(oFormat.format(12, false).toString(), "", "boolean false");
		assert.equal(oFormat.format(12, null).toString(), "12", "null");
		assert.equal(oFormat.format(12, undefined).toString(), "12", "undefined");
		assert.equal(oFormat.format(12, {}).toString(), "", "empty object");
		assert.equal(oFormat.format(12, function () { }).toString(), "", "function");
		assert.equal(oFormat.format(12).toString(), "12", "params");
		assert.equal(oFormat.format(12, NaN).toString(), "", "NaN empty string option is by default NaN");


		// empty string option
		oFormat = NumberFormat.getUnitInstance({ emptyString: 0 }, oLocale);
		assert.strictEqual(oFormat.format(0), "", "empty string is 0");

		oFormat = NumberFormat.getUnitInstance({ emptyString: null }, oLocale);
		assert.equal(oFormat.format(null), "", "empty string is 0");

		oFormat = NumberFormat.getUnitInstance({ emptyString: NaN }, oLocale);
		assert.equal(oFormat.format(NaN), "", "empty string is 0");
	});

	QUnit.test("Unit parse edge cases CLDR", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({}, oLocale);

		assert.deepEqual(oFormat.parse("20 ha"), [20, "area-hectare"], "parsed correctly");
		assert.deepEqual(oFormat.parse("20 c"), [20, undefined], "number and ambigious unit duration-century and volume-cup");
		assert.equal(oFormat.parse("20"), null, "number only '20'");
		assert.equal(oFormat.parse("ha"), null, "unit only 'ha'");
		assert.equal(oFormat.parse("__ ha"), null, "no number area-hectare unit '__ ha'");
		assert.equal(oFormat.parse("__ __"), null, "no number no unit '__ __'");
		assert.equal(oFormat.parse("20 __"), null, "number no unit '20 __'");
		assert.equal(oFormat.parse("__"), null, "no number no unit '__'");
		assert.equal(oFormat.parse(null), null, "number no unit null");
		assert.equal(oFormat.parse(undefined), null, "number no unit undefined");
		assert.equal(oFormat.parse({}), null, "number no unit {}");
		assert.equal(oFormat.parse(true), null, "number no unit true");
		assert.equal(oFormat.parse(false), null, "number no unit false");
		assert.equal(oFormat.parse(NaN), null, "number no unit NaN");
		assert.equal(oFormat.parse(22), null, "number no unit 22");
		assert.equal(oFormat.parse(function () { }), null, "number no unit function");
		assert.equal(isNaN(oFormat.parse("")), true, "number no unit '' empty string option is by default NaN");

		oFormat = NumberFormat.getUnitInstance({ emptyString: 0 }, oLocale);
		assert.deepEqual(oFormat.parse(""), [0, undefined], "empty string is 0");

		oFormat = NumberFormat.getUnitInstance({ emptyString: null }, oLocale);
		assert.deepEqual(oFormat.parse(""), [null, undefined], "empty string is null");

		oFormat = NumberFormat.getUnitInstance({ emptyString: NaN }, oLocale);
		assert.deepEqual(oFormat.parse(""), [NaN, undefined], "empty string is NaN");

		// parseAsString
		oFormat = NumberFormat.getUnitInstance({ emptyString: 0, parseAsString: true }, oLocale);
		assert.deepEqual(oFormat.parse(""), ["0", undefined], "empty string is '0'");

		oFormat = NumberFormat.getUnitInstance({ emptyString: null, parseAsString: true }, oLocale);
		assert.deepEqual(oFormat.parse(""), [null, undefined], "empty string is null");

		oFormat = NumberFormat.getUnitInstance({ emptyString: NaN, parseAsString: true }, oLocale);
		assert.deepEqual(oFormat.parse(""), ["NaN", undefined], "empty string is 'NaN'");

	});

	QUnit.test("Unit parse edge cases CLDR - showMeasure = false", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({ showMeasure: false }, oLocale);

		assert.deepEqual(oFormat.parse("1.23"), [1.23, undefined], "1.23");
		assert.deepEqual(oFormat.parse("20"), [20, undefined], "number only '20'");
		assert.deepEqual(oFormat.parse("1"), [1, undefined], "1");
		assert.deepEqual(oFormat.parse(""), [NaN, undefined], "number no unit '' empty string option is by default NaN");

		// result in null
		assert.deepEqual(oFormat.parse("1 day"), null, "1 day");
		assert.deepEqual(oFormat.parse("x"), null, "x");
		assert.deepEqual(oFormat.parse("kg"), null, "kg");
		assert.deepEqual(oFormat.parse("XXX"), null, "XXX");
		assert.equal(oFormat.parse("20 ha"), null, "parsed correctly");
		assert.equal(oFormat.parse("20 c"), null, "number and ambigious unit duration-century and volume-cup");
		assert.equal(oFormat.parse("ha"), null, "unit only 'ha'");
		assert.equal(oFormat.parse("__ ha"), null, "no number area-hectare unit '__ ha'");
		assert.equal(oFormat.parse("__ __"), null, "no number no unit '__ __'");
		assert.equal(oFormat.parse("20 __"), null, "number no unit '20 __'");
		assert.equal(oFormat.parse("__"), null, "no number no unit '__'");
		assert.equal(oFormat.parse(null), null, "number no unit null");
		assert.equal(oFormat.parse(undefined), null, "number no unit undefined");
		assert.equal(oFormat.parse({}), null, "number no unit {}");
		assert.equal(oFormat.parse(true), null, "number no unit true");
		assert.equal(oFormat.parse(false), null, "number no unit false");
		assert.equal(oFormat.parse(NaN), null, "number no unit NaN");
		assert.equal(oFormat.parse(22), null, "number no unit 22");
		assert.equal(oFormat.parse(function () { }), null, "number no unit function");

		oFormat = NumberFormat.getUnitInstance({ emptyString: 0 }, oLocale);
		assert.deepEqual(oFormat.parse(""), [0, undefined], "empty string is 0");

		oFormat = NumberFormat.getUnitInstance({ emptyString: null }, oLocale);
		assert.deepEqual(oFormat.parse(""),[null, undefined], "empty string is null");

		oFormat = NumberFormat.getUnitInstance({ emptyString: NaN }, oLocale);
		assert.deepEqual(oFormat.parse(""), [NaN, undefined], "empty string is NaN");

		// parseAsString
		oFormat = NumberFormat.getUnitInstance({ emptyString: 0, parseAsString: true }, oLocale);
		assert.deepEqual(oFormat.parse(""), ["0", undefined], "empty string is '0'");

		oFormat = NumberFormat.getUnitInstance({ emptyString: null, parseAsString: true }, oLocale);
		assert.deepEqual(oFormat.parse(""), [null, undefined], "empty string is null");

		oFormat = NumberFormat.getUnitInstance({ emptyString: NaN, parseAsString: true }, oLocale);
		assert.deepEqual(oFormat.parse(""), ["NaN", undefined], "empty string is 'NaN'");
	});

	QUnit.test("Unit format: restricted list of accepted unit types", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({
			allowedUnits: ["area-hectare", "duration-hour", "volume-cup"]
		}, oLocale);

		// accepted units
		assert.equal(oFormat.format(20, "area-hectare").toString(), "20 ha", "area-hectare is accepted");
		assert.equal(oFormat.format(123, "duration-hour").toString(), "123 hr", "duration-hour is accepted");
		assert.equal(oFormat.format(2, "volume-cup").toString(), "2 c", "volume-cup is accepted");

		// rejected units
		assert.equal(oFormat.format(5.6, "area-acre").toString(), "", "area-acre is rejected");
		assert.equal(oFormat.format(1337, "duration-minute").toString(), "", "duration-minute is rejected");
	});

	QUnit.test("Unit parse: restricted list of accepted unit types", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({
			allowedUnits: ["area-hectare", "duration-hour", "volume-cup"]
		}, oLocale);

		// accepted units
		assert.deepEqual(oFormat.parse("20 ha"), [20, "area-hectare"], "area-hectare is accepted");
		assert.deepEqual(oFormat.parse("123 hr"), [123, "duration-hour"], "duration-hour is accepted");

		// ambiguous unit problem is resolved, because it is contained in the allowed unit types list
		assert.deepEqual(oFormat.parse("2 c"), [2, "volume-cup"], "volume-cup is correctly recognized");

		// rejected units
		assert.equal(oFormat.parse("5.6 ac"), null, "area-acre is rejected");
		assert.equal(oFormat.parse("1337 min"), null, "duration-minute is rejected");

		// if ambiguous units are introduced by the application, we return undefined for the unit
		oLocale = new Locale("en");
		oFormat = NumberFormat.getUnitInstance({
			allowedUnits: ["duration-century", "volume-cup"]
		}, oLocale);

		assert.deepEqual(oFormat.parse("41.5 c"), [41.5, undefined], "volume-cup and duration-century are ambiguous");
	});

	QUnit.test("Unit format with sMeasure and showMeasure = false", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({
			showMeasure: false
		}, oLocale);
		assert.equal(oFormat.format(1, "duration-hour"), "1", "1 hour");
		assert.equal(oFormat.format(0, "duration-hour"), "0", "0 hours");
		assert.equal(oFormat.format(123456.789, "duration-hour"), "123,456.789", "123,456.789 hours");
		assert.equal(oFormat.format([123456.789, "duration-hour"]), "123,456.789", "123,456.789 hours");

		assert.equal(oFormat.format(1, "electric-ohm"), "1", "1 ohm");
		assert.equal(oFormat.format(0, "electric-ohm"), "0", "0 ohms");
		assert.equal(oFormat.format([-123456.789, "electric-ohm"]), "-123,456.789", "-123,456.789 ohms");
		assert.equal(oFormat.format(-123456.789, "electric-ohm"), "-123,456.789", "-123,456.789 ohms");

		assert.equal(oFormat.format(1, "frequency-hertz"), "1", "1 hertz");
		assert.equal(oFormat.format(0, "frequency-hertz"), "0", "0 hertz");
		assert.equal(oFormat.format(123456.789, "frequency-hertz"), "123,456.789", "123,456.789 hertz");
		assert.equal(oFormat.format([123456.789, "frequency-hertz"]), "123,456.789", "123,456.789 hertz");

		assert.equal(oFormat.format(1, "area-hectare"), "1", "1 hectare");
		assert.equal(oFormat.format(0, "area-hectare"), "0", "0 hectare");
		assert.equal(oFormat.format(-123456.789, "area-hectare"), "-123,456.789", "-123,456.789 hectares");
		assert.equal(oFormat.format([-123456.789, "area-hectare"]), "-123,456.789", "-123,456.789 hectares");

	});

	QUnit.test("Unit format with sMeasure long style", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({ "style": "long" }, oLocale);
		assert.equal(oFormat.format(1, "duration-hour"), "1 hr", "1 hour");
		assert.equal(oFormat.format(0, "duration-hour"), "0 hr", "0 hours");
		assert.equal(oFormat.format(123456.789, "duration-hour"), "123 thousand hr", "123,456.789 hours");
		assert.equal(oFormat.format([123456.789, "duration-hour"]), "123 thousand hr", "123,456.789 hours");

		assert.equal(oFormat.format(1, "electric-ohm"), "1 Ω", "1 ohm");
		assert.equal(oFormat.format(0, "electric-ohm"), "0 Ω", "0 ohms");
		assert.equal(oFormat.format([-123456.789, "electric-ohm"]), "-123 thousand Ω", "-123 ohms");
		assert.equal(oFormat.format(-123456.789, "electric-ohm"), "-123 thousand Ω", "-123 ohms");

		assert.equal(oFormat.format(1, "frequency-hertz"), "1 Hz", "1 hertz");
		assert.equal(oFormat.format(0, "frequency-hertz"), "0 Hz", "0 hertz");
		assert.equal(oFormat.format(123456.789, "frequency-hertz"), "123 thousand Hz", "123 hertz");
		assert.equal(oFormat.format([123456.789, "frequency-hertz"]), "123 thousand Hz", "123 hertz");

		assert.equal(oFormat.format(1, "area-hectare"), "1 ha", "1 hectare");
		assert.equal(oFormat.format(0, "area-hectare"), "0 ha", "0 hectare");
		assert.equal(oFormat.format(-123456.789, "area-hectare"), "-123 thousand ha", "-123 hectares");
		assert.equal(oFormat.format([-123456.789, "area-hectare"]), "-123 thousand ha", "-123 hectares");

	});

	QUnit.test("Unit format with sMeasure long style and showMeasure = false", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({
			style: "long",
			showMeasure: false
		}, oLocale);
		assert.equal(oFormat.format(1, "duration-hour"), "1", "1 hour");
		assert.equal(oFormat.format(0, "duration-hour"), "0", "0 hours");
		assert.equal(oFormat.format(123456.789, "duration-hour"), "123 thousand", "123,456.789 hours");
		assert.equal(oFormat.format([123456.789, "duration-hour"]), "123 thousand", "123,456.789 hours");

		assert.equal(oFormat.format(1, "electric-ohm"), "1", "1 ohm");
		assert.equal(oFormat.format(0, "electric-ohm"), "0", "0 ohms");
		assert.equal(oFormat.format([-123456.789, "electric-ohm"]), "-123 thousand", "-123 ohms");
		assert.equal(oFormat.format(-123456.789, "electric-ohm"), "-123 thousand", "-123 ohms");

		assert.equal(oFormat.format(1, "frequency-hertz"), "1", "1 hertz");
		assert.equal(oFormat.format(0, "frequency-hertz"), "0", "0 hertz");
		assert.equal(oFormat.format(123456.789, "frequency-hertz"), "123 thousand", "123 hertz");
		assert.equal(oFormat.format([123456.789, "frequency-hertz"]), "123 thousand", "123 hertz");

		assert.equal(oFormat.format(1, "area-hectare"), "1", "1 hectare");
		assert.equal(oFormat.format(0, "area-hectare"), "0", "0 hectare");
		assert.equal(oFormat.format(-123456.789, "area-hectare"), "-123 thousand", "-123 hectares");
		assert.equal(oFormat.format([-123456.789, "area-hectare"]), "-123 thousand", "-123 hectares");

	});

	QUnit.test("Unit format with decimals", function (assert) {
		var oLocale = new Locale("cs");
		var oFormat = NumberFormat.getUnitInstance({
			customUnits: {
				"steven": {
					"displayName": "cgal",
					"unitPattern-count-one": "{0} cgal",
					"unitPattern-count-few": "{0} cgal",
					"unitPattern-count-many": "{0} cgal",
					"unitPattern-count-other": "{0} cgal",
					"decimals": 2
				}
			}
		}, oLocale);

		assert.equal(oFormat.format(1, "steven"), "1,00 cgal", "1,00 cgal");
		assert.equal(oFormat.format(1.1, "steven"), "1,10 cgal", "1,10 cgal");
		assert.equal(oFormat.format(1.12, "steven"), "1,12 cgal", "1,12 cgal");
		assert.equal(oFormat.format(1.123, "steven"), "1,12 cgal", "1,12 cgal");
		assert.equal(oFormat.format(1.125, "steven"), "1,13 cgal", "1,13 cgal");
	});

	QUnit.test("Unit format with precision", function (assert) {
		var oLocale = new Locale("cs");
		var oFormat = NumberFormat.getUnitInstance({
			customUnits: {
				"steven": {
					"displayName": "cgal",
					"unitPattern-count-one": "{0} cgal",
					"unitPattern-count-few": "{0} cgal",
					"unitPattern-count-many": "{0} cgal",
					"unitPattern-count-other": "{0} cgal",
					"precision": 4
				}
			}
		}, oLocale);

		assert.equal(oFormat.format(1, "steven"), "1 cgal", "1,00 cgal");
		assert.equal(oFormat.format(1.1, "steven"), "1,1 cgal", "1,10 cgal");
		assert.equal(oFormat.format(1.12, "steven"), "1,12 cgal", "1,12 cgal");
		assert.equal(oFormat.format(1.123, "steven"), "1,123 cgal", "1,12 cgal");
		assert.equal(oFormat.format(1.125, "steven"), "1,125 cgal", "1,125 cgal");
	});

	QUnit.test("Unit format with global configuration overwritten by format instance", function (assert) {
		var oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();
		var oConfigObject = {
			"steven": {
				"unitPattern-count-one": "{0} tylr",
				"unitPattern-count-few": "{0} tylrs",
				"unitPattern-count-many": "{0} tylrs",
				"unitPattern-count-other": "{0} tylrs",
				"decimals": 8
			}
		};
		oFormatSettings.setCustomUnits(oConfigObject);

		var oFormat = NumberFormat.getUnitInstance({
			customUnits: {
				"steven": {
					"displayName": "cgal",
					"unitPattern-count-one": "{0} cgal",
					"unitPattern-count-few": "{0} cgals",
					"unitPattern-count-many": "{0} cgals",
					"unitPattern-count-other": "{0} cgals",
					"decimals": 4
				}
			}
		});

		var oFormat2 = NumberFormat.getUnitInstance({
			customUnits: {
				"steven": {
					"displayName": "cgal",
					"unitPattern-count-one": "{0} cgal",
					"unitPattern-count-few": "{0} cgals",
					"unitPattern-count-many": "{0} cgals",
					"unitPattern-count-other": "{0} cgals",
					"precision": 3
				}
			}
		});

		var oFormat3 = NumberFormat.getUnitInstance({
			customUnits: {
				"steven": {
					"displayName": "cgal",
					"unitPattern-count-one": "{0} cgal",
					"unitPattern-count-few": "{0} cgals",
					"unitPattern-count-many": "{0} cgals",
					"unitPattern-count-other": "{0} cgals",
					"decimals": 0
				}
			}
		});

		var oFormat4 = NumberFormat.getUnitInstance({
			customUnits: {
				"steven": {
					"displayName": "cgal",
					"unitPattern-count-one": "{0} cgal",
					"unitPattern-count-few": "{0} cgals",
					"unitPattern-count-many": "{0} cgals",
					"unitPattern-count-other": "{0} cgals",
					"precision": 0
				}
			}
		});

		var oFormatFallback = NumberFormat.getUnitInstance();

		// custom decimals
		assert.equal(oFormat.format(1, "steven"), "1.0000 cgals", "1.0000 cgals");
		assert.equal(oFormat.format(1.1, "steven"), "1.1000 cgals", "1.1000 cgals");
		assert.equal(oFormat.format(1.12, "steven"), "1.1200 cgals", "1.1200 cgals");
		assert.equal(oFormat.format(1.123, "steven"), "1.1230 cgals", "1.1230 cgals");
		assert.equal(oFormat.format(1.125, "steven"), "1.1250 cgals", "1.1250 cgals");

		// custom precision
		assert.equal(oFormat2.format(1, "steven"), "1 cgal", "1 cgal");
		assert.equal(oFormat2.format(1.1, "steven"), "1.1 cgals", "1.1 cgals");
		assert.equal(oFormat2.format(1.12, "steven"), "1.12 cgals", "1.12 cgals");
		assert.equal(oFormat2.format(1.123, "steven"), "1.12 cgals", "1.12 cgals");
		assert.equal(oFormat2.format(1.125, "steven"), "1.13 cgals", "1.13 cgals");

		// custom decimals
		assert.equal(oFormat3.format(1, "steven"), "1 cgal", "1 cgal");
		assert.equal(oFormat3.format(1.1, "steven"), "1 cgal", "1 cgal");
		assert.equal(oFormat3.format(1.12, "steven"), "1 cgal", "1 cgal");
		assert.equal(oFormat3.format(1.123, "steven"), "1 cgal", "1 cgal");
		assert.equal(oFormat3.format(1.525, "steven"), "2 cgals", "1 cgal");

		// custom precision
		assert.equal(oFormat4.format(1, "steven"), "1 cgal", "1 cgal");
		assert.equal(oFormat4.format(1.1, "steven"), "1 cgal", "1 cgal");
		assert.equal(oFormat4.format(1.12, "steven"), "1 cgal", "1 cgal");
		assert.equal(oFormat4.format(1.123, "steven"), "1 cgal", "1 cgal");
		assert.equal(oFormat4.format(1.525, "steven"), "2 cgals", "1 cgal");

		// fallback to Configuration
		assert.equal(oFormatFallback.format(1, "steven"), "1.00000000 tylrs", "1.00000000 tylrs");
		assert.equal(oFormatFallback.format(1.1, "steven"), "1.10000000 tylrs", "1.10000000 tylrs");
		assert.equal(oFormatFallback.format(1.12, "steven"), "1.12000000 tylrs", "1.12000000 tylrs");
		assert.equal(oFormatFallback.format(1.123, "steven"), "1.12300000 tylrs", "1.12300000 tylrs");
		assert.equal(oFormatFallback.format(1.125, "steven"), "1.12500000 tylrs", "1.12500000 tylrs");
	});

	QUnit.test("Unit parse with sMeasure", function (assert) {

		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance(oLocale);
		var aResult = oFormat.parse("1 hr");
		assert.deepEqual(aResult, [1, "duration-hour"], "Number and unit is parsed correctly");

		aResult = oFormat.parse("10e-1 hr");
		assert.deepEqual(aResult, [1, "duration-hour"], "Number and unit is parsed correctly");
	});

	QUnit.test("Unit parse with sMeasure - parseAsString", function (assert) {

		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({
			parseAsString: true
		}, oLocale);
		var aResult = oFormat.parse("123 hr");
		assert.deepEqual(aResult, ["123", "duration-hour"], "Number and unit is parsed correctly");


		aResult = oFormat.parse("10e-1 hr");
		assert.deepEqual(aResult, ["1.0", "duration-hour"], "Number and unit is parsed correctly");
	});

	QUnit.test("Unit parse with sMeasure & special plural forms (e.g. AR locale)", function (assert) {
		var oLocale = new Locale("ar");
		var oFormat = NumberFormat.getUnitInstance(oLocale);
		var aResult = oFormat.parse("درجة");

		//matches -one pattern
		assert.deepEqual(aResult, [1, "angle-degree"], "Number and unit is parsed correctly");

		//matches -two pattern
		aResult = oFormat.parse("درجتان");
		assert.deepEqual(aResult, [2, "angle-degree"], "Number and unit is parsed correctly");
	});

	QUnit.test("Unit parse with missing units", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance(oLocale);
		var aResult = oFormat.parse("1234");

		assert.equal(aResult, null, "Unit is missing");
	});

	QUnit.test("Unit parse with ambiguous units (e.g. en locale)", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance(oLocale);
		var aResult = oFormat.parse("100 c");

		// number can be uniquely determined but unit is ambiguous
		assert.deepEqual(aResult, [100, undefined], "Number and unit is parsed correctly");
	});

	QUnit.test("Unit parse with sMeasure and unknown Unit", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance(oLocale);

		var aResult = oFormat.parse("123 TER");
		assert.equal(aResult, null, "unit cannot be found");

		aResult = oFormat.parse("TER 1234");
		assert.equal(aResult, null, "unit cannot be found");
	});

	QUnit.test("Unit parse with sMeasure and Wrong Number or Unit value", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance(oLocale);

		var aResult = oFormat.parse("1r2 deg");
		assert.equal(aResult, null, "Broken Number is recognized -> null result");

		aResult = oFormat.parse("null foo");
		assert.equal(aResult, null, "Broken Number and Unit is recognized -> null result");

		aResult = oFormat.parse("deg");
		assert.equal(aResult, null, "Broken Number and Unit is recognized -> null result");

		// parseAsString does not change anything
		oFormat = NumberFormat.getUnitInstance({
			parseAsString: true
		}, oLocale);
		aResult = oFormat.parse("1r2 deg");

		assert.equal(aResult, null, "broken Number is recognized -> null value");
	});

	QUnit.test("Unit parse with sMeasure english long", function (assert) {

		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getUnitInstance({ "style": "long" }, oLocale);
		var aResult = oFormat.parse("1 thousand hr");
		assert.ok(Array.isArray(aResult), "Unit parser should return an array");
		assert.equal(aResult[0], 1000, "Number is parsed correctly");
		assert.equal(aResult[1], "duration-hour", "hour expression from pattern \"{1} hr\"");


		aResult = oFormat.parse("17 million hr");
		assert.ok(Array.isArray(aResult), "Unit parser should return an array");
		assert.equal(aResult[0], 17000000, "Number is parsed correctly");
		assert.equal(aResult[1], "duration-hour", "hour expression from pattern \"{1} hr\"");

	});

	QUnit.test("Unit parse with sMeasure complex cldr polish", function (assert) {

		var oLocale = new Locale("pl_PL");
		var oFormat = NumberFormat.getUnitInstance(oLocale);
		var aResult = oFormat.parse("1 234 567 mi/h");
		assert.ok(Array.isArray(aResult), "Unit parser should return an array");
		assert.equal(aResult[0], 1234567, "Number is parsed correctly");
		assert.equal(aResult[1], "speed-mile-per-hour", "hour expression from pattern \"{0}  mi/h\"");

		aResult = oFormat.parse("0,5 mi/h");
		assert.ok(Array.isArray(aResult), "Unit parser should return an array");
		assert.equal(aResult[0], 0.5, "Number is parsed correctly");
		assert.equal(aResult[1], "speed-mile-per-hour", "hour expression from pattern \"{0}  mi/h	\"");

	});


	QUnit.test("Unit parse with sMeasure complex cldr polish long", function (assert) {

		var oLocale = new Locale("pl_PL");
		var oFormat = NumberFormat.getUnitInstance({ style: "long" }, oLocale);
		var aResult = oFormat.parse("123 tysiące mi/h");
		assert.ok(Array.isArray(aResult), "Unit parser should return an array");
		assert.equal(aResult[0], 123000, "Number is parsed correctly");
		assert.equal(aResult[1], "speed-mile-per-hour", "hour expression from pattern \"{0}  mi/h\"");

		aResult = oFormat.parse("500 mi/h");
		assert.ok(Array.isArray(aResult), "Unit parser should return an array");
		assert.equal(aResult[0], 500, "Number is parsed correctly");
		assert.equal(aResult[1], "speed-mile-per-hour", "hour expression from pattern \"{0}  mi/h	\"");

	});


	QUnit.module("Percent Format");

	QUnit.test("Percent format with default rounding mode", function (assert) {
		var oFormat = NumberFormat.getPercentInstance({
			maxFractionDigits: 3
		});

		assert.equal(oFormat.format(12), "1,200%", "12");
		assert.equal(oFormat.format(12.34), "1,234%", "12.34");
		assert.equal(oFormat.format(.1234567), "12.346%", ".1234567");
		assert.equal(oFormat.format(-.1234567), "-12.346%", ".1234567");
		assert.equal(oFormat.format(.1234), "12.34%", ".1234");
		assert.equal(oFormat.parse("-12.345%"), -0.12345, "-12.345%");
		assert.ok(isNaN(oFormat.parse("%12.345%")), "NaN", "%12.345%");
	});

	QUnit.test("Percent format with string values", function(assert) {
		var oFormat = NumberFormat.getPercentInstance({
			maxFractionDigits: 3
		});

		assert.equal(oFormat.format("12"), "1,200%", "12");
		assert.equal(oFormat.format("12.34"), "1,234%", "12.34");
		assert.equal(oFormat.format(".1234567"), "12.345%", ".1234567");
		assert.equal(oFormat.format("-.1234567"), "-12.345%", ".1234567");
		assert.equal(oFormat.format(".1234"), "12.34%", ".1234");
	});

	QUnit.test("Percent format with parseAsString (en_GB)", function(assert) {
		var oFormat = NumberFormat.getPercentInstance({
			parseAsString: true
		}, new Locale("en_GB"));

		[
			{
				numberValue: "0.01",
				percentValue: "1%"
			},
			{
				numberValue: "1.00",
				percentValue: "100%"
			},
			{
				numberValue: "1.23",
				percentValue: "123%"
			},
			{
				numberValue: "1.234567",
				percentValue: "123.4567%"
			}
		].forEach(function (oFixture) {
			var sFormatted = oFormat.format(oFixture.numberValue);
			assert.equal(sFormatted, oFixture.percentValue, "format " + oFixture.numberValue);
			assert.equal(oFormat.parse(sFormatted), oFixture.numberValue, "parse " + oFixture.percentValue);
		});
	});

	QUnit.test("Percent format with parseAsString (de_DE)", function(assert) {
		var oFormat = NumberFormat.getPercentInstance({
			parseAsString: true
		}, new Locale("de_DE"));

		[
			{
				numberValue: "0.01",
				percentValue: "1\xa0%"
			},
			{
				numberValue: "1.00",
				percentValue: "100\xa0%"
			},
			{
				numberValue: "1.23",
				percentValue: "123\xa0%"
			},
			{
				numberValue: "1.234567",
				percentValue: "123,4567\xa0%"
			}
		].forEach(function (oFixture) {
			var sFormatted = oFormat.format(oFixture.numberValue);
			assert.equal(sFormatted, oFixture.percentValue, "format " + oFixture.numberValue);
			assert.equal(oFormat.parse(sFormatted), oFixture.numberValue, "parse " + oFixture.percentValue);
		});
	});

	QUnit.test("Percent format with specific locale tr-TR", function (assert) {
		var oLocale = new Locale("tr-TR");
		var oFormat = NumberFormat.getPercentInstance(oLocale);

		assert.equal(oFormat.format(.1234567), "%12,34567", ".1234567");
		assert.equal(oFormat.parse("%12,34567"), 0.1234567, "%12,34567");
		assert.ok(isNaN(oFormat.parse("12,34567%")), "12,34567%");
	});

	QUnit.module("Default Options");

	QUnit.test("parse default format", function (assert) {
		assert.equal(oDefaultInteger.parse("123"), 123, "123");
		assert.equal(oDefaultInteger.parse("123,123"), 123123, "123,123");
		assert.equal(oDefaultInteger.parse("123,123,123"), 123123123, "123,123,123");
		assert.equal(oDefaultInteger.parse("123,123,123,124"), 123123123124, "123,123,123,124");
		assert.equal(oDefaultInteger.parse("5e+3"), 5000, "5e+3");

		// tolerated, despite wrong grouping, because there are 2 grouping separators present
		assert.equal(oDefaultInteger.parse("123,123,1234"), 1231231234, "123,123,1234");

		assert.equal(isNaN(oDefaultInteger.parse("123.00")), true, "123.00");
		assert.equal(isNaN(oDefaultInteger.parse("a1b2c3")), true, "a1b2c3");

		assert.equal(oDefaultFloat.parse("123.23"), 123.23, "123.23");
		assert.equal(oDefaultFloat.parse("123,123,123.23"), 123123123.23, "123,123,123.23");
		assert.equal(oDefaultFloat.parse(".23"), 0.23, ".23");
		assert.equal(oDefaultFloat.parse("-123.23"), -123.23, "-123.23");
		assert.equal(oDefaultFloat.parse("+6.5"), 6.5, "+6.5");
		assert.equal(oDefaultFloat.parse("5e+3"), 5000, "5e+3");
		assert.equal(oDefaultFloat.parse("1E+4"), 10000, "1E+4");
		assert.equal(oDefaultFloat.parse("5e-3"), 0.005, "5e-3");
		assert.equal(oDefaultFloat.parse(".5e-3"), 5e-4, ".5e-3");
		assert.equal(oDefaultFloat.parse("1."), 1, "1.");
		assert.equal(isNaN(oDefaultFloat.parse("123.x5")), true, "123.x5");

		var oFormat = NumberFormat.getFloatInstance({
			parseAsString: true
		});
		assert.equal(oFormat.parse("123.23"), "123.23", "Simple number is parsed as string");
		assert.equal(oFormat.parse("000123.23"), "123.23", "Number with leading zeros is parsed as string");
		assert.equal(oFormat.parse("12,345.67"), "12345.67", "Number with grouping is parsed as string");
		assert.equal(oFormat.parse("-12,345,678,901,123,456,345,678,901,123,456.78"), "-12345678901123456345678901123456.78",
			"Ridiculously long number is parsed as string");
	});

	QUnit.test("parse default format special cases", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			parseAsString: true
		});

		assert.equal(oFormat.parse("000001"), "1", "000001");
		assert.equal(oFormat.parse("000000"), "0", "000000");
		assert.equal(oFormat.parse("0.00000"), "0.00000", "0.00000");
		assert.equal(oFormat.parse("1e-1337"), "1e-1337", "1e-1337");
		var sSmallNumber = "0." + "0".repeat(1337) + "1";
		assert.equal(oFormat.parse(sSmallNumber), sSmallNumber, "1e-1337 as number");
	});

	QUnit.test("NumberFormat for 'he' locale with big number. Contains then RTL character u+200F", function (assert) {
		//setup
		var oLocale = new Locale("he");
		var oFormat = NumberFormat.getIntegerInstance({
			"style": "long"
		}, oLocale);

		// input and output
		var iExpectedNumber = 123000000;

		// execution
		var sFormatted = oFormat.format(iExpectedNumber);
		assert.equal(sFormatted, '‏123 מיליון', "can be formatted '" + sFormatted + "'");

		var sParsed = oFormat.parse(sFormatted);
		assert.equal(sParsed, iExpectedNumber, "should match input number " + iExpectedNumber);
	});

	QUnit.test("NumberFormat for 'de' locale with big number", function (assert) {
		var oLocale = new Locale("de");
		var oFormat = NumberFormat.getIntegerInstance({
			"style": "long"
		}, oLocale);
		var expectedNumber = 123000000;
		var sFormatted = oFormat.format(expectedNumber);
		assert.equal(sFormatted, "123 Millionen", "can be formatted '" + sFormatted + "'");

		var sParsed = oFormat.parse(sFormatted);
		assert.equal(sParsed, expectedNumber, "should match input number " + expectedNumber);
	});

	QUnit.test("parse: scientific format parseAsString", function (assert) {
		var oIntegerFormat = NumberFormat.getIntegerInstance({
			parseAsString: true
		}), oFloatFormat = NumberFormat.getFloatInstance({
			parseAsString: true
		});

		[{
			value: "3e+5",
			expected: "300000"
		}, {
			value: "-3e+5",
			expected: "-300000"
		}, {
			value: "3e+22",
			expected: "30000000000000000000000"
		}, {
			value: "-3e+22",
			expected: "-30000000000000000000000"
		}, {
			value: "1.2345678901234568e+22",
			expected: "12345678901234568000000"
		}, {
			value: "-1.2345678901234568e+22",
			expected: "-12345678901234568000000"
		}, {
			value: "1.2345678901234568e+32",
			expected: "123456789012345680000000000000000"
		}, {
			value: "-1.2345678901234568e+32",
			expected: "-123456789012345680000000000000000"
		}].forEach(function (oInput) {
			var sParsedInteger = oIntegerFormat.parse(oInput.value);
			assert.strictEqual(sParsedInteger, oInput.expected, "integer content must be the same for " + oInput.value);

			var sParsedFloat = oFloatFormat.parse(oInput.value);
			assert.strictEqual(sParsedFloat, oInput.expected, "float content must be the same for " + oInput.value);
		});
	});

	QUnit.test("parse: scientific format", function (assert) {
		var oIntegerFormat = NumberFormat.getIntegerInstance(),
			oFloatFormat = NumberFormat.getFloatInstance();

		[{
			value: "3e+5",
			expected: 3e+5
		}, {
			value: "-3e+5",
			expected: -3e+5
		}, {
			value: "3e+22",
			expected: 3e+22
		}, {
			value: "-3e+22",
			expected: -3e+22
		}, {
			value: "1.2345678901234568e+22",
			expected: 1.2345678901234568e+22
		}, {
			value: "-1.2345678901234568e+22",
			expected: -1.2345678901234568e+22
		}, {
			value: "1.2345678901234568e+32",
			expected: 1.2345678901234569e+32
		}, {
			value: "-1.2345678901234568e+32",
			expected: -1.2345678901234569e+32
		}].forEach(function (oInput) {
			var sParsedInteger = oIntegerFormat.parse(oInput.value);
			assert.strictEqual(sParsedInteger, oInput.expected, "integer content must be the same for " + oInput.value);

			var sParsedFloat = oFloatFormat.parse(oInput.value);
			assert.strictEqual(sParsedFloat, oInput.expected, "float content must be the same for " + oInput.value);
		});
	});

	QUnit.test("parse default format with parameter 'parseAsString' set to true", function (assert) {
		var oIntegerFormat = NumberFormat.getIntegerInstance({
			parseAsString: true
		}), oFloatFormat = NumberFormat.getFloatInstance({
			parseAsString: true
		});

		assert.equal(oIntegerFormat.parse("123"), "123", "123");
		assert.equal(oIntegerFormat.parse("123,123"), "123123", "123,123");
		assert.equal(oIntegerFormat.parse("000123,123"), "123123", "000123,123");
		assert.equal(oIntegerFormat.parse("123,123,123"), "123123123", "123,123,123");
		assert.equal(oIntegerFormat.parse("5e+3"), "5000", "5e+3");
		assert.equal(oIntegerFormat.parse("1.234567e+6"), "1234567", "1.234567e+6");

		// tolerated, despite wrong grouping, because there are 2 grouping separators present
		assert.equal(oIntegerFormat.parse("123,123,1234"), 1231231234, "123,123,1234");

		assert.ok(isNaN(oIntegerFormat.parse("1.234567e+5")), "1.234567e+5");
		assert.ok(isNaN(oIntegerFormat.parse("123.00")), "123.00");
		assert.ok(isNaN(oIntegerFormat.parse("5e-3")), "5e-3 (0.005 not an integer)");
		assert.ok(isNaN(oIntegerFormat.parse("a1b2c3")), "a1b2c3");
		assert.ok(isNaN(oIntegerFormat.parse("5e-3e+2")), "5e-3e+2");
		assert.ok(isNaN(oIntegerFormat.parse("123e-4e5")), "123e-4e5");
		assert.ok(isNaN(oIntegerFormat.parse("123ee-4")), "123ee-4");

		assert.equal(oFloatFormat.parse("123.23"), "123.23", "123.23");
		assert.equal(oFloatFormat.parse("000123.23"), "123.23", "000123.23");
		assert.equal(oFloatFormat.parse("123,123,123.23"), "123123123.23", "123,123,123.23");
		assert.equal(oFloatFormat.parse("+.23"), "0.23", ".23");
		assert.equal(oFloatFormat.parse("-123.23"), "-123.23", "-123.23");
		assert.equal(oFloatFormat.parse("+6.5"), "6.5", "+6.5");
		assert.equal(oFloatFormat.parse("5e+3"), "5000", "5e+3");
		assert.equal(oFloatFormat.parse("1E+4"), "10000", "1E+4");
		assert.equal(oFloatFormat.parse("5e-3"), "0.005", "5e-3");
		assert.equal(oFloatFormat.parse(".5e-3"), "0.0005", ".5e-3");
		assert.ok(isNaN(oFloatFormat.parse("123.x5")), "123.x5");
		assert.ok(isNaN(oFloatFormat.parse("5e-3e+2")), "5e-3e+2");
		assert.ok(isNaN(oFloatFormat.parse("123e-4e5")), "123e-4e5");
		assert.ok(isNaN(oFloatFormat.parse("123ee-4")), "123ee-4");
	});

	QUnit.test("parse: scientific format not normalized with edge case numbers", function (assert) {
		var oIntegerFormatParseAsString = NumberFormat.getIntegerInstance({
			parseAsString: true
		});

		assert.equal(oIntegerFormatParseAsString.parse("10.2e+4"), "102000", "spacing1");
		assert.equal(oIntegerFormatParseAsString.parse("10.2e +4"), "102000", "spacing2");
		assert.equal(oIntegerFormatParseAsString.parse("10.2 e +4"), "102000", "spacing3");
		assert.equal(oIntegerFormatParseAsString.parse("10.2 e+4"), "102000", "spacing4");
		assert.equal(oIntegerFormatParseAsString.parse(" 10.2e+4"), "102000", "spacing5");
		assert.equal(oIntegerFormatParseAsString.parse("10.2e+4 "), "102000", "spacing6");
		assert.equal(oIntegerFormatParseAsString.parse(" 10.2e+4 "), "102000", "spacing7");

		assert.ok(isNaN(oIntegerFormatParseAsString.parse("1e4")), "no sign for exponent");
		assert.ok(isNaN(oIntegerFormatParseAsString.parse("10 e4")), "no sign for exponent");
		assert.ok(isNaN(oIntegerFormatParseAsString.parse("10e 4")), "no sign for exponent");

		assert.ok(isNaN(oIntegerFormatParseAsString.parse("1234567891234.12345e+4")), "1234567891234.12345e+4");
		assert.ok(isNaN(oIntegerFormatParseAsString.parse("1234567891234.123456e+4")), "1234567891234.123456e+4");
		assert.ok(isNaN(oIntegerFormatParseAsString.parse("1234567891234.123456789e+4")), "1234567891234.123456789e+4");

		var oIntegerFormat = NumberFormat.getIntegerInstance();
		assert.ok(isNaN(oIntegerFormat.parse("1234567891234.12345e+4")), "1234567891234.12345e+4");
		assert.ok(isNaN(oIntegerFormat.parse("1234567891234.123456e+4")), "1234567891234.123456e+4");
		assert.ok(isNaN(oIntegerFormat.parse("1234567891234.123456789e+4")), "1234567891234.123456789e+4");

		assert.equal(oIntegerFormat.parse("10.2e+4"), "102000", "spacing1");
		assert.equal(oIntegerFormat.parse("10.2e +4"), "102000", "spacing2");
		assert.equal(oIntegerFormat.parse("10.2 e +4"), "102000", "spacing3");
		assert.equal(oIntegerFormat.parse("10.2 e+4"), "102000", "spacing4");
		assert.equal(oIntegerFormat.parse(" 10.2e+4"), "102000", "spacing5");
		assert.equal(oIntegerFormat.parse("10.2e+4 "), "102000", "spacing6");
		assert.equal(oIntegerFormat.parse(" 10.2e+4 "), "102000", "spacing7");
	});

	QUnit.test("parse: scientific format not normalized", function (assert) {
		var oIntegerFormat = NumberFormat.getIntegerInstance(),
			oFloatFormat = NumberFormat.getFloatInstance();

		[{
			value: "30.0e+5",
			expected: 3e+6
		}, {
			value: "-30.0e+5",
			expected: -3e+6
		}, {
			value: "30.0e+22",
			expected: 3e+23
		}, {
			value: "-30.0e+22",
			expected: -3e+23
		}, {
			value: "12.345678901234568e+22",
			expected: 1.2345678901234569e+23
		}, {
			value: "-12.345678901234568e+22",
			expected: -1.2345678901234569e+23
		}, {
			value: "12.345678901234568e+32",
			expected: 1.2345678901234568e+33
		}, {
			value: "-12.345678901234568e+32",
			expected: -1.2345678901234568e+33
		}].forEach(function (oInput) {
			var sParsedInteger = oIntegerFormat.parse(oInput.value);
			assert.strictEqual(sParsedInteger, oInput.expected, "integer content must be the same for " + oInput.value);

			var sParsedFloat = oFloatFormat.parse(oInput.value);
			assert.strictEqual(sParsedFloat, oInput.expected, "float content must be the same for " + oInput.value);
		});
	});

	QUnit.test("parse a number with custom plus and minus signs", function (assert) {
		var oIntegerFormat = NumberFormat.getIntegerInstance({
			plusSign: ".",
			minusSign: "["
		}), oFloatFormat = NumberFormat.getFloatInstance({
			plusSign: "]",
			minusSign: "|"
		});

		assert.equal(oIntegerFormat.parse(".1,234"), 1234, "1234 with custom plusSign '.'");
		assert.equal(oIntegerFormat.parse("[1,234,567"), -1234567, "-1234567 with custom minusSign '['");
		assert.equal(oFloatFormat.parse("]1,234.567"), 1234.567, "1234.567 with custom plusSign ']'");
		assert.equal(oFloatFormat.parse("|1,234.567"), -1234.567, "1234.567 with custom minusSign '|'");
	});

	QUnit.test("parse a number with custom grouping separator", function (assert) {
		var oIntegerFormat = NumberFormat.getIntegerInstance({
			groupingEnabled: true,
			groupingSeparator: "S"
		});

		assert.equal(oIntegerFormat.parse("1S234S567"), 1234567, "1S234S567 is parsed as 1234567 with grouping separator set to 's'");
		assert.ok(isNaN(oIntegerFormat.parse("1s234s567")), "1s234s567 is parsed as NaN");
	});

	QUnit.test("parse custom format (grouping and decimal separator are equal)", function (assert) {
		assert.equal(oCustomInteger.parse("123"), 123, "123");
		assert.equal(oCustomInteger.parse("123.123"), 123123, "123.123");
		assert.equal(oCustomInteger.parse("123.123.123"), 123123123, "123.123.123");
		assert.equal(oCustomInteger.parse("5e+3"), 5000, "5e+3");
		// tolerated, despite wrong grouping, because decimal separator is the same as grouping
		// separator and 2 grouping separators are present
		assert.equal(oCustomInteger.parse("123.123.1234"), 1231231234, "123.123.1234");
		assert.ok(isNaN(oCustomInteger.parse("123,00")), "123,00");
		assert.ok(isNaN(oCustomInteger.parse("5e-3")), "5e+3");
		assert.ok(isNaN(oCustomInteger.parse("a1b2c3")), "a1b2c3");

		assert.equal(oCustomFloat.parse("0,23"), 0.23, "0.23");
		assert.equal(oCustomFloat.parse("1.234,23"), 1234.23, "1.234,23");
		assert.equal(oCustomFloat.parse("123.123.123,23"), 123123123.23, "123.123.123,23");
		assert.equal(oCustomFloat.parse(",23"), 0.23, ",23");
		assert.equal(oCustomFloat.parse("-123,23"), -123.23, "-123,23");
		assert.equal(oCustomFloat.parse("5e+3"), 5000, "5e+3");
		assert.equal(oCustomFloat.parse("1E+4"), 10000, "1E+4");
		assert.equal(oCustomFloat.parse("5e-3"), 0.005, "5e-3");
		assert.equal(oCustomFloat.parse(",5e-3"), 5e-4, ",5e-3");
		assert.equal(isNaN(oCustomFloat.parse("123,x5")), true, "123,x5");

		var oFormat = NumberFormat.getFloatInstance({
			parseAsString: true,
			groupingSeparator: ".",
			decimalSeparator: ","
		});
		assert.equal(oFormat.parse("123,23"), "123.23", "Simple number is parsed as string");
		assert.equal(oFormat.parse("000123,23"), "123.23", "Number with leading zeros is parsed as string");
		assert.equal(oFormat.parse("12.345,67"), "12345.67", "Number with grouping is parsed as string");
		assert.equal(oFormat.parse("-12.345.678.901.123.456.345.678.901.123.456,78"), "-12345678901123456345678901123456.78",
			"Ridiculously long number is parsed as string");

	});

	QUnit.module("Custom Options", {
		beforeEach: function () {
			this.oLogErrorSpy = sinon.spy(Log, "error");
		},
		afterEach: function () {
			this.oLogErrorSpy.restore();
		}
	});

	QUnit.test("parse format with custom separators", function (assert) {

		var oFormat = NumberFormat.getFloatInstance({
			parseAsString: true,
			groupingSeparator: ".",
			decimalSeparator: "."
		});

		assert.equal(oFormat.parse("100.000"), "100000", "number is parsed using grouping separator '.'");

		assert.equal(this.oLogErrorSpy.callCount, 1, "called once");
		assert.equal(this.oLogErrorSpy.getCall(0).args[0], "The grouping and decimal separator both have the same value '.'. They must be different from each other such that values can be parsed correctly.", "argument matches");
	});

	QUnit.module("Float Format");

	QUnit.test("float precision", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFormat = NumberFormat.getFloatInstance({ precision: 0 }, oLocale);

		assert.equal(oFormat.format(0.23), "0", "0.23 formatted");
		assert.equal(oFormat.format(1.345), "1", "1.3456 formatted");
		assert.equal(oFormat.format(23.456), "23", "23.456 formatted");

		oFormat = NumberFormat.getFloatInstance({ precision: 1 }, oLocale);
		assert.equal(oFormat.format(0.23), "0,2", "0.23 formatted");
		assert.equal(oFormat.format(1.345), "1", "1.3456 formatted");
		assert.equal(oFormat.format(23.456), "23", "23.456 formatted");
		assert.equal(oFormat.format(123.456), "123", "123.456 formatted");

		oFormat = NumberFormat.getFloatInstance({ precision: 2 }, oLocale);
		assert.equal(oFormat.format(0.23), "0,23", "0.23 formatted");
		assert.equal(oFormat.format(1.345), "1,3", "1.3456 formatted");
		assert.equal(oFormat.format(23.456), "23", "23.456 formatted");
		assert.equal(oFormat.format(123.456), "123", "123.456 formatted");

		oFormat = NumberFormat.getFloatInstance({ precision: 3 }, oLocale);
		assert.equal(oFormat.format(0.23), "0,23", "0.23 formatted");
		assert.equal(oFormat.format(1.345), "1,35", "1.3456 formatted");
		assert.equal(oFormat.format(23.456), "23,5", "23.456 formatted");
		assert.equal(oFormat.format(123.456), "123", "123.456 formatted");

		oFormat = NumberFormat.getFloatInstance({ precision: 4 }, oLocale);
		assert.equal(oFormat.format(0.23), "0,23", "0.23 formatted");
		assert.equal(oFormat.format(1.345), "1,345", "1.3456 formatted");
		assert.equal(oFormat.format(23.456), "23,46", "23.456 formatted");
		assert.equal(oFormat.format(123.456), "123,5", "123.456 formatted");

	});


	QUnit.test("float short style", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFormat = NumberFormat.getFloatInstance({ style: "short", shortDecimals: 0 }, oLocale);

		assert.equal(oFormat.format(0.23), "0,23", "0.23 formatted");
		assert.equal(oFormat.format(1), "1", "1 formatted");
		assert.equal(oFormat.format(12), "12", "12 formatted");
		assert.equal(oFormat.format(123), "123", "123 formatted");
		assert.equal(oFormat.format(999), "999", "999 formatted");
		assert.equal(oFormat.format(1234), "1.234", "1234 formatted");
		assert.equal(oFormat.format(9999), "9.999", "9999 formatted");
		assert.equal(oFormat.format(12345), "12.345", "12345 formatted");
		assert.equal(oFormat.format(99999), "99.999", "99999 formatted");
		assert.equal(oFormat.format(123456), "123.456", "123456 formatted");
		assert.equal(oFormat.format(999999), "1\xa0Mio.", "999999 formatted");
		assert.equal(oFormat.format(1234567), "1\xa0Mio.", "1234567 formatted");
		assert.equal(oFormat.format(9999999), "10\xa0Mio.", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "12\xa0Mio.", "12345678 formatted");
		assert.equal(oFormat.format(99999999), "100\xa0Mio.", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "123\xa0Mio.", "123456789 formatted");
		assert.equal(oFormat.format(999999999), "1\xa0Mrd.", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "1\xa0Mrd.", "1234567890 formatted");
		assert.equal(oFormat.format(9999999999), "10\xa0Mrd.", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "12\xa0Mrd.", "12345678901 formatted");
		assert.equal(oFormat.format(99999999999), "100\xa0Mrd.", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "123\xa0Mrd.", "123456789012 formatted");
		assert.equal(oFormat.format(999999999999), "1\xa0Bio.", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "1\xa0Bio.", "1234567890123 formatted");
		assert.equal(oFormat.format(-0.23), "-0,23", "0.23 formatted");
		assert.equal(oFormat.format(-1), "-1", "-1 formatted");
		assert.equal(oFormat.format(-12), "-12", "-12 formatted");
		assert.equal(oFormat.format(-123), "-123", "-123 formatted");
		assert.equal(oFormat.format(-999), "-999", "-999 formatted");
		assert.equal(oFormat.format(-1234), "-1.234", "-1234 formatted");
		assert.equal(oFormat.format(-9999), "-9.999", "-9999 formatted");
		assert.equal(oFormat.format(-12345), "-12.345", "-12345 formatted");
		assert.equal(oFormat.format(-99999), "-99.999", "-99999 formatted");
		assert.equal(oFormat.format(-123456), "-123.456", "-123456 formatted");
		assert.equal(oFormat.format(-999999), "-1\xa0Mio.", "-999999 formatted");
		assert.equal(oFormat.format(-1234567), "-1\xa0Mio.", "-1234567 formatted");
		assert.equal(oFormat.format(-9999999), "-10\xa0Mio.", "-9999999 formatted");
		assert.equal(oFormat.format(-12345678), "-12\xa0Mio.", "-12345678 formatted");
		assert.equal(oFormat.format(-99999999), "-100\xa0Mio.", "-99999999 formatted");
		assert.equal(oFormat.format(-123456789), "-123\xa0Mio.", "-123456789 formatted");
		assert.equal(oFormat.format(-999999999), "-1\xa0Mrd.", "-999999999 formatted");
		assert.equal(oFormat.format(-1234567890), "-1\xa0Mrd.", "-1234567890 formatted");
		assert.equal(oFormat.format(-9999999999), "-10\xa0Mrd.", "-9999999999 formatted");
		assert.equal(oFormat.format(-12345678901), "-12\xa0Mrd.", "-12345678901 formatted");
		assert.equal(oFormat.format(-99999999999), "-100\xa0Mrd.", "-99999999999 formatted");
		assert.equal(oFormat.format(-123456789012), "-123\xa0Mrd.", "-123456789012 formatted");
		assert.equal(oFormat.format(-999999999999), "-1\xa0Bio.", "-999999999999 formatted");
		assert.equal(oFormat.format(-1234567890123), "-1\xa0Bio.", "-1234567890123 formatted");

		assert.equal(oFormat.parse("0,23"), 0.23, "\"0,23\" parsed");
		assert.equal(oFormat.parse("1"), 1, "\"1\" parsed");
		assert.equal(oFormat.parse("12"), 12, "\"12\" parsed");
		assert.equal(oFormat.parse("123"), 123, "\"123\" parsed");
		assert.equal(oFormat.parse("1230"), 1230, "\"1,23 Tsd\" parsed");
		assert.equal(oFormat.parse("1 Mio."), 1000000, "\"1 Mio.\" parsed");
		assert.equal(oFormat.parse("10 Mio."), 10000000, "\"10 Mio.\" parsed");
		assert.equal(oFormat.parse("100 Mio."), 100000000, "\"100 Mio.\" parsed");
		assert.equal(oFormat.parse("1 Mrd."), 1000000000, "\"1 Mrd.\" parsed");
		assert.equal(oFormat.parse("10 Mrd."), 10000000000, "\"10 Mrd.\" parsed");
		assert.equal(oFormat.parse("100 Mrd."), 100000000000, "\"100 Mrd.\" parsed");
		assert.equal(oFormat.parse("1 Bio."), 1000000000000, "\"1 Bio.\" parsed");
		assert.equal(oFormat.parse("-0,23"), -0.23, "\"-0,23\" parsed");
		assert.equal(oFormat.parse("-1"), -1, "\"-1\" parsed");
		assert.equal(oFormat.parse("-12"), -12, "\"-12\" parsed");
		assert.equal(oFormat.parse("-123"), -123, "\"-123\" parsed");
		assert.equal(oFormat.parse("-1230"), -1230, "\"-1230\" parsed");
		assert.equal(oFormat.parse("-1 Mio."), -1000000, "\"-1 Mio.\" parsed");
		assert.equal(oFormat.parse("-10 Mio."), -10000000, "\"-10 Mio.\" parsed");
		assert.equal(oFormat.parse("-100 Mio."), -100000000, "\"-100 Mio.\" parsed");
		assert.equal(oFormat.parse("-1 Mrd."), -1000000000, "\"-1 Mrd.\" parsed");
		assert.equal(oFormat.parse("-10 Mrd."), -10000000000, "\"-10 Mrd.\" parsed");
		assert.equal(oFormat.parse("-100 Mrd."), -100000000000, "\"-100 Mrd.\" parsed");
		assert.equal(oFormat.parse("-1 Bio."), -1000000000000, "\"-1 Bio.\" parsed");

		oFormat = NumberFormat.getFloatInstance({ style: "short", shortLimit: 10000, precision: 3 }, oLocale);

		assert.equal(oFormat.format(1), "1", "1 formatted");
		assert.equal(oFormat.format(12), "12", "12 formatted");
		assert.equal(oFormat.format(123), "123", "123 formatted");
		assert.equal(oFormat.format(999), "999", "999 formatted");
		assert.equal(oFormat.format(1234), "1.234", "1234 formatted");
		assert.equal(oFormat.format(9999), "9.999", "9999 formatted");
		assert.equal(oFormat.format(12345), "12.345", "12345 formatted");
		assert.equal(oFormat.format(99900), "99.900", "99900 formatted");
		assert.equal(oFormat.format(99990), "99.990", "99990 formatted");
		assert.equal(oFormat.format(99999), "99.999", "99999 formatted");
		assert.equal(oFormat.format(123456), "123.456", "123456 formatted");
		assert.equal(oFormat.format(999000), "999.000", "999000 formatted");
		assert.equal(oFormat.format(999900), "1\xa0Mio.", "999900 formatted");
		assert.equal(oFormat.format(999999), "1\xa0Mio.", "999999 formatted");
		assert.equal(oFormat.format(1234567), "1,23\xa0Mio.", "1234567 formatted");
		assert.equal(oFormat.format(9990000), "9,99\xa0Mio.", "9990000 formatted");
		assert.equal(oFormat.format(9999000), "10\xa0Mio.", "9999000 formatted");
		assert.equal(oFormat.format(9999999), "10\xa0Mio.", "9999999 formatted");
		assert.equal(oFormat.format(12345678), "12,3\xa0Mio.", "12345678 formatted");
		assert.equal(oFormat.format(99900000), "99,9\xa0Mio.", "99900000 formatted");
		assert.equal(oFormat.format(99990000), "100\xa0Mio.", "99990000 formatted");
		assert.equal(oFormat.format(99999999), "100\xa0Mio.", "99999999 formatted");
		assert.equal(oFormat.format(123456789), "123\xa0Mio.", "123456789 formatted");
		assert.equal(oFormat.format(999000000), "999\xa0Mio.", "999000000 formatted");
		assert.equal(oFormat.format(999900000), "1\xa0Mrd.", "999900000 formatted");
		assert.equal(oFormat.format(999999999), "1\xa0Mrd.", "999999999 formatted");
		assert.equal(oFormat.format(1234567890), "1,23\xa0Mrd.", "1234567890 formatted");
		assert.equal(oFormat.format(9990000000), "9,99\xa0Mrd.", "9990000000 formatted");
		assert.equal(oFormat.format(9999999999), "10\xa0Mrd.", "9999999999 formatted");
		assert.equal(oFormat.format(12345678901), "12,3\xa0Mrd.", "12345678901 formatted");
		assert.equal(oFormat.format(99900000000), "99,9\xa0Mrd.", "99900000000 formatted");
		assert.equal(oFormat.format(99999999999), "100\xa0Mrd.", "99999999999 formatted");
		assert.equal(oFormat.format(123456789012), "123\xa0Mrd.", "123456789012 formatted");
		assert.equal(oFormat.format(999000000000), "999\xa0Mrd.", "999000000000 formatted");
		assert.equal(oFormat.format(999999999999), "1\xa0Bio.", "999999999999 formatted");
		assert.equal(oFormat.format(1234567890123), "1,23\xa0Bio.", "1234567890123 formatted");

	});

	QUnit.test("float short style (non-prefix-free unit strings)", function (assert) {
		// this test checks number parsing when one unit is a prefix of another unit
		// (e.g Spanish 'mil' for thousands and 'mil M' for thousands of millions)
		var oLocaleSpanish = new Locale("es-ES");
		var oFormatSpanish = NumberFormat.getFloatInstance({
			style: "short", maxFractionDigits: 0
		}, oLocaleSpanish);

		assert.equal(oFormatSpanish.format(123000000000), "123\xa0mil\xa0M", "123000000000 formatted");
		assert.equal(oFormatSpanish.format(12000000000), "12\xa0mil\xa0M", "12000000000 formatted");
		assert.equal(oFormatSpanish.format(123000000), "123\xa0M", "123000000 formatted");
		assert.equal(oFormatSpanish.format(123000), "123\xa0mil", "123000 formatted");

		assert.equal(oFormatSpanish.parse("123 mil M"), 123000000000, "\"123 mil M\" parsed");
		assert.equal(oFormatSpanish.parse("12 mil M"), 12000000000, "\"12 mil M\" parsed");
		assert.equal(oFormatSpanish.parse("123 M"), 123000000, "\"123 M\" parsed");
		assert.equal(oFormatSpanish.parse("123 mil"), 123000, "\"123 mil\" parsed");
	});

	QUnit.test("float short style w/ decimals", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({
			style: "short",
			decimals: 2,
			shortDecimals: 1
		});

		assert.equal(oFormat.format(234.567), "234.57", "234.567 is formatted with 2 decimals");
		assert.equal(oFormat.format(3456.78), "3.5K", "3456.78 is formatted with 1 decimal");
		assert.equal(oFormat.format(234.5), "234.50", "234.5 is formatted with 2 decimals");
		assert.equal(oFormat.format(3000), "3.0K", "3000 is formatted with 1 decimal");
	});

	QUnit.test("float long style", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFormat = NumberFormat.getFloatInstance({
			style: "long", maxFractionDigits: 1
		}, oLocale);

		assert.equal(oFormat.format(1.2), "1,2", "1.2 formatted");
		assert.equal(oFormat.parse("1,2"), 1.2, "\"1,2\" parsed");
		assert.equal(oFormat.format(1234.5), "1,2 Tausend", "1234.5 formatted");
		assert.equal(oFormat.parse("1 Tausend"), 1000, "\"1 Tausend\" parsed");
		assert.equal(oFormat.parse("1,2 Tausend"), 1200, "\"1,2 Tausend\" parsed");


		oFormat = NumberFormat.getFloatInstance({
			style: "long", maxFractionDigits: 0
		}, oLocale);


		//german has "Million" and "Millionen". The first word is contained in the second.
		assert.equal(oFormat.format(1456789), "1 Million", "1 million formatted");
		assert.equal(oFormat.parse("1 Million"), 1000000, "1 million parsed");

		assert.equal(oFormat.format(123456789), "123 Millionen", "123 Millionen formatted");
		assert.equal(oFormat.parse("123 Millionen"), 123000000, "123 Millionen parsed");

		assert.equal(oFormat.format(123456789000), "123 Milliarden", "123 Milliarden formatted");
		assert.equal(oFormat.parse("123 Milliarden"), 123000000000, "123 Milliarden parsed");


		//Format should work '-10 mil millones' from number: -10000000000
		oFormat = NumberFormat.getFloatInstance({
			style: "long", maxFractionDigits: 0
		}, new Locale("es-ES"));

		//spanish has "mil milliones" and "milliones". The first word ends with the second.
		assert.equal(oFormat.format(10000000000), "10 mil millones", "10 mil millones formatted");
		assert.equal(oFormat.parse("10 mil millones"), 10000000000, "10 mil millones parsed");

		assert.equal(oFormat.format(10000000), "10 millones", "10 millones formatted");
		assert.equal(oFormat.parse("10 millones"), 10000000, "10 millones parsed");

		// other test similar to integer -> skip
	});

	QUnit.test("Float as number with preserveDecimals", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({preserveDecimals: true}, new Locale("en"));

		assert.equal(oFormat.format(123.456).toString(), "123.456", "unchanged");

		// decimals 2 (same as minFractionDigits: 2 and maxFractionDigits: 2):
		oFormat = NumberFormat.getFloatInstance({preserveDecimals: true, decimals: 2}, new Locale("en"));
		assert.equal(oFormat.format(123.456).toString(), "123.456", "decimals: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format(123.456789).toString(), "123.456789", "decimals: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format(123.45).toString(), "123.45", "decimals: Length should not change.");
		assert.equal(oFormat.format(123.4).toString(), "123.40", "decimals: Length should be filled up.");
		assert.equal(oFormat.format(123).toString(), "123.00", "decimals: Length should be filled up.");

		// fractionDigits:
		oFormat = NumberFormat.getFloatInstance({preserveDecimals: true, minFractionDigits: 1, maxFractionDigits: 3}, new Locale("en"));
		assert.equal(oFormat.format(123.456).toString(), "123.456", "fractionDigits: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format(123.456789).toString(), "123.456789", "fractionDigits: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format(123.45).toString(), "123.45", "fractionDigits: Length should not change.");
		assert.equal(oFormat.format(123.4).toString(), "123.4", "fractionDigits: Length should not change.");
		assert.equal(oFormat.format(123).toString(), "123.0", "fractionDigits: Length should be filled up.");

		// precision (sets the maximum fraction digits):
		oFormat = NumberFormat.getFloatInstance({preserveDecimals: true, precision: 5}, new Locale("en"));
		assert.equal(oFormat.format(123.456).toString(), "123.456", "precision: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format(123.456789).toString(), "123.456789", "precision: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format(123.45).toString(), "123.45", "precision: Length should not change.");
		assert.equal(oFormat.format(123.4).toString(), "123.4", "precision: Length should not change.");
		assert.equal(oFormat.format(123).toString(), "123", "precision: Length should not change.");
	});

	QUnit.test("Float as string with preserveDecimals=true", function (assert) {
		var oFormat = NumberFormat.getFloatInstance({preserveDecimals: true, parseAsString: true}, new Locale("en"));

		assert.equal(oFormat.format("123.456").toString(), "123.456", "unchanged");
		assert.equal(oFormat.format("123.40").toString(), "123.40", "unchanged");
		assert.equal(oFormat.format("123.0000000").toString(), "123.0000000", "unchanged");

		// decimals 2 (same as minFractionDigits: 2 and maxFractionDigits: 2):
		oFormat = NumberFormat.getFloatInstance({preserveDecimals: true, decimals: 2, parseAsString: true}, new Locale("en"));
		assert.equal(oFormat.format("123.456").toString(), "123.456", "decimals: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format("123.456789").toString(), "123.456789", "decimals: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format("123.45").toString(), "123.45", "decimals: Length should not change.");
		assert.equal(oFormat.format("123.4").toString(), "123.40", "decimals: Length should be filled up.");
		assert.equal(oFormat.format("123").toString(), "123.00", "decimals: Length should be filled up.");
		assert.equal(oFormat.format("123.0").toString(), "123.00", "decimals: Length should be filled up.");
		assert.equal(oFormat.format("123.000").toString(), "123.00", "Length changes because of preserveDecimals and trailing 0 decimals are cut off until maxFractionDigits.");
		assert.equal(oFormat.format("123.00000").toString(), "123.00", "Length changes because of preserveDecimals and trailing 0 decimals are cut off until maxFractionDigits.");

		// fractionDigits:
		oFormat = NumberFormat.getFloatInstance({preserveDecimals: true, minFractionDigits: 1, maxFractionDigits: 3, parseAsString: true}, new Locale("en"));
		assert.equal(oFormat.format("123.456").toString(), "123.456", "fractionDigits: Length should not change.");
		assert.equal(oFormat.format("123.456789").toString(), "123.456789", "fractionDigits: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format("123.45").toString(), "123.45", "fractionDigits: Length should not change.");
		assert.equal(oFormat.format("123.4").toString(), "123.4", "fractionDigits: Length should not change.");
		assert.equal(oFormat.format("123").toString(), "123.0", "fractionDigits: Length should be filled up.");
		assert.equal(oFormat.format("123.0").toString(), "123.0", "fractionDigits: Length should not change.");
		assert.equal(oFormat.format("123.0000").toString(), "123.000", "fractionDigits: Length changes because of preserveDecimals and trailing 0 decimals are cut off until maxFractionDigits.");
		assert.equal(oFormat.format("123.000000").toString(), "123.000", "Length changes because of preserveDecimals and trailing 0 decimals are cut off until maxFractionDigits.");


		// precision (sets the maximum fraction digits):
		oFormat = NumberFormat.getFloatInstance({preserveDecimals: true, precision: 5, parseAsString: true}, new Locale("en"));
		assert.equal(oFormat.format("123.456").toString(), "123.456", "precision: Length should not change because of preserveDecimals.");
		assert.equal(oFormat.format("123.456789").toString(), "123.456789", "precision: Length should not change because of preserveDecimals. ");
		assert.equal(oFormat.format("123.45").toString(), "123.45", "precision: Length should not change.");
		assert.equal(oFormat.format("123.4").toString(), "123.4", "precision: Length should not change.");
		assert.equal(oFormat.format("123").toString(), "123", "precision: Length should not change.");
		assert.equal(oFormat.format("123.0").toString(), "123.0", "precision: Length should not change.");
		assert.equal(oFormat.format("123.0000").toString(), "123.00", "precision: Length changes because of preserveDecimals and trailing 0 decimals are cut off until maxFractionDigits.");
	});


	QUnit.module("General");

	QUnit.test("origin info", function (assert) {
		sap.ui.getCore().getConfiguration().originInfo = true;
		var oOriginNumber = NumberFormat.getIntegerInstance(),
			sValue = oOriginNumber.format(123),
			oInfo = sValue.originInfo;
		assert.equal(oInfo.source, "Common Locale Data Repository", "Origin Info: source");
		assert.equal(oInfo.locale, "en-US", "Origin Info: locale");
	});

	QUnit.test("Private method NumberFormat._shiftDecimalPoint", function (assert) {
		var f = NumberFormat._shiftDecimalPoint;
		assert.equal(f("1234.567", 2), "123456.7", "1234.567 -> (2) = 123456.7");
		assert.equal(f("1234.567", 10), "12345670000000", "1234.567 -> (10) = 12345670000000");
		assert.equal(f("1234.567", -2), "12.34567", "1234.567 <- (2) = 12.34567");
		assert.equal(f("1234.567", -10), "0.0000001234567", "1234.567 <- (10) = 0.0000001234567");
		assert.equal(f("1234.567", 0), "1234.567", "1234.567 = 1234.567");
		assert.equal(f("1234.567", 3), "1234567", "1234.567 -> (3) = 1234567");
		assert.equal(f("1234.567", -4), "0.1234567", "1234.567 <- (4) = 0.1234567");
		assert.equal(f("1234.567", 5), "123456700", "1234.567 -> (5) = 123456700");
		assert.equal(f("0", 2), "0", "0 -> (2) = 0");
		assert.equal(f("1", 2), "100", "1 -> (2) = 100");
		assert.equal(f("0", -2), "0.00", "0 <- (2) = 0.00");
		assert.equal(f("1e79", -71), "100000000", "1e79 <- (71) = 100000000");
		assert.equal(f("1e-79", 71), "0.00000001", "1e-79 -> (71) = 0.00000001");
		assert.equal(f("-4e-1", 0), "-0.4", "-4e-1 -> = -0.4");
		assert.equal(f("-4e-2", 0), "-0.04", "-4e-2 -> = -0.04");
		assert.equal(f("-4e-3", 0), "-0.004", "-4e-3 -> = -0.004");
		assert.equal(f("-4e+1", 0), "-40", "-4e+1 -> = -40");
		assert.equal(f("-4e+2", 0), "-400", "-4e+2 -> = -400");
		assert.equal(f("-4e+3", 0), "-4000", "-4e+3 -> = -4000");
	});

	QUnit.test("Format option 'emptyString'", function (assert) {
		var aMethods = ["getIntegerInstance", "getFloatInstance", "getPercentInstance", "getCurrencyInstance"],
			aValues = [NaN, null, 0],
			aCompareValues = [["NaN", null, "0"], [NaN, null, 0]],
			aParseAsString = [true, false];

		aMethods.forEach(function (sMethod, index) {
			assert.ok(NumberFormat[sMethod](), "instantiation with empty options should succeed");
			aValues.forEach(function (nValue, index1) {
				aParseAsString.forEach(function (bParseAsString, index2) {
					var oFormatOptions = {
						emptyString: nValue,
						parseAsString: bParseAsString
					},
						oFormat = NumberFormat[sMethod](oFormatOptions),
						nCompareValue = aCompareValues[index2][index1],
						nParsed,
						aParsed;

					// format
					assert.strictEqual(oFormat.format(nValue), "", nValue + " is formatted to empty string");

					// parse
					if (sMethod === "getCurrencyInstance") {
						aParsed = oFormat.parse("");
						nParsed = aParsed[0];
						assert.strictEqual(aParsed[1], undefined, "currency code is parse as undefined");
					} else {
						nParsed = oFormat.parse("");
					}

					if (nParsed !== nParsed) { // eslint-disable-line no-self-compare
						assert.ok(nCompareValue !== nCompareValue, "empty string is parsed as NaN"); // eslint-disable-line no-self-compare
					} else {
						assert.strictEqual(nParsed, nCompareValue, "empty string is parsed as " + aCompareValues[index2][index1]);
					}
				});
			});
		});
	});

	QUnit.test("Percent format with custom pattern", function (assert) {
		var oLocale = new Locale("tr-TR");

		// no custom pattern
		var oFormat = NumberFormat.getPercentInstance(oLocale);

		assert.equal(oFormat.format(.1234567), "%12,34567", ".1234567");
		assert.equal(oFormat.parse("%12,34567"), 0.1234567, "%12,34567");
		assert.deepEqual(oFormat.parse("12,34567%"), NaN, "12,34567%");

		// custom pattern
		oFormat = NumberFormat.getPercentInstance({
			pattern: "%#####.#####"
		}, oLocale);

		assert.equal(oFormat.format(.1234567), "%12,34567", ".1234567");
		assert.equal(oFormat.parse("%12,34567"), 0.1234567, "%12,34567");
		assert.deepEqual(oFormat.parse("12,34567%"), NaN, "12,34567%");

		//change pattern such that percent symbol is at the end
		oFormat = NumberFormat.getPercentInstance({
			pattern: "#,##0%"
		}, oLocale);

		assert.equal(oFormat.format(12), "1.200%", "12");
		assert.equal(oFormat.format(12.34), "1.234%", "12.34");
		assert.equal(oFormat.format(.1234567), "12%", ".1234567");
		assert.equal(oFormat.format(-.1234567), "-12%", "-.1234567");
		assert.equal(oFormat.format(.1234), "12%", ".1234");

		assert.equal(oFormat.parse("1.200%"), 12, "1.200%");
		assert.equal(oFormat.parse("1.234%"), 12.34, "1.234%");
		assert.deepEqual(oFormat.parse("%1.200"), NaN, "NaN because does not match pattern '#,##0%'");
		assert.deepEqual(oFormat.parse("%12.345%"), NaN, "NaN because does not match pattern '#,##0%'");
	});

	QUnit.test("Float with percentage symbol", function (assert) {
		var oLocale = new Locale("en");
		var oFormat = NumberFormat.getInstance(oLocale);

		assert.equal(oFormat.format(52.3, "%").toString(), "52.3", "52.3%");
		assert.deepEqual(oFormat.parse("52.3%"), 0.523, "treated as percent");

		assert.equal(oFormat.format(52.3, "xsd").toString(), "52.3", "xsd 52.30");
		assert.deepEqual(oFormat.parse("52.3xsd"), NaN, "'xsd' cannot be parsed as number");
	});

	QUnit.module("Grouping Separator");

	QUnit.test("Integer with groupingEnabled=true (de-DE)", function (assert) {
		var oLocale = new Locale("de-DE");
		var oIntegerFormat = NumberFormat.getIntegerInstance({groupingEnabled: true}, oLocale);

		// format
		assert.deepEqual(oIntegerFormat.format(1234), "1.234", "Format to '1.234'");

		// valid numbers
		assert.deepEqual(oIntegerFormat.parse("1.234"), 1234, "Parse '1.234'");
		assert.deepEqual(oIntegerFormat.parse("1.234.567"), 1234567, "Parse '1.234.567'");

		// spacing/plus sign
		assert.deepEqual(oIntegerFormat.parse("1. 234"), 1234, "Parse '1. 234'");
		assert.deepEqual(oIntegerFormat.parse("1 .234"), 1234, "Parse '1 .234'");
		assert.deepEqual(oIntegerFormat.parse("+1 .234"), 1234, "Parse '+1 .234'");
		assert.deepEqual(oIntegerFormat.parse("+1.234"), 1234, "Parse '+1.234'");

		// scientific notation
		assert.deepEqual(oIntegerFormat.parse("1.234e+0"), 1234, "parse 1.234e+0");
		assert.deepEqual(oIntegerFormat.parse("1.234e+1"), 12340, "parse 1.234e+1");
		assert.deepEqual(oIntegerFormat.parse("1234e+0"), 1234, "parse 1234e+0");
		assert.deepEqual(oIntegerFormat.parse("1234e+1"), 12340, "parse 1234e+1");

		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.deepEqual(oIntegerFormat.parse("1.23.456"), 123456, "Parse '1.23.456'");
		assert.deepEqual(oIntegerFormat.parse("1.23.45"), 12345, "Parse '1.23.45'");
		assert.deepEqual(oIntegerFormat.parse("1.234.56"), 123456, "Parse '1.234.56'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oIntegerFormat.parse("1.23"), NaN, "Parse '1.23'");
		assert.deepEqual(oIntegerFormat.parse("1.2345"), NaN, "Parse '1.2345'");

		// invalid, because integer contains decimal separator
		assert.deepEqual(oIntegerFormat.parse("1,234"), NaN, "Parse '1,234'");
		assert.deepEqual(oIntegerFormat.parse("1.234,567"), NaN, "Parse '1.234,567'");
		assert.deepEqual(oIntegerFormat.parse("1.23,45"), NaN, "Parse '1.23,45'");
		assert.deepEqual(oIntegerFormat.parse("1.23.45,67"), NaN, "Parse '1.23.45,67'");
		assert.deepEqual(oIntegerFormat.parse("1.23.456,78"), NaN, "Parse '1.23.456,78'");
		assert.deepEqual(oIntegerFormat.parse("1.234.56,78"), NaN, "Parse '1.234.56,78'");
		assert.deepEqual(oIntegerFormat.parse("1.2345,67"), NaN, "Parse '1.2345,67'");
	});

	QUnit.test("Integer with groupingEnabled=true and style=long (de-DE)", function (assert) {
		var oLocale = new Locale("de-DE");
		var oIntegerFormat = NumberFormat.getIntegerInstance({groupingEnabled: true, style: "long"}, oLocale);

		// format
		assert.deepEqual(oIntegerFormat.format(1200), "1,2 Tausend", "Format to '1,2 Tausend'");
		assert.deepEqual(oIntegerFormat.format(1200000), "1,2 Millionen", "Format to '1,2 Millionen'");

		// valid numbers
		assert.deepEqual(oIntegerFormat.parse("+1,2 Tausend"), 1200, "Parse '+1,2 Tausend'");
		assert.deepEqual(oIntegerFormat.parse("1234 Tausend"), 1234000, "Parse '1234 Tausend'");

		assert.deepEqual(oIntegerFormat.parse("1.234 Tausend"), 1234000, "Parse '1.234 Tausend'");
		assert.deepEqual(oIntegerFormat.parse("+1.234 Tausend"), 1234000, "Parse '+1.234 Tausend'");
		assert.deepEqual(oIntegerFormat.parse("1. 234 Tausend"), 1234000, "Parse '1. 234 Tausend'");
		assert.deepEqual(oIntegerFormat.parse("1 .234 Tausend"), 1234000, "Parse '1 .234 Tausend'");
		assert.deepEqual(oIntegerFormat.parse("+1 .234 Tausend"), 1234000, "Parse '+1 .234 Tausend'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oIntegerFormat.parse("1.2 Tausend"), NaN, "Parse '1.2 Tausend'");
		assert.deepEqual(oIntegerFormat.parse("1.23 Tausend"), NaN, "Parse '1.23 Tausend'");
	});

	QUnit.test("Integer with groupingEnabled=true and parseAsString=true (de-DE)", function (assert) {
		var oLocale = new Locale("de-DE");
		var oIntegerFormat = NumberFormat.getIntegerInstance({groupingEnabled: true, parseAsString: true}, oLocale);

		// format
		assert.deepEqual(oIntegerFormat.format(-12345), "-12.345", "Format to '-12.345'");

		// valid numbers
		assert.deepEqual(oIntegerFormat.parse("-01"),"-1", "can parse -01");
		assert.deepEqual(oIntegerFormat.parse("01"), "1", "can parse 01");

		// leading zeros
		assert.deepEqual(oIntegerFormat.parse("00012.345"), "12345", "can parse 00012.345");
		assert.deepEqual(oIntegerFormat.parse("-00012.345"), "-12345", "can parse -00012.345");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oIntegerFormat.parse("1.23"), NaN, "Parse '1.23'");
		assert.deepEqual(oIntegerFormat.parse("1.2345"), NaN, "Parse '1.2345'");
	});

	QUnit.test("Percent (de-DE)", function (assert) {
		var oLocale = new Locale("de-DE");
		var oPercentInstance = NumberFormat.getPercentInstance(oLocale);

		// format
		assert.deepEqual(oPercentInstance.format(0.01), "1\xa0%", "Format to 1\xa0%");
		assert.deepEqual(oPercentInstance.format(1234), "123.400\xa0%", "Format to 1.234\xa0%");
		assert.deepEqual(oPercentInstance.format(-12345.6789), "-1.234.567,89\xa0%", "Format to -12.345,67");

		// valid numbers
		assert.deepEqual(oPercentInstance.parse("1\xa0%"), 0.01, "can parse 1\xa0%");
		assert.deepEqual(oPercentInstance.parse("1.234\xa0%"), 12.34, "Parse '1.234\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.234.567\xa0%"), 12345.67, "Parse '1.234.567\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.234,56\xa0%"), 12.3456, "Parse '1.234,56\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.234.567,89\xa0%"), 12345.6789, "Parse '1.234.567,89\xa0%'");

		// spacing/plus sign
		assert.deepEqual(oPercentInstance.parse("1.234 %"), 12.34, "Parse '1.234 %'");
		assert.deepEqual(oPercentInstance.parse("1.234%"), 12.34, "Parse '1.234%'");
		assert.deepEqual(oPercentInstance.parse("1. 234\xa0%"), 12.34, "Parse '1. 234\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1 .234\xa0%"), 12.34, "Parse '1 .234\xa0%'");
		assert.deepEqual(oPercentInstance.parse("+1 .234\xa0%"), 12.34, "Parse '+1 .234\xa0%'");
		assert.deepEqual(oPercentInstance.parse("+1.234\xa0%"), 12.34, "Parse '+1.234\xa0%'");
		assert.deepEqual(oPercentInstance.parse("+1.234,56\xa0%"), 12.3456, "Parse '+1.234,56\xa0%'");

		// scientific
		assert.deepEqual(oPercentInstance.parse("1.234e+0\xa0%"), 12.34, "parse 1.234e+0");
		assert.deepEqual(oPercentInstance.parse("1.234e+1\xa0%"), 123.40, "parse 1.234e+1");
		assert.deepEqual(oPercentInstance.parse("1234e+0\xa0%"), 12.34, "parse 1234e+0");
		assert.deepEqual(oPercentInstance.parse("1234e+1\xa0%"), 123.40, "parse 1234e+1");
		assert.deepEqual(oPercentInstance.parse("1.234,56e+0\xa0%"), 12.3456, "parse 1.234,56e+0");
		assert.deepEqual(oPercentInstance.parse("1.234,56e+1\xa0%"), 123.456, "parse 1.234,56e+1");

		// leading zeros
		assert.deepEqual(oPercentInstance.parse("-01\xa0%"), -0.01, "can parse -01");
		assert.deepEqual(oPercentInstance.parse("01\xa0%"), 0.01, "can parse 01");
		assert.deepEqual(oPercentInstance.parse("-01,2\xa0%"),-0.012, "can parse -01,2");
		assert.deepEqual(oPercentInstance.parse("01,2\xa0%"), 0.012, "can parse 01,2");
		assert.deepEqual(oPercentInstance.parse("-00010001,2\xa0%"), -100.012, "can parse -000001,2");
		assert.deepEqual(oPercentInstance.parse("00010001,2\xa0%"), 100.012, "can parse 000001,2");
		assert.deepEqual(oPercentInstance.parse("00012.345,67\xa0%"), 123.4567, "can parse with leading zeros");
		assert.deepEqual(oPercentInstance.parse("-00012.345,67\xa0%"), -123.4567, "can parse with leading zeros");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oPercentInstance.parse("1.23\xa0%"), NaN, "Parse '1.23\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.2345\xa0%"), NaN, "Parse '1.2345\xa0%'");

		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.deepEqual(oPercentInstance.parse("1.23.45\xa0%"), 123.45, "Parse '1.23.45\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.23.456\xa0%"), 1234.56, "Parse '1.23.456\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.234.56\xa0%"), 1234.56, "Parse '1.234.56\xa0%'");

		// tolerated, despite wrong grouping, because decimal separator is present
		assert.deepEqual(oPercentInstance.parse("1.23,45\xa0%"), 1.2345, "Parse '1.23,45\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.23.45,67\xa0%"), 123.4567, "Parse '1.23.45,67\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.23.456,78\xa0%"), 1234.5678, "Parse '1.23.456,78\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.234.56,78\xa0%"), 1234.5678, "Parse '1.234.56,78\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.2345,67\xa0%"), 123.4567, "Parse '1.2345,67\xa0%'");

		// invalid mix of decimal and grouping separators
		assert.deepEqual(oPercentInstance.parse("5,001.234,56\xa0%"), NaN, "Parse '5,001.234,56\xa0%'");

		// invalid reversal of decimal and grouping separator
		assert.deepEqual(oPercentInstance.parse("5,001.234\xa0%"), NaN, "Parse '5,001.234\xa0%'");
	});

	QUnit.test("Percent with style=long (de-DE)", function (assert) {
		var oLocale = new Locale("de-DE");
		var oPercentInstance = NumberFormat.getPercentInstance({style: "long"}, oLocale);

		// format
		assert.deepEqual(oPercentInstance.format(12000), "1.200 Tausend\xa0%", "Format to 1,2 Tausend");
		assert.deepEqual(oPercentInstance.format(12000000), "1.200 Millionen\xa0%", "Format to 1,2 Millionen");

		// valid numbers
		assert.deepEqual(oPercentInstance.parse("1.234 Tausend\xa0%"), 12340, "Parse '1.234 Tausend\xa0%'");
		assert.deepEqual(oPercentInstance.parse("+1,2 Tausend\xa0%"), 12, "Parse '+1,2 Tausend\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1234 Tausend\xa0%"), 12340, "Parse '1234 Tausend\xa0%'");

		// spacing/plus sign
		assert.deepEqual(oPercentInstance.parse("1. 234 Tausend\xa0%"), 12340, "Parse '1. 234 Tausend\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1 .234 Tausend\xa0%"), 12340, "Parse '1 .234 Tausend\xa0%'");
		assert.deepEqual(oPercentInstance.parse("+1 .234 Tausend\xa0%"), 12340, "Parse '+1 .234 Tausend\xa0%'");
		assert.deepEqual(oPercentInstance.parse("+1.234 Tausend\xa0%"), 12340, "Parse '+1.234 Tausend\xa0%'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oPercentInstance.parse("1.2 Tausend\xa0%"), NaN, "Parse '1.2 Tausend\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.23 Tausend\xa0%"), NaN, "Parse '1.23 Tausend\xa0%'");
		assert.deepEqual(oPercentInstance.parse("1.2345 Tausend\xa0%"), NaN, "Parse '1.2345 Tausend\xa0%'");
	});

	QUnit.test("Float (de-DE)", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFloatFormat = NumberFormat.getFloatInstance(oLocale);

		// format
		assert.deepEqual(oFloatFormat.format(1234), "1.234", "Format to '1.234'");

		// valid numbers
		assert.deepEqual(oFloatFormat.parse("0"), 0, "Parse '0'");
		assert.deepEqual(oFloatFormat.parse("0,3"), 0.3, "Parse '0,3'");
		assert.deepEqual(oFloatFormat.parse("0,34"), 0.34, "Parse '0,34'");
		assert.deepEqual(oFloatFormat.parse("0,345"), 0.345, "Parse '0,345'");
		assert.deepEqual(oFloatFormat.parse("-0,345"), -0.345, "Parse '-0,345'");
		assert.deepEqual(oFloatFormat.parse(",345"), 0.345, "Parse ',345'");
		assert.deepEqual(oFloatFormat.parse("-,345"), -0.345, "Parse '-,345'");

		assert.deepEqual(oFloatFormat.parse("1.234"), 1234, "Parse '1.234'");
		assert.deepEqual(oFloatFormat.parse("-234.567"), -234567, "Parse '-234.567'");
		assert.deepEqual(oFloatFormat.parse("234.567"), 234567, "Parse '234.567'");
		assert.deepEqual(oFloatFormat.parse("00234.567"), 234567, "Parse '00234.567'");
		assert.deepEqual(oFloatFormat.parse("1.234.567"), 1234567, "Parse '1.234.567'");
		assert.deepEqual(oFloatFormat.parse("1.234,56"), 1234.56, "Parse '1.234,56'");
		assert.deepEqual(oFloatFormat.parse("1.234.567,89"), 1234567.89, "Parse '1.234.567,89'");
		assert.deepEqual(oFloatFormat.parse("1.234.567.891"), 1234567891, "Parse '1.234.567.891'");

		// tolerated, despite incomplete grouping, because decimal separator is present
		assert.deepEqual(oFloatFormat.parse("1.234567,89"), 1234567.89, "Parse '1.234567,89'");
		assert.deepEqual(oFloatFormat.parse("1234.567,89"), 1234567.89, "Parse '1234.567,89'");
		assert.deepEqual(oFloatFormat.parse("1.337 234.567,89"), 1337234567.89, "Parse '1.337 234.567,89'");
		assert.deepEqual(oFloatFormat.parse("12.345 671 337,89"), 12345671337.89, "Parse '12.345 671 337,89'");
		assert.deepEqual(oFloatFormat.parse("12345.671337,89"), 12345671337.89, "Parse '12345.671337,89'");

		// spacing/plus sign
		assert.deepEqual(oFloatFormat.parse("1. 234"), 1234, "Parse '1. 234'");
		assert.deepEqual(oFloatFormat.parse("1 .234"), 1234, "Parse '1 .234'");
		assert.deepEqual(oFloatFormat.parse("+1 .234"), 1234, "Parse '+1 .234'");
		assert.deepEqual(oFloatFormat.parse("+1.234"), 1234, "Parse '+1.234'");
		assert.deepEqual(oFloatFormat.parse("+1.234,56"), 1234.56, "Parse '+1.234,56'");

		// scientific
		assert.deepEqual(oFloatFormat.parse("1.234e+0"), 1234, "parse 1.234e+0");
		assert.deepEqual(oFloatFormat.parse("1.234e+1"), 12340, "parse 1.234e+1");
		assert.deepEqual(oFloatFormat.parse("1234e+0"), 1234, "parse 1234e+0");
		assert.deepEqual(oFloatFormat.parse("1234e+1"), 12340, "parse 1234e+1");
		assert.deepEqual(oFloatFormat.parse("1.234,56e+0"), 1234.56, "parse 1.234,56e+0");
		assert.deepEqual(oFloatFormat.parse("1.234,56e+1"), 12345.6, "parse 1.234,56e+1");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oFloatFormat.parse("1.23"), NaN, "Parse '1.23'");
		assert.deepEqual(oFloatFormat.parse("1.2345"), NaN, "Parse '1.2345'");

		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.deepEqual(oFloatFormat.parse("1.23.45"), 12345, "Parse '1.23.45'");
		assert.deepEqual(oFloatFormat.parse("1.23.456"), 123456, "Parse '1.23.456'");
		assert.deepEqual(oFloatFormat.parse("1.234.56"), 123456, "Parse '1.234.56'");
		assert.deepEqual(oFloatFormat.parse("1.2.3.4"), 1234, "Parse '1.2.3.4'");
		assert.deepEqual(oFloatFormat.parse("1.2.3"), 123, "Parse '1.2.3'");

		// expectation 1.234.567.891
		assert.deepEqual(oFloatFormat.parse("12.34.56.7.891"), 1234567891, "Parse '12.34.56.7.891'");
		assert.deepEqual(oFloatFormat.parse("1234.56.7.891"), 1234567891, "Parse '1234.56.7.891'");
		assert.deepEqual(oFloatFormat.parse("1.23.4.567.891"), 1234567891, "Parse '1.23.4.567.891'");
		assert.deepEqual(oFloatFormat.parse("1 234.567 89.1"), 1234567891, "Parse '1 234.567 89.1'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oFloatFormat.parse("1 23.4567 891"), NaN, "Parse '1 23.4567 891'");
		assert.deepEqual(oFloatFormat.parse("1 2.34567 891"), NaN, "Parse '1 2.34567 891'");
		assert.deepEqual(oFloatFormat.parse("1 23456.7 891"), NaN, "Parse '1 23456.7 891'");

		// tolerated, despite wrong grouping
		assert.deepEqual(oFloatFormat.parse("1.23,45"), 123.45, "Parse '1.23,45'");
		assert.deepEqual(oFloatFormat.parse("1.23.45,67"), 12345.67, "Parse '1.23.45,67'");
		assert.deepEqual(oFloatFormat.parse("1.23.456,78"), 123456.78, "Parse '1.23.456,78'");
		assert.deepEqual(oFloatFormat.parse("1.234.56,78"), 123456.78, "Parse '1.234.56,78'");
		assert.deepEqual(oFloatFormat.parse("1.2345,67"), 12345.67, "Parse '1.2345,67'");

		// invalid mix of decimal and grouping separators
		assert.deepEqual(oFloatFormat.parse("5,001.234,56"), NaN, "Parse '5,001.234,56'");

		// invalid reversal of decimal and grouping separator
		assert.deepEqual(oFloatFormat.parse("5,001.234"), NaN, "Parse '5,001.234'");

		// special case
		// One grouping separator is present, at least one is missing and no decimal separator is present.
		assert.deepEqual(oFloatFormat.parse("1234.567"), 1234567, "Parse '1234.567'");
		assert.deepEqual(oFloatFormat.parse("-.234.567"), NaN, "Parse '-.234.567'");
		assert.deepEqual(oFloatFormat.parse("1234234.567"), 1234234567, "Parse '1234234.567'");
		assert.deepEqual(oFloatFormat.parse("1234.234567"), NaN, "Parse '1234.234567'");
		assert.deepEqual(oFloatFormat.parse("1.234234567"), NaN, "Parse '1.234234567'");

		// leading zeros
		assert.deepEqual(oFloatFormat.parse(".345"), NaN, "Parse '.345'");
		assert.deepEqual(oFloatFormat.parse("-.345"), NaN, "Parse '-.345'");
		assert.deepEqual(oFloatFormat.parse("0.345"), NaN, "Parse '0.345'");
		assert.deepEqual(oFloatFormat.parse("-0.345"), NaN, "Parse '-0.345'");
	});

	QUnit.test("Float groupingEnabled=false (de-DE)", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFloatFormat = NumberFormat.getFloatInstance({groupingEnabled: false}, oLocale);

		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.deepEqual(oFloatFormat.parse("1.2.3"), 123, "Parse '1.2.3'");
	});

	QUnit.test("Float with style=long (de-DE)", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFloatFormat = NumberFormat.getFloatInstance({style: "long"}, oLocale);

		// format
		assert.deepEqual(oFloatFormat.format(1200), "1,2 Tausend", "Format to '1,2 Tausend'");
		assert.deepEqual(oFloatFormat.format(1200000), "1,2 Millionen", "Format to '1,2 Millionen'");

		// valid numbers
		assert.deepEqual(oFloatFormat.parse("1234 Tausend"), 1234000, "Parse '1234 Tausend'");

		// spacing/plus sign
		assert.deepEqual(oFloatFormat.parse("+1,2 Tausend"), 1200, "Parse '+1,2 Tausend'");
		assert.deepEqual(oFloatFormat.parse("1.234 Tausend"), 1234000, "Parse '1.234 Tausend'");
		assert.deepEqual(oFloatFormat.parse("+1.234 Tausend"), 1234000, "Parse '+1.234 Tausend'");
		assert.deepEqual(oFloatFormat.parse("1. 234 Tausend"), 1234000, "Parse '1. 234 Tausend'");
		assert.deepEqual(oFloatFormat.parse("1 .234 Tausend"), 1234000, "Parse '1 .234 Tausend'");
		assert.deepEqual(oFloatFormat.parse("+1 .234 Tausend"), 1234000, "Parse '+1 .234 Tausend'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oFloatFormat.parse("1.2 Tausend"), NaN, "Parse '1.2 Tausend'");
		assert.deepEqual(oFloatFormat.parse("1.23 Tausend"), NaN, "Parse '1.23 Tausend'");
		assert.deepEqual(oFloatFormat.parse("1.2345 Tausend"), NaN, "Parse '1.2345 Tausend'");
	});

	QUnit.test("Float with parseAsString=true (de-DE)", function (assert) {
		var oLocale = new Locale("de-DE");
		var oFloatFormat = NumberFormat.getFloatInstance({parseAsString: true}, oLocale);
		// format
		assert.deepEqual(oFloatFormat.format(-12345.67), "-12.345,67", "Format to '-12.345,67'");

		// leading zeros
		assert.deepEqual(oFloatFormat.parse("-01"),"-1", "can parse -01");
		assert.deepEqual(oFloatFormat.parse("01"), "1", "can parse 01");
		assert.deepEqual(oFloatFormat.parse("-01,2"),"-1.2", "can parse -01,2");
		assert.deepEqual(oFloatFormat.parse("01,2"), "1.2", "can parse 01,2");
		assert.deepEqual(oFloatFormat.parse("-00010001,2"),"-10001.2", "can parse -000001,2");
		assert.deepEqual(oFloatFormat.parse("00010001,2"), "10001.2", "can parse 000001,2");
		assert.deepEqual(oFloatFormat.parse("00012.345,67"), "12345.67", "can parse '00012.345,67'");
		assert.deepEqual(oFloatFormat.parse("-00012.345,67"), "-12345.67", "can parse -00012,345.67");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oFloatFormat.parse("-01.2"), NaN, "Parse '-01.2'");
		assert.deepEqual(oFloatFormat.parse("-01.23"), NaN, "Parse '-01.23'");
		assert.deepEqual(oFloatFormat.parse("-01.2345"), NaN, "Parse '-01.2345'");
	});

	QUnit.test("Float (en-GB)", function (assert) {
		var oLocale = new Locale("en-GB");
		var oFloatFormat = NumberFormat.getFloatInstance(oLocale);

		// format
		assert.deepEqual(oFloatFormat.format(1234), "1,234", "Format to '1,234'");

		// valid numbers
		assert.deepEqual(oFloatFormat.parse("1,234"), 1234, "Parse '1,234'");
		assert.deepEqual(oFloatFormat.parse("1,234,567"), 1234567, "Parse '1,234,567'");
		assert.deepEqual(oFloatFormat.parse("1,234.56"), 1234.56, "Parse '1,234.56'");
		assert.deepEqual(oFloatFormat.parse("1,234,567.89"), 1234567.89, "Parse '1,234,567.89'");

		// scientific
		assert.deepEqual(oFloatFormat.parse("1,234e+0"), 1234, "parse 1.234e+0");
		assert.deepEqual(oFloatFormat.parse("1,234e+1"), 12340, "parse 1.234e+1");
		assert.deepEqual(oFloatFormat.parse("1234e+0"), 1234, "parse 1234e+0");
		assert.deepEqual(oFloatFormat.parse("1234e+1"), 12340, "parse 1234e+1");
		assert.deepEqual(oFloatFormat.parse("1,234.56e+0"), 1234.56, "parse 1.234,56e+0");
		assert.deepEqual(oFloatFormat.parse("1,234.56e+1"), 12345.6, "parse 1.234,56e+1");
		assert.deepEqual(oFloatFormat.parse("1234E+1"), 12340, "parse 1234E+1");
		assert.deepEqual(oFloatFormat.parse("1,234E+0"), 1234, "parse 1.234E+0");
		assert.deepEqual(oFloatFormat.parse("1,234.56E+0"), 1234.56, "parse 1.234,56E+0");
		assert.deepEqual(oFloatFormat.parse("1,234.56E+1"), 12345.6, "parse 1.234,56E+1");

		// spacing/plus sign
		assert.deepEqual(oFloatFormat.parse("1, 234"), 1234, "Parse '1, 234'");
		assert.deepEqual(oFloatFormat.parse("1 ,234"), 1234, "Parse '1 ,234'");
		assert.deepEqual(oFloatFormat.parse("+1 ,234"), 1234, "Parse '+1 ,234'");
		assert.deepEqual(oFloatFormat.parse("+1,234"), 1234, "Parse '+1,234'");
		assert.deepEqual(oFloatFormat.parse("+1,234.56"), 1234.56, "Parse '+1,234.56'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oFloatFormat.parse("1,23"), NaN, "Parse '1,23'");
		assert.deepEqual(oFloatFormat.parse("1,2345"), NaN, "Parse '1,2345'");

		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.deepEqual(oFloatFormat.parse("1,23,45"), 12345, "Parse '1,23,45'");
		assert.deepEqual(oFloatFormat.parse("1,23,456"), 123456, "Parse '1,23,456'");
		assert.deepEqual(oFloatFormat.parse("1,234,56"), 123456, "Parse '1,234,56'");

		// tolerated, despite wrong grouping, because decimal separator is present
		assert.deepEqual(oFloatFormat.parse("1,23.45"), 123.45, "Parse '1,23.45'");
		assert.deepEqual(oFloatFormat.parse("1,23,45.67"), 12345.67, "Parse '1,23,45.67'");
		assert.deepEqual(oFloatFormat.parse("1,23,456.78"), 123456.78, "Parse '1,23,456.78'");
		assert.deepEqual(oFloatFormat.parse("1,234,56.78"), 123456.78, "Parse '1,234,56.78'");
		assert.deepEqual(oFloatFormat.parse("1,2345.67"), 12345.67, "Parse '1,2345.67'");

		// invalid mix of decimal and grouping separators
		assert.deepEqual(oFloatFormat.parse("5.001,234.56"), NaN, "Parse '5.001,234.56'");

		// invalid reversal of decimal and grouping separator
		assert.deepEqual(oFloatFormat.parse("5.001,234"), NaN, "Parse '5.001,234'");
	});

	QUnit.test("Float with style=long (en-GB)", function (assert) {
		var oLocale = new Locale("en-GB");
		var oFloatFormat = NumberFormat.getFloatInstance({style: "long"}, oLocale);

		// format with style long, to see how the default formatted string looks like which serves as input for parse
		// note that, unless the maximum unit is used, it is not possible to have a formatted string containing grouping separators.
		assert.deepEqual(oFloatFormat.format(1200), "1.2 thousand", "Format to '1.2 thousand'");
		assert.deepEqual(oFloatFormat.format(1200000), "1.2 million", "Format to '1.2 million'");
		assert.deepEqual(oFloatFormat.format(1.2e+12), "1.2 trillion", "Format to '1.2 trillion'");
		assert.deepEqual(oFloatFormat.format(1200e+12), "1,200 trillion", "Format to '1,200 trillion'");

		// valid numbers
		assert.deepEqual(oFloatFormat.parse("1,200 trillion"), 1200e+12, "Parse '1,200 trillion'");
		assert.deepEqual(oFloatFormat.parse("1,234 trillion"), 1234e+12, "Parse '1,234 trillion'");
		assert.deepEqual(oFloatFormat.parse("1234 trillion"), 1234e+12, "Parse '1234 trillion'");

		// spacing/plus sign
		assert.deepEqual(oFloatFormat.parse("1, 234 trillion"), 1234e+12, "Parse '1, 234 trillion'");
		assert.deepEqual(oFloatFormat.parse("1 ,234 trillion"), 1234e+12, "Parse '1 ,234 trillion'");
		assert.deepEqual(oFloatFormat.parse("+1 ,234 trillion"), 1234e+12, "Parse '+1 ,234 trillion'");
		assert.deepEqual(oFloatFormat.parse("+1,234 trillion"), 1234e+12, "Parse '+1,234 trillion'");
		assert.deepEqual(oFloatFormat.parse("+1.2 trillion"), 1.2e+12, "Parse '+1.2 trillion'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oFloatFormat.parse("1,2 trillion"), NaN, "Parse '1,2 trillion'");
		assert.deepEqual(oFloatFormat.parse("1,23 trillion"), NaN, "Parse '1,23 trillion'");
		assert.deepEqual(oFloatFormat.parse("1,2345 trillion"), NaN, "Parse '1,2345 trillion'");
	});

	QUnit.test("Float with parseAsString=true (en-GB)", function (assert) {
		var oLocale = new Locale("en-GB");
		var oFloatFormat = NumberFormat.getFloatInstance({parseAsString: true}, oLocale);

		// format
		assert.deepEqual(oFloatFormat.format(-12345.67), "-12,345.67", "Format to '-12,345.67'");

		// leading zeros
		assert.deepEqual(oFloatFormat.parse("-01"),"-1", "can parse -01");
		assert.deepEqual(oFloatFormat.parse("01"), "1", "can parse 01");
		assert.deepEqual(oFloatFormat.parse("-01.2"),"-1.2", "can parse -01,2");
		assert.deepEqual(oFloatFormat.parse("01.2"), "1.2", "can parse 01,2");
		assert.deepEqual(oFloatFormat.parse("-00010001.2"),"-10001.2", "can parse -000001,2");
		assert.deepEqual(oFloatFormat.parse("00010001.2"), "10001.2", "can parse 000001,2");
		assert.deepEqual(oFloatFormat.parse("00012,345.67"), "12345.67", "can parse '00012,345.67'");
		assert.deepEqual(oFloatFormat.parse("-00012,345.67"), "-12345.67", "can parse '-00012,345.67'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oFloatFormat.parse("-01,2"), NaN, "Parse '-01,2'");
		assert.deepEqual(oFloatFormat.parse("-01,23"), NaN, "Parse '-01,23'");
		assert.deepEqual(oFloatFormat.parse("-01,2345"), NaN, "Parse '-01,2345'");
	});

	QUnit.test("Special cases Float", function (assert) {
		var oFloatFormat = NumberFormat.getFloatInstance(new Locale("de-DE"));
		assert.deepEqual(oFloatFormat.parse("1.234.567"), 1234567, "Parse '1.234.567'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oFloatFormat.parse("1234.567"), 1234567, "Parse '1234.567'");

		// invalid syntax
		assert.deepEqual(oFloatFormat.parse("123,456,789.21"), NaN, "Parse '123,456,789.21'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oFloatFormat.parse("1111.111"), 1111111, "Parse '1111.111'");
		assert.deepEqual(oFloatFormat.parse("111.111"), 111111, "Parse '111.111'");

		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.deepEqual(oFloatFormat.parse("1.."), 1, "Parse '1..'");
		assert.deepEqual(oFloatFormat.parse("1..2"), 12, "Parse '1..2'");
		assert.deepEqual(oFloatFormat.parse("1..2.."), 12, "Parse '1..2..'");
		assert.deepEqual(oFloatFormat.parse("1..2..3"), 123, "Parse '1..2..3'");
		assert.deepEqual(oFloatFormat.parse("1.11.11...11"), 1111111, "Parse '1.11.11...11'");
		assert.deepEqual(oFloatFormat.parse("1.11.11.11"), 1111111, "Parse '1.11.11.11'");
		assert.deepEqual(oFloatFormat.parse("1.1111.11"), 1111111, "Parse '1.1111.11'");
		assert.deepEqual(oFloatFormat.parse("1111.111.111"), 1111111111, "Parse '1111.111.111'");
		assert.deepEqual(oFloatFormat.parse("1.111.111111"), 1111111111, "Parse '1.111.111111'");

		// not tolerated, because invalid number syntax (in combination with grouping separator)
		assert.deepEqual(oFloatFormat.parse(".0."), NaN, "Parse '.0.'");
		assert.deepEqual(oFloatFormat.parse("."), NaN, "Parse '.'");
		assert.deepEqual(oFloatFormat.parse("..1"), NaN, "Parse '..1'");
		assert.deepEqual(oFloatFormat.parse("0."), NaN, "Parse '0.'");
		assert.deepEqual(oFloatFormat.parse(".0"), NaN, "Parse '.0'");
		assert.deepEqual(oFloatFormat.parse("0.."), NaN, "Parse '0..'");
		assert.deepEqual(oFloatFormat.parse("0.123."), NaN, "Parse '0.123.'");
		assert.deepEqual(oFloatFormat.parse("0.123"), NaN, "Parse '0.123'");
		assert.deepEqual(oFloatFormat.parse("-.123"), NaN, "Parse '-.123'");
		assert.deepEqual(oFloatFormat.parse(".123"), NaN, "Parse '.123'");
		assert.deepEqual(oFloatFormat.parse("123."), NaN, "Parse '123.'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oFloatFormat.parse("1."), NaN, "Parse '1.'");
		assert.deepEqual(oFloatFormat.parse("11."), NaN, "Parse '11.'");
		assert.deepEqual(oFloatFormat.parse("1.1"), NaN, "Parse '1.1'");
		assert.deepEqual(oFloatFormat.parse("11.11"), NaN, "Parse '11.11'");
		assert.deepEqual(oFloatFormat.parse("111.11"), NaN, "Parse '111.11'");
		assert.deepEqual(oFloatFormat.parse("111.1111"), NaN, "Parse '111.1111'");

		// tolerated, despite incomplete grouping
		assert.deepEqual(oFloatFormat.parse("1111.111,11"), 1111111.11, "Parse '1111.111,11'");

		// space characters are allowed by default!!
		assert.deepEqual(oFloatFormat.parse("12\xa03\xa04\xa0567"), 1234567, "Parse '12\xa03\xa04\xa0567'");
		assert.deepEqual(oFloatFormat.parse("123456\u202F7"), 1234567, "Parse '123456\u202F7'");
		assert.deepEqual(oFloatFormat.parse("12 3 4 567"), 1234567, "Parse '12 3 4 567'");
		assert.deepEqual(oFloatFormat.parse(" 12 3 4 567 "), 1234567, "Parse ' 12 3 4 567 '");
		assert.deepEqual(oFloatFormat.parse(" 1234567 "), 1234567, "Parse ' 1234567 '");

		// empty custom groupingSeparator (not officially supported)
		oFloatFormat = NumberFormat.getFloatInstance({groupingSeparator: ""}, new Locale("de-DE"));
		assert.deepEqual(oFloatFormat.parse("1234567"), 1234567, "Parse '1234567'");
		assert.deepEqual(oFloatFormat.parse("1234567,89"), 1234567.89, "Parse '1234567,89'");
		assert.deepEqual(oFloatFormat.parse("123.456"), NaN, "Parse '123.456'");

		// custom groupingSeparator is the same as the decimal separator (not officially supported)
		oFloatFormat = NumberFormat.getFloatInstance({groupingSeparator: ".", decimalSeparator: "."}, new Locale("de-DE"));
		assert.deepEqual(oFloatFormat.parse("1.234.567"), 1234567, "Parse '1.234.567'");
		assert.deepEqual(oFloatFormat.parse("1234.567"), 1234567, "Parse '1234.567'");
		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.deepEqual(oFloatFormat.parse("12.34.567"), 1234567, "Parse '12.34.567'");

		// if custom groupingSeparator is a space character, then restrictive validity checks cannot be applied,
		// because all space characters are allowed
		oFloatFormat = NumberFormat.getFloatInstance({groupingSeparator: "\xa0"}, new Locale("de-DE"));
		assert.deepEqual(oFloatFormat.parse("1\xa0234\xa0567"), 1234567, "Parse '1\xa0234\xa0567'");
		assert.deepEqual(oFloatFormat.parse("1234\xa0567"), 1234567, "Parse '1234\xa0567'");
		assert.deepEqual(oFloatFormat.parse("123456\xa07"), 1234567, "Parse '123456\xa07'");
		assert.deepEqual(oFloatFormat.parse("1 2 3 4 5 6 7"), 1234567, "Parse '1 2 3 4 5 6 7'");

		// \u202F (NNBSP) is default e.g. for French (fr.json)
		oFloatFormat = NumberFormat.getFloatInstance(new Locale("fr-FR"));
		assert.deepEqual(oFloatFormat.parse("1\u202F234\u202F567"), 1234567, "Parse '1\u202F234\u202F567'");
		assert.deepEqual(oFloatFormat.parse("1234\u202F567"), 1234567, "Parse '1234\u202F567'");
		assert.deepEqual(oFloatFormat.parse("123456\u202F7"), 1234567, "Parse '123456\u202F7'");
		assert.deepEqual(oFloatFormat.parse("1 2 3 4 5 6 7"), 1234567, "Parse '1 2 3 4 5 6 7'");

		// \xa0 (NBSP) is default e.g. for Finish (fi.json)
		oFloatFormat = NumberFormat.getFloatInstance(new Locale("fi"));
		assert.deepEqual(oFloatFormat.parse("1\xa0234\xa0567"), 1234567, "Parse '1\xa0234\xa0567'");
		assert.deepEqual(oFloatFormat.parse("1234\xa0567"), 1234567, "Parse '1234\xa0567'");
		assert.deepEqual(oFloatFormat.parse("123456\xa07"), 1234567, "Parse '123456\xa07'");
		assert.deepEqual(oFloatFormat.parse("1 2 3 4 5 6 7"), 1234567, "Parse '1 2 3 4 5 6 7'");

		// ’ (apostrophe) is default e.g. for Italian Switzerland (it_CH.json)
		oFloatFormat = NumberFormat.getFloatInstance(new Locale("it_CH"));
		assert.deepEqual(oFloatFormat.parse("1’234’567"), 1234567, "Parse '1’234’567'");
		assert.deepEqual(oFloatFormat.parse("1234’567.89"), 1234567.89, "Parse '1234’567.89'");
		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oFloatFormat.parse("1234’567"), 1234567, "Parse '1234’567'");
		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.deepEqual(oFloatFormat.parse("1’23’45’67"), 1234567, "Parse '1’23’45’67'");

		// custom groupingSize
		oFloatFormat = NumberFormat.getFloatInstance({groupingSize: 4}, new Locale("de-DE"));
		assert.deepEqual(oFloatFormat.parse("123.4567"), 1234567, "Parse '123.4567'");
		// tolerated, despite wrong grouping, because of multiple grouping separators
		assert.deepEqual(oFloatFormat.parse("1.234.567"), 1234567, "Parse '1.234.567'");
		assert.deepEqual(oFloatFormat.parse("1234.567"), NaN, "Parse '1234.567'");

		// custom plus/minusSign
		oFloatFormat = NumberFormat.getFloatInstance({
			plusSign: ":",
			minusSign: "_"
		}, new Locale("de-DE"));
		assert.deepEqual(oFloatFormat.parse(":1.234.567"), 1234567, "Parse ':1.234.567'");
		assert.deepEqual(oFloatFormat.parse("_1.234.567"), -1234567, "Parse '_1.234.567'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oFloatFormat.parse(":1234.567"), 1234567, "Parse ':1234.567'");
		assert.deepEqual(oFloatFormat.parse("_1234.567"), -1234567, "Parse '_1234.567'");

		assert.deepEqual(oFloatFormat.parse(":1.234567"), NaN, "Parse ':1.234567'");
		assert.deepEqual(oFloatFormat.parse("_1.234567"), NaN, "Parse '_1.234567'");
	});

	QUnit.test("Special cases Unit", function (assert) {
		// en locale
		var oUnitFormat = NumberFormat.getUnitInstance(new Locale("en"));

		assert.equal(oUnitFormat.format(1234567.89, "volume-gallon-imperial"), "1,234,567.89 gal Imp.", "Format to '1,234,567.89 gal Imp.'");

		// formatted
		assert.deepEqual(oUnitFormat.parse("1,234,567.89 gal Imp."), [1234567.89, "volume-gallon-imperial"], "Parse '1,234,567.89 gal Imp.'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oUnitFormat.parse("1234,567 gal Imp."), [1234567, "volume-gallon-imperial"], "Parse '1234,567 gal Imp.'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oUnitFormat.parse("123,4567 gal Imp."), null, "Parse '123,4567 gal Imp.'");

		assert.deepEqual(oUnitFormat.parse("1234567.89 gal Imp."), [1234567.89, "volume-gallon-imperial"], "Parse '1234567.89 gal Imp.'");
		assert.deepEqual(oUnitFormat.parse("1234,567.89 gal Imp."), [1234567.89, "volume-gallon-imperial"], "Parse '1234,567.89 gal Imp.'");

		// de locale
		oUnitFormat = NumberFormat.getUnitInstance(new Locale("de"));

		assert.equal(oUnitFormat.format(1234567.89, "volume-gallon-imperial"), "1.234.567,89 Imp. gal", "Format to '1.234.567,89 Imp. gal'");

		// formatted
		assert.deepEqual(oUnitFormat.parse("1.234.567,89 Imp. gal"), [1234567.89, "volume-gallon-imperial"], "Parse '1.234.567,89 Imp. gal'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oUnitFormat.parse("1234.567 Imp. gal"), [1234567, "volume-gallon-imperial"], "Parse '1234.567 Imp. gal'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oUnitFormat.parse("123.4567 Imp. gal"), null, "Parse '123.4567 Imp. gal'");

		assert.deepEqual(oUnitFormat.parse("1234567,89 Imp. gal"), [1234567.89, "volume-gallon-imperial"], "Parse '1234567,89 Imp. gal'");
		assert.deepEqual(oUnitFormat.parse("1234.567,89 Imp. gal"), [1234567.89, "volume-gallon-imperial"], "Parse '1234.567,89 Imp. gal'");

		// ar (RTL)
		oUnitFormat = NumberFormat.getUnitInstance(new Locale("ar"));

		assert.equal(oUnitFormat.format(1234567.89, "volume-gallon-imperial"), "1,234,567.89 غالون إمبراطوري", "Format to '1,234,567.89 غالون إمبراطوري'");
		assert.equal(oUnitFormat.format(1234567.89, "volume-fluid-ounce-imperial"), "1,234,567.89 fl oz Imp.", "Format to '1,234,567.89 fl oz Imp.'");

		// formatted
		assert.deepEqual(oUnitFormat.parse("1,234,567.89 غالون إمبراطوري"), [1234567.89, "volume-gallon-imperial"], "Parse '1,234,567.89 غالون إمبراطوري'");
		assert.deepEqual(oUnitFormat.parse("1,234,567.89 fl oz Imp."), [1234567.89, "volume-fluid-ounce-imperial"], "Parse '1,234,567.89 fl oz Imp.'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oUnitFormat.parse("1234,567 غالون إمبراطوري"), [1234567, "volume-gallon-imperial"], "Parse '1234,567 غالون إمبراطوري'");
		assert.deepEqual(oUnitFormat.parse("1234,567 fl oz Imp."), [1234567, "volume-fluid-ounce-imperial"], "Parse '1234,567 fl oz Imp.'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oUnitFormat.parse("123,4567 غالون إمبراطوري"), null, "Parse '123,4567 غالون إمبراطوري'");
		assert.deepEqual(oUnitFormat.parse("123,4567 fl oz Imp."), null, "Parse '123,4567 fl oz Imp.'");

		assert.deepEqual(oUnitFormat.parse("1234567.89 غالون إمبراطوري"), [1234567.89, "volume-gallon-imperial"], "Parse '1234567.89 غالون إمبراطوري'");
		assert.deepEqual(oUnitFormat.parse("1234567.89 fl oz Imp."), [1234567.89, "volume-fluid-ounce-imperial"], "Parse '1234567.89 fl oz Imp.'");
		assert.deepEqual(oUnitFormat.parse("1234,567.89 غالون إمبراطوري"), [1234567.89, "volume-gallon-imperial"], "Parse '1234,567.89 غالون إمبراطوري'");
		assert.deepEqual(oUnitFormat.parse("1234,567.89 fl oz Imp."), [1234567.89, "volume-fluid-ounce-imperial"], "Parse '1234,567.89 fl oz Imp.'");
	});

	QUnit.test("Special cases Unit style=short", function (assert) {
		// en locale
		var oUnitFormat = NumberFormat.getUnitInstance({style: "short"}, new Locale("en"));

		assert.equal(oUnitFormat.format(1.2e+12, "volume-gallon-imperial"), "1.2T gal Imp.", "Format to '1.2T gal Imp.'");
		assert.equal(oUnitFormat.format(1234567e+12, "volume-gallon-imperial"), "1,234,567T gal Imp.", "Format to '1,234,567T gal Imp.'");

		// formatted
		assert.deepEqual(oUnitFormat.parse("1.2T gal Imp."), [1.2e+12, "volume-gallon-imperial"], "Parse '1.2T gal Imp.'");
		assert.deepEqual(oUnitFormat.parse("1,234,567T gal Imp."), [1234567e+12, "volume-gallon-imperial"], "Parse '1,234,567T gal Imp.'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oUnitFormat.parse("1234,567T gal Imp."), [1234567e+12, "volume-gallon-imperial"], "Parse '1234,567T gal Imp.'");

		assert.deepEqual(oUnitFormat.parse("123,4567T gal Imp."), null, "Parse '123,4567T gal Imp.'");
		assert.deepEqual(oUnitFormat.parse("1234567T gal Imp."), [1234567e+12, "volume-gallon-imperial"], "Parse '1234567T gal Imp.'");

		// de locale
		oUnitFormat = NumberFormat.getUnitInstance({style: "short"}, new Locale("de"));

		assert.equal(oUnitFormat.format(1.2e+12, "volume-gallon-imperial"), "1,2\xa0Bio. Imp. gal", "Format to '1,2\xa0Bio. Imp. gal'");
		assert.equal(oUnitFormat.format(1234567e+12, "volume-gallon-imperial"), "1.234.567\xa0Bio. Imp. gal", "Format to '1.234.567\xa0Bio. Imp. gal'");

		// formatted
		assert.deepEqual(oUnitFormat.parse("1,2\xa0Bio. Imp. gal"), [1.2e+12, "volume-gallon-imperial"], "Parse '1,2\xa0Bio. Imp. gal'");
		assert.deepEqual(oUnitFormat.parse("1.234.567\xa0Bio. Imp. gal"), [1234567e+12, "volume-gallon-imperial"], "Parse '1.234.567\xa0Bio. Imp. gal'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oUnitFormat.parse("1234.567\xa0Bio. Imp. gal"), [1234567e+12, "volume-gallon-imperial"], "Parse '1234.567\xa0Bio. Imp. gal'");

		// not tolerated, because single separator with wrong grouping base size (assumingly a decimal separator)
		assert.deepEqual(oUnitFormat.parse("123.4567\xa0Bio. Imp. gal"), null, "Parse '123.4567\xa0Bio. Imp. gal'");

		assert.deepEqual(oUnitFormat.parse("1234567\xa0Bio. Imp. gal"), [1234567e+12, "volume-gallon-imperial"], "Parse '1234567\xa0Bio. Imp. gal'");

		// ar (RTL)
		oUnitFormat = NumberFormat.getUnitInstance({style: "short"}, new Locale("ar"));

		assert.equal(oUnitFormat.format(1.2e+12, "volume-gallon-imperial"), "1.2\xa0ترليون غالون إمبراطوري", "Format to '1.2\xa0ترليون غالون إمبراطوري'");
		assert.equal(oUnitFormat.format(1234567e+12, "volume-gallon-imperial"), "1,234,567\xa0ترليون غالون إمبراطوري", "Format to '1,234,567\xa0ترليون غالون إمبراطوري'");
		assert.equal(oUnitFormat.format(1.2e+12, "volume-fluid-ounce-imperial"), "1.2\xa0ترليون fl oz Imp.", "Format to '1.2\xa0ترليون fl oz Imp.'");
		assert.equal(oUnitFormat.format(1234567e+12, "volume-fluid-ounce-imperial"), "1,234,567\xa0ترليون fl oz Imp.", "Format to '1,234,567\xa0ترليون fl oz Imp.'");

		// formatted
		assert.deepEqual(oUnitFormat.parse("1.2\xa0ترليون غالون إمبراطوري"), [1.2e+12, "volume-gallon-imperial"], "Parse '1.2\xa0ترليون غالون إمبراطوري'");
		assert.deepEqual(oUnitFormat.parse("1,234,567\xa0ترليون غالون إمبراطوري"), [1234567e+12, "volume-gallon-imperial"], "Parse '1,234,567\xa0ترليون غالون إمبراطوري'");
		assert.deepEqual(oUnitFormat.parse("1.2\xa0ترليون fl oz Imp."), [1.2e+12, "volume-fluid-ounce-imperial"], "Parse '1.2\xa0ترليون fl oz Imp.'");
		assert.deepEqual(oUnitFormat.parse("1,234,567\xa0ترليون fl oz Imp."), [1234567e+12, "volume-fluid-ounce-imperial"], "Parse '1,234,567\xa0ترليون fl oz Imp.'");

		assert.deepEqual(oUnitFormat.parse("1,2\xa0ترليون غالون إمبراطوري"), null, "Parse '1,2\xa0ترليون غالون إمبراطوري'");
		assert.deepEqual(oUnitFormat.parse("1,234567\xa0ترليون fl oz Imp."), null, "Parse '1,234567\xa0ترليون fl oz Imp.'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oUnitFormat.parse("1234,567\xa0ترليون غالون إمبراطوري"), [1234567e+12, "volume-gallon-imperial"], "Parse '1234,567\xa0ترليون غالون إمبراطوري'");

		assert.deepEqual(oUnitFormat.parse("1234567\xa0ترليون غالون إمبراطوري"), [1234567e+12, "volume-gallon-imperial"], "Parse '1234567\xa0ترليون غالون إمبراطوري'");
		assert.deepEqual(oUnitFormat.parse("1234567\xa0ترليون fl oz Imp."), [1234567e+12, "volume-fluid-ounce-imperial"], "Parse '1234567\xa0ترليون fl oz Imp.'");
	});

	QUnit.test("Special cases Unit showNumber/showMeasure", function (assert) {
		// showMeasure: true
		var oUnitFormat = NumberFormat.getUnitInstance({showNumber: false}, new Locale("en"));

		// format
		assert.equal(oUnitFormat.format(1234567.89, "volume-gallon-imperial"), "gal Imp.", "Format to 'gal Imp.'");

		// parse
		assert.deepEqual(oUnitFormat.parse("gal Imp."), [undefined, "volume-gallon-imperial"], "Parse 'gal Imp.'");
		assert.deepEqual(oUnitFormat.parse("1,234,567.89 gal Imp."), null, "Parse '1,234,567.89 gal Imp.'");

		// showMeasure: false
		oUnitFormat = NumberFormat.getUnitInstance({showMeasure: false}, new Locale("en"));

		// format
		assert.equal(oUnitFormat.format(1234567.89, "volume-gallon-imperial"), "1,234,567.89", "Format to '1,234,567.89'");

		// parse
		assert.deepEqual(oUnitFormat.parse("1,234,567.89"), [1234567.89, undefined], "Parse '1,234,567.89'");
		assert.deepEqual(oUnitFormat.parse("1234,567.89"), [1234567.89, undefined], "Parse '1234,567.89'");

		// tolerated, as single separator with grouping base size (assumingly a grouping separator)
		assert.deepEqual(oUnitFormat.parse("1234,567"), [1234567, undefined], "Parse '1234,567'");

		assert.deepEqual(oUnitFormat.parse("1,234,567.89 gal Imp."), null, "Parse '1,234,567.89 gal Imp.'");
	});
});

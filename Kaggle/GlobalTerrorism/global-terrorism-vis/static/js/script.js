
"use strict";

$('document').ready(function() {

	var params = {
		'year': '2000-2009',
		'region': 'Sub-Saharan Africa',
		'country': 'all',
		'city': 'all'
	};

	var utility = new Utility();
	var to_year = new Date().getFullYear();

	$('div.component-parent div.loader').css('display', 'none');

	$('select[name="region"]').change(function() {
		var region = $('select[name="region"] option:selected').val();

		// to handle & char in region name
		region = region.replace('&', '|')

		utility.getUniqueListOfCountries(region);
	});

	$('select[name="country"]').change(function() {
		var region = $('select[name="region"] option:selected').val();
		var country = $('select[name="country"] option:selected').val();

		// to handle & char in region name
		region = region.replace('&', '|')

		utility.getUniqueListOfCities(region, country);
	});

	$('div.footer footer').html('&copy; Mukul Taneja - ' + to_year);

	$('form[name="filter-form"').submit(function(e) {
		e.preventDefault();

		// removing existing results
		d3.select("div.sunburst svg").remove();
		d3.select('div.sunburst p').remove();
		d3.select("div.bullets svg").remove();
		d3.select('div.bullets p').remove();

		var year = $('select[name="year"] option:selected').val();
		var region = $('select[name="region"] option:selected').val();
		var country = $('select[name="country"] option:selected').val();
		var city = $('select[name="city"] option:selected').val();
		var checktype = $('input[name="rate"]:checked').val();

		var params = {
			'year': year,
			'region': region,
			'country': country,
			'city': city,
			'checktype': checktype
		};

		utility.getSunburstData(params);
		utility.getBulletChartData(params);
	});

	$('input[name=rate]').change(function(e) {
		var year = $('select[name="year"] option:selected').val();
		var region = $('select[name="region"] option:selected').val();
		var country = $('select[name="country"] option:selected').val();
		var city = $('select[name="city"] option:selected').val();

		var params = {
			'year': year,
			'region': region,
			'country': country,
			'city': city,
			'checktype': $(this).val()
		};

		utility.getBulletChartData(params);

	});

	utility.getSunburstData(params);
	utility.getBulletChartData(params);
	utility.getUniqueListOfYears();
	utility.getUniqueListOfRegions();
});

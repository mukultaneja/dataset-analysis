"use strict";

$('document').ready(function() {

	var params = {
		'year': '2000-2009',
		'region': 'Sub-Saharan Africa',
		'country': 'all',
		'city': 'all'
	};

	var utility = new Utility();

	$('div.sunburst div.loader').css('display', 'none');

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

	$('form[name="filter-form"').submit(function(e) {
		e.preventDefault();
		d3.select('div.sunburst div.loader').style('display', 'block');
		var year = $('select[name="year"] option:selected').val();
		var region = $('select[name="region"] option:selected').val();
		var country = $('select[name="country"] option:selected').val();
		var city = $('select[name="city"] option:selected').val();
		var params = {
			'year': year,
			'region': region,
			'country': country,
			'city': city
		};

		d3.select("div.sunburst svg").remove();
		d3.select('div.sunburst p').remove();
		utility.getSunburstData(params);
	});

	utility.getSunburstData(params);
	utility.getUniqueListOfYears();
	utility.getUniqueListOfRegions();
});
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
	var v = new Array('2000-2009', 'Sub-Saharan Africa', 'all', 'all');
	utility.addBreadCumb(v)

	var rateValue = '2000-2009' + '/' + 'all' + '/' + 'Sub-Saharan Africa' +
		'/' + 'all' + '/' + 'all' + '/' +
		'form' + '/' + 'iyear';

	$('input[name="rate"]').attr('attr', rateValue);

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

	$('a.filter-link').hover(function() {
		$('div.filter-div').slideDown(1000);
	}, function() {
		// setTimeout(function(){
		// 	$('div.filter-div').slideUp(1000);
		// }, 5000)
	});

	$('div.footer footer').html('&copy; Mukul Taneja - ' + to_year);

	// $('a.breadcumb-links').click(function(){
	// 	var value = $(this).text().split(' ')[1];
	// 	var parent = $(this).parent();
	// 	$(this).remove();
	// 	parent.append('<input type="text" value="' + value + '"/>');
	// });

	$('body').on('click', 'a.sunburst-left-slider', function() {
		$(this).parent().removeClass('col-md-6 col-xs-6');
		$(this).parent().addClass('col-md-1 col-xs-1');
		$(this).parent().siblings().removeClass('col-md-6 col-xs-6');
		$(this).parent().siblings().addClass('col-md-11 col-xs-11');
		$(this).children('img').attr('src', '/static/images/left-arrow.png');
		$(this).removeClass('sunburst-left-slider');
		$(this).addClass('sunburst-right-slider');

		d3.select('div.sunburst')
			.select('svg')
			.select('g')
			.transition()
			.duration(1500)
			.attr('transform', 'translate(600, 300)');
	});

	$('body').on('click', 'a.sunburst-right-slider', function() {
		$(this).parent().addClass('col-md-6 col-xs-6');
		$(this).parent().removeClass('col-md-1 col-xs-1');
		$(this).parent().siblings().addClass('col-md-6 col-xs-6');
		$(this).parent().siblings().removeClass('col-md-11 col-xs-11');
		$(this).children('img').attr('src', '/static/images/right-arrow.png');
		$(this).addClass('sunburst-left-slider');
		$(this).removeClass('sunburst-right-slider');

		d3.select('div.sunburst')
			.select('svg')
			.select('g')
			.transition()
			.duration(1500)
			.attr('transform', 'translate(300, 300)');

	});

	$('form[name="filter-form"').submit(function(e) {
		e.preventDefault();
		// removing existing results
		d3.select("div.sunburst svg").remove();
		d3.select('div.sunburst p').remove();
		d3.select("div.trend-line svg").remove();
		d3.select('div.trend-line p').remove();

		var year = $('select[name="year"] option:selected').val();
		var region = $('select[name="region"] option:selected').val();
		var country = $('select[name="country"] option:selected').val();
		var city = $('select[name="city"] option:selected').val();
		var checktype = $('input[name="rate"]:checked').val();

		var rateValue = year + '/' + 'all' + '/' + region +
			'/' + country + '/' + city + '/' +
			'form' + '/' + 'iyear';

		$('input[name="rate"]').attr('attr', rateValue);

		var params = {
			'year': year,
			'region': region,
			'country': country,
			'city': city,
			'checktype': checktype
		};

		var v = new Array(year, region, country, city);
		utility.addBreadCumb(v);
		utility.getSunburstData(params);
		utility.getTrendLineData(params);
	});

	$('input[name=rate]').change(function(e) {
		var attrs = $(this).attr('attr').split('/');
		var year = attrs[0];
		var month = attrs[1]
		var region = attrs[2];
		var country = attrs[3];
		var city = attrs[4];
		var from = attrs[5];
		var axisName = attrs[6];

		var params = {
			'year': year,
			'month': month,
			'region': region,
			'country': country,
			'city': city,
			'checktype': $(this).val()
		};

		d3.select("div.trend-line svg").remove();
		d3.select('div.trend-line p').remove();
		if (from == 'sunburst')
			utility.getSunburstTrendLineData(params, axisName);
		else
			utility.getTrendLineData(params);

	});

	utility.getSunburstData(params);
	utility.getTrendLineData(params);
	utility.getUniqueListOfYears();
	utility.getUniqueListOfRegions();
});
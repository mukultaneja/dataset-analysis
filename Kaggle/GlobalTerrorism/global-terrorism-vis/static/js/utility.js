"use strict";

function Utility() {
	this.getUniqueListOfYears = function() {
		$('select[name="years"]').empty();
		$.get('/options?col=year', function(response) {
			response = JSON.parse(response);
			$.each(response, function(index, value) {
				var option = '<option value="' + value + '">' + value + '</option>';
				$('select[name="year"]').append(option);
			})
		});
	}

	this.getUniqueListOfRegions = function() {
		$('select[name="region"]').empty();
		$.get('/options?col=region', function(response) {
			response = JSON.parse(response);
			$.each(response, function(index, value) {
				var option;
				if (index == 0) {
					option = '<option value="' + value + '" selected>' + value + '</option>';
				} else {
					option = '<option value="' + value + '">' + value + '</option>';
				}
				$('select[name="region"]').append(option);
			});
			$('select[name="region"]').trigger('change');
		});
	}

	this.getUniqueListOfCities = function(region, country) {
		$('select[name="city"]').empty();
		$('select[name="city"]').append('<option value="all" selected>All</option>');
		var params = 'col=city&region=' + region + '&country=' + country;
		$.get('/options?' + params, function(response) {
			response = JSON.parse(response);
			$.each(response, function(index, value) {
				var option = '<option value="' + value + '">' + value + '</option>';
				$('select[name="city"]').append(option);

			});
		});
	}

	this.getUniqueListOfCountries = function(region) {
		$('select[name="country"]').empty();
		$('select[name="country"]').append('<option value="all" selected>All</option>');
		$.get('/options?col=country&region=' + region, function(response) {
			response = JSON.parse(response);
			$.each(response, function(index, value) {
				var option = '<option value="' + value + '">' + value + '</option>';
				$('select[name="country"]').append(option);

			});

			var country = $('select[name="country"] option:selected').val();
			this.getUniqueListOfCities(region, country);
		});
	}

	this.getSunburstData = function(params) {
		d3.select('div.sunburst-loader').style('display', 'block');
		$.ajax({
			url: '/sunburst',
			type: 'get',
			data: params,
			success: function(response) {
				response = JSON.parse(response);
				if (response.hasOwnProperty('error')) {
					$('div.sunburst').append('<p class="error">' + response['error'] + '</p>');
				} else {
					var results = d3.nest()
						.key(function(d) {
							return d.iyear;
						}).sortKeys(d3.ascending)
						.key(function(d) {
							return d.month;
						}).sortKeys(d3.ascending)
						.key(function(d) {
							return d.region_txt;
						}).sortKeys(d3.ascending)
						.key(function(d) {
							return d.country_txt;
						}).sortKeys(d3.ascending)
						.key(function(d) {
							return d.city;
						}).sortKeys(d3.ascending)
						.rollup(function(v) {
							return d3.sum(v, function(d) {
								return d.success;
							})
						})
						.entries(response);
					results = {
						'key': '',
						'values': results
					};
					results = {
						"name": results['key'],
						"children": results.values.map(function(years) {
							return {
								"name": years.key,
								"children": years.values.map(function(region) {
									return {
										"name": region.key,
										"children": region.values.map(function(country) {
											return {
												"name": country.key,
												"children": country.values.map(function(city) {
													return {
														"name": city.key,
														"children": city.values.map(function(v) {
															return {
																"name": v.key,
																"success": v.values
															}
														}),
														"success": d3.sum(city.values, function(v) {
															return v.values;
														})
													}
												}),
												"success": d3.sum(country.values.map(function(city) {
													return d3.sum(city.values.map(function(v) {
														return v.values
													}))
												}))
											}
										}),
										"success": d3.sum(region.values.map(function(country) {
											return d3.sum(country.values.map(function(city) {
												return d3.sum(city.values.map(function(v) {
													return v.values
												}))
											}))
										}))
									}
								}),
								"success": d3.sum(years.values.map(function(region) {
									return d3.sum(region.values.map(function(country) {
										return d3.sum(country.values.map(function(city) {
											return d3.sum(city.values.map(function(v) {
												return v.values
											}))
										}))
									}))
								}))
							}
						}),
						"success": d3.sum(results.values.map(function(years) {
							return d3.sum(years.values.map(function(region) {
								return d3.sum(region.values.map(function(country) {
									return d3.sum(country.values.map(function(city) {
										return d3.sum(city.values.map(function(v) {
											return v.values
										}))
									}))
								}))
							}))
						}))
					};
					drawSunburst(results);
					d3.select('div.sunburst-loader').style('display', 'none');
				}
			}
		});
	}

	this.addBreadCumb = function(values) {
		var index = 0;
		$('div.breadcumb a').remove();
		for (; index < 4; index++) {
			$('div.breadcumb').append('<a href="#" class="breadcumb-links"> ' + values[index] + " ></a>");
		}
	}

	this.getBulletChartData = function(params) {
		d3.select('div.bullet-loader').style('display', 'block');
		$.ajax({
			url: '/bullet-chart',
			type: 'get',
			data: params,
			success: function(response) {
				d3.select("div.bullets svg").remove();
				d3.select('div.bullets p').remove();
				response = JSON.parse(response);
				if (response.hasOwnProperty('error')) {
					$('div.bullets').append('<p class="error">' + response['error'] + '</p>');
				} else {
					drawBulletChart(response);
					d3.select('div.bullet-loader').style('display', 'none');
				}
			}
		})
	}

	this.getSunburstBulletChartData = function(params, axisName) {
		d3.select('div.bullet-loader').style('display', 'block');
		$.ajax({
			url: '/sunburst-bullet-chart',
			type: 'get',
			data: params,
			success: function(response) {
				d3.select("div.bullets svg").remove();
				d3.select('div.bullets p').remove();
				response = JSON.parse(response);
				if (response.hasOwnProperty('error')) {
					$('div.bullet-loader').append('<p class="error">' + response['error'] + '</p>');
				} else {
					drawBulletChart(response, axisName);
					d3.select('div.bullet-loader').style('display', 'none');
				}
			}
		})
	}
}
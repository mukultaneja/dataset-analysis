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
		$.ajax({
			url: '/data',
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
						'key': 'root',
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
														})
													}
												})
											}
										})
									}
								})
							}
						})
					};
					drawSunburst(results);
				}
			}
		});
		d3.select('div.sunburst div.loader').style('display', 'none');
	}
}

$('document').ready(function() {
	$('form[name="filter-form"').submit(function(e) {
		e.preventDefault();
		var year = $('select[name="year"] option:selected').val();
		var country = $('select[name="country"] option:selected').val();
		var region = $('select[name="region"] option:selected').val();
		var params = {
			'year': year,
			'country': country,
			'region': region
		};

		$.get('/data', params, function(response) {
			response = JSON.parse(response);
			if (response['error']){
				$('div.sunburst').append('<p class="error">' + response['error'] + '</p>');
				return
			}else{
				var results = d3.nest()
					.key(function(d) {
						return d.iyear;
					}).sortKeys(d3.ascending)
					.key(function(d) {
						return d.month;
					}).sortKeys(d3.ascending)
					.key(function(d) {
						return d.country_txt;
					}).sortKeys(d3.ascending)
					.key(function(d) {
						return d.region_txt;
					}).sortKeys(d3.ascending)
					.rollup(function(v){
						return d3.sum(v, function(d){ return d.success; })
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
							"children": years.values.map(function(country) {
								return {
									"name": country.key,
									"children": country.values.map(function(region) {
										return {
											"name": region.key,
											"children": region.values.map(function(v){
												return {
													"name": v.key,
													"success": v.values
												}
											})
										};
									})
								};
							})
						};
				 	})
				};
				createSunburst(results);
			}
		});
	});

	function getUniqueListOfYears() {
		$.get('/options?col=year', function(response) {
			response = JSON.parse(response);
			$.each(response, function(index, value) {
				var option = '<option value="' + value + '">' + value + '</option>';
				$('select[name="year"]').append(option);
			})
		});
	}

	function getUniqueListOfCountries() {
		$.get('/options?col=country', function(response) {
			response = JSON.parse(response);
			$.each(response, function(index, value) {
				var option = '<option value="' + value + '">' + value + '</option>';
				$('select[name="country"]').append(option);

			});
			getUniqueListOfRegions($('select[name="country"] option:eq(0)').val());
		});
	}

	function getUniqueListOfRegions(country) {
		$.get('/options?col=region&country=' + country, function(response) {
			response = JSON.parse(response);
			$('select[name="region"]').empty();
			$('select[name="region"]').append('<option value="all">All</option>');
			$.each(response, function(index, value) {
				var option = '<option value="' + value + '">' + value + '</option>';
				$('select[name="region"]').append(option);
			})
		});
	}

	getUniqueListOfYears();
	getUniqueListOfCountries();

	$('select[name="country"]').change(function() {
		var country = $('select[name="country"] option:selected').val();
		getUniqueListOfRegions(country);
	});

	$('div.sunburst div.loader').css('display', 'none');
});
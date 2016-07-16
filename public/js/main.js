$(document).ready(function() {

	$('#userInformation').submit(function (event) {
		event.preventDefault();
		var userAddress = $('#userAddress').val();
		findLegislators(userAddress);
	});

	function findLegislators(address) {
		$.ajax ({
			type: "GET",
			url: "/locate?address=" + address,
			cache: false,
			success: function(results) {
				var legislators = results;
				console.log(legislators);
				$('#userDistrictNum').html(legislators.results[0].district);

				for(var i = 0; i < legislators.results.length; i++) {

					var currLegislator = legislators.results[i];

					$('#membersCongressList').append("<div id=" + currLegislator.title + " " + "data-phone=" + currLegislator.phone + " " + "data-userID=" + currLegislator.bioguide_id + ">" + "<h3 class='legislator-name'>" + currLegislator.first_name + " " + currLegislator.last_name + "</h3></div>");

					}

				$('#congressResultsPrompt').html("Select congress member to call");
			}
		});
	};
	
	$('.legislator-name').on("click", function () {
		console.log('legislator clicked');
		callLegislator();
	});

	function callLegislator(phone) {

	}


});

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
			}
		});
	};




});

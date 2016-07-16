$(document).ready(function() {

    setTimeout(function() {
        createAccessToken("vp");
    }, 1000);

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

					$('#congressResults').show();

					$('#membersCongressList').append("<div class='legislator' id=" + currLegislator.title + " " + "data-phone=" + currLegislator.phone + " " + "data-userID=" + currLegislator.bioguide_id + ">" + "<h3 class='legislator-name'>" + currLegislator.first_name + " " + currLegislator.last_name + "</h3></div>");

					}
			}
		});
	};

	$(document).on('click','.legislator',function() {
	    callLegislator($(this).attr("data-phone"));
	});

	function callLegislator(callee) {

		var phoneNum = "1" + callee.replace(/-/g, "");

		  // Dial the number or account id
		  //
		  phone.dial({
		    destination: phone.cleanPhoneNumber(phoneNum),
		    mediaType: 'video',
		    localMedia: vidLocal,
		    remoteMedia: vidRemote
		  });
	}

    setTimeout(function() {
        createAccessToken('vp');
    }, 1000);
});

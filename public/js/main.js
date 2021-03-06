window.logoutPhone = function()
{
	if (phone)
		phone.logout();
}

$(document).ready(function() {

	// phone.logout();

    setTimeout(function() {
        createAccessToken("acitizen1");
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

				$('#membersCongressList').html("");

				for(var i = 0; i < legislators.results.length; i++) {

					var currLegislator = legislators.results[i];

					$('#congressResults').show();

					$('#membersCongressList').append("<div class='legislator' id=" + currLegislator.title + " " + "data-phone=" + currLegislator.phone + " " + "data-userID=" + currLegislator.bioguide_id + ">" + "<h3 class='legislator-name'>" + currLegislator.first_name + " " + currLegislator.last_name + "</h3></div>");

					}
					getMessage();

				
			}
		});
	};

	$(document).on('click','.legislator',function() {
	    callLegislator($(this).attr("data-phone"));
	    
	});

	$(document).on('click','#msgLanguage',function() {
	    getMessage($(this).attr("data-lang"));
	    
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

	function getMessage (language){

		if (language === undefined) {
			language = "en";
		};

		$.ajax ({
			type: "GET",
			url: "/message?lang=" + language,
			cache: false,
			success: function(results) {
				console.log(results);
				$('#messagePrompt').show();
				$('#messageText').html("<div><p>" + results.message + "</p></div>");

			}
		});
	}



    setTimeout(function() {
        createAccessToken('vp');
    }, 1000);
});

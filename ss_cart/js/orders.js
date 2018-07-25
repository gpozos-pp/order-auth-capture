var app = {

	initialize: function() {

		Parse.$ = jQuery;
        Parse.initialize('dVVty0n8MrhMhTusZHskFKJADY2HmG17KWW2TpQ9', 'ZauyN5aDZHeWgWp5W73U4qL6yCMm66Hf67QZNy5q');
        Parse.serverURL = 'https://parseapi.back4app.com';

		app.renderOrders();

	},

	renderOrders: function() {

		var Orders = Parse.Object.extend("Orders");
	    var query = new Parse.Query(Orders);
	      
      	query.find({
        
	        success: function(results) {

	        	if (results.length > 0) {

	        		for (var i = 0; i < results.length; i++) {

			            var object = results[i];

			            var date = object.get("createdAt").toISOString().slice(0, 10);
			            var orderId = object.get("orderId");
			            var total = object.get("total");
			            var orderStatus = object.get("orderStatus");

			            var orderState = '';

			            switch(orderStatus) {
						    case 1:
						        orderState = '<span class="label label-warning">Pending</span>';
						        break;
						    case 2:
						        orderState = '<span class="label label-info">Authorized</span>';
						        break;
						    case 3:
						        orderState = '<span class="label label-primary">Partially Captured</span>';
						        break;
						    case 4:
						        orderState = '<span class="label label-success">Completed</span>';
						        break;
						    case 5:
						        orderState = '<span class="label label-danger">Voided</span>';
						        break;
						    default:
						        orderState = '<span class="label label-warning">Other</span>';
						}

			            var item = '<tr>' +
	        						  '<td>' + date + '</td>' +
						              '<td>' + orderId + '</td>' +
						              '<td>$' + total.toString() + '</td>' +
						              '<td>' + orderState + '</td>' +
						              '<td><input type="number" id="amount-to-auth-' + orderId + '"><a class="btn btn-primary pp-anchor-authorize" href="javascript:;" data-order-id="' + orderId + '">Authorize</a></td>' +
						              '<td><input type="number" id="amount-to-capt-' + orderId + '"><a class="btn btn-primary pp-anchor-capture" href="javascript:;" data-order-id="' + orderId + '">Capture</a></td>' +
						            '</tr>';

						$('#tbody-items').append(item);

			        }

			        app.setPostRenderListeners();

	        	} else {

	        		alert("There are no orders");

	        	}

	        },
	        error: function(error) {
	        	alert("Error, try again please");
	        	console.log("Error: " + error.code + " " + error.message);
	        }
	      });

	},

	setPostRenderListeners: function() {

		$('.pp-anchor-authorize').on('click', function (e) {

			e.preventDefault();

			var orderId = $(this).data('order-id');
			var inputValue = $('#amount-to-auth-' + orderId).val();

			var authorizeUrl = '../server_services/authorize-payment.php?orderId=' + orderId + '&amount=' + inputValue; 

			$.ajax({
			  type: 'POST',
			  url: authorizeUrl,
			  data: '{}',
			  async: true,
			  headers: {},
			  contentType: "application/json",
			  dataType: 'text',
			  success: function (response) {

			    if (response === 'authorized') {

			    	alert(response);

			    	var Orders = Parse.Object.extend('Orders');
					var query = new Parse.Query(Orders);
					query.equalTo('orderId',orderId);
					query.first({
					  success: function(orderToBeUpdated) {

					    orderToBeUpdated.set('orderStatus',2);

					    orderToBeUpdated.save(null, {
						  success: function(orderUpdated) {
						    window.location.reload();
						  },
						  error: function(orderUpdatedFail, error) {
						    alert('Failed while trying to update order with new status, with error code: ' + error.message);
						  }
						});

					  },
					  error: function(error) {
					    alert("Error: " + error.code + " " + error.message);
					  }
					});

			    } else {
			    	alert(response);
			    }


			  }, 
			  error: function (responseError) {
			  	console.log('Error');
			  }
			});


		});

		$('.pp-anchor-capture').on('click', function (e) {

			e.preventDefault();

			var orderId = $(this).data('order-id');
			var inputValue = $('#amount-to-capt-' + orderId).val();

			var captureUrl = '../server_services/capture-payment.php?orderId=' + orderId + '&amount=' + inputValue; 

			$.ajax({
			  type: 'POST',
			  url: captureUrl,
			  data: '{}',
			  async: true,
			  headers: {},
			  contentType: "application/json",
			  dataType: 'text',
			  success: function (response) {
			    console.log(response);

     	        if (response === 'completed') {

     	        	alert(response);

			    	var Orders = Parse.Object.extend('Orders');
					var query = new Parse.Query(Orders);
					query.equalTo('orderId',orderId);
					query.first({
					  success: function(orderToBeUpdated) {

					    orderToBeUpdated.set('orderStatus',3);

					    orderToBeUpdated.save(null, {
						  success: function(orderUpdated) {
						    window.location.reload();
						  },
						  error: function(orderUpdatedFail, error) {
						    alert('Failed while trying to update order with new status, with error code: ' + error.message);
						  }
						});

					  },
					  error: function(error) {
					    alert("Error: " + error.code + " " + error.message);
					  }
					});

			    } else {
			    	alert(response);
			    }

			  }, 
			  error: function (responseError) {
			  	console.log('Error');
			  }
			});


		});

	}

}

app.initialize();
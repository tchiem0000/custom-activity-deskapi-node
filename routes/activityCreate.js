'use strict';
var https = require( 'https' );

var activityUtils = require('./activityUtils');
//https://nodejs.org/api/https.html

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Edit' );
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Save' );
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Validate' );
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    console.log("req.body: " + req.body);
    
	activityUtils.logData( req );

	initSMS(req,res);
};


function initSMS(req,res) {
/*
	Search for email address
	If found, use it to create a case.
	If not found,
		create customer
		use new customer id to create case.
*/

	//merge the array of objects.
	var aArgs = req.body.inArguments;
	
	//console.log( "req.body.inArguments: " + req.body.inArguments );
	
	var oArgs = {};
	
	for (var i=0; i<aArgs.length; i++) {  
		for (var key in aArgs[i]) { 
		
			console.log("key: " + key);
		
			oArgs[key] = aArgs[i][key]; 
			
			console.log("oArgs[key] value: " + oArgs[key]);
		}
	}

	//console.log( "oArgs: " + oArgs );
	
	var email = oArgs.emailAddress;
	var fname = oArgs.firstName;
	var lname = oArgs.lastName;
	var priority = oArgs.priority;
	var smsMessage = oArgs.smsMessage;
	
	console.log( "email: " + oArgs.emailAddress );
	console.log( "fname: " + oArgs.firstName );
	console.log( "lname: " + oArgs.lastName );
	console.log( "priority: " + oArgs.priority );
	console.log( "smsMessage: " + oArgs.smsMessage );

	function controller(status, msg, data, err){
		if (err) {
			console.log('controller error', msg, status, data, 'error', err);
			res.json( status, err );
			return;
		}
		else{
			console.log('controller success done');	
		}
		
		/*
		if (msg == 'findCustIdByEmail') {
			console.log('controller findCustIdByEmail', data);
			if (data.id) {
				createCase(data.id, email, priority, controller);
			} else {
				createCustomer({fname:fname,lname:lname,email:email}, controller);
			}
		} else if (msg == 'createCase') {
			console.log('controller createCase', data);
			if (data.id) {
				res.send( 200, {"caseID": "1111111"} ); //return the new CaseID  res.send( 200, {"caseID": data.id} )
			} else {
				res.send( 500, {message: 'Error creating Desk.com case.'} );
			}					
		} else if (msg == 'createCustomer') {
			console.log('controller createCustomer', data);
			if (data.id) {
				createCase(data.id, email, priority, controller);
			} else {
				res.send( 500, {message: 'Error creating customer'} );
			}
		}
		*/
		
	};

	//need to return this or error
	res.send( 200, {"caseID": ""} ); 
	
	//findCustIdByEmail(email, controller);
	
	//glen test
	sendSMS(fname, email, smsMessage, controller);

};

//glen test
//http://api.every8d.com/API21/HTTP/sendSMS.ashx?UID=LOREALTEST&PWD=LOREALTEST&SB=mySubject&MSG=testJB222&DEST=12345678&ST=
function sendSMS(custId, email, mySMSMessage, next) {
	
	console.log('in sendSMS');
	console.log('custId: ' + custId);
	console.log('email: ' + email);
	console.log('mySMSMessage: ' + mySMSMessage);
	console.log('---------------');

	
	var post_data = JSON.stringify({  
		"type":"email",
		"subject":"Email Case From JB for " + email,
		"mySMSMessage":mySMSMessage,
		"status":"open",
		"labels": ["JB"],
		"message":{  
			"direction": "in",
			"to": "https://sms.lorealuxe.com",
			"from": email,
			"body": "This is a SMS message created for a customer coming from Journey Builder.",
			"subject": "My SMS Subject"
		}
	});			
	
	/*
	var options = {
		'hostname': 'http://api.every8d.com'
		,'path': '/API21/HTTP/sendSMS.ashx?UID=LOREALTEST&PWD=LOREALTEST&SB=mySubject&MSG=testJB222&DEST=12345678&ST='
		,'method': 'POST'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + activityUtils.deskCreds.token
		},
	};		
	*/
	
	//107.00,1,1,0,98b8bb75-17cc-4518-b526-9d15601fb31b
	//CREDIT,SENDED,COST,UNSEND,BATCH_ID
	var msg2 = 'my msg #: ' + mySMSMessage;
	
	console.log('msg2: ' + msg2);
	
	//console.log(encodeURI('this is a test #'));
	
	var options = {
		host: 'sms.lorealuxe.com',
		port: 443,
		path: '/loreal/API21/HTTP/sendSMS.ashx?UID=LOREALTEST&PWD=LOREALTEST&SB=' + encodeURI(email) + '&MSG=' + encodeURI(msg2) + '&DEST=0926147720&ST=',
		method: 'GET'
	};

	//console.log('options: ' + options);
	
	//https://sms.lorealuxe.com/loreal/API21/HTTP/sendSMS.ashx?UID=LOREALTEST&PWD=LOREALTEST&SB=mySubject&MSG=testJB&DEST=0926147720&ST=
	var httpsCall = https.request(options, function(response) {
		var data = '', redirect = '', error = '';
		
		// A chunk of data has been recieved.
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );	
		
		// The whole response has been received. Print out the result.
		response.on( 'end' , function() {			
			//201 Created
			if (response.statusCode == 201) {   
				data = JSON.parse(data);
				console.log('onEND sendSMS',response.statusCode,data.id);			
				next(response.statusCode, 'sendSMS', {id: data.id});
			} else {  //success
				console.log('sendSMS send success', 'status:' + response.statusCode, 'response:' + data);
			
				next( response.statusCode, 'sendSMS', {} );
			}				
		});								

	});
	
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'sendSMS', {}, { error: e });
	});	
	
	//console.log('httpsCall: ' + httpsCall);

	httpsCall.write(post_data);
	httpsCall.end();

	console.log('sms send done');

	/*
	https.get('http://api.every8d.com/API21/HTTP/sendSMS.ashx?UID=LOREALTEST&PWD=LOREALTEST&SB=mySubject&MSG=testJB222&DEST=12345678&ST=', (resp) => {
	  let data = '';

	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
		data += chunk;
	  });

	  // The whole response has been received. Print out the result.
	  resp.on('end', () => {
		console.log(JSON.parse(data).explanation);
	  });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
		*/	

};



function findCustIdByEmail(email, next) {
	console.log('findCustIdByEmail', email);
	var post_data = '';				
	var options = {
		'hostname': activityUtils.deskCreds.host
		,'path': '/api/v2/customers/search?email=' + email 
		,'method': 'GET'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + activityUtils.deskCreds.token
		},
	};
	
	var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() {
			if (response.statusCode == 200) {
				data = JSON.parse(data);
				console.log('onEND findCustIdByEmail',response.statusCode, 'found count:',data.total_entries);
				if (data.total_entries > 0) {
					next(response.statusCode, 'findCustIdByEmail', {id: data._embedded.entries[0].id});
				} else {
					next( response.statusCode, 'findCustIdByEmail', {} );
				}					
			} else {
				next( response.statusCode, 'findCustIdByEmail', {} );
			}
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'findCustIdByEmail', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();
};


function createCustomer(data, next) {
	console.log('createCustomer', data.fname, data.lname);
	var post_data = JSON.stringify({  
		"first_name":data.fname
		,"last_name":data.lname
		,"emails": [
			{
				"type": "other",
				"value": data.email
			}
    	]
	});			
		
	var options = {
		'hostname': activityUtils.deskCreds.host
		,'path': '/api/v2/customers'
		,'method': 'POST'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + activityUtils.deskCreds.token
		},
	};				
	
	var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() {
			if (response.statusCode == 201) {
				data = JSON.parse(data);
				console.log('onEND createCustomer',response.statusCode,data.id);
				if (data.id) {
					next(response.statusCode, 'createCustomer', {id: data.id});
				} else {
					next( response.statusCode, 'createCustomer', {} );
				}
			} else {
				next( response.statusCode, 'createCustomer', {} );
			}				
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'createCustomer', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();
};


function createCase(custId, email, priority, next) {
	console.log('createCase', custId);
	var post_data = JSON.stringify({  
		"type":"email",
		"subject":"Email Case From JB for " + email,
		"priority":priority,
		"status":"open",
		"labels": ["JB"],
		"message":{  
			"direction": "in",
			"to": activityUtils.deskCreds.supportEmail,
			"from": email,
			"body": "This is a new case created for a customer coming from Journey Builder.",
			"subject": "My email subject"
		}
	});			
		
	var options = {
		'hostname': activityUtils.deskCreds.host
		,'path': '/api/v2/customers/' + custId + '/cases'
		,'method': 'POST'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + activityUtils.deskCreds.token
		},
	};				
	
	var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() {
			if (response.statusCode == 201) {
				data = JSON.parse(data);
				console.log('onEND createCase',response.statusCode,data.id);			
				next(response.statusCode, 'createCase', {id: data.id});
			} else {
				next( response.statusCode, 'createCase', {} );
			}				
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'createCase', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();

};


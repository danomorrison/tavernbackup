var util = require('util');
var bleno = require('bleno');
var CONNECTION_ATTEMPTS_LIMIT = 15;
var charUUID = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
var {setNetworkInfo, checkInternet} = require('./lib');

function WifiCredentialsCharacteristic() {
	bleno.Characteristic.call(this, {
		uuid: charUUID,
		properties : ['write', 'read', 'notify'],
	});
	
	this.updateValueCallback = null;
	this.checkInternetConnectionInterval = null;
	this.attemptsCount = 0;
}

util.inherits(WifiCredentialsCharacteristic, bleno.Characteristic);

WifiCredentialsCharacteristic.prototype.onReadRequest = function(offset, callback) {
	console.log("Read!");
	
	callback(bleno.Characteristic.RESULT_SUCCESS, isConnected);
};
		
WifiCredentialsCharacteristic.prototype.onWriteRequest = function(newData, offset, withoutResponse, callback) {
	var self = this;
	
	if(offset > 0) {
		callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
    } else {
		var wifiInfo = JSON.parse(newData);
		
		console.log("Setting wifi name to " + wifiInfo.name + " and password to " + wifiInfo.password);
		// Change PI conf files (wpa_supplicant) to connect to network
		setNetworkInfo(wifiInfo.name, wifiInfo.password);
		
		// Indicate write request successfully received
		callback(bleno.Characteristic.RESULT_SUCCESS);
		
		if (self.checkInternetConnectionInterval != null) {
			clearInterval(self.checkInternetConnectionInterval);
		}
		self.attemptsCount = 0;
		
		// Check for successful wifi connection every second
		self.checkInternetConnectionInterval = setInterval(function() {
			checkInternet(function(isConnected) {
				console.log(self.attemptsCount);
				
				// Send updateValueCallback and stop interval if successful
				if (isConnected && self.attemptsCount >= 3) {
					var connectionStatus = "connected";
					
					console.log("connection status " + connectionStatus);
					clearInterval(self.checkInternetConnectionInterval);
				
					if (self.updateValueCallback != null) {
						var data = new Buffer(connectionStatus + '|', 'utf-8');
						self.updateValueCallback(data);
						console.log("updateValuecallback " + connectionStatus);
						
					}
				
				// Try again if disconnected state detected	
				} else {
					var connectionStatus = "disconnected";
					console.log("connection status " + connectionStatus);
					self.attemptsCount += 1;
					
					if (self.attemptsCount >= CONNECTION_ATTEMPTS_LIMIT) {
						clearInterval(self.checkInternetConnectionInterval);
						
						if (self.updateValueCallback != null) {
							console.log("updateValuecallback " + connectionStatus);
							var data = new Buffer(connectionStatus + '|', 'utf-8');
							self.updateValueCallback(data);
						}
					} 
				}
			});
		}, 1000);
	}  
};

WifiCredentialsCharacteristic.prototype.onNotify = function () {
	console.log("Notified!");
};

WifiCredentialsCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
	
	console.log("Subscribed!");
	this.updateValueCallback = updateValueCallback;
	
	// Initial test for wifi connectivity
	checkInternet(function(isConnected) {
		if (isConnected) {
			var data = new Buffer('connected' + '|', 'utf-8');
			updateValueCallback(data);
			console.log("updateValuecallback " + 'connected');
		} else {
			var data = new Buffer('disconnected' + '|', 'utf-8');
			updateValueCallback(data);
			console.log("updateValuecallback " + 'disconnected');
		}
	})
};

WifiCredentialsCharacteristic.prototype.onUnsubscribe = function() {
	console.log("Unsubscribed!");
	if (this.checkInternetConnectionInterval != null) {
		clearInterval(this.checkInternetConnectionInterval);
		this.checkInternetConnectionInterval = null;
	}
	this.updateValueCallback = null;
};

module.exports = WifiCredentialsCharacteristic;
		

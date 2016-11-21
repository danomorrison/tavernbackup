var bleno = require('bleno');
var deviceUUID = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
var serviceUUID = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
var charUUID = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
var data = 'Send me something';
var name = 'Tavern';
var isBTConnected = false;

// ---------------------------------------------------------------------
// Characteristics
var writeCharacteristic = new bleno.Characteristic({
    uuid: charUUID,
    properties : ['write', 'read', 'notify'],
    onReadRequest : function(offset, callback) {
		console.log(data);
		callback(bleno.Characteristic.RESULT_SUCCESS, data.slice(offset));
		},
    onWriteRequest : function(newData, offset, withoutResponse, callback) {
        if(offset > 0) {
            callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
        } else {
            data = newData;
            console.log(newData);
            callback(bleno.Characteristic.RESULT_SUCCESS);
        }
    },
    onNotify : function () {
		isBTConnected = true;
		console.log(isBTConnected);
	}
})

// ---------------------------------------------------------------------
// bluetooth methods

// Start advertising device
bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising(name, [deviceUUID]);
    } else {
        bleno.stopAdvertising();
    }
});


// Start service
bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    if (!error) {
        bleno.setServices([
            new bleno.PrimaryService({
                uuid: serviceUUID,
                characteristics : [writeCharacteristic]
            })
        ]);
    }
});

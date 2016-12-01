var bleno = require('bleno');
var deviceUUID = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
var serviceUUID = '94f39d29-7d6d-437d-973b-fba39e49d4ee';

var name = 'Tavern';
var WifiCredentialsCharacteristic = require('./wifiCredentialsCharacteristic');


// ---------------------------------------------------------------------
// Bluetooth methods

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
                characteristics : [new WifiCredentialsCharacteristic()]
            })
        ]);
    }
});

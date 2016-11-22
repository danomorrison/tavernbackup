
var exec = require('child_process').exec;

var setNetworkInfo = function (name, password) {
	// Alter network/interfaces to rely on wpa_supplicant.conf
	exec(`echo 'auto lo
    iface lo inet loopback
    iface eth0 inet dhcp
    
    allow-hotplug wlan0
    iface wlan0 inet manual
    wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
    iface default inet dhcp' > /etc/network/interfaces`);
	
	// Insert name and password into wpa_supplicant.conf
	exec(`echo 'ctrl_interface=/var/run/wpa_supplicant
    ctrl_interface_group=0
    update_config=1
    
    
    network={
        ssid="${name}"
        psk="${password}"
        proto=WPA
        key_mgmt=WPA-PSK
        pairwise=TKIP
        group=TKIP
        id_str="${name}"
    }' > /etc/wpa_supplicant/wpa_supplicant.conf`);
    
    // Reset wireless 
    exec('sudo ifdown wlan0');
    exec('sudo ifup wlan0');
}

var checkInternet = function (isConnected) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
			
            isConnected(false);
        } else {
			
            isConnected(true);
        }
    })
}

module.exports = { setNetworkInfo: setNetworkInfo, checkInternet: checkInternet }

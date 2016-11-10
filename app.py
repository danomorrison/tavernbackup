# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import os
import time


def setNetworkFiles(name, pw):
    os.system('''echo "auto lo


iface lo inet loopback
iface eth0 inet dhcp


allow-hotplug wlan0
iface wlan0 inet manual
wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
iface default inet dhcp"''')


    os.system('''echo "ctrl_interface=/var/run/wpa_supplicant
    ctrl_interface_group=0
    update_config=1
    
    
    network={
        ssid=%s
        psk=%s
        proto=WPA
        key_mgmt=WPA-PSK
        pairwise=TKIP
        group=TKIP
        id_str=%s
    }" > /etc/wpa_supplicant/wpa_supplicant.conf''' % (name, pw, name))
              




# If connection is made with client, keep discoverability and bt on until connection is closed


if __name__ == '__main__':
    
    # Make this program start with external button press


    GPIO.setmode(GPIO.BCM)


    # sets pin 17 as input
    GPIO.setup(17,GPIO.IN)


    prev_input = 0


    # Waits
    while True:
        input = GPIO.input(17)
        if ((not prev_input) and input):
            os.system('sudo python3 /home/pi/BlueServer/blueserver.py')
            break
        prev_input = input
        time.sleep(0.05)

import RPi.GPIO as GPIO
import os
import time
import pygame 


def setNetworkFiles(name, pw):
    os.system('''echo 'auto lo


    iface lo inet loopback
    iface eth0 inet dhcp
    
    allow-hotplug wlan0
    iface wlan0 inet manual
    wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
    iface default inet dhcp' > /etc/network/interfaces''')


    os.system('''echo 'ctrl_interface=/var/run/wpa_supplicant
    ctrl_interface_group=0
    update_config=1
    
    
    network={
        ssid="%s"
        psk="%s"
        proto=WPA
        key_mgmt=WPA-PSK
        pairwise=TKIP
        group=TKIP
        id_str="%s"
    }' > /etc/wpa_supplicant/wpa_supplicant.conf''' % (name, pw, name))


    os.system('sudo ifdown wlan0')
    os.system('sudo ifup wlan0')
              




# If connection is made with client, keep discoverability and bt on until connection is closed


if __name__ == '__main__':
    
    # Make this program start with external button press


    GPIO.setmode(GPIO.BCM)


    # sets pin 18 as input
    GPIO.setup(18,GPIO.IN)


    prev_input = 0


    
    while True:
        input = GPIO.input(18)
        if ((not prev_input) and input):
            print('Button Pressed')
            os.system('sudo python3 /home/pi/BlueServer/blueserver.py')
            break
        prev_input = input
        time.sleep(0.05)


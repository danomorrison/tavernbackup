import bluetooth
import os
import sys
import time
import json
from app import *

<<<<<<< HEAD
=======

>>>>>>> 4122b2bb83d84d5fd7c76f77558f72879627bee9
# get references to available RFCOMM socket and port
server_socket = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
port = server_socket.getsockname()[1]

<<<<<<< HEAD
print ('address is %s' % server_socket.getsockname()[0])

# uuid will uniquely identify this server. For now, this uuid is abitrarily generated
uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee'

=======

print ('address is %s' % server_socket.getsockname()[0])


# uuid will uniquely identify this server. For now, this uuid is abitrarily generated
uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee'


>>>>>>> 4122b2bb83d84d5fd7c76f77558f72879627bee9
# bind socket to that port and start listening
server_socket.bind(('',port))
server_socket.listen(1)

<<<<<<< HEAD
# Defines amount of time server will wait to make connection with client
server_socket.settimeout(60)

# Makes pi discoverable and connectable to by other bt devices
os.system('sudo hciconfig hci0 piscan')

=======

# Defines amount of time server will wait to make connection with client
server_socket.settimeout(60)


# Makes pi discoverable and connectable to by other bt devices
os.system('sudo hciconfig hci0 piscan')


>>>>>>> 4122b2bb83d84d5fd7c76f77558f72879627bee9
# Note: in order to make advertise_service run on RBPi, had to load Serial Port Profile and run BT daemon in compatibility mode
bluetooth.advertise_service(server_socket, 'Tavern',
                            service_id = uuid,
                            service_classes = [uuid, bluetooth.SERIAL_PORT_CLASS],
                            profiles = [bluetooth.SERIAL_PORT_PROFILE],)

<<<<<<< HEAD
=======

>>>>>>> 4122b2bb83d84d5fd7c76f77558f72879627bee9
print ('Waiting for connection on RFCOMM channel %d...' % port)
        
# when connection is accepted, returns client_socket and address
# If not accepted after 1 minute, turns off bluetooth discoverability  
try:
        client_socket, address = server_socket.accept()
        print ('Accepted connection from ',address)

<<<<<<< HEAD
=======

>>>>>>> 4122b2bb83d84d5fd7c76f77558f72879627bee9
# If connection is not made with client in specified amount of time, exit script        
except bluetooth.BluetoothError:
        os.system('sudo hciconfig hci0 noscan')
        print ('Time out')
        sys.exit('No successful connection made')
        

<<<<<<< HEAD
=======

>>>>>>> 4122b2bb83d84d5fd7c76f77558f72879627bee9
# receive and print data
try:
        while True:
            data = client_socket.recv(1024)
            if len(data) == 0: break
            print('received [%s]' % data)
            if data == b'music':
                    os.system('mopidy --config /home/pi/.config/mopidy/mopidy.conf')
            if data == b'minecraft':
                    os.system('minecraft-pi')
            if data == b'ping':
                    client_socket.send('pong')
            if data == b'connect':
                    print ('connected')
                    #decoded_data = json.loads(json_encoded)
                    # name = decoded_data['username']
                    # pw = decoded_data['password']
                    
                    setNetworkFiles('Broadplay', '544kingw')
        
                    
except IOError:
    pass

<<<<<<< HEAD
print ('disconnect')

client_socket.close()
server_socket.close()

print('successfully closed all connections')


=======

print ('disconnect')


client_socket.close()
server_socket.close()


print('successfully closed all connections')





>>>>>>> 4122b2bb83d84d5fd7c76f77558f72879627bee9

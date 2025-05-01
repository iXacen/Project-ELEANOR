
from hardware.actuators.fans import all_fans_on, all_fans_off
from hardware.sensors.air_quality import read_air_quality
from hardware.actuators.nutrition_pumps import vitamin_on, vitamin_off
from hardware.actuators.grid_switch import enable_grid, disable_grid
import time

VOLTAGE_THRESHOLD = 20.0  # Akü voltajı eşiği

try:
    while True:
        air_quality = read_air_quality()
        print(f"Hava Kalitesi: {air_quality} ppm")

        # Hava kalitesine göre fan açma/kapama
        if air_quality > 600:  # Örneğin: Hava kötü, fan aç
            all_fans_on()
        else:
            all_fans_off()

        # Akü voltajına göre enerji kaynağı geçişi
        voltage = read_voltage()
        if voltage < VOLTAGE_THRESHOLD:
            enable_grid()  # Şehir elektriği
        else:
            disable_grid()  # Güneş/Akü

        time.sleep(60)  # Bir dakika sonra tekrar kontrol et

except KeyboardInterrupt:
    GPIO.cleanup()

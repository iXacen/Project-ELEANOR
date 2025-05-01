
from ina219 import INA219

SHUNT_OHMS = 0.1  # sensör datasheet'ine göre
ina = INA219(SHUNT_OHMS)
ina.configure()

def read_voltage():
    voltage = ina.voltage()
    print(f"🔋 Akü Voltajı: {voltage:.2f} V")
    return voltage

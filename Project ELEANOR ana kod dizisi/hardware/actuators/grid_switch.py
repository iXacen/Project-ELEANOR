
import RPi.GPIO as GPIO
from config import PINS

GRID_RELAY_PIN = PINS["GRID_RELAY"]

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(GRID_RELAY_PIN, GPIO.OUT)

def enable_grid():
    GPIO.output(GRID_RELAY_PIN, GPIO.HIGH)
    print("⚡ Şehir elektriği AKTİF")

def disable_grid():
    GPIO.output(GRID_RELAY_PIN, GPIO.LOW)
    print("🔋 Güneş/Akü enerjisi AKTİF")

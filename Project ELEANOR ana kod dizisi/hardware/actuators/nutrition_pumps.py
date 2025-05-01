
import RPi.GPIO as GPIO
from config import PINS

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

VITAMIN_PIN = PINS["VITAMIN_PUMP"]
MINERAL_PIN = PINS["MINERAL_PUMP"]

GPIO.setup(VITAMIN_PIN, GPIO.OUT)
GPIO.setup(MINERAL_PIN, GPIO.OUT)

def vitamin_on():
    GPIO.output(VITAMIN_PIN, GPIO.HIGH)
    print("🧪 Vitamin pompası çalışıyor")

def vitamin_off():
    GPIO.output(VITAMIN_PIN, GPIO.LOW)
    print("🧪 Vitamin pompası kapandı")

def mineral_on():
    GPIO.output(MINERAL_PIN, GPIO.HIGH)
    print("🧂 Mineral pompası çalışıyor")

def mineral_off():
    GPIO.output(MINERAL_PIN, GPIO.LOW)
    print("🧂 Mineral pompası kapandı")

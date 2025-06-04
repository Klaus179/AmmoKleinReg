import random
from fake_useragent import UserAgent

def generate_fingerprint():
    ua = UserAgent()
    user_agent = ua.random

    screen_size = random.choice([
        {"width": 1920, "height": 1080},
        {"width": 1366, "height": 768},
        {"width": 1440, "height": 900},
        {"width": 1600, "height": 900},
    ])
    lang = random.choice(["en-US,en;q=0.9", "de-DE,de;q=0.9", "ru-RU,ru;q=0.9"])
    timezone = random.choice(["Europe/Berlin", "UTC", "Europe/Moscow"])

    return {
        "user_agent": user_agent,
        "screen": screen_size,
        "lang": lang,
        "timezone": timezone
    }

# myapp/tasks.py
from celery import Celery, shared_task
from django.db.models import Q

import json
import os

import requests

from .models import UserManager, BankAccount, PhoneVerification, TokenRecord, TokenBalance, CoinStats, MagicKey, BitcoinPrice
from .forms import UserCreationForm, EditProfileForm
from web3 import Web3
#celery_app = Celery('store')
from django.db.models import Max, F
from django.db.models import Subquery, OuterRef
from collections import defaultdict
import re

app = Celery('website')


@shared_task
def my_periodic_bitcoin_price():
    bitcoin_price_cc = 1.0
    # Replace 'your_url_here' with the actual URL you want to query
    url = "https://www.gkenetic.com/gkenetic/?model=btc_h"
    response = requests.get(url)
    last_price = 0.0

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Extract text between square brackets using regular expression
        matches = re.findall(r'\[(.*?)\]', response.text)
        print(matches)
        if matches:
            # Get the last element and split the float value
            last_element = matches[0]
            print(last_element)
            last_float_value = float(last_element.split()[-1])

            bitcoin_price_cc = last_float_value
        else:
            print("No matches found between square brackets.")
    else:
        print(f"Error: {response.status_code}")


    if last_price is not None:
        print(f"The last price is: {last_price}")
    else:
        print("Unable to retrieve the last price.")


    bitcoinprice = BitcoinPrice(
        bitcoin_price=bitcoin_price_cc,
    )
    bitcoinprice.save()

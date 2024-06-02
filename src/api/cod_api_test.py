#MTQzNTA1MTk1OTUwOTc2NTcwNDg6MTcxODQ5ODYxMTQ3MzozNGFmYTJiYjQ2ZTA2NGJmZWFiODI5MTJjMzAyNGEzMQ
#https://my.callofduty.com/api/papi-client
from cod_api import API, platforms
import asyncio

api = API()
api.login('MTQzNTA1MTk1OTUwOTc2NTcwNDg6MTcxODQ5ODYxMTQ3MzozNGFmYTJiYjQ2ZTA2NGJmZWFiODI5MTJjMzAyNGEzMQ')
print(api._Common.loggedIn) # True

print(api.Warzone2.combatHistoryUrl)
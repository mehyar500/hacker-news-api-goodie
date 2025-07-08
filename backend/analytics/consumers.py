# analytics/consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .services import fetch_top_stories

class StoriesConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self): await self.accept()
    async def receive_json(self,_): await self.send_json({'stories':fetch_top_stories()})

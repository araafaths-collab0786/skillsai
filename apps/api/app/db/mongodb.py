"""
Database Connection Layer for MongoDB
Uses Motor (async driver) as default per Phase 1 specification.
Cleanly abstracted so switching to PyMongo AsyncMongoClient requires updating only this adapter.
"""
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import logging
from app.core.config import settings

logger = logging.getLogger("skilllens.db")

class MongoDBManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

    async def connect(self):
        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}")
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=5000,
                maxPoolSize=50,
                minPoolSize=10
            )
            self.db = self.client[settings.MONGO_DB_NAME]
            # Verify connectivity
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB cluster.")
        except Exception as e:
            logger.warning(f"MongoDB connection notice (dev fallback available): {e}")

    async def disconnect(self):
        if self.client:
            logger.info("Closing MongoDB client connection pool.")
            self.client.close()

db_manager = MongoDBManager()

async def get_database() -> AsyncIOMotorDatabase:
    if db_manager.db is None:
        await db_manager.connect()
    return db_manager.db

"""
Seed script to populate properties collection with Feelings Houses data
Run with: python seed_properties.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'feelings_houses')

# Property data from Airbnb
PROPERTIES_DATA = [
    {
        "property_id": "feelings-4",
        "airbnb_id": "51394229",
        "name": {
            "gr": "Feelings #4",
            "en": "Feelings #4"
        },
        "slug": "feelings-4",
        "bedrooms": 1,
        "bathrooms": 1,
        "beds": 3,
        "max_guests": 4,
        "size_sqm": 60,
        "price_per_night": 0,  # To be set by admin
        "description": {
            "gr": "Το σπίτι είναι μια μεζονέτα 60 τ.μ., περιτριγυρισμένη από χωράφια, μόλις 5 λεπτά με τα πόδια από την παραλία του Αγίου Γεωργίου και του Περιβόλου. Από τον επάνω όροφο μπορείτε να θαυμάσετε τη θέα στη θάλασσα, τη θέα στο βουνό και φυσικά την ανατολή του ηλίου!",
            "en": "The house is a 60 sq.m. maisonette, surrounded by fields, just 5 minutes walk from Agios Georgios and Perivolos beach. From the upper floor you can admire the sea view, the mountain view and of course the sunrise!"
        },
        "short_description": {
            "gr": "Άνετη μεζονέτα με θέα στη θάλασσα και το βουνό, 5 λεπτά από την παραλία",
            "en": "Cozy maisonette with sea and mountain views, 5 minutes from the beach"
        },
        "photos": [
            "https://a0.muscache.com/im/pictures/adcf6013-4bca-4cff-9d76-a6510cf01a0c.jpg",
            "https://a0.muscache.com/im/pictures/48123589-4009-4707-8647-152974ed8707.jpg",
            "https://a0.muscache.com/im/pictures/1e10bbe8-0cdf-442b-ba93-7ff8cf0ea795.jpg",
            "https://a0.muscache.com/im/pictures/01c0d33d-23e2-4863-ab75-50e733938773.jpg",
            "https://a0.muscache.com/im/pictures/ec072516-3555-4fe6-b542-c1104a67b6a8.jpg"
        ],
        "amenities": {
            "wifi": True,
            "kitchen": True,
            "parking": True,
            "ac": True,
            "tv": True,
            "washer": True,
            "iron": True,
            "hair_dryer": True,
            "stove_oven": True,
            "dishes_cutlery": True,
            "drying_rack": True,
            "mountain_view": True,
            "sea_view": True,
            "beach_access": True
        },
        "rating": 4.86,
        "review_count": 50,
        "featured": False,
        "active": True
    },
    {
        "property_id": "courtly-love",
        "airbnb_id": "51156919",
        "name": {
            "gr": "Courtly Love",
            "en": "Courtly Love"
        },
        "slug": "courtly-love",
        "bedrooms": 1,
        "bathrooms": 1,
        "beds": 3,
        "max_guests": 4,
        "size_sqm": 60,
        "price_per_night": 0,
        "description": {
            "gr": "Το σπίτι είναι μια μεζονέτα 60 τ.μ., περιτριγυρισμένη από χωράφια, μόλις 5 λεπτά με τα πόδια από την παραλία του Αγίου Γεωργίου και του Περιβόλου. Από τον επάνω όροφο μπορείτε να θαυμάσετε τη θέα στη θάλασσα, τη θέα στο βουνό και φυσικά την ανατολή του ηλίου!",
            "en": "The house is a 60 sq.m. maisonette, surrounded by fields, just 5 minutes walk from Agios Georgios and Perivolos beach. From the upper floor you can admire the sea view, the mountain view and of course the sunrise!"
        },
        "short_description": {
            "gr": "Άνετη μεζονέτα με θέα, 5 λεπτά από την παραλία",
            "en": "Cozy maisonette with views, 5 minutes from the beach"
        },
        "photos": [
            "https://a0.muscache.com/im/pictures/f7753e8d-bd2d-462b-a6ea-b92b7c1c8115.jpg",
            "https://a0.muscache.com/im/pictures/43b8f9a0-3f8e-41f0-a2d5-b84aa5866276.jpg",
            "https://a0.muscache.com/im/pictures/fda7e404-cc57-4f09-bf2a-2affd7877df8.jpg",
            "https://a0.muscache.com/im/pictures/d3e3bbe8-64ef-4efa-a78e-625ed5a947aa.jpg",
            "https://a0.muscache.com/im/pictures/98b5a49f-b9fd-4c56-9fee-eb3e17aa44e9.jpg"
        ],
        "amenities": {
            "wifi": True,
            "kitchen": True,
            "parking": True,
            "ac": True,
            "tv": True,
            "washer": True,
            "iron": True,
            "hair_dryer": True,
            "stove_oven": True,
            "dishes_cutlery": True,
            "drying_rack": True,
            "mountain_view": True,
            "sea_view": True,
            "beach_access": True
        },
        "rating": 4.9,
        "review_count": 58,
        "featured": True,
        "active": True
    },
    {
        "property_id": "the-journey",
        "airbnb_id": "27736860",
        "name": {
            "gr": "Το Ταξίδι",
            "en": "The Journey"
        },
        "slug": "the-journey",
        "bedrooms": 1,
        "bathrooms": 1,
        "beds": 3,
        "max_guests": 4,
        "size_sqm": 58,
        "price_per_night": 0,
        "description": {
            "gr": "Αυτό το άνετο σπίτι 58 τ.μ. αποτελείται από ισόγειο και πρώτο όροφο που συνδέονται με εσωτερική σκάλα. Στον επάνω όροφο υπάρχει ένα ωραίο μπαλκόνι (το καλύτερο μέρος για να δείτε την ανατολή του ηλίου με θέα στο βουνό και τη θάλασσα) και ένα υπνοδωμάτιο με ένα διπλό κρεβάτι.",
            "en": "This cozy 58 sq.m. house consists of ground floor and first floor connected by an internal staircase. On the upper floor there is a nice balcony (the best place to see the sunrise with mountain and sea views) and a bedroom with a double bed."
        },
        "short_description": {
            "gr": "Άνετο σπίτι με τζάκι και υπέροχη ανατολή ηλίου",
            "en": "Cozy house with fireplace and beautiful sunrise"
        },
        "photos": [
            "https://a0.muscache.com/im/pictures/86b4b999-09ff-4ecc-87fc-112504ade0c2.jpg",
            "https://a0.muscache.com/im/pictures/hosting/Hosting-27736860/original/44b4df68-029b-40dc-b377-da2572b0ca24.jpeg",
            "https://a0.muscache.com/im/pictures/ce43832d-ebf3-4805-aa61-ab80808e320c.jpg",
            "https://a0.muscache.com/im/pictures/dfe1ea99-b761-4c09-a38a-512f2f01f00b.jpg",
            "https://a0.muscache.com/im/pictures/1c6a7e37-1fa3-4154-a07d-39bb1c99e965.jpg"
        ],
        "amenities": {
            "wifi": True,
            "kitchen": True,
            "parking": True,
            "ac": True,
            "tv": True,
            "washer": True,
            "iron": True,
            "hair_dryer": True,
            "stove_oven": True,
            "dishes_cutlery": True,
            "drying_rack": True,
            "mountain_view": True,
            "sea_view": True,
            "beach_access": True
        },
        "rating": 4.95,
        "review_count": 102,
        "featured": True,
        "active": True
    },
    {
        "property_id": "feelings-houses",
        "airbnb_id": "20455818",
        "name": {
            "gr": "Feelings Houses",
            "en": "Feelings Houses"
        },
        "slug": "feelings-houses",
        "bedrooms": 2,
        "bathrooms": 1,
        "beds": 4,
        "max_guests": 5,
        "size_sqm": 75,
        "price_per_night": 0,
        "description": {
            "gr": "Το σπίτι 'Feelings' είναι μια μεζονέτα 75 τ.μ., που περιβάλλεται από χωράφια, μόλις 5 λεπτά με τα πόδια από την παραλία του Αγίου Γεωργίου και του Περιβόλου. Από τον επάνω όροφο μπορείτε να θαυμάσετε τη θέα στη θάλασσα, τη θέα στο βουνό και φυσικά την ανατολή του ηλίου!",
            "en": "The 'Feelings' house is a 75 sq.m. maisonette, surrounded by fields, just 5 minutes walk from Agios Georgios and Perivolos beach. From the upper floor you can admire the sea view, the mountain view and of course the sunrise!"
        },
        "short_description": {
            "gr": "Ευρύχωρη μεζονέτα με 2 υπνοδωμάτια και θέα",
            "en": "Spacious maisonette with 2 bedrooms and views"
        },
        "photos": [
            "https://a0.muscache.com/im/pictures/8b2c981c-af77-4d03-8239-f67198c0fdfb.jpg",
            "https://a0.muscache.com/im/pictures/c52abe46-098d-4cdf-b6d2-027dcc3b5606.jpg",
            "https://a0.muscache.com/im/pictures/318808c7-311b-4e79-b9c6-2b1e7f48bb9f.jpg",
            "https://a0.muscache.com/im/pictures/90fd3c31-23a0-465a-99d1-215d38445776.jpg",
            "https://a0.muscache.com/im/pictures/f1226b82-fe08-432d-9228-86d812dcfba3.jpg"
        ],
        "amenities": {
            "wifi": True,
            "kitchen": True,
            "parking": True,
            "ac": True,
            "tv": True,
            "washer": True,
            "iron": True,
            "hair_dryer": True,
            "stove_oven": True,
            "dishes_cutlery": True,
            "drying_rack": True,
            "mountain_view": True,
            "sea_view": False,
            "beach_access": True
        },
        "rating": 4.92,
        "review_count": 96,
        "featured": True,
        "active": True
    }
]

async def seed_properties():
    """Seed properties collection"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    properties_collection = db.properties
    
    print(f"🌱 Seeding properties to {DB_NAME}.properties...")
    
    # Clear existing properties (optional - comment out if you want to keep existing)
    # await properties_collection.delete_many({})
    # print("✅ Cleared existing properties")
    
    # Insert properties
    for prop_data in PROPERTIES_DATA:
        # Check if property already exists
        existing = await properties_collection.find_one({"property_id": prop_data["property_id"]})
        
        if existing:
            print(f"⚠️  Property '{prop_data['name']['en']}' already exists - skipping")
            continue
        
        # Add timestamps
        prop_data["created_at"] = datetime.utcnow()
        prop_data["updated_at"] = datetime.utcnow()
        
        await properties_collection.insert_one(prop_data)
        print(f"✅ Added property: {prop_data['name']['en']} ({prop_data['property_id']})")
    
    print(f"\n🎉 Seeding complete! Total properties: {await properties_collection.count_documents({})}")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_properties())

# iCal Calendar Sync Implementation

## ✅ Τι υλοποιήθηκε:

### Backend (FastAPI + MongoDB)

1. **iCal Parser Service** (`/app/backend/services/ical_sync_service.py`)
   - Fetch iCal feeds από Airbnb/Booking.com
   - Parse blocked dates από events
   - Έλεγχος διαθεσιμότητας
   - Booking hold mechanism (15 λεπτά)

2. **Calendar API Routes** (`/app/backend/routes/calendar_routes.py`)
   - `POST /api/calendar/calendar-sources` - Προσθήκη iCal URL
   - `GET /api/calendar/availability/{property_id}` - Έλεγχος διαθεσιμότητας
   - `POST /api/calendar/sync/{property_id}` - Manual sync
   - `POST /api/calendar/booking-hold` - Δημιουργία hold
   - `GET /api/calendar/blocked-dates/{property_id}` - Κλεισμένες ημερομηνίες

3. **Scheduled Sync** (`server.py`)
   - Αυτόματο sync κάθε 30 λεπτά
   - Cleanup expired holds
   - APScheduler integration

### MongoDB Collections

- `calendar_sources` - iCal URLs από κάθε πλατφόρμα
- `blocked_dates` - Κλεισμένες ημερομηνίες από sync
- `booking_holds` - Temporary holds κατά το booking

### Προστασία από διπλές κρατήσεις

1. Real-time availability check
2. 15λεπτο booking hold
3. Automatic hold expiration
4. Multi-source blocking (Airbnb + Booking.com)

## 📋 Next Steps:

### Για τον χρήστη:

1. **Πάρτε iCal URLs:**
   - Airbnb: Calendar → Export calendar → Copy URL
   - Booking.com: Extranet → Rates & Availability → Sync calendars → Export

2. **Προσθέστε τα URLs μέσω API:**
   ```bash
   curl -X POST "YOUR_BACKEND_URL/api/calendar/calendar-sources" \
     -H "Content-Type: application/json" \
     -d '{
       "property_id": 1,
       "platform": "airbnb",
       "ical_url": "YOUR_ICAL_URL"
     }'
   ```

3. **Περιμένετε sync** (max 30 λεπτά)

### Frontend Integration (Επόμενο):

- Admin panel για διαχείριση iCal URLs
- Real-time availability στο booking form
- Blocked dates visualization σε calendar
- Booking hold UI feedback

## 🔧 Testing:

```bash
# Test API health
curl http://localhost:8001/api/

# Test calendar source addition (after getting iCal URLs)
curl -X POST "http://localhost:8001/api/calendar/calendar-sources" \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "platform": "airbnb",
    "ical_url": "YOUR_ICAL_URL_HERE"
  }'

# Check availability
curl "http://localhost:8001/api/calendar/availability/1?check_in=2024-12-15&check_out=2024-12-20"
```

## ⚠️ Σημαντικό:

- iCal έχει delay 30 λεπτά - 3 ώρες
- Χρησιμοποιούμε 15λεπτο hold για προστασία
- Για μηδενικό ρίσκο → Channel Manager (€50-100/μήνα)
- Ενημερώστε manual τις πλατφόρμες όταν κάνετε κράτηση

## 📚 Αρχεία που δημιουργήθηκαν:

1. `/app/backend/services/ical_sync_service.py` - Core sync logic
2. `/app/backend/routes/calendar_routes.py` - API endpoints
3. `/app/backend/models/calendar_models.py` - Pydantic models
4. `/app/ICAL_SYNC_SETUP.md` - Detailed setup guide
5. `/app/ICAL_IMPLEMENTATION.md` - This file

Το σύστημα είναι έτοιμο! Χρειάζεστε μόνο τα iCal URLs για να ξεκινήσετε!

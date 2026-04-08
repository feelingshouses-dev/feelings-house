# 📅 iCal Calendar Sync - Οδηγίες Ρύθμισης

## 🎯 Τι είναι το iCal Sync;

Το iCal Sync συγχρονίζει αυτόματα τις κρατήσεις από Airbnb και Booking.com στο website σας κάθε **30 λεπτά**.

⚠️ **ΣΗΜΑΝΤΙΚΟ**: Υπάρχει delay 30 λεπτά - 3 ώρες, οπότε υπάρχει μικρός κίνδυνος διπλής κράτησης. Για αυτό προσθέσαμε **15λεπτο booking hold** για προστασία.

---

## 📋 Πώς να πάρετε το iCal URL

### 🏠 AIRBNB

1. **Συνδεθείτε στο Airbnb** → https://www.airbnb.com/hosting
2. Πηγαίνετε στο **Calendar** του κάθε σπιτιού
3. Κάντε κλικ στο **"Availability settings"** (ή "Import/Export calendar")
4. Βρείτε την επιλογή **"Export calendar"**
5. Αντιγράψτε το **Calendar address (URL)** που τελειώνει σε `.ics`

**Παράδειγμα URL:**
```
https://www.airbnb.com/calendar/ical/[LISTING_ID].ics?s=[SECRET_KEY]
```

### 🏨 BOOKING.COM

1. **Συνδεθείτε στο Booking.com Extranet** → https://admin.booking.com
2. Πηγαίνετε στο **Rates & Availability**
3. Κλικ στο **"Sync calendars"** ή **"Calendar sync"**
4. Επιλέξτε το σπίτι σας
5. Βρείτε το **"Export calendar"** section
6. Αντιγράψτε το **iCal link** που τελειώνει σε `.ics`

**Παράδειγμα URL:**
```
https://admin.booking.com/hotel/hoteladmin/ical.html?t=[TOKEN]
```

---

## 🚀 Πώς να προσθέσετε τα iCal URLs στο σύστημα

### Μέθοδος 1: Μέσω API (για developers)

```bash
curl -X POST "https://your-domain.com/api/calendar/calendar-sources" \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "platform": "airbnb",
    "ical_url": "https://www.airbnb.com/calendar/ical/12345.ics?s=abc123"
  }'
```

### Μέθοδος 2: Μέσω Frontend (θα το φτιάξουμε)

Θα προσθέσουμε μια **Admin σελίδα** όπου μπορείτε να:
- Προσθέσετε iCal URLs
- Δείτε την κατάσταση sync
- Δείτε ποιες ημερομηνίες είναι κλεισμένες

---

## 🔄 Πώς λειτουργεί η προστασία από διπλές κρατήσεις

1. **Ο επισκέπτης επιλέγει ημερομηνίες** → Το σύστημα ελέγχει διαθεσιμότητα
2. **Αν είναι διαθέσιμο** → Δημιουργείται **15λεπτο hold**
3. **Κατά τη διάρκεια του hold** → Κανείς άλλος δεν μπορεί να κλείσει αυτές τις ημέρες
4. **Μετά την πληρωμή** → Το hold γίνεται confirmed booking
5. **Αν δεν ολοκληρώσει** → Το hold λήγει μετά από 15 λεπτά

---

## ⏰ Συχνότητα Συγχρονισμού

- **Αυτόματο sync**: Κάθε 30 λεπτά
- **Manual sync**: Μπορείτε να το τρέξετε οποτεδήποτε
- **Cleanup**: Expired holds καθαρίζονται αυτόματα

---

## 🎬 Επόμενα Βήματα

1. ✅ Πάρτε τα iCal URLs από Airbnb και Booking.com
2. ✅ Προσθέστε τα στο σύστημα
3. ✅ Περιμένετε το πρώτο sync (30 λεπτά max)
4. ✅ Ελέγξτε ότι οι κλεισμένες ημερομηνίες εμφανίζονται

---

## 📊 API Endpoints που έχουμε

### Προσθήκη Calendar Source
```
POST /api/calendar/calendar-sources
Body: {
  "property_id": 1,
  "platform": "airbnb",
  "ical_url": "..."
}
```

### Έλεγχος Διαθεσιμότητας
```
GET /api/calendar/availability/1?check_in=2024-12-15&check_out=2024-12-20
```

### Manual Sync
```
POST /api/calendar/sync/1
```

### Δημιουργία Booking Hold
```
POST /api/calendar/booking-hold
Body: {
  "property_id": 1,
  "check_in": "2024-12-15",
  "check_out": "2024-12-20",
  "guest_email": "guest@example.com"
}
```

---

## ⚠️ Σημαντικές Συμβουλές

1. **Μην χρησιμοποιείτε 2-way sync** - Μόνο import από Airbnb/Booking.com
2. **Ενημερώστε χειροκίνητα** τις πλατφόρμες όταν κάνετε κράτηση στο site σας
3. **Ελέγχετε τακτικά** το sync status
4. **Προτείνετε στους επισκέπτες** να τηλεφωνήσουν για επιβεβαίωση

---

## 🆘 Troubleshooting

### "Sync Failed" Error
- Ελέγξτε ότι το iCal URL είναι σωστό
- Βεβαιωθείτε ότι το URL τελειώνει σε `.ics`
- Δοκιμάστε να ανοίξετε το URL σε browser - πρέπει να κατεβάσει αρχείο

### Δεν εμφανίζονται κλεισμένες ημερομηνίες
- Περιμένετε 30 λεπτά για το πρώτο sync
- Κάντε manual sync: `POST /api/calendar/sync/{property_id}`
- Ελέγξτε τα logs: `tail -n 100 /var/log/supervisor/backend.*.log`

### Διπλή κράτηση παρόλα αυτά
- Αν συμβεί, ενημερώστε άμεσα τον επισκέπτη
- Προσφέρετε εναλλακτικό σπίτι ή επιστροφή χρημάτων
- Εξετάστε Channel Manager για μηδενικό ρίσκο

---

Για οποιαδήποτε ερώτηση, ελέγξτε τα logs ή επικοινωνήστε μαζί μας!

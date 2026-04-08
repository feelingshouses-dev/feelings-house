# PRD: Santorini Vacation Rentals Website

## Original Problem Statement
Φτιάξε μου ένα website για ενοικιαζόμενα δωμάτια στη Σαντορίνη. Χρειάζομαι: αρχική σελίδα με φωτογραφίες δωματίων, φόρμα επικοινωνίας/κράτησης, πληροφορίες για παροχές και τοποθεσία, και γκαλερί φωτογραφιών.

## User Requirements
- **Style**: Μεσογειακό/Κυκλαδίτικο (λευκό-μπλε, minimal)
- **Properties**: 4 κανονικά φουλ εξοπλισμένα σπίτια
- **Booking System**: Σύστημα κρατήσεων με επιλογή ημερομηνιών και online πληρωμές (Stripe)
- **Amenities**: TV, WiFi, A/C, θέα, parking
- **Photos**: Stock images initially (to be replaced by client photos later)

## User Personas
1. **Tourist**: Looking for vacation rental in Santorini with sea view
2. **Family**: Needs fully-equipped house with multiple bedrooms
3. **Couple**: Looking for romantic getaway with sunset views

## Architecture
- **Frontend**: React with Shadcn UI components
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Payment**: Stripe integration (planned)
- **Design**: Mediterranean/Cycladic theme (white-blue, minimal)

## What's Been Implemented (2024-12-08)

### ✅ Frontend (Mock Data Phase)
1. **Homepage** (`/`)
   - Hero section with Santorini sunset image
   - Featured properties section (4 houses)
   - Amenities showcase
   - CTA section

2. **Properties Page** (`/properties`)
   - Grid display of all 4 houses
   - Filter by bedrooms (2 or 3 bedrooms)
   - Property details (guests, bedrooms, bathrooms)
   - Direct booking links

3. **Booking Page** (`/booking`)
   - Date selection with calendar (shadcn Calendar component)
   - Guest count selector
   - Personal information form
   - Mock payment form (Stripe placeholder)
   - Booking summary with price calculation
   - Mock availability check (localStorage)

4. **Gallery Page** (`/gallery`)
   - Masonry grid layout
   - 6 curated Santorini images
   - Hover effects

5. **Contact Page** (`/contact`)
   - Contact form (mock submission to localStorage)
   - Contact information cards
   - Map placeholder

6. **Components**
   - Header with navigation
   - Footer with links and contact info
   - All pages responsive

### Mock Data Structure
```javascript
// Properties (4 houses)
- Σπίτι Caldera View (€250/night, 2BR, 2BA, 4 guests)
- Σπίτι Aegean Blue (€280/night, 3BR, 2BA, 6 guests)
- Σπίτι Sunset Paradise (€220/night, 2BR, 1BA, 4 guests)
- Σπίτι White Dream (€300/night, 3BR, 3BA, 6 guests)

// Mock bookings stored in localStorage
// Mock contact submissions stored in localStorage
```

## Prioritized Backlog

### P0 - Backend Development (Next Phase)
1. **Database Models**
   - Property model
   - Booking model
   - Contact submission model
   - User model (admin)

2. **API Endpoints**
   - `GET /api/properties` - List all properties
   - `GET /api/properties/:id` - Get property details
   - `POST /api/bookings` - Create booking
   - `GET /api/bookings/:id` - Get booking details
   - `POST /api/bookings/:id/payment` - Process payment (Stripe)
   - `GET /api/availability` - Check availability
   - `POST /api/contact` - Submit contact form

3. **Stripe Integration**
   - Payment intent creation
   - Payment confirmation
   - Webhook handling
   - Refund handling

4. **Admin Features**
   - View all bookings
   - Manage availability
   - View contact submissions

### P1 - Enhanced Features
1. Email notifications (booking confirmation, contact form)
2. Admin dashboard
3. Image upload for property owner
4. Multi-language support (Greek/English)
5. Reviews and ratings

### P2 - Nice to Have
1. Seasonal pricing
2. Discount codes
3. Calendar sync with other platforms
4. Virtual tours
5. Weather widget

## Next Tasks
1. ✅ Confirm frontend design and functionality with user
2. 🔄 Build backend with MongoDB models and API endpoints
3. 🔄 Integrate Stripe for payment processing
4. 🔄 Connect frontend to backend (remove mock data)
5. 🔄 Test end-to-end booking flow
6. 🔄 Deploy to production

## API Contracts (To Be Implemented)

### Properties API
```
GET /api/properties
Response: [{ id, name, description, price, image, bedrooms, bathrooms, maxGuests, amenities }]

GET /api/properties/:id
Response: { id, name, description, price, images[], bedrooms, bathrooms, maxGuests, amenities[], location }
```

### Bookings API
```
POST /api/bookings
Body: { propertyId, checkIn, checkOut, guests, firstName, lastName, email, phone }
Response: { id, status, total, paymentIntent }

GET /api/availability
Query: ?propertyId=1&checkIn=2024-12-10&checkOut=2024-12-15
Response: { available: true/false }
```

### Contact API
```
POST /api/contact
Body: { name, email, phone, message }
Response: { success: true, id }
```

## Design System
- **Primary Color**: Blue (#3b82f6)
- **Font**: Inter
- **Components**: Shadcn UI
- **Theme**: Light with blue accents
- **Layout**: Responsive, mobile-first

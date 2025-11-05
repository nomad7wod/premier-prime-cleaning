#!/usr/bin/env python3
"""
Generate additional test bookings for Premier Prime cleaning service
"""
import requests
import json
import random
from datetime import datetime, timedelta

# API Configuration
BASE_URL = "http://localhost:8080/api"
ADMIN_EMAIL = "admin@premierprime.com"
ADMIN_PASSWORD = "admin123"

# Sample data for generating realistic bookings
GUEST_CUSTOMERS = [
    {"name": "Sarah Martinez", "email": "sarah.martinez@gmail.com", "phone": "555-0301"},
    {"name": "David Chen", "email": "david.chen@yahoo.com", "phone": "555-0302"},
    {"name": "Lisa Johnson", "email": "lisa.johnson@hotmail.com", "phone": "555-0303"},
    {"name": "Michael Brown", "email": "m.brown@outlook.com", "phone": "555-0304"},
    {"name": "Emily Davis", "email": "emily.davis@gmail.com", "phone": "555-0305"},
    {"name": "Carlos Rodriguez", "email": "c.rodriguez@email.com", "phone": "555-0306"},
    {"name": "Anna Wilson", "email": "anna.wilson@mail.com", "phone": "555-0307"},
    {"name": "James Taylor", "email": "james.taylor@web.com", "phone": "555-0308"},
    {"name": "Maria Garcia", "email": "maria.garcia@net.com", "phone": "555-0309"},
    {"name": "Robert Kim", "email": "robert.kim@domain.com", "phone": "555-0310"},
    {"name": "Jennifer Lee", "email": "jennifer.lee@site.com", "phone": "555-0311"},
    {"name": "Thomas Anderson", "email": "t.anderson@mail.net", "phone": "555-0312"},
    {"name": "Amy Thompson", "email": "amy.thompson@web.org", "phone": "555-0313"},
    {"name": "Daniel White", "email": "daniel.white@email.net", "phone": "555-0314"},
    {"name": "Rachel Green", "email": "rachel.green@test.com", "phone": "555-0315"},
]

ADDRESSES = [
    "123 Maple Street, Apartment 2A",
    "456 Oak Avenue, House",
    "789 Pine Boulevard, Condo 15",
    "321 Elm Drive, Townhouse",
    "654 Cedar Lane, House #7",
    "987 Birch Court, Apartment 5B",
    "147 Spruce Street, Office Suite 301",
    "258 Walnut Avenue, Duplex",
    "369 Hickory Drive, Penthouse",
    "741 Poplar Street, Studio 12",
    "852 Chestnut Lane, House",
    "963 Sycamore Avenue, Condo A",
    "159 Ash Street, Corporate Center",
    "357 Dogwood Circle, House",
    "468 Redwood Street, Apartment 9C",
    "579 Juniper Lane, Office Building",
    "681 Cypress Court, Medical Complex",
    "792 Magnolia Drive, Retail Space",
    "813 Willow Avenue, House #23",
    "924 Cherry Street, Apartment 6D",
]

SPECIAL_INSTRUCTIONS = [
    "Please call before arriving",
    "Deep clean the kitchen and bathrooms",
    "Pet-friendly household - 2 cats",
    "Extra attention to hardwood floors",
    "Move-in cleaning required",
    "Post-construction cleanup",
    "Weekly recurring service",
    "Holiday deep cleaning",
    "Spring cleaning special",
    "Pre-party preparation",
    "Post-event cleanup",
    "Allergy-sensitive environment",
    "Use eco-friendly products only",
    "Focus on high-traffic areas",
    "Include garage and basement",
    "Windows need cleaning too",
    "First-time customer",
    "VIP client - premium service",
    "Commercial space - after hours",
    "Medical facility - sanitization required",
]

# Service IDs (from database)
SERVICES = {
    1: {"name": "Basic House Cleaning", "base_price": 80, "duration": 2},
    2: {"name": "Deep House Cleaning", "base_price": 150, "duration": 4},
    3: {"name": "Office Cleaning", "base_price": 120, "duration": 3},
}

STATUSES = ["pending", "confirmed", "in_progress", "completed", "cancelled"]
STATUS_WEIGHTS = [30, 40, 10, 15, 5]  # Probability weights

TIME_SLOTS = [
    "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
]

def get_admin_token():
    """Get admin authentication token"""
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise Exception(f"Failed to login: {response.text}")

def generate_random_date(start_date, end_date):
    """Generate a random date between start and end dates"""
    time_between = end_date - start_date
    days_between = time_between.days
    random_days = random.randrange(days_between)
    return start_date + timedelta(days=random_days)

def calculate_price(service_id, square_meters):
    """Calculate price based on service and square meters"""
    base_price = SERVICES[service_id]["base_price"]
    # Price per square meter varies by service type
    if service_id == 1:  # Basic
        return base_price + (square_meters * 0.8)
    elif service_id == 2:  # Deep
        return base_price + (square_meters * 1.2)
    else:  # Office
        return base_price + (square_meters * 0.6)

def create_guest_booking(customer, service_id, date, time, address, square_meters, instructions, status):
    """Create a guest booking"""
    booking_data = {
        "guest_name": customer["name"],
        "guest_email": customer["email"],
        "guest_phone": customer["phone"],
        "service_id": service_id,
        "scheduled_date": date.strftime("%Y-%m-%d"),
        "scheduled_time": time,
        "address": address,
        "square_meters": square_meters,
        "special_instructions": instructions,
        "total_price": calculate_price(service_id, square_meters)
    }
    
    response = requests.post(f"{BASE_URL}/guest/booking", json=booking_data)
    if response.status_code == 201:
        booking_id = response.json()["booking"]["id"]
        print(f"✓ Created guest booking #{booking_id} for {customer['name']} on {date.strftime('%Y-%m-%d')} at {time}")
        
        # Update status if not pending
        if status != "pending":
            update_booking_status(booking_id, status)
        
        return booking_id
    else:
        print(f"✗ Failed to create booking for {customer['name']}: {response.text}")
        return None

def update_booking_status(booking_id, status):
    """Update booking status (admin operation)"""
    try:
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        update_data = {"status": status}
        
        response = requests.put(f"{BASE_URL}/admin/bookings/{booking_id}", 
                               json=update_data, headers=headers)
        if response.status_code == 200:
            print(f"  ✓ Updated booking #{booking_id} status to {status}")
        else:
            print(f"  ✗ Failed to update booking #{booking_id} status: {response.text}")
    except Exception as e:
        print(f"  ✗ Error updating booking status: {e}")

def generate_bookings(count=30):
    """Generate multiple bookings"""
    print(f"Generating {count} additional bookings...")
    
    # Date range: next 60 days
    start_date = datetime.now() + timedelta(days=1)
    end_date = datetime.now() + timedelta(days=60)
    
    for i in range(count):
        customer = random.choice(GUEST_CUSTOMERS)
        service_id = random.choice(list(SERVICES.keys()))
        date = generate_random_date(start_date, end_date)
        time = random.choice(TIME_SLOTS)
        address = random.choice(ADDRESSES)
        square_meters = random.randint(50, 400)
        instructions = random.choice(SPECIAL_INSTRUCTIONS)
        status = random.choices(STATUSES, weights=STATUS_WEIGHTS)[0]
        
        # Skip weekends for office cleaning
        if service_id == 3 and date.weekday() >= 5:
            continue
            
        # Avoid creating bookings too close together
        # (In a real system, you'd check existing bookings)
        
        create_guest_booking(customer, service_id, date, time, address, 
                           square_meters, instructions, status)

def create_quote_requests(count=10):
    """Generate quote requests"""
    print(f"Generating {count} quote requests...")
    
    for i in range(count):
        customer = random.choice(GUEST_CUSTOMERS)
        service_id = random.choice(list(SERVICES.keys()))
        square_meters = random.randint(80, 500)
        
        quote_data = {
            "name": customer["name"],
            "email": customer["email"],
            "phone": customer["phone"],
            "service_id": service_id,
            "address": random.choice(ADDRESSES),
            "square_meters": square_meters,
            "description": f"Quote request for {SERVICES[service_id]['name'].lower()}. {random.choice(SPECIAL_INSTRUCTIONS)}",
            "preferred_date": (datetime.now() + timedelta(days=random.randint(7, 30))).strftime("%Y-%m-%d"),
            "preferred_time": random.choice(TIME_SLOTS)
        }
        
        response = requests.post(f"{BASE_URL}/quote", json=quote_data)
        if response.status_code == 201:
            print(f"✓ Created quote request for {customer['name']}")
        else:
            print(f"✗ Failed to create quote for {customer['name']}: {response.text}")

def create_contact_messages(count=8):
    """Generate contact messages"""
    print(f"Generating {count} contact messages...")
    
    message_types = [
        "Question about services",
        "Scheduling inquiry", 
        "Billing question",
        "Service feedback",
        "Complaint resolution",
        "Partnership inquiry",
        "Service area question",
        "Pricing information"
    ]
    
    messages = [
        "Hi, I'm interested in your deep cleaning service. What's included?",
        "Can you provide weekly cleaning for my office space?",
        "I have a question about my recent invoice.",
        "Your team did an excellent job last week! Thank you.",
        "I need to reschedule my upcoming appointment.",
        "Do you offer emergency cleaning services?",
        "What cleaning products do you use? I have allergies.",
        "Can you clean a 3-bedroom house in under 3 hours?",
        "I'm moving out and need a deep clean for deposit refund.", 
        "Do you provide cleaning services on weekends?"
    ]
    
    for i in range(count):
        customer = random.choice(GUEST_CUSTOMERS)
        
        contact_data = {
            "name": customer["name"],
            "email": customer["email"],
            "phone": customer["phone"],
            "subject": random.choice(message_types),
            "message": random.choice(messages)
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=contact_data)
        if response.status_code == 201:
            print(f"✓ Created contact message from {customer['name']}")
        else:
            print(f"✗ Failed to create contact message: {response.text}")

if __name__ == "__main__":
    print("🧹 Premier Prime Test Data Generator")
    print("=" * 50)
    
    try:
        # Generate test data
        generate_bookings(35)
        print()
        create_quote_requests(12)
        print()
        create_contact_messages(10)
        
        print("\n" + "=" * 50) 
        print("✅ Test data generation complete!")
        print("\nNow you can test:")
        print("📅 Calendar with 50+ bookings across next 2 months")
        print("💬 Quote management with varied requests")
        print("📞 Contact message handling")
        print("📊 Booking analytics and reporting")
        
    except Exception as e:
        print(f"❌ Error: {e}")
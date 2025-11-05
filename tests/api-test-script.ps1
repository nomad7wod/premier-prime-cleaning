#!/usr/bin/env pwsh
# API Testing Script for Premier Prime Cleaning Service

$baseUrl = "http://localhost:8080/api"
$errors = @()
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    try {
        Write-Host "Testing: $Description" -ForegroundColor Yellow
        Write-Host "  $Method $Url" -ForegroundColor Gray
        
        $response = $null
        $actualStatus = 0
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ErrorAction SilentlyContinue
            $actualStatus = 200
        } elseif ($Method -eq "POST" -or $Method -eq "PUT") {
            if ($Body) {
                $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -Body $Body -ContentType "application/json" -ErrorAction SilentlyContinue
            } else {
                $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ErrorAction SilentlyContinue
            }
            $actualStatus = if ($Method -eq "POST") { 201 } else { 200 }
        } elseif ($Method -eq "DELETE") {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ErrorAction SilentlyContinue
            $actualStatus = 204
        }
        
        Write-Host "  ✓ Success" -ForegroundColor Green
        $global:testResults += [PSCustomObject]@{
            Method = $Method
            Url = $Url
            Description = $Description
            Status = "PASS"
            ExpectedStatus = $ExpectedStatus
            ActualStatus = $actualStatus
            Response = $response
            Error = $null
        }
        return $response
    }
    catch {
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { "N/A" }
        $errorMessage = $_.Exception.Message
        
        Write-Host "  ✗ Failed: Status $statusCode - $errorMessage" -ForegroundColor Red
        
        $global:errors += "[$Method] $Url - $Description : $errorMessage (Status: $statusCode)"
        $global:testResults += [PSCustomObject]@{
            Method = $Method
            Url = $Url
            Description = $Description
            Status = "FAIL"
            ExpectedStatus = $ExpectedStatus
            ActualStatus = $statusCode
            Response = $null
            Error = $errorMessage
        }
        return $null
    }
}

Write-Host "=== PREMIER PRIME CLEANING SERVICE API TESTING ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Public Endpoints
Write-Host "1. TESTING PUBLIC ENDPOINTS" -ForegroundColor Magenta
Write-Host "=" * 50

# Services endpoint
$services = Test-Endpoint -Method "GET" -Url "$baseUrl/services" -Description "Get all services"

# FAQ endpoint  
$faqs = Test-Endpoint -Method "GET" -Url "$baseUrl/faq" -Description "Get FAQs"

# Available slots (might fail if no implementation)
Test-Endpoint -Method "GET" -Url "$baseUrl/available-slots" -Description "Get available time slots"

# Quote estimate (might need params)
Test-Endpoint -Method "GET" -Url "$baseUrl/quote/estimate?service_id=1&square_meters=100" -Description "Get quote estimate"

Write-Host ""

# Test 2: Authentication endpoints
Write-Host "2. TESTING AUTHENTICATION ENDPOINTS" -ForegroundColor Magenta  
Write-Host "=" * 50

# Register new user
$registerBody = @{
    email = "test@test.com"
    password = "password123"
    first_name = "Test"
    last_name = "User"
    phone = "123-456-7890"
} | ConvertTo-Json

$registerResponse = Test-Endpoint -Method "POST" -Url "$baseUrl/auth/register" -Description "Register new user" -Body $registerBody -ExpectedStatus 201

# Login  
$loginBody = @{
    email = "test@test.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Test-Endpoint -Method "POST" -Url "$baseUrl/auth/login" -Description "Login user" -Body $loginBody

$token = $null
if ($loginResponse -and $loginResponse.access_token) {
    $token = $loginResponse.access_token
    Write-Host "  Token obtained: $($token.Substring(0, 20))..." -ForegroundColor Green
}

# Login admin for admin tests
$adminLoginBody = @{
    email = "admin@premierprime.com"
    password = "admin123"
} | ConvertTo-Json

$adminLoginResponse = Test-Endpoint -Method "POST" -Url "$baseUrl/auth/login" -Description "Login admin user" -Body $adminLoginBody

$adminToken = $null
if ($adminLoginResponse -and $adminLoginResponse.access_token) {
    $adminToken = $adminLoginResponse.access_token
    Write-Host "  Admin token obtained: $($adminToken.Substring(0, 20))..." -ForegroundColor Green
}

Write-Host ""

# Test 3: Protected endpoints (require authentication)
Write-Host "3. TESTING PROTECTED ENDPOINTS" -ForegroundColor Magenta
Write-Host "=" * 50

if ($token) {
    $authHeaders = @{ "Authorization" = "Bearer $token" }
    
    # Get profile
    Test-Endpoint -Method "GET" -Url "$baseUrl/auth/me" -Description "Get user profile" -Headers $authHeaders
    
    # Get user bookings
    Test-Endpoint -Method "GET" -Url "$baseUrl/bookings" -Description "Get user bookings" -Headers $authHeaders
    
    # Create booking
    $bookingBody = @{
        service_id = 1
        scheduled_date = "2025-10-15"
        scheduled_time = "10:00:00"
        address = "123 Test St, Test City, FL 12345"
        square_meters = 100
        special_instructions = "Test booking"
        billing_address = "123 Billing St"
        billing_city = "Test City"
        billing_state = "FL"
        billing_zip_code = "12345"
    } | ConvertTo-Json
    
    $newBooking = Test-Endpoint -Method "POST" -Url "$baseUrl/bookings" -Description "Create new booking" -Headers $authHeaders -Body $bookingBody -ExpectedStatus 201
} else {
    Write-Host "  Skipping protected endpoint tests - no valid token" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Guest booking endpoints
Write-Host "4. TESTING GUEST BOOKING ENDPOINTS" -ForegroundColor Magenta
Write-Host "=" * 50

$guestBookingBody = @{
    service_id = 1
    guest_name = "John Guest"
    guest_email = "guest@test.com"
    guest_phone = "555-123-4567"
    scheduled_date = "2025-10-16"
    scheduled_time = "14:00:00"
    address = "456 Guest St, Guest City, FL 54321"
    square_meters = 75
    special_instructions = "Guest booking test"
} | ConvertTo-Json

$guestBooking = Test-Endpoint -Method "POST" -Url "$baseUrl/guest/booking" -Description "Create guest booking" -Body $guestBookingBody -ExpectedStatus 201

# Test quote request
$quoteBody = @{
    service_id = 2
    square_meters = 150
    address = "789 Quote St, Quote City, FL 78901"
    special_requirements = "Deep cleaning needed"
    preferred_date = "2025-10-17"
    contact_email = "quote@test.com"
    contact_name = "Quote Requester"
    contact_phone = "555-999-8888"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/quote" -Description "Request quote" -Body $quoteBody -ExpectedStatus 201

# Test contact message
$contactBody = @{
    name = "Contact Test"
    email = "contact@test.com"
    phone = "555-111-2222"
    subject = "Test inquiry"
    message = "This is a test contact message"
    category = "general"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/contact" -Description "Submit contact message" -Body $contactBody -ExpectedStatus 201

Write-Host ""

# Test 5: Admin endpoints  
Write-Host "5. TESTING ADMIN ENDPOINTS" -ForegroundColor Magenta
Write-Host "=" * 50

if ($adminToken) {
    $adminHeaders = @{ "Authorization" = "Bearer $adminToken" }
    
    # Admin booking management
    Test-Endpoint -Method "GET" -Url "$baseUrl/admin/bookings" -Description "Get all bookings (admin)" -Headers $adminHeaders
    
    # Calendar endpoints
    Test-Endpoint -Method "GET" -Url "$baseUrl/admin/calendar/events" -Description "Get calendar events" -Headers $adminHeaders
    Test-Endpoint -Method "GET" -Url "$baseUrl/admin/calendar/stats" -Description "Get booking statistics" -Headers $adminHeaders
    Test-Endpoint -Method "GET" -Url "$baseUrl/admin/calendar/day/2025-10-15" -Description "Get day schedule" -Headers $adminHeaders
    
    # Quote management
    Test-Endpoint -Method "GET" -Url "$baseUrl/admin/quotes" -Description "Get all quotes (admin)" -Headers $adminHeaders
    
    # Contact message management
    Test-Endpoint -Method "GET" -Url "$baseUrl/admin/messages" -Description "Get contact messages (admin)" -Headers $adminHeaders
    
    # Invoice management
    Test-Endpoint -Method "GET" -Url "$baseUrl/admin/invoices" -Description "Get all invoices" -Headers $adminHeaders
    
    # Reports
    Test-Endpoint -Method "GET" -Url "$baseUrl/admin/reports" -Description "Get reports data" -Headers $adminHeaders
    
    # Test service creation (admin only)
    $serviceBody = @{
        name = "Test Service"
        description = "A test cleaning service"
        base_price = 75.00
        duration_hours = 2.5
        service_type = "residential"
    } | ConvertTo-Json
    
    $newService = Test-Endpoint -Method "POST" -Url "$baseUrl/services" -Description "Create new service (admin)" -Headers $adminHeaders -Body $serviceBody -ExpectedStatus 201
    
} else {
    Write-Host "  Skipping admin endpoint tests - no valid admin token" -ForegroundColor Yellow
}

Write-Host ""

# Test 6: Error condition tests
Write-Host "6. TESTING ERROR CONDITIONS" -ForegroundColor Magenta
Write-Host "=" * 50

# Test invalid endpoints
Test-Endpoint -Method "GET" -Url "$baseUrl/nonexistent" -Description "Test non-existent endpoint" -ExpectedStatus 404

# Test protected endpoint without auth
Test-Endpoint -Method "GET" -Url "$baseUrl/auth/me" -Description "Test protected endpoint without auth" -ExpectedStatus 401

# Test admin endpoint without admin role
if ($token) {
    $userHeaders = @{ "Authorization" = "Bearer $token" }
    Test-Endpoint -Method "GET" -Url "$baseUrl/admin/bookings" -Description "Test admin endpoint with user token" -Headers $userHeaders -ExpectedStatus 403
}

Write-Host ""
Write-Host "=== TEST RESULTS SUMMARY ===" -ForegroundColor Cyan
Write-Host ""

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green  
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host ""

if ($errors.Count -gt 0) {
    Write-Host "=== ERRORS FOUND ===" -ForegroundColor Red
    Write-Host ""
    foreach ($error in $errors) {
        Write-Host "• $error" -ForegroundColor Red
    }
    Write-Host ""
}

# Export detailed results to file
$testResults | Export-Csv -Path "api-test-results.csv" -NoTypeInformation
Write-Host "Detailed test results exported to: api-test-results.csv" -ForegroundColor Green

Write-Host ""
Write-Host "Testing completed!" -ForegroundColor Cyan
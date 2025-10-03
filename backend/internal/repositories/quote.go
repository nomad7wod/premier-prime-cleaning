package repositories

import (
	"cleaning-app-backend/internal/database"
	"cleaning-app-backend/internal/models"
	"time"
)

type QuoteRepository struct{}

func (r *QuoteRepository) CreateQuote(quote *models.Quote) error {
	query := `INSERT INTO quotes (service_id, square_meters, address, special_requirements, preferred_date, contact_email, contact_name, contact_phone, estimated_price, status, created_at, updated_at) 
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`

	err := database.DB.QueryRow(
		query,
		quote.ServiceID, quote.SquareMeters, quote.Address, quote.SpecialRequirements,
		quote.PreferredDate, quote.ContactEmail, quote.ContactName, quote.ContactPhone,
		quote.EstimatedPrice, quote.Status, time.Now(), time.Now(),
	).Scan(&quote.ID)

	quote.CreatedAt = time.Now()
	quote.UpdatedAt = time.Now()

	return err
}

func (r *QuoteRepository) GetQuoteByID(id int) (*models.Quote, error) {
	var quote models.Quote
	err := database.DB.QueryRow(
		"SELECT id, service_id, square_meters, address, special_requirements, preferred_date, contact_email, contact_name, contact_phone, estimated_price, status, admin_notes, created_at, updated_at FROM quotes WHERE id=$1",
		id,
	).Scan(&quote.ID, &quote.ServiceID, &quote.SquareMeters, &quote.Address, &quote.SpecialRequirements, &quote.PreferredDate, &quote.ContactEmail, &quote.ContactName, &quote.ContactPhone, &quote.EstimatedPrice, &quote.Status, &quote.AdminNotes, &quote.CreatedAt, &quote.UpdatedAt)

	return &quote, err
}

func (r *QuoteRepository) GetAllQuotes() ([]models.QuoteResponse, error) {
	rows, err := database.DB.Query(
		`SELECT q.id, q.service_id, s.name, q.square_meters, q.address, q.special_requirements, 
		         q.preferred_date, q.contact_email, q.contact_name, q.contact_phone, 
		         q.estimated_price, q.status, COALESCE(q.admin_notes, '') as admin_notes, q.created_at 
		 FROM quotes q 
		 JOIN services s ON q.service_id = s.id 
		 ORDER BY q.created_at DESC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var quotes []models.QuoteResponse
	for rows.Next() {
		var quote models.QuoteResponse
		err := rows.Scan(
			&quote.ID, &quote.ServiceID, &quote.ServiceName, &quote.SquareMeters,
			&quote.Address, &quote.SpecialRequirements, &quote.PreferredDate,
			&quote.ContactEmail, &quote.ContactName, &quote.ContactPhone,
			&quote.EstimatedPrice, &quote.Status, &quote.AdminNotes, &quote.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		quotes = append(quotes, quote)
	}

	return quotes, nil
}

func (r *QuoteRepository) UpdateQuote(quote *models.Quote) error {
	query := `UPDATE quotes SET estimated_price=$1, status=$2, admin_notes=$3, updated_at=$4 WHERE id=$5`

	_, err := database.DB.Exec(
		query,
		quote.EstimatedPrice, quote.Status, quote.AdminNotes, time.Now(), quote.ID,
	)

	return err
}
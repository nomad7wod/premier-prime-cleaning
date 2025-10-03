package repositories

import (
	"cleaning-app-backend/internal/database"
	"cleaning-app-backend/internal/models"
	"time"
)

type ContactRepository struct{}

func (r *ContactRepository) CreateContactMessage(message *models.ContactMessage) error {
	query := `INSERT INTO contact_messages (name, email, phone, subject, message, status, priority, category, created_at, updated_at) 
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`

	err := database.DB.QueryRow(
		query,
		message.Name, message.Email, message.Phone, message.Subject, message.Message,
		message.Status, message.Priority, message.Category, time.Now(), time.Now(),
	).Scan(&message.ID)

	message.CreatedAt = time.Now()
	message.UpdatedAt = time.Now()

	return err
}

func (r *ContactRepository) GetContactMessageByID(id int) (*models.ContactMessage, error) {
	var message models.ContactMessage
	err := database.DB.QueryRow(
		"SELECT id, name, email, phone, subject, message, status, priority, category, admin_notes, assigned_to, created_at, updated_at FROM contact_messages WHERE id=$1",
		id,
	).Scan(&message.ID, &message.Name, &message.Email, &message.Phone, &message.Subject, &message.Message, &message.Status, &message.Priority, &message.Category, &message.AdminNotes, &message.AssignedTo, &message.CreatedAt, &message.UpdatedAt)

	return &message, err
}

func (r *ContactRepository) GetAllContactMessages() ([]models.ContactMessageResponse, error) {
	rows, err := database.DB.Query(
		`SELECT id, name, email, phone, subject, message, status, priority, category, admin_notes, assigned_to, created_at, updated_at 
		 FROM contact_messages 
		 ORDER BY created_at DESC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []models.ContactMessageResponse
	for rows.Next() {
		var message models.ContactMessageResponse
		err := rows.Scan(
			&message.ID, &message.Name, &message.Email, &message.Phone, &message.Subject,
			&message.Message, &message.Status, &message.Priority, &message.Category,
			&message.AdminNotes, &message.AssignedTo, &message.CreatedAt, &message.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}

	return messages, nil
}

func (r *ContactRepository) UpdateContactMessage(message *models.ContactMessage) error {
	query := `UPDATE contact_messages SET status=$1, priority=$2, admin_notes=$3, assigned_to=$4, updated_at=$5 WHERE id=$6`

	_, err := database.DB.Exec(
		query,
		message.Status, message.Priority, message.AdminNotes, message.AssignedTo, time.Now(), message.ID,
	)

	return err
}

func (r *ContactRepository) GetFAQs(category string) ([]models.FAQResponse, error) {
	var query string
	var args []interface{}

	if category != "" {
		query = "SELECT id, question, answer, category, is_active, display_order FROM faqs WHERE category=$1 AND is_active=true ORDER BY display_order, id"
		args = append(args, category)
	} else {
		query = "SELECT id, question, answer, category, is_active, display_order FROM faqs WHERE is_active=true ORDER BY display_order, id"
	}

	rows, err := database.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var faqs []models.FAQResponse
	for rows.Next() {
		var faq models.FAQResponse
		err := rows.Scan(&faq.ID, &faq.Question, &faq.Answer, &faq.Category, &faq.IsActive, &faq.DisplayOrder)
		if err != nil {
			return nil, err
		}
		faqs = append(faqs, faq)
	}

	return faqs, nil
}

func (r *ContactRepository) CreateFAQ(faq *models.FAQ) error {
	query := `INSERT INTO faqs (question, answer, category, is_active, display_order, created_at, updated_at) 
	          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`

	err := database.DB.QueryRow(
		query,
		faq.Question, faq.Answer, faq.Category, faq.IsActive, faq.DisplayOrder,
		time.Now(), time.Now(),
	).Scan(&faq.ID)

	return err
}

func (r *ContactRepository) UpdateFAQ(faq *models.FAQ) error {
	query := `UPDATE faqs SET question=$1, answer=$2, category=$3, is_active=$4, display_order=$5, updated_at=$6 WHERE id=$7`

	_, err := database.DB.Exec(
		query,
		faq.Question, faq.Answer, faq.Category, faq.IsActive, faq.DisplayOrder, time.Now(), faq.ID,
	)

	return err
}

func (r *ContactRepository) DeleteFAQ(id int) error {
	_, err := database.DB.Exec("DELETE FROM faqs WHERE id=$1", id)
	return err
}
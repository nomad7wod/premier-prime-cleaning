package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	ServerPort string `mapstructure:"PORT"`
	DBHost     string `mapstructure:"DB_HOST"`
	DBPort     string `mapstructure:"DB_PORT"`
	DBUser     string `mapstructure:"DB_USER"`
	DBPassword string `mapstructure:"DB_PASSWORD"`
	DBName     string `mapstructure:"DB_NAME"`
	JWTSecret  string `mapstructure:"JWT_SECRET"`
	JWTExpiry  string `mapstructure:"JWT_EXPIRY"`
}

func LoadConfig() (config Config, err error) {
	// Set defaults first
	config.ServerPort = "8080"
	config.DBHost = "postgres"
	config.DBPort = "5432"
	config.DBUser = "postgres" 
	config.DBPassword = "password"
	config.DBName = "cleaning_app"
	config.JWTSecret = "supersecretkeyfordevelopment"
	config.JWTExpiry = "24h"
	
	viper.AutomaticEnv() // Use environment variables
	
	// Override with environment variables if they exist
	if port := viper.GetString("PORT"); port != "" {
		config.ServerPort = port
	}
	if host := viper.GetString("DB_HOST"); host != "" {
		config.DBHost = host
	}
	if dbPort := viper.GetString("DB_PORT"); dbPort != "" {
		config.DBPort = dbPort
	}
	if user := viper.GetString("DB_USER"); user != "" {
		config.DBUser = user
	}
	if password := viper.GetString("DB_PASSWORD"); password != "" {
		config.DBPassword = password
	}
	if dbName := viper.GetString("DB_NAME"); dbName != "" {
		config.DBName = dbName
	}
	if secret := viper.GetString("JWT_SECRET"); secret != "" {
		config.JWTSecret = secret
	}
	if expiry := viper.GetString("JWT_EXPIRY"); expiry != "" {
		config.JWTExpiry = expiry
	}
	
	return config, nil
}

func GetDSN(config Config) string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config.DBHost, config.DBPort, config.DBUser, config.DBPassword, config.DBName)
}
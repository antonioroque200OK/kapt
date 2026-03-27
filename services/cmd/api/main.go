package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/kapt/api/internal/repository"
	_ "github.com/lib/pq"
)

func main() {
	dbSource := os.Getenv("DB_SOURCE")
	if dbSource == "" {
		dbSource = "postgresql://postgres:postgres@db:5432/kapt?sslmode=disable"
	}

	conn, err := sql.Open("postgres", dbSource)
	if err != nil {
		log.Fatalf("failed to open connection: %v", err)
	}
	defer conn.Close()

	if err = conn.Ping(); err != nil {
		log.Fatalf("database unreachable: %v", err)
	}

	fmt.Println("🚀 Kapt API: database connection established!")

	queries := repository.New(conn)
	fmt.Println("✅ SQLC: persistence layer ready.")

	_ = queries
}

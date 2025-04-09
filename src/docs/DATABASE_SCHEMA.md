
# Database Schema

This document is auto-generated and contains the schema information for all tables in the public schema of the database. It is updated through the Schema page in the application.

The Schema page allows you to:
1. View all tables and their columns
2. See column details like data types, nullable status, and default values
3. Download the schema in JSON or Markdown format
4. Refresh the schema information
5. Track schema changes over time
6. Detect and report schema drift

## Keeping Schema Documentation Updated

To update this document:
1. Navigate to the Schema page in the application
2. Click "Refresh Schema" to get the latest database structure
3. Click "Download Markdown"
4. Replace this file with the downloaded content

## Accessing the Schema Page

The Schema page can be accessed at `/schema` in the application. It uses a Supabase Edge Function to safely retrieve database metadata.

## Preventing Schema Drift

The Schema page includes tools to detect when the database schema has changed compared to a saved baseline. This helps ensure that documentation stays in sync with the actual database structure.

To check for schema drift:
1. Navigate to the Schema page
2. Click "Save Baseline" to establish a reference point
3. Later, click "Check Drift" to compare the current schema against the baseline
4. If changes are detected, you'll be prompted to update documentation

## Schema Changes

All schema changes should be documented in `SCHEMA_CHANGELOG.md`. The Schema page provides tools to help identify changes and document them properly.


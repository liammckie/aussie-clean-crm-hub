
# Error Handling & Validation

## Overview
This document outlines the comprehensive error handling and validation approach implemented in the Aussie Clean ERP system. Proper error handling and validation are critical for maintaining data integrity, providing clear user feedback, and ensuring system reliability.

## Validation Patterns

### ABN/ACN Validation

#### Implementation Details
- **Format Validation**: 
  - ABN must be 11 digits with valid checksum
  - ACN must be 9 digits with valid checksum
- **Uniqueness Check**: 
  - System prevents duplicate ABN/ACN entries
  - Validation occurs before database insertion
- **Error Messaging**:
  - Format errors: "Invalid ABN – please enter an 11-digit number with valid checksum"
  - Duplicate errors: "This ABN is already registered to another entity"

#### Technical Implementation
- **Validation Algorithms**: 
  - ABN validation using weighted sum method per ATO specifications
  - ACN validation using ASIC algorithm
- **External Validation** (Optional):
  - Integration with ABR lookup service
  - Business name verification against official register

### Required Fields & Custom Errors

#### Core Principles
- **Field-Specific Validation**: Each field has appropriate validation rules
- **Contextual Error Messages**: Error messages are specific to the field and error type
- **Inline Validation**: Immediate feedback as users enter data
- **Submission Validation**: Comprehensive check before form submission

#### Example Required Fields by Entity
- **Client Entity**:
  - Business Name
  - ABN/ACN
  - Primary Contact Name
  - Primary Contact Email
  - Status

- **Contract Entity**:
  - Start Date
  - End Date
  - Client Reference
  - Scope of Work
  - Assigned Responsible Person

#### Error Message Examples
- Missing client name: "Business name is required for client registration"
- Invalid date range: "Contract end date must be after start date"
- Missing assignment: "Please select an assigned supplier or internal responsible person"

### Business Rules Enforcement

#### Data Integrity Rules
- **Relationship Preservation**:
  - Clients with active Sites/Contracts cannot be deleted
  - Sites with active Contracts cannot be deleted
- **Status Transitions**:
  - Defined state machines for status changes (e.g., Prospect → Active → Archived)
  - Validation of allowed transitions

#### Implementation Approach
- **Soft Deletion**: Records are archived rather than physically deleted
- **Cascading Archives**: Option to archive related entities
- **Validation Messages**:
  - "Client cannot be deleted while it has active sites or contracts"
  - "Please archive or reassign associated records first"

#### Technical Enforcement
- **Database Constraints**: Foreign key constraints prevent orphaned records
- **Application Logic**: Business rules enforced at service layer
- **API Validation**: Rules checked before database operations

## Audit Logging

### Audit Record Structure
- **Timestamp**: When the change occurred
- **User Identifier**: Who made the change
- **Entity Type**: What type of record was changed
- **Entity ID**: Which specific record was affected
- **Action Type**: Create, Update, Delete, Archive, etc.
- **Field Changes**: Old and new values for changed fields
- **IP Address**: Source of the change request
- **Application Context**: Web interface, API, etc.

### Implementation Details
- **Storage**: Immutable audit table separate from operational data
- **Retention**: 7+ years retention to comply with Australian regulations
- **Query Interface**: Administrative tools to search and filter audit logs

### Technical Approach
- **Trigger-Based**: Database triggers for capturing all data changes
- **Service Layer**: Application logic for recording complex operations
- **Automatic Capture**: Changes tracked without requiring explicit logging code

## User Feedback & Exception Handling

### Frontend Validation
- **Real-Time Validation**: Immediate feedback during data entry
- **Form-Level Validation**: Comprehensive check before submission
- **Visual Cues**: Clear indication of errors (red highlights, icons)
- **Accessibility**: Error messages compatible with screen readers

### Backend Validation
- **API Validation Layer**: Validates all incoming requests
- **Service Validation**: Business rule validation in service layer
- **Database Constraints**: Final safeguard at database level

### Exception Handling Strategy
- **Structured Responses**: Consistent error response format
- **Error Categorization**:
  - Validation Errors: User-correctable input problems
  - Business Rule Violations: Process or state-based restrictions
  - System Errors: Internal failures requiring technical support
- **Logging Levels**:
  - Validation issues logged at INFO level
  - Business rule violations at WARNING level
  - System errors at ERROR level with stack traces

### User Communication
- **Friendly Messages**: Technical details translated to user-friendly wording
- **Actionable Guidance**: Clear instructions on how to resolve issues
- **Recovery Options**: Suggested next steps when errors occur

## Integration Error Handling

### Xero Integration Errors
- **Connection Issues**: "Unable to connect to Xero. Your data is saved locally and will sync when connection is restored."
- **Validation Failures**: "Invoice couldn't be created in Xero due to missing required field: [Field Name]"
- **Conflict Resolution**: "This invoice has been modified in Xero since last sync. Please review changes before proceeding."

### Document Storage Integration Errors
- **Upload Failures**: "Document upload to [Storage System] failed. The document is saved locally and will be uploaded when connection is restored."
- **Permission Issues**: "You don't have permission to access this document in [Storage System]."
- **Synchronization Errors**: "Document versions are out of sync. Please download the latest version before making changes."

### Recovery Mechanisms
- **Queued Operations**: Failed operations queued for retry
- **Exponential Backoff**: Increasing delay between retry attempts
- **Manual Override**: Options for administrators to force operations
- **Synchronization Tools**: Utilities to reconcile data between systems

## Technical Implementation Guide

### Validation Framework
- **Centralized Validation**: Core validation library used across the application
- **Rule Definitions**: Declarative validation rules for entities
- **Custom Validators**: Framework for business-specific validation logic

### Error Handling Best Practices
- **Try-Catch Patterns**: Strategic exception handling around critical operations
- **Promise Rejection Handling**: Proper handling of async/await exceptions
- **Global Error Handlers**: Catching uncaught exceptions at application boundaries
- **Error Boundaries**: Component-level error containment for UI

### Logging and Monitoring
- **Structured Logging**: JSON-formatted logs with consistent fields
- **Correlation IDs**: Request tracking across system components
- **Error Aggregation**: Dashboard for monitoring error rates and patterns
- **Alerting**: Notifications for critical error conditions

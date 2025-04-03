
# Automated Workflows & Activity Feed

## Overview
The Aussie Clean ERP incorporates a workflow engine to automate business processes and maintain a centralized activity feed of system events. This architecture enables proactive notifications, process automation, and transparency across the organization.

## Workflow Engine

### Core Components
- **Trigger System**: Monitors for specific conditions or events
- **Rule Engine**: Evaluates conditions and determines actions
- **Action Executor**: Performs defined actions when conditions are met
- **Notification System**: Delivers alerts via appropriate channels

### Implementation Methods
- **Database Triggers**: For data-change events requiring immediate action
- **Scheduled Jobs**: For time-based or periodic checks (nightly, hourly)
- **Observer Pattern**: Application-level event monitoring and handling

## Common Workflow Scenarios

### Contract Expiry Workflow
1. **Trigger**: 30 days before contract end date
2. **Actions**:
   - Create "Contract Expiry Reminder" event in Activity Feed
   - Send email notification to account manager
   - Update contract status to "Pending Renewal"
3. **Follow-up**: If no action after 7 days, escalate to manager

### Supplier Assignment Change
1. **Trigger**: Contract supplier assignment modified
2. **Actions**:
   - Log change in audit trail
   - Create Activity Feed entry (e.g., "Supplier for Contract X changed from Company A to Company B effective [date]")
   - Notify affected parties (contract manager, previous supplier, new supplier)
   - Update relevant financial projections

### Incident Report Workflow
1. **Trigger**: Field staff submits incident report via Quick Form
2. **Actions**:
   - Create high-priority Activity Feed entry
   - Notify safety officer and site manager immediately
   - Create follow-up task for incident investigation
   - Track incident resolution through status updates

## Activity Feed System

### Purpose
The Activity Feed serves as a centralized, chronological log of notable events across the ERP system, providing users with awareness of relevant activities and pending actions.

### Feed Components
- **Entry Types**: 
  - System Events (automated notifications)
  - User Actions (manual entries, approvals)
  - External Events (integration notifications)
- **Entry Attributes**:
  - Timestamp
  - Source/Originator
  - Type/Category
  - Severity/Priority
  - Related Entities (Client, Site, Contract)
  - Action Links (where applicable)

### Visibility Controls
- **Role-Based Filtering**: Users see only events relevant to their role
- **Entity-Based Filtering**: Option to view events for specific clients/sites/contracts
- **Customizable Views**: Users can configure personal activity feed preferences
- **Notification Settings**: Control which events generate push notifications

### Integration with UI
- **Dashboard Widget**: Activity feed summary on main dashboard
- **Dedicated Feed Page**: Complete activity history with advanced filtering
- **Contextual Feeds**: Entity-specific feeds on client/site/contract detail pages
- **Mobile Notifications**: Push alerts for high-priority items

## Technical Implementation

### Data Model
- **Events Table**: Stores all activity events with appropriate metadata
- **Subscription Model**: Maps users to event types they should receive
- **Read Status Tracking**: Monitors which events have been seen by users

### Scalability Considerations
- **Event Throttling**: Prevents feed flooding from high-frequency events
- **Archiving Strategy**: Older events moved to archive storage
- **Indexing**: Optimized for rapid filtering and retrieval

### Extensibility
- **Pluggable Event Types**: Framework for adding new event types
- **Custom Workflow Creation**: Admin interface for defining new workflows
- **API Access**: Endpoints for integrating external systems with the feed

## Audit and Compliance
- **Immutable Event Records**: Events cannot be deleted or modified after creation
- **Retention Policies**: Events maintained according to compliance requirements
- **Export Capability**: Activity feed data can be exported for audits

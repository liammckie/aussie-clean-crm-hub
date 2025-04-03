
# Client Portal UI Components

## Primary Views

### 1. Dashboard
- **Overview Metrics Panel**
  - Sites overview with count and status indicators
  - QA performance summary with trend indicators
  - Open service requests count with priority breakdown
  - Upcoming workbill count for next 7 days
  - Expiring contracts and documents alerts
  
- **Quick Action Buttons**
  - New Service Request
  - View Recent QA Reports
  - Download Documents
  - View Workbill Schedule
  
- **Activity Timeline**
  - Chronological feed of recent portal activities
  - Filterable by activity type
  - Expandable details for each activity

- **Site Filter Dropdown**
  - Global filter affecting all dashboard widgets
  - Multiple site selection support
  - "All Sites" default option for full view

### 2. Contract View
- **Contract List Grid**
  - Sortable/filterable table of all client contracts
  - Status indicators (Active, Expiring, Expired)
  - Quick view of key contract details
  - Export to Excel/PDF functionality
  
- **Contract Detail View**
  - Tabbed interface for contract information:
    - Overview: key contract attributes
    - Sites: linked service locations
    - Scope: detailed service specifications
    - Documents: attached files and historical versions
    - Financial: billing information and history
    - Performance: QA scores and trends
  
- **Contract Timeline Visualization**
  - Graphical representation of contract duration
  - Milestone markers for key dates (renewals, reviews)
  - CPI adjustment indicators

### 3. Workbill Schedule
- **Calendar View**
  - Month/week/day toggle options
  - Color-coded by service type
  - Hover tooltips with workbill summary
  - Print/export functionality
  
- **List View Alternative**
  - Chronological table of upcoming workbills
  - Filtering by date range, site, service type
  - Status indicators (Scheduled, Completed, Missed)
  
- **Workbill Detail Modal**
  - Comprehensive workbill information
  - Assigned staff details
  - Completion status and timestamps
  - Attachments and completion notes
  - Historical completion record

### 4. Service Request Management
- **Request Creation Form**
  - Step-by-step wizard interface
  - Site selection with search
  - Category and subcategory dropdowns
  - Rich text description editor
  - Drag-and-drop attachment uploader
  - Priority selection with guidance
  
- **Request Tracking Board**
  - Kanban-style view of requests by status
  - Card-based representation with priority indicators
  - Quick filters for common views
  - Search functionality
  
- **Request Detail View**
  - Status history timeline
  - Comment thread with user attribution
  - File attachment gallery
  - Resolution details
  - Related service requests

### 5. Quality Audits
- **Audit Report List**
  - Sortable grid of completed audits
  - Visual score indicators (color-coded)
  - Approval status badges
  - Date and auditor information
  
- **Audit Detail View**
  - Section scores with expandable details
  - Pass/fail indicators for individual items
  - Image gallery of site conditions
  - Client approval/dispute section
  - Historical comparison to previous audits
  
- **Performance Dashboard**
  - Trend charts for quality scores
  - Benchmark comparisons
  - Common deficiency analysis
  - Performance by category breakdown

### 6. Document Repository
- **Document Explorer**
  - Folder-based organization by category and site
  - Search with advanced filtering
  - Grid and list view options
  - Version history access
  
- **Document Preview**
  - In-browser preview for supported file types
  - Download options (original, watermarked)
  - Sharing controls (if permitted)
  - Metadata display panel
  
- **Upload Area**
  - Drag-and-drop functionality
  - Batch uploading support
  - Progress indicators
  - Metadata input form
  - Version control options

### 7. Financial Center
- **Invoice Dashboard**
  - Outstanding balance summary
  - Aging receivables visualization
  - Recent transaction history
  - Payment method management
  
- **Invoice List**
  - Comprehensive grid of all invoices
  - Status indicators (Paid, Outstanding, Overdue)
  - Sort/filter options
  - Batch actions (download, pay)
  
- **Invoice Detail**
  - Line item breakdown
  - Payment history
  - PDF viewer
  - Payment options
  - Dispute mechanism for billing issues

### 8. Staff Compliance
- **Staff Assignment Grid**
  - List of personnel assigned to client sites
  - Compliance status indicators
  - Training completion percentages
  - Certification expiry warnings
  
- **Staff Detail View (Read-only)**
  - Personal details (limited to role/position)
  - Training history and certifications
  - Site assignment history
  - Attendance record summary
  
- **Compliance Dashboard**
  - Overall compliance percentage
  - Certification status by category
  - Training completion metrics
  - Attendance performance

### 9. User Management
- **User Directory**
  - List of all portal users for the client
  - Role and permission indicators
  - Last login timestamps
  - Status badges (Active, Inactive)
  
- **User Creation/Edit Form**
  - Personal information fields
  - Role selection dropdown
  - Site assignment manager (for SiteManager role)
  - Permission customization
  - Account status toggle
  
- **Password Management**
  - Reset password mechanism
  - Force password change option
  - Security question management

## Interactive Components

### Notification Center
- **Notification Dropdown**
  - Categorized notification list
  - Read/unread indicators
  - Quick actions from notifications
  - "Mark all as read" option
  
- **Notification Preferences**
  - Email notification settings
  - Notification type toggles
  - Frequency controls

### Global Search
- **Search Bar**
  - Type-ahead suggestions
  - Category-specific search options
  - Recent searches history
  
- **Search Results Page**
  - Categorized results presentation
  - Filtering options
  - Relevance sorting
  - Actionable result cards

### Help & Support
- **Contextual Help**
  - Page-specific help buttons
  - Tooltip guides for complex features
  - Walkthrough tutorials
  
- **Support Request Form**
  - Category selection
  - Description field
  - Screenshot attachment option
  - Submission tracking

### Profile Management
- **Profile Card**
  - User details display
  - Profile picture
  - Role indicator
  - Last activity timestamp
  
- **Settings Panel**
  - Personal information editor
  - Password change form
  - Notification preferences
  - Theme selection (Light/Dark mode)

## Mobile Adaptations

### Responsive Behaviors
- All views adapt to screen size with appropriate layout changes
- Critical actions remain accessible on mobile interfaces
- Simplified navigation for small screens
- Touch-friendly controls with appropriate sizing

### Mobile-Specific Components
- **Bottom Navigation Bar**
  - Quick access to key features
  - Current view indicator
  - Notification badge
  
- **Pull-to-Refresh**
  - Manual data refresh on list views
  - Loading indicator
  
- **Swipe Actions**
  - Swipe to delete/archive
  - Swipe to reveal quick actions
  - Gesture-based navigation

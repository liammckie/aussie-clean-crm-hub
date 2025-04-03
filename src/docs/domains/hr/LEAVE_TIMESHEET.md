
# Leave & Timesheet Management

## Leave Management

### Leave Types
- **Annual Leave**: Standard vacation time
- **Personal/Carer's Leave**: Sick leave and carer responsibilities
- **Compassionate Leave**: Bereavement or family emergency
- **Long Service Leave**: Extended leave for long-term employees
- **Parental Leave**: Maternity, paternity, or adoption leave
- **Study Leave**: Education and professional development
- **Time in Lieu**: Compensatory time for overtime
- **Unpaid Leave**: Approved absence without pay

### Leave Request Process
1. **Submission**
   - Employee creates leave request via portal
   - Specifies date range, hours, and leave type
   - Provides reason or supporting documentation
   - System validates against available balance

2. **Approval Workflow**
   - Request routed to direct manager
   - Manager reviews and approves/declines
   - HR final review for policy compliance
   - Notification of decision to employee

3. **Processing**
   - Approved leave updated in employee record
   - Leave balance adjusted automatically
   - Scheduler updated to block availability
   - Leave added to team calendar

4. **Employment Hero Integration**
   - Leave request synchronized to EH
   - Leave balance updated from EH
   - Approval status synchronized
   - Payroll impact calculated

### Leave Balance Management
- Real-time balance calculation
- Accrual based on employment type and length of service
- Pro-rata calculations for part-time employees
- Leave liability reporting
- Historical leave usage tracking
- Balance adjustments with approval workflow

### Leave Calendar
- Team view of scheduled absences
- Resource planning tool
- Conflict identification
- Public holiday integration
- Leave pattern analysis

## Timesheet Management

### Timesheet Capture Methods
- **Staff Portal Entry**: Web-based manual entry
- **Mobile App**: Location-aware clock in/out
- **QR Code Scanning**: Site-based time recording
- **Kiosk Mode**: Shared device at work locations
- **Employment Hero Sync**: Imported from EH platform

### Timesheet Workflow
1. **Time Recording**
   - Employee records work hours via preferred method
   - System captures start/end times and breaks
   - Location data optionally recorded for verification
   - Association with site, client, or cost center

2. **Submission**
   - Employee reviews and submits timesheet
   - System validates against scheduled hours
   - Flags exceptions (overtime, missing breaks)
   - Routes for appropriate approval

3. **Approval Process**
   - Supervisor reviews timesheet entries
   - Approves or requests corrections
   - System validates against business rules
   - Approved timesheets marked for payroll

4. **Integration & Processing**
   - Approved time synchronized to Employment Hero
   - Payroll calculations applied based on Award rules
   - Cost allocation to appropriate accounts
   - Billing data fed to invoicing system for billable time

### Award Interpretation
- Integration with Award Compliance Engine
- Automatic application of penalty rates
- Overtime calculation based on award rules
- Allowance eligibility determination
- Employment type differentiation

### Location Verification
- GPS validation of clock in/out location
- Geofence parameters for valid work locations
- Exception reporting for location mismatches
- Manual override with approval workflow

### Reporting & Analytics
- Hours worked by employee, team, or department
- Overtime analysis and trending
- Utilization reporting
- Labor cost analysis by client/site
- Comparison of actual vs. scheduled hours
- Absence pattern detection

## Integration Points

### Scheduler Integration
- Leave visibility in scheduling interface
- Availability constraints from approved leave
- Timesheet validation against scheduled shifts
- Shift swapping and cover management

### Award Engine Integration
- Rate determination based on shift time/day
- Penalty calculation for non-standard hours
- Allowance eligibility assessment
- Employment type rate differentiation

### Payroll Processing
- Approved timesheet export to payroll system
- Leave payment calculation
- Tax and superannuation processing
- Payment recording and pay slip generation

### Employment Hero Sync
- Bidirectional synchronization of leave requests
- Timesheet data exchange
- Balance updates and accruals
- Approval status synchronization

## UI Components

### Employee Leave Dashboard
- Current leave balances by type
- Upcoming approved leave
- Request history and status
- Team absence calendar

### Leave Request Form
- Date range selector with calendar interface
- Leave type dropdown with balance display
- Reason field and document upload
- Real-time validation feedback

### Timesheet Entry Interface
- Daily or weekly view options
- Quick entry patterns for regular schedules
- Break recording functionality
- Project/task association
- Mobile-optimized version

### Manager Approval Dashboard
- Pending approvals queue
- Batch approval capabilities
- Exception highlighting
- Team timesheet overview
- Historical approval records

## Compliance & Audit Features

### Leave Compliance
- Minimum leave requirements tracking
- Excessive leave accumulation alerts
- Mandatory leave enforcement
- Leave entitlement calculation audit trail

### Timesheet Compliance
- Minimum break enforcement
- Maximum hours worked alerts
- Record keeping for statutory requirements
- Edit history and change tracking
- Approval audit trail

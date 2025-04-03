
import { ErrorReporting } from "@/utils/errorReporting";
import { User } from "../types";

/**
 * Activity types that can be tracked in the system
 */
export enum ActivityType {
  LOGIN = "login",
  LOGOUT = "logout",
  CREATE_ENTITY = "create_entity",
  UPDATE_ENTITY = "update_entity",
  DELETE_ENTITY = "delete_entity",
  VIEW_ENTITY = "view_entity",
  EXPORT_DATA = "export_data",
  SETTINGS_CHANGE = "settings_change",
  PERMISSION_CHANGE = "permission_change",
  BULK_OPERATION = "bulk_operation",
  SYSTEM_ACTION = "system_action",
}

/**
 * Entity types that can be tracked
 */
export enum EntityType {
  USER = "user",
  CLIENT = "client",
  CONTRACT = "contract",
  WORK_ORDER = "work_order",
  INVOICE = "invoice",
  PAYMENT = "payment",
  QUOTE = "quote",
  SITE = "site",
  DOCUMENT = "document",
  REPORT = "report",
  SYSTEM = "system",
}

/**
 * Interface for an activity entry
 */
export interface ActivityEntry {
  id: string;
  userId: string;
  timestamp: string;
  activityType: ActivityType;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Input for creating an activity entry
 */
export interface CreateActivityInput {
  userId: string;
  activityType: ActivityType;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Service for tracking user activities in the system
 */
export class ActivityTrackingService {
  private static instance: ActivityTrackingService;
  private activities: ActivityEntry[] = [];
  private isEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): ActivityTrackingService {
    if (!ActivityTrackingService.instance) {
      ActivityTrackingService.instance = new ActivityTrackingService();
    }
    return ActivityTrackingService.instance;
  }

  /**
   * Enable or disable activity tracking
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Track a user activity
   */
  public async trackActivity(input: CreateActivityInput): Promise<ActivityEntry | null> {
    if (!this.isEnabled) return null;

    try {
      const activity: ActivityEntry = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        ...input
      };

      this.activities.push(activity);

      // In a real implementation, this would save to a database
      console.log("Activity tracked:", activity);

      // Log to Sentry for visibility in development
      if (import.meta.env.DEV) {
        ErrorReporting.addBreadcrumb({
          category: 'activity',
          message: `User ${input.userId} performed ${input.activityType} on ${input.entityType}${input.entityId ? ` (ID: ${input.entityId})` : ''}`,
          level: 'info',
          data: input.details
        });
      }

      return activity;
    } catch (error) {
      ErrorReporting.captureException(error as Error, { 
        context: 'ActivityTrackingService.trackActivity',
        input 
      });
      return null;
    }
  }

  /**
   * Get activities for a specific user
   */
  public async getUserActivities(userId: string): Promise<ActivityEntry[]> {
    try {
      return this.activities.filter(activity => activity.userId === userId);
    } catch (error) {
      ErrorReporting.captureException(error as Error, { 
        context: 'ActivityTrackingService.getUserActivities',
        userId
      });
      return [];
    }
  }

  /**
   * Get activities for a specific entity
   */
  public async getEntityActivities(entityType: EntityType, entityId: string): Promise<ActivityEntry[]> {
    try {
      return this.activities.filter(
        activity => activity.entityType === entityType && activity.entityId === entityId
      );
    } catch (error) {
      ErrorReporting.captureException(error as Error, { 
        context: 'ActivityTrackingService.getEntityActivities',
        entityType,
        entityId
      });
      return [];
    }
  }

  /**
   * Get recent activities across the system
   */
  public async getRecentActivities(limit: number = 100): Promise<ActivityEntry[]> {
    try {
      // Sort by timestamp descending and limit results
      return [...this.activities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      ErrorReporting.captureException(error as Error, { 
        context: 'ActivityTrackingService.getRecentActivities',
        limit
      });
      return [];
    }
  }

  /**
   * Helper method to generate a simple ID
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  /**
   * Track a login activity
   */
  public async trackLogin(user: User, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.trackActivity({
      userId: user.id,
      activityType: ActivityType.LOGIN,
      entityType: EntityType.USER,
      entityId: user.id,
      ipAddress,
      userAgent,
      details: {
        role: user.role,
        email: user.email,
      }
    });
  }

  /**
   * Track a logout activity
   */
  public async trackLogout(user: User, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.trackActivity({
      userId: user.id,
      activityType: ActivityType.LOGOUT,
      entityType: EntityType.USER,
      entityId: user.id,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Track entity creation
   */
  public async trackEntityCreation(
    user: User,
    entityType: EntityType,
    entityId: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.trackActivity({
      userId: user.id,
      activityType: ActivityType.CREATE_ENTITY,
      entityType,
      entityId,
      details
    });
  }

  /**
   * Track entity update
   */
  public async trackEntityUpdate(
    user: User,
    entityType: EntityType,
    entityId: string,
    changes?: Record<string, any>
  ): Promise<void> {
    await this.trackActivity({
      userId: user.id,
      activityType: ActivityType.UPDATE_ENTITY,
      entityType,
      entityId,
      details: { changes }
    });
  }

  /**
   * Track entity deletion
   */
  public async trackEntityDeletion(
    user: User,
    entityType: EntityType,
    entityId: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.trackActivity({
      userId: user.id,
      activityType: ActivityType.DELETE_ENTITY,
      entityType,
      entityId,
      details
    });
  }

  /**
   * Track permission changes
   */
  public async trackPermissionChange(
    user: User,
    targetUserId: string,
    oldPermissions: string[],
    newPermissions: string[]
  ): Promise<void> {
    const added = newPermissions.filter(p => !oldPermissions.includes(p));
    const removed = oldPermissions.filter(p => !newPermissions.includes(p));

    await this.trackActivity({
      userId: user.id,
      activityType: ActivityType.PERMISSION_CHANGE,
      entityType: EntityType.USER,
      entityId: targetUserId,
      details: {
        added,
        removed,
        byUser: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    });
  }
}

// Export singleton instance
export const activityService = ActivityTrackingService.getInstance();


import * as Sentry from "@sentry/react";
import { AppLogger, LogCategory } from "./logging";

type UserInfo = {
  id: string;
  email?: string;
  username?: string;
};

class ErrorReportingService {
  // Public property to allow checking initialization status
  public isInitialized = false;
  private isEnabled = true;

  /**
   * Initialize error reporting service
   */
  init() {
    if (this.isInitialized) return;

    try {
      // Already initialized in sentry.tsx
      this.isInitialized = true;
      AppLogger.info(LogCategory.SYSTEM, "Error reporting initialized", {
        _type: typeof Sentry,
        value: Sentry.toString()
      });
    } catch (error) {
      console.error("Failed to initialize error reporting:", error);
    }
  }

  /**
   * Set user information for error reports
   */
  setUser(user: UserInfo | null) {
    if (!this.isInitialized) {
      console.warn("Error reporting not initialized");
      return;
    }

    try {
      if (user) {
        Sentry.setUser({
          id: user.id,
          email: user.email,
          username: user.username,
        });
        AppLogger.info(LogCategory.SYSTEM, "Error reporting user context updated", {
          userId: user.id
        });
      } else {
        Sentry.setUser(null);
        AppLogger.info(LogCategory.SYSTEM, "Error reporting user context updated: cleared");
      }
    } catch (error) {
      console.error("Failed to set user for error reporting:", error);
    }
  }

  /**
   * Enable or disable error reporting
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    AppLogger.info(LogCategory.SYSTEM, `Error reporting ${enabled ? 'enabled' : 'disabled'}`);
    
    // Update Sentry configuration if initialized
    if (this.isInitialized) {
      try {
        Sentry.configureScope(scope => {
          scope.setTag('error_reporting_enabled', String(enabled));
        });
      } catch (error) {
        console.error("Failed to update Sentry configuration:", error);
      }
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, extraInfo: Record<string, any> = {}) {
    if (!this.isInitialized || !this.isEnabled) {
      console.error("Error reporting not initialized or disabled, error:", error, extraInfo);
      return;
    }

    try {
      Sentry.withScope((scope) => {
        Object.entries(extraInfo).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
        Sentry.captureException(error);
      });
    } catch (sentryError) {
      console.error("Failed to capture exception:", sentryError);
      console.error("Original error:", error);
    }
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: Sentry.SeverityLevel = "info", extraInfo: Record<string, any> = {}) {
    if (!this.isInitialized || !this.isEnabled) {
      console.warn("Error reporting not initialized or disabled, message:", message, extraInfo);
      return;
    }

    try {
      Sentry.withScope((scope) => {
        scope.setLevel(level);
        Object.entries(extraInfo).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
        Sentry.captureMessage(message);
      });
    } catch (error) {
      console.error("Failed to capture message:", error);
    }
  }

  /**
   * Capture user feedback
   */
  captureFeedback(feedback: string, category: string = "general", extraInfo: Record<string, any> = {}) {
    if (!this.isInitialized || !this.isEnabled) {
      console.warn("Error reporting not initialized or disabled, feedback not captured");
      return;
    }

    try {
      // Log the feedback
      AppLogger.info(LogCategory.SYSTEM, "User feedback captured", {
        feedback,
        category,
        ...extraInfo
      });
      
      // Send to Sentry as a message with feedback category
      this.captureMessage(`User Feedback [${category}]: ${feedback}`, "info", {
        feedbackCategory: category,
        ...extraInfo
      });
    } catch (error) {
      console.error("Failed to capture feedback:", error);
    }
  }
}

export const ErrorReporting = new ErrorReportingService();

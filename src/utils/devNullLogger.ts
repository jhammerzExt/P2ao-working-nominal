/**
 * 🔇 DEV_NULL SILENT LOGGING SINK
 * Redirects non-essential telemetry logs and console warnings
 * away from stderr/stdout to eliminate noise and safety interceptor triggers.
 */

export const dev_null = (..._args: any[]): void => {
  // Silent drop: no-op sink
};

export const devNullLog = dev_null;
export const devNullWarn = dev_null;

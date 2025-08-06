export interface INotificationService {
  success(message: string): void;
  error(message: string): void;
  info(message: string): void;
  warning(message: string): void;
}

export class NotificationService implements INotificationService {
  success(message: string): void {
    // You can implement toast notifications here
    console.log("Success:", message);
  }

  error(message: string): void {
    // You can implement toast notifications here
    console.error("Error:", message);
  }

  info(message: string): void {
    // You can implement toast notifications here
    console.info("Info:", message);
  }

  warning(message: string): void {
    // You can implement toast notifications here
    console.warn("Warning:", message);
  }
}

export interface INotificationService {
  success(message: string): void;
  error(message: string): void;
  info(message: string): void;
  warning(message: string): void;
}

export class NotificationService implements INotificationService {
  success(message: string): void {
    console.log("Success:", message);
  }
  error(message: string): void {
    console.error("Error:", message);
  }
  info(message: string): void {
    console.info("Info:", message);
  }
  warning(message: string): void {
    console.warn("Warning:", message);
  }
}

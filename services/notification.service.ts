export interface INotificationService {
  success(message: string): void
  error(message: string): void
  warning(message: string): void
  info(message: string): void
}

export class NotificationService implements INotificationService {
  success(message: string): void {
    // In a real app, you might use a toast library like react-hot-toast
    console.log("SUCCESS:", message)
    // toast.success(message)
  }

  error(message: string): void {
    console.error("ERROR:", message)
    // toast.error(message)
  }

  warning(message: string): void {
    console.warn("WARNING:", message)
    // toast.warning(message)
  }

  info(message: string): void {
    console.info("INFO:", message)
    // toast.info(message)
  }
}

export const ValidateMessage = ({ message }: { message?: string }) =>
  message ? <div className="text-red-500 mt-1 text-sm">{message}</div> : null;
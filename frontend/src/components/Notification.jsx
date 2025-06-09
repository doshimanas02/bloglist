import { useSelector } from 'react-redux'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal, AlertCircle } from 'lucide-react'

const Notification = () => {
  const notificationEvent = useSelector((state) => state.notification)
  const styles = {
    position: 'fixed',
    display: notificationEvent.message ? 'block' : 'none',
  }
  return (
    <div className="m-auto bottom-10 right-0 left-0 w-3xl animate" style={styles} data-testid="notification">
      <Alert variant={notificationEvent.success ? '' : 'destructive'}>
        {notificationEvent.success ? (
          <Terminal className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>{notificationEvent.message}</AlertDescription>
      </Alert>
    </div>
  )
}

export default Notification

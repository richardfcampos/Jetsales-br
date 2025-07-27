'use client';

import { 
  useHomeState, 
  useHomeLayout, 
  useMessageSender 
} from '@/hooks';
import { 
  MessageForm, 
  MessageResponse, 
  ConnectionStatus, 
  LoadingSpinner 
} from '@/components';

export default function Home() {
  const { status, isLoading } = useHomeState();
  const {
    phone,
    message,
    isLoading: sendingMessage,
    response,
    error,
    setPhone,
    setMessage,
    sendMessage,
  } = useMessageSender();

  const {
    containerClasses,
    wrapperClasses,
    headerClasses,
    titleClasses,
    subtitleClasses,
    cardClasses,
    statusClasses,
    statusTextClasses,
    statusPhoneClasses,
  } = useHomeLayout();

  // Show loading while checking status
  if (isLoading) {
    return <LoadingSpinner message="Checking connection..." />;
  }

  return (
    <div className={containerClasses}>
      <div className={wrapperClasses}>
        <div className={headerClasses}>
          <h1 className={titleClasses}>
            WhatsApp Message Sender
          </h1>
          <p className={subtitleClasses}>
            Send messages via WhatsApp using our API
          </p>
          
          <ConnectionStatus
            phone={status.phone}
            statusClasses={statusClasses}
            statusTextClasses={statusTextClasses}
            statusPhoneClasses={statusPhoneClasses}
          />
        </div>

        <div className={cardClasses}>
          <MessageForm
            phone={phone}
            message={message}
            isLoading={sendingMessage}
            onPhoneChange={setPhone}
            onMessageChange={setMessage}
            onSubmit={sendMessage}
          />

          <MessageResponse response={response} error={error} />
        </div>
      </div>
    </div>
  );
}

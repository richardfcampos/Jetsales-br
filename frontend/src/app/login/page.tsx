'use client';

import { 
  useLoginState, 
  useLoginLayout 
} from '@/hooks';
import { 
  ErrorDisplay, 
  QRCodeSection, 
  InstructionsSection, 
  LoadingSpinner 
} from '@/components';

export default function LoginPage() {
  const { 
    qrCode, 
    isLoading, 
    error, 
    getQRCode, 
    shouldShowLoading, 
    isRedirecting 
  } = useLoginState();
  
  const {
    containerClasses,
    wrapperClasses,
    headerClasses,
    titleClasses,
    subtitleClasses,
    cardClasses,
  } = useLoginLayout();

  // Show loading states
  if (shouldShowLoading) {
    return <LoadingSpinner message="Checking connection..." />;
  }

  if (isRedirecting) {
    return <LoadingSpinner message="Redirecting..." />;
  }

  return (
    <div className={containerClasses}>
      <div className={wrapperClasses}>
        <div className={headerClasses}>
          <h1 className={titleClasses}>
            WhatsApp Login
          </h1>
          <p className={subtitleClasses}>
            Scan the QR code with your WhatsApp app to connect
          </p>
        </div>

        <div className={cardClasses}>
          <ErrorDisplay error={error} />
          
          <QRCodeSection
            qrCode={qrCode}
            isLoading={isLoading}
            onGetQRCode={getQRCode}
          />

          <InstructionsSection />
        </div>
      </div>
    </div>
  );
} 